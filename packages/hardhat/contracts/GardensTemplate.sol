pragma solidity 0.4.24;

import "@aragon/templates-shared/contracts/BaseTemplate.sol";
import "./external/IHookedTokenManager.sol";
import "./external/IIssuance.sol";
import "./external/IConvictionVoting.sol";
import "./external/Agreement.sol";
import "./external/DisputableVoting.sol";
import "./external/IHoneyswapRouter.sol";
import "./external/IPriceOracle.sol";
import "./external/IIncentivisedPriceOracleFactory.sol"; // This lives in the uniswap-v2-periphery/contracts/examples repo (it should be moved to its own repo)
import "./external/ICollateralRequirementUpdaterFactory.sol"; // This lives in the agreements repo
import "./external/ICollateralRequirementUpdater.sol"; // This lives in the agreements repo
import "./external/IUniswapV2Factory.sol";
import "./appIds/AppIdsXDai.sol";

contract GardensTemplate is BaseTemplate, AppIdsXDai {
    string private constant ERROR_MISSING_MEMBERS = "MISSING_MEMBERS";
    string private constant ERROR_BAD_VOTE_SETTINGS = "BAD_SETTINGS";
    string private constant ERROR_EXISTING_TOKEN = "EXISTING_TOKEN";
    string private constant ERROR_NO_CACHE = "NO_CACHE";
    string private constant ERROR_NO_TOLLGATE_TOKEN = "NO_TOLLGATE_TOKEN";

    bool private constant TOKEN_TRANSFERABLE = true;
    uint8 private constant TOKEN_DECIMALS = uint8(18);
    uint256 private constant TOKEN_MAX_PER_ACCOUNT = uint256(-1);
    address private constant ANY_ENTITY = address(-1);
    uint8 private constant ORACLE_PARAM_ID = 203;
    uint256 public constant AVERAGE_PRICE_PERIOD = 86400; // 24 hours
    uint8 public constant UPDATE_FREQUENCY = 8; // 8 times within price period
    uint256 public constant UPDATE_PERCENT_REWARD = 2e16; // 2% reward per update call
    address private constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    uint256 public constant XDAI_IN_HNY_REQUIRED_FOR_NEW_TOKEN = 100e18;
    enum Op {NONE, EQ, NEQ, GT, LT, GTE, LTE, RET, NOT, AND, OR, XOR, IF_ELSE}

    struct DeployedContracts {
        Kernel dao;
        ACL acl;
        DisputableVoting disputableVoting;
        Agent commonPoolAgent;
        IHookedTokenManager hookedTokenManager;
        IIssuance issuance;
        MiniMeToken gardenToken;
        IConvictionVoting convictionVoting;
    }

    address[] private disputables; // Used to prevent stack too deep error
    address[] private collateralTokens; // Used to prevent stack too deep error

    mapping(address => DeployedContracts) internal senderDeployedContracts;
    IHoneyswapRouter public honeyswapRouter;
    ERC20 public honeyToken;
    address public stableToken;
    IPriceOracle public honeyPriceOracle;
    IIncentivisedPriceOracleFactory public incentivisedPriceOracleFactory;
    ICollateralRequirementUpdaterFactory public collateralRequirementUpdaterFactory;
    IUniswapV2Factory public uniswapFactory;
    address public arbitrator;
    address public stakingFactory;

    constructor(
        DAOFactory _daoFactory,
        ENS _ens,
        MiniMeTokenFactory _miniMeFactory,
        IFIFSResolvingRegistrar _aragonID,
        IHoneyswapRouter _honeyswapRouter,
        ERC20 _honeyToken,
        address _stableToken,
        IPriceOracle _honeyPriceOracle,
        IIncentivisedPriceOracleFactory _incentivisedPriceOracleFactory,
        ICollateralRequirementUpdaterFactory _collateralRequirementUpdaterFactory,
        IUniswapV2Factory _uniswapFactory,
        address _arbitrator,
        address _stakingFactory
    ) public BaseTemplate(_daoFactory, _ens, _miniMeFactory, _aragonID) {
        _ensureAragonIdIsValid(_aragonID);
        _ensureMiniMeFactoryIsValid(_miniMeFactory);
        honeyswapRouter = _honeyswapRouter;
        honeyToken = _honeyToken;
        stableToken = _stableToken;
        honeyPriceOracle = _honeyPriceOracle;
        incentivisedPriceOracleFactory = _incentivisedPriceOracleFactory;
        collateralRequirementUpdaterFactory = _collateralRequirementUpdaterFactory;
        uniswapFactory = _uniswapFactory;
        arbitrator = _arbitrator;
        stakingFactory = _stakingFactory;
    }

    // New DAO functions //

    /**
     * @dev Create the DAO and initialise the basic apps necessary for gardens
     * @param _existingToken An existing token used for the common pool token. Set to address(0) to create a new token.
     * @param _gardenTokenName DAO governance new token name
     * @param _gardenTokenSymbol DAO governance new token symbol
     * @param _commonPoolAmount Initial amount of tokens in the funding pool. Unused if _existingToken is set.
     * @param _gardenTokenLiquidity Amount of tokens to use as liquidity, paired with Honey. Unused if _existingToken is set.
     * @param _disputableVotingSettings Array of [voteDuration, voteSupportRequired, voteMinAcceptanceQuorum, voteDelegatedVotingPeriod,
     *    voteQuietEndingPeriod, voteQuietEndingExtension, voteExecutionDelay] to set up the voting app of the organization
     */
    function createDaoTxOne(
        ERC20 _existingToken,
        string _gardenTokenName,
        string _gardenTokenSymbol,
        uint256 _commonPoolAmount,
        uint256 _gardenTokenLiquidity,
        uint64[7] _disputableVotingSettings
    ) public {
        require(_disputableVotingSettings.length == 7, ERROR_BAD_VOTE_SETTINGS);

        (Kernel dao, ACL acl) = _createDAO();
        ERC20 existingToken = _existingToken; // Prevents stack too deep error
        MiniMeToken gardenToken = _createToken(_gardenTokenName, _gardenTokenSymbol, TOKEN_DECIMALS);

        Agent agent = _installDefaultAgentApp(dao);
        DisputableVoting disputableVoting = _installDisputableVotingApp(dao, gardenToken, _disputableVotingSettings);
        IHookedTokenManager hookedTokenManager = _installHookedTokenManagerApp(dao, gardenToken, existingToken);

        if (existingToken == address(0)) {
            _createPermissionForTemplate(acl, hookedTokenManager, hookedTokenManager.MINT_ROLE());
            hookedTokenManager.mint(agent, _commonPoolAmount);
            hookedTokenManager.mint(address(this), _gardenTokenLiquidity);
            gardenToken.approve(address(honeyswapRouter), _gardenTokenLiquidity);

            uint256 honeyLiquidityToAdd = honeyPriceOracle.consult(stableToken, XDAI_IN_HNY_REQUIRED_FOR_NEW_TOKEN, honeyToken);
            honeyToken.transferFrom(msg.sender, address(this), honeyLiquidityToAdd);
            honeyToken.approve(address(honeyswapRouter), honeyLiquidityToAdd);

            honeyswapRouter.addLiquidity(honeyToken, gardenToken, honeyLiquidityToAdd, _gardenTokenLiquidity, 0, 0, BURN_ADDRESS, now);
        }

        _createDisputableVotingPermissions(acl, disputableVoting);
        _createAgentPermissions(acl, agent, disputableVoting, disputableVoting);
        _createEvmScriptsRegistryPermissions(acl, disputableVoting, disputableVoting);

        _storeDeployedContractsTxOne(dao, acl, disputableVoting, agent, hookedTokenManager, gardenToken);
    }

    /**
     * @dev Add tokenholders, only accessible between the first and second createDao transactions and no existing
     *      token was specified. Note will fail if called incorrectly due to missing mint permission.
     * @param _holders List of initial tokenholder addresses
     * @param _stakes List of intial tokenholder amounts
     */
    function createTokenHolders(address[] _holders, uint256[] _stakes) public {
        (,,,, IHookedTokenManager hookedTokenManager,) = _getDeployedContractsTxOne();
        for (uint256 i = 0; i < _holders.length; i++) {
            hookedTokenManager.mint(_holders[i], _stakes[i]);
        }
    }

    /**
     * @dev Add and initialise issuance and conviction voting
     * @param _issuanceSettings Array of issuance settings: [targetRatio, maxAdjustmentRatioPerSecond]
     * @param _convictionSettings array of conviction settings: [decay, max_ratio, weight, min_threshold_stake_percentage]
     */
    function createDaoTxTwo(
        uint256[2] _issuanceSettings,
        uint64[4] _convictionSettings
    ) public {
        require(senderDeployedContracts[msg.sender].dao != address(0), ERROR_NO_CACHE);

        (
            Kernel dao,
            ACL acl,
            DisputableVoting disputableVoting,
            Agent commonPoolAgent,
            IHookedTokenManager hookedTokenManager,
        ) = _getDeployedContractsTxOne();

        if (hookedTokenManager.wrappableToken() == address(0)) { // if existingToken == address(0) (prevents stack too deep error)
            _removePermissionFromTemplate(acl, hookedTokenManager, hookedTokenManager.MINT_ROLE());
            IIssuance issuance = _installIssuance(dao, hookedTokenManager, commonPoolAgent, _issuanceSettings);
            _createIssuancePermissions(acl, issuance, disputableVoting);
            _createHookedTokenManagerPermissions(acl, disputableVoting, hookedTokenManager, issuance);
        }

        address incentivisedPriceOracle = incentivisedPriceOracleFactory.newIncentivisedPriceOracle(
            uniswapFactory,
            AVERAGE_PRICE_PERIOD,
            UPDATE_FREQUENCY,
            hookedTokenManager.token(), // existingToken
            UPDATE_PERCENT_REWARD,
            uniswapFactory.getPair(stableToken, hookedTokenManager.token())
        );

        IConvictionVoting convictionVoting = _installConvictionVoting(
            dao,
            MiniMeToken(hookedTokenManager.token()),
            hookedTokenManager.wrappableToken(),
            stableToken,
            incentivisedPriceOracle,
            commonPoolAgent,
            _convictionSettings
        );
        _createConvictionVotingPermissions(acl, convictionVoting, disputableVoting);
        _createVaultPermissions(acl, commonPoolAgent, convictionVoting, disputableVoting);

        _createPermissionForTemplate(acl, hookedTokenManager, hookedTokenManager.SET_HOOK_ROLE());
        hookedTokenManager.registerHook(convictionVoting);
        _removePermissionFromTemplate(acl, hookedTokenManager, hookedTokenManager.SET_HOOK_ROLE());

        _storeDeployedContractsTxTwo(convictionVoting);
    }

    /**
     * @dev Add, initialise and activate the agreement
     * @param _daoId The ENS ID assigned to this DAO
     * @param _title String indicating a short description
     * @param _content Link to a human-readable text that describes the initial rules for the Agreement
     * @param _challengeDuration Challenge duration, during which the submitter can raise a dispute
     * @param _initialFees Array of fees settings: [actionFee, challangeFee]
     * @param _actionAmountsStable The action amount specified as a stable value (eg in xdai)
     * @param _challengeAmountsStable The challenge amount specified as a stable value (eg in xdai)
     */
    function createDaoTxThree(
        string _daoId,
        string _title,
        bytes memory _content,
        uint64 _challengeDuration,
        uint256[2] _initialFees,
        uint256[] _actionAmountsStable,
        uint256[] _challengeAmountsStable
    ) public {
        require(senderDeployedContracts[msg.sender].hookedTokenManager.hasInitialized(), ERROR_NO_CACHE);

        (Kernel dao, ACL acl, DisputableVoting disputableVoting, , , MiniMeToken gardenToken) = _getDeployedContractsTxOne();
        IConvictionVoting convictionVoting = _getDeployedContractsTxTwo();

        Agreement agreement =
            _installAgreementApp(dao, arbitrator, _title, _content, stakingFactory);
        _createAgreementPermissions(acl, agreement, disputableVoting, disputableVoting);
        acl.createPermission(agreement, disputableVoting, disputableVoting.SET_AGREEMENT_ROLE(), disputableVoting);
        acl.createPermission(agreement, convictionVoting, convictionVoting.SET_AGREEMENT_ROLE(), disputableVoting);

        agreement.activate(disputableVoting, gardenToken, _challengeDuration, _initialFees[0], _initialFees[1]);
        agreement.activate(convictionVoting, gardenToken, _challengeDuration, _initialFees[0], _initialFees[1]);
        _removePermissionFromTemplate(acl, agreement, agreement.MANAGE_DISPUTABLE_ROLE());

        delete disputables;
        disputables.push(disputableVoting);
        disputables.push(convictionVoting);

        delete collateralTokens;
        collateralTokens.push(gardenToken);
        collateralTokens.push(gardenToken);

        ICollateralRequirementUpdater collateralRequirementUpdater = collateralRequirementUpdaterFactory.newCollateralRequirementUpdater(
            agreement,
            disputables,
            collateralTokens,
            _actionAmountsStable,
            _challengeAmountsStable,
            convictionVoting.stableTokenOracle(),
            stableToken
        );
        collateralRequirementUpdater.transferOwnership(disputableVoting);
        acl.createPermission(collateralRequirementUpdater, agreement, agreement.MANAGE_DISPUTABLE_ROLE(), disputableVoting);

        _transferRootPermissionsFromTemplateAndFinalizeDAO(dao, address(disputableVoting));
//        _validateId(_id);
//        _registerID(_id, dao);

        _deleteStoredContracts();
    }

    // App installation/setup functions //

    function _installHookedTokenManagerApp(Kernel _dao, MiniMeToken _gardenToken, ERC20 _existingToken)
        internal
        returns (IHookedTokenManager)
    {
        IHookedTokenManager hookedTokenManager = IHookedTokenManager(_installDefaultApp(_dao, HOOKED_TOKEN_MANAGER_APP_ID));
        _gardenToken.changeController(hookedTokenManager);
        hookedTokenManager.initialize(_gardenToken, _existingToken, TOKEN_TRANSFERABLE, TOKEN_MAX_PER_ACCOUNT);
        return hookedTokenManager;
    }

    function _installDisputableVotingApp(Kernel _dao, MiniMeToken _token, uint64[7] memory _disputableVotingSettings)
        internal returns (DisputableVoting)
    {
        uint64 duration = _disputableVotingSettings[0];
        uint64 support = _disputableVotingSettings[1];
        uint64 acceptance = _disputableVotingSettings[2];
        uint64 delegatedVotingPeriod = _disputableVotingSettings[3];
        uint64 quietEndingPeriod = _disputableVotingSettings[4];
        uint64 quietEndingExtension = _disputableVotingSettings[5];
        uint64 executionDelay = _disputableVotingSettings[6];

        bytes memory initializeData =
            abi.encodeWithSelector(
                DisputableVoting(0).initialize.selector,
                _token,
                duration,
                support,
                acceptance,
                delegatedVotingPeriod,
                quietEndingPeriod,
                quietEndingExtension,
                executionDelay
            );
        return DisputableVoting(_installNonDefaultApp(_dao, DISPUTABLE_VOTING_APP_ID, initializeData));
    }

    function _installIssuance(
        Kernel _dao,
        IHookedTokenManager _hookedTokenManager,
        Agent _commonPoolAgent,
        uint256[2] _issuanceSettings
    ) internal returns (IIssuance) {
        IIssuance issuance = IIssuance(_installNonDefaultApp(_dao, DYNAMIC_ISSUANCE_APP_ID));
        issuance.initialize(_hookedTokenManager, _commonPoolAgent, _issuanceSettings[0], _issuanceSettings[1]);
        return issuance;
    }

    function _installConvictionVoting(
        Kernel _dao,
        MiniMeToken _stakeToken,
        address _requestToken,
        address _stableToken,
        address _stableTokenOracle,
        Agent _agent,
        uint64[4] _convictionSettings
    ) internal returns (IConvictionVoting) {
        IConvictionVoting convictionVoting = IConvictionVoting(_installNonDefaultApp(_dao, CONVICTION_VOTING_APP_ID));
        address requestToken = address(_requestToken) == address(0) ? address(_stakeToken) : address(_requestToken);
        convictionVoting.initialize(
            _stakeToken,
            requestToken,
            _stableToken,
            _stableTokenOracle,
            _agent,
            _convictionSettings[0],
            _convictionSettings[1],
            _convictionSettings[2],
            _convictionSettings[3]
        );
        return convictionVoting;
    }

    function _installAgreementApp(
        Kernel _dao,
        address _arbitrator,
        string _title,
        bytes _content,
        address _stakingFactory
    ) internal returns (Agreement) {
        bytes memory initializeData =
            abi.encodeWithSelector(
                Agreement(0).initialize.selector,
                _arbitrator,
                false,
                _title,
                _content,
                _stakingFactory
            );
        return Agreement(_installNonDefaultApp(_dao, AGREEMENT_APP_ID, initializeData));
    }

    // Permission setting functions //

    function _createDisputableVotingPermissions(ACL _acl, DisputableVoting _disputableVoting) internal {
        _acl.createPermission(ANY_ENTITY, _disputableVoting, _disputableVoting.CHALLENGE_ROLE(), _disputableVoting);
        _acl.createPermission(ANY_ENTITY, _disputableVoting, _disputableVoting.CREATE_VOTES_ROLE(), _disputableVoting);
    }

    function _createIssuancePermissions(ACL _acl, IIssuance _issuance, DisputableVoting _disputableVoting) internal {
        _acl.createPermission(_disputableVoting, _issuance, _issuance.UPDATE_SETTINGS_ROLE(), _disputableVoting);
    }

    function _createConvictionVotingPermissions(
        ACL _acl,
        IConvictionVoting _convictionVoting,
        DisputableVoting _disputableVoting
    ) internal {
        _acl.createPermission(ANY_ENTITY, _convictionVoting, _convictionVoting.CHALLENGE_ROLE(), _disputableVoting);
        _acl.createPermission(ANY_ENTITY, _convictionVoting, _convictionVoting.CREATE_PROPOSALS_ROLE(), _disputableVoting);
        _acl.createPermission(_disputableVoting, _convictionVoting, _convictionVoting.CANCEL_PROPOSALS_ROLE(), _disputableVoting);
        _acl.createPermission(_disputableVoting, _convictionVoting, _convictionVoting.UPDATE_SETTINGS_ROLE(), _disputableVoting);
    }

    function _createHookedTokenManagerPermissions(
        ACL acl,
        DisputableVoting disputableVoting,
        IHookedTokenManager hookedTokenManager,
        IIssuance issuance
    ) internal {
        acl.createPermission(issuance, hookedTokenManager, hookedTokenManager.MINT_ROLE(), disputableVoting);
        acl.createPermission(issuance, hookedTokenManager, hookedTokenManager.BURN_ROLE(), disputableVoting);
    }

    function _createAgreementPermissions(ACL _acl, Agreement _agreement, address _grantee, address _manager) internal {
        _acl.createPermission(_grantee, _agreement, _agreement.CHANGE_AGREEMENT_ROLE(), _manager);
        _acl.createPermission(address(this), _agreement, _agreement.MANAGE_DISPUTABLE_ROLE(), address(this));
    }

    // Temporary Storage functions //

    function _storeDeployedContractsTxOne(
        Kernel _dao,
        ACL _acl,
        DisputableVoting _disputableVoting,
        Agent _agent,
        IHookedTokenManager _hookedTokenManager,
        MiniMeToken _gardenToken
    ) internal {
        DeployedContracts storage deployedContracts = senderDeployedContracts[msg.sender];
        deployedContracts.dao = _dao;
        deployedContracts.acl = _acl;
        deployedContracts.disputableVoting = _disputableVoting;
        deployedContracts.commonPoolAgent = _agent;
        deployedContracts.hookedTokenManager = _hookedTokenManager;
        deployedContracts.gardenToken = _gardenToken;
    }

    function _getDeployedContractsTxOne() internal view
        returns (
            Kernel,
            ACL,
            DisputableVoting,
            Agent,
            IHookedTokenManager,
            MiniMeToken gardenToken
        )
    {
        DeployedContracts storage deployedContracts = senderDeployedContracts[msg.sender];
        return (
            deployedContracts.dao,
            deployedContracts.acl,
            deployedContracts.disputableVoting,
            deployedContracts.commonPoolAgent,
            deployedContracts.hookedTokenManager,
            deployedContracts.gardenToken
        );
    }

    function _storeDeployedContractsTxTwo(IConvictionVoting _convictionVoting) internal {
        DeployedContracts storage deployedContracts = senderDeployedContracts[msg.sender];
        deployedContracts.convictionVoting = _convictionVoting;
    }

    function _getDeployedContractsTxTwo() internal view returns (IConvictionVoting) {
        DeployedContracts storage deployedContracts = senderDeployedContracts[msg.sender];
        return deployedContracts.convictionVoting;
    }

    function _deleteStoredContracts() internal {
        delete senderDeployedContracts[msg.sender];
    }
}

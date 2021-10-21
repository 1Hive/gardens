pragma solidity 0.4.24;

import "@aragon/templates-shared/contracts/BaseTemplate.sol";
import "@aragon/os/contracts/common/SafeERC20.sol";
import "@1hive/funds-manager/contracts/FundsManager.sol";
import "@1hive/funds-manager/contracts/AragonVaultFundsManager.sol";
import "@1hive/funds-manager/contracts/GnosisSafeFundsManager.sol";
import "@1hive/funds-manager/contracts/GnosisSafe.sol";
import "./external/IMiniMeWithPermit.sol";
import "./external/IMiniMeWithPermitFactory.sol";
import "./external/IHookedTokenManager.sol";
import "./external/IIssuance.sol";
import "./external/IConvictionVoting.sol";
import "./external/Agreement.sol";
import "./external/DisputableVoting.sol";
import "./external/IPriceOracle.sol";
import "./external/IIncentivisedPriceOracleFactory.sol"; // This lives in the uniswap-v2-periphery/contracts/examples repo (it should be moved to its own repo)
import "./external/ICollateralRequirementUpdaterFactory.sol"; // This lives in the agreements repo
import "./external/ICollateralRequirementUpdater.sol"; // This lives in the agreements repo
import "./external/IUnipoolFactory.sol"; // This lives in the unipool repo
import "./external/IUniswapV2Factory.sol";
import "./external/IVotingAggregator.sol";
import "./appIds/AppIdsXDai.sol";
import "./appIds/AppIdsRinkeby.sol";
import "./appIds/AppIdsMumbai.sol";
import "./external/Erc721Adapter.sol";
import "./external/Erc721AdapterFactory.sol";

contract GardensTemplate is BaseTemplate, AppIdsMumbai {

    using SafeERC20 for ERC20;

    string private constant ERROR_BAD_VOTE_SETTINGS = "BAD_SETTINGS";
    string private constant ERROR_HONEY_DEPOSIT_TOO_LOW = "BAD_HONEY_DEPOSIT_TOO_LOW";
    string private constant ERROR_NO_CACHE = "NO_CACHE";
    string constant private ERROR_MINIME_FACTORY_NOT_PROVIDED = "TEMPLATE_MINIME_FAC_NOT_PROVIDED";

    bool private constant TOKEN_TRANSFERABLE = true;
    uint8 private constant TOKEN_DECIMALS = uint8(18);
    uint256 private constant TOKEN_MAX_PER_ACCOUNT = uint256(-1);
    address private constant ANY_ENTITY = address(-1);
    uint256 public constant AVERAGE_PRICE_PERIOD = 86400; // 24 hours
    uint8 public constant UPDATE_FREQUENCY = 8; // 8 times within price period, once every 3 hours
    uint256 public constant UPDATE_PERCENT_REWARD = 2e16; // 2% reward per update call
    address private constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    uint256 public constant MIN_XDAI_IN_HNY_REQUIRED_FOR_NEW_GARDEN = 100e18;
    string public constant AGGREGATE_TOKEN_PREPEND_NAME = "Aggregated";
    string public constant AGGREGATE_TOKEN_PREPEND_SYMBOL = "a";
    uint256 public constant GARDEN_TOKEN_AGGREGATOR_WEIGHT = 1;

    struct DeployedContracts {
        Kernel dao;
        ACL acl;
        DisputableVoting disputableVoting;
        FundsManager commonPoolFundsManager;
        IHookedTokenManager hookedTokenManager;
        IConvictionVoting convictionVoting;
    }

    address[] private disputables; // Used to prevent stack too deep error
    address[] private collateralTokens; // Used to prevent stack too deep error

    mapping(address => DeployedContracts) internal senderDeployedContracts;
    IMiniMeWithPermitFactory public miniMeWithPermitFactory;
    address public stableToken;
    IPriceOracle public honeyPriceOracle;
    IIncentivisedPriceOracleFactory public incentivisedPriceOracleFactory;
    ICollateralRequirementUpdaterFactory public collateralRequirementUpdaterFactory;
    IUniswapV2Factory public uniswapFactory;
    address public arbitrator;
    address public stakingFactory;
    Erc721AdapterFactory public erc721AdapterFactory;

    event GardenTransactionOne(address fundsManager);
    event GardenTransactionTwo(address dao, address incentivisedPriceOracle, address convictionVoting, address erc721Adapter);
    event GardenDeployed(address gardenAddress, address collateralRequirementUpdater);

    constructor(
        DAOFactory _daoFactory,
        ENS _ens,
        IMiniMeWithPermitFactory _miniMeWithPermitFactory,
        IFIFSResolvingRegistrar _aragonID,
        address _stableToken,
        IIncentivisedPriceOracleFactory _incentivisedPriceOracleFactory,
        ICollateralRequirementUpdaterFactory _collateralRequirementUpdaterFactory,
        IUniswapV2Factory _uniswapFactory,
        address _arbitrator,
        address _stakingFactory,
        Erc721AdapterFactory _erc721AdapterFactory
    ) public BaseTemplate(_daoFactory, _ens, MiniMeTokenFactory(0), _aragonID) {
        _ensureAragonIdIsValid(_aragonID);
        _ensureMiniMeFactoryIsValid(_miniMeWithPermitFactory);
        miniMeWithPermitFactory = _miniMeWithPermitFactory;
        stableToken = _stableToken;
        incentivisedPriceOracleFactory = _incentivisedPriceOracleFactory;
        collateralRequirementUpdaterFactory = _collateralRequirementUpdaterFactory;
        uniswapFactory = _uniswapFactory;
        arbitrator = _arbitrator;
        stakingFactory = _stakingFactory;
        erc721AdapterFactory = _erc721AdapterFactory;
    }

    // New Garden functions //

    /**
     * @dev Create the DAO and initialise the basic apps necessary for gardens
     * @param _addresses Array of [existingToken, gnosisSafe]
     *      existingToken An existing token used for the common pool token. Set to address(0) to create a new token.
     *      gnosisSafe Gnosis Safe used to hold common pools funds. Set to address(0) to use an Aragon Agent instead.
     * @param _gardenTokenName DAO governance new token name
     * @param _gardenTokenSymbol DAO governance new token symbol
     * @param _disputableVotingSettings Array of [voteDuration, voteSupportRequired, voteMinAcceptanceQuorum, voteDelegatedVotingPeriod,
     *    voteQuietEndingPeriod, voteQuietEndingExtension, voteExecutionDelay] to set up the voting app of the organization
     */
    function createGardenTxOne(
        address[2] _addresses,
        string _gardenTokenName,
        string _gardenTokenSymbol,
        uint64[7] _disputableVotingSettings
    ) public {
        require(_disputableVotingSettings.length == 7, ERROR_BAD_VOTE_SETTINGS);

        (Kernel dao, ACL acl) = _createDAO();

        ERC20 existingToken = ERC20(_addresses[0]); // Prevents stack too deep error
        IMiniMeWithPermit gardenToken = _createToken(_gardenTokenName, _gardenTokenSymbol, TOKEN_DECIMALS, existingToken == address(0));

        IHookedTokenManager hookedTokenManager = _installHookedTokenManagerApp(dao, gardenToken, existingToken);
        IVotingAggregator votingAggregator = _installVotingAggregatorApp(dao, _gardenTokenName, _gardenTokenSymbol);
        DisputableVoting disputableVoting = _installDisputableVotingApp(dao, votingAggregator, _disputableVotingSettings);
        FundsManager fundsManager = _addresses[1] == address(0) ? _createAgentFundsManager(dao, acl, disputableVoting) : _createGnosisFundsManager(_addresses[1]);

        _createPermissionForTemplate(acl, votingAggregator, votingAggregator.ADD_POWER_SOURCE_ROLE());
        votingAggregator.addPowerSource(gardenToken, IVotingAggregator.PowerSourceType.ERC20WithCheckpointing, GARDEN_TOKEN_AGGREGATOR_WEIGHT);
        _removePermissionFromTemplate(acl, votingAggregator, votingAggregator.ADD_POWER_SOURCE_ROLE());

        _createDisputableVotingPermissions(acl, disputableVoting);
        _createEvmScriptsRegistryPermissions(acl, disputableVoting, disputableVoting);
        _createPermissionForTemplate(acl, hookedTokenManager, hookedTokenManager.MINT_ROLE());

        _storeDeployedContractsTxOne(dao, acl, disputableVoting, fundsManager, hookedTokenManager);

        emit GardenTransactionOne(fundsManager);
    }

    /**
     * @dev Add tokenholders, only accessible between the first and second createDao transactions and if no existing
     *      token was specified. Note will fail if called incorrectly due to missing mint permission.
     * @param _holders List of initial tokenholder addresses
     * @param _stakes List of intial tokenholder amounts
     */
    function createTokenHolders(address[] _holders, uint256[] _stakes) public {
        (,,,, IHookedTokenManager hookedTokenManager) = _getDeployedContractsTxOne();
        for (uint256 i = 0; i < _holders.length; i++) {
            hookedTokenManager.mint(_holders[i], _stakes[i]);
        }
    }

    /**
     * @dev Add and initialise issuance and conviction voting
     * @param _erc721Adapter The Conviction Voting stake token. Set to address(0) to create a new one.
     * @param _convictionSettings Array of conviction settings: [decay, max_ratio, weight, min_threshold_stake_percentage]
     * @param _convictionVotingRequestToken The Garden's common pool token, requested using conviction voting. If set to
     *        address(0) the Garden will use it's main token.
     */
    function createGardenTxTwo(
        Erc721Adapter _erc721Adapter,
        uint64[4] _convictionSettings,
        address _convictionVotingRequestToken
    ) public {
        require(senderDeployedContracts[msg.sender].dao != address(0), ERROR_NO_CACHE);

        (
            Kernel dao,,,
            FundsManager commonPoolFundsManager,
            IHookedTokenManager hookedTokenManager
        ) = _getDeployedContractsTxOne();

        _removePermissionFromTemplate(_getAcl(), hookedTokenManager, hookedTokenManager.MINT_ROLE());

        address incentivisedPriceOracle = incentivisedPriceOracleFactory.newIncentivisedPriceOracle(
            uniswapFactory,
            AVERAGE_PRICE_PERIOD,
            UPDATE_FREQUENCY,
            _convictionVotingRequestToken,
            UPDATE_PERCENT_REWARD,
            uniswapFactory.getPair(stableToken, _convictionVotingRequestToken)
        );

        _erc721Adapter = _erc721Adapter == address(0) ? erc721AdapterFactory.newErc721Adapter(address(this)) : _erc721Adapter;

        IConvictionVoting convictionVoting = _installConvictionVoting(
            dao,
            IMiniMeWithPermit(_erc721Adapter),
            _convictionVotingRequestToken,
            stableToken,
            incentivisedPriceOracle,
            commonPoolFundsManager,
            _convictionSettings
        );
        _createConvictionVotingPermissions(_getAcl(), convictionVoting, _getDisputableVoting());
        commonPoolFundsManager.addFundsUser(convictionVoting);
        commonPoolFundsManager.setOwner(_getDisputableVoting());

        _erc721Adapter.setConvictionVoting(convictionVoting);
        _erc721Adapter.setOwner(msg.sender);

        _storeDeployedContractsTxTwo(convictionVoting);

        emit GardenTransactionTwo(dao, incentivisedPriceOracle, convictionVoting, _erc721Adapter);
    }

    /**
     * @dev Add, initialise and activate the agreement
     * @param _daoId The ENS ID assigned to this DAO
     * @param _agreementTitle String indicating a short description
     * @param _agreementContent Link to a human-readable text that describes the initial rules for the Agreement
     * @param _challengeDuration Challenge duration, during which the submitter can raise a dispute
     * @param _initialFees Array of fees settings: [actionFee, challangeFee]
     * @param _actionAmountsStable The action amount specified as a stable value (eg in xdai)
     * @param _challengeAmountsStable The challenge amount specified as a stable value (eg in xdai)
     */
    function createGardenTxThree(
        string _daoId,
        string _agreementTitle,
        bytes memory _agreementContent,
        uint64 _challengeDuration,
        uint256[2] _initialFees,
        uint256[] _actionAmountsStable,
        uint256[] _challengeAmountsStable
    ) public {
        require(senderDeployedContracts[msg.sender].hookedTokenManager.hasInitialized(), ERROR_NO_CACHE);

        (Kernel dao, ACL acl, DisputableVoting disputableVoting,, IHookedTokenManager hookedTokenManager) = _getDeployedContractsTxOne();
        IConvictionVoting convictionVoting = _getDeployedContractsTxTwo();

        // Create app and permissions for non common pool agent, in a separate transaction to first agent due to gas limits
        _createAgentPermissions(acl, _installDefaultAgentApp(dao), disputableVoting, disputableVoting);

        Agreement agreement =
            _installAgreementApp(dao, arbitrator, _agreementTitle, _agreementContent, stakingFactory);
        _createAgreementPermissions(acl, agreement, disputableVoting, disputableVoting);
        acl.createPermission(agreement, disputableVoting, disputableVoting.SET_AGREEMENT_ROLE(), disputableVoting);
        acl.createPermission(agreement, convictionVoting, convictionVoting.SET_AGREEMENT_ROLE(), disputableVoting);

        agreement.activate(disputableVoting, _getMainToken(hookedTokenManager), _challengeDuration, _initialFees[0], _initialFees[1]);
        agreement.activate(convictionVoting, _getMainToken(hookedTokenManager), _challengeDuration, _initialFees[0], _initialFees[1]);
        _removePermissionFromTemplate(acl, agreement, agreement.MANAGE_DISPUTABLE_ROLE());

        delete disputables;
        disputables.push(disputableVoting);
        disputables.push(convictionVoting);

        delete collateralTokens;
        collateralTokens.push(_getMainToken(hookedTokenManager));
        collateralTokens.push(_getMainToken(hookedTokenManager));

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
        // Permission necessary to allow collateralRequirementUpdater to update collateral requirements on the agreement
        acl.createPermission(collateralRequirementUpdater, agreement, agreement.MANAGE_DISPUTABLE_ROLE(), disputableVoting);

        _transferRootPermissionsFromTemplateAndFinalizeDAO(dao, address(disputableVoting));
//        _validateId(_daoId);
//        _registerID(_daoId, dao);

        _deleteStoredContracts();

        emit GardenDeployed(dao, collateralRequirementUpdater);
    }

    // App installation/setup functions //

    function _createToken(string memory _name, string memory _symbol, uint8 _decimals, bool _transfersEnabled) internal returns (IMiniMeWithPermit) {
        require(address(miniMeWithPermitFactory) != address(0), ERROR_MINIME_FACTORY_NOT_PROVIDED);
        IMiniMeWithPermit token = miniMeWithPermitFactory.createCloneToken(IMiniMeWithPermit(address(0)), 0, _name, _decimals, _symbol, _transfersEnabled);
        emit DeployToken(address(token));
        return token;
    }

    function _createAgentFundsManager(Kernel _dao, ACL _acl, DisputableVoting _disputableVoting) internal returns (FundsManager) {
        Agent commonPoolAgent = _installDefaultAgentApp(_dao);
        FundsManager fundsManager = new AragonVaultFundsManager(commonPoolAgent);
        _createAgentPermissions(_acl, commonPoolAgent, _disputableVoting, _disputableVoting);
        _createVaultPermissions(_acl, commonPoolAgent, fundsManager, _disputableVoting);
        return fundsManager;
    }

    function _createGnosisFundsManager(address _gnosisSafe) internal returns (FundsManager) {
        FundsManager fundsManager = new GnosisSafeFundsManager(GnosisSafe(_gnosisSafe));
        // The GnosisSafe owner must allow the above FundsManager permission to execute functions on it
        return fundsManager;
    }

    function _installHookedTokenManagerApp(Kernel _dao, IMiniMeWithPermit _gardenToken, ERC20 _wrappableToken)
        internal
        returns (IHookedTokenManager)
    {
        IHookedTokenManager hookedTokenManager = IHookedTokenManager(_installDefaultApp(_dao, HOOKED_TOKEN_MANAGER_APP_ID));
        _gardenToken.changeController(hookedTokenManager);
        hookedTokenManager.initialize(_gardenToken, _wrappableToken, TOKEN_TRANSFERABLE, TOKEN_MAX_PER_ACCOUNT);
        return hookedTokenManager;
    }

    function _installVotingAggregatorApp(Kernel _dao, string _gardenTokenName, string _gardenTokenSymbol)
        internal returns (IVotingAggregator)
    {
        IVotingAggregator votingAggregator = IVotingAggregator(_installNonDefaultApp(_dao, VOTING_AGGREGATOR_APP_ID));
        string memory votingTokenName = string(abi.encodePacked(AGGREGATE_TOKEN_PREPEND_NAME, _gardenTokenName));
        string memory votingTokenSymbol = string(abi.encodePacked(AGGREGATE_TOKEN_PREPEND_SYMBOL, _gardenTokenSymbol));
        votingAggregator.initialize(votingTokenName, votingTokenSymbol, 18);
        return votingAggregator;
    }

    function _installDisputableVotingApp(Kernel _dao, address _token, uint64[7] memory _disputableVotingSettings)
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
        FundsManager _commonPoolFundsManager,
        uint256[2] _issuanceSettings
    ) internal returns (IIssuance) {
        IIssuance issuance = IIssuance(_installNonDefaultApp(_dao, DYNAMIC_ISSUANCE_APP_ID));
        issuance.initialize(_hookedTokenManager, _commonPoolFundsManager, _issuanceSettings[0], _issuanceSettings[1]);
        return issuance;
    }

    function _installConvictionVoting(
        Kernel _dao,
        IMiniMeWithPermit _stakeToken,
        address _requestToken,
        address _stableToken,
        address _stableTokenOracle,
        FundsManager _fundsManager,
        uint64[4] _convictionSettings
    ) internal returns (IConvictionVoting) {
        IConvictionVoting convictionVoting = IConvictionVoting(_installNonDefaultApp(_dao, CONVICTION_VOTING_APP_ID));
        convictionVoting.initialize(
            _stakeToken,
            _requestToken,
            _stableToken,
            _stableTokenOracle,
            _fundsManager,
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
        FundsManager _fundsManager,
        IHookedTokenManager _hookedTokenManager
    ) internal {
        DeployedContracts storage deployedContracts = senderDeployedContracts[msg.sender];
        deployedContracts.dao = _dao;
        deployedContracts.acl = _acl;
        deployedContracts.disputableVoting = _disputableVoting;
        deployedContracts.commonPoolFundsManager = _fundsManager;
        deployedContracts.hookedTokenManager = _hookedTokenManager;
    }

    function _getDeployedContractsTxOne() internal view
        returns (
            Kernel,
            ACL,
            DisputableVoting,
            FundsManager,
            IHookedTokenManager
        )
    {
        DeployedContracts storage deployedContracts = senderDeployedContracts[msg.sender];
        return (
            deployedContracts.dao,
            deployedContracts.acl,
            deployedContracts.disputableVoting,
            deployedContracts.commonPoolFundsManager,
            deployedContracts.hookedTokenManager
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

    // Misc functions //

    function _creatingGardenWithExistingToken(IHookedTokenManager _hookedTokenManager) internal returns (bool) {
        return _hookedTokenManager.wrappableToken() != address(0);
    }

    function _getMainToken(IHookedTokenManager hookedTokenManager) internal returns (address) {
        return hookedTokenManager.wrappableToken() == address(0) ? hookedTokenManager.token() : hookedTokenManager.wrappableToken();
    }

    function _getAcl() internal returns (ACL) {
        return senderDeployedContracts[msg.sender].acl;
    }

    function _getDisputableVoting() internal returns (DisputableVoting) {
        return senderDeployedContracts[msg.sender].disputableVoting;
    }
}

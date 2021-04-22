pragma solidity 0.4.24;

import "@aragon/templates-shared/contracts/BaseTemplate.sol";
import "./external/IHookedTokenManager.sol";
import "./external/IIssuance.sol";
import "./external/IConvictionVoting.sol";
import "./external/Agreement.sol";
import "./external/DisputableVoting.sol";
import "./appIds/AppIdsXDai.sol";

contract GardensTemplate is BaseTemplate, AppIdsXDai {
    string private constant ERROR_MISSING_MEMBERS = "MISSING_MEMBERS";
    string private constant ERROR_BAD_VOTE_SETTINGS = "BAD_SETTINGS";
    string private constant ERROR_NO_CACHE = "NO_CACHE";
    string private constant ERROR_NO_TOLLGATE_TOKEN = "NO_TOLLGATE_TOKEN";

    bool private constant TOKEN_TRANSFERABLE = true;
    uint8 private constant TOKEN_DECIMALS = uint8(18);
    uint256 private constant TOKEN_MAX_PER_ACCOUNT = uint256(-1);
    address private constant ANY_ENTITY = address(-1);
    uint8 private constant ORACLE_PARAM_ID = 203;
    enum Op {NONE, EQ, NEQ, GT, LT, GTE, LTE, RET, NOT, AND, OR, XOR, IF_ELSE}

    struct DeployedContracts {
        Kernel dao;
        ACL acl;
        DisputableVoting disputableVoting;
        Agent fundingPoolAgent;
        IHookedTokenManager hookedTokenManager;
        IIssuance issuance;
        MiniMeToken voteToken;
        IConvictionVoting convictionVoting;
    }

    mapping(address => DeployedContracts) internal senderDeployedContracts;

    constructor(
        DAOFactory _daoFactory,
        ENS _ens,
        MiniMeTokenFactory _miniMeFactory,
        IFIFSResolvingRegistrar _aragonID
    ) public BaseTemplate(_daoFactory, _ens, _miniMeFactory, _aragonID) {
        _ensureAragonIdIsValid(_aragonID);
        _ensureMiniMeFactoryIsValid(_miniMeFactory);
    }

    // New DAO functions //

    /**
     * @dev Create the DAO and initialise the basic apps necessary for gardens
     * @param _voteTokenName DAO governance new token name
     * @param _voteTokenSymbol DAO governance new token symbol
     * @param _fundingPoolStake Initial amount of tokens in the funding pool
     * @param _disputableVotingSettings Array of [voteDuration, voteSupportRequired, voteMinAcceptanceQuorum, voteDelegatedVotingPeriod,
     *    voteQuietEndingPeriod, voteQuietEndingExtension, voteExecutionDelay] to set up the voting app of the organization
     */
    function createDaoTxOne(
        string _voteTokenName,
        string _voteTokenSymbol,
        uint256 _fundingPoolStake,
        uint64[7] _disputableVotingSettings
    ) public {
        require(_disputableVotingSettings.length == 7, ERROR_BAD_VOTE_SETTINGS);

        (Kernel dao, ACL acl) = _createDAO();
        MiniMeToken voteToken = _createToken(_voteTokenName, _voteTokenSymbol, TOKEN_DECIMALS);
        Agent agent = _installDefaultAgentApp(dao);

        DisputableVoting disputableVoting = _installDisputableVotingApp(dao, voteToken, _disputableVotingSettings);
        IHookedTokenManager hookedTokenManager = _installHookedTokenManagerApp(dao, voteToken);

        _createPermissionForTemplate(acl, hookedTokenManager, hookedTokenManager.MINT_ROLE());
        hookedTokenManager.mint(agent, _fundingPoolStake);

        _createDisputableVotingPermissions(acl, disputableVoting);
        _createAgentPermissions(acl, agent, disputableVoting, disputableVoting);
        _createEvmScriptsRegistryPermissions(acl, disputableVoting, disputableVoting);

        _storeDeployedContractsTxOne(dao, acl, disputableVoting, agent, hookedTokenManager, voteToken);
    }

    /**
     * @dev Add tokenholders, only accessible between the first and second createDao transactions
     * @param _holders List of initial tokenholder addresses
     * @param _stakes List of intial tokenholder amounts
     */
    function createTokenholders(address[] _holders, uint256[] _stakes) public {
        (,,,, IHookedTokenManager hookedTokenManager,) = _getDeployedContractsTxOne();
        for (uint256 i = 0; i < _holders.length; i++) {
            hookedTokenManager.mint(_holders[i], _stakes[i]);
        }
    }

    /**
     * @dev Add and initialise issuance and conviction voting
     * @param _issuanceSettings Array of issuance settings: [targetRatio, maxAdjustmentRatioPerSecond]
     * @param _stableToken Stable token address for conviction voting proposals with stable request amounts
     * @param _stableTokenOracle Stable token oracle address
     * @param _convictionSettings array of conviction settings: [decay, max_ratio, weight, min_threshold_stake_percentage]
     */
    function createDaoTxTwo(
        uint256[2] _issuanceSettings,
        ERC20 _stableToken,
        address _stableTokenOracle,
        uint64[4] _convictionSettings
    ) public {
        require(senderDeployedContracts[msg.sender].dao != address(0), ERROR_NO_CACHE);

        (
            Kernel dao,
            ACL acl,
            DisputableVoting disputableVoting,
            Agent fundingPoolAgent,
            IHookedTokenManager hookedTokenManager,
        ) = _getDeployedContractsTxOne();

        _removePermissionFromTemplate(acl, hookedTokenManager, hookedTokenManager.MINT_ROLE());

        IIssuance issuance = _installIssuance(dao, hookedTokenManager, fundingPoolAgent, _issuanceSettings);
        _createIssuancePermissions(acl, issuance, disputableVoting);
        _createHookedTokenManagerPermissions(acl, disputableVoting, hookedTokenManager, issuance);

        IConvictionVoting convictionVoting = _installConvictionVoting(
            dao,
            MiniMeToken(hookedTokenManager.token()),
            _stableToken,
            _stableTokenOracle,
            fundingPoolAgent,
            _convictionSettings
        );
        _createConvictionVotingPermissions(acl, convictionVoting, disputableVoting);
        _createVaultPermissions(acl, fundingPoolAgent, convictionVoting, disputableVoting);

        _createPermissionForTemplate(acl, hookedTokenManager, hookedTokenManager.SET_HOOK_ROLE());
        hookedTokenManager.registerHook(convictionVoting);
        _removePermissionFromTemplate(acl, hookedTokenManager, hookedTokenManager.SET_HOOK_ROLE());

        _storeDeployedContractsTxTwo(convictionVoting);
    }

    /**
     * @dev Add, initialise and activate the agreement
     * @param _id DAO id
     * @param _arbitrator Address of the IArbitrator that will be used to resolve disputes
     * @param _setAppFeesCashier Whether to integrate with the IArbitrator's fee cashier
     * @param _title String indicating a short description
     * @param _content Link to a human-readable text that describes the initial rules for the Agreement
     * @param _stakingFactory Staking factory for finding each collateral token's staking pool
     * @param _feeToken ERC20 token used for the arbitration fees
     * @param _challengeDuration Challenge duration, during which the submitter can raise a dispute
     * @param _fees Array of fees setings: [actionFee, challangeFee]
     */
    function createDaoTxThree(
        string _id,
        address _arbitrator,
        bool _setAppFeesCashier,
        string _title,
        bytes memory _content,
        address _stakingFactory,
        address _feeToken,
        uint64 _challengeDuration,
        uint256[2] _fees
    ) public {
        require(senderDeployedContracts[msg.sender].hookedTokenManager.hasInitialized(), ERROR_NO_CACHE);

        (Kernel dao, ACL acl, DisputableVoting disputableVoting, , , ) = _getDeployedContractsTxOne();
        IConvictionVoting convictionVoting = _getDeployedContractsTxTwo();

        Agreement agreement =
            _installAgreementApp(dao, _arbitrator, _setAppFeesCashier, _title, _content, _stakingFactory);
        _createAgreementPermissions(acl, agreement, disputableVoting, disputableVoting);
        acl.createPermission(agreement, disputableVoting, disputableVoting.SET_AGREEMENT_ROLE(), disputableVoting);
        acl.createPermission(agreement, convictionVoting, convictionVoting.SET_AGREEMENT_ROLE(), disputableVoting);

        agreement.activate(disputableVoting, _feeToken, _challengeDuration, _fees[0], _fees[1]);
        agreement.activate(convictionVoting, _feeToken, _challengeDuration, _fees[0], _fees[1]);
        _removePermissionFromTemplate(acl, agreement, agreement.MANAGE_DISPUTABLE_ROLE());

        _transferRootPermissionsFromTemplateAndFinalizeDAO(dao, msg.sender);
        _validateId(_id);
        _registerID(_id, dao);

        _deleteStoredContracts();
    }

    // App installation/setup functions //

    function _installHookedTokenManagerApp(Kernel _dao, MiniMeToken _voteToken)
        internal
        returns (IHookedTokenManager)
    {
        IHookedTokenManager hookedTokenManager = IHookedTokenManager(_installDefaultApp(_dao, HOOKED_TOKEN_MANAGER_APP_ID));
        _voteToken.changeController(hookedTokenManager);
        hookedTokenManager.initialize(_voteToken, TOKEN_TRANSFERABLE, TOKEN_MAX_PER_ACCOUNT);
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
        Agent _fundingPoolAgent,
        uint256[2] _issuanceSettings
    ) internal returns (IIssuance) {
        IIssuance issuance = IIssuance(_installNonDefaultApp(_dao, DYNAMIC_ISSUANCE_APP_ID));
        issuance.initialize(_hookedTokenManager, _fundingPoolAgent, _issuanceSettings[0], _issuanceSettings[1]);
        return issuance;
    }

    function _installConvictionVoting(
        Kernel _dao,
        MiniMeToken _stakeAndRequestToken,
        ERC20 _stableToken,
        address _stableTokenOracle,
        Agent _agent,
        uint64[4] _convictionSettings
    ) internal returns (IConvictionVoting) {
        IConvictionVoting convictionVoting = IConvictionVoting(_installNonDefaultApp(_dao, CONVICTION_VOTING_APP_ID));
        convictionVoting.initialize(
            _stakeAndRequestToken,
            _stakeAndRequestToken,
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
        bool _setAppFeesCashier,
        string _title,
        bytes _content,
        address _stakingFactory
    ) internal returns (Agreement) {
        bytes memory initializeData =
            abi.encodeWithSelector(
                Agreement(0).initialize.selector,
                _arbitrator,
                _setAppFeesCashier,
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
        // _acl.createPermission(_disputableVoting, _disputableVoting, _disputableVoting.CHANGE_VOTE_TIME_ROLE(), _disputableVoting);
        // _acl.createPermission(_disputableVoting, _disputableVoting, _disputableVoting.CHANGE_SUPPORT_ROLE(), _disputableVoting);
        // _acl.createPermission(_disputableVoting, _disputableVoting, _disputableVoting.CHANGE_QUORUM_ROLE(), _disputableVoting);
        // _acl.createPermission(_disputableVoting, _disputableVoting, _disputableVoting.CHANGE_DELEGATED_VOTING_PERIOD_ROLE(), _disputableVoting);
        // _acl.createPermission(_disputableVoting, _disputableVoting, _disputableVoting.CHANGE_QUIET_ENDING_ROLE(), _disputableVoting);
        // _acl.createPermission(_disputableVoting, _disputableVoting, _disputableVoting.CHANGE_EXECUTION_DELAY_ROLE(), _disputableVoting);
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
        // acl.createPermission(issuance, hookedTokenManager, hookedTokenManager.ISSUE_ROLE(), disputableVoting);
        // acl.createPermission(issuance, hookedTokenManager, hookedTokenManager.ASSIGN_ROLE(), disputableVoting);
        // acl.createPermission(issuance, hookedTokenManager, hookedTokenManager.REVOKE_VESTINGS_ROLE(), disputableVoting);
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
        MiniMeToken _voteToken
    ) internal {
        DeployedContracts storage deployedContracts = senderDeployedContracts[msg.sender];
        deployedContracts.dao = _dao;
        deployedContracts.acl = _acl;
        deployedContracts.disputableVoting = _disputableVoting;
        deployedContracts.fundingPoolAgent = _agent;
        deployedContracts.hookedTokenManager = _hookedTokenManager;
        deployedContracts.voteToken = _voteToken;
    }

    function _getDeployedContractsTxOne() internal view
        returns (
            Kernel,
            ACL,
            DisputableVoting,
            Agent,
            IHookedTokenManager,
            MiniMeToken voteToken
        )
    {
        DeployedContracts storage deployedContracts = senderDeployedContracts[msg.sender];
        return (
            deployedContracts.dao,
            deployedContracts.acl,
            deployedContracts.disputableVoting,
            deployedContracts.fundingPoolAgent,
            deployedContracts.hookedTokenManager,
            deployedContracts.voteToken
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

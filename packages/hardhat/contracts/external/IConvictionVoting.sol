pragma solidity ^0.4.24;

import "./IMiniMeWithPermit.sol";
import "@aragon/apps-vault/contracts/Vault.sol";
import "@1hive/funds-manager/contracts/FundsManager.sol";

contract IConvictionVoting {
    bytes32 public constant CHALLENGE_ROLE = keccak256("CHALLENGE_ROLE");
    bytes32 public constant SET_AGREEMENT_ROLE = keccak256("SET_AGREEMENT_ROLE");
    bytes32 public constant PAUSE_CONTRACT_ROLE = keccak256("PAUSE_CONTRACT_ROLE");
    bytes32 public constant UPDATE_SETTINGS_ROLE = keccak256("UPDATE_SETTINGS_ROLE");
    bytes32 public constant CREATE_PROPOSALS_ROLE = keccak256("CREATE_PROPOSALS_ROLE");
    bytes32 public constant CANCEL_PROPOSALS_ROLE = keccak256("CANCEL_PROPOSALS_ROLE");

    function initialize(
        IMiniMeWithPermit _stakeToken,
        address _requestToken,
        address _stableToken,
        address _stableTokenOracle,
        FundsManager _vault,
        uint256 _decay,
        uint256 _maxRatio,
        uint256 _weight,
        uint256 _minThresholdStakePercentage
    ) external;

    function addProposal(
        string _title,
        bytes _link,
        uint256 _requestedAmount,
        bool _stableRequestAmount,
        address _beneficiary
    ) external;

    function stableTokenOracle() public returns (address);

}

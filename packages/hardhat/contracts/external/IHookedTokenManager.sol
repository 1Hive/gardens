pragma solidity ^0.4.0;

contract IHookedTokenManager {

    bytes32 public constant INIT_ROLE = keccak256("INIT_ROLE");
    bytes32 public constant CHANGE_CONTROLLER_ROLE = keccak256("CHANGE_CONTROLLER_ROLE");
    bytes32 public constant MINT_ROLE = keccak256("MINT_ROLE");
    bytes32 public constant ISSUE_ROLE = keccak256("ISSUE_ROLE");
    bytes32 public constant ASSIGN_ROLE = keccak256("ASSIGN_ROLE");
    bytes32 public constant REVOKE_VESTINGS_ROLE = keccak256("REVOKE_VESTINGS_ROLE");
    bytes32 public constant BURN_ROLE = keccak256("BURN_ROLE");
    bytes32 public constant SET_HOOK_ROLE = keccak256("SET_HOOK_ROLE");

    function initialize(address _token, bool _transferable, uint256 _maxAccountTokens) external;

    function changeTokenController(address _newController) external;

    function mint(address _receiver, uint256 _amount) external;

    function token() public returns (address);

    function registerHook(address _hook) external returns (uint256);

    function hasInitialized() public view returns (bool);

}

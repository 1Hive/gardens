pragma solidity 0.4.24;

import "@aragon/os/contracts/common/SafeERC20.sol";
import "@aragon/os/contracts/lib/token/ERC20.sol";

contract ITollgate {
    using SafeERC20 for ERC20;

    bytes32 public constant CHANGE_AMOUNT_ROLE = keccak256("CHANGE_AMOUNT_ROLE");
    bytes32 public constant CHANGE_DESTINATION_ROLE = keccak256("CHANGE_DESTINATION_ROLE");

    /**
    * @notice Initialize Tollgate with fee of `@tokenAmount(_feeToken, _feeAmount)`
    * @param _feeToken ERC20 address for the fee token
    * @param _feeAmount Amount of tokens collected as a fee on each forward
    * @param _feeDestination Destination for collected fees
    */
    function initialize(ERC20 _feeToken, uint256 _feeAmount, address _feeDestination) external;
}

pragma solidity ^0.4.24;

import "@aragon/os/contracts/lib/token/ERC20.sol";

contract IMiniMeWithPermit is ERC20 {

    function changeController(address _newController) public;
}

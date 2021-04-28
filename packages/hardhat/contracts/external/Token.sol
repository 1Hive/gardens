
pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract Token is ERC20, ERC20Detailed {

    constructor(address _owner, string name, string symbol) public ERC20Detailed(name, symbol, 18) {
        _mint(_owner, 10000000e18);
    }
}

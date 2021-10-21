pragma solidity ^0.4.24;

import "./Erc721Adapter.sol";

contract Erc721AdapterFactory {
    function newErc721Adapter(address _owner) public returns (Erc721Adapter);
}

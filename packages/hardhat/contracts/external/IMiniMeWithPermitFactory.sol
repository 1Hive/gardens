pragma solidity ^0.4.24;

import "./IMiniMeWithPermit.sol";

contract IMiniMeWithPermitFactory {
    function createCloneToken(
        IMiniMeWithPermit _parentToken,
        uint _snapshotBlock,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol,
        bool _transfersEnabled
    ) public returns (IMiniMeWithPermit);
}

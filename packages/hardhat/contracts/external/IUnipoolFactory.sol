pragma solidity ^0.4.24;

contract IUnipoolFactory {

    event NewUnipool(address unipool);
    event NewRewardDepositor(address unipoolRewardDepositor);

    function newUnipool(address _rewardToken) public returns (address);
    function newUnipoolWithDepositor(address _rewardToken) public returns (address, address);
}

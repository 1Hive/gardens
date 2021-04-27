pragma solidity ^0.4.24;

contract IIncentivisedPriceOracleFactory {

    // The returned address can be sent some _incentiveToken as an incentive for users to update the price
    function newIncentivisedPriceOracleFactory(
        address _factory,
        uint _windowSize,
        uint8 _granularity,
        address _incentiveToken,
        uint256 _percentIncentivePerCall,
        address _incentivisedPair
    ) public returns (address);
}

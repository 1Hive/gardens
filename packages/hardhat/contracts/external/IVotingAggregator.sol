pragma solidity ^0.4.0;

contract IVotingAggregator {

    enum PowerSourceType {
        Invalid,
        ERC20WithCheckpointing,
        ERC900
    }

    function ADD_POWER_SOURCE_ROLE() external pure returns (bytes32);

    function initialize(string _name, string _symbol, uint8 _decimals) external;
    function addPowerSource(address _sourceAddr, PowerSourceType _sourceType, uint256 _weight) external;
}

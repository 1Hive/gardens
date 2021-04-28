/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity 0.4.24;

interface Agreement {
    function CHANGE_AGREEMENT_ROLE() external pure returns (bytes32);
    function MANAGE_DISPUTABLE_ROLE() external pure returns (bytes32);

    function initialize(
        address _arbitrator,
        bool _setAppFeesCashier,
        string _title,
        bytes _content,
        address _stakingFactory
    ) external;

    function activate(
        address _disputableAddress,
        address _collateralToken,
        uint64 _challengeDuration,
        uint256 _actionAmount,
        uint256 _challengeAmount
    ) external;
}

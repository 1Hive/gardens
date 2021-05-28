pragma solidity ^0.4.24;

import "./ICollateralRequirementUpdater.sol";

contract ICollateralRequirementUpdaterFactory {

    event NewCollateralRequirementUpdater(address _newCollateralRequirementUpdater);

    // The returned address needs the MANAGE_DISPUTABLE_ROLE permission on the specified Agreement contract
    function newCollateralRequirementUpdater(
        address _agreement,
        address[] _disputableApps,
        address[] _collateralTokens,
        uint256[] _actionAmountsStable,
        uint256[] _challengeAmountsStable,
        address _priceOracle,
        address _stableToken
    ) public returns (ICollateralRequirementUpdater);
}

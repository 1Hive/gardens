pragma solidity ^0.4.24;

import "@aragon/os/contracts/lib/token/ERC20.sol";
import "@aragon/os/contracts/common/SafeERC20.sol";
import "./external/IHookedTokenManager.sol";

// This contract needs the MINT_ROLE and BURN_ROLE permissions on the HookedTokenManager
contract GardenTokenGenerator {

    using SafeERC20 for ERC20;

    ERC20 public stakedToken;
    IHookedTokenManager public hookedTokenManager;

    event GardenTokensMinted(uint256 amount);
    event GardenTokensBurned(uint256 amount);

    constructor(ERC20 _stakedToken, IHookedTokenManager _hookedTokenManager) {
        stakedToken = _stakedToken;
        hookedTokenManager = _hookedTokenManager;
    }

    function stake(uint256 _amount) public {
        stakedToken.safeTransferFrom(msg.sender, address(this), _amount);
        hookedTokenManager.mint(msg.sender, _amount);

        emit GardenTokensMinted(_amount);
    }

    function unstake(uint256 _amount) public {
        stakedToken.safeTransfer(msg.sender, _amount);
        hookedTokenManager.burn(msg.sender, _amount);

        emit GardenTokensBurned(_amount);
    }
}

pragma solidity 0.4.24;

import "@aragon/os/contracts/apm/APMNamehash.sol";

contract AppIdsXDai is APMNamehash {
    bytes32 public constant CONVICTION_VOTING_APP_ID = 0xca60629a22f03bcad7738fee1a6f0c5863eb89463621b40566a6799b82cbe184; // disputable-conviction-voting.open.aragonpm.eth
    bytes32 public constant HOOKED_TOKEN_MANAGER_APP_ID = 0x3ccad1fc11d5b14e58c1c53a5138a51f4da8d509831bc505e60bb74d88f8bef5; // wrappable-hooked-token-manager.open.aragonpm.eth
    bytes32 public constant DYNAMIC_ISSUANCE_APP_ID = 0xb4534ca120beef0055b5bd2dbbfe396de7648f1c13a4f7bdfd5a9bd9b40fe824; // dynamic-issuance.open.aragonpm.eth
    bytes32 public constant AGREEMENT_APP_ID = 0x34c62f3aec3073826f39c2c35e9a1297d9dbf3cc77472283106f09eee9cf47bf; // agreement.open.aragonpm.eth
    bytes32 public constant DISPUTABLE_VOTING_APP_ID = 0x7b4270e524fa29ca05027d0f2e6a4d3007ee9695c78de05311f341f1c2fc8056; // disputable-voting-mod-permission.open.aragonpm.eth
    bytes32 public constant VOTING_AGGREGATOR_APP_ID = 0x956b8eeee6100c059c6e68ccf3f3ed9483796128e80f458bc52ad1e6ef246fe6; // vote-token-aggregator.open.aragonpm.eth
}

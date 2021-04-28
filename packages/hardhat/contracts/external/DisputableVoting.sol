/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity 0.4.24;

import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";


interface DisputableVoting {
    function SET_AGREEMENT_ROLE() external pure returns (bytes32);
    function CREATE_VOTES_ROLE() external pure returns (bytes32);
    function CHALLENGE_ROLE() external pure returns (bytes32);
    function CHANGE_VOTE_TIME_ROLE() external pure returns (bytes32);
    function CHANGE_SUPPORT_ROLE() external pure returns (bytes32);
    function CHANGE_QUORUM_ROLE() external pure returns (bytes32);
    function CHANGE_DELEGATED_VOTING_PERIOD_ROLE() external pure returns (bytes32);
    function CHANGE_QUIET_ENDING_ROLE() external pure returns (bytes32);
    function CHANGE_EXECUTION_DELAY_ROLE() external pure returns (bytes32);

    function initialize(
        MiniMeToken _token,
        uint64 _voteTime,
        uint64 _supportRequiredPct,
        uint64 _minAcceptQuorumPct,
        uint64 _delegatedVotingPeriod,
        uint64 _quietEndingPeriod,
        uint64 _quietEndingExtension,
        uint64 _executionDelay
    ) external;

    function newVote(bytes _executionScript, bytes _context) external returns (uint256);
}

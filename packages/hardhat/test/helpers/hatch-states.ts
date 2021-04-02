export const STATE_PENDING = "Pending";
export const STATE_FUNDING = "Funding";
export const STATE_REFUNDING = "Refunding";
export const STATE_GOAL_REACHED = "GoalReached";
export const STATE_CLOSED = "Closed";

export const STATE_PENDING_NUM = 0;
export const STATE_FUNDING_NUM = 1;
export const STATE_REFUNDING_NUM = 2;
export const STATE_GOAL_REACHED_NUM = 3;
export const STATE_CLOSED_NUM = 4;

const states: string[] = [STATE_PENDING, STATE_FUNDING, STATE_REFUNDING, STATE_GOAL_REACHED, STATE_CLOSED];

const intStates: number[] = [0, 1, 2, 3, 4];

export function getStateByKey(stateKey: number): string {
  return states[stateKey];
}

export function getIntStateByKey(stateKey: number): number {
  return intStates[stateKey];
}

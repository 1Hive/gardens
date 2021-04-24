import { Contract } from "@ethersproject/contracts";

export const getEventArgument = async (
  selectedFilter: string,
  arg: number | string,
  contract: Contract,
  transactionHash: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filter = contract.filters[selectedFilter]();

    contract.on(filter, (...args) => {
      const event = args.pop();
      if (event.transactionHash === transactionHash) {
        contract.removeAllListeners(filter);
        resolve(event.args[arg]);
      }
    });
  });
};

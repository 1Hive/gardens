export const arbitratorAbi = [
  'function getSubscriptions() view returns (address)',
  'function getDisputeFees() view returns (address recipient, address feeToken, uint256 feeAmount)',
]

export const stakingAbi = [
  'function stake(uint256 _amount, bytes _data)',
  'function allowManager(address _lockManager, uint256 _allowance, bytes _data)',
  'function getLock(address _user, address _lockManager) view returns (uint256 amount, uint256 allowance)',
  'function getBalancesOf(address _user) view returns (uint256 staked, uint256 locked)',
  'function unlockedBalanceOf(address _user) view returns (uint256)',
  'function decreaseLockAllowance(address _user, address _lockManager, uint256 _allowance)',
]

export const stakingFactoryAbi = ['function getInstance(address _token) view returns (address)']

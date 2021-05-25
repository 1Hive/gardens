import { BigNumber } from 'ethers'
import hre from 'hardhat'

export const duration = {
  seconds: function (val) {
    return BigNumber.from(val)
  },
  minutes: function (val) {
    return BigNumber.from(val).mul(this.seconds('60'))
  },
  hours: function (val) {
    return BigNumber.from(val).mul(this.minutes('60'))
  },
  days: function (val) {
    return BigNumber.from(val).mul(this.hours('24'))
  },
  weeks: function (val) {
    return BigNumber.from(val).mul(this.days('7'))
  },
  years: function (val) {
    return BigNumber.from(val).mul(this.days('365'))
  },
}

export const impersonateAddress = async (address: string) => {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  })

  const signer = await hre.ethers.provider.getSigner(address)

  return signer
}

export const takeSnapshot = async () => {
  return await hre.network.provider.request({
    method: 'evm_snapshot',
    params: [],
  })
}

export const restoreSnapshot = async (id) => {
  await hre.network.provider.request({
    method: 'evm_revert',
    params: [id],
  })
}

export const increase = async (duration: string | BigNumber) => {
  if (!ethers.BigNumber.isBigNumber(duration)) {
    duration = ethers.BigNumber.from(duration)
  }

  if (duration.isNegative()) throw Error(`Cannot increase time by a negative amount (${duration})`)

  await hre.network.provider.request({
    method: 'evm_increaseTime',
    params: [duration.toNumber()],
  })

  await hre.network.provider.request({
    method: 'evm_mine',
  })
}

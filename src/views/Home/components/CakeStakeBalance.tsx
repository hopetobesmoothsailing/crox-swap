import React from 'react'
import { Text } from 'crox-uikit2.0'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import CardValue from './CardValue'

const CakeStakeBalance = ({stakeValue, isInvestor}) => {
  const { account } = useWallet()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ textAlign: 'center' }}>
          LOCKED
      </Text>
    )
  }

  return isInvestor ? <CardValue value={stakeValue} fontSize="14px" /> : <CardValue value={stakeValue} />
}

export default CakeStakeBalance

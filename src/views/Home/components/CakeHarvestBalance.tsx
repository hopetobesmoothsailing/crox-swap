import React from 'react'
import { Text } from 'crox-uikit2.0'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import useAllEarnings from 'hooks/useAllEarnings'
import CardValue from './CardValue'

const CakeHarvestBalance = ({earningsSum, isInvestor}) => {
  const TranslateString = useI18n()
  const { account } = useWallet()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ textAlign: 'center' }}>
        {TranslateString(298, 'Locked')}
      </Text>
    )
  }

  return isInvestor ? <CardValue value={earningsSum} fontSize="14px" /> : <CardValue value={earningsSum} />
}

export default CakeHarvestBalance

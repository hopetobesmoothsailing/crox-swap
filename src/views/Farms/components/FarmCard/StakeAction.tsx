import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal, Text } from 'crox-uikit2.0'
import useI18n from 'hooks/useI18n'
import { usePriceCakeBusd } from "state/hooks";
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  lpWorthValue?: any
  isTokenOnly?: boolean
  depositFeeBP?: number
  liquidityUrlPathParts?: any
  lpLabel?: any
}

const IconButtonWrapper = styled.div`
  width: 75%;
  margin-top: 5px;
  display: flex;
  text-align: left;
  svg {
    width: 20px;
  }
`

const BtnGrp = styled.div`
  fontSize: "20px"; 
  width: "60%"; 
  marginLeft: "15%"; 
  text-align: "center";
  @media screen and (max-width: 1000px) {
    margin: -1%;
    text-align: left;
  } 
`;

const StakeAction: React.FC<FarmCardActionsProps> = ({ 
  stakedBalance, 
  tokenBalance, 
  tokenName, 
  pid, 
  depositFeeBP, 
  lpWorthValue,
  isTokenOnly,
  liquidityUrlPathParts,
  lpLabel
}) => {
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} isTokenOnly={isTokenOnly} liquidityUrlPathParts={liquidityUrlPathParts} lpLabel={lpLabel} />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} isWithdraw/>,
  )
  const yourLPValue = stakedBalance
    ? new BigNumber(stakedBalance).div(`1e18`).times(lpWorthValue)
    : 0;

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button style={{ fontSize: "20px", width: "100%", height: "33px", borderRadius: "10px" }} onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
    ) : (
      <IconButtonWrapper>
        <Button size="sm" style={{padding: "0px 10px", borderRadius: "10px", backgroundColor:"#463E55"}} onClick={onPresentWithdraw} mr="6px">
          {/* <MinusIcon color="primary" /> */}
          Unstake
        </Button>
        <IconButton variant="tertiary"  style={{padding: "6px", borderRadius: "10px", height: "33%", width: "35%", backgroundColor:"#463E55"}} onClick={onPresentDeposit}>
          <AddIcon color="white" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    // <Flex justifyContent="space-between" alignItems="center">
    <Text style={{display: 'flex'}}> 
      <Text style={{ width: "50%" }}>
        <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}><Text style={{ margin: "1px" }} fontSize="20px" color="white">{displayBalance}</Text></Heading>
        <Text style={{ fontSize: "20px", fontWeight: "initial"}} color="white">${yourLPValue.toFixed(3)}</Text>
      </Text>
      <BtnGrp>
        {renderStakingButtons()}
      </BtnGrp>
    </Text>
    // </Flex>
  )
}

export default StakeAction

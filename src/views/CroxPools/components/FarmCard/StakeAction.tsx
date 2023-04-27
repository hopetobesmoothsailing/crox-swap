import React from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import {
  Button,
  Heading,
  IconButton,
  AddIcon,
  useModal,
  Text
} from "crox-uikit2.0";
import { usePriceCakeBusd } from "state/hooks";
import useI18n from "hooks/useI18n";
import useStake from "hooks/useStake";
import useUnstake from "hooks/useUnstake";
import { getBalanceNumber } from "utils/formatBalance";
import DepositModal from "../DepositModal";
import WithdrawModal from "../WithdrawModal";

interface FarmCardActionsProps {
  farm?: any;
  stakedBalance?: BigNumber;
  tokenBalance?: BigNumber;
  tokenName?: string;
  pid?: number;
  depositFeeBP?: number;
  tokenDecimal?: number;
  isTokenOnly?: boolean
  liquidityUrlPathParts?: any
  lpLabel?: any
  lpWorth?: any
  lpAddresses?: any
}

const IconButtonWrapper = styled.div`
  width: 75%;
  margin-top: 5px;
  display: flex;
  text-align: left;
  svg {
    width: 20px;
  }
`;

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
  farm,
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  lpLabel,
  depositFeeBP,
  tokenDecimal,
  lpWorth,
  lpAddresses
}) => {
  const TranslateString = useI18n();
  const { onStake } = useStake(pid);
  const { onUnstake } = useUnstake(pid);

  const rawStakedBalance = getBalanceNumber(
    new BigNumber(stakedBalance),
    tokenDecimal
  );
  const displayBalance = rawStakedBalance.toLocaleString();

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={tokenName}
      depositFeeBP={depositFeeBP}
      tokenDecimal={tokenDecimal}
      lpLabel={lpLabel}
      lpAddresses={lpAddresses}
    />
  );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake} 
      tokenName={tokenName}
      tokenDecimal={tokenDecimal}
    />
  );
  const cakePriceUsd = usePriceCakeBusd();
  let croxEarnedUsd = new BigNumber(lpWorth).multipliedBy(rawStakedBalance);
  if(tokenName === "CROX") {
    croxEarnedUsd = cakePriceUsd.multipliedBy(rawStakedBalance)
  }

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button style={{ fontSize: "20px", width: "100%", height: "33px", borderRadius: "10px" }} onClick={onPresentDeposit}>
        {TranslateString(999, "Stake")}
      </Button>
    ) : (
      <IconButtonWrapper>
        <Button size="sm" style={{padding: "0px 10px", borderRadius: "10px", backgroundColor:"#463E55"}} onClick={onPresentWithdraw} mr="6px">
          Unstake
        </Button>
        <IconButton variant="tertiary"  style={{padding: "6px", borderRadius: "10px", height: "33%", width: "35%", backgroundColor:"#463E55"}} onClick={onPresentDeposit}>
          <AddIcon color="primary" />
        </IconButton>
      </IconButtonWrapper>
    );
  };

  return (
    
    <Text style={{display: 'flex', justifyContent: "space-between"}}> 
      <Text style={{ width: "auto", marginLeft: "20px" }}>
        <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>
          <Text style={{ fontSize: "20px", margin: "1px"}} color="white">
            {displayBalance}
          </Text>
        </Heading>
        <Text style={{ fontSize: "20px", fontWeight: "initial"}} color="white">${croxEarnedUsd.toFixed(3)}</Text>
      </Text>      
      <BtnGrp>
        {renderStakingButtons()}
      </BtnGrp>
    </Text>
  );
};

export default StakeAction;

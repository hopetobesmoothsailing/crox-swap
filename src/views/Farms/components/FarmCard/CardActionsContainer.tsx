import React, { useMemo, useState, useCallback } from "react";
import BigNumber from "bignumber.js";
import styled, {keyframes} from "styled-components";
import { provider } from "web3-core";
import { getContract } from "utils/erc20";
import { Button, Flex, Text, Link, LinkExternal } from "crox-uikit";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import { Farm } from "state/types";
import { useFarmFromPid, useFarmUser } from "state/hooks";
import useI18n from "hooks/useI18n";
import UnlockButton from "components/UnlockButton";
import { useApprove } from "hooks/useApprove";
import { usePrevUnstake } from "hooks/useUnstake";
import { Address } from "config/constants/types";
import StakeAction from "./StakeAction";
import HarvestAction from "./HarvestAction";

const Action = styled.div`
  padding-top: 0px;
  display: inline-flex; 
  width: 100%;
  @media screen and (max-width: 1000px) {
    text-align: -webkit-center;
    width: 100%;
    display: inline-block;
  } 
`;

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`;

const HarvestContainer = styled.div`
  width: 30%;
  border: 1px solid black;
  border-radius: 20px;
  padding: 10px;
  margin: 0 2%;
  @media screen and (max-width: 1000px) {
    width: 98%;
    margin: 1%;
  } 
`;

const StakeContainer = styled.div`
  width: 30%;
  border: 1px solid black;
  border-radius: 20px;
  padding: 10px;
  margin: 0 1%;
  @media screen and (max-width: 1000px) {
    width: 98%;
    margin: 1%;
    padding: 15px;
  } 
`;

const DetailSectionsContainer = styled.div`
  padding: 2% 4%;
  width: rest;
  margin: 0 2%;
  @media screen and (max-width: 1000px) {
    text-align: center;
    width: 98%;
    margin: 1%;
  } 
`;

const MultiplierTag = styled.div`
    display: none;
    @media screen and (max-width: 1000px) {
      display: block;
      color: white;
    }
`;

const Fee = styled.div`
    display: none;
    @media screen and (max-width: 1000px) {
      display: block;
    }
`;

const Detailsection = styled.div`
  display: none;
  @media screen and (max-width: 1000px) {
    width: 98%;
    margin: 5% 1% 0% 1%;
    border: 1px solid black;
    padding: 15px;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
  }
`;

const Harvest = styled.div`
    display: none;
    @media screen and (max-width: 1000px) {
      display: block;
    }
`;

const LpWorth = styled.div`
    display: none;
    @media screen and (max-width: 1000px) {
      display: block;
    }
`;

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.primaryDark};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber;
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue;
  ethereum?: provider;
  account?: string;
  lpLabel?: string;
  bscScanAddress?: string;
  quoteTokenAdresses?: Address;
  quoteTokenSymbol?: string;
  yourStakedBalance?: any;
  harvestInterval?: any;
  lpWorthValue?: any;
  removed?: boolean;
  tokenDecimal?: any;
  isDualFarm?: any;
  isLPToken?: any;
}

const CardActions: React.FC<FarmCardActionsProps> = ({
  farm,
  lpWorthValue,
  ethereum,
  account,
  lpLabel,
  bscScanAddress,
  quoteTokenAdresses,
  quoteTokenSymbol,
  yourStakedBalance,
  harvestInterval,
  removed,
}) => {
  const TranslateString = useI18n();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const {
    pid,
    lpAddresses,
    tokenAddresses,
    isTokenOnly,
    depositFeeBP,
  } = useFarmFromPid(farm.pid);
  const {
    allowance,
    tokenBalance,
    stakedBalance,
    earnings,
    nextHarvestUntil,
  } = useFarmUser(pid);
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAdresses,
    quoteTokenSymbol,
    tokenAddresses,
  });
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID];
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];
  const lpName = farm.lpSymbol.toUpperCase();
  const isApproved = account && allowance && allowance.isGreaterThan(0);

  const lpContract = useMemo(() => {
    if (isTokenOnly) {
      return getContract(ethereum as provider, tokenAddress);
    }
    return getContract(ethereum as provider, lpAddress);
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly]);

  const { onApprove } = useApprove(lpContract);
  const { onPrevUnstake } = usePrevUnstake(farm.pidv1);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      await onApprove();
      setRequestedApproval(false);
    } catch (e) {
      console.error(e);
    }
  }, [onApprove]);

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        lpLabel={lpLabel}
        tokenName={lpName}
        pid={pid}
        liquidityUrlPathParts={liquidityUrlPathParts}
        depositFeeBP={depositFeeBP}
        lpWorthValue={lpWorthValue}
      />
    ) : (
      <Button
        mt="8px"
        disabled={requestedApproval}
        onClick={handleApprove}
        style={{ fontSize: "18px", width: "100%", height: "33px", borderRadius: "10px" }}
      >
        {requestedApproval ? "Approving..." : TranslateString(999, "Approve Contract")}
      </Button>
    );
  };

  return (
    <Action>
      {removed ? (<div />) : (
        <Detailsection>
          <LpWorth>
            <Text color="textSubtle" style={{ fontSize: "15px"}}>
              <p>Lp Worth</p>
            </Text>
            <Text color="textSubtle" style={{ fontSize: "15px"}}>
              {lpWorthValue}
            </Text>
          </LpWorth>
          <MultiplierTag>
            <Text color="textSubtle" style={{ fontSize: "15px" }}>
              Multiplier
            </Text>
            <Text color="textSubtle" style={{ fontSize: "15px" }}>
              {farm.multiplier}
            </Text>
          </MultiplierTag>   
          <Fee>
            <Text color="textSubtle" style={{ fontSize: "15px" }}>
              Fees
            </Text>
            <Text color="textSubtle" bold style={{ fontSize: "15px" }}>
              {farm.depositFeeBP / 100}%
            </Text>
          </Fee>
          <Harvest>
            <Text color="textSubtle" style={{ fontSize: "15px" }}>
              {TranslateString(10006, "Harvest Lock")}
            </Text>
            <Text color="textSubtle" bold style={{ fontSize: "15px" }}>
              {harvestInterval} hours
            </Text>
          </Harvest>
        </Detailsection>
      )}
      
      {/* {farm.pidv1 && (
        <Button
          size="sm"
          variant="secondary"
          marginBottom="15px"
          onClick={() => onPrevUnstake()}
        >
          {TranslateString(10007, "Unstake From Old Farm")}
        </Button>
      )} */}
      {/* <Flex>
        <Text
          bold
          textTransform="uppercase"
          color="primary"
          fontSize="12px"
          pr="3px"
        >
          
          CROX
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {TranslateString(999, "Earned")}
        </Text>
      </Flex> */}
      
      {(farm.tokenSymbol === "CROX" || farm.tokenSymbol === "RASTA") && (
          <StyledCardAccent />
        )}
      <HarvestContainer>
        <HarvestAction
          yourStakedBalance={yourStakedBalance}
          earnings={earnings}
          pid={pid}
          nextHarvestUntil={Number(nextHarvestUntil)}
        />
      </HarvestContainer>
      <StakeContainer>
        <Flex>
          <Text
            bold
            textTransform="uppercase"
            color="primary"
            fontSize="15px"
            pr="3px"
          >
            {lpName}
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="15px">
            {TranslateString(999, "Staked")}
          </Text>
        </Flex>
        {!account ? (
          <UnlockButton mt="8px" fullWidth />
        ) : (
          renderApprovalOrStakeButton()
        )}
      </StakeContainer>
      <DetailSectionsContainer>
        <Flex justifyContent="space-between">
          {/* <Text color="textSubtle">{TranslateString(316, "Stake")}:</Text> */}
          <StyledLinkExternal
            href={
              isTokenOnly
                ? `https://exchange.croxswap.com/#/swap/${
                    tokenAddresses[process.env.REACT_APP_CHAIN_ID]
                  }`
                : `https://exchange.croxswap.com/#/add/${liquidityUrlPathParts}`
            }
          >
            <Text style={{ fontSize: "20px" }} color="white">Get {lpLabel}</Text>
          </StyledLinkExternal>
        </Flex>
        {/* {!removed && (
          <Flex justifyContent="space-between">
            <Text color="textSubtle">
              {TranslateString(23, "Total Liquidity")}:
            </Text>
            <Text color="textSubtle">{totalValueFormated}</Text>
          </Flex>
        )} */}
        {/* <Flex justifyContent="space-between">
          <Text color="textSubtle">Your LP Value</Text>
          <Text color="textSubtle">${yourLPValue.toFixed(2)}</Text>
        </Flex> */}
        {/* {!removed && (
          <Flex justifyContent="space-between">
            <Text color="textSubtle">{TranslateString(10009, "LP Worth")}:</Text>
            <Text color="textSubtle">${lpWorth}</Text>
          </Flex>
        )} */}
        <Flex justifyContent="flex-start">
          <Link external href={bscScanAddress} bold={false}>
            <Text style={{ fontSize: "20px" }} color="white">{TranslateString(356, "View on BscScan")}</Text>
          </Link>
        </Flex>
      </DetailSectionsContainer>
    </Action>
  );
};

export default CardActions;

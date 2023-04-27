import React, { useMemo, useState, useCallback } from "react";
import BigNumber from "bignumber.js";
import styled, { keyframes } from "styled-components";
import { provider } from "web3-core";
import { getContract } from "utils/erc20";
import { Button, Flex, Text } from "crox-uikit";
import { Farm } from "state/types";
import {
  useDualFarmFromPid,
  useDualFarmUser,
} from "state/hooks";
import useI18n from "hooks/useI18n";
import UnlockButton from "components/UnlockButton";
import { useDualApprove } from "hooks/useApprove";
import { QuoteToken } from "config/constants/types";
import StakeAction from "./StakeAction";
import HarvestAction from "./HarvestAction";
import DetailsSection from "./DetailsSection";

const Action = styled.div`
  margin-top: 1%;
  padding-top: 0px;
  display: -webkit-box;
  width: 100%;
  @media screen and (max-width: 1000px) {
    padding: 0 5%;
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
  width: 25%;
  border: 1px solid black;
  border-radius: 20px;
  padding: 10px;
  margin: 0 1%;
  @media screen and (max-width: 1000px) {
    width: 98%;
    margin: 2% 1%;
  }
`;

const MinStake = styled.div`
  display: none;
  @media screen and (max-width: 1000px) {
    display: block;
  }
`;
const Fee = styled.div`
  display: none;
  @media screen and (max-width: 1000px) {
    display: block;
  }
`;

const Poolday = styled.div`
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

const StakeContainer = styled.div`
  width: 25%;
  border: 1px solid black;
  border-radius: 20px;
  padding: 2% 10px;
  margin: 0 1%;
  @media screen and (max-width: 1000px) {
    width: 98%;
    margin: 1%;
    padding: 15px;
  }
`;

const MissDetailsection = styled.div`
  display: none;
  @media screen and (max-width: 1000px) {
    width: 88%;
    margin: 5% 6% -1% 6%;
    border: 1px solid black;
    padding: 15px;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
  }
`;

export interface DualFarmWithStakedValue extends Farm {
  apy?: BigNumber;
  poolAddress?: any;
}

interface FarmCardActionsProps {
  farm: DualFarmWithStakedValue;
  ethereum?: provider;
  account?: string;
  cakePrice?: BigNumber;
  bnbPrice?: BigNumber;
  poolEnds?: any;
  removed: boolean;
  lpWorthValue?: any;
  tokenDecimal?: number;
  harvestLockDay?: any;
  minFirstDeposit?: number;
}

const CardActions: React.FC<FarmCardActionsProps> = ({
  farm,
  ethereum,
  account,
  cakePrice,
  bnbPrice,
  lpWorthValue,
  tokenDecimal,
  harvestLockDay,
  poolEnds,
  removed,
  minFirstDeposit,
}) => {
  const TranslateString = useI18n();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const {
    lpAddresses,
    tokenAddresses,
    isTokenOnly,
    depositFeeBP,
  } = useDualFarmFromPid(farm.poolAddress);
  const {
    allowance,
    tokenBalance,
    stakedBalance,
    earnings,
    nextHarvestUntil,
  } = useDualFarmUser(farm.poolAddress);
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID];
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];
  const lpName = farm.lpSymbol.toUpperCase();
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpContract = useMemo(() => {
    if (isTokenOnly) {
      return getContract(ethereum as provider, tokenAddress);
    }
    return getContract(ethereum as provider, lpAddress);
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly]);

  const { onApprove } = useDualApprove(lpContract, farm.poolAddress);

  const lpLabel = farm.lpSymbol;
  const withdrawFee = farm.tokenSymbol === "GREM" ? 40 : 10;
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
        removed={removed}
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        lpWorthValue={lpWorthValue}
        liquidityUrlPathParts={(farm as any).depositLink}
        lpLabel={lpLabel}
        isLPToken={(farm as any).isLPToken}
        tokenName={lpName}
        secondSymbol={farm.tokenSymbol}
        pid={farm.poolAddress}
        depositFeeBP={depositFeeBP}
        isTokenOnly={isTokenOnly}
        isWhalePool={(farm as any).isWhalePool}
        isShrimpPool={(farm as any).isShrimpPool}
        tokenDecimal={(farm as any).tokenDecimal}
        depositLink={(farm as any).depositLink}
        isDualFarm={(farm as any).isDualFarm}
        minFirstDeposit={(farm as any).minFirstDeposit}
        maxFirstDeposit={(farm as any).maxFirstDeposit}
        withdrawFee={withdrawFee}
        minStaking={(farm as any).minStaking}
        withdrawModalHint={
          ((farm as any).isDualFarm || withdrawFee === 40) &&
          `${withdrawFee}% unstaking Penalty if withdrawn before ${(farm as any).minStaking || 30
          } days or Rewards End
        Block. No fees after  ${(farm as any).minStaking || 30
          }days or Pool End Date. Fees charged will be
        used to Buy Back & Burn CROX`
        }
      />
    ) : (
      <>
        {(farm as any).minFirstDeposit && !removed && (
          <Text color="primary">Min Stake Limit: {(farm as any).minFirstDeposit} {lpLabel}</Text>
        )}
        <Button
          mt="8px"
          fullWidth
          disabled={requestedApproval}
          onClick={handleApprove}
          style={{ fontSize: "18px", width: "100%", height: "30px", borderRadius: "8px" }}
        >
          {requestedApproval ? "Approving..." : TranslateString(999, "Approve Contract")}
        </Button>
      </>
    );
  };

  return (
    <>
      {removed ? (<div />) : (
        <MissDetailsection>
          {/* <LpWorth>
            <Text color="textSubtle" style={{ fontSize: "15px"}}>
              <p>Lp Worth</p>
            </Text>
            <Text color="textSubtle" style={{ fontSize: "15px"}}>
              {lpWorthValue}
            </Text>
          </LpWorth> */}
          {((farm as any).isDualFarm || (farm as any).isLPToken || (farm as any).tokenSymbol === "GREM") && (
            <MinStake>
              <Flex justifyContent="space-between" style={{ display: "block" }}>
                <Text color="textSubtle" style={{ fontSize: "15px" }}>
                  Min Staking:
                </Text>
                <Text color="textSubtle" bold style={{ fontSize: "15px" }}>
                  {(farm as any).minStaking || 30} days
                </Text>
              </Flex>
            </MinStake>
          )}
          <Fee>
            <Flex justifyContent="space-between" style={{ display: "block" }}>
              <Text color="textSubtle" style={{ fontSize: "15px" }}>
                {(farm as any).isDualFarm || (farm as any).isLPToken
                  ? "Fee"
                  : "Burn Fee"}
                :
              </Text>
              <Text color="textSubtle" bold style={{ fontSize: "15px" }}>
                {farm.depositFeeBP / 100}%
              </Text>
            </Flex>
          </Fee>
          <Poolday>
            <Flex justifyContent="space-between" style={{ display: "block" }}>
              <Text color="textSubtle" style={{ fontSize: "15px" }}>
                Pool Ends In
              </Text>
              <Text color="textSubtle" bold style={{ fontSize: "15px" }}>
                {poolEnds} days
              </Text>
            </Flex>
          </Poolday>
        </MissDetailsection>
      )}
      <Action>
        {(farm.quoteTokenSymbol === QuoteToken.CAKE ||
          (farm as any).showBackground) && <StyledCardAccent />}
        <HarvestContainer>
          <HarvestAction
            removed={removed}
            harvestLockDay={harvestLockDay}
            firstSymbol={!(farm as any).isDualFarm && ((farm as any).isWhalePool || (farm as any).isShrimpPool) ? "CRUSH" : "CROX"}
            secondSymbol={!(farm as any).isDualFarm && ((farm as any).isWhalePool || (farm as any).isShrimpPool) ? "CNR" : farm.tokenSymbol}
            earnings={earnings}
            pid={farm.poolAddress}
            nextHarvestUntil={Number(nextHarvestUntil)}
            isDualFarm={(farm as any).isDualFarm}
            isWhalePool={(farm as any).isWhalePool}
            isShrimpPool={(farm as any).isShrimpPool}
            tokenDecimal={(farm as any).tokenDecimal}
            tokenPrice={(farm as any).tokenPrice}
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
          {!removed && (
            <Text color="textSubtle" fontSize="12px" style={{ marginTop: "1%" }}>
            {(farm as any).isLPToken === true ||
              (farm as any).isHintVisible === false ||
              (farm as any).isDualFarm === true ||
              (farm as any).isWhalePool === true ||
              (farm as any).isShrimpPool === true
              ? ""
              : "Max Stake: 8000 CROX per wallet"}
            {(farm as any).isWhalePool && !(farm as any).isDualFarm && "Max Staked: 12000 CROX per wallet"}
            {(farm as any).isShrimpPool && !(farm as any).isDualFarm && "Max Staked: 2500 CROX per wallet"}
            </Text>
          )}
        </StakeContainer>
        {removed ? (<div />) : (
          <DetailsSection
            removed={removed}
            depositLink={(farm as any).depositLink}
            bscScanAddress={
              farm.isTokenOnly
                ? `https://bscscan.com/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]
                }`
                : `https://bscscan.com/token/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]
                }`
            }
            // totalValueFormated={totalValueFormated}
            stakedBalance={(farm as any)?.userData?.stakedBalance}
            redeemableAmount={(farm as any)?.userData?.redeemable}
            tokenDecimal={(farm as any).tokenDecimal}
            lpLabel={lpLabel}
            bonusEndBlock={(farm as any).bonusEndBlock}
            isDualFarm={(farm as any).isDualFarm}
            isLPToken={(farm as any).isLPToken}
            projectLink={(farm as any).projectLink}
            reward1={(farm as any).reward1}
            reward2={(farm as any).reward2}
            tokenSymbol={farm.tokenSymbol}
            isWhalePool={(farm as any).isWhalePool}
            isShrimpPool={(farm as any).isShrimpPool}
          />
        )}


      </Action>
    </>
  );
};

export default CardActions;

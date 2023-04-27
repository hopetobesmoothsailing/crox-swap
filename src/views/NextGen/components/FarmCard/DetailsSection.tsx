import React from "react";
import useI18n from "hooks/useI18n";
import styled from "styled-components";
import { Text, Flex, Link, LinkExternal } from "crox-uikit";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import { Address } from "config/constants/types";
import BigNumber from "bignumber.js";
import { usePriceCakeBusd } from "state/hooks";

export interface ExpandableSectionProps {
  isLPToken?: boolean;
  isDualFarm?: boolean;
  bscScanAddress?: string;
  removed?: boolean;
  lpLabel?: string;
  lpWorth?: string;
  projectLink?: string;
  depositLink?: string;
  bonusEndBlock?: any;
  stakedBalance?: string;
  redeemableAmount?: string;
  isWhalePool?: boolean;
  isShrimpPool?: boolean;
  tokenDecimal?: number;
  tokenSymbol?: string;
  reward1?: number;
  reward2?: number;
}

const Wrapper = styled.div`
  padding-top: 0px;
  display: inline-flex;
  width: 46%;
  @media screen and (max-width: 1000px) {
    text-align: -webkit-center;
    width: 100%;
    display: inline-block;
  }
`;

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textSubtle};
  display: flex;
  align-items: center;
  font-size: 14px;
  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

const DepositContainer = styled.div`
  width: 100%;
  border: 1px solid black;
  border-radius: 20px;
  padding: 10px;
  margin: 0 2%;
  @media screen and (max-width: 1000px) {
    width: 98%;
    margin: 1%;
    padding: 15px;
  }
`;

const DetailContainer = styled.div`
  padding: 2% 4%;
  width: 80%;
  margin: 0 2%;
  @media screen and (max-width: 1000px) {
    text-align: center;
    width: 98%;
    margin: 1%;
  }
`;

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  isDualFarm,
  bscScanAddress,
  removed,
  lpLabel,
  lpWorth,
  depositLink,
  bonusEndBlock,
  projectLink,
  isLPToken,
  stakedBalance,
  tokenSymbol,
  tokenDecimal,
  redeemableAmount,
  isWhalePool,
  isShrimpPool,
  reward1,
  reward2,
}) => {
  const cakePriceUsd = usePriceCakeBusd();
  const TranslateString = useI18n();
  let yourLPValue = stakedBalance
    ? new BigNumber(stakedBalance).div(`1e${tokenDecimal ?? 18}`).times(lpWorth)
    : 0;

  if (!isLPToken && !isDualFarm) {
    yourLPValue = stakedBalance
      ? new BigNumber(stakedBalance).div(`1e18`).times(cakePriceUsd)
      : 0;
  }

  const redeemable = redeemableAmount
    ? new BigNumber(redeemableAmount).div("1e18").toString()
    : 0;

  return (
    <Wrapper>
      {isDualFarm || isLPToken ? (
        <DepositContainer>
          {!removed && (
            <Flex justifyContent="space-between">
              <Text color="textSubtle">
                {TranslateString(23, "Rewards End Block")}:
              </Text>
              <StyledLinkExternal
                href={`https://bscscan.com/block/countdown/${bonusEndBlock}`}
              >
                {bonusEndBlock}
              </StyledLinkExternal>
            </Flex>
          )}
          {!removed && (
            <Flex justifyContent="space-between">
              <Text color="textSubtle">Total Rewards</Text>
              <Flex flexDirection="column">
                {reward1 && <Text color="textSubtle">{reward1} CROX</Text>}
                {reward2 && (
                  <Text color="textSubtle">{`${reward2} ${tokenSymbol}`} </Text>
                )}
              </Flex>
            </Flex>
          )}
          {!removed && (isDualFarm || isLPToken) && (
            <Flex justifyContent="space-between">
              <Text color="textSubtle">Withdrawable LP:</Text>
              <Text color="textSubtle">{redeemable}</Text>
            </Flex>
          )}
          {/* <Flex justifyContent="space-between">
            <Text color="textSubtle">Last Deposit:</Text>
            <StyledLinkExternal href={depositLink}>20th Sep, 2021</StyledLinkExternal>
          </Flex> */}
        </DepositContainer>
      ) : (
        <DepositContainer>
          {!removed && (
            <Flex justifyContent="space-between">
              <Text color="textSubtle">
                {TranslateString(23, "Rewards End Block")}:
              </Text>
              <StyledLinkExternal
                href={`https://bscscan.com/block/countdown/${bonusEndBlock}`}
              >
                {bonusEndBlock}
              </StyledLinkExternal>
            </Flex>
          )}
          {!removed && (
            <Flex justifyContent="space-between">
              <Text color="textSubtle">Total Rewards</Text>
              {(isWhalePool || isShrimpPool) ? (
                <Flex flexDirection="column">
                  {reward1 && <Text color="textSubtle">{reward1} CRUSH</Text>}
                  {reward2 && (
                    <Text color="textSubtle">{reward2} CNR</Text>
                  )}
                </Flex>
              ) : (
                <Flex flexDirection="column">
                  {reward1 && <Text color="textSubtle">{reward1} CROX</Text>}
                  {reward2 && (
                    <Text color="textSubtle">{`${reward2} ${tokenSymbol}`} </Text>
                  )}
                </Flex>
              )}
            </Flex>
          )}
        </DepositContainer>
      )}
      {isDualFarm || isLPToken ? (
        <DetailContainer>
          <Flex justifyContent="space-between">
            <Text color="textSubtle" fontSize="14px">Get:</Text>
            <StyledLinkExternal href={depositLink}>{lpLabel}</StyledLinkExternal>
          </Flex>
          <Flex justifyContent="flex-start">
            <Link external href={bscScanAddress} bold={false}>
              {TranslateString(356, "View on BscScan")}
            </Link>
          </Flex>
          <Flex justifyContent="flex-start">
            <Link external href={projectLink} bold={false}>
              View Project Site
            </Link>
          </Flex>
        </DetailContainer>
      ) : (
        <DetailContainer>
        <Flex justifyContent="space-between">
          <Text color="textSubtle" fontSize="14px">Get:</Text>
          <StyledLinkExternal href={depositLink}>{lpLabel}</StyledLinkExternal>
        </Flex>
          <Flex justifyContent="flex-start">
            <Link external href={projectLink} bold={false}>
              View Project Site
            </Link>
          </Flex>
        </DetailContainer>
      )}
    </Wrapper>
  );
};

export default DetailsSection;

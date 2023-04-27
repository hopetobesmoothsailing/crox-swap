import React, { useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import styled, { keyframes } from "styled-components";
import { Flex, Text, Heading, Skeleton } from "crox-uikit";
import { Farm } from "state/types";
import { provider } from "web3-core";
import { useCroxPoolUser } from "state/hooks";
import useI18n from "hooks/useI18n";
import ExpandableSectionButton from "components/ExpandableSectionButton";
import { NoFeeTag } from 'components/Tags'
import { QuoteToken } from "config/constants/types";
import { getBalanceNumber } from "utils/formatBalance";
import CardHeading from "./CardHeading";
import CardActionsContainer from "./CardActionsContainer";
import ApyButton from "./ApyButton";

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber;
  harvestInterval?: number;
}

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

const CardContainer = styled.div`
  margin-bottom: 10px;
  align-self: baseline;
  background: #121827;
  border-radius: 20px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1),
    0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  text-align: center;
`;

const FCard = styled.div`
  width: 100%;
  align-self: baseline;
  display: block;
  flex-direction: column;
  justify-content: space-around;
  padding: 12px 10px 0 10px;
  position: relative;
  text-align: center;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: inline-flex;
  @media screen and (max-width: 700px) {
    width: 100%;
    display: flex;
  } 
`;

const TokenName = styled.div`
  width: 20%;
  float: left;
  text-align: center;
  @media screen and (max-width: 700px) {
    width: 20%;
    text-align: center;
    display: inline-block;
  } 
`;

const EarnToken = styled.div`
    padding-top: 4px;
    padding-right: 2%;
    text-align: right;
    width:25%;
    display: inline-flex;
    color: white;
    @media screen and (max-width: 700px) {
      display: none;
    } 
`;

const Apr = styled.div`
  width: 20%;
  @media screen and (max-width: 700px) {
    width: 27%;
    display: inline-block;
    padding-left: 8%;
  }
  @media screen and (max-width: 450px) {
    width: 27%;
    display: inline-block;
    padding-left: 10%;
  }
`;

const TotalValue = styled.div`
    width: 18%;
    @media screen and (max-width: 700px) {
      width: 30%;
      display: inline-block;
    }
    @media screen and (max-width: 450px) {
      width: 35%;
      display: inline-block;
      padding-left: 7%;
    }
`;

const MultiplierTag = styled.div`
    color: white;
    width: 15%;
    @media screen and (max-width: 700px) {
      display: none;
    }
`;

const Fee = styled.div`
    width: 7%;
    @media screen and (max-width: 700px) {
      display: none;
    }
`;

const Harvest = styled.div`
    width: 20%;
    @media screen and (max-width: 700px) {
      display: none;
    }
`;

const FinishedText = styled.div`
  @media screen and (max-width: 450px) {
    svg {
      width: 150px;
      height: 30px;
    }
  }
`;

const UnstakeText = styled.p`
  font-size: 15px;
  color: white;
  font-weight: 600;
`;

const FinishHeadingText = styled.p`
  font-size: 20px;
  color: white;
  font-weight: 600;
  width: 5%;
  margin-top: 1.4%;
  @media screen and (max-width: 550px) {
    margin-top: 3%;
    margin-left: 5%;
  } 
`;

const HeadingText = styled.p`
  font-size: 20px;
  color: white;
  font-weight: 600;
  width: 5%;
  margin-top: 10%;
  @media screen and (max-width: 550px) {
    margin-top: 18%;
    margin-left: 25%;
  } 
`;

const FinishDetailSection = styled.div`
    margin-left: -12%;
    width: 100%;
    display: block;
    @media screen and (max-width: 1000px) {
      width: 70%;
      margin-left: 10%;
    } 
`;

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  background-color: #343135;
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  border: ${(props) => (props.expanded ? "2px solid #121827" : 0)};
  overflow: hidden;
  border-radius: 0 0 20px 20px;
`;

interface FarmCardProps {
  farm: FarmWithStakedValue;
  removed: boolean;
  cakePrice?: BigNumber;
  bnbPrice?: BigNumber;
  ethereum?: provider;
  account?: string;
  multiplier?: string;
  depositFee?: number;

}

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  removed,
  cakePrice,
  bnbPrice,
  ethereum,
  account,
  multiplier,
  depositFee,
}) => {
  const TranslateString = useI18n();

  const [showExpandableSection, setShowExpandableSection] = useState(false);

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const farmImage = farm.lpSymbol.toLowerCase();

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null;
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken);
    }
    if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
      return cakePrice.times(farm.lpTotalInQuoteToken);
    }
    return farm.lpTotalInQuoteToken;
  }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol]);

  const lpLabel = farm.lpSymbol;
  const farmAPY =
    farm.apy &&
    farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const totalValueFormated = `$${(getBalanceNumber(
    new BigNumber(farm.lpTotalSupply).multipliedBy(farm.tokenPrice),
    (farm as any).tokenDecimals
  )).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`

  const {
    quoteTokenAdresses,
    quoteTokenSymbol,
    tokenAddresses,
    risk,
    pid,
  } = farm;
  const {
    earnings,
  } = useCroxPoolUser(pid);
  const rawEarningsBalance = getBalanceNumber(earnings);
  const displayBalance = rawEarningsBalance.toLocaleString();

  return (
    <CardContainer>
      {/* <Text
        color="white"
        bold
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 20,
          justifyContent: "center",
          background: "#FE8464",
          borderRadius: "13px 13px 0px 0px",
          height: 40,
        }}
      >
        {farm.title}
      </Text> */}
      <FCard onClick={() => setShowExpandableSection(!showExpandableSection)}>
        {lpLabel === "CROX" && <StyledCardAccent />}
        {removed ? (
          <HeaderContainer>
            <CardHeading
              lpLabel={lpLabel}
              risk={risk}
              farmImage={farmImage}
              tokenSymbol={farm.tokenSymbol}
            />
            <FinishHeadingText>{lpLabel}</FinishHeadingText>
            <FinishDetailSection>
              <FinishedText>
                <svg width="210" height="42" viewBox="0 0 151 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.907031 14.05L3.58203 16.65L3.58203 22.775L0.907031 25.225L0.907031 14.05ZM3.80703 14.95C3.19036 14.4667 2.60703 14.0083 2.05703 13.575L3.80703 12.25L10.632 12.25L12.382 13.575L10.632 14.95L3.80703 14.95ZM1.60703 0.924999L12.782 0.924999L10.357 3.625H4.18203L1.60703 0.924999ZM0.882031 13.175V2L3.55703 4.425V10.625L0.882031 13.175ZM27.8271 25.225L25.1271 22.65V16.5L27.8271 14.05V25.225ZM27.7771 2V13.175L25.0771 10.75V4.575L27.7771 2ZM38.4973 11.925V0.699999L41.1973 3.175V9.35L38.4973 11.925ZM53.7223 0.699999V11.925L51.0223 9.45V3.3L53.7223 0.699999ZM38.4223 12.775L41.1223 15.35V21.525L38.4223 23.975V12.775ZM53.6473 23.975L50.9473 21.375V15.225L53.6473 12.775V23.975ZM42.4723 8.1V3.025L49.5723 14.975V20.075L42.4723 8.1ZM67.0674 25.225L64.3674 22.65V16.5L67.0674 14.05V25.225ZM67.0174 2V13.175L64.3174 10.75V4.575L67.0174 2ZM79.7375 26.325L82.3125 23.625L88.4875 23.625L90.9125 26.325L79.7375 26.325ZM91.7125 25.225L89.0125 22.65V16.5L91.7125 14.05V25.225ZM81.8875 14.95C81.3042 14.4833 80.7125 14.025 80.1125 13.575L81.8875 12.25H88.7125L90.4625 13.575L88.7125 14.95H81.8875ZM79.7125 0.924999L90.8875 0.924999L88.4125 3.625L82.2875 3.625L79.7125 0.924999ZM78.9125 13.175V2L81.6125 4.425V10.625L78.9125 13.175ZM98.6076 14.05L101.308 16.65V22.775L98.6076 25.225V14.05ZM111.333 25.225L108.633 22.65V16.5L111.333 14.05V25.225ZM101.508 14.95C100.924 14.4833 100.333 14.025 99.7326 13.575L101.508 12.25L108.333 12.25L110.083 13.575L108.333 14.95L101.508 14.95ZM98.5326 13.175V2L101.233 4.425V10.625L98.5326 13.175ZM111.258 2V13.175L108.558 10.75V4.575L111.258 2ZM119.353 26.325L121.928 23.625H128.103L130.553 26.325H119.353ZM118.628 14.05L121.303 16.65V22.775L118.628 25.225V14.05ZM121.503 14.95C120.886 14.4667 120.303 14.0083 119.753 13.575L121.503 12.25H128.328L130.078 13.575L128.328 14.95H121.503ZM119.328 0.924999L130.478 0.924999L128.053 3.625L121.878 3.625L119.328 0.924999ZM118.553 13.175V2L121.228 4.425V10.625L118.553 13.175ZM138.598 26.325L141.173 23.625H147.348L149.773 26.325H138.598ZM137.848 14.05L140.548 16.65V22.775L137.848 25.225V14.05ZM150.573 25.225L147.873 22.65V16.5L150.573 14.05V25.225ZM138.573 0.924999L149.748 0.924999L147.273 3.625L141.148 3.625L138.573 0.924999ZM137.773 13.175V2L140.473 4.425V10.625L137.773 13.175ZM150.498 2V13.175L147.798 10.75V4.575L150.498 2Z" fill="white" />
                </svg>
              </FinishedText>
              <UnstakeText>Unstake Anytime</UnstakeText>
            </FinishDetailSection>
            <ExpandableSectionButton
              onClick={() => setShowExpandableSection(!showExpandableSection)}
              expanded={showExpandableSection}
            />
          </HeaderContainer>
        ) : (
          <HeaderContainer>
            <CardHeading
              lpLabel={lpLabel}
              risk={risk}
              farmImage={farmImage}
              tokenSymbol={farm.tokenSymbol}
            />
            <TokenName>
              <HeadingText>{lpLabel}</HeadingText>
              <Flex justifyContent="center">
                {depositFee === 0 ? <NoFeeTag /> : null}
              </Flex>
            </TokenName>
            <EarnToken>
              <Text color="textSubtle" style={{ fontSize: "15px", display: "block", margin: "1% 0 0 0" }}>
                <p style={{ color: "#31D0D0" }}>REWARDS</p> {displayBalance}
              </Text>
              <Text color="textSubtle" style={{ fontSize: "15px", margin: "1% 0 0 4px" }}>
                Earned
              </Text>
            </EarnToken>
            <Apr>
              <Text color="textSubtle" style={{ fontSize: "15px", paddingLeft: "15%", textAlign: "left" }}>{TranslateString(352, "APR")}</Text>
              <Text
                color="textSubtle"
                bold
                style={{ display: "flex", alignItems: "center", fontSize: "15px" }}
              >
                {farm.apy ? (
                  <>
                    {farmAPY}%
                    <ApyButton
                      lpLabel={lpLabel}
                      quoteTokenAdresses={quoteTokenAdresses}
                      quoteTokenSymbol={quoteTokenSymbol}
                      tokenAddresses={tokenAddresses}
                      cakePrice={cakePrice}
                      apy={farm.apy}
                    />
                  </>
                ) : (
                  <Skeleton height={24} width={80} />
                )}
              </Text>
            </Apr>
            <TotalValue>
              <Text color="textSubtle" style={{ fontSize: "15px" }}>
                Liquidity
              </Text>
              <Text color="textSubtle" style={{ fontSize: "15px" }}>
                {totalValueFormated}
              </Text>
            </TotalValue>
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
                Fee
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
                {Number(farm.harvestInterval / 3600.0).toFixed()} hours
              </Text>
            </Harvest>
            <ExpandableSectionButton
              onClick={() => setShowExpandableSection(!showExpandableSection)}
              expanded={showExpandableSection}
            />
          </HeaderContainer>
        )}
      </FCard>
      <ExpandingWrapper expanded={showExpandableSection}>
        <CardActionsContainer
          tokenSymbol={farm.tokenSymbol}
          removed={removed}
          harvestInterval={Number(farm.harvestInterval / 3600.0).toFixed()}
          farm={farm}
          ethereum={ethereum}
          account={account}
          lpLabel={lpLabel}
        />
      </ExpandingWrapper>
    </CardContainer>
  );
};

export default FarmCard;

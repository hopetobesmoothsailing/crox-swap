import React, { useMemo, useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import styled, { keyframes } from "styled-components";
import { Flex, Text, Skeleton, Tag } from "crox-uikit2.0";
import { useDualFarmUser } from "state/hooks";
import { Farm } from "state/types";
import { provider } from "web3-core";
import { NoFeeNoIconTag } from "components/Tags";
import { BLOCKS_PER_DAY } from "config";
import useI18n from "hooks/useI18n";
import useWeb3 from "hooks/useWeb3";
import ExpandableSectionButton from "components/ExpandableSectionButton";
import { QuoteToken } from "config/constants/types";
import { getBalanceNumber } from "utils/formatBalance";
import CardHeading from "./CardHeading";
import CardActionsContainer from "./CardActionsContainer";
import ApyButton from "./ApyButton";
import "./Whalepool.scss";

export interface FarmWithStakedValue extends Farm {
  apy1?: BigNumber;
  apy2?: BigNumber;
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

const CardPoolTitle = styled.div`
  position: absolute;
  font-family: "Baloo 2", cursive;
  top: 0px;
  width: 100px;
  font-size: 15px;
  font-weight: 700;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0498ae;
  color: white;
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
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px 20px 0px 20px;
  position: relative;
  text-align: center;
  @media screen and (max-width: 1000px) {
    padding: 17px 10px 17px 10px;
    display: -webkit-inline-box;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 1000px) {
    width: 100%;
  }
`;

const ExchangeToken = styled.div`
  width: 25%;
  font-size: 19px;
  color: #c9c4d4;
  padding-top: 1%;
  // margin-left: -3%;
  text-align: left;

  @media screen and (max-width: 1000px) {
    width: 35%;
    text-align: left;
    display: inline-block;
    margin: auto;
    vertical-align: super;
  }
`;

const CakeLP = styled.div`
  width: 9%;
  padding: 13px 20px 0 10px;
  color: #31d0d0;
  font-size: 15px;
  @media screen and (max-width: 550px) {
    display: none;
  }
  @media screen and (max-width: 1000px) {
    width: 15%;
  }
`;

const StakeToken = styled.div`
  text-align: left;
  padding-top: 1%;
  width: 30%;
  font-size: 18px;
  color: #c9c4d4;
  @media screen and (max-width: 1000px) {
    width: 45%;
    display: inline-block;
  }
`;

const EarnToken = styled.div`
  display: inline-flex;
  width: 12%;
  font-size: 18px;
  color: #c9c4d4;
  @media screen and (max-width: 1000px) {
    width: 25%;
    display: block;
  }
  @media screen and (max-width: 700px) {
    display: none;
  }
`;

const EarnTokenNext = styled.div`
  padding-top: 4px;
  padding-right: 2%;
  text-align: center;
  width: 20%;
  display: inline-flex;
  color: white;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const CakeLPNext = styled.div`
  padding-top: 4px;
  padding-right: 2%;
  text-align: center;
  width: 20%;
  display: inline-flex;
  color: white;
  justify-content: center;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  width: 100%;
  background-color: #343135;
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  border: ${(props) => (props.expanded ? "2px solid #121827" : 0)};
  overflow: hidden;
  border-radius: 0 0 20px 20px;
  @media screen and (max-width: 1000px) {
    display: inline-block;
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

const FinishDetailSection = styled.div`
  margin-left: -12%;
  width: 100%;
  display: block;
  @media screen and (max-width: 1000px) {
    width: 100%;
    margin-left: 0;
  }
`;

const APRInfo = styled.div`
  position: absolute;
  width: 100px;
  background: rgba(122, 230, 246, 0.3);
  left: 100%;
  top: -140%;
  z-index: 10;

  span {
    font-size: 12px;
    line-height: 13px;

    color: #1afac4;
  }
`;

const TokenImg = styled.div`
  @media screen and (max-width: 1000px) {
  }
`;

const APR = styled.div`
  display: block;
  width: 8%;
  @media screen and (max-width: 1000px) {
    width: 15%;
    display: inline-block;
  }
  @media screen and (max-width: 700px) {
    width: 15%;
    display: inline-block;
    padding-left: 8%;
  }
  @media screen and (max-width: 550px) {
    width: 20%;
    display: inline-block;
    padding-left: 5%;
  }
`;

const APRNext = styled.div`
  display: block;
  width: 10%;
  @media screen and (max-width: 1000px) {
    width: 30%;
    display: inline-block;
  }
`;

const Liquidity = styled.div`
  width: 10%;
  @media screen and (max-width: 1000px) {
    width: 10%;
    display: inline-block;
  }
  @media screen and (max-width: 700px) {
    width: 30%;
    display: inline-block;
    padding-left: 10%;
  }
  @media screen and (max-width: 550px) {
    width: 30%;
    display: inline-block;
    padding-left: 10%;
  }
`;

const LiquidityNext = styled.div`
  width: 15%;
  display: block;
  @media screen and (max-width: 1000px) {
    width: 35%;
    display: inline-block;
  }
`;

const MinStake = styled.div`
  width: 13%;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const MinStakeNext = styled.div`
  width: 10%;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const Fee = styled.div`
  width: 4%;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const FeeNext = styled.div`
  width: 10%;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const Poolday = styled.div`
  width: 13%;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const LpWorth = styled.div`
  width: 10%;
  @media screen and (max-width: 1000px) {
    width: 15%;
    display: block;
  }
  @media screen and (max-width: 550px) {
    display: none;
  }
`;

const MaxStake = styled.div`
  width: 13%;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

interface FarmCardProps {
  farm: FarmWithStakedValue;
  removed: boolean;
  cakePrice?: BigNumber;
  bnbPrice?: BigNumber;
  ethereum?: provider;
  account?: string;
}

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  removed,
  cakePrice,
  bnbPrice,
  ethereum,
  account,
}) => {
  const TranslateString = useI18n();
  const web3 = useWeb3();

  const [showExpandableSection, setShowExpandableSection] = useState(false);
  const [blockNumber, setBlockNumber] = useState(0);
  const [hover, setHover] = useState(false);

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  let farmImage = (farm as any).isDualFarm
    ? `${farm.lpSymbol.split(" ")[0].toLowerCase()}`
    : `${farm.tokenSymbol.split(" ")[0].toLowerCase()}`;

  farmImage = (farm as any).tokenIcon ? (farm as any).tokenIcon : farmImage;

  const totalValue: BigNumber = useMemo(() => {
    if (!(farm as any).isDualFarm && !(farm as any).isLPToken) {
      return cakePrice.times(farm.lpBalance);
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bnbPrice,
    cakePrice,
    farm,
    farm.lpTotalInQuoteToken,
    farm.quoteTokenSymbol,
  ]);

  const getBlockNumber = async () => {
    setBlockNumber(await web3.eth.getBlockNumber());
  };

  useEffect(() => {
    if (web3) {
      getBlockNumber();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3]);

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`
    : "-";

  const lpLabel = farm.lpSymbol;
  const lpWorth = new BigNumber(totalValue)
    .div(new BigNumber(farm.lpBalance))
    .toFixed(2);

  const farmAPY1 =
    farm.apy1 &&
    Math.min(
      100000,
      farm.apy1.times(new BigNumber(100)).toNumber()
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const farmAPY2 =
    farm.apy2 &&
    Math.min(
      100000,
      farm.apy2.times(new BigNumber(100)).toNumber()
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const farmAPY =
    farm.apy2 &&
    farm.apy1 &&
    Math.min(
      100000,
      farm.apy2.plus(farm.apy1).times(new BigNumber(100)).toNumber()
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk } = farm;
  const poolEnds =
    blockNumber === 0
      ? 30
      : Math.ceil(
          ((farm as any).bonusEndBlock - blockNumber) /
            BLOCKS_PER_DAY.toNumber()
        );
  const { earnings } = useDualFarmUser(farm.poolAddress);
  const rawEarningsBalance1 = getBalanceNumber(
    !(farm as any).isDualFarm
      ? new BigNumber(earnings[0]).times(
          10 **
            ((farm as any).tokenDecimal ? 18 - (farm as any).tokenDecimal : 0)
        )
      : earnings[0]
  );
  const displayRewardsValue = rawEarningsBalance1.toLocaleString();
  
  // const tokenEarnedUsd = new BigNumber(lpWorth).multipliedBy(rawEarningsBalance1)

  return (
    <CardContainer>
      {(farm as any).isWhalePool ? (
        <div className="product">
          <div className="product__price-tag">
            <p className="product__price-tag-price">WHALE POOL</p>
          </div>
        </div>
      ) : (
        <></>
      )}
      {(farm as any).isShrimpPool ? (
        <div className="product_shrimp">
          <div className="product_shrimp__price-tag">
            <p className="product_shrimp__price-tag-price">SHRIMP POOL</p>
          </div>
        </div>
      ) : (
        <></>
      )}
      {(farm as any).isBoosterPool ? (
        <div className="product_booster">
          <div className="product_booster__price-tag">
            <p className="product_booster__price-tag-price">BOOSTER POOL</p>
          </div>
        </div>
      ) : (
        <></>
      )}
      {(farm as any).isDualFarm && !removed ? (
        <div className="earntoken">
          <div className="earntoken__price-tag">
            <p className="earntoken__price-tag-price">EARN </p> CROX +{" "}
            {farm.tokenSymbol}
          </div>
        </div>
      ) : (
        <></>
      )}
      {!(farm as any).isDualFarm && ((farm as any).isWhalePool || (farm as any).isShrimpPool) ? (
        <div className="earntoken">
          <div className="earntoken__price-tag">
            <p className="earntoken__price-tag-price">Dual Rewards</p>
          </div>
        </div>
      ) : (
        <></>
      )}
      <FCard onClick={() => setShowExpandableSection(!showExpandableSection)}>
        {(farm.quoteTokenSymbol === QuoteToken.CAKE ||
          (farm as any).showBackground) && <StyledCardAccent />}
        {removed ? (
          <HeaderContainer>
            <CardHeading
              lpLabel={lpLabel}
              lpSubLabel={`Stake ${farm.lpSymbol}`}
              tokenSymbol={(farm as any).lpType}
              multiplier={farm.multiplier}
              risk={risk}
              depositFee={farm.depositFeeBP}
              farmImage={farmImage}
              isDualFarm={(farm as any).isDualFarm}
            />
            <CakeLP>
              <Flex flexDirection="column" alignItems="flex-start">
                {(farm as any).lpType ? (
                  <>
                    <Flex justifyContent="center">
                      <Tag variant="success" outline>
                        {(farm as any).lpType}
                      </Tag>
                    </Flex>
                  </>
                ) : (
                  <Flex justifyContent="center">
                    {farm.depositFeeBP === 0 ? <NoFeeNoIconTag /> : null}
                  </Flex>
                )}
              </Flex>
            </CakeLP>
            <FinishDetailSection>
              <FinishedText>
                <svg
                  width="210"
                  height="42"
                  viewBox="0 0 151 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.907031 14.05L3.58203 16.65L3.58203 22.775L0.907031 25.225L0.907031 14.05ZM3.80703 14.95C3.19036 14.4667 2.60703 14.0083 2.05703 13.575L3.80703 12.25L10.632 12.25L12.382 13.575L10.632 14.95L3.80703 14.95ZM1.60703 0.924999L12.782 0.924999L10.357 3.625H4.18203L1.60703 0.924999ZM0.882031 13.175V2L3.55703 4.425V10.625L0.882031 13.175ZM27.8271 25.225L25.1271 22.65V16.5L27.8271 14.05V25.225ZM27.7771 2V13.175L25.0771 10.75V4.575L27.7771 2ZM38.4973 11.925V0.699999L41.1973 3.175V9.35L38.4973 11.925ZM53.7223 0.699999V11.925L51.0223 9.45V3.3L53.7223 0.699999ZM38.4223 12.775L41.1223 15.35V21.525L38.4223 23.975V12.775ZM53.6473 23.975L50.9473 21.375V15.225L53.6473 12.775V23.975ZM42.4723 8.1V3.025L49.5723 14.975V20.075L42.4723 8.1ZM67.0674 25.225L64.3674 22.65V16.5L67.0674 14.05V25.225ZM67.0174 2V13.175L64.3174 10.75V4.575L67.0174 2ZM79.7375 26.325L82.3125 23.625L88.4875 23.625L90.9125 26.325L79.7375 26.325ZM91.7125 25.225L89.0125 22.65V16.5L91.7125 14.05V25.225ZM81.8875 14.95C81.3042 14.4833 80.7125 14.025 80.1125 13.575L81.8875 12.25H88.7125L90.4625 13.575L88.7125 14.95H81.8875ZM79.7125 0.924999L90.8875 0.924999L88.4125 3.625L82.2875 3.625L79.7125 0.924999ZM78.9125 13.175V2L81.6125 4.425V10.625L78.9125 13.175ZM98.6076 14.05L101.308 16.65V22.775L98.6076 25.225V14.05ZM111.333 25.225L108.633 22.65V16.5L111.333 14.05V25.225ZM101.508 14.95C100.924 14.4833 100.333 14.025 99.7326 13.575L101.508 12.25L108.333 12.25L110.083 13.575L108.333 14.95L101.508 14.95ZM98.5326 13.175V2L101.233 4.425V10.625L98.5326 13.175ZM111.258 2V13.175L108.558 10.75V4.575L111.258 2ZM119.353 26.325L121.928 23.625H128.103L130.553 26.325H119.353ZM118.628 14.05L121.303 16.65V22.775L118.628 25.225V14.05ZM121.503 14.95C120.886 14.4667 120.303 14.0083 119.753 13.575L121.503 12.25H128.328L130.078 13.575L128.328 14.95H121.503ZM119.328 0.924999L130.478 0.924999L128.053 3.625L121.878 3.625L119.328 0.924999ZM118.553 13.175V2L121.228 4.425V10.625L118.553 13.175ZM138.598 26.325L141.173 23.625H147.348L149.773 26.325H138.598ZM137.848 14.05L140.548 16.65V22.775L137.848 25.225V14.05ZM150.573 25.225L147.873 22.65V16.5L150.573 14.05V25.225ZM138.573 0.924999L149.748 0.924999L147.273 3.625L141.148 3.625L138.573 0.924999ZM137.773 13.175V2L140.473 4.425V10.625L137.773 13.175ZM150.498 2V13.175L147.798 10.75V4.575L150.498 2Z"
                    fill="white"
                  />
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
          <>
            {(farm as any).isDualFarm || (farm as any).isLPToken ? (
              <HeaderContainer>
                <CardHeading
                  lpLabel={lpLabel}
                  lpSubLabel={`Stake ${farm.lpSymbol}`}
                  tokenSymbol={(farm as any).lpType}
                  multiplier={farm.multiplier}
                  risk={risk}
                  depositFee={farm.depositFeeBP}
                  farmImage={farmImage}
                  isDualFarm={(farm as any).isDualFarm}
                />
                <CakeLP>
                  <Flex flexDirection="column" alignItems="flex-start">
                    {(farm as any).lpType ? (
                      <>
                        <Flex justifyContent="center">
                          <Tag variant="success" outline>
                            {(farm as any).lpType}
                          </Tag>
                        </Flex>
                      </>
                    ) : (
                      <Flex justifyContent="center">
                        {farm.depositFeeBP === 0 ? <NoFeeNoIconTag /> : null}
                      </Flex>
                    )}
                  </Flex>
                </CakeLP>
                <LpWorth>
                  {farm.lpSymbol !== "CNS-BNB LP" && (
                    <>
                      <Text
                        color="textSubtle"
                        style={{ fontSize: "15px", display: "block" }}
                      >
                        <p style={{ color: "#31D0D0" }}>Lp Worth</p>
                      </Text>
                      <Text
                        color="textSubtle"
                        style={{ fontSize: "15px", margin: "3% 0 0 4px" }}
                      >
                        ${lpWorth}
                      </Text>
                    </>
                  )}
                </LpWorth>
                <EarnToken>
                  {(farm as any).isDualFarm ? (
                    <Flex
                      justifyContent="space-between"
                      style={{ display: "block" }}
                    >
                      <Text color="#31D0D0">EARN</Text>
                      <Text color="white">CROX + {farm.tokenSymbol}</Text>
                    </Flex>
                  ) : (
                    `EARN ${farm.tokenSymbol}`
                  )}
                </EarnToken>
                <APR>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ display: "block" }}
                  >
                    <Text
                      color="textSubtle"
                      style={{ paddingLeft: "15%", textAlign: "left" }}
                    >
                      APR
                    </Text>
                    <Text
                      color="textSubtle"
                      bold
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {(farm as any).isLPToken ? (
                        <>
                          {farm.apy1 ? (
                            <>
                              <ApyButton
                                lpLabel={lpLabel}
                                quoteTokenAdresses={quoteTokenAdresses}
                                quoteTokenSymbol={quoteTokenSymbol}
                                tokenAddresses={tokenAddresses}
                                cakePrice={cakePrice}
                                apy={farm.apy1}
                                symbol={farm.tokenSymbol}
                              />
                              {farmAPY1}%
                            </>
                          ) : (
                            <Skeleton height={24} width={80} />
                          )}
                        </>
                      ) : (
                        <>
                          {farm.apy1 && farm.apy2 ? (
                            <Flex
                              alignItems="center"
                              justifyContent="center"
                              style={{ position: "relative" }}
                            >
                              <span>{farmAPY}%</span>
                              <svg
                                width="12"
                                height="13"
                                viewBox="0 0 12 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  marginLeft: 4,
                                  marginBottom: 2,
                                }}
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                              >
                                <path
                                  d="M6 0.6875C2.78906 0.6875 0.1875 3.3125 0.1875 6.5C0.1875 9.71094 2.78906 12.3125 6 12.3125C9.1875 12.3125 11.8125 9.71094 11.8125 6.5C11.8125 3.3125 9.1875 0.6875 6 0.6875ZM6 3.26562C6.53906 3.26562 6.98438 3.71094 6.98438 4.25C6.98438 4.8125 6.53906 5.23438 6 5.23438C5.4375 5.23438 5.01562 4.8125 5.01562 4.25C5.01562 3.71094 5.4375 3.26562 6 3.26562ZM7.3125 9.21875C7.3125 9.38281 7.17188 9.5 7.03125 9.5H4.96875C4.80469 9.5 4.6875 9.38281 4.6875 9.21875V8.65625C4.6875 8.51562 4.80469 8.375 4.96875 8.375H5.25V6.875H4.96875C4.80469 6.875 4.6875 6.75781 4.6875 6.59375V6.03125C4.6875 5.89062 4.80469 5.75 4.96875 5.75H6.46875C6.60938 5.75 6.75 5.89062 6.75 6.03125V8.375H7.03125C7.17188 8.375 7.3125 8.51562 7.3125 8.65625V9.21875Z"
                                  fill="white"
                                />
                              </svg>
                              {hover && (
                                <APRInfo>
                                  <div>
                                    <span>{farm.tokenSymbol}: </span>
                                    <span>{farmAPY1}%</span>
                                  </div>
                                  <div>
                                    <span>CROX: </span>
                                    <span>{farmAPY2}%</span>
                                  </div>
                                </APRInfo>
                              )}
                            </Flex>
                          ) : (
                            <Skeleton height={24} width={80} />
                          )}
                        </>
                      )}
                    </Text>
                  </Flex>
                </APR>
                <Liquidity>
                  {!removed && (
                    <Flex
                      justifyContent="space-between"
                      style={{ display: "block" }}
                    >
                      <Text color="textSubtle">
                        {TranslateString(23, "Liquidity")}
                      </Text>
                      <Text color="textSubtle">{totalValueFormated}</Text>
                    </Flex>
                  )}
                </Liquidity>
                <MinStake>
                  {((farm as any).isDualFarm || (farm as any).isLPToken) && (
                    <Flex
                      justifyContent="space-between"
                      style={{ display: "block" }}
                    >
                      <Text color="textSubtle" style={{ fontSize: "15px" }}>
                        Min Staking
                      </Text>
                      <Text
                        color="textSubtle"
                        bold
                        style={{ fontSize: "15px" }}
                      >
                        {(farm as any).minStaking || 30} days
                      </Text>
                    </Flex>
                  )}
                </MinStake>
                <Fee>
                  <Flex
                    justifyContent="space-between"
                    style={{ display: "block" }}
                  >
                    <Text color="textSubtle" style={{ fontSize: "15px" }}>
                      {(farm as any).isDualFarm || (farm as any).isLPToken
                        ? "Fee"
                        : "Burn Fee"}
                    </Text>
                    <Text color="textSubtle" bold style={{ fontSize: "15px" }}>
                      {farm.depositFeeBP / 100}%
                    </Text>
                  </Flex>
                </Fee>
                <Poolday>
                  <Flex
                    justifyContent="space-between"
                    style={{ display: "block" }}
                  >
                    <Text color="textSubtle" style={{ fontSize: "15px" }}>
                      Pool Ends In
                    </Text>
                    <Text color="textSubtle" bold style={{ fontSize: "15px" }}>
                      {poolEnds} days
                    </Text>
                  </Flex>
                </Poolday>
                {/* {((farm as any).isDualFarm || (farm as any).isLPToken) && (
                <Flex justifyContent="space-between">
                  <Text color="textSubtle" style={{ fontSize: "20px" }}>
                    {TranslateString(10006, "Harvest Lock")}:
                  </Text>
                  <Text color="textSubtle" bold style={{ fontSize: "20px" }}>
                    {(farm as any).lockPeriod / 3600.0 / 24} days
                  </Text>
                </Flex>
              )} */}
                <ExpandableSectionButton
                  onClick={() =>
                    setShowExpandableSection(!showExpandableSection)
                  }
                  expanded={showExpandableSection}
                />
              </HeaderContainer>
            ) : (
              <HeaderContainer>
                <CardHeading
                  lpLabel={farm.tokenSymbol}
                  lpSubLabel={`Stake ${lpLabel}`}
                  multiplier={farm.multiplier}
                  risk={risk}
                  depositFee={farm.depositFeeBP}
                  farmImage={farmImage}
                />
                {(farm as any).isWhalePool || (farm as any).isShrimpPool ? (
                  <CakeLPNext>
                    <Flex flexDirection="column" alignItems="flex-start">
                      <Flex justifyContent="center">
                        <Tag variant="success" outline>
                          Dual Rewards
                        </Tag>
                      </Flex>
                    </Flex>
                  </CakeLPNext>
                ) : (
                  <EarnTokenNext>
                    <Text
                      color="textSubtle"
                      style={{
                        fontSize: "15px",
                        display: "block",
                        margin: "0% 0 0 30%",
                      }}
                    >
                      <p style={{ color: "#31D0D0" }}>REWARDS</p>{" "}
                      <p style={{ textAlign: "right" }}>{displayRewardsValue}</p>
                    </Text>
                    <Text
                      color="textSubtle"
                      style={{ fontSize: "15px", margin: "0% 0 0 4px" }}
                    >
                      Earned
                    </Text>
                  </EarnTokenNext>
                )}
                <APRNext>
                  {farm.apy2 && ((farm as any).isWhalePool || (farm as any).isShrimpPool) ? (
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      style={{ display: "block" }}
                    >
                      <Text
                        color="textSubtle"
                        style={{ paddingLeft: "15%", textAlign: "center" }}
                      >
                        APR
                      </Text>
                      <Text
                        color="textSubtle"
                        bold
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        style={{ position: "relative" }}
                      >
                        <span>{farmAPY}%</span>
                        <svg
                          width="12"
                          height="13"
                          viewBox="0 0 12 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            marginLeft: 4,
                            marginBottom: 2,
                          }}
                          onMouseEnter={() => setHover(true)}
                          onMouseLeave={() => setHover(false)}
                        >
                          <path
                            d="M6 0.6875C2.78906 0.6875 0.1875 3.3125 0.1875 6.5C0.1875 9.71094 2.78906 12.3125 6 12.3125C9.1875 12.3125 11.8125 9.71094 11.8125 6.5C11.8125 3.3125 9.1875 0.6875 6 0.6875ZM6 3.26562C6.53906 3.26562 6.98438 3.71094 6.98438 4.25C6.98438 4.8125 6.53906 5.23438 6 5.23438C5.4375 5.23438 5.01562 4.8125 5.01562 4.25C5.01562 3.71094 5.4375 3.26562 6 3.26562ZM7.3125 9.21875C7.3125 9.38281 7.17188 9.5 7.03125 9.5H4.96875C4.80469 9.5 4.6875 9.38281 4.6875 9.21875V8.65625C4.6875 8.51562 4.80469 8.375 4.96875 8.375H5.25V6.875H4.96875C4.80469 6.875 4.6875 6.75781 4.6875 6.59375V6.03125C4.6875 5.89062 4.80469 5.75 4.96875 5.75H6.46875C6.60938 5.75 6.75 5.89062 6.75 6.03125V8.375H7.03125C7.17188 8.375 7.3125 8.51562 7.3125 8.65625V9.21875Z"
                            fill="white"
                          />
                        </svg>
                        {hover && (
                          <APRInfo>
                            <div>
                              <span>CNR: </span>
                              <span>{farmAPY1}%</span>
                            </div>
                            <div>
                              <span>CRUSH: </span>
                              <span>{farmAPY2}%</span>
                            </div>
                          </APRInfo>
                        )}
                      </Flex>
                      </Text>
                    </Flex>
                    ) : (
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      style={{ display: "block" }}
                    >
                      <Text color="textSubtle">APR</Text>
                      <Text
                        color="textSubtle"
                        bold
                        style={{ paddingLeft: "8%", textAlign: "center" }}
                      >
                        {farm.apy1 ? (
                          <>{farmAPY1}%</>
                        ) : (
                          <Skeleton height={24} width={80} />
                        )}
                      </Text>
                    </Flex>
                  )}
                </APRNext>
                <LiquidityNext>
                  {!removed && (
                    <Flex
                      justifyContent="space-between"
                      style={{ display: "block" }}
                    >
                      <Text color="textSubtle">
                        {TranslateString(23, "Liquidity")}
                      </Text>
                      <Text color="textSubtle">{totalValueFormated}</Text>
                    </Flex>
                  )}
                </LiquidityNext>
                <MinStakeNext>
                  {((farm as any).tokenSymbol === "GREM") && (
                    <Flex
                      justifyContent="space-between"
                      style={{ display: "block" }}
                    >
                      <Text color="textSubtle" style={{ fontSize: "15px" }}>
                        Min Staking
                      </Text>
                      <Text
                        color="textSubtle"
                        bold
                        style={{ fontSize: "15px" }}
                      >
                        {(farm as any).minStaking || 30} days
                      </Text>
                    </Flex>
                  )}
                </MinStakeNext>
                <FeeNext>
                  <Flex
                    justifyContent="space-between"
                    style={{ display: "block" }}
                  >
                    <Text color="textSubtle" style={{ fontSize: "15px" }}>
                      Burn Fee
                    </Text>
                    <Text color="textSubtle" bold style={{ fontSize: "15px" }}>
                      {farm.depositFeeBP / 100}%
                    </Text>
                  </Flex>
                </FeeNext>
                <Poolday>
                  <Flex
                    justifyContent="space-between"
                    style={{ display: "block" }}
                  >
                    <Text color="textSubtle" style={{ fontSize: "15px" }}>
                      Pool Ends In
                    </Text>
                    <Text color="textSubtle" bold style={{ fontSize: "15px" }}>
                      {poolEnds} days
                    </Text>
                  </Flex>
                </Poolday>
                <MaxStake>
                  {lpLabel === "CROX" && (
                    <Flex
                      justifyContent="space-between"
                      style={{ display: "block" }}
                    >
                      <Text color="textSubtle" style={{ fontSize: "15px" }}>
                        Max Stake
                      </Text>
                      <Text
                        color="textSubtle"
                        bold
                        style={{ fontSize: "15px" }}
                      >
                        {(farm as any).isWhalePool && "12000 CROX"}
                        {(farm as any).isShrimpPool && "2500 CROX"}
                        {!(farm as any).isWhalePool && !(farm as any).isShrimpPool && "8000 CROX"}
                      </Text>
                    </Flex>
                  )}
                </MaxStake>

                {/* {((farm as any).isDualFarm || (farm as any).isLPToken) && (
                    <Flex justifyContent="space-between">
                      <Text color="textSubtle" style={{ fontSize: "20px" }}>
                        {TranslateString(10006, " LoHarvestck")}:
                      </Text>
                      <Text color="textSubtle" bold style={{ fontSize: "20px" }}>
                        {(farm as any).lockPeriod / 3600.0 / 24} days
                      </Text>
                    </Flex>
                  )} */}
                <ExpandableSectionButton
                  onClick={() =>
                    setShowExpandableSection(!showExpandableSection)
                  }
                  expanded={showExpandableSection}
                />
              </HeaderContainer>
            )}
          </>
        )}
        {/* {farm.pidv1 && (
          <Flex justifyContent="space-between">
            <Text color="textSubtle" style={{ fontSize: "20px" }}>
              {TranslateString(10008, "Prev Staked")}:
            </Text>
            <Text color="textSubtle" bold style={{ fontSize: "20px" }}>
              {getBalanceNumber(
                farm && farm.userData && farm.userData?.prevStakedBalance
                  ? farm.userData.prevStakedBalance
                  : new BigNumber(0)
              ).toFixed(2)}
            </Text>
          </Flex>
        )} */}
      </FCard>
      <ExpandingWrapper expanded={showExpandableSection}>
        <CardActionsContainer
          removed={removed}
          farm={farm}
          ethereum={ethereum}
          account={account}
          poolEnds={poolEnds}
          lpWorthValue={lpWorth}
          tokenDecimal={(farm as any).tokenDecimal}
          harvestLockDay={(farm as any).lockPeriod}
        />
        {!removed ? (
          <>
            {(farm as any).isDualFarm || (farm as any).isLPToken || (farm as any).tokenSymbol === "GREM" ? (
              <Text
                color="textSubtle"
                fontSize="12px"
                style={{ marginTop: "1%" }}
              >
                {`${
                  (farm as any).penaltyFee ? (farm as any).penaltyFee : 10
                }% unstaking Penalty if withdrawn before ${
                  (farm as any).minStaking || 30
                } days or Rewards End
              Block. No fees after  ${
                (farm as any).minStaking || 30
              }days or Pool End Date. Fees charged will be
              used to Buy Back & Burn CROX`}
              </Text>
            ) : (
              <div style={{ marginTop: "1%" }} />
            )}
          </>
        ) : (
          <div style={{ marginTop: "1%" }} />
        )}
      </ExpandingWrapper>
    </CardContainer>
  );
};

export default FarmCard;

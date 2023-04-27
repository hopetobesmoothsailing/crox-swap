/* eslint-disable */
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardBody, Heading, Text, Image, Button } from "crox-uikit2.0";
import { useMatchBreakpoints } from "crox-uikit";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { useCountUp } from 'react-countup'
import { Timeline } from "react-twitter-widgets";
import { getBalanceNumber } from "utils/formatBalance";
import { useTotalSupply, useBurnedBalance } from "hooks/useTokenBalance";
import useI18n from "hooks/useI18n";
import { getCakeAddress } from "utils/addressHelpers";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  getAPYAndTVLOfFarm,
  getAPYAndTVLOfPool,
  getAPYAndTVLOfDualFarm,
  getAPYAndTVLOfNGPool,
} from "utils/defi";
import { QuoteToken } from "config/constants/types";
import { BLOCKS_PER_YEAR } from "config";

import CardValue from "./CardValue";
import DualFarm from "../../NextGen/NextGen";
import {
  useFarms,
  usePriceCakeBusd,
  useCroxPools,
  usePriceBnbBusd,
  useDualFarms,
} from "../../../state/hooks";
import "./TopFarm.scss";

const StyledTwitterCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  background: #121827;
  font-weight: bold;
  width: 100%;
  flex: auto;
`;

const StyledAprCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  background: #121827;
  font-size: 40px;
  padding: 20px;
  margin-bottom: 10px;
  width: 100%;
  flex: flex auto auto;
`;

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
`;

const TopFarm = styled.div`
  text-align: center;
  width: 85%;
  margin: auto;
`;

const Col = styled.div`
  // width: 25%;
  margin-right: 0px;
`;

const Content = styled.div`
  display: block;
  width: 60%;
  text-align: center;
`;

const StyledCakeStats = styled(Card)`
  background: #121827;
  margin: 10px;
  & .swiper-button-prev:after,
  & .swiper-button-next:after {
    opacity: 0.5 !important;
    font-size: 20px !important;
  }
`;

const SCHeading = styled(Heading)`
  // color: white;
  text-align: center;
  font-size: 18px;
  margin-top: 4px;
`;
const SCSubHeading = styled(Text)`
  font-size: 25px;
`;

const SCTvlText = styled.div`
  display: flex;
  align-items: center;
`;

const BannerCard = styled.div`
  padding: 10px;
  background-color: #2D3748;
  border-radius: 20px;
  box-shadow: -3px -1px 8px white;
  display: flex;
`;

export interface FarmsProps {
  tokenMode?: boolean;
}

const TwitterCard = () => {
  const history = useHistory();
  const TranslateString = useI18n();
  const totalSupply = useTotalSupply();
  const burnedBalance = useBurnedBalance(getCakeAddress());
  const croxfarms = useFarms();
  const dualfarms = useDualFarms();
  const croxpools = useCroxPools();
  const ngpools = useDualFarms(true);
  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();
  const circSupply = totalSupply
    ? totalSupply.minus(burnedBalance)
    : new BigNumber(0);
  const cakeSupply = getBalanceNumber(circSupply);
  const marketCap = cakePrice.times(circSupply);
  const { isMd, isSm, isXs } = useMatchBreakpoints();

  const activeCroxFarms = croxfarms
    .filter((farm) => farm.multiplier !== "0X")
    .map((farm) => {
      let pidInAbs = Math.abs(farm.pid);
      const { apy, totalValue } = getAPYAndTVLOfFarm(farm, {
        cakePrice,
        bnbPrice,
      });
      return { ...farm, apy, totalValue, pidInAbs };
    });
  const activeDualFarms = dualfarms
    .filter((it) => (it as any).active)
    .map((farm) => {
      let pidInAbs = Math.abs(farm.pid);
      const { apy1, apy2, totalValue } = getAPYAndTVLOfDualFarm(farm, {
        cakePrice,
        bnbPrice,
      });
      return { ...farm, apy: apy1.plus(apy2), totalValue, pidInAbs };
    });
  const activeCroxPools = croxpools
    .filter((farm) => farm.multiplier !== "0X")
    .map((farm) => {
      let pidInAbs = Math.abs(farm.pid);
      const { apy, totalValue } = getAPYAndTVLOfPool(farm, {
        cakePrice,
        bnbPrice,
      });
      return { ...farm, apy, totalValue, pidInAbs };
    });
  const activeNGPools = ngpools
    .filter((it) => (it as any).active)
    .map((farm) => {
      let pidInAbs = Math.abs(farm.pid);
      const { apy1, apy2, totalValue } = getAPYAndTVLOfNGPool(farm, {
        cakePrice,
        bnbPrice,
      });
      return { ...farm, apy1, totalValue, pidInAbs };
    });

  const farms = useMemo(() => {
    return [...activeCroxFarms, ...activeDualFarms];
  }, [activeCroxFarms, activeDualFarms]);

  const pools = useMemo(() => {
    return [...activeCroxPools, ...activeNGPools];
  }, [activeCroxPools, activeNGPools]);

  const goToDualFarm = () => {
    history.push('/dualfarms');
  }

  return (
    <>
      {!isMd && !isSm && !isXs ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            flex: "auto",
          }}
        >
          <>
            <div className="product">
              <div className="product__price-tag" style={{ top: "0px", left: "0px" }}>
                <p className="product__price-tag-price">TOP FARMS</p>
              </div>
            </div>
          </>
          <StyledCakeStats style={{ marginBottom: "20px" }}>
            <CardBody style={{ padding: "15px 0" }}>
              <div
                style={{
                  width: "100%",
                  marginRight: "20px",
                  zIndex: 0,
                }}
              >
                <Swiper
                  navigation={true}
                  loop={true}
                  className="mySwiper"
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {activeDualFarms &&
                    activeDualFarms.length > 0 &&
                    activeDualFarms.sort((a, b) =>
                      a && b ? (a.apy.isGreaterThan(b.apy) ? -1 : 1) : 1
                    ) &&
                    activeDualFarms.slice(0, 2).map((farm, index) => {

                      const farmImage = (farm as any).isDualFarm
                        ? `${farm.lpSymbol.split(" ")[0].toLowerCase()}`
                        : `${farm.tokenSymbol.split(" ")[0].toLowerCase()}`;

                      return (
                        <SwiperSlide style={{ width: '90%', margin: "auto", marginBottom: "-11px" }}>
                          <TopFarm onClick={goToDualFarm}>
                            <Row>
                              <div style={{ width: "30%" }}>
                                <div style={{ margin: "auto" }}>
                                  <img src={`/images/farms/${farmImage}.svg`} alt={farmImage} width={80} height={80} />
                                </div>
                              </div>
                              <Content>
                                <div>
                                  <Text fontSize="27px" style={{ lineHeight: "1" }} color="textSubtle" bold>
                                    {farm?.lpSymbol}
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
                                  <Text fontSize="20px" bold color="">APR: </Text>
                                  <Text fontSize="20px" bold color="textSubtle" style={{ marginLeft: '4px' }}>
                                    {farm.apy.times(100).toFixed(2)}%
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
                                  <Text fontSize="20px" bold color="">Liquidity: </Text>
                                  <Text color="primary" fontSize="18px" style={{marginTop: '3px', marginLeft: '3px'}} >
                                    ${farm.totalValue.toNumber() ? farm.totalValue.toNumber().toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) : '0'}
                                  </Text>
                                </div>
                              </Content>
                              <div style={{ width: "31%", margin: "5px" }}>
                                <div style={{ backgroundColor: "#302a42", boxShadow: "0px 0px 8px 2px #706593", margin: "auto", borderRadius: "55px", width: "110px", height: "110px" }}>
                                  <div style={{ paddingTop: "10px" }}>
                                    <Text style={{ fontSize: "20px" }} color="textSubtle" bold>Earn</Text>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "center" }}>
                                    <img
                                      src={`/images/farms/${farm.tokenSymbol.toLowerCase()}.svg`}
                                      alt={farm.tokenSymbol}
                                      width={35}
                                      height={35}
                                      style={{ margin: "0 5px" }}
                                    />
                                    <Text style={{ fontSize: "20px" }} color="textSubtle" bold>+</Text>
                                    <img
                                      src={`/images/farms/crox.svg`}
                                      alt={'CROX'}
                                      width={35}
                                      height={35}
                                      style={{ margin: "0 5px" }}
                                    />
                                  </div>
                                  <div style={{ paddingTop: "5px" }}>
                                    <Text style={{ fontSize: "12px" }} color="textSubtle">Dual Rewards</Text>
                                  </div>
                                </div>
                              </div>
                            </Row>
                          </TopFarm>
                        </SwiperSlide>
                      );
                    })
                  }
                </Swiper>
              </div>
            </CardBody>
          </StyledCakeStats>

          <>
            <div className="product">
              <div className="product__price-tag" style={{ top: "0px", left: "0px" }}>
                <p className="product__price-tag-price">NEW FARMS</p>
              </div>
            </div>
          </>
          <StyledCakeStats style={{ marginTop: "10px" }}>
            <CardBody style={{ padding: "15px 0" }}>
              <div
                style={{
                  width: "100%",
                  marginRight: "20px",
                  zIndex: 0,
                }}
              >
                <Swiper
                  navigation={true}
                  loop={true}
                  className="mySwiper"
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {activeDualFarms &&
                    activeDualFarms.length > 0 &&
                    activeDualFarms.sort((a, b) =>
                      a && b ? (a.pidInAbs > b.pidInAbs ? -1 : 1) : 1
                    ) &&
                    activeDualFarms.slice(0, 2).map((farm, index) => {

                      const farmImage = (farm as any).isDualFarm
                        ? `${farm.lpSymbol.split(" ")[0].toLowerCase()}`
                        : `${farm.tokenSymbol.split(" ")[0].toLowerCase()}`;

                      return (
                        <SwiperSlide style={{ width: '80%' }}>
                          <TopFarm onClick={goToDualFarm}>
                            <Row style={{ justifyContent: 'center', margin: "10px 0" }}>
                              <div style={{ width: "20%" }}>
                                <div style={{ margin: "auto" }}>
                                  <img src={`/images/farms/${farmImage}.svg`} alt={farmImage} width={80} height={80} />
                                </div>
                              </div>
                              <Content>
                                <div>
                                  <Text fontSize="27px" style={{ lineHeight: "1" }} color="textSubtle" bold>
                                    {farm?.lpSymbol}
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Text fontSize="23px" bold color="">APR: </Text>
                                  <Text fontSize="23px" bold color="textSubtle" style={{ marginLeft: '4px' }}>
                                    {farm.apy.times(100).toFixed(2)}%
                                  </Text>
                                </div>
                                <div style={{ width: "100%" }}>
                                  <div style={{ backgroundColor: "#302a42", padding: '5px', boxShadow: "0px 0px 3px 1px #706593", margin: "auto", borderRadius: "10px", width: "80%", display: "inline-flex" }}>
                                    <div style={{ display: "flex", justifyContent: "center", width: "70%" }}>
                                      <img
                                        src={`/images/farms/${farm.tokenSymbol.toLowerCase()}.svg`}
                                        alt={farm.tokenSymbol}
                                        width={20}
                                        height={20}
                                        style={{ margin: "0 8px" }}
                                      />
                                      <Text style={{ fontSize: "15px", paddingTop: "3px" }} color="textSubtle" bold>+</Text>
                                      <img
                                        src={`/images/farms/crox.svg`}
                                        alt={'CROX'}
                                        width={30}
                                        height={30}
                                        style={{ margin: "0 8px" }}
                                      />
                                    </div>
                                    <div style={{ width: "30%" }}>
                                      <Text style={{ fontSize: "10px" }} color="textSubtle" >Dual Rewards</Text>
                                    </div>
                                  </div>
                                </div>
                              </Content>
                              <Col>
                              </Col>
                            </Row>
                          </TopFarm>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </CardBody>
          </StyledCakeStats>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            flex: "auto",
          }}
        >
          {/* <StyledAprCard> APR Upto 1200% </StyledAprCard> */}
          <>
            <div className="product">
              <div className="product__price-tag" style={{ top: "-5px", left: "-10px" }}>
                <p className="product__price-tag-price">TOP FARMS</p>
              </div>
            </div>
          </>
          <StyledCakeStats style={{ margin: "0 0 10px 0" }}>
            <CardBody style={{ padding: "15px 0" }}>
              <div
                style={{
                  width: "100%",
                  marginRight: "20px",
                  zIndex: 0,
                }}
              >
                <Swiper
                  navigation={true}
                  loop={true}
                  className="mySwiper"
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {activeDualFarms &&
                    activeDualFarms.length > 0 &&
                    activeDualFarms.sort((a, b) =>
                      a && b ? (a.apy.isGreaterThan(b.apy) ? -1 : 1) : 1
                    ) &&
                    activeDualFarms.slice(0, 2).map((farm, index) => {

                      const farmImage = (farm as any).isDualFarm
                        ? `${farm.lpSymbol.split(" ")[0].toLowerCase()}`
                        : `${farm.tokenSymbol.split(" ")[0].toLowerCase()}`;

                      return (
                        <SwiperSlide style={{ width: '100%', margin: "auto", marginBottom: "-11px" }}>
                          <TopFarm onClick={goToDualFarm}>
                            <Row>
                              <div style={{ width: "30%" }}>
                                <div style={{ margin: "auto" }}>
                                  <img src={`/images/farms/${farmImage}.svg`} alt={farm.tokenSymbol} width={80} height={80} />
                                </div>
                              </div>
                              <Content>
                                <div>
                                  <Text fontSize="20px" style={{ lineHeight: "1" }} color="textSubtle" bold>
                                    {farm?.lpSymbol}
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
                                  <Text fontSize="15px" bold color="">APR: </Text>
                                  <Text fontSize="15px" bold color="textSubtle" style={{ marginLeft: '4px' }}>
                                    {farm.apy.times(100).toFixed(2)}%
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
                                  <Text fontSize="20px" bold color="">Liquidity: </Text>
                                  <Text color="primary" fontSize="18px" style={{marginTop: '3px', marginLeft: '3px'}} >
                                    ${farm.totalValue.toNumber() ? farm.totalValue.toNumber().toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) : '0'}
                                  </Text>
                                </div>
                              </Content>
                            </Row>
                          </TopFarm>
                        </SwiperSlide>
                      );
                    })
                  }
                </Swiper>
              </div>
            </CardBody>
          </StyledCakeStats>

          <>
            <div className="product">
              <div className="product__price-tag" style={{ top: "-5px", left: "-10px" }}>
                <p className="product__price-tag-price">NEW FARMS</p>
              </div>
            </div>
          </>
          <StyledCakeStats style={{ margin: "0 0 10px 0" }}>
            <CardBody style={{ padding: "15px 0" }}>
              <div
                style={{
                  width: "100%",
                  marginRight: "20px",
                  zIndex: 0,
                }}
              >
                <Swiper
                  navigation={true}
                  loop={true}
                  className="mySwiper"
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {activeDualFarms &&
                    activeDualFarms.length > 0 &&
                    activeDualFarms.sort((a, b) =>
                      a && b ? (a.pidInAbs > b.pidInAbs ? -1 : 1) : 1
                    ) &&
                    activeDualFarms.slice(0, 2).map((farm, index) => {

                      const farmImage = (farm as any).isDualFarm
                        ? `${farm.lpSymbol.split(" ")[0].toLowerCase()}`
                        : `${farm.tokenSymbol.split(" ")[0].toLowerCase()}`;

                      return (
                        <SwiperSlide style={{ width: '100%' }}>
                          <TopFarm onClick={goToDualFarm}>
                            <Row style={{ justifyContent: 'center', margin: "10px 0" }}>
                              <div style={{ width: "30%" }}>
                                <div style={{ margin: "auto" }}>
                                  <img src={`/images/farms/${farmImage}.svg`} alt={farm.tokenSymbol} width={80} height={80} />
                                </div>
                              </div>
                              <Content>
                                <div>
                                  <Text fontSize="20px" style={{ lineHeight: "1" }} color="textSubtle" bold>
                                    {farm?.lpSymbol}
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Text fontSize="15px" bold color="">APR: </Text>
                                  <Text fontSize="15px" bold color="textSubtle" style={{ marginLeft: '4px' }}>
                                    {farm.apy.times(100).toFixed(2)}%
                                  </Text>
                                </div>
                                <div style={{ width: "100%" }}>
                                  <div style={{ backgroundColor: "#302a42", boxShadow: "0px 0px 3px 1px #706593", margin: "auto", borderRadius: "10px", width: "80%", display: "inline-flex" }}>
                                    <div style={{ display: "flex", justifyContent: "center", width: "50%", margin: "auto" }}>
                                      <img
                                        src={`/images/farms/${farm.tokenSymbol.toLowerCase()}.svg`}
                                        alt={farm.tokenSymbol}
                                        width={25}
                                        height={25}
                                        style={{ margin: "0 3px" }}
                                      />
                                      <Text style={{ fontSize: "15px", paddingTop: "3px" }} color="textSubtle" bold>+</Text>
                                      <img
                                        src={`/images/farms/crox.svg`}
                                        alt={`CROX`}
                                        width={30}
                                        height={30}
                                        style={{ margin: "0 3px" }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Content>
                              <Col>
                              </Col>
                            </Row>
                          </TopFarm>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </CardBody>
          </StyledCakeStats>
        </div>
      )}
    </>
  );
};

export default TwitterCard;

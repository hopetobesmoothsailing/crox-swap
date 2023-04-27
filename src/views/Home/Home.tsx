/* eslint-disable */
import React, { useEffect, useRef, useState, useMemo } from "react";
import styled from "styled-components";
import { useLocation, useHistory } from "react-router-dom";
import {
  Heading,
  Text,
  BaseLayout,
  Button,
  useMatchBreakpoints,
} from "crox-uikit";
import useI18n from "hooks/useI18n";
import Carousel from "react-multi-carousel";
import { CarouselProps } from "react-multi-carousel/lib/types";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Autoplay } from "swiper/core";
import Page from "components/layout/Page";
import FarmStakingCard from "./components/FarmStakingCard";
import LotteryCard from "./components/LotteryCard";
import CakeStats from "./components/CakeStats";
import InvestorCard from "./components/InvestorCard";
import TotalValueLockedCard from "./components/TotalValueLockedCard";
import TwitterCard from "./components/TwitterCard";
import PoolBannerCard from "./components/PoolBannerCard";
import FourWayCard from "./components/FourWayCard";
import {
  getAPYAndTVLOfDualFarm,
  getAPYAndTVLOfNGPool,
} from "utils/defi";
import {
  usePriceCakeBusd,
  usePriceBnbBusd,
  useDualFarms,
} from "../../state/hooks";

import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
SwiperCore.use([Navigation, Autoplay]);

const Hero = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  // margin-bottom: 32px;
  padding-top: 40px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    height: 40px;
    padding-top: 0;
  }
`;

const Cards = styled(BaseLayout)`
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 30px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const StyledCards = styled.div`
  display: flex;
  justify-content: stretch;
  margin-bottom: 48px;

  & .swiper-button-prev:after,
  & .swiper-button-next:after {
    opacity: 0.5 !important;
    font-size: 20px !important;
  }
`;

const SwiperContainer = styled.div`
  width: 100%;
  marginright: 20px;
  marginbottom: 20px;

  & .swiper-button-prev:after,
  & .swiper-button-next:after {
    opacity: 0.5 !important;
    font-size: 20px !important;
  }
`;

const FourWayCards = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const FourWayTitle = styled.p`
  color: white;
  font-size: 18px;
  padding-top: 8px;
  padding-bottom: 8px;
`;
const FourWayCardsWrapper = styled.div`
  width: 100%;
  margin: auto;
  border-radius: 32px;
  padding-top: 6px;
  background-color: #253253;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 32px;
  margin-bottom: 30px;
  margin-top: 10px;
  & .swiper-button-prev:after,
  & .swiper-button-next:after {
    opacity: 0.5 !important;
    font-size: 20px !important;
  }
`;

const Home: React.FC = () => {
  const history = useHistory();
  const TranslateString = useI18n();
  const location = useLocation();
  const { isXl, isLg, isMd, isSm, isXs } = useMatchBreakpoints();
  const dualfarms = useDualFarms();
  const ngpools = useDualFarms(true);
  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();

  const maxAPRForDualFarm = useMemo(() => {
    let apys = dualfarms
      .filter((it) => (it as any).active)
      .map((farm) => {
        const { apy1, apy2 } = getAPYAndTVLOfDualFarm(farm, {
          cakePrice,
          bnbPrice,
        });
        return Number(apy1.plus(apy2).times(100).toFixed(0));
      });
    return Math.max(...apys);
  }, [dualfarms, cakePrice, bnbPrice]);

  const maxAPRForNGPool = useMemo(() => {
    let apys = ngpools
      .filter((it) => (it as any).active)
      .map((farm) => {
        const { apy1, apy2 } = getAPYAndTVLOfNGPool(farm, {
          cakePrice,
          bnbPrice,
        });
        return Number(apy1.times(100).toFixed(0));
      });
    return Math.max(...apys);
  }, [ngpools, cakePrice, bnbPrice]);

  return (
    <Page>
      <Hero>
        <Text fontSize="16px">
          THE FIRST AMM AND INNOVATIVE YIELD FARM WITH DUAL-REWARDS FARMING & STAKING PROTOCOL
        </Text>
      </Hero>

      {!isMd && !isSm && !isXs ? (
        <StyledCards>
          <div
            style={{
              width: "60%",
              marginRight: "20px",
              height: "100%",
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
              style={{ height: "100%" }}
            >
              <SwiperSlide style={{ height: "258px" }}>
                <img
                  src="/bridge_banner.png"
                  alt="bridge"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    height: "100%",
                    margin: "auto",
                  }}
                  onClick={() =>
                    window.open("https://bridge.croxswap.com/", "_blank")
                  }
                />
              </SwiperSlide>
              <SwiperSlide style={{ height: "258px" }}>
                <img
                  src="/crox_baby_banner.png"
                  alt="crox-babyswap"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    height: "100%",
                    margin: "auto",
                  }}
                  onClick={() => history.push("/dualfarms")}
                />
              </SwiperSlide>
              {/*<SwiperSlide style={{ height: "258px" }}>
                <img
                  src="/stake_dpet_crox_banner.png"
                  alt="crox-dpet"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    height: "100%",
                    margin: "auto",
                  }}
                    onClick={() => history.push("/pools/crox")}
                />
              </SwiperSlide>
              <SwiperSlide style={{ height: "258px" }}>
                <img
                  src="/farming_banner.png"
                  alt="dualfarms"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    height: "100%",
                    margin: "auto",
                  }}
                  onClick={() => history.push("/dualfarms")}
                />
              </SwiperSlide>
              <SwiperSlide style={{ height: "258px" }}>
                <img
                  src="/stake_crox_banner.png"
                  alt="earn other tokens"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    height: "100%",
                    margin: "auto",
                  }}
                  onClick={() => history.push("/pools/nextgen")}
                />
              </SwiperSlide> */}
              <SwiperSlide style={{ height: "258px" }}>
                <img
                  src="/refer_banner.png"
                  alt="referral"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    height: "100%",
                    margin: "auto",
                  }}
                  onClick={() =>
                    window.open("https://referral.croxswap.com/", "_blank")
                  }
                />
              </SwiperSlide>
            </Swiper>
          </div>
          <CakeStats />
        </StyledCards>
      ) : (
        <>
          <CakeStats />
          <SwiperContainer>
            <Swiper
              navigation={true}
              loop={true}
              className="mySwiper"
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
            >
              <SwiperSlide>
                <img
                  src="/bridge_banner.png"
                  alt="bridge"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    margin: "auto",
                  }}
                  onClick={() =>
                    window.open("https://bridge.croxswap.com/", "_blank")
                  }
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="/crox_baby_banner.png"
                  alt="crox baby lp"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    margin: "auto",
                  }}
                  onClick={() => history.push("/dualfarms")}
                />
              </SwiperSlide>
              {/*<SwiperSlide>
                <img
                  src="/stake_dpet_crox_banner.png"
                  alt="crox dpet"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    margin: "auto",
                  }}
                  onClick={() => history.push("/pools/crox")}
                />
              </SwiperSlide>

              <SwiperSlide>
                <img
                  src="/farming_banner.png"
                  alt="dualfarms"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    margin: "auto",
                  }}
                  onClick={() => history.push("/dualfarms")}
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="/stake_crox_banner.png"
                  alt="earn other tokens"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    margin: "auto",
                  }}
                  onClick={() => history.push("/pools/nextgen")}
                />
              </SwiperSlide> */}
              <SwiperSlide>
                <img
                  src="/refer_banner.png"
                  alt="referral"
                  style={{
                    borderRadius: "20px",
                    display: "block",
                    margin: "auto",
                  }}
                  onClick={() =>
                    window.open("https://referral.croxswap.com/", "_blank")
                  }
                />
              </SwiperSlide>
            </Swiper>
          </SwiperContainer>
        </>
      )}

      {(!isLg && !isMd && !isSm && !isXs) ? (
        <FourWayCardsWrapper>
          <FourWayTitle>
            4 ways to make passive income from CroxSwap
          </FourWayTitle>
          <FourWayCards>
            <FourWayCard
              number="1"
              desc="Provide Liquidity & Earn a Share of"
              percent="0.5"
              type="Trade Fees"
              buttonText="Add Liquidity"
              onClick={() =>
                window.open(
                  "https://exchange.croxswap.com/#/pool",
                  "_blank"
                )
              }
            />
            <FourWayCard
              number="2"
              desc="FARM with LP Tokens & Earn Multiple Tokens. Up To"
              percent={maxAPRForDualFarm.toLocaleString()}
              type="APR"
              buttonText="FARM & Earn"
              onClick={() => history.push("/dualfarms")}
            />
            <FourWayCard
              number="3"
              desc="STAKE CROX & Earn Other Tokens. Up To"
              percent={maxAPRForNGPool.toLocaleString()}
              type="APR"
              buttonText="STAKE CROX"
              onClick={() => history.push("/pools/nextgen")}
            />
            <FourWayCard
              number="4"
              desc="Refer Friends & Earn"
              percent="5"
              type="from their earnings"
              buttonText="Refer Now"
              onClick={() =>
                window.open("https://referral.croxswap.com/", "_blank")
              }
            />
            {/* <FourWayCard number="1" desc="Provide Liquidity & Earn a Share of" percent="0.5" type="Swap Fees" buttonText="Add Liquidity" />
            <FourWayCard number="2" desc="FARM with LP tokens & Earn $CROX Up to" percent="500" type="APR" buttonText="FARM & Earn" />
            <FourWayCard number="3" desc="STAKE in CROX Pools & Earn More Up To" percent="800" type="APR" buttonText="STAKE & Earn" />
            <FourWayCard number="4" desc="Refer Friends & Earn" percent="5" type="from their earnings" buttonText="Refer Now" /> */}
          </FourWayCards>
        </FourWayCardsWrapper>
      ) : (
        <FourWayCardsWrapper>
          <FourWayTitle>
            4 ways to make passive income from CroxSwap
          </FourWayTitle>
          <Swiper
            navigation={true}
            loop={true}
            className="mySwiper"
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              "640": {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              "768": {
                slidesPerView: 2,
                spaceBetween: 40,
              },
              "1140": {
                slidesPerView: 3,
                spaceBetween: 50,
              },
            }}
          >
            <SwiperSlide>
              <FourWayCard
                number="1"
                desc="Provide Liquidity & Earn a Share of"
                percent="0.5"
                type="Trade Fees"
                buttonText="Add Liquidity"
                onClick={() =>
                  window.open(
                    "https://exchange.croxswap.com/#/pool",
                    "_blank"
                  )
                }
              />
            </SwiperSlide>
            <SwiperSlide>
              <FourWayCard
                number="2"
                desc="FARM with LP Tokens & Earn Multiple Tokens. Up To"
                percent={maxAPRForDualFarm.toLocaleString()}
                type="APR"
                buttonText="FARM & Earn"
                onClick={() => history.push("/dualfarms")}
              />
            </SwiperSlide>
            <SwiperSlide>
              <FourWayCard
                number="3"
                desc="STAKE CROX & Earn Other Tokens. Up To"
                percent={maxAPRForNGPool.toLocaleString()}
                type="APR"
                buttonText="STAKE CROX"
                onClick={() => history.push("/pools/nextgen")}
              />
            </SwiperSlide>
            <SwiperSlide>
              <FourWayCard
                number="4"
                desc="Refer Friends & Earn"
                percent="5"
                type="from their earnings"
                buttonText="Refer Now"
                onClick={() =>
                  window.open("https://referral.croxswap.com/", "_blank")
                }
              />
            </SwiperSlide>
          </Swiper>
        </FourWayCardsWrapper>
      )}

      <div>
        {!isMd && !isSm && !isXs ? (
          <>
            <Cards>
              {/* <FarmStakingCard /> */}
              <div style={{ width: "50%" }}>
                <InvestorCard />
              </div>
              <div
                style={{
                  width: "48%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#253253",
                  padding: "20px",
                  borderRadius: "30px"
                }}
              >
                <TwitterCard />
              </div>
              {/* <TwitterCard /> */}
            </Cards>
            <PoolBannerCard />
          </>
        ) : (
          <>
            <div style={{ marginBottom: "10px" }}>
              <InvestorCard />
            </div>
            <TwitterCard />
            <PoolBannerCard />
          </>
        )}
      </div>
    </Page>
  );
};

export default Home;

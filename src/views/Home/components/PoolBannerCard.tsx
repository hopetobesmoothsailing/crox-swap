import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardBody, Heading, Text, Image, Button } from "crox-uikit2.0";
import styled from "styled-components";
import useI18n from "hooks/useI18n";

import {
  getAPYAndTVLOfPool,
} from "utils/defi";

import {
  usePriceCakeBusd,
  useCroxPools,
  usePriceBnbBusd,
} from "../../../state/hooks";

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 15px;
  @media screen and (max-width: 750px) {
    display: block;
  }  
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
    align-items: center;
    display: flex;
    font-size: 14px;
    justify-content: space-around;
    margin-bottom: 20px;
    padding: 0 20px;
    @media screen and (max-width: 750px) {
        display: inline-block;
        width: 100%;
        padding: 0;
    }  
`;

const StyledCakeStats = styled(Card)`
  width: 100%;
  margin: auto;
  background: #121827;
  margin-bottom: 10px;
  & .swiper-button-prev:after,
  & .swiper-button-next:after {
    opacity: 0.5 !important;
    font-size: 20px !important;
  }
  @media screen and (min-width: 770px) {
    width: 80%;
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
  font-weight: bold;
  @media screen and (max-width: 750px) {
    text-align: center;
  } 
`;

const SCTvlText = styled.div`
    fontSize: 15px; 
    margin: -5px 0 10px 0;
    font-weight: bold;
    color: #c9c4d4;
    @media screen and (max-width: 750px) {
       text-align: center;
    }
    @media screen and (max-width: 550px) {
      font-size: 12px;
   }
`;

const BannerCard = styled.div`
  padding: 10px 20px;
  background-color: #302a42;
  border-radius: 20px;
  box-shadow: -3px -1px 8px #706593;
  display: flex;
  margin: auto;
  @media screen and (max-width: 750px) {
    justify-content: center;
 }
`;

const Img = styled.div`
    display: flex; 
    padding: 0 10px; 
`

const CardMargin = styled.div`
    margin: auto 0;    
    @media screen and (max-width: 750px) {
        margin: auto 0;    
    } 
`;

const CardHeader = styled.div`
    font-size: 22px;
    font-weight: bold;
    color: #0498aec7;
    @media screen and (max-width: 750px) {
        font-size: 17px;
    } 
`;

const CardContent = styled.div`
    font-size: 15px;
    color: #c9c4d4;
`;

const APR = styled.div`
    font-size: 20px;
    font-weight: bold;
    color: #0498aec7;
`;

const Price = styled.div`
    font-size: 20px;
    font-weight: bold;
    color: #0498aec7;
`;

const Title = styled.div`
    color: #c9c4d4;
    font-size: 18px;
    @media screen and (max-width: 750px) {
        font-size: 17px;
        margin-top: 10px;
        text-align: center;
    } 
`;


const PoolBannerCard = () => {
  const history = useHistory();
  const croxpools = useCroxPools();
  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();

  const activeCroxPools = croxpools
    .filter((farm) => farm.multiplier !== "0X" && farm.lpSymbol === "CROX")
    .map((farm) => {
      const pidInAbs = Math.abs(farm.pid);
      const { apy, totalValue } = getAPYAndTVLOfPool(farm, {
        cakePrice,
        bnbPrice,
      });
      return { ...farm, apy, totalValue, pidInAbs };
    });

  const goToPool = () => {
    history.push('/pools/crox')
  }

  return (
    <StyledCakeStats>
      <CardBody style={{ padding: "20px 40px 20px 30px" }}>
        <Row style={{ marginBottom: "5px" }}>
          <SCSubHeading color="primary" bold >
            Next-Generation Staking Pools
          </SCSubHeading>
        </Row>
        <Row>
          <SCTvlText color="textSubtle">
            Stake your CROX in pools to earn new tokens
          </SCTvlText>
        </Row>
        {activeCroxPools &&
          activeCroxPools.length > 0 &&
          activeCroxPools.map((farm, index) => {
            return (
              <Content>
                <Col>
                  <BannerCard>
                    <div>
                      <img src="/images/farms/crox.svg" alt="crox" width={80} height={80} />
                    </div>
                    <CardMargin>
                      <div style={{ textAlign: "center" }}>
                        <CardHeader>Native CROX Pool</CardHeader>
                      </div>
                      <div style={{ textAlign: "center", margin: "5px" }}>
                        <CardContent>Stake CROX, Earn CROX</CardContent>
                      </div>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <APR>APR: </APR>
                        <Price style={{ marginLeft: '4px' }}>
                          {farm.apy.times(100).toFixed(2)}%
                        </Price>
                      </div>
                    </CardMargin>
                  </BannerCard>
                </Col>
                <Col>
                  <div>
                    <div style={{ justifyContent: "center", marginBottom: "20px" }}>
                      <Title>Passive income forever</Title>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Button style={{ fontSize: "20px", borderRadius: "10px", padding: "0px 40px" }} onClick={goToPool}> Earn Now </Button>
                    </div>
                  </div>
                </Col>
              </Content>
            );
          })
        }
      </CardBody>
    </StyledCakeStats>
  )
}

export default PoolBannerCard;
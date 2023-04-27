/* eslint-disable */
import React from "react";
import { Card, CardBody, Heading, Text } from "crox-uikit2.0";
import BigNumber from "bignumber.js/bignumber";
import styled from "styled-components";
import { getBalanceNumber } from "utils/formatBalance";
import useTokenBalance, {
  useTotalSupply,
  useBurnedBalance,
  useTotalStakedSupply,
} from "hooks/useTokenBalance";
import useI18n from "hooks/useI18n";
import { getCakeAddress } from "utils/addressHelpers";
import CardValue from "./CardValue";
import { useFarms, usePriceCakeBusd } from "../../../state/hooks";
import TotalValueLockedCard from "./TotalValueLockedCard";
import { useTotalValue } from "../../../state/hooks";

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  background: #121827;
`;

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const SCHeading = styled(Heading)`
  // color: white;
  text-align: center;
  font-size: 20px;
  margin-top: 4px;
`;

const SCHeading1 = styled(Heading)`
  // color: white;
  text-align: center;
  font-size: 25px;
  margin-top: 4px;
`;

const CakeStats = () => {
  const totalValue = useTotalValue();
  const TranslateString = useI18n();
  const totalSupply = useTotalSupply();
  const burnedBalance = useBurnedBalance(getCakeAddress());
  const stakedCrox = useTotalStakedSupply();
  const farms = useFarms();
  const eggPrice = usePriceCakeBusd();
  const circSupply = totalSupply
    ? totalSupply.minus(burnedBalance)
    : new BigNumber(0);
  const cakeSupply = getBalanceNumber(circSupply);
  const marketCap = eggPrice.times(circSupply);

  let croxPerBlock = 0;
  if (farms && farms[0] && farms[0].croxPerBlock) {
    croxPerBlock = new BigNumber(farms[0].croxPerBlock)
      .div(new BigNumber(10).pow(18))
      .toNumber();
  }

  return (
    <div style={{ flex: "auto" }}>
      {/* <TotalValueLockedCard /> */}

      <StyledCakeStats style={{ marginBottom: "10px" }}>
        <CardBody>
          <SCHeading1 color="textSubtle">CROX Stats</SCHeading1>
          <Row>
            <Text fontSize="18px" color="textSubtle" bold>
              {TranslateString(10005, "Market Cap")}
            </Text>
            <CardValue
              fontSize="20px"
              value={getBalanceNumber(marketCap)}
              decimals={0}
              prefix="$"
            />
          </Row>
          <Row>
            <Text fontSize="18px" color="textSubtle" bold>
              Total CROX Staked
            </Text>
            {stakedCrox && (
              <CardValue
                fontSize="20px"
                value={getBalanceNumber(stakedCrox)}
                decimals={0}
              />
            )}
          </Row>
          {/* <Row>
            <Text fontSize="20px" color="textSubtle" bold>{TranslateString(536, 'Total Minted')}</Text>
            {totalSupply && <CardValue fontSize="20px" value={getBalanceNumber(totalSupply)} decimals={0} />}
          </Row> */}
          <hr style={{ height: 1, borderColor: "#999" }} />

          <SCHeading color="textSubtle">
            {TranslateString(999, "Total Value Locked (TVL)")}
          </SCHeading>
          {/* <Heading size="xl">{`$${tvl}`}</Heading> */}
          {/* <Heading size="xl"> */}
          <div style={{ textAlign: "center" }}>
            <CardValue
              fontSize="30px"
              value={totalValue.toNumber()}
              prefix="$"
              decimals={2}
            />
          </div>
          {/* </Heading> */}
          <div style={{ textAlign: "center" }}>
            <Text color="primary" fontSize="18px">
              {TranslateString(999, "Across all Farms and Pools")}
            </Text>
          </div>
          {/* <Row>
            <Text fontSize="20px" color="textSubtle" bold>{TranslateString(538, 'Total Burned')}</Text>
            <CardValue fontSize="20px" value={getBalanceNumber(burnedBalance)} decimals={0} />
          </Row>
          <Row>
            <Text fontSize="20px" color="textSubtle" bold>{TranslateString(10004, 'Circulating Supply')}</Text>
            {cakeSupply && <CardValue fontSize="20px" value={cakeSupply} decimals={0} />}
          </Row>
          <Row>
            <Text fontSize="20px" color="textSubtle" bold>{TranslateString(540, 'New Crox/block')}</Text>
            <CardValue fontSize="20px" value={croxPerBlock} decimals={1} />
          </Row> */}
        </CardBody>
      </StyledCakeStats>
    </div>
  );
};

export default CakeStats;

import React, { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import styled, { keyframes } from "styled-components";
import { Flex, Text, Skeleton } from "crox-uikit2.0";
import { Farm } from "state/types";
import { provider } from "web3-core";
import useI18n from "hooks/useI18n";

import CardHeading from "./CardHeading";

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

const CardContainer = styled.div`
  align-self: baseline;
  background: #27262c;
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1),
    0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: center;
  margin-top: 20px;
  width: 45%;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
`;

const FCard = styled.div`
  width: 100%;
  align-self: baseline;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  position: relative;
  text-align: center;
`;

const SecondWrapper = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  display: inline-grid;
  border-top: 1px solid grey;
  width: 100%;
`;
interface UpComingCardProps {
  farm: any;
  removed: boolean;
  cakePrice?: BigNumber;
  bnbPrice?: BigNumber;
  ethereum?: provider;
  account?: string;
}

const UpComingCard: React.FC<UpComingCardProps> = ({ farm }) => {
  const [startTime, setStartTime] = useState("");

  const calcStartTime = () => {
    const diff = farm.timestamp - new Date().getTime();
    const minutes = Math.floor((diff / 60000.0) % 60);
    const hours = Math.floor((diff / 3600000) % 24);
    const days = Math.floor(diff / 3600000 / 24);

    return (
      (days > 0 ? `${days} days ` : "") +
      (hours > 0 ? `${hours} hours ` : "") +
      (minutes > 0 ? `${minutes} minutes` : "")
    );
  };

  useEffect(() => {
    setStartTime(calcStartTime());
    const handle = setInterval(() => setStartTime(calcStartTime()), 60000);
    return () => clearInterval(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardContainer>
      <FCard>
        <CardHeading
          lpLabel={farm.lpLabel}
          lpSubLabel={farm.lpSubLabel}
          farmImage={farm.farmImage}
          tokenSymbol={farm.tokenSymbol}
        />
        <SecondWrapper>
          <Flex justifyContent="center">
            <Text color="textSubtle">{farm.description ?? ""}</Text>
          </Flex>
          <Flex justifyContent="center">
            <Text
              color="primary"
              style={{ cursor: "pointer"}}
              onClick={() => window.open("https://zetj2nazjv0.typeform.com/to/xtXrqGvo", "_blank")}
            >
            Apply Now
            </Text>
          </Flex>
        </SecondWrapper>
      </FCard>
    </CardContainer>
  );
};

export default UpComingCard;

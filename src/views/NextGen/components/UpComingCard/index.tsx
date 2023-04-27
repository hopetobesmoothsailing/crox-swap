import React, { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import styled, { keyframes } from "styled-components";
import { Flex, Text, Skeleton } from "crox-uikit2.0";
import { Farm } from "state/types";
import { provider } from "web3-core";
import "../FarmCard/Whalepool.scss";
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
  width: 48%;
  margin-top: 30px;
  align-self: baseline;
  background: #27262c;
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1),
    0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: center;
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
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const TimeCountWrapper = styled.div`
  display: inline-grid;
  width: 100%;
  .timecount {
    border-top: 1px solid grey;
  }
  .visitsite {
    margin-top: 30px;
  }
  @media screen and (max-width: 700px) {
    width: 100%;
    .starttime, .timecount {
      margin-top: 0;
    }
    .visitsite {
      margin-top: 30px;
    }
  }
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
    const second = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 60000.0) % 60);
    const hours = Math.floor((diff / 3600000) % 24);
    const days = Math.floor(diff / 3600000 / 24);

    return (
      (days > 0 ? `${days} : ` : "") +
      (hours >= 0 ? `${hours} : ` : "") +
      (minutes >= 0 ? `${minutes} : ` : "") + 
      (second >= 0 ? `${second}` : "")
    );
  };

  useEffect(() => {
    setStartTime(calcStartTime());
    const handle = setInterval(() => setStartTime(calcStartTime()), 1000);
    return () => clearInterval(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardContainer>
      <FCard>
        <CardHeading
          lpLabel={farm.lpLabel}
          lpSubLabel={farm.lpSubLabel}
          multiplier={farm.multiplier}
          risk={10}
          depositFee={farm.depositFeeBP}
          farmImage={farm.farmImage}
          tokenSymbol={farm.tokenSymbol}
          description={farm.description}
        />
        <TimeCountWrapper>
          <Flex justifyContent="center" mb="-40px" className="starttime">
            <Text color="primary" fontSize="30px" className="timecount">{startTime}</Text>
          </Flex>
          <Flex justifyContent="center" mt="20px" className="visitsite">
            <Text
              color="primary"
              style={{ cursor: "pointer" }}
              onClick={() => window.open(farm.website, "_blank")}
            >
              Visit Project Site
            </Text>
          </Flex>
        </TimeCountWrapper>
      </FCard>
    </CardContainer>
  );
};

export default UpComingCard;

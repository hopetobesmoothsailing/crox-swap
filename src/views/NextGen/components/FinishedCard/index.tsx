import React, { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import styled, { keyframes } from "styled-components";
import { Flex, Text, Skeleton, Button } from "crox-uikit2.0";
import { Farm } from "state/types";
import { provider } from "web3-core";
import useI18n from "hooks/useI18n";
import ExpandableSectionButton from "components/ExpandableSectionButton";
import CardHeading from "./CardHeading";
import DetailsSection from "./DetailsSection";

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

const FinishContainer = styled.div`
  display: flex;
`;

const FinishActionText = styled.div`
  
`;

const FinishText = styled.p`
  font-size: 20px;
  color: white;
  margin-top: 10px;
  text-align: left;
`;

const FinishNumber = styled.p`
  font-size: 20px;
  color: white;
  margin-top: 10px;
  text-align: left;
`;

const FinishedText = styled.div`
  margin-top: 50px;
`;

const UnstakeText = styled.p`
  font-size: 15px;
  color: white;
  margin-bottom: 30px;
  font-weight: 600;
`;

const CardContainer = styled.div`
  align-self: baseline;
  // background: ${(props) => props.theme.card.background};
  background: #27262c;
  border-radius: 32px;
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
  padding: 24px;
  position: relative;
  text-align: center;
`;

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`;

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
`;

interface FinishedCardProps {
  farm: any;
  removed: boolean;
  cakePrice?: BigNumber;
  bnbPrice?: BigNumber;
  ethereum?: provider;
  account?: string;
}

const FinishedCard: React.FC<FinishedCardProps> = ({ farm }) => {
  const [startTime, setStartTime] = useState("");
  const [showExpandableSection, setShowExpandableSection] = useState(false);

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
          lpName={farm.lpName}
          lpSubLabel={farm.lpSubLabel}
          multiplier={farm.multiplier}
          risk={10}
          depositFee={farm.depositFeeBP}
          farmImage={farm.farmImage}
          tokenSymbol={farm.tokenSymbol}
        />
        
        <FinishedText>
            <svg width="151" height="27" viewBox="0 0 151 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.907031 14.05L3.58203 16.65L3.58203 22.775L0.907031 25.225L0.907031 14.05ZM3.80703 14.95C3.19036 14.4667 2.60703 14.0083 2.05703 13.575L3.80703 12.25L10.632 12.25L12.382 13.575L10.632 14.95L3.80703 14.95ZM1.60703 0.924999L12.782 0.924999L10.357 3.625H4.18203L1.60703 0.924999ZM0.882031 13.175V2L3.55703 4.425V10.625L0.882031 13.175ZM27.8271 25.225L25.1271 22.65V16.5L27.8271 14.05V25.225ZM27.7771 2V13.175L25.0771 10.75V4.575L27.7771 2ZM38.4973 11.925V0.699999L41.1973 3.175V9.35L38.4973 11.925ZM53.7223 0.699999V11.925L51.0223 9.45V3.3L53.7223 0.699999ZM38.4223 12.775L41.1223 15.35V21.525L38.4223 23.975V12.775ZM53.6473 23.975L50.9473 21.375V15.225L53.6473 12.775V23.975ZM42.4723 8.1V3.025L49.5723 14.975V20.075L42.4723 8.1ZM67.0674 25.225L64.3674 22.65V16.5L67.0674 14.05V25.225ZM67.0174 2V13.175L64.3174 10.75V4.575L67.0174 2ZM79.7375 26.325L82.3125 23.625L88.4875 23.625L90.9125 26.325L79.7375 26.325ZM91.7125 25.225L89.0125 22.65V16.5L91.7125 14.05V25.225ZM81.8875 14.95C81.3042 14.4833 80.7125 14.025 80.1125 13.575L81.8875 12.25H88.7125L90.4625 13.575L88.7125 14.95H81.8875ZM79.7125 0.924999L90.8875 0.924999L88.4125 3.625L82.2875 3.625L79.7125 0.924999ZM78.9125 13.175V2L81.6125 4.425V10.625L78.9125 13.175ZM98.6076 14.05L101.308 16.65V22.775L98.6076 25.225V14.05ZM111.333 25.225L108.633 22.65V16.5L111.333 14.05V25.225ZM101.508 14.95C100.924 14.4833 100.333 14.025 99.7326 13.575L101.508 12.25L108.333 12.25L110.083 13.575L108.333 14.95L101.508 14.95ZM98.5326 13.175V2L101.233 4.425V10.625L98.5326 13.175ZM111.258 2V13.175L108.558 10.75V4.575L111.258 2ZM119.353 26.325L121.928 23.625H128.103L130.553 26.325H119.353ZM118.628 14.05L121.303 16.65V22.775L118.628 25.225V14.05ZM121.503 14.95C120.886 14.4667 120.303 14.0083 119.753 13.575L121.503 12.25H128.328L130.078 13.575L128.328 14.95H121.503ZM119.328 0.924999L130.478 0.924999L128.053 3.625L121.878 3.625L119.328 0.924999ZM118.553 13.175V2L121.228 4.425V10.625L118.553 13.175ZM138.598 26.325L141.173 23.625H147.348L149.773 26.325H138.598ZM137.848 14.05L140.548 16.65V22.775L137.848 25.225V14.05ZM150.573 25.225L147.873 22.65V16.5L150.573 14.05V25.225ZM138.573 0.924999L149.748 0.924999L147.273 3.625L141.148 3.625L138.573 0.924999ZM137.773 13.175V2L140.473 4.425V10.625L137.773 13.175ZM150.498 2V13.175L147.798 10.75V4.575L150.498 2Z" fill="white"/>
            </svg>
        </FinishedText>
        <UnstakeText>Unstake Anytime</UnstakeText>

        <FinishContainer>
            <FinishActionText>
                <FinishText>CROX Earned</FinishText>
                <FinishNumber>0</FinishNumber>
                <FinishText>CNS Earned</FinishText>
                <FinishNumber>0</FinishNumber>
            </FinishActionText>
            <Button mt="30px" ml="30px" disabled={!false}>
                Claim Rewards
            </Button>
        </FinishContainer>
        <Flex mt="5px">
            <Text
            bold
            textTransform="uppercase"
            color="primary"
            fontSize="12px"
            pr="3px"
            >
            {farm.lpName}
            </Text>
            <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            Staked
            </Text>
        </Flex>
        <Button fullWidth mt="5px" mb="75px">
            Unlock Wallet
        </Button>
        <Divider />
        <ExpandableSectionButton 
            onClick={() => setShowExpandableSection(!showExpandableSection)}
            expanded={showExpandableSection}
        />
        <ExpandingWrapper expanded={showExpandableSection}>
            <DetailsSection />
        </ExpandingWrapper>
      </FCard>
    </CardContainer>
  );
};

export default FinishedCard;

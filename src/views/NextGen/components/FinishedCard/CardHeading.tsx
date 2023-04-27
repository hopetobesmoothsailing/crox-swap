import React from "react";
import styled from "styled-components";
import { Tag, Flex, Heading, Image, Text } from "crox-uikit2.0";
import {
  CommunityTag,
  CoreTag,
  NoFeeNoIconTag,
  RiskTag,
} from "components/Tags";

export interface ExpandableSectionProps {
  lpLabel?: string;
  lpSubLabel?: string;
  multiplier?: string;
  risk?: number;
  depositFee?: number;
  farmImage?: string;
  tokenSymbol?: string;
  lpName?: string;
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
`;

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  lpSubLabel,
  multiplier,
  risk,
  farmImage,
  tokenSymbol,
  depositFee,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Image
        src={`/images/farms/${farmImage}.svg`}
        alt={tokenSymbol}
        width={64}
        height={64}
      />
      <div>
        <Heading
          color="textSubtle"
          mb="4px"
          style={{ fontSize: 15 }}
          dangerouslySetInnerHTML={{ __html: lpLabel }}
        />

        <Text color="textSubtle" style={{ fontSize: 12 }}>
          {lpSubLabel}
        </Text>
      </div>
      <Flex flexDirection="column" alignItems="flex-end">
        {tokenSymbol ? (
          <Flex justifyContent="center" mb="30px">
            <Tag variant="success" outline>
              {tokenSymbol}
            </Tag>
          </Flex>
        ) : (
          <Flex justifyContent="center">
            {depositFee === 0 ? <NoFeeNoIconTag /> : null}
            {/* {isCommunityFarm ? <CommunityTag /> : <CoreTag />} */}
            {/* <RiskTag risk={risk} /> */}
          </Flex>
        )}
      </Flex>
    </Wrapper>
  );
};

export default CardHeading;

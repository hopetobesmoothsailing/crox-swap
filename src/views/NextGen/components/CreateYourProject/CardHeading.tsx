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
  farmImage?: string;
  tokenSymbol?: string;
}

const Wrapper = styled(Flex)`
  flex-direction: column;
  padding: 0 10px 0 0;
  svg {
    margin-right: 0.25rem;
  }
`;
const HeaderWrapper = styled(Flex)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: -10px;
`;

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  lpSubLabel,
  farmImage,
  tokenSymbol,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <HeaderWrapper>
        <Image
          src={`/images/farms/${farmImage}.svg`}
          alt={tokenSymbol}
          width={64}
          height={64}
        />
        <div style={{width: '80%', marginTop: '5px'}}>
          <Heading
            color="textSubtle"
            mb="4px"
            style={{ fontSize: 25 }}
            dangerouslySetInnerHTML={{ __html: lpLabel }}
          />
          <Text color="textSubtle" style={{ fontSize: 15 }}>
            {lpSubLabel}
          </Text>
        </div>
      </HeaderWrapper>
    </Wrapper>
  );
};

export default CardHeading;

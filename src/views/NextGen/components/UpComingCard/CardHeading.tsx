import React from "react";
import styled from "styled-components";
import { Tag, Flex, Heading, Image, Text } from "crox-uikit2.0";
import {
  NoFeeNoIconTag,
} from "components/Tags";

export interface ExpandableSectionProps {
  lpLabel?: string;
  lpSubLabel?: string;
  multiplier?: string;
  risk?: number;
  depositFee?: number;
  farmImage?: string;
  description?: string;
  tokenSymbol?: string;
}

const Wrapper = styled(Flex)`
  flex-direction: column;
  padding: 0 10px 0 0;
  svg {
    margin-right: 0.25rem;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
    padding: 0 10px 0 0;
    border: none;
  }
`;
const HeaderWrapper = styled(Flex)`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  lpSubLabel,
  multiplier,
  risk,
  description,
  farmImage,
  tokenSymbol,
  depositFee,
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
        <div>
          <Heading
            color="textSubtle"
            mt="5px"
            style={{ fontSize: 18 }}
            dangerouslySetInnerHTML={{ __html: lpLabel }}
          />

          <Text color="textSubtle" style={{ fontSize: 12 }}>
            {lpSubLabel}
          </Text>
        </div>
        <Flex flexDirection="column" alignItems="flex-end">
          {tokenSymbol ? (
            <Flex justifyContent="center" mt="15px">
              <Tag variant="success" outline>
                {tokenSymbol}
              </Tag>
            </Flex>
          ) : (
            <Flex justifyContent="center">
              {depositFee === 0 ? <NoFeeNoIconTag /> : null}
            </Flex>
          )}
        </Flex>
      </HeaderWrapper>
      <Flex justifyContent="space-between" pt="7px" mt="7px" style={{borderTop: '1px solid grey'}}>
        <Text color="textSubtle">{description ?? ""}</Text>
      </Flex>
    </Wrapper>
  );
};

export default CardHeading;

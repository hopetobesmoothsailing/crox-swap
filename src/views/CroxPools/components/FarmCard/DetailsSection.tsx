import React from "react";
import useI18n from "hooks/useI18n";
import styled from "styled-components";
import BigNumber from "bignumber.js";

import { Text, Flex, Link, LinkExternal } from "crox-uikit";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import { Address } from "config/constants/types";

export interface ExpandableSectionProps {
  isTokenOnly?: boolean;
  bscScanAddress?: string;
  removed?: boolean;
  totalValueFormated?: string;
  lpLabel?: string;
  quoteTokenAdresses?: Address;
  quoteTokenSymbol?: string;
  tokenAddresses: Address;
  lpAddresses: Address;
  projectLink?: string;
  tokenDecimal?: number;
  tokenPrice?: number;
  stakedBalance?: string;
}

const Wrapper = styled.div`
  margin-top: 24px;
`;

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textSubtle};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  isTokenOnly,
  bscScanAddress,
  removed,
  totalValueFormated,
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  lpAddresses,
  stakedBalance,
  tokenDecimal,
  tokenPrice,
}) => {
  const TranslateString = useI18n();
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAdresses,
    quoteTokenSymbol,
    tokenAddresses,
  });

  const yourLPValue = stakedBalance
    ? new BigNumber(stakedBalance)
        .div(`1e${tokenDecimal ?? 18}`)
        .times(tokenPrice)
    : 0;

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text color="textSubtle">{TranslateString(316, "Stake")}:</Text>
        <StyledLinkExternal
          href={`https://exchange.croxswap.com/#/swap/${
            lpAddresses[process.env.REACT_APP_CHAIN_ID]
          }`}
        >
          {lpLabel}
        </StyledLinkExternal>
      </Flex>
      {!removed && (
        <Flex justifyContent="space-between">
          <Text color="textSubtle">Total:</Text>
          <Text color="textSubtle">{totalValueFormated}</Text>
        </Flex>
      )}
      <Flex justifyContent="space-between">
        <Text color="textSubtle">Your Staked Value:</Text>
        <Text color="textSubtle">${yourLPValue.toFixed(2)}</Text>
      </Flex>
      <Flex justifyContent="flex-start">
        <Link external href={bscScanAddress} bold={false} color="white">
          {TranslateString(356, "View on BscScan")}
        </Link>
      </Flex>
    </Wrapper>
  );
};

export default DetailsSection;

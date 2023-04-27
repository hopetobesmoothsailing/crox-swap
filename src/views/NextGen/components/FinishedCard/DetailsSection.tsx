import React from "react";
import useI18n from "hooks/useI18n";
import styled from "styled-components";
import { Text, Flex, Link, LinkExternal } from "crox-uikit";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import { Address } from "config/constants/types";
import BigNumber from "bignumber.js";
import { usePriceCakeBusd } from "state/hooks";

export interface ExpandableSectionProps {
  isTokenOnly?: boolean;
}

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  isTokenOnly,
  
}) => {
  

  return (
    <Text> </Text>
  )
};

export default DetailsSection;

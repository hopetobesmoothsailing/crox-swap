import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { usePriceCakeBusd } from "state/hooks";
import { Button, Flex, Heading, Text } from "crox-uikit";
import useI18n from "hooks/useI18n";
import { useDualHarvest, useHarvest } from "hooks/useHarvest";
import { getBalanceNumber } from "utils/formatBalance";
import styled from "styled-components";
import useDualStake from "hooks/useDualStake";

interface FarmCardActionsProps {
  earnings?: any;
  pid?: number;
  nextHarvestUntil?: number;
  isDualFarm?: boolean;
  firstSymbol: string;
  secondSymbol: string;
  removed?: boolean;
  harvestLockDay?: any;
  tokenDecimal: number;
  tokenPrice?: number;
  isWhalePool?: boolean;
  isShrimpPool?: boolean;
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`;

const DisableButton = styled.button`
  font-size: 15px;
  padding: 0px 5px;
  height: 35px;
  border-radius: 10px;
  border: none;
  background-color: #3c3742;
  color: #666171;
  font-weight: bold;
`;

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  firstSymbol,
  secondSymbol,
  earnings,
  pid,
  nextHarvestUntil,
  isDualFarm,
  tokenDecimal,
  tokenPrice,
  harvestLockDay,
  isWhalePool,
  isShrimpPool
}) => {
  const TranslateString = useI18n();
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useDualHarvest(pid);
  const { onDualStake } = useDualStake(pid);

  const rawEarningsBalance1 = getBalanceNumber(
    !isDualFarm && !isWhalePool && !isShrimpPool
      ? new BigNumber(earnings[0]).times(
        10 ** (tokenDecimal ? 18 - tokenDecimal : 0)
      )
      : earnings[0]
  );
  const displayBalance1 = rawEarningsBalance1.toLocaleString();

  const rawEarningsBalance2 = getBalanceNumber(
    isDualFarm || isWhalePool || isShrimpPool
      ? new BigNumber(earnings[1]).times(
        10 ** (tokenDecimal ? 18 - tokenDecimal : 0)
      )
      : earnings[1],
    !isDualFarm && (isWhalePool || isShrimpPool) ? 8 : 18
  );
  const displayBalance2 = rawEarningsBalance2.toLocaleString();

  const today = new Date().getTime() / 1000;

  const croxEarnedUsd1 = new BigNumber(tokenPrice).multipliedBy(rawEarningsBalance1);

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center" style={{ marginTop: "5%" }}>
      <Flex flexDirection="column" alignItems="flex-start">
        {isDualFarm || isWhalePool || isShrimpPool  ? (
          <>
            <Text color="white">{firstSymbol} Earned</Text>
            <Heading
              color={rawEarningsBalance1 === 0 ? "textDisabled" : "white"}
              style={{ fontSize: "20px", width: "98%" }}
            >
              {displayBalance1}
            </Heading>

            <Text color="white">{secondSymbol} Earned</Text>
            <Heading
              color={rawEarningsBalance2 === 0 ? "textDisabled" : "white"}
              style={{ fontSize: "20px", width: "98%" }}
            >
              {displayBalance2}
            </Heading>
          </>
        ) : (
          <>
            <Text color="white">{secondSymbol} Earned</Text>
            <Heading
              color={rawEarningsBalance1 === 0 ? "textDisabled" : "white"}
              style={{ width: "98%" }}
              fontSize="20px"
            >
              <Text style={{ margin: "1px" }} fontSize="20px" color="white">
                {displayBalance1}
              </Text>
            </Heading>
            {/* <Text style={{ width: "98%" }} fontSize="20px" color="white">${croxEarnedUsd1.toFixed(3)}</Text> */}
          </>
        )}
      </Flex>
      <BalanceAndCompound>
        {((rawEarningsBalance1 === 0 && rawEarningsBalance2 === 0) || pendingTx || today < nextHarvestUntil) ? (
          <DisableButton>Claim Rewards</DisableButton>
        ) : (
          <Button
            onClick={async () => {
              setPendingTx(true);
              await onReward();
              setPendingTx(false);
            }}
            style={{ fontSize: "18px", padding: "0px 5px", height: "35px", borderRadius: "10px" }}
          >
            Claim Rewards
          </Button>
        )}
        <Text fontSize="14px" bold color="white">Harvest Lock : {harvestLockDay / 24 / 3600} days</Text>
      </BalanceAndCompound>
    </Flex>
  );
};

export default HarvestAction;

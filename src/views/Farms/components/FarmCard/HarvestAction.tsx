import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { usePriceCakeBusd } from "state/hooks";
import { Button, Flex, Heading, Text} from "crox-uikit";
import useI18n from "hooks/useI18n";
import { useHarvest } from "hooks/useHarvest";
import { getBalanceNumber } from "utils/formatBalance";
import styled from "styled-components";
import useStake from "../../../../hooks/useStake";

interface FarmCardActionsProps {
  earnings?: BigNumber;
  pid?: number;
  nextHarvestUntil?: number;
  yourStakedBalance?: any;
}

const BalanceAndCompound = styled.div`
  width: 50%;
  display: flex;
  align-items: right;
  justify-content: space-between;
  flex-direction: column;
  margin-right: 20px;
`;

const DisableButton = styled.button`
  font-size: 20px;
  width: 110%;
  height: 35px;
  border-radius: 10px;
  border: none;
  background-color: #3c3742;
  color: #666171;
  font-weight: bold;
`;

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  earnings,
  pid,
  nextHarvestUntil,
  yourStakedBalance
}) => {
  const TranslateString = useI18n();
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useHarvest(pid);
  const { onStake } = useStake(pid);

  const rawEarningsBalance = getBalanceNumber(earnings);
  const displayBalance = rawEarningsBalance.toLocaleString();

  const today = new Date().getTime() / 1000;
  const cakePriceUsd = usePriceCakeBusd();
  const croxEarnedUsd1 = cakePriceUsd.multipliedBy(rawEarningsBalance);

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text>
        <Text style={{display: "inline-flex"}}>
          <Text
            textTransform="uppercase"
            color="primary"
            fontSize="15px"
            pr="3px"
          >
            {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
            CROX
          </Text>
          <Text textTransform="uppercase" color="textSubtle" fontSize="15px">
            {TranslateString(999, "Earned")}
          </Text>
        </Text>
        <Text>
          <Heading color={rawEarningsBalance === 0 ? "textDisabled" : "text"}>
            <Text style={{ fontSize: "20px" }} color="white">{displayBalance}</Text>
          </Heading>
          <Text textTransform="uppercase" color="textSubtle" fontSize="20px">
            ${croxEarnedUsd1.toFixed(3)}
          </Text>
        </Text>
      </Text>
      
      <BalanceAndCompound>
        {pid === -1 ? (
          <Button
            disabled={rawEarningsBalance === 0 || pendingTx}
            size="sm"
            variant="secondary"
            marginBottom="15px"
            onClick={async () => {
              setPendingTx(true);
              await onStake(rawEarningsBalance.toString());
              setPendingTx(false);
            }}
            style={{ fontSize: "20px", width: "110%", height: "33px" }}
          >
            {TranslateString(999, "Compound")}
          </Button>
        ) : null}
        {(rawEarningsBalance === 0 || pendingTx || today < nextHarvestUntil) ? (
          <DisableButton>Harvest</DisableButton>
        ) : (
          <Button
            onClick={async () => {
              setPendingTx(true);
              await onReward();
              setPendingTx(false);
            }}
            style={{ fontSize: "20px", width: "110%", height: "35px", borderRadius: "10px" }}
          >
            Harvest
          </Button>
        )}
      </BalanceAndCompound>
    </Flex>
  );
};

export default HarvestAction;

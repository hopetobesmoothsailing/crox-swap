import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Heading, Card, CardBody, Button } from "crox-uikit2.0";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import BigNumber from "bignumber.js";
import useI18n from "hooks/useI18n";
import { useAllHarvest } from "hooks/useHarvest";
import useFarmsWithBalance from "hooks/useFarmsWithBalance";
import UnlockButton from "components/UnlockButton";
import CakeHarvestBalance from "./CakeHarvestBalance";
import CakeWalletBalance from "./CakeWalletBalance";
import { usePriceCakeBusd } from "../../../state/hooks";
import useTokenBalance from "../../../hooks/useTokenBalance";
import { getCakeAddress } from "../../../utils/addressHelpers";
import useAllEarnings from "../../../hooks/useAllEarnings";
import { getBalanceNumber } from "../../../utils/formatBalance";

const StyledFourWayCard = styled(Card)`
  background: #121827;
  max-width: 4000px;
  width: 240px;
  display: block;
  margin: auto;
`;
const StyledCardBody = styled(CardBody)`
  padding: 8px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 6px;
  height: 40px;
`;

const CardNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  font-weight: 900;
  font-size: 28px;
  border: 5px solid #fe7093;
  color: #fe7093;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
`;

const CardText = styled.div`
  text-align: center;
  font-weight: 900;
  font-size: 12px;
  color: white;
  width: 120px;
  margin: auto;
  line-height: 1.5;
`;

const PercentText = styled.div`
  color: #fe7093;
  font-weight: 900;
  font-size: 30px;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 10px;
`;

const TypeText = styled.div`
  color: white;
  font-weight: 900;
  font-size: 16px;
  text-align: center;
  padding-bottom: 8px;
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`;

const Actions = styled.div`
  margin-top: 4px;
  text-align: center;
`;

const FourWayCard = (props) => {
  const [pendingTx, setPendingTx] = useState(false);
  const { number, desc, percent, type, buttonText, onClick } = props;
  const { account } = useWallet();
  const TranslateString = useI18n();
  const farmsWithBalance = useFarmsWithBalance();
  const cakeBalance = getBalanceNumber(useTokenBalance(getCakeAddress()));
  const eggPrice = usePriceCakeBusd().toNumber();
  const allEarnings = useAllEarnings();
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return (
      accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
    );
  }, 0);
  const balancesWithValue = farmsWithBalance.filter(
    (balanceType) => balanceType.balance.toNumber() > 0
  );

  const { onReward } = useAllHarvest(
    balancesWithValue.map((farmWithBalance) => farmWithBalance.pid)
  );

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true);
    try {
      await onReward();
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false);
    }
  }, [onReward]);

  return (
    <StyledFourWayCard>
      <StyledCardBody>
        <CardHeader>
          <CardNumber>{number}</CardNumber>
          <CardText>{desc}</CardText>
        </CardHeader>

        <PercentText>{percent}%</PercentText>
        <TypeText>{type}</TypeText>

        <Actions>
          <Button onClick={onClick}> {buttonText} </Button>
        </Actions>
      </StyledCardBody>
    </StyledFourWayCard>
  );
};

export default FourWayCard;

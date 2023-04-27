import React, { useState, useCallback } from "react";
import styled from "styled-components";
import {
  Heading,
  Card,
  CardBody,
  Button,
  Text,
  useMatchBreakpoints,
  LinkExternal
} from "crox-uikit2.0";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import BigNumber from "bignumber.js";
import useI18n from "hooks/useI18n";
import { useAllHarvest } from "hooks/useHarvest";
import useFarmsWithBalance from "hooks/useFarmsWithBalance";
import UnlockButton from "components/UnlockButton";
import CakeHarvestBalance from "./CakeHarvestBalance";
import CakeWalletBalance from "./CakeWalletBalance";
import CakeStakeBalance from "./CakeStakeBalance";
import { usePriceCakeBusd, useCroxPoolSymbol, useDualFarms } from "../../../state/hooks";
import useTokenBalance from "../../../hooks/useTokenBalance";
import { getCakeAddress } from "../../../utils/addressHelpers";
import useAllEarnings from "../../../hooks/useAllEarnings";
import FarmIcon from "./Icon/farmIcon";
import FolioIcon from "./Icon/folioIcon";
import WalletIcon from "./Icon/WalletIcon";
import StakeIcon from "./Icon/stakeIcon";
import HarvestIcon from "./Icon/harvestIcon";
import { getBalanceNumber } from "../../../utils/formatBalance";
import './Investor.css';

const StyledFarmStakingCard = styled(Card)`
  background-image: url("/card_texture.svg");
  background-repeat: no-repeat;
  background-position: top 10% right 12%;
  background-size: 110px;
  min-height: 376px;
  background-color: #171923;
`;

const Block = styled.div`
  padding-top: 24px;
  display: flex;
`;

const DashboardHeader = styled.div`
  background-color: #0498AE;
  border-radius: 10px;
  padding: 15px;
  position: absolute;
  z-index: 1000;
  color: white;
  font-size: 20px;
  margin-left: -8px;
  font-weight: 700;
`;

const FolioSection = styled.div`
  padding: 15px;
  z-index: 1000;
  color: white;
  font-weight: 700;
  font-size: 20px;
  color: #0498AE;
  margin-top: 40px;
  margin-bottom: 10px;
  text-align: center;
`;

const CardImage = styled.img`
  margin-bottom: 16px;
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`;

const Actions = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  @media screen and (max-width: 440px) {
    display: block;
    text-align: end;
    .portfolioLink {
      text-align: center;
    }
  }
`;

const Tab = styled(Button)`
  flex: auto;
  margin: 4px 4px;
`;

const InvestorCard = () => {
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();
  const [pendingTx, setPendingTx] = useState(false);
  const [tab, setTab] = useState("wallet");
  const { account } = useWallet();
  const TranslateString = useI18n();
  const farmsWithBalance = useFarmsWithBalance();
  const cakeBalance = getBalanceNumber(useTokenBalance(getCakeAddress()));
  const eggPrice = usePriceCakeBusd().toNumber();
  const allEarnings = useAllEarnings();
  const {stakedBalance} = useCroxPoolSymbol('CROX');
  const activeDualFarms = useDualFarms(true)
  let nextgenstaked = new BigNumber(0)
  for (let i = 0; i < activeDualFarms.length; i ++) {
    if(activeDualFarms[i].userData) {
      nextgenstaked = new BigNumber(nextgenstaked).plus(new BigNumber(activeDualFarms[i].userData.stakedBalance))
    }
  }
  const totalstaked = getBalanceNumber(new BigNumber(stakedBalance).plus(new BigNumber(nextgenstaked)))
  const stakedBalancePrice = totalstaked * eggPrice
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
    <>
      <DashboardHeader>
        <FarmIcon />
        Croxster Dashboard
      </DashboardHeader>
      <StyledFarmStakingCard>
        <CardBody
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
            {!isSm && !isXs ? (
              <>
              <FolioSection>
                <FolioIcon />
                CROX FOLIO
              </FolioSection>
              <table className="table tablesorter " id="plain-table">
                <thead className="thead_invest">
                  <tr>
                    <th style={{textAlign: 'left', paddingLeft: '16px'}}>
                      $CROX
                    </th>
                    <th>
                      Amount
                    </th>
                    <th>
                      Total($)
                    </th>
                  </tr>
                </thead>
                <tbody className="tbody_invest">
                  <tr>
                    <td>
                      <WalletIcon />
                      In Wallet
                    </td>
                    <td>
                      <CakeWalletBalance cakeBalance={cakeBalance} isInvestor />
                    </td>
                    <td>
                      <Text style={{textAlign: 'center'}}>${(eggPrice * cakeBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <StakeIcon />
                      Staked
                    </td>
                    <td>
                      <CakeStakeBalance stakeValue={totalstaked} isInvestor />
                    </td>
                    <td>
                      <Text style={{textAlign: 'center'}}>${stakedBalancePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <HarvestIcon />
                      To Harvest
                    </td>
                    <td>
                      <CakeHarvestBalance earningsSum={earningsSum} isInvestor />
                    </td>
                    <td>
                      <Text style={{textAlign: 'center'}}>${(eggPrice * earningsSum).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
              </>
            ) : (
              <>
              <FolioSection>
                <FolioIcon />
                CROX FOLIO
              </FolioSection>
              <table className="table tablesorter " id="plain-table">
                <thead className="thead_invest">
                  <tr>
                    <th style={{textAlign: 'left', paddingLeft: '16px'}}>
                      $CROX
                    </th>
                    <th>
                      Amount
                    </th>
                    <th>
                      Total($)
                    </th>
                  </tr>
                </thead>
                <tbody className="tbody_invest">
                  <tr>
                    <td>
                      <WalletIcon />
                      In Wallet
                    </td>
                    <td>
                      <CakeWalletBalance cakeBalance={cakeBalance} isInvestor />
                    </td>
                    <td>
                      <Text style={{textAlign: 'center'}}>${(eggPrice * cakeBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <StakeIcon />
                      Staked
                    </td>
                    <td>
                      <CakeStakeBalance stakeValue={totalstaked} isInvestor />
                    </td>
                    <td>
                      <Text style={{textAlign: 'center'}}>${stakedBalancePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <HarvestIcon />
                      To Harvest
                    </td>
                    <td>
                      <CakeHarvestBalance earningsSum={earningsSum} isInvestor />
                    </td>
                    <td>
                      <Text style={{textAlign: 'center'}}>${(eggPrice * earningsSum).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
              </>
            )}
          <Actions>
            {account ? (
              <Button
                id="harvest-all"
                disabled={balancesWithValue.length <= 0 || pendingTx}
                onClick={harvestAllFarms}
                size="sm"
                style={{ fontSize: "14px", width: '124px', borderRadius: '5px' }}
                fullWidth
              >
                {pendingTx
                  ? TranslateString(548, "Collecting CROX")
                  : TranslateString(
                      999,
                      `Harvest all (${balancesWithValue.length})`
                    )}
              </Button>
            ) : (
              <Button
                id="harvest-all"
                onClick={harvestAllFarms}
                fullWidth
                size="sm"
                style={{ fontSize: "14px", width: '124px', borderRadius: '5px' }}
              >
                {pendingTx
                  ? TranslateString(548, "Collecting CROX")
                  : TranslateString(999, `Harvest All`)}
              </Button>
            )}
          </Actions>
        </CardBody>
      </StyledFarmStakingCard>
    </>
  );
};

export default InvestorCard;

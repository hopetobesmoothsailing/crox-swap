/* eslint-disable */
import React, { useEffect, useCallback, useState, useMemo } from "react";
import { Route, useRouteMatch, useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { provider } from "web3-core";
import {
  Button,
  Heading,
  Text,
  LogoIcon,
  Card,
  CardBody,
  CardFooter,useMatchBreakpoints, ButtonMenu, ButtonMenuItem, Toggle
} from "crox-uikit2.0";
import { orderBy } from "lodash";

import {
  BLOCKS_PER_DAY,
  BLOCKS_PER_YEAR,
  CAKE_PER_BLOCK,
  CAKE_POOL_PID,
} from "config";
import FlexLayout from "components/layout/Flex";
import Page from "components/layout/Page";
import {
  useDualFarms,
  useFarms,
  usePriceBnbBusd,
  usePriceCakeBusd,
} from "state/hooks";
import useRefresh from "hooks/useRefresh";
import { fetchDualFarmUserDataAsync } from "state/actions";
import { QuoteToken } from "config/constants/types";
import useI18n from "hooks/useI18n";
import { getAPYAndTVLOfNGPool } from "utils/defi";
import Select, { OptionProps } from "components/Select/Select";
import FarmCard, { FarmWithStakedValue } from "./components/FarmCard/FarmCard";
import FarmTabButtons from "./components/FarmTabButtons";
import Divider from "./components/Divider";
import CountDown from "../../components/CountDown";
import SearchInput from "./components/SearchInput";
import UpComingCard from "./components/UpComingCard";
import CreateYourProject from "./components/CreateYourProject";

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  @media screen and (max-width: 1000px) {
    margin: 10px 0;
    display: -webkit-box;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`;

const HeaderText = styled.div`
  font-size: 40px;
  font-weight: bolder;
  @media screen and (max-width: 1000px) {
    font-size: 29px;
  }
  @media screen and (max-width: 650px) {
    font-size: 27px;
  }
`;

const HeaderText1 = styled.div`
  font-size: 20px;
  margin-top: -20px;
  @media screen and (max-width: 650px) {
    font-size: 18px;
  }
`;

const TabMagin = styled.div`
  text-align: center;
  margin-top: -40px;
`;

const FarmCSS = styled.p`
  border-bottom: 3px solid #0498AE;
  display:inline-block;
  color: white;
  opacity: 0.8;
  font-weight: bold;
  font-size: 20px;
  width: max-content;
  background-color: #0498AE;
  padding: 10px 15px 7px 15px;
  border-radius: 15px 0px 0px 0px;
`;

const DualCSS = styled.p`
  border-bottom: 3px solid lightgrey;
  display:inline-block;
  color: white;
  font-weight: bold;
  font-size: 20px;
  width: max-content;
  background-color: #0498AE;
  padding: 10px 15px 7px 15px;
  border-radius: 0px 15px 0px 0px;
`;

const SelectSearch = styled.div`
  display: flex;
  @media screen and (max-width: 1000px) {
    display: inline-flex;
    margin-top: 1%;
  }
`;

const Selecter = styled.div`
  flex: auto;
  @media screen and (max-width: 1000px) {
    display: flex;
    width: 136px !important;
    margin-top: 8px;
  }
`;

const UpcomingText = styled.span`
  font-size: 40px;
  color: white;
  font-weight: bold;
  @media screen and (max-width: 550px) {
    font-size: 30px;
  }
`;

const Searchfarm = styled.div`
  flex: auto;
  margin-left: 40px;
  @media screen and (max-width: 1000px) {
    display: block;
    margin-left: 0px;
    width: fit-content;
  }
`;


export interface FarmsProps {
  tokenMode?: boolean;
}

const NUMBER_OF_FARMS_VISIBLE = 12;

const DualFarm: React.FC<FarmsProps> = (farmsProps) => {
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("hot");
  const { pathname } = useLocation();

  const { path } = useRouteMatch();
  const TranslateString = useI18n();
  const farmsLP = useDualFarms(true);
  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet();
  const { tokenMode } = farmsProps;
  const isInactive = pathname.includes("history");
  const isActive = !isInactive;

  const [stakedOnly, setStakedOnly] = useState(!isActive);
  useEffect(() => {
    setStakedOnly(!isActive);
  }, [isActive]);

  const dispatch = useDispatch();
  const { fastRefresh } = useRefresh();
  useEffect(() => {
    if (account) {
      dispatch(fetchDualFarmUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const activeFarms = farmsLP.filter((it) => (it as any).active);
  const inactiveFarms = farmsLP.filter((it) => !(it as any).active);

  const stakedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const farmsList = useCallback(
    (farmsToDisplay, removed?: boolean) => {
      // const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      let farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map(
        (farm) => {
          // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          //   return farm
          // }
          const { apy1: apy1, apy2: apy2 } = getAPYAndTVLOfNGPool(farm, {
            cakePrice,
            bnbPrice,
          });
          return { ...farm, apy1, apy2 };
        }
      );

      if (query) {
        const lowercaseQuery = query.toLowerCase();
        farmsToDisplayWithAPY = farmsToDisplayWithAPY.filter((farm: any) => {
          return farm.lpSymbol.toLowerCase().includes(lowercaseQuery);
        });
      }
      return farmsToDisplayWithAPY;
    },
    [bnbPrice, account, cakePrice, ethereum]
  );

  const { url, isExact } = useRouteMatch()

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked = [];

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case "apy":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => farm.apy1,
            "desc"
          );
        case "earned":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.userData ? Number(farm.userData.earnings) : 0,
            "desc"
          );
        // case 'liquidity':
        //   return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms;
      }
    };

    if (isActive) {
      farmsStaked = farmsList(
        stakedOnly ? stakedOnlyFarms : activeFarms,
        false
      );
    }
    if (isInactive) {
      farmsStaked = farmsList(
        stakedOnly ? stakedInactiveFarms : inactiveFarms,
        true
      );
    }

    return sortFarms(farmsStaked);
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    isActive,
    isInactive,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
  ]);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  return (
    <Page style={{padding: '0px' }}>
      <div style={{ textAlign: "center", position: "absolute", top: "65px", width: "100%", left: "0" }}>
        <Heading
          as="h1"
          size="lg"
          color="primary"
          mb="20px"
          style={{ textAlign: "center" }}
        >
          <HeaderText>
          Next-Generation Staking Pools & Yield Farming
          </HeaderText>
        </Heading>

        <Heading
          size="md"
          color="primary"
          mb="30px"
          style={{ textAlign: "center" }}
        >
          <HeaderText1>
            Stake CROX to earn other tokens
          </HeaderText1>
        </Heading>
      </div>
      <TabMagin>
          <Link to="/pools/crox"><FarmCSS>EARN CROX</FarmCSS></Link>
          <Link to="/pools/nextgen"><DualCSS>EARN OTHER TOKENS</DualCSS></Link>
      </TabMagin>
      {!isMd && !isSm && !isXs && !isLg ? (
        <ControlContainer>
          <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} />
          <SelectSearch>
            <Selecter>
              <Select
                options={[
                  {
                    label: "Hot",
                    value: "hot",
                  },
                  {
                    label: "APY",
                    value: "apy",
                  },
                  {
                    label: "Earned",
                    value: "earned",
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </Selecter>
            <Searchfarm>
              <SearchInput onChange={handleChangeQuery} placeHolder={"Search pools"} />
            </Searchfarm>
          </SelectSearch>
        </ControlContainer>
        ) : (
          <ControlContainer>
          {/* <SelectSearch > */}
          <Searchfarm>
            <SearchInput onChange={handleChangeQuery} placeHolder={"Search pools"} />
            <ButtonMenu activeIndex={isExact ? 0 : 1} size="sm">
              <ButtonMenuItem style={{height: "40px"}} as={Link} to={`${url}`}>
                {TranslateString(698, 'Active')}
              </ButtonMenuItem>
              <ButtonMenuItem style={{padding: "20px 17px"}} as={Link} to={`${url}/history`}>
                {TranslateString(700, 'Finished')}
              </ButtonMenuItem>
            </ButtonMenu>
          </Searchfarm>
          <div style={{display: "block", width: "fit-content"}}>
            <div style={{display: "flex"}}>
              <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />
              <Text style={{padding: "3% 9px"}}> {TranslateString(699, 'Staked only')}</Text>
            </div>
            <Selecter>
                <Select
                  options={[
                    {
                      label: "Hot",
                      value: "hot",
                    },
                    {
                      label: "APY",
                      value: "apy",
                    },
                    {
                      label: "Multiplier",
                      value: "multiplier",
                    },
                    {
                      label: "Earned",
                      value: "earned",
                    },
                    // {
                    //   label: 'Liquidity',
                    //   value: 'liquidity',
                    // },
                  ]}
                  onChange={handleSortOptionChange}
                />
            </Selecter>
          </div>


          {/* </SelectSearch> */}


          </ControlContainer>
        )}
      <div>
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
            {/* {stakedOnly
              ? farmsList(stakedOnlyFarms, false)
              : farmsList(activeFarms, false)} */}
            {/* {farmsStakedMemoized} */}
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                account={account}
                bnbPrice={bnbPrice}
                ethereum={ethereum}
                cakePrice={cakePrice}
                removed={false}
              />
            ))}
          </Route>
          <Route exact path={`${path}/history`}>
            {/* {farmsList(inactiveFarms, true)} */}
            {/* {farmsStakedMemoized} */}
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                account={account}
                bnbPrice={bnbPrice}
                ethereum={ethereum}
                cakePrice={cakePrice}
                removed={true}
              />
            ))}
          </Route>
        </FlexLayout>
        <Divider />
        <UpcomingText>
          Upcoming Pools
        </UpcomingText>
        <FlexLayout>
          {" "}


     {/* <UpComingCard
              farm={{
                lpLabel: "EARN RASTA",
                lpSubLabel: "STAKE CROX",
                multiplier: "4",
                harvestInterval: 600,
                farmImage: "rasta",
                timestamp: 1637767800000,
                description:
                "Rasta Finance is a community based token. Referred as a pride and joy of Binance Smart Chain. Join thousands of Rastas on a journey to ZION. RastaFinance is decentralizing finance, using the latest in blockchain technology. Seize the power of your own money, join the revolution.",
              website: "https://app.rasta.finance/",
              }}
              removed={false}
            />
             <UpComingCard
                  farm={{
                    lpLabel: "EARN CRUSH + CNR",
                    lpSubLabel: "STAKE CROX",
                    multiplier: "4",
                    harvestInterval: 600,
                    farmImage: "crush",
                    timestamp: 1637038800000,
                    description:
                    "The First Hybrid Defi Gaming Platform on BSC. A hybrid system of provably fair and decentralized games that utilize Defi protocols, launching with a tested and working product.",
                  website: "https://bitcrusharcade.io/",
                  }}
                  removed={false}
                /> */}
        {/*<UpComingCard

            farm={{
              lpLabel: "EARN DMGK",
              lpSubLabel: "STAKE CROX",
              multiplier: "4",
              harvestInterval: 600,
              farmImage: "dmgk",
              timestamp: 1636426800000,
              description:
              "DarkMagick is an action based p2e RPG with an NFT and tokenized ecosystem. Play with your own unique NFT Hero in the game and earn NFT collectibles that you can stake to earn $DMGK passively. Come play through the solo adventure or online dungeon crawling with friends in our Magick Metaverse.",
            website: "https://darkmagick.co/",
            }}
            removed={false}
          />*/}
          {" "}
          <CreateYourProject
            farm={{
              lpLabel: "CREATE A POOL?",
              lpSubLabel: "Submit the application to start a pool",
              farmImage: "question",
              website: "https://forms.gle/xv759uRs4GARh4jQA",
            }}
            removed={false}
          />
        </FlexLayout>
      </div>
    </Page>
  );
};

export default DualFarm;

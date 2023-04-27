/* eslint-disable */
import React, { useEffect, useCallback, useState, useMemo } from "react";
import { Route, useRouteMatch, useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { provider } from "web3-core";
import { Image, Heading } from "crox-uikit";
import { useMatchBreakpoints, ButtonMenu, ButtonMenuItem, Text, Toggle } from "crox-uikit2.0";
import { orderBy } from "lodash";
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from "config";
import FlexLayout from "components/layout/Flex";
import Page from "components/layout/Page";
import { useFarms, usePriceBnbBusd, usePriceCakeBusd } from "state/hooks";
import useRefresh from "hooks/useRefresh";
import { fetchFarmUserDataAsync } from "state/actions";
import { QuoteToken } from "config/constants/types";
import useI18n from "hooks/useI18n";
import { getAPYAndTVLOfFarm } from "utils/defi";
import Select, { OptionProps } from "components/Select/Select";
import FarmCard, { FarmWithStakedValue } from "./components/FarmCard/FarmCard";
import FarmTabButtons from "./components/FarmTabButtons";
import Divider from "./components/Divider";
import CountDown from "../../components/CountDown";
import SearchInput from "./components/SearchInput";

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: space-between;
  flex-direction: column;

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
`;

const HeaderText1 = styled.div`
  font-size: 20px;
  margin-top: -54px;
  @media screen and (max-width: 550px) {
    font-size:18px;
  }
`;

const TabMagin = styled.div`
  text-align: center; 
  margin-top: -40px;
`;

const FarmCSS = styled.p`
  border-bottom: 3px solid lightgrey;
  display:inline-block;
  color: white;
  font-weight: bold;
  font-size: 20px;
  width: max-content;
  background-color: #0498AE;
  padding: 10px 15px 7px 15px;
  border-radius: 15px 0px 0px 0px;
  @media screen and (max-width: 550px) {
    width: 40%;
  }
`;

const DualCSS = styled.p`
  border-bottom: 3px solid #0498AE;
  display:inline-block;
  color: white;
  font-weight: bold;
  font-size: 20px;
  width: max-content;
  background-color: #0498AE;
  opacity: 0.8;
  padding: 10px 15px 7px 15px;
  border-radius: 0px 15px 0px 0px;
  @media screen and (max-width: 550px) {
    width: 40%;
  }
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

const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("hot");
  const { pathname } = useLocation();

  const { path } = useRouteMatch();
  const TranslateString = useI18n();
  const farmsLP = useFarms();
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
      dispatch(fetchFarmUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const activeFarms = farmsLP.filter(
    (farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== "0X"
  );
  const inactiveFarms = farmsLP.filter(
    (farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === "0X"
  );

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
          const { apy } = getAPYAndTVLOfFarm(farm, { cakePrice, bnbPrice });
          return { ...farm, apy };
        }
      );

      if (query) {
        const lowercaseQuery = query.toLowerCase();
        farmsToDisplayWithAPY = farmsToDisplayWithAPY.filter(
          (farm: FarmWithStakedValue) => {
            return farm.lpSymbol.toLowerCase().includes(lowercaseQuery);
          }
        );
      }
      // return farmsToDisplayWithAPY.map((farm) => (
      //   <FarmCard
      //     key={farm.pid}
      //     farm={farm}
      //     removed={removed}
      //     bnbPrice={bnbPrice}
      //     cakePrice={cakePrice}
      //     ethereum={ethereum}
      //     account={account}
      //   />
      // ));
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
            (farm: FarmWithStakedValue) => farm.apy,
            "desc"
          );
        case "multiplier":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0,
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
      farmsStaked = stakedOnly
        ? farmsList(stakedOnlyFarms, false)
        : farmsList(activeFarms, false);
    }
    if (isInactive) {
      farmsStaked = stakedOnly
        ? farmsList(stakedInactiveFarms, true)
        : farmsList(inactiveFarms, true);
    }

    // const example = (farmsStaked.map((farm) => {return farm.apy}))

    // console.log('isActive:', isActive, 'isInactive:', isInactive, 'stakedOnly:',stakedOnly, 'farms:', farmsStaked)
    // if (isArchived) {
    //   farmsStaked = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    // }

    // return sortFarms(farmsStaked).slice(0, numberOfFarmsVisible)

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
  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD

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
          mb="50px"
          style={{ fontWeight: "bolder"}}
        >
          <HeaderText>
            Next-Generation Staking & Yield Farming
          </HeaderText>
        </Heading>
        <Heading
          size="md"
          color="primary"
          mb="30px"
          style={{ textAlign: "center" }}
        >
          <HeaderText1>
            Stake your LP tokens to earn CROX
          </HeaderText1>
        </Heading>
      </div>
      <TabMagin>
          <Link to="/farms"><FarmCSS>CROX FARMS</FarmCSS></Link>
          <Link to="/dualfarms"><DualCSS>DUAL-FARMS</DualCSS></Link>
      </TabMagin>
      <CountDown timestamp={1618708740000} />
      {!isMd && !isSm && !isXs && !isLg ? (
        <ControlContainer>
          <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} />
          <SelectSearch >
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
            <Searchfarm>
              <SearchInput onChange={handleChangeQuery} />
            </Searchfarm>
          </SelectSearch>
        </ControlContainer>
      ) : (
        <ControlContainer>
          {/* <SelectSearch > */}
          <Searchfarm>
            <SearchInput onChange={handleChangeQuery} />
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
      </div>
      {/* <Image src="/images/egg/8.png" alt="illustration" width={1352} height={587} responsive /> */}
    </Page>
  );
};

export default Farms;

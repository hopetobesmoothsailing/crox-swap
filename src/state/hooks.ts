import BigNumber from "bignumber.js";
import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import useRefresh from "hooks/useRefresh";
import {
  fetchFarmsPublicDataAsync,
  fetchCroxPoolsPublicDataAsync,
  fetchDualFarmsPublicDataAsync,
} from "./actions";
import { State, Farm, Pool } from "./types";
import { QuoteToken } from "../config/constants/types";

const ZERO = new BigNumber(0);

export const useFetchPublicData = () => {
  const dispatch = useDispatch();
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync());
    dispatch(fetchCroxPoolsPublicDataAsync());
    dispatch(fetchDualFarmsPublicDataAsync());
  }, [dispatch, slowRefresh]);
};

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data);
  return farms;
};

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid);

  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData
      ? new BigNumber(farm.userData.earnings)
      : new BigNumber(0),
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// Dual-farms

export const useDualFarms = (single = false): Farm[] => {
  let farms = useSelector((state: State) => state.dualFarms.data);
  farms = farms.filter((it) => (single ? !it.isDualFarm : it.isDualFarm));
  return farms;
};

export const useDualFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.dualFarms.data.find(
      (f) => JSON.stringify(f.poolAddress) === JSON.stringify(pid)
    )
  );
  return farm;
};

export const useDualFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.dualFarms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useDualFarmUser = (pid) => {
  const farm = useDualFarmFromPid(pid);

  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData ? farm.userData.earnings : [0, 0],
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// CroxPools

export const useCroxPools = (): Farm[] => {
  const farms = useSelector((state: State) => state.croxPools.data);
  return farms;
};

export const useCroxPoolFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.croxPools.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useCroxPoolFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.croxPools.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useCroxPoolSymbol = (lpSymbol: string) => {
  const farm = useCroxPoolFromSymbol(lpSymbol);
  return {
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0)
  }
}

export const useCroxPoolUser = (pid) => {
  const farm = useCroxPoolFromPid(pid);

  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData
      ? new BigNumber(farm.userData.earnings)
      : new BigNumber(0),
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh();
  const dispatch = useDispatch();
  useEffect(() => {
    if (account) {
      // dispatch(fetchPoolsUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const pools = useSelector((state: State) => state.pools.data);
  return pools;
};

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) =>
    state.pools.data.find((p) => p.sousId === sousId)
  );
  return pool;
};

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 4; // BUSD-BNB LP
  const farm = useFarmFromPid(pid);
  return farm && farm.tokenPriceVsQuote
    ? new BigNumber(farm.tokenPriceVsQuote)
    : ZERO;
};

export const usePriceCroxBnb = (): BigNumber => {
  const pid = 0; // BUSD-BNB LP
  const farm = useFarmFromPid(pid);
  return farm && farm.tokenPriceVsQuote
    ? new BigNumber(farm.tokenPriceVsQuote)
    : ZERO;
};

export const usePriceCakeBusd = (): BigNumber => {
  const bnbPrice = usePriceBnbBusd();
  const cakeInBnb = usePriceCroxBnb();
  return bnbPrice.times(cakeInBnb);
};

export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  const croxPools = useCroxPools();
  const dualFarms = useDualFarms();
  const nextPools = useDualFarms(true);
  const bnbPrice = usePriceBnbBusd();
  const cakePrice = usePriceCakeBusd();
  let value = new BigNumber(0);
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i];
    if (farm.lpTotalInQuoteToken) {
      let val;
      if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        val = bnbPrice.times(farm.lpTotalInQuoteToken);
      } else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
        val = cakePrice.times(farm.lpTotalInQuoteToken);
      } else {
        val = farm.lpTotalInQuoteToken;
      }
      value = value.plus(val);
    }
  }
  for (let i = 0; i < croxPools.length; i++) {
    const croxPool = croxPools[i];
    if (croxPool.lpTotalInQuoteToken) {
      value = value.plus(croxPool.lpTotalInQuoteToken);
    }
  }
  for (let i = 0; i < dualFarms.length; i++) {
    const dualFarm = dualFarms[i];

    if (dualFarm.lpTotalInQuoteToken) {
      let val2;
      if (dualFarm.quoteTokenSymbol === QuoteToken.BNB) {
        val2 = bnbPrice.times(dualFarm.lpTotalInQuoteToken);
      } else if (dualFarm.quoteTokenSymbol === QuoteToken.CAKE) {
        val2 = cakePrice.times(dualFarm.lpTotalInQuoteToken);
      } else {
        val2 = dualFarm.lpTotalInQuoteToken;
      }
      value = value.plus(val2);
    }
  }
  for (let i = 0; i < nextPools.length; i++) {
    const nextPool = nextPools[i];

    if (nextPool.lpTotalInQuoteToken) {
      const val2 = cakePrice.times(nextPool.lpBalance);
      value = value.plus(val2);
    }
  }
  return value;
};

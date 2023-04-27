import BigNumber from "bignumber.js";
import erc20ABI from "config/abi/erc20.json";
import masterchefABI from "config/abi/nextGenPool.json";
import nextGenPoolNewABI from "config/abi/nextGenPoolNew.json";
import multicall from "utils/multicall";
import farmsConfig from "config/constants/dualFarms";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;
const indexes = [];

for (let i = 0; i < farmsConfig.length; i++)
  if (farmsConfig[i].active) indexes.push(i);
for (let i = 0; i < farmsConfig.length; i++)
  if (!farmsConfig[i].active) indexes.push(i);

export const fetchDualFarmUserAllowances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.isTokenOnly
      ? farm.tokenAddresses[CHAIN_ID]
      : farm.lpAddresses[CHAIN_ID];

    return {
      address: lpContractAddress,
      name: "allowance",
      params: [account, farm.poolAddress[CHAIN_ID]],
    };
  });

  const rawLpAllowances = await multicall(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchDualFarmUserRedeemable = async (account: string) => {
  const calls = farmsConfig
    .filter((it) => !it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "userInfo",
        params: [account],
      };
    });
  const rawNextHarvestUntil = await multicall(masterchefABI, calls);

  const callsNew = farmsConfig
    .filter((it) => it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "redeemableAmount",
        params: [account],
      };
    });

  const rawNextHarvestUntilNew = await multicall(nextGenPoolNewABI, callsNew);

  const parsedNextHarvestUntil = [
    ...rawNextHarvestUntilNew,
    ...rawNextHarvestUntil,
  ].map((nextHarvestUntil) => {
    return new BigNumber(nextHarvestUntil[0]._hex).toJSON();
  });
  const response = [...parsedNextHarvestUntil];

  for (let i = 0; i < indexes.length; i++) {
    response[indexes[i]] = parsedNextHarvestUntil[i];
  }

  return response;
};

export const fetchDualFarmUserNextHarvestUntil = async (account: string) => {
  const calls = farmsConfig
    .filter((it) => !it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "userInfo",
        params: [account],
      };
    });

  const rawNextHarvestUntil = await multicall(masterchefABI, calls);

  const callsNew = farmsConfig
    .filter((it) => it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "userInfo",
        params: [account],
      };
    });

  const rawNextHarvestUntilNew = await multicall(nextGenPoolNewABI, callsNew);
  const parsedNextHarvestUntil = [
    ...rawNextHarvestUntilNew,
    ...rawNextHarvestUntil,
  ].map((nextHarvestUntil) => {
    return new BigNumber(
      nextHarvestUntil.length > 5
        ? nextHarvestUntil[5]._hex
        : nextHarvestUntil[3]._hex
    ).toJSON();
  });
  const response = [...parsedNextHarvestUntil];

  for (let i = 0; i < indexes.length; i++) {
    response[indexes[i]] = parsedNextHarvestUntil[i];
  }

  return response;
};

export const fetchDualFarmUserTokenBalances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.isTokenOnly
      ? farm.tokenAddresses[CHAIN_ID]
      : farm.lpAddresses[CHAIN_ID];
    return {
      address: lpContractAddress,
      name: "balanceOf",
      params: [account],
    };
  });

  const rawTokenBalances = await multicall(erc20ABI, calls);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON();
  });
  return parsedTokenBalances;
};

export const fetchDualFarmUserStakedBalances = async (account: string) => {
  const calls = farmsConfig
    .filter((it) => !it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "userInfo",
        params: [account],
      };
    });

  const rawStakedBalances = await multicall(masterchefABI, calls);

  const callsNew = farmsConfig
    .filter((it) => it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "userInfo",
        params: [account],
      };
    });

  const rawStakedBalancesNew = await multicall(nextGenPoolNewABI, callsNew);
  const parsedStakedBalances = [
    ...rawStakedBalancesNew,
    ...rawStakedBalances,
  ].map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  const response = [...parsedStakedBalances];

  for (let i = 0; i < indexes.length; i++) {
    response[indexes[i]] = parsedStakedBalances[i];
  }

  return response;
};

export const fetchDualFarmUserEarnings = async (account: string) => {
  const calls = farmsConfig
    .filter((it) => !it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "pendingReward",
        params: [account],
      };
    });

  const rawEarnings = await multicall(masterchefABI, calls);

  const callsNew = farmsConfig
    .filter((it) => it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "pendingReward",
        params: [account],
      };
    });

  const rawEarningsNew = await multicall(nextGenPoolNewABI, callsNew);
  const parsedEarnings = [...rawEarningsNew, ...rawEarnings].map((earnings) => {
    return [parseInt(earnings[0]._hex), parseInt(earnings[1]._hex)];
  });
  const response = [...parsedEarnings];

  for (let i = 0; i < indexes.length; i++) {
    response[indexes[i]] = [parsedEarnings[i][0], parsedEarnings[i][1]];
  }
  return response;
};

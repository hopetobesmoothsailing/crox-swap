import Web3 from "web3";
import { useCallback, useState } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { useDispatch } from "react-redux";
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
} from "state/actions";
import { stake, sousStake, sousStakeBnb } from "utils/callHelpers";
import { useMasterchef, useSousChef } from "./useContract";

const useStake = (pid: number) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const masterChefContract = useMasterchef();

  const handleStake = useCallback(
    async (amount: string, decimal = 18) => {
      const isValidAddress = Web3.utils.isAddress(localStorage.getItem("ref"));
      let txHash;
      if (!isValidAddress){
        txHash = await stake(
          masterChefContract,
          pid,
          amount,
          account,
          undefined,
          decimal
        )
      }
      else {
        txHash = await stake(
          masterChefContract,
          pid,
          amount,
          account,
          localStorage.getItem("ref"),
          decimal
        )
      }
      dispatch(fetchFarmUserDataAsync(account));
      return txHash;
    },
    [account, dispatch, masterChefContract, pid]
  );
  return { onStake: handleStake };
};

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const masterChefContract = useMasterchef();
  const sousChefContract = useSousChef(sousId);

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account);
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account);
      } else {
        await sousStake(sousChefContract, amount, account);
      }
      dispatch(updateUserStakedBalance(sousId, account));
      dispatch(updateUserBalance(sousId, account));
    },
    [
      account,
      dispatch,
      isUsingBnb,
      masterChefContract,
      sousChefContract,
      sousId,
    ]
  );

  return { onStake: handleStake };
};

export default useStake;

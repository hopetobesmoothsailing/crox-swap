import { useCallback } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { useDispatch } from "react-redux";
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
} from "state/actions";
import {
  unstake,
  prevunstake,
  sousUnstake,
  sousEmegencyUnstake,
} from "utils/callHelpers";
import { useMasterchef, usePrevMasterchef, useSousChef } from "./useContract";

const useUnstake = (pid: number) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const masterChefContract = useMasterchef();

  const handleUnstake = useCallback(
    async (amount: string, decimal = 18) => {
      const txHash = await unstake(
        masterChefContract,
        pid,
        amount,
        account,
        decimal
      );
      dispatch(fetchFarmUserDataAsync(account));
      return txHash;
    },
    [account, dispatch, masterChefContract, pid]
  );

  return { onUnstake: handleUnstake };
};

export const usePrevUnstake = (pid: number) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const masterChefContract = usePrevMasterchef();

  const handleUnstake = useCallback(async () => {
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call();
    const txHash = await prevunstake(masterChefContract, pid, amount, account);
    dispatch(fetchFarmUserDataAsync(account));
    console.info(txHash);
  }, [account, dispatch, masterChefContract, pid]);

  return { onPrevUnstake: handleUnstake };
};

const SYRUPIDS = [5, 6, 3, 1, 22, 23];

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const masterChefContract = useMasterchef();
  const sousChefContract = useSousChef(sousId);
  const isOldSyrup = SYRUPIDS.includes(sousId);

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account);
        console.info(txHash);
      } else if (isOldSyrup) {
        const txHash = await sousEmegencyUnstake(
          sousChefContract,
          amount,
          account
        );
        console.info(txHash);
      } else {
        const txHash = await sousUnstake(sousChefContract, amount, account);
        console.info(txHash);
      }
      dispatch(updateUserStakedBalance(sousId, account));
      dispatch(updateUserBalance(sousId, account));
      dispatch(updateUserPendingReward(sousId, account));
    },
    [
      account,
      dispatch,
      isOldSyrup,
      masterChefContract,
      sousChefContract,
      sousId,
    ]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;

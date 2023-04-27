/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import farmsConfig from "config/constants/dualFarms";
import fetchDualFarms from "./fetchDualFarms";
import {
  fetchDualFarmUserEarnings,
  fetchDualFarmUserAllowances,
  fetchDualFarmUserTokenBalances,
  fetchDualFarmUserStakedBalances,
  fetchDualFarmUserNextHarvestUntil,
  fetchDualFarmUserRedeemable,
} from "./fetchDualFarmUser";
import { FarmsState, Farm } from "../types";

const initialState: FarmsState = { data: [...farmsConfig] };

export const farmsSlice = createSlice({
  name: "DualFarms",
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload;
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid);
        return { ...farm, ...liveFarmData };
      });
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload;
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl;
        state.data[index] = { ...state.data[index], userData: userDataEl };
      });
    },
  },
});

// Actions
export const { setFarmsPublicData, setFarmUserData } = farmsSlice.actions;

// Thunks
export const fetchDualFarmsPublicDataAsync = () => async (dispatch) => {
  const farms = await fetchDualFarms();
  dispatch(setFarmsPublicData(farms));
};
export const fetchDualFarmUserDataAsync = (account) => async (dispatch) => {
  const userFarmAllowances = await fetchDualFarmUserAllowances(account);
  const userFarmTokenBalances = await fetchDualFarmUserTokenBalances(account);
  const userStakedBalances = await fetchDualFarmUserStakedBalances(account);
  const userFarmEarnings = await fetchDualFarmUserEarnings(account);
  const userNextHarvestUntil = await fetchDualFarmUserNextHarvestUntil(account);
  const userFarmRedeemable = await fetchDualFarmUserRedeemable(account);

  const arrayOfUserDataObjects = userFarmAllowances.map(
    (farmAllowance, index) => {
      return {
        index,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: [userFarmEarnings[index][0], userFarmEarnings[index][1]],
        nextHarvestUntil: userNextHarvestUntil[index],
        redeemable: userFarmRedeemable[index],
      };
    }
  );

  dispatch(setFarmUserData({ arrayOfUserDataObjects }));
};

export default farmsSlice.reducer;

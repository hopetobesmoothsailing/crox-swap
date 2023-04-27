import BigNumber from "bignumber.js";
import { QuoteToken } from "../config/constants/types";
import {
  BLOCKS_PER_DAY,
  BLOCKS_PER_YEAR,
  CAKE_PER_BLOCK,
  CAKE_POOL_PID,
} from "../config";

export const getAPYAndTVLOfFarm = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const cakeRewardPerBlock = new BigNumber(farm.croxPerBlock || 1)
    .times(new BigNumber(farm.poolWeight))
    .div(new BigNumber(10).pow(18));
  const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR);

  let apy = cakePrice.times(cakeRewardPerYear);

  let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

  if (farm.quoteTokenSymbol === QuoteToken.BNB) {
    totalValue = totalValue.times(bnbPrice);
  }

  if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
    totalValue = cakePrice.times(farm.lpTotalInQuoteToken);
  }

  if (totalValue.comparedTo(0) > 0) {
    apy = apy.div(totalValue);
  }
  return { apy, totalValue };
};
export const getAPYAndTVLOfPool = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const cakeRewardPerBlock = new BigNumber(farm.croxPerBlock || 1)
    .times(new BigNumber(farm.poolWeight))
    .div(new BigNumber(10).pow(18));
  const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR);

  let apy = cakePrice.times(cakeRewardPerYear);

  const totalValue = new BigNumber(
    farm.lpTotalInQuoteToken === "NaN" ? 0.0001 : farm.lpTotalInQuoteToken
  );

  if (totalValue.comparedTo(0) > 0) {
    apy = apy.div(totalValue);
  }

  return { apy, totalValue };
};
export const getAPYAndTVLOfDualFarm = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const cakeRewardPerBlock = new BigNumber(farm.rewardPerBlock || 1).div(1e18);
  const secRewardPerBlock = new BigNumber(farm.secRewardPerBlock || 1).div(
    1e18
  );
  const cakeRewardPerDuration = cakeRewardPerBlock
    .times(new BigNumber(BLOCKS_PER_DAY))
    .times(new BigNumber(365));
  const secRewardPerDuration = secRewardPerBlock
    .times(new BigNumber(BLOCKS_PER_DAY))
    .times(new BigNumber(365));

  let apy2 = cakePrice.times(cakeRewardPerDuration);
  let apy1 = new BigNumber(farm.tokenPrice).times(secRewardPerDuration).times(
    // eslint-disable-next-line no-restricted-properties
    Math.pow(10, farm && farm?.tokenDecimal ? 18 - farm.tokenDecimal : 0)
  );

  let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

  if (farm.tokenSymbol === QuoteToken.BNB) {
    totalValue = totalValue.times(bnbPrice);
  } else if (farm.tokenSymbol === QuoteToken.CAKE) {
    totalValue = cakePrice.times(farm.lpTotalInQuoteToken);
  } else {
    totalValue = new BigNumber(farm.quoteTokenPrice).times(
      farm.lpTotalInQuoteToken
    );
  }

  if (totalValue.comparedTo(0) > 0) {
    apy1 = apy1.div(totalValue);
    apy2 = apy2.div(totalValue);
  }

  return { apy1, apy2, totalValue };
};
export const getAPYAndTVLOfNGPool = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const cakeRewardPerBlock = new BigNumber(farm.rewardPerBlock || 1).div(1e18);
  const secRewardPerBlock = new BigNumber(farm.secRewardPerBlock || 1).div(1e8);
  const cakeRewardPerDuration = cakeRewardPerBlock
    .times(new BigNumber(BLOCKS_PER_DAY))
    .times(new BigNumber(365));
  const secRewardPerDuration = secRewardPerBlock
    .times(new BigNumber(BLOCKS_PER_DAY))
    .times(new BigNumber(365));

  let apy1 = new BigNumber(farm.tokenPrice).times(cakeRewardPerDuration).times(
    // eslint-disable-next-line no-restricted-properties
    Math.pow(10, farm?.tokenDecimal ? 18 - farm.tokenDecimal : 0)
  );
  let apy2 = new BigNumber(farm.tokenPrice).times(secRewardPerDuration).times(
    // eslint-disable-next-line no-restricted-properties
    Math.pow(10, farm?.tokenDecimal ? 18 - farm.tokenDecimal : 0)
  );

  let totalValue = cakePrice.times(farm.lpBalance);
  if (farm.isLPToken) {
    totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

    if (farm.tokenSymbol === QuoteToken.BNB) {
      totalValue = totalValue.times(bnbPrice);
    } else if (farm.tokenSymbol === QuoteToken.CAKE) {
      totalValue = cakePrice.times(farm.lpTotalInQuoteToken);
    } else {
      totalValue = new BigNumber(farm.quoteTokenPrice).times(
        farm.lpTotalInQuoteToken
      );
    }
  }

  if (totalValue.comparedTo(0) > 0) {
    apy1 = apy1.div(totalValue);
    apy2 = apy2.div(totalValue);
  }
  return { apy1, apy2, totalValue };
};

import Axios from "axios";
import BigNumber from "bignumber.js";
import erc20 from "config/abi/erc20.json";
import nextGenPoolABI from "config/abi/nextGenPool.json";
import nextGenPoolNewABI from "config/abi/nextGenPoolNew.json";
import multicall from "utils/multicall";
import { getMasterChefAddress } from "utils/addressHelpers";
import farmsConfig from "config/constants/dualFarms";
import { QuoteToken } from "../../config/constants/types";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

const fetchDualFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAdress = farmConfig.lpAddresses[CHAIN_ID];
      const poolAddress = farmConfig.poolAddress[CHAIN_ID];
      const calls = [
        // Balance of token in the LP contract
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: "balanceOf",
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: "balanceOf",
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAdress,
          name: "balanceOf",
          params: [poolAddress],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: "totalSupply",
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: "balanceOf",
          params: [poolAddress],
        },
        // Token decimals
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: "decimals",
        },
        // Quote token decimals
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: "decimals",
        },
      ];

      const [
        tokenBalanceLP,
        quoteTokenBalanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        lpBalance,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls);

      let tokenAmount;
      let lpTotalInQuoteToken;
      let tokenPriceVsQuote;
      if (farmConfig.isTokenOnly) {
        tokenAmount = new BigNumber(lpTokenBalanceMC).div(
          new BigNumber(10).pow(tokenDecimals)
        );
        if (
          farmConfig.tokenSymbol === QuoteToken.BUSD &&
          farmConfig.quoteTokenSymbol === QuoteToken.BUSD
        ) {
          tokenPriceVsQuote = new BigNumber(1);
        } else {
          tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(
            new BigNumber(tokenBalanceLP)
          );
        }
        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote);
      } else {
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(
          new BigNumber(lpTotalSupply)
        );

        // Total value in staking in quote token value
        lpTotalInQuoteToken = new BigNumber(quoteTokenBalanceLP)
          .div(new BigNumber(10).pow(18))
          .times(new BigNumber(2))
          .times(lpTokenRatio);

        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmount = new BigNumber(tokenBalanceLP)
          .div(new BigNumber(10).pow(tokenDecimals))
          .times(lpTokenRatio);
        const quoteTokenAmount = new BigNumber(quoteTokenBalanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatio);

        if (tokenAmount.comparedTo(0) > 0) {
          tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount);
        } else {
          tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(
            new BigNumber(tokenBalanceLP)
          );
        }
      }

      const [
        depositFee,
        penaltyFee,
        rewardPerBlock,
        secRewardPerBlock,
        startBlock,
        bonusEndBlock,
        lockPeriod,
      ] = await multicall(
        farmConfig.active ? nextGenPoolNewABI : nextGenPoolABI,
        [
          {
            address: poolAddress,
            name: "depositFee",
          },
          {
            address: poolAddress,
            name: "penaltyFee",
          },
          {
            address: poolAddress,
            name: "rewardPerBlock",
          },
          {
            address: poolAddress,
            name: "secRewardPerBlock",
          },
          {
            address: poolAddress,
            name: "startBlock",
          },
          {
            address: poolAddress,
            name: "bonusEndBlock",
          },
          {
            address: poolAddress,
            name: "lockPeriod",
          },
        ]
      );

      let tokenPrice;
      try {
        if (farmConfig.cgProjectID) {
          const { data: priceData } = await Axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${farmConfig.cgProjectID}&vs_currencies=usd`
          );
          tokenPrice = priceData[farmConfig.cgProjectID].usd;
        } else {
          const { data: priceData } = await Axios.get(
            `https://api.pancakeswap.info/api/v2/tokens/${
              farmConfig.tokenAddresses[process.env.REACT_APP_CHAIN_ID]
            }`
          );
          tokenPrice = Number((priceData as any).data.price);
        }
      } catch (err) {
        tokenPrice = farmConfig.tokenPrice;
      }

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        // quoteTokenAmount: quoteTokenAmount,
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        depositFeeBP: parseInt(depositFee[0]._hex),
        penaltyFeeBP: parseInt(penaltyFee[0]._hex),
        startBlock: parseInt(startBlock[0]._hex),
        bonusEndBlock: parseInt(bonusEndBlock[0]._hex),
        lockPeriod: parseInt(lockPeriod[0]._hex),
        rewardPerBlock: new BigNumber(rewardPerBlock).toNumber(),
        secRewardPerBlock: new BigNumber(secRewardPerBlock).toNumber(),
        lpBalance: new BigNumber(lpBalance)
          .div(new BigNumber(10).pow(18))
          .toString(),
        tokenPrice: tokenPrice === 0 ? farmConfig.tokenPrice : tokenPrice,
      };
    })
  );
  return data;
};

export default fetchDualFarms;

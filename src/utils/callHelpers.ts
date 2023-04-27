import BigNumber from "bignumber.js";
import { ResetCSS } from "crox-uikit2.0";
import { ethers } from "ethers";

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account });
};

export const stake = async (
  masterChefContract,
  pid,
  amount,
  account,
  referral = "0x0000000000000000000000000000000000000000",
  decimal = 18
): Promise<any> => {
  return new Promise((resolve) => {
    masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString(),
      referral
    )
    .send({ from: account })
    .on("transactionHash", (tx) => {
      resolve(tx);
    })
    .on("error", () => {
      resolve(null);
    })
  })
};

export const nextStake = async (nextGenContract, amount, account, decimal = 18): Promise<any> => {
  return new Promise((resolve) => {
    nextGenContract.methods
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString())
    .send({ from: account })
    .on("transactionHash", (tx) => {
      resolve(tx);
    })
    .on("error", () => {
      resolve(null);
    })
  });
};

export const sousStake = async (sousChefContract, amount, account): Promise<any> => {
  return new Promise((resolve) => {
    sousChefContract.methods
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on("transactionHash", (tx) => {
      resolve(tx);
    })
    .on("error", () => {
      resolve(null);
    })
  });
};

export const sousStakeBnb = async (sousChefContract, amount, account): Promise<any> => {
  return new Promise((resolve) => {
    sousChefContract.methods
    .deposit()
    .send({
      from: account,
      value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    })
    .on("transactionHash", (tx) => {
      resolve(tx);
    })
    .on("error", () => {
      resolve(null);
    })
  });
};

export const unstake = async (
  masterChefContract,
  pid,
  amount,
  account,
  decimal = 18
): Promise<any> => {
  return new Promise((resolve) => {
    masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString()
    )
    .send({ from: account })
    .on("transactionHash", (tx) => {
      resolve(tx);
    })
    .on("error", () => {
      resolve(null);
    })
  });
};

export const nextUnstake = async (nextGenContract, amount, account, decimal): Promise<any> => {
  return new Promise((resolve) => {
    nextGenContract.methods
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString())
    .send({ from: account })
    .on("transactionHash", (tx) => {
      resolve(tx);
    })
    .on("error", () => {
      resolve(null);
    })
  });
};

export const prevunstake = async (masterChefContract, pid, amount, account): Promise<any> => {
  return new Promise((resolve) => {
    masterChefContract.methods
    .withdraw(pid, amount)
    .send({ from: account })
    .on("transactionHash", (tx) => {
      resolve(tx);
    })
  });
};

export const sousUnstake = async (sousChefContract, amount, account) => {
  // shit code: hard fix for old CTK and BLK
  if (
    sousChefContract.options.address ===
    "0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC"
  ) {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  }
  if (
    sousChefContract.options.address ===
    "0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831"
  ) {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  }
  return sousChefContract.methods
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const sousEmegencyUnstake = async (
  sousChefContract,
  amount,
  account
) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const harvest = async (
  masterChefContract,
  pid,
  account,
  referral = "0x0000000000000000000000000000000000000000"
) => {
  return masterChefContract.methods
    .deposit(pid, "0", referral)
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const nextHarvest = async (nextGenContract, account) => {
  return nextGenContract.methods
    .withdraw("0")
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const compound = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .compound(pid)
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit("0")
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, value: new BigNumber(0) })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

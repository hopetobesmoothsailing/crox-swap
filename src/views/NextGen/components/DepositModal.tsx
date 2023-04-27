import BigNumber from "bignumber.js";
import styled from "styled-components";
import React, { useCallback, useMemo, useState } from "react";
import { Button, Modal, Text, Flex, useModal } from "crox-uikit2.0";
import ModalActions from "components/ModalActions";
import TokenInput from "components/TokenInput";
import {ConfirmPendingModal, ConfirmSubmitModal, ConfirmDismissModal} from 'components/ConfirmModal'
import useI18n from "hooks/useI18n";
import { getFullDisplayBalance } from "utils/formatBalance";

interface DepositModalProps {
  stakedBalance?: BigNumber;
  max: BigNumber;
  onConfirm: (amount: string, decimal?: number) => void;
  onDismiss?: () => void;
  tokenName?: string;
  depositFeeBP?: number;
  minFirstDeposit?: number;
  isDualFarm?: boolean;
  liquidityUrlPathParts?: any
  tokenAddresses?: any
  lpLabel?: any
  isTokenOnly?: boolean
  depositLink?: any
  tokenDecimal?: number
  isShrimpPool?: boolean
  isWhalePool?: boolean
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = "",
  depositFeeBP = 0,
  depositLink,
  minFirstDeposit,
  stakedBalance,
  isDualFarm,
  tokenDecimal,
  isWhalePool,
  isShrimpPool
}) => {
  const [val, setVal] = useState("");
  const isDeposit = true;
  const [pendingTx, setPendingTx] = useState(false);
  const TranslateString = useI18n();

  const isCroxPool = useMemo(() => {
    return tokenName === "CROX" && !isDualFarm ? true : false;
  }, [tokenName, isDualFarm]);

  const fullBalance = useMemo(() => {
    return new BigNumber(getFullDisplayBalance(max));
  }, [max]);

  const stakedChangedBalance = useMemo(() => {
    return new BigNumber(getFullDisplayBalance(stakedBalance));
  }, [stakedBalance]);

  const availableBalance = useMemo(() => {
    let maxLimit = new BigNumber(8000);
    if (isShrimpPool) {
      maxLimit = new BigNumber(2500)
    } else if (!isDualFarm && isWhalePool) {
      maxLimit = new BigNumber(12000);
    }
    return fullBalance.plus(stakedChangedBalance).isLessThan(maxLimit)
      ? fullBalance
      : maxLimit.minus(stakedChangedBalance);
  }, [stakedChangedBalance, fullBalance, isShrimpPool, isDualFarm, isWhalePool]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const RE = /^\d*\.?\d{0,18}$/
      if(RE.test(e.currentTarget.value)){
        setVal(e.currentTarget.value);
      }
    },
    [setVal]
  );
  const [bscScanAddress, SetAddress] = useState("");

  const onConfirmResult = (res) => {
    if(res === null) {
      return onConfirmDismiss()
    }
    SetAddress(`https://bscscan.com/tx/${res}`);
    return onConfirmSubmit()
  }

  const [onConfirmPending] = useModal(<ConfirmPendingModal value={val} tokenName={tokenName} />)
  const [onConfirmDismiss] = useModal(<ConfirmDismissModal />)
  const [onConfirmSubmit] = useModal(<ConfirmSubmitModal value={val} tokenName={tokenName} bscScanAddress={bscScanAddress} />)

  const handleSelectMax = useCallback(() => {
    setVal(String(isCroxPool ? availableBalance.toFixed() : fullBalance.toFixed()));
  }, [availableBalance, fullBalance, isCroxPool, setVal]);

  const disableConfirm = () => {
    if (pendingTx) return true;
    if (minFirstDeposit && !isDualFarm && !isWhalePool && !isShrimpPool) return new BigNumber(val).isLessThan(new BigNumber(minFirstDeposit));
    return isCroxPool ? new BigNumber(val).isGreaterThan(availableBalance) : new BigNumber(val).isGreaterThan(fullBalance);
  };

  return (
    <Modal
      title={`${TranslateString(316, "Deposit")} ${tokenName} Tokens`}
      onDismiss={onDismiss}
    >
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance.toFixed()}
        symbol={tokenName}
        depositFeeBP={depositFeeBP}
        depositLink={depositLink}
        isDeposit={isDeposit}
      />
      {isCroxPool && (
        <Text
          color="primary"
          fontSize="12px"
          style={{ marginTop: "1rem", textAlign: "center" }}
        >
          {isWhalePool && "Max Stake: 12000 CROX per wallet"}
          {isShrimpPool && "Max Stake: 2500 CROX per wallet"}
          {!isShrimpPool && !isWhalePool && "Max Stake: 8000 CROX per wallet"}
        </Text>
      )}
      {
        tokenName && (tokenName === "CLA-USDT LP") && isDualFarm &&
        <Text color="primary" fontSize="14px"
          style={{ marginTop: "1rem", textAlign: "center" }}>Minimum Stake Limit: $3000</Text>
      }

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, "Cancel")}
        </Button>
        <Button
          disabled={disableConfirm()}
          onClick={async () => {
            setPendingTx(true)
            onConfirmPending()
            const res = await onConfirm(val);
            setPendingTx(false)
            onDismiss()
            onConfirmResult(res)
          }}
        >
          {pendingTx
            ? TranslateString(488, "Pending Confirmation")
            : TranslateString(464, "Confirm")}
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default DepositModal;

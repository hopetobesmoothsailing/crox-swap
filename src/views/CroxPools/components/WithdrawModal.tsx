import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";
import { Button, Modal, useModal } from "crox-uikit2.0";
import ModalActions from "components/ModalActions";
import TokenInput from "components/TokenInput";
import useI18n from "hooks/useI18n";
import {ConfirmPendingModal, ConfirmSubmitModal, ConfirmDismissModal} from 'components/ConfirmModal'
import { getFullDisplayBalance } from "utils/formatBalance";

interface WithdrawModalProps {
  max: BigNumber;
  onConfirm: (amount: string, decimal?: number) => void;
  onDismiss?: () => void;
  tokenName?: string;
  tokenDecimal?: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onConfirm,
  onDismiss,
  max,
  tokenName = "",
  tokenDecimal = 18,
}) => {
  const [val, setVal] = useState("");
  const [pendingTx, setPendingTx] = useState(false);
  const TranslateString = useI18n();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, tokenDecimal);
  }, [max, tokenDecimal]);

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
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  const disableConfirm = () => {
    if (pendingTx) return true;
    return new BigNumber(val).isGreaterThan(fullBalance);
  };

  return (
    <Modal title={`Withdraw ${tokenName}`} onDismiss={onDismiss}>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, "Cancel")}
        </Button>
        <Button
          disabled={disableConfirm()}
          onClick={async () => {
            setPendingTx(true)
            onConfirmPending()
            const res = await onConfirm(val, tokenDecimal);
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

export default WithdrawModal;

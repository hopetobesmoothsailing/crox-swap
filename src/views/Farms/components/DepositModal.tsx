import BigNumber from 'bignumber.js'
import styled from "styled-components";
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, Flex, Text, useModal } from 'crox-uikit2.0'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import { ConfirmPendingModal, ConfirmSubmitModal, ConfirmDismissModal } from 'components/ConfirmModal'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  depositFeeBP?: number
  liquidityUrlPathParts?: any
  tokenAddresses?: any
  lpLabel?: any
  isTokenOnly?: boolean
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '', depositFeeBP = 0, isTokenOnly, tokenAddresses, lpLabel, liquidityUrlPathParts }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  // const [bscScanAddress, setBscScanAddress] = useState('')
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const RE = /^\d*\.?\d{0,18}$/
      if (RE.test(e.currentTarget.value)) {
        setVal(e.currentTarget.value);
      }
    },
    [],
  )

  let txHash;

  const onConfirmResult = (res) => {
    if (res === null) {
      return onConfirmDismiss()
    }
    return onConfirmSubmit()
  }

  const [onConfirmPending] = useModal(<ConfirmPendingModal value={val} tokenName={tokenName} />)
  const [onConfirmDismiss] = useModal(<ConfirmDismissModal />)
  const [onConfirmSubmit] = useModal(<ConfirmSubmitModal bscScanAddress={txHash} value={val} tokenName={tokenName} />)

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const disableConfirm = () => {
    if (pendingTx) return true;
    return new BigNumber(val).isGreaterThan(fullBalance);
  };

  const depositLink = isTokenOnly
    ? `https://exchange.croxswap.com/#/swap/${tokenAddresses[process.env.REACT_APP_CHAIN_ID]
    }`
    : `https://exchange.croxswap.com/#/add/${liquidityUrlPathParts}`
  return (
    <Modal title={`${TranslateString(316, 'Deposit')} ${tokenName} Tokens`} onDismiss={onDismiss}>
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        depositFeeBP={depositFeeBP}
        depositLink={depositLink}
        isDeposit
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={disableConfirm()}
          onClick={async () => {
            setPendingTx(true)
            onConfirmPending()
            txHash = await onConfirm(val)
            setPendingTx(false)
            onDismiss()
            onConfirmResult(txHash)
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default DepositModal
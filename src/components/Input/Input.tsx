import React from 'react'
import { Text, LinkExternal } from 'crox-uikit2.0'
import styled from 'styled-components'

export interface InputProps {
  endAdornment?: React.ReactNode
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  startAdornment?: React.ReactNode
  value: string
  symbol?: string
  isDeposit?: boolean
  depositLink?: string
  max?: any
}

const StyledLinkExternal = styled(LinkExternal)`
  display: inline-flex;
  color: #ff3399;
  & > svg {
    fill: #ff3399; 
  }
`
const Input: React.FC<InputProps> = ({ endAdornment, onChange, placeholder, startAdornment, value, isDeposit, depositLink, symbol, max }) => {
  return (
    <>
      {max === 0 && isDeposit ? (
        <>
          <StyledInputWrapper style={{ boxShadow: "0 0 4px 2px", color: "#ff3399" }}>
            {!!startAdornment && startAdornment}
            <StyledInput placeholder={placeholder} value={value} onChange={onChange} />
            {!!endAdornment && endAdornment}
          </StyledInputWrapper>
          <Text color="#ff3399" style={{ marginTop: "10px" }}>
            No tokens to stake: &nbsp;
            <StyledLinkExternal href={depositLink}>
              Get {symbol}
            </StyledLinkExternal>
          </Text>
        </>
      ) : (
        <StyledInputWrapper>
          {!!startAdornment && startAdornment}
          <StyledInput placeholder={placeholder} value={value} onChange={onChange} />
          {!!endAdornment && endAdornment}
        </StyledInputWrapper>
      )}
    </>
  )
}

const StyledInputWrapper = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.colors.input};
  border-radius: ${(props) => props.theme.radii.default};
  display: flex;
  height: 72px;
  padding: 0 ${(props) => props.theme.spacing[3]}px;
`

const StyledInput = styled.input`
  width: 100%;
  background: none;
  border: 0;
  color: ${(props) => props.theme.colors.primary};
  font-size: 18px;
  flex: 1;
  height: 56px;
  margin: 0;
  padding: 0;
  outline: none;
`

export default Input

import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from 'crox-uikit2.0'
import useI18n from 'hooks/useI18n'
import { useGetStats } from 'hooks/api'
import { useTotalValue } from '../../../state/hooks'
import CardValue from './CardValue'

const StyledTotalValueLockedCard = styled(Card)`
  background: #121827;
  // background-color: ${({ theme }) => theme.colors.textSubtle};
  align-items: center;
  display: flex;
  flex: 1;
  margin-bottom: 10px;
`

const TotalValueLockedCard = () => {
  const TranslateString = useI18n()
  // const data = useGetStats()
  const totalValue = useTotalValue();
  // const tvl = totalValue.toFixed(2);

  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard

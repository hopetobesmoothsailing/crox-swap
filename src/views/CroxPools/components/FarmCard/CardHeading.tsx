import React from 'react'
import styled from 'styled-components'
import { Flex,  Image } from 'crox-uikit2.0'

export interface ExpandableSectionProps {
  lpLabel?: string
  risk?: number
  farmImage?: string
  tokenSymbol?: string
}

const Wrapper = styled(Flex)`
  width: 15%;
  font-weight: bold;
  float: left;
  display: inline-flex;
  svg {
    margin-right: 0.25rem;
  }
  @media screen and (max-width: 700px) {
    width: 12%;
    display: inline-block;
  }
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  risk,
  farmImage,
  tokenSymbol,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Image src={`/images/farms/${farmImage}.svg`} alt={tokenSymbol} width={50} height={50} />
    </Wrapper>
  )
}

export default CardHeading

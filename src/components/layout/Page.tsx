import styled from 'styled-components'
import Container from './Container'

const Page = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 0px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 0px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 0px;
    padding-bottom: 32px;
  }
  @media screen and (max-width: 1000px) {
    width: 98%;
  }
`

export default Page

import styled from 'styled-components'

const Container = styled.div`
  margin: auto;
  padding-left: 24px;
  padding-right: 24px;
  width: 90%;
  max-width: 1168px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 24px;
    padding-right: 24px;
    margin: auto;
  }
`

export default Container

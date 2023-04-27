import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
  }
`

export default FlexLayout

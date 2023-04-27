import React, { useState, useMemo } from 'react'
import { Input } from 'crox-uikit2.0'
import styled from 'styled-components'
import debounce from 'lodash/debounce'

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
  @media screen and (max-width: 1000px) {
    width: 176px;
    margin: 0 10px 5% 0;
  }
`

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 234px;
    display: block;
  }
  @media screen and (max-width: 1000px) {
    width: 180px;
  }
`

const Container = styled.div<{ toggled: boolean }>``

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback }) => {
  const [toggled, setToggled] = useState(false)
  const [searchText, setSearchText] = useState('')

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debouncedOnChange(e)
  }

  return (
    <Container toggled={toggled}>
      <InputWrapper>
        <StyledInput
          value={searchText}
          onChange={onChange}
          placeholder="Search farms"
          onBlur={() => setToggled(false)}
        />
      </InputWrapper>
    </Container>
  )
}

export default SearchInput

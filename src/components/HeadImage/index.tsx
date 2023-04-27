/* eslint-disable */
import React, { useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useCountUp } from 'react-countup';
import { useTotalValue } from "state/hooks";
import "./headimage.css";

const HeaderImage = styled.div`
  background-image: url('/images/Farm_header_bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  height: 255px;
  background-position: center center;
  background-color: white;
`;

const HeadImage = (props) => {

  const totalValue = useTotalValue();
  const { countUp, update } = useCountUp({
    start: 0,
    end: totalValue.toNumber(),
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      2 !== undefined ? 2 : totalValue.toNumber() < 0 ? 4 : totalValue.toNumber() > 1e5 ? 0 : 3,
  })
  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(totalValue.toNumber())
  }, [totalValue.toNumber(), updateValue])
  return (
    <HeaderImage>
        <div className="Card_text">
          <div className="TotalCard">
            <div className="Totalprice">${countUp}</div>
            <div className="tvl">Total Value Locked(TVL)</div>
            <div className="across">Across All Farms and Pools</div>
          </div>
            <p className="buyburn">*Deposit fees is used to buyback & burn CROX</p>
        </div>
    </HeaderImage>
  );
};

export default HeadImage;

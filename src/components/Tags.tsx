import React from "react";
import { Tag, VerifiedIcon, CommunityIcon, BinanceIcon } from "crox-uikit2.0";

const NoFeeTag = () => (
  <Tag variant="success"  outline startIcon={<VerifiedIcon />}>
    <p style = {{ fontSize: "10px", height: "20px"}}>No Fees</p>
  </Tag>
);

const NoFeeNoIconTag = () => (
  <Tag variant="success" outline>
    No Fees
  </Tag>
);

const RiskTag = ({ risk }) => (
  <Tag
    variant={risk >= 3 ? "failure" : "success"}
    outline
    startIcon={<VerifiedIcon />}
  >
    Risk {risk}
  </Tag>
);

const CoreTag = () => (
  <Tag variant="secondary" outline startIcon={<VerifiedIcon />}>
    Core
  </Tag>
);

const CommunityTag = () => (
  <Tag variant="textSubtle" outline startIcon={<CommunityIcon />}>
    Community
  </Tag>
);

const BinanceTag = () => (
  <Tag variant="binance" outline startIcon={<BinanceIcon />}>
    Binance
  </Tag>
);

export { CoreTag, CommunityTag, BinanceTag, RiskTag, NoFeeTag, NoFeeNoIconTag };

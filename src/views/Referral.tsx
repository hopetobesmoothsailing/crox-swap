import React from "react";
import styled from "styled-components";
import { useWallet } from "@binance-chain/bsc-use-wallet";

import {
  Button,
  Heading,
  Text,
  LogoIcon,
  Card,
  CardBody,
  CardFooter,
} from "crox-uikit2.0";
import Page from "components/layout/Page";
import useI18n from "hooks/useI18n";

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`;

const NotFound = () => {
  const TranslateString = useI18n();
  const { account } = useWallet();

  return (
    <Page>
      <Heading size="xxl" color="primary" style={{ textAlign: "center" }}>
        CroxSwap Referral Program
      </Heading>
      <Text
        mb="32px"
        mt="44px"
        color="secondary"
        fontSize="24px"
        style={{ textAlign: "center", fontWeight: "bold" }}
      >
        Share the referral link below to invite your friends and earn 1% of your
        friends&apos; earnings FOREVER!
      </Text>

      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "50px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Card style={{ width: "45%" }}>
            <CardBody
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#FE8464",
                textAlign: "center",
                padding: "30px",
              }}
            >
              Body
            </CardBody>
            <CardFooter
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#3521C3",
                textAlign: "center",
                padding: "30px",
              }}
            >
              0
            </CardFooter>
          </Card>

          <Card style={{ width: "45%" }}>
            <CardBody
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#FE8464",
                textAlign: "center",
                padding: "30px",
              }}
            >
              Total Referral Commissions
            </CardBody>
            <CardFooter
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#3521C3",
                textAlign: "center",
                padding: "30px",
              }}
            >
              0.000 CROX
            </CardFooter>
          </Card>
        </div>

        <Card style={{ width: "100%", marginTop: "80px" }}>
          <CardBody
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#FE8464",
              textAlign: "center",
              padding: "30px",
            }}
          >
            Your Referral link
          </CardBody>
          <CardFooter
            style={{
              fontSize: "24px",
              color: "#3521C3",
              textAlign: "center",
              padding: "30px",
            }}
          >
            {`${process.env.REACT_APP_PROJECT_URL}/?ref=${account}`}
          </CardFooter>
        </Card>
      </div>
    </Page>
  );
};

export default NotFound;

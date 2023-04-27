import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { Image, Heading, Text, Card, CardBody, Button, CardFooter, Tag, CalculateIcon, IconButton, ArrowDropDownIcon } from 'crox-uikit'
import styled from "styled-components";
import Page from '../../components/layout/Page'


const Bridge: React.FC = () => {

  const BridgeTag = styled(Tag)`
    margin-left: 10px;
    margin-top: 8px;
  `

  const BridgeCardBody = styled(CardBody)`
    padding: 8px;
    background: #121827;

    .arrow {
      display: flex; 
      justify-content: center; 
      margin-top: 20px;
      align-items: center;
      width: 50px;
      height: 50px; 
      border-radius: 50%; 
      background: #3e5693;
      font-size: 12px;
      color: #FE8464;
    }

    img {
      width: 40px;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      padding: 16px;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      // padding: 20px 20px;
      // .arrow {
      //   width: 40px;
      //   height: 40px;
      //   font-size: 30px;
      // }
      // img {
      //   width: 80px;
      // }
      padding: 16px;
    }
  `

  return (
    <Page>
      <Heading as="h1" size="xl" color="primary" mb="10px" style={{ textAlign: 'center' }}>
        CROX Bridge
      </Heading>
      <div>
        <Text fontSize="30px" color="white" style={{ textAlign: 'center' }} >Comming soon</Text>
        <Text fontSize="30px" color="white" style={{ textAlign: 'center' }} >You can bridge your assets across blockchains using CROX Bridge</Text>
      </div>
      <div style={{ maxWidth: "520px", width: '100%', margin: "auto" }}>
        <Card>
          <BridgeCardBody>
            <Text bold fontSize="20px">Select Asset</Text>
            <Card style={{ background: "#253253", width: "70%" }}>
              <CardBody style={{ padding: '8px 16px' }}>
                <Text bold fontSize="20px">BNB</Text>
              </CardBody>
            </Card>

            <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ width: "100%", display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ width: "40%" }}>
                  <Text bold fontSize="20px">From</Text>
                  <Card style={{ background: "#253253", padding: '20px 28px' }}>
                    <div style={{ display: "flex" }}>
                      <img src="/images/egg/ETH.png" alt="eth" />
                      <BridgeTag>ETH20</BridgeTag>
                    </div>
                    <div style={{ display: "flex", justifyContent: 'space-between', marginTop: "24px" }}>
                      <Text>Ethereum Network</Text>
                      <p style={{ fontSize: "24px", color: "#FE8464" }}>▼</p>
                    </div>
                  </Card>
                </div>

                <div id="arrow" className="arrow">
                  <p >→</p>
                </div>

                <div style={{ width: "40%" }}>
                  <Text bold fontSize="20px">To</Text>
                  <Card style={{ background: "#253253", padding: '20px 28px' }}>
                    <div style={{ display: "flex" }}>
                      <img src="/images/egg/bnb.png" alt="bnb" />
                      <BridgeTag>BEP20</BridgeTag>
                    </div>
                    <div style={{ display: "flex", justifyContent: 'space-between', marginTop: "24px" }}>
                      <Text>Ethereum Network</Text>
                      <p style={{ fontSize: "24px", color: "#FE8464" }}>▼</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>


            <Text bold fontSize="20px">Amount</Text>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Card style={{ background: "#253253", width: "60%" }}>
                <CardBody style={{ padding: '8px 16px', display: 'flex', justifyContent: "space-between" }}>
                  <Text bold fontSize="26px" color="#FE8464">0.00</Text>
                  <Text bold fontSize="26px" color="#FE8464">Max</Text>
                </CardBody>
              </Card>
              <Text bold fontSize="20px" color="#FE8464"><span style={{ color: "white" }}>Available:</span> 100.00</Text>
            </div>

            <Text style={{ marginTop: "20px" }}>You will receive ~ <span style={{ color: "#FE8464" }}>0.00</span> BNB <Tag>BEP20</Tag> Bridge Fee: </Text>

            <div style={{ width: "100%", textAlign: "center" }}>
              <Button style={{ maxWidth: "400px", width: "60%", margin: "auto", marginTop: "20px" }}>Bridge</Button>
            </div>
          </BridgeCardBody>

        </Card>
      </div>

      {/* <Image src="/images/egg/8.png" alt="illustration" width={1352} height={587} responsive /> */}
    </Page>
  )
}

export default Bridge;

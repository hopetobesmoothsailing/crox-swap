/* eslint-disable */
import React, { useContext, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import {
  Menu as UikitMenu,
  Button as UiKitButton,
  ConnectorId,
  useWalletModal,
  useMatchBreakpoints,
} from "crox-uikit2.0";
import { motion, useCycle } from "framer-motion";
import Menu, {
  Button,
  Dropdown,
  Separator,
  DropdownItem,
} from "@kenshooui/react-menu";
import { RiMenu2Line } from "react-icons/ri";
import {
  Menu as MobileMenu,
  MenuItem,
  MenuButton,
  SubMenu,
} from "@szhsin/react-menu";
import styled from "styled-components";
import config from "./config";
import "@szhsin/react-menu/dist/index.css";
import { usePriceCakeBusd } from "state/hooks";
import getRpcUrl from "utils/getRpcUrl";

const StyledMenu = styled(Menu)`
  background-color: #121827;
  padding: 0px 10px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  z-index: 10000;
`;

const StyledMobileMenu = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #121827;
  padding: 0px 10px;
  box-sizing: border-box;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 10000;
`;

const StyledMenuItem = styled(MenuItem)`
  background: transparent;
  color: white;
  padding: 20px 20px;

  &:hover {
    background: #0498aec7;
  }
`;
const StyledSubMenu = styled(SubMenu)`
  background-color: #121827;
`;

const StyledButton = styled(Button)`
  background-color: transparent;
  color: white;
  box-sizing: border-box;
  border-top: 5px solid transparent;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
  font-size: 16px;
  font-weight: 100;
  &:hover {
    background-color: transparent;
    border-top: 5px solid #0498aec7;
  }
`;

const StyledDropDown = styled(Dropdown)`
  background-color: transparent;
  color: white;
  box-sizing: border-box;
  border-top: 5px solid transparent;
  box-sizing: border-box;
  padding: 0px 30px;
  font-size: 16px;
  font-weight: 100;
  &:hover {
    background-color: transparent;
    border-top: 5px solid #0498aec7;
  }
  & .itemContainer {
    background-color: #121827;
    border: none;
  }
`;

const StyledDropDownItem = styled(DropdownItem)`
  background-color: #121827;
  border: none;
  padding: 30px 20px;
  &:hover {
    background-color: #0498aec7;
  }
  & .itemContainer {
    background-color: #121827;
  border: none;

  a {
    width: 100%;
    height: 100%;
  }
  `;

const StyledDropDownMenuItem = styled(Dropdown)`
  // background-color: transparent;
  color: white;
  box-sizing: border-box;
  // border-top: 5px solid transparent;
  box-sizing: border-box;
  padding: 0px 30px;
  font-size: 16px;
  font-weight: 100;

  background-color: #121827;
  border: none;
  padding: 30px 20px;
  &:hover {
  //   background-color: transparent;
  // border-top: 5px solid #0498aec7;
  }
  & .itemContainer {
    background-color: #121827;
  border: none;
`;

let IsConnected = false; 

const Header = (props) => {
  const history = useHistory();
  const { account, connect, reset, status, error } = useWallet();
  const handleLogin = (connectorId: ConnectorId)=> {
    IsConnected = true;
    switch (connectorId) {

      case "bsc": 
      {
        connect("bsc");
        break;
      }
      case "walletconnect": 
      {
        connect("walletconnect");
        break;
      }
      default:
        connect("injected");
    }
  }
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(
    handleLogin,
    reset,
    account as string
  );

  const cakePriceUsd = usePriceCakeBusd();
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

  useEffect(() => {
    if (IsConnected && error) {
      if (error && error.name === "ChainUnsupportedError") {
        const { ethereum } = window as any;
        (async () => {
          try {
            await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x38" }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x38",
                      chainName: "Binance Smart Chain",
                      nativeCurrency: {
                        name: "BNB",
                        symbol: "BNB",
                        decimals: 18,
                      },
                      rpcUrls: [getRpcUrl()],
                      blockExplorerUrls: ["https://bscscan.com/"],
                    },
                  ],
                });
              } catch (addError: any) {
                console.error(addError);
              }
            }
          }
          connect("injected");
        })();
      }
      IsConnected = false;
    }
  }, [account, status, error]);

  return (
    <>
      {!isMd && !isSm && !isXs && !isLg ? (
        <StyledMenu className="menu">
          <img
            src="/logo1.png"
            width="120px"
            alt="logo1"
            style={{ margin: "8px 14px", marginRight: "20px" }}
          />
          <StyledButton className="button" onClick={() => history.push("/")}>
            Home
          </StyledButton>
          <StyledDropDown
            label="Trade"
            className="dropdown itemContainer"
            itemsClassName="itemContainer"
          >
            <StyledDropDownItem className="menu-item">
              <a href="https://exchange.croxswap.com/#/swap">Swap</a>
            </StyledDropDownItem>
            <StyledDropDownItem className="menu-item">
              <a href="https://exchange.croxswap.com/#/pool">Liquidity</a>
            </StyledDropDownItem>
          </StyledDropDown>
          <StyledButton className="button" onClick={() => history.push("/farms")}>
            Farms
          </StyledButton>
          <StyledButton className="button" onClick={() => history.push("/pools/crox")}>
            Pools
          </StyledButton>
          <StyledButton className="button">
            <a href="https://bridge.croxswap.com">Bridge(Soon)</a>
          </StyledButton>
          <StyledButton className="button">
            <a href="https://referral.croxswap.com">Referral</a>
          </StyledButton>
          <StyledDropDown
            label="Audits"
            className="dropdown itemContainer"
            itemsClassName="itemContainer"
          >
            <StyledDropDownItem className="menu-item">
              <a
                href="https://github.com/TechRate/Smart-Contract-Audits/blob/main/Crox%20Final.pdf"
                target="_blank"
              >
                Techrate
              </a>
            </StyledDropDownItem>
            <StyledDropDownItem className="menu-item">
              Certik
              <br />
              (Soon)
            </StyledDropDownItem>
          </StyledDropDown>
          <StyledDropDown
            label="More"
            className="dropdown itemContainer"
            itemsClassName="itemContainer"
          >
            <StyledDropDownItem className="menu-item">
              <a href="https://docs.croxswap.com" target="_blank">
                Docs
              </a>
            </StyledDropDownItem>
            <StyledDropDownMenuItem
              label="Charts"
              direction="right"
              className="menu-item itemContainer"
              itemsClassName="itemContainer"
            >
              <StyledDropDownItem className="menu-item">
                <a
                  href="https://dex.guru/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491-bsc"
                  target="_blank"
                >
                  DexGuru
                </a>
              </StyledDropDownItem>
              <StyledDropDownItem className="menu-item">
                <a
                  href="https://poocoin.app/tokens/0x2c094f5a7d1146bb93850f629501eb749f6ed491"
                  target="_blank"
                >
                  Poocoin
                </a>
              </StyledDropDownItem>
              <StyledDropDownItem className="menu-item">
                <a
                  href="https://charts.bogged.finance/?token=0x2c094F5A7D1146BB93850f629501eB749f6Ed491"
                  target="_blank"
                >
                  BogCharts
                </a>
              </StyledDropDownItem>
            </StyledDropDownMenuItem>
            <StyledDropDownMenuItem
              label="Listings"
              direction="right"
              className="menu-item itemContainer"
              itemsClassName="itemContainer"
            >
              <StyledDropDownItem className="menu-item">
                <a
                  href="https://pancakeswap.info/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491"
                  target="_blank"
                >
                  PancakeSwap
                </a>
              </StyledDropDownItem>
              <StyledDropDownItem className="menu-item">
                <a
                  href="https://coinmarketcap.com/currencies/croxswap/"
                  target="_blank"
                >
                  CoinMarketCap
                </a>
              </StyledDropDownItem>
              <StyledDropDownItem className="menu-item">
                <a
                  href="https://www.coingecko.com/en/coins/croxswap"
                  target="_blank"
                >
                  Coingecko
                </a>
              </StyledDropDownItem>
              <StyledDropDownItem className="menu-item">
                <a
                  href="https://bscscan.com/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491"
                  target="_blank"
                >
                  BscScan
                </a>
              </StyledDropDownItem>
            </StyledDropDownMenuItem>
            <StyledDropDownItem className="menu-item">
              <a href="https://github.com/croxswap" target="_blank">
                Github
              </a>
            </StyledDropDownItem>
            <StyledDropDownItem className="menu-item">
              <a href="https://croxswap.medium.com/" target="_blank">
                Blog
              </a>
            </StyledDropDownItem>
          </StyledDropDown>

          <Separator />

          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                color: "white",
                padding: "10px",
                background: "#253253",
                marginRight: "20px",
                borderRadius: "8px",
              }}
            >
              $CROX: ${cakePriceUsd.toFixed(3)}
            </span>
            {!account ? (
              <UiKitButton onClick={onPresentConnectModal}>Connect</UiKitButton>
            ) : (
              <UiKitButton onClick={onPresentAccountModal}>
                {account.slice(0, 5)}...{account.slice(-5)}
              </UiKitButton>
            )}
          </div>
        </StyledMenu>
      ) : (
        <StyledMobileMenu>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MobileMenu
              styles={{ backgroundColor: "#121827" }}
              menuButton={
                <div
                  style={{
                    padding: "4px 8px",
                    background: "#0498aec7",
                    color: "white",
                    borderRadius: 5,
                    fontSize: 24,
                    cursor: "pointer",
                  }}
                >
                  <RiMenu2Line />
                </div>
              }
            >
              <StyledMenuItem onClick={() => history.push("/")}>
                Home
              </StyledMenuItem>
              <StyledSubMenu
                label="Trade"
                itemStyles={{
                  color: "white",
                  padding: "20px 20px",
                  background: "transparent",
                  hover: { background: "#0498aec7" },
                }}
              >
                <StyledMenuItem href="https://exchange.croxswap.com/">
                  Swap
                </StyledMenuItem>
                <StyledMenuItem href="https://exchange.croxswap.com/#/pool">
                  Liquidity
                </StyledMenuItem>
              </StyledSubMenu>
                <StyledMenuItem onClick={() => history.push("/farms")}>
                  Farms
                </StyledMenuItem>
                <StyledMenuItem onClick={() => history.push("/pools/crox")}>
                  Pools
                </StyledMenuItem>
              <StyledMenuItem href="https://bridge.croxswap.com">
                Bridge(Soon)
              </StyledMenuItem>
              <StyledMenuItem href="https://referral.croxswap.com">
                Referral
              </StyledMenuItem>
              <StyledSubMenu
                label="Audits"
                itemStyles={{
                  color: "white",
                  padding: "20px 20px",
                  background: "transparent",
                  hover: { background: "#0498aec7" },
                }}
              >
                <StyledMenuItem
                  href="https://github.com/TechRate/Smart-Contract-Audits/blob/main/Crox%20Final.pdf"
                  target="_blank"
                >
                  Techrate
                </StyledMenuItem>
                <StyledMenuItem>Certik(Soon)</StyledMenuItem>
              </StyledSubMenu>
              <StyledSubMenu
                label="More"
                itemStyles={{
                  color: "white",
                  padding: "20px 20px",
                  background: "transparent",
                  hover: { background: "#0498aec7" },
                }}
              >
                <StyledMenuItem
                  href="https://docs.croxswap.com"
                  target="_blank"
                >
                  Docs
                </StyledMenuItem>
                <StyledSubMenu
                  label="Charts"
                  itemStyles={{
                    color: "white",
                    padding: "20px 20px",
                    background: "transparent",
                    hover: { background: "#0498aec7" },
                  }}
                >
                  <StyledMenuItem
                    href="https://dex.guru/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491-bsc"
                    target="_blank"
                  >
                    DexGuru
                  </StyledMenuItem>
                  <StyledMenuItem
                    href="https://poocoin.app/tokens/0x2c094f5a7d1146bb93850f629501eb749f6ed491"
                    target="_blank"
                  >
                    Poocoin
                  </StyledMenuItem>
                  <StyledMenuItem
                    href="https://charts.bogged.finance/?token=0x2c094F5A7D1146BB93850f629501eB749f6Ed491"
                    target="_blank"
                  >
                    BogCharts
                  </StyledMenuItem>
                </StyledSubMenu>
                <StyledSubMenu
                  label="Listings"
                  itemStyles={{
                    color: "white",
                    padding: "20px 20px",
                    background: "transparent",
                    hover: { background: "#0498aec7" },
                  }}
                >
                  <StyledMenuItem
                    href="https://pancakeswap.info/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491"
                    target="_blank"
                  >
                    Pancakeswap
                  </StyledMenuItem>
                  <StyledMenuItem
                    href="https://coinmarketcap.com/currencies/croxswap/"
                    target="_blank"
                  >
                    CoinMarketCap
                  </StyledMenuItem>
                  <StyledMenuItem
                    href="https://www.coingecko.com/en/coins/croxswap"
                    target="_blank"
                  >
                    Coingecko
                  </StyledMenuItem>
                  <StyledMenuItem
                    href="https://bscscan.com/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491"
                    target="_blank"
                  >
                    BscScan
                  </StyledMenuItem>
                </StyledSubMenu>
                <StyledMenuItem
                  href="https://github.com/croxswap"
                  target="_blank"
                >
                  Github
                </StyledMenuItem>
                <StyledMenuItem
                  href="https://croxswap.medium.com"
                  target="_blank"
                >
                  Blog
                </StyledMenuItem>
              </StyledSubMenu>
            </MobileMenu>
            <img
              src="/logo1.png"
              width="120px"
              alt="logo1"
              style={{ margin: "8px 14px", marginRight: "80px" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <span style={{ color: "white", padding: "10px", background: "#253253", marginRight: "20px", borderRadius: '8px' }}>$CROX: $20.62</span> */}
            {!account ? (
              <UiKitButton onClick={onPresentConnectModal}>Connect</UiKitButton>
            ) : (
              <UiKitButton onClick={onPresentAccountModal}>
                {account.slice(0, 5)}...{account.slice(-5)}
              </UiKitButton>
            )}
          </div>
        </StyledMobileMenu>
      )}
      <div style={{ height: 62 }}></div>
    </>
  );
};

export default Header;
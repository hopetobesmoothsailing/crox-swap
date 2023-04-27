/* eslint-disable */
import React, { useContext, useState, useCallback } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { useHistory } from "react-router-dom";
import useTheme from "hooks/useTheme";
import { usePriceCakeBusd } from "state/hooks";
import {
  Link,
  Text,
  Flex,
  Menu as UikitMenu,
  Button,
  Toggle,
  useWalletModal,
  IconButton,
  useMatchBreakpoints,
} from "crox-uikit2.0";
import { getCakeAddress } from "../../utils/addressHelpers";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import "./menu.styles.css";

const Footer = (props) => {
  const history = useHistory();
  const { account, connect, reset } = useWallet();
  const { onPresentConnectModal } = useWalletModal(connect, reset);
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

  const [isChecked, setIsChecked] = useState(false);

  const toggle = () => setIsChecked(!isChecked);
  const { isDark, toggleTheme } = useTheme();

  const cakePriceUsd = usePriceCakeBusd();

  const token = getCakeAddress();
  const addWatchToken = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const provider = window.ethereum;
    if (provider) {
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await provider.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: token,
              symbol: "CROX",
              decimals: "18",
              image: "https://app.croxswap.com/images/egg/logo.png",
            },
          },
        });

        if (wasAdded) {
          // eslint-disable-next-line
          console.log("Token was added");
        }
      } catch (error) {
        // TODO: find a way to handle when the user rejects transaction or it fails
      }
    }
  }, [token]);

  return (
    <>
      <div className="partners">
        <Text className="footer_headtext" fontSize="50px" bold>Partner Reviews</Text>
        <div className="partner_review_group">
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <div className="partner_review">
                <div style={{height: '40px'}}>
                  <img src="/images/footer/centric.png" width="130px" alt=""/>
                </div>
                <Text ml="25px">Centric is an innovative dual-token digital currency and decentralized blockchain protocol built on sound economics. The dual-token model rewards adoption with a fixed hourly yield, and stabilizes over time as it self-regulates token supply to meet ongoing changes in demand.</Text>
                <Text fontSize="14px" color="#0498AE" style={{textAlign: 'right'}}>--Thomas Butcher, COO, CentricSwap</Text>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <div className="partner_review">
                <Flex style={{height: '40px', alignItems: 'center'}}>
                  <img src="/images/footer/bitcrush.png" width="130px" alt=""/>
                </Flex>
                <Text ml="25px">Bitcrush is a hybrid system of provably fair and decentralized games that utilize Defi protocols. The live wallet will allow us to launch 3rd party games like slots using native BSC tokens and keep you connected to all the Dapps you interact with on a daily basis.</Text>
                <Text fontSize="14px" color="#0498AE" style={{textAlign: 'right'}}>-- Bitcrush, CEO, Bitcrush Arcade</Text>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <div className="partner_review">
                <div style={{height: '40px'}}>
                  <img src="/images/footer/candela.png" width="130px" alt=""/>
                </div>
                <Text ml="25px">Candela Coin is a cryptocurrency that is decentralizing and democratizing solar energy. Our transactive energy system utilizes blockchain technology, microgrids, and IoT devices so people can buy and sell electricity without using the existing electric grid.</Text>
                <Text fontSize="14px" color="#0498AE" style={{textAlign: 'right'}}>-- Avi, CEO, CandelaCoin</Text>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <div className="partner_review">
                <div style={{height: '40px'}}>
                  <img src="/images/footer/rasta.png" width="130px" alt=""/>
                </div>
                <Text ml="25px">RastaFinance is decentralizing finance, using the latest in blockchain technology. Seize the power of your own money, join the revolution.</Text>
                <Text fontSize="14px" color="#0498AE" style={{textAlign: 'right'}}>-- Senor Burdy, Founder & CEO, Rasta Finance</Text>
              </div>
            </Grid>
          </Grid>
        </div>
        <Text fontSize="50px" className="footer_headtext" bold mt="70px" mb="20px" style={{textAlign: 'center'}}>Partners</Text>
        <div className="partners_group">
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6} sm={2} style={{height: '65px'}}>
              <img src="/images/footer/binance.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2}>
              <img src="/images/footer/bscscan.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2}>
              <img src="/images/footer/coinmarket.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2}>
              <img src="/images/footer/coingecko.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2}>
              <img src="/images/footer/pancake.png" style={{marginTop: '10px'}} width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2}>
              <img src="/images/footer/babyswap.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2}>
              <img src="/images/footer/centric.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2} style={{marginTop: '5px'}}>
              <img src="/images/footer/crush.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2} style={{marginTop: '5px'}}>
              <img src="/images/footer/candela.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <img src="/images/footer/rasta.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={1.5} style={{marginTop: '5px'}}>
              <img src="/images/footer/blockmine.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <img src="/images/footer/oliveswap.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <img src="/images/footer/darkmagick.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2}>
              <img src="/images/footer/safepal.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2} style={{marginTop: '-10px'}}>
              <img src="/images/footer/trustwallet.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2}>
              <img src="/images/footer/game1.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={2}>
              <img src="/images/footer/dapp.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={0.8}>
              <img src="/images/footer/grem.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={0.8} style={{marginTop: '-10px'}}>
              <img src="/images/footer/buffaloswap.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={0.8} style={{marginTop: '-10px'}}>
              <img src="/images/footer/techrate.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={0.8} style={{marginTop: '-5px'}}>
              <img src="/images/footer/gain.png" width="130px" alt=""/>
            </Grid>
            <Grid item xs={6} sm={0.8}>
              <img src="/images/footer/pino.png" width="130px" alt=""/>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className="footer">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={2.5} md={4} lg={2.2}>
              <div className="social_icon">
                <Text fontSize="32px" style={{textAlign: 'center'}} bold>Socials</Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 20,
                    justifyContent: 'space-between'
                  }}
                >
                  <Grid container>
                    <Grid item style={{textAlign: 'center'}} xs={2} sm={4} md={2}>
                      <a href="https://t.me/croxswap">
                        <img
                          src="/icon_telegram.svg"
                          alt="telegram"
                        />
                      </a>
                    </Grid>
                    <Grid item style={{textAlign: 'center'}} xs={2} sm={4} md={2}>
                      <a href="https://twitter.com/croxswap">
                        <img
                          src="/icon_twitter.svg"
                          alt="twitter"
                        />
                      </a>
                    </Grid>
                    <Grid item style={{textAlign: 'center'}} xs={2} sm={4} md={2}>
                      <a href="https://github.com/croxswap">
                        <img
                          src="/icon_github.svg"
                          alt="github"
                        />
                      </a>
                    </Grid>
                    <Grid item style={{textAlign: 'center'}} xs={2} sm={4} md={2}>
                      <a href="https://www.youtube.com/channel/UCPEJ2aiaH03VwKe4YoFWSGw">
                        <img
                          src="/icon_youtube.svg"
                          alt="youtube"
                        />
                      </a>
                    </Grid>
                    <Grid item style={{textAlign: 'center'}} xs={2} sm={4} md={2}>
                      <a href="https://croxswap.medium.com">
                        <img
                          src="/icon_medium.svg"
                          alt="blog"
                        />
                      </a>
                    </Grid>
                    <Grid item style={{textAlign: 'center'}} xs={2} sm={4} md={2}>
                      <a href="https://reddit.com/r/croxswap">
                        <img
                          src="/icon_reddit.svg"
                          alt="reddit"
                        />
                      </a>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={9.5} md={8} lg={6.3}>
              <div className="several_links">
                  <div>
                    <Text fontSize="18px" bold>About</Text>
                    <Link style={{lineHeight: '2.5'}} external href="https://docs.croxswap.com">Docs</Link>
                    <Link style={{lineHeight: '2.5'}} external href="https://github.com/croxswap">Github</Link>
                    <Link style={{lineHeight: '2.5'}} external href="https://croxswap.medium.com/">Blog</Link>
                  </div>
                  <div>
                    <Text fontSize="18px" bold>Charts</Text>
                    <Link style={{lineHeight: '2.5'}} external href="https://dex.guru/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491-bsc">DexGuru</Link>
                    <Link style={{lineHeight: '2.5'}} external href="https://poocoin.app/tokens/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Poocoin</Link>
                    <Link style={{lineHeight: '2.5'}} external href="https://charts.bogged.finance/?token=0x2c094F5A7D1146BB93850f629501eB749f6Ed491">BoggedCharts</Link>
                    <Link style={{lineHeight: '2.5'}}>Dextools</Link>
                  </div>
                  <div>
                    <Text fontSize="18px" bold>Listings</Text>
                    <Link style={{lineHeight: '2.5'}} external href="https://coinmarketcap.com/currencies/croxswap/">CoinMarketCap</Link>
                    <Link style={{lineHeight: '2'}} external href="https://www.coingecko.com/en/coins/croxswap">Coingecko</Link>
                    <Link style={{lineHeight: '2'}} external href="https://pancakeswap.info/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Pancakeswap</Link>
                    <Link style={{lineHeight: '2'}} external href="https://bscscan.com/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Bscscan</Link>
                    <Link style={{lineHeight: '2'}}>Babyswap</Link>
                  </div>
                  <div>
                    <Text fontSize="18px" bold>Audits</Text>
                    <Link style={{lineHeight: '2.5'}} external href="https://github.com/TechRate/Smart-Contract-Audits/blob/main/Crox%20Final.pdf">Techrate</Link>
                    <Link style={{lineHeight: '2.5'}}>Certik(Soon)</Link>
                  </div>
                  <div>
                    <Text fontSize="18px" bold>Products</Text>
                    <Link style={{lineHeight: '2.5'}} href="https://exchange.croxswap.com/#/swap">Exchange</Link>
                    <Link style={{marginTop: '-7px'}} href="https://exchange.croxswap.com/#/pool">Liquidity</Link>
                    <Link onClick={() => history.push("/farms")}>Dual-Farms</Link>
                    <Link onClick={() => history.push("/pools/crox")}>Next-Gen Pools</Link>
                    <Link href="https://bridge.croxswap.com">Cross-chain Bridge(Soon)</Link>
                    <Link>ICO & Launchpad</Link>
                    <Link external href="https://referral.croxswap.com">Referral Program</Link>
                    <Link>Submit Application</Link>
                  </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3.5}>
              <div className="crox_detail">
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={6} md={4.5}>
                    <Flex alignItems="center">
                      <img src="/footer_logo.svg" alt="logo" style={{ width: "50px" }}/>
                      <Text ml="5px" fontSize="27px" bold>${cakePriceUsd.toFixed(2)}</Text>
                    </Flex>
                    <Button mt='20px' style={{height: '30px', borderRadius: '5px'}}>BUY CROX</Button>
                    <Flex alignItems='center' mt='40px'>
                      <img
                        src="/Metamask.svg"
                        alt="metamask"
                        style={{ width: "20px"}}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color: "white",
                          marginLeft: "3px",
                          cursor: "pointer",
                        }}
                        onClick={addWatchToken}
                      >
                        Add $CROX to Metamask
                      </span>
                    </Flex>
                  </Grid>
                  <Grid item xs={6} md={7.5}>
                    <div className="crox_info">
                      <Flex>
                        <Text className="detail_info">MAX SUPPLY:</Text>
                        <Text>5,000,000</Text>
                      </Flex>
                      <Flex>
                        <Text className="detail_info">TOTAL SUPPLY:</Text>
                        <Text>5,000,000</Text>
                      </Flex>
                      <Flex>
                        <Text className="detail_info">CIRCULATING SUPPLY:</Text>
                        <Text>5,000,000</Text>
                      </Flex>
                      <Flex>
                        <Text className="detail_info">TOTAL BURNED:</Text>
                        <Text>5,000,000</Text>
                      </Flex>
                      <Flex>
                        <Text className="detail_info">MARKET CAP:</Text>
                        <Text>5,000,000</Text>
                      </Flex>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
      </div>
    </>
    // <div className="wrapper">
    //   <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
    //     {/* <Toggle checked={!isDark} onChange={toggleTheme} /> */}
    //     <IconButton onClick={toggleTheme}>
    //       {!isDark ? (
    //         <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    //           <path
    //             fillRule="evenodd"
    //             clipRule="evenodd"
    //             d="M4.1534 13.6089L4.15362 13.61C4.77322 16.8113 7.42207 19.3677 10.647 19.8853L10.6502 19.8858C13.0412 20.2736 15.2625 19.6103 16.9422 18.2833C11.3549 16.2878 7.9748 10.3524 9.26266 4.48816C5.69846 5.77194 3.35817 9.51245 4.1534 13.6089ZM10.0083 2.21054C4.76622 3.2533 1.09895 8.36947 2.19006 13.9901C2.97006 18.0201 6.28006 21.2101 10.3301 21.8601C13.8512 22.4311 17.0955 21.1608 19.2662 18.8587C19.2765 18.8478 19.2866 18.837 19.2968 18.8261C19.4385 18.6745 19.5757 18.5184 19.7079 18.3581C19.7105 18.355 19.713 18.3519 19.7156 18.3487C19.8853 18.1426 20.0469 17.9295 20.2001 17.7101C20.4101 17.4001 20.2401 16.9601 19.8701 16.9201C19.5114 16.8796 19.1602 16.8209 18.817 16.7452C18.7964 16.7406 18.7758 16.736 18.7552 16.7313C18.6676 16.7114 18.5804 16.6903 18.4938 16.6681C18.4919 16.6676 18.4901 16.6672 18.4882 16.6667C13.0234 15.2647 9.72516 9.48006 11.4542 4.03417C11.4549 4.03214 11.4555 4.03012 11.4562 4.0281C11.4875 3.92954 11.5205 3.83109 11.5552 3.73278C11.5565 3.72911 11.5578 3.72543 11.5591 3.72175C11.6768 3.38921 11.8136 3.05829 11.9701 2.73005C12.1301 2.39005 11.8501 2.01005 11.4701 2.03005C11.1954 2.04379 10.924 2.06848 10.6561 2.10368C10.6517 2.10427 10.6472 2.10486 10.6428 2.10545C10.4413 2.13221 10.2418 2.16492 10.0446 2.2034C10.0325 2.20576 10.0204 2.20814 10.0083 2.21054Z"
    //           />
    //         </svg>
    //       ) : (
    //         <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    //           <path d="M5.66 4.2L6.05 4.59C6.44 4.97 6.44 5.61 6.05 5.99L6.04 6C5.65 6.39 5.03 6.39 4.64 6L4.25 5.61C3.86 5.23 3.86 4.6 4.25 4.21L4.26 4.2C4.64 3.82 5.27 3.81 5.66 4.2Z" />
    //           <path d="M1.99 10.95H3.01C3.56 10.95 4 11.39 4 11.95V11.96C4 12.51 3.56 12.95 3 12.94H1.99C1.44 12.94 1 12.5 1 11.95V11.94C1 11.39 1.44 10.95 1.99 10.95Z" />
    //           <path d="M12 1H12.01C12.56 1 13 1.44 13 1.99V2.96C13 3.51 12.56 3.95 12 3.94H11.99C11.44 3.94 11 3.5 11 2.95V1.99C11 1.44 11.44 1 12 1Z" />
    //           <path d="M18.34 4.2C18.73 3.82 19.36 3.82 19.75 4.21C20.14 4.6 20.14 5.22 19.75 5.61L19.36 6C18.98 6.39 18.35 6.39 17.96 6L17.95 5.99C17.56 5.61 17.56 4.98 17.95 4.59L18.34 4.2Z" />
    //           <path d="M18.33 19.7L17.94 19.31C17.55 18.92 17.55 18.3 17.95 17.9C18.33 17.52 18.96 17.51 19.35 17.9L19.74 18.29C20.13 18.68 20.13 19.31 19.74 19.7C19.35 20.09 18.72 20.09 18.33 19.7Z" />
    //           <path d="M20 11.95V11.94C20 11.39 20.44 10.95 20.99 10.95H22C22.55 10.95 22.99 11.39 22.99 11.94V11.95C22.99 12.5 22.55 12.94 22 12.94H20.99C20.44 12.94 20 12.5 20 11.95Z" />
    //           <path
    //             fillRule="evenodd"
    //             clipRule="evenodd"
    //             d="M6 11.95C6 8.64 8.69 5.95 12 5.95C15.31 5.95 18 8.64 18 11.95C18 15.26 15.31 17.95 12 17.95C8.69 17.95 6 15.26 6 11.95ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
    //           />
    //           <path d="M12 22.9H11.99C11.44 22.9 11 22.46 11 21.91V20.95C11 20.4 11.44 19.96 11.99 19.96H12C12.55 19.96 12.99 20.4 12.99 20.95V21.91C12.99 22.46 12.55 22.9 12 22.9Z" />
    //           <path d="M5.66 19.69C5.27 20.08 4.64 20.08 4.25 19.69C3.86 19.3 3.86 18.68 4.24 18.28L4.63 17.89C5.02 17.5 5.65 17.5 6.04 17.89L6.05 17.9C6.43 18.28 6.44 18.91 6.05 19.3L5.66 19.69Z" />
    //         </svg>
    //       )}
    //     </IconButton>

    //     <img
    //       src="/footer_logo.svg"
    //       alt="logo"
    //       style={{ width: "50px", marginLeft: "20px" }}
    //     />
    //     <img
    //       src="/Metamask.svg"
    //       alt="metamask"
    //       style={{ width: "20px", marginLeft: "20px" }}
    //     />
    //     <span
    //       style={{
    //         fontSize: "12px",
    //         color: "white",
    //         marginLeft: "10px",
    //         cursor: "pointer",
    //       }}
    //       onClick={addWatchToken}
    //     >
    //       Add $CROX to Metamask
    //     </span>
    //   </div>

      // <div
      //   style={{
      //     display: "flex",
      //     alignItems: "center",
      //     marginRight: "40px",
      //     marginBottom: 20,
      //   }}
      // >
      // <a href="https://t.me/croxswap">
      //     <img
      //       src="/icon_telegram.svg"
      //       alt="telegram"
      //       style={{ marginRight: "16px" }}
      //     />
      //   </a>
      //   <a href="https://twitter.com/croxswap">
      //     <img
      //       src="/icon_twitter.svg"
      //       alt="twitter"
      //       style={{ marginRight: "16px" }}
      //     />
      //   </a>
      //   <a href="https://github.com/croxswap">
      //     <img
      //       src="/icon_github.svg"
      //       alt="github"
      //       style={{ marginRight: "16px" }}
      //     />
      //   </a>
      //   <a href="https://www.youtube.com/channel/UCPEJ2aiaH03VwKe4YoFWSGw">
      //     <img
      //       src="/icon_youtube.svg"
      //       alt="youtube"
      //       style={{ marginRight: "16px" }}
      //     />
      //   </a>
      //   <a href="https://croxswap.medium.com">
      //     <img
      //       src="/icon_medium.svg"
      //       alt="blog"
      //       style={{ marginRight: "16px" }}
      //     />
      //   </a>
      //   <a href="https://reddit.com/r/croxswap">
      //     <img
      //       src="/icon_reddit.svg"
      //       alt="reddit"
      //       style={{ marginRight: "16px" }}
      //     />
      //   </a>
      //   {(!isMd && !isSm && !isXs) || (
      //     <span
      //       style={{
      //         fontSize: 12,
      //         color: "white",
      //         padding: "10px",
      //         background: "#253253",
      //         marginRight: "20px",
      //         borderRadius: "8px",
      //       }}
      //     >
      //       $CROX: ${cakePriceUsd.toFixed(3)}
      //     </span>
      //   )}
      // </div>
    // </div>
  );
};

export default Footer;

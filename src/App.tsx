import React, { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { ResetCSS } from "crox-uikit2.0";
import BigNumber from "bignumber.js";
import { useFetchPublicData } from "state/hooks";
import GlobalStyle from "./style/Global";
import Menu from "./components/Menu";
import PageLoader from "./components/PageLoader";
import NftGlobalNotification from "./views/Nft/components/NftGlobalNotification";
import Header from "./components/Header";
import HeadImage from "./components/HeadImage";
import Footer from "./components/Footer";
import "@szhsin/react-menu/dist/index.css";
import "react-multi-carousel/lib/styles.css";

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import("./views/Home"));
const Farms = lazy(() => import("./views/Farms"));
const NextGen = lazy(() => import("./views/NextGen"));
const DualFarm = lazy(() => import("./views/NextGen/DualFarm"));
const CroxPools = lazy(() => import("./views/CroxPools"));
const Referral = lazy(() => import("./views/Referral"));
const Ref = lazy(() => import("./views/Ref"));
const Bridge = lazy(() => import("./views/Bridge"));
// const Lottery = lazy(() => import('./views/Lottery'))
// const Pools = lazy(() => import('./views/Pools'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import("./views/NotFound"));
// const Nft = lazy(() => import('./views/Nft'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const App: React.FC = () => {
  const { account, connect } = useWallet();
  useEffect(() => {
    if (!account && window.localStorage.getItem("accountStatus")) {
      connect("injected");
    }
  }, [account, connect]);

  useFetchPublicData();

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/farms">
            <HeadImage/>
            <Farms />
          </Route>
          <Route path="/pools/nextgen">
            <HeadImage/>
            <NextGen />
          </Route>
          <Route path="/dualfarms">
            <HeadImage/>
            <DualFarm />
          </Route>
          <Route path="/nests">
            <Farms tokenMode />
          </Route>
          <Route path="/pools/crox">
            <HeadImage/>
            <CroxPools />
          </Route>
          <Route path="/referral">
            <Referral />
          </Route>
          <Route path="/ref/:ref">
            <Ref />
          </Route>
          <Route path="/">
            <Home />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Footer />
      
      <NftGlobalNotification />
    </Router>
  );
};

export default React.memo(App);

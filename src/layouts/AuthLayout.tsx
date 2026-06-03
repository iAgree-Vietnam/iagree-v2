import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Col, Row, message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";

import { useAccountContext } from "@/src/contexts/AccountContext";
import Constants from "@/src/constants/Constants";
import AuthRouteUtils from "../data/auth/utils/AuthRouteUtils";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FooterV2 from "../components/footer-v2/FooterV2";

function AuthLayout(props: any) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAccessToken } = useAccountContext();
  const { data: session, status } = useSession();
  const hasRedirected = useRef(false);
  const routePreLoginRef = useRef(
    Cookies.get(Constants.ROUTE_PRE_LOGIN) || "/"
  );

  const prevSession = useRef(session);

  useEffect(() => {
    if (router.pathname === AuthRouteUtils.toForgotPassword()) return;
    if (status === "loading") return;

    if (status === "authenticated" && session?.jwt && !hasRedirected.current) {
      Cookies.set(Constants.KEY_ACCESS_TOKEN, session.jwt);
      setAccessToken(session.jwt);
      queryClient.invalidateQueries(["AUTH_FETCH_PROFILE"]).then(() => null);

      hasRedirected.current = true; // ✅ prevent multiple runs
      router
        .push(routePreLoginRef.current)
        .then(() => Cookies.remove(Constants.ROUTE_PRE_LOGIN));
    } else if (status === "unauthenticated") {
      Cookies.remove(Constants.KEY_ACCESS_TOKEN);
      setAccessToken(null);
      queryClient.setQueryData(["AUTH_FETCH_PROFILE"], null);
    }

    prevSession.current = session;
  }, [status, session, queryClient, setAccessToken, router.pathname]);

  return (
    <div className={"authWrapper"}>
      <Header />

      <Row
        gutter={[0, 0]}
        className={"authContainer"}
        justify={"center"}
        align={"middle"}
      >
        <Col className="authFormWrapper ">
          {props.children}
        </Col>
      </Row>

      <FooterV2 />
    </div>
  );
}

export default AuthLayout;

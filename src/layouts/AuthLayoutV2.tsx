"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Col, Row } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";

import { useAccountContext } from "@/src/contexts/AccountContext";
import Constants from "@/src/constants/Constants";
import HeaderWithoutMenu from "../components/HeaderWithoutMenu";
import FooterSection from "../screens/IntroduceScreen/components/FooterSection";
import FooterV2 from "../components/footer-v2/FooterV2";
import Header from "../components/Header";

interface AuthLayoutV2Props {
  children: React.ReactNode;
}

function AuthLayoutV2({ children }: AuthLayoutV2Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAccessToken } = useAccountContext();
  const { data, status } = useSession();
  const hasRedirected = useRef(false);

  const session: any = data;
  const prevSession = useRef(session);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.jwt && !hasRedirected.current) {
      Cookies.set(Constants.KEY_ACCESS_TOKEN, session.jwt);
      setAccessToken(session.jwt);
      queryClient.invalidateQueries(["AUTH_FETCH_PROFILE"]).then(() => null);
      hasRedirected.current = true;
    } else if (status === "unauthenticated") {
      Cookies.remove(Constants.KEY_ACCESS_TOKEN);
      setAccessToken(null);
      queryClient.setQueryData(["AUTH_FETCH_PROFILE"], null);
    }

    prevSession.current = session;
  }, [status, session, queryClient, setAccessToken, router]);

  return (
    <div className="authWrapper">
      <Header />

      <Row
        gutter={[0, 0]}
        className="authContainer"
        justify="center"
        align="middle"
      >
        <Col className="authFormWrapper">
          {children}
        </Col>
      </Row>

      <FooterV2 />
    </div>
  );
}

export default AuthLayoutV2;
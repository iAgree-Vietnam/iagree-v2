import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Breadcrumb, Button, Row, Image, Spin, Typography, Space } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

import RootLayout from "@/src/layouts/RootLayout";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { PartnerDetailsContent } from "@/src/screens/PartnerScreen/components/PartnerDetailsContent";
import { useFetchPartnerDetails } from "@/src/screens/PartnerScreen/hooks/useFetchPartnerDetails";
import Constants from "@/src/constants/Constants";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

function PartnerProfileScreen() {
  const router = useRouter();

  const { auth: userInfo, refreshAccount } = useAccountContext();

  const [partnerId, setPartnerId] = useState<number>(0);
  useEffect(() => {
    refreshAccount();
  }, []);
  useEffect(() => {
    const handle = async () => {
      await refreshAccount();
      const storedId = sessionStorage.getItem("newPartnerId");

      if (storedId) {
        setPartnerId(Number(storedId));
        sessionStorage.removeItem("newPartnerId");
        refreshAccount();
      }
      if (userInfo?.partner?.id) {
        setPartnerId(userInfo.partner.id);
      }
    };
    handle();
  }, [userInfo?.partner?.id]);

  const { data: partnerDetails, isFetching } =
    useFetchPartnerDetails(partnerId);

  return (
    <RootLayout>
      <Head>
        <title>Thông tin của tôi</title>
        <link
          rel={"stylesheet"}
          type={"text/css"}
          charSet={"UTF-8"}
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          }
        />
        <link
          rel={"stylesheet"}
          type={"text/css"}
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          }
        />
      </Head>

      <section className={"breadcrumbContainer"}>
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={"IC_HOME"} />
                    <span>Trang chủ</span>
                  </>
                ),
                href: "/",
              },
              { title: <Link href={"/partners"}>Đối tác</Link> },
              { title: "Thông tin của tôi" },
            ]}
          />
        </div>
      </section>

      <section className={"sectionContainer"} style={{ paddingBottom: "80px" }}>
        <div className={"contentWrapper"}>
          {isFetching ? (
            <Row align={"middle"} justify={"center"} style={{ marginTop: 64 }}>
              <Spin size={"large"} />
            </Row>
          ) : partnerDetails ? (
            <PartnerDetailsContent
              partnerDetails={partnerDetails}
              isProfileDetails={true}
            />
          ) : (
            <Space
              size={40}
              direction={"vertical"}
              className={"bgPartnerRegister d-flex"}
              align={"center"}
            >
              <Image
                preview={false}
                src={"/assets/img/about-us/ic_handshake.svg"}
                alt={"iAgree"}
                width={100}
                height={100}
              />
              <div>
                <Typography.Title
                  className={"notRegisteredTitle text-center"}
                  level={3}
                >
                  Bạn chưa đăng ký trở thành đối tác của iAgree
                </Typography.Title>
                <Typography.Paragraph
                  className={"notRegisteredSubtitle text-center"}
                >
                  Đăng ký trở thành đối tác của iAgree để hồ sơ của bạn toả sáng
                  và không bỏ lỡ cơ hội công việc phù hợp nhất
                </Typography.Paragraph>
              </div>
              <Button
                type="primary"
                size="large"
                onClick={() =>
                  router.push(PartnerRouteUtils.toPartnerRegisterV2())
                }
                className="btnPartnerRegister"
              >
                Trở thành đối tác của iAgree
              </Button>
            </Space>
          )}
        </div>
      </section>
    </RootLayout>
  );
}

export default PartnerProfileScreen;

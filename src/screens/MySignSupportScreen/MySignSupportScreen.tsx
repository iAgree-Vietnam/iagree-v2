import RootLayout from "../../layouts/RootLayout";
import Head from "next/head";
import { Breadcrumb, Col, Row } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import useSWR from "swr";
import { PolicyService } from "../HomeScreen/hooks/useGetDataHome";
import Constants from "@/src/constants/Constants";
import { SettingParserUtils } from "@/src/data/setting/utils/SettingParserUtils";

function MySignSupportScreen() {
  const { data } = useSWR(["query"], () =>
    new PolicyService().getSettingsPage(Constants.SETTING.MYSIGN_SUPPORT)
  );

  return (
    <RootLayout>
      <Head>
        <title>Hướng dẫn sử dụng MySign</title>
      </Head>

      <section className={"pageHeaderWrapper"}>
        <div className="contentWrapper">
          <div className={"pageHeaderContainer serviceHeaderContainer"}>
            <h1 className={"pageHeaderTitle nm-typo"}>
              Hướng dẫn sử dụng MySign
            </h1>
          </div>
        </div>
      </section>

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
              { title: "Hướng dẫn sử dụng MySign" },
            ]}
          />
        </div>
      </section>

      <section className={"sectionContainer"}>
        <div className={"contentWrapper"}>
          <Row gutter={[24, 80]}>
            <Col xs={24}>
              <div
                className={"policyInfo"}
                dangerouslySetInnerHTML={{
                  __html:
                    SettingParserUtils.htmlBeautify(data?.[0]?.value) || "",
                }}
              />
            </Col>
          </Row>
        </div>
      </section>
    </RootLayout>
  );
}

export default MySignSupportScreen;

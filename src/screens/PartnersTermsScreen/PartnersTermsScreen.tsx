
import RootLayout from "../../layouts/RootLayout";
import Head from "next/head";
import { Breadcrumb, Col, Row } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { PolicyService } from "../HomeScreen/hooks/useGetDataHome";
import Constants from "@/src/constants/Constants";
import useSWR from "swr";
import { SettingParserUtils } from "@/src/data/setting/utils/SettingParserUtils";

function PartnersTermsScreen(props: any) {
  const { data } = useSWR(["query"], () =>
    new PolicyService().getSettingsPage(Constants.SETTING.POLICY_FOR_PARTNERS)
  );

  return (
    <RootLayout>
      <Head>
        <title>QUY TẮC CHUNG VÀ ĐIỀU KHOẢN DÀNH CHO ĐỐI TÁC</title>
      </Head>

      <section className={"pageHeaderWrapper"}>
        <div className="contentWrapper">
          <div className={"pageHeaderContainer serviceHeaderContainer"}>
            <h1 className={"pageHeaderTitle nm-typo"}>
              QUY TẮC CHUNG VÀ ĐIỀU KHOẢN DÀNH CHO ĐỐI TÁC
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
              { title: "QUY TẮC CHUNG VÀ ĐIỀU KHOẢN DÀNH CHO ĐỐI TÁC" },
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

export default PartnersTermsScreen;

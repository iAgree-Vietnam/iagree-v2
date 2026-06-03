import RootLayout from "../../layouts/RootLayout";
import { Breadcrumb, Col, Row } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import Constants from "@/src/constants/Constants";
import { PolicyService } from "../HomeScreen/hooks/useGetDataHome";
import useSWR from "swr";
import { SettingParserUtils } from "@/src/data/setting/utils/SettingParserUtils";
// import { GetServerSidePropsContext } from "next";
// import CookieUtils from "@/src/utils/CookieUtils";

function CopyrightPolicyScreen(props: any) {
  const { data } = useSWR(["query"], () =>
    new PolicyService().getSettingsPage(Constants.SETTING.COPYRIGHT_POLICY)
  );
  return (
    <RootLayout>
      {/* <Head>
        <title>Chính sách nội dung và bản quyền</title>
      </Head> */}
      <section className={"pageHeaderWrapper"}>
        <div className="contentWrapper">
          <div className={"pageHeaderContainer serviceHeaderContainer"}>
            <h1 className={"pageHeaderTitle nm-typo"}>
              Chính sách nội dung và bản quyền
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
              { title: "Chính sách nội dung và bản quyền" },
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
                    SettingParserUtils.htmlBeautify(data?.[0]?.value) ||
                    "" ||
                    "",
                }}
              />
            </Col>
          </Row>
        </div>
      </section>
    </RootLayout>
  );
}
export default CopyrightPolicyScreen;

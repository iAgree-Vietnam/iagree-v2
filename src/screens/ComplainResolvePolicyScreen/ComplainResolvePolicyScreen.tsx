
import RootLayout from "../../layouts/RootLayout";
import Head from "next/head";
import { Breadcrumb, Col, Row } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import useSWR from "swr";
import { PolicyService } from "../HomeScreen/hooks/useGetDataHome";
import Constants from "@/src/constants/Constants";
import { SettingParserUtils } from "@/src/data/setting/utils/SettingParserUtils";

function ComplainResolvePolicyScreen(props: any) {
  const { data } = useSWR(["query"], () =>
    new PolicyService().getSettingsPage(
      Constants.SETTING.COMPLAIN_RESOLVE_POLICY
    )
  );
  
  return (
    <RootLayout>
      {/* <Head>
        <title>
          Chính sách hủy công việc, giải quyết tranh chấp và khiếu nại
        </title>
      </Head> */}

      <section className={"pageHeaderWrapper"}>
        <div className="contentWrapper">
          <div className={"pageHeaderContainer serviceHeaderContainer"}>
            <h1 className={"pageHeaderTitle nm-typo"}>
              Chính sách hủy công việc, giải quyết tranh chấp và khiếu nại
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
              {
                title:
                  "Chính sách hủy công việc, giải quyết tranh chấp và khiếu nại",
              },
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
                // dangerouslySetInnerHTML={{ __html: setting?.complainPolicy || ''}}
                dangerouslySetInnerHTML={{ __html: SettingParserUtils.htmlBeautify(data?.[0]?.value)|| ''}}
              />
            </Col>
          </Row>
        </div>
      </section>
    </RootLayout>
  );
}

export default ComplainResolvePolicyScreen;

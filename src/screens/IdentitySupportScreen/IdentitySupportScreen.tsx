
import RootLayout from "../../layouts/RootLayout";
import Head from "next/head";
import { Breadcrumb, Col, Row, Typography } from "antd";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import GuideTable from "./components/GuideTable";

function IdentitySupportScreen(props: any) {
  const accountContext = useAccountContext();

  return (
    <RootLayout>
      <Head>
        <title>Hướng dẫn đăng ký CCCD</title>
      </Head>

      <section className={"pageHeaderWrapper"}>
        <div className="contentWrapper">
          <div className={"pageHeaderContainer serviceHeaderContainer"}>
            <h1 className={"pageHeaderTitle nm-typo"}>
              Hướng dẫn đối tác cập nhật CCCD
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
              { title: "Hướng dẫn cập nhật CCCD" },
            ]}
          />
        </div>
      </section>

      <section className={"sectionContainer"}>
        <div className={"contentWrapper"}>
          <Row gutter={[24, 80]}>
            <Col xs={24}>
              <div
                style={{
                  width: "100%",
                  // height: "max-content",
                  aspectRatio: "16/9",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  backgroundColor: "#000",
                }}
              >
                <iframe
                  src="https://demo.arcade.software/kRGLjtOYLElMOGSEmNzE?embed&embed_mobile=modal&embed_desktop=modal&show_copy_link=true"
                  title="Hướng dẫn đăng ký MySign"
                  frameBorder="0"
                  allowFullScreen
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block",
                  }}
                />
              </div>
              <p className="policyParagraph">Các bước thực hiện:</p>

              <GuideTable />
            </Col>
          </Row>
        </div>
      </section>
    </RootLayout>
  );
}

export default IdentitySupportScreen;

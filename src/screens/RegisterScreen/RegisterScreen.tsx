import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Head from "next/head";
import { Button, Checkbox, Modal, Row, Typography } from "antd";
import { includes } from "lodash";
import { InfoCircleOutlined } from "@ant-design/icons";
import PersonalRegisterForm from "./PersonalRegisterScreen/components/PersonalRegiserForm";
import CompanyRegisterForm from "./CompanyRegisterScreen/company/CompanyRegisterForm";

function RegisterScreen(props: any) {
  const [role, setRole] = useState<"personal" | "business">("personal");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleChange = (value: "personal" | "business") => {
    setRole(value);
  };

  return (
    <AuthLayout>
      <Head>
        <title>Đăng ký tài khoản</title>
      </Head>

      <div className={"authContentWrapper"}>
        <div className={"authContentContainer"}>
          <h1 className={"authTitle"}>
            Đăng ký tài khoản

            <Button
              type="text"
              shape="circle"
              aria-label="Xem hướng dẫn đăng ký"
              icon={<InfoCircleOutlined />}
              onClick={() => setIsHelpOpen(true)}
            />  
          </h1>

          {/* <Typography>
                        Tham gia với tư cách là Cá nhân hoặc Doanh nghiệp/ tư nhân
                    </Typography> */}
          <div className="flex">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
              className="flex flex-col md:flex-row !gap-6 mt-2"
            >
              <Typography.Text
                style={{
                  marginRight: "8px",
                }}
                className="!mr-2"
              >
                Tham gia với tư cách:
              </Typography.Text>
              <div
                style={{
                  display: "flex",
                }}
              >
              <Checkbox
                className="ml-2"
                checked={role === "personal"}
                onChange={() => handleChange("personal")}
              >
                Cá nhân
              </Checkbox>
              <Checkbox
                checked={role === "business"}
                onChange={() => handleChange("business")}
              >
                Tổ chức / Doanh nghiệp
              </Checkbox>
              </div>
            </div>
          </div>

          <Row
            gutter={[24, 0]}
            style={{
              maxWidth: "800px",
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            {/* <Col xs={24} lg={12}>
              <Form.Item>
                <Button
                  htmlType={"button"}
                  block={true}
                  size={"large"}
                  onClick={() => router.push("/personal-register")}
                >
                  Đăng ký cá nhân
                </Button>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item>
                <Button
                  htmlType={"button"}
                  block={true}
                  size={"large"}
                  onClick={() => router.push("/company-register")}
                >
                  Doanh nghiệp / tổ chức
                </Button>
              </Form.Item>
            </Col> */}
            <div className="!min-h-[700px] !w-full">
              {includes(role, "personal") ? (
                <PersonalRegisterForm />
              ) : (
                <CompanyRegisterForm />
              )}
            </div>
          </Row>

          {/* <Row gutter={[10, 0]} justify={"center"}>
            <Space size={"small"}>
              <Typography.Paragraph className={"nm-typo"}>
                Đã có tài khoản?
              </Typography.Paragraph>
              <Link href={"/login"} className={"registerLinkText link"}>
                Đăng nhập ngay
              </Link>
            </Space>
          </Row> */}
        </div>
      </div>

      <Modal
        title="Hướng dẫn đăng ký tài khoản"
        open={isHelpOpen}
        onCancel={() => setIsHelpOpen(false)}
        footer={null}
        width={900}
        destroyOnClose
        centered
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
          }}
        >
          {/* <iframe
            src="https://andlawfirm.sharepoint.com/sites/Marketing/_layouts/15/embed.aspx?UniqueId=d648e22d-eb54-48cb-b8a1-3ed83c471af0&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create"
            title="Hướng dẫn đăng ký tài khoản"
            loading="lazy"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          /> */}
          <iframe
            src="https://www.youtube.com/embed/zshjsuCkL28?si=07wEUQN3rX-hVApG"
            title="Hướng dẫn đăng ký tài khoản"
            loading="lazy"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      </Modal>
    </AuthLayout>
  );
}

export default RegisterScreen;

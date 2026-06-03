import React, { useState } from "react";
import Head from "next/head";
import { Checkbox, Row, Typography } from "antd";
import { includes } from "lodash";
import AuthLayoutV2 from "@/src/layouts/AuthLayoutV2";
import PersonalRegisterFormV2 from "./components/personal/PersonalRegiserFormV2";
import CompanyRegisterFormV2 from "./components/company/CompanyRegisterFormV2";
import FloatingButtonContacts from "@/src/components/FloatingButtonContacts";

function RegisterBecomePartnerScreen(props: any) {
  const [role, setRole] = useState<"personal" | "business">("personal");

  const handleChange = (value: "personal" | "business") => {
    setRole(value);
  };

  return (
    <AuthLayoutV2>
      <Head>
        <title>Đăng ký tài khoản</title>
      </Head>

      <div className={"authContentWrapper"}>
        <div className={"authContentContainer"}>
          <h1 className={"authTitle"}>Đăng ký tài khoản</h1>

          <div className="flex">
            <div className="flex flex-col md:flex-row !gap-6 mt-2">
              <Typography.Text style={{ marginRight: "8px" }} className="!mr-2">
                Tham gia với tư cách:
              </Typography.Text>
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

          <Row
            gutter={[24, 0]}
            style={{
              maxWidth: "800px",
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <div className="!min-h-[700px] !w-full">
              {includes(role, "personal") ? (
                <PersonalRegisterFormV2 />
              ) : (
                <CompanyRegisterFormV2 />
              )}
            </div>
          </Row>
        </div>
      </div>

      <FloatingButtonContacts />
    </AuthLayoutV2>
  );
}

export default RegisterBecomePartnerScreen;

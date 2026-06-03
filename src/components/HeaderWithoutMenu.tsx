"use client";

import { Row } from "antd";

const HeaderWithoutMenu = () => {
  return (
    <header className={"headerWrapper"} style={{ height: "80px" }}>
      <Row
        wrap={false}
        align="middle"
        justify="start"
        style={{ height: "100%" }}
      >
        <img
          alt={"iagree"}
          src={"/assets/img/logo.svg"}
          className={"logoImg"}
        />
      </Row>
    </header>
  );
};

export default HeaderWithoutMenu;

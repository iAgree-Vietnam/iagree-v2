import React, { useState, useEffect } from "react";
import { Col, Row, Typography, Button } from "antd";
import { useRouter } from "next/router";

import { DatasResource } from "@/src/data/base/models/base.types";
import { BannerResource } from "@/src/data/banner/models/banner.types";
import { SearchResource } from "@/src/data/search/models/search.types";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import SearchAutoComplete from "@/src/components/search/SearchAutoComplete";
import { useAccountContext } from "@/src/contexts/AccountContext";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import useDetectDevice from "@/src/hooks/useDetectDevice";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import useSetRouterPath from "@/src/hooks/useSetRouterPath";

interface BannerSectionV2Props {
  data?: DatasResource<BannerResource>;
  popularSearchs: DatasResource<SearchResource>;
  scrollDown: () => void;
}

export default function BannerSectionV2(props: BannerSectionV2Props) {
  const router = useRouter();
  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;

  const isLoggedIn = accountContext.isLoggedIn;
  const isValidUser =
    fullProfileResource &&
    fullProfileResource.userId &&
    fullProfileResource?.fullName;
  const isActuallyLoggedIn = isLoggedIn && isValidUser;

  const handleJobAddClick = () => {
    if (!isActuallyLoggedIn) {
      Cookies.set(Constants.ROUTE_PRE_LOGIN, JobRouteUtils.toAddScreen());
      router.push("/login");
    } else {
      router.push(JobRouteUtils.toAddScreen());
    }
  };

  const device = useDetectDevice();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mobile = mounted ? device.isMobile() : false;
  const { isDesktop } = useBreakpoint();
  useSetRouterPath();

  return (
    <section
      style={{
        padding: "0 10px",
        ...(!mobile ? { margin: "40px 0" } : {}),
      }}
      className={"pageHeaderWrapper"}
    >
      <div className="contentWrapper">
        <div className={"pageHeaderContainer homeHeaderContainer"}>
          <Row justify={"space-around"} align={"middle"} gutter={[0, 32]}>
            <Col flex={"590px"} style={{ textAlign: "center" }}>
              <Typography.Title
                level={2}
                className="pageHeaderTitle"
                style={{
                  color: "#fff",
                  ...(mobile
                    ? {
                        maxWidth: "280px",
                        margin: "0 auto",
                      }
                    : {}),
                }}
              >
                {mounted && mobile ? (
                  <>
                    Tìm công việc và Đối tác{" "}
                    <span className="highlight">đáng tin cậy</span>{" "}
                  </>
                ) : (
                  <>
                    Nhập từ khoá để{" "}
                    <span className="highlight">tìm kiếm công việc</span> chất
                    lượng cao hoặc <span className="highlight">Đối tác</span>{" "}
                    đáng tin cậy
                  </>
                )}
              </Typography.Title>
              <Row className={"searchContainer"} justify={"center"}>
                <SearchAutoComplete />
              </Row>
            </Col>
            <Col flex={"590px"} style={{ textAlign: "center" }}>
              {isDesktop && (
                <Typography.Title
                  level={2}
                  className={"pageHeaderTitle"}
                  style={{ color: "#fff" }}
                >
                  <span className={"highlight"}>Kết nối nhanh chóng</span> và an
                  toàn tuyệt đối với <br />
                  <span className={"highlight"}>chuyên gia hàng đầu</span> mọi
                  lĩnh vực
                </Typography.Title>
              )}
              <Row
                style={{
                  ...(!isDesktop
                    ? {
                        marginTop: "20px",
                      }
                    : {}),
                }}
                justify={"center"}
              >
                <Button
                  size={"large"}
                  type={"primary"}
                  onClick={handleJobAddClick}
                  className={"btnAddJob"}
                >
                  <div style={{ fontSize: 16 }}>Đăng công việc ngay</div>
                </Button>
              </Row>
            </Col>
          </Row>
          {!mobile && mounted && (
            <>
              <Row
                className={"indicator"}
                align={"middle"}
                justify={"center"}
                onClick={props.scrollDown}
              >
                <IconSvgLocal name={"IC_ARROW_UP"} width={17} height={18} />
              </Row>
              <IconSvgLocal
                className={"indicatorWrapper"}
                name={"IC_SCROLL_DOWN_CURVE"}
                width={174}
                height={48}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

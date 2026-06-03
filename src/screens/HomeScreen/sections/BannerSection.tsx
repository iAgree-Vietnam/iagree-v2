"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row, Typography } from "antd";
import { useRouter } from "next/router";

import { DatasResource } from "@/src/data/base/models/base.types";
import { BannerResource } from "@/src/data/banner/models/banner.types";
import { SearchResource } from "@/src/data/search/models/search.types";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import SearchRouteUtils from "@/src/data/search/utils/SearchRouteUtils";
import useDetectDevice from "@/src/hooks/useDetectDevice";
import { STORAGE_KEYS } from "../../SearchScreen/SearchScreen";

interface BannerSectionProps {
  data: DatasResource<BannerResource>;
  popularSearchs: DatasResource<SearchResource>;
  scrollDown: () => void;
}

export default function BannerSection(props: BannerSectionProps) {
  const router = useRouter();

  const [search, setSearch] = useState<string | null>(null);


  function goSearch() {
    localStorage.removeItem(STORAGE_KEYS.JOB_FILTERS);
    localStorage.removeItem(STORAGE_KEYS.PARTNER_FILTERS);
    localStorage.removeItem(STORAGE_KEYS.JOB_PAGE);
    localStorage.removeItem(STORAGE_KEYS.PARTNER_PAGE);
    localStorage.removeItem(STORAGE_KEYS.TEMP_JOBS);
    localStorage.removeItem(STORAGE_KEYS.TEMP_PARTNERS);

    if (search)
      router
        .push(SearchRouteUtils.toScreen({ search: search }))
        .then(() => null);
  }

  return (
    <section className={"pageHeaderWrapper"}>
      <div className="contentWrapper">
        <div className={"pageHeaderContainer homeHeaderContainer"}>
          <Row justify={"space-around"} align={"middle"} gutter={[0, 32]}>
            <Col flex={"590px"}>
              <Typography.Title
                level={2}
                className={"pageHeaderTitle"}
                style={{ color: "#fff" }}
              >
                device.isMobile() ? Tìm công việc và Đối tác đáng tin cậy : Nhập
                từ khoá để <div className={"highlight"}>tìm kiếm công việc</div>{" "}
                chất lượng cao hoặc <div className={"highlight"}>Đối tác</div>{" "}
                đáng tin cậy
              </Typography.Title>

              <Row className={"searchContainer"} justify={"center"}>
                <Input
                  value={search || ""}
                  onChange={(e) => setSearch(e.target.value)}
                  onPressEnter={() => goSearch()}
                  size={"middle"}
                  placeholder={"Lập trình, thiết kế, pháp lý, ..."}
                  suffix={
                    <Button
                      type={"primary"}
                      size={"middle"}
                      onClick={() => goSearch()}
                      className={"btnSearch"}
                    >
                      <IconSvgLocal
                        name={"IC_SEARCH"}
                        width={20}
                        height={20}
                        fill={"#FFFFFF"}
                      />
                    </Button>
                  }
                  className={"searchInput"}
                />
              </Row>
            </Col>
            <Col flex={"590px"}>
              <Typography.Title
                level={2}
                className={"pageHeaderTitle"}
                style={{ color: "#fff" }}
              >
                <div className={"highlight"}>Kết nối nhanh chóng</div> và an
                toàn tuyệt đối với{" "}
                <div className={"highlight"}>chuyên gia hàng đầu</div> mọi lĩnh
                vực
              </Typography.Title>

              <Row justify={"center"}>
                <Button
                  size={"large"}
                  type={"primary"}
                  onClick={() => router.push(JobRouteUtils.toAddScreen())}
                  className={"btnAddJob"}
                >
                  <div style={{ fontSize: 16 }}>Đăng công việc ngay</div>
                </Button>
              </Row>
            </Col>
          </Row>
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
        </div>
      </div>
    </section>
  );
}

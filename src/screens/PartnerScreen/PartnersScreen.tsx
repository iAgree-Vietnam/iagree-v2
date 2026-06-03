import React, { useState, useMemo } from "react";
import { Breadcrumb, Button, Col, Input, List, Row, Typography } from "antd";
import PartnerItem from "@/src/components/partner/PartnerItem";
import RootLayoutWithFilterCategory from "@/src/layouts/RootLayoutWithFilterCategory";
import Head from "next/head";
import {
  PartnerFilterParams,
  PartnerInitResource,
} from "@/src/data/partner/models/partner.types";
import _ from "lodash";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import { ButtonWithIcon } from "@/src/components/button";
import { useRouter } from "next/router";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

interface PartnersScreenProps {
  data: PartnerInitResource;
  filters: PartnerFilterParams;
}

function PartnersScreen(props: PartnersScreenProps) {
  const router = useRouter();
  const { isMobile } = useBreakpoint();

  const [searchInput, setSearchInput] = useState<string>("");

  const partnerInitResource = props.data;

  const limitedPartners = useMemo(
    () => partnerInitResource.partners?.slice(0, 3) || [],
    [partnerInitResource.partners]
  );

  function handleSearch() {
    if (searchInput.trim()) {
      router.push({
        pathname: PartnerRouteUtils.toPartnersSearchScreen(),
        query: { search: searchInput.trim() },
      });
    }
  }

  const jobSlickSettings = {
    arrows: false,
    dots: true,
    centerMode: isMobile ? true : false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <RootLayoutWithFilterCategory>
      {/* <Head>
        <title>Đối tác</title>

        <link
          rel={"stylesheet"}
          type={"text/css"}
          charSet={"UTF-8"}
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          }
        />
        <link
          rel={"stylesheet"}
          type={"text/css"}
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          }
        />
      </Head> */}

      <section className={"pageHeaderWrapper"}>
        <div className="contentWrapperBanner">
          <div className={"pageHeaderContainer partnerHeaderContainer"}>
            <Row justify={"center"}>
              <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
                <h1 className={"pageHeaderTitle"}>
                  Tìm kiếm <span className={"highlight"}>Đối tác</span>
                </h1>

                <Row className={"searchContainer"} justify={"center"}>
                  <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onPressEnter={handleSearch}
                    size={"large"}
                    placeholder={"Nhập tên Đối tác tìm kiêm"}
                    suffix={
                      <Button
                        type={"primary"}
                        size={"middle"}
                        onClick={handleSearch}
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
            </Row>
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
              { title: "Đối tác" },
            ]}
          />
        </div>
      </section>

      {/* {PartnerParserUtils.isFilterInitialState(props.filters) && (
        <section className={"sectionContainer specialPartnersContainer"}>
          <div className="contentWrapper">
            <div className={"sectionTitleContainer"}>
              <Typography.Title className={"sectionTitle"} level={3}>
                Đối tác hàng đầu
              </Typography.Title>
            </div>

            <div className="sectionContentContainerSm">
              <Slider {...jobSlickSettings}>
                {_.chunk(
                  partnerInitResource.specialPartners,
                  isDesktop ? 3 : isMobile ? 1 : 2
                ).map((specialPartners, jobRowIndex) => {
                  return (
                    <div key={jobRowIndex}>
                      <List
                        key={jobRowIndex}
                        grid={{
                          gutter: 24,
                          xs: 1,
                          sm: 1,
                          md: 2,
                          lg: 2,
                          xl: 3,
                          xxl: 3,
                        }}
                        dataSource={specialPartners}
                        className={"partnerListSliderContainer"}
                        renderItem={(item) => {
                          return (
                            <List.Item>
                              <PartnerItem key={item.partnerId} data={item} />
                            </List.Item>
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
        </section>
      )} */}

      <section className={"sectionContainer templateSectionContainer"}>
        <div className="contentWrapper">
          <div className={"sectionTitleContainer"}>
            <Typography.Title className={"sectionTitle"} level={3}>
              Tất cả Đối tác
            </Typography.Title>
          </div>
          <Row gutter={[40, 48]}>
            <Col xs={24}>
              <div>
                <List
                  dataSource={limitedPartners}
                  grid={{
                    gutter: [20, 24],
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 3,
                    xxl: 3,
                  }}
                  className={"partnerListContainer"}
                  renderItem={(item) => {
                    return (
                      <List.Item className={"partnerItemWrapper"}>
                        <PartnerItem key={item.partnerId} data={item} />
                      </List.Item>
                    );
                  }}
                />
              </div>
            </Col>

            <Col xs={24}>
              <Row justify={"center"}>
                <ButtonWithIcon
                  icon={
                    <IconSvgLocal
                      name={"IC_ARROW_RIGHT"}
                      width={26}
                      height={9}
                    />
                  }
                  iconPosition={"end"}
                  onClick={() =>
                    router.push(PartnerRouteUtils.toPartnersSearchScreen())
                  }
                >
                  Xem tất cả Đối tác
                </ButtonWithIcon>
              </Row>
            </Col>
          </Row>
        </div>
      </section>
    </RootLayoutWithFilterCategory>
  );
}

export default PartnersScreen;

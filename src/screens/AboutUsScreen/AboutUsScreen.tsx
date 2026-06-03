import React, { useMemo } from "react";
import Head from "next/head";
import {
  Breadcrumb,
  Card,
  Col,
  Image,
  List,
  Row,
  Space,
  Statistic,
  Typography,
} from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import Slider from "@ant-design/react-slick";

import RootLayout from "@/src/layouts/RootLayout";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { ButtonWithIcon } from "@/src/components/button";
import { FeedbackCarousel } from "./components/FeedbackCarousel";
import { useRouter } from "next/router";
import PricingRouteUtils from "@/src/data/pricing/utils/PricingRouteUtils";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import { HomeInitResource } from "@/src/data/home/models/home.types";
import PartnerItem from "@/src/components/partner/PartnerItem";
import _ from "lodash";
import useHomeInit from "../HomeScreen/hooks/useHomeInit";
import ArrayUtils from "@/src/utils/ArrayUtils";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import TopPartnersSection from "../HomeScreen/sections/TopPartnersSection";

function AboutUsScreen(props: any) {
  const router = useRouter();
  const { isDesktop, isMobile } = useBreakpoint();

  const aboutUsInitOriginResource: HomeInitResource = props.data;

  const { data: aboutUsInitResource } = useHomeInit({
    initData: aboutUsInitOriginResource,
  });

  const partnerSlideItems = useMemo(
    () =>
      _.chunk(aboutUsInitResource?.partners, isDesktop ? 4 : isMobile ? 1 : 2),
    [aboutUsInitResource, isDesktop, isMobile]
  );

  const partnerSlickSettings = {
    arrows: false,
    dots: true,
    centerMode: isMobile ? true : false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <RootLayout>
      <Head>
        <title>Về chúng tôi</title>
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
      </Head>

      <section className={"pageHeaderWrapper"}>
        <div className="contentWrapper">
          <Row
            className={"pageHeaderContainer aboutUsHeaderContainer"}
            align={"middle"}
          >
            <div className={"aboutUsHeaderContent"}>
              <h3 className={"pageHeaderSubtitle"}>
                Kiến tạo một phương thức kết nối những người sẵn sàng làm việc
                <br />
                với những người có nhu cầu thuê nhân lực
              </h3>
              <h1 className={"pageHeaderTitle"}>
                <span className={"highlight"}>
                  Chúng tôi tạo nên sự khác biệt <br />trong cuộc sống của
                  mọi người
                </span>
              </h1>
            </div>
          </Row>
        </div>
      </section>

      <section className={"breadcrumbContainer aboutUsBreadcrumbContainer"}>
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
              { title: "Về chúng tôi" },
            ]}
          />
        </div>
      </section>

      <section className={"sectionContainer introWrapper"}>
        <div className="contentWrapper">
          <Row
            gutter={[80, 32]}
            className="introWrapperContent"
            align={"middle"}
          >
            <Col xs={24} lg={12}>
              <Image
                preview={false}
                src={"/assets/img/home/about-us/about-us-1.png"}
                alt={"iAgree"}
                className={"introSectionImage"}
              />
            </Col>
            <Col xs={24} lg={12}>
              <Typography.Paragraph className={"introLabel"}>
                Giá trị cốt lõi
              </Typography.Paragraph>

              <Typography.Title className={"introTitle"} level={1}>
                Vision & Mission
              </Typography.Title>

              <Row wrap={false} gutter={20}>
                <Col flex={"104px"}>
                  <Typography.Title
                    level={4}
                    className={"nm-typo"}
                    style={{ color: "#09993E" }}
                  >
                    Sứ mệnh
                  </Typography.Title>
                </Col>
                <Col flex={"auto"} style={{ textAlign: "justify" }}>
                  <Typography.Paragraph className={"introDescription nm-typo"}>
                    Mang đến cho thị trường một nền tảng kết nối toàn diện, nơi
                    mọi giao dịch dịch vụ giữa nhà cung cấp và Khách hàng đều
                    minh bạch và hợp pháp. iAgree tạo ra không gian làm việc
                    chuyên nghiệp, nơi các Đối tác có thể dễ dàng quảng bá dịch
                    vụ của mình, đồng thời cá nhân hóa trải nghiệm của từng
                    Khách hàng để đáp ứng tối đa nhu cầu của họ.
                  </Typography.Paragraph>
                </Col>
              </Row>

              <Row wrap={false} gutter={20} style={{ marginTop: "30px" }}>
                <Col flex={"104px"}>
                  <Typography.Title
                    level={4}
                    className={"nm-typo"}
                    style={{ color: "#09993E" }}
                  >
                    Tầm nhìn
                  </Typography.Title>
                </Col>
                <Col flex={"auto"} style={{ textAlign: "justify" }}>
                  <Typography.Paragraph className={"introDescription nm-typo"}>
                    Trở thành nền tảng kết nối dịch vụ hàng đầu Việt Nam, giúp
                    người dùng dễ dàng tiếp cận những dịch vụ chất lượng, đồng
                    thời tạo một môi trường chuyên nghiệp để các Đối tác thể
                    hiện năng lực của mình. Chúng tôi luôn nỗ lực đổi mới, cá
                    nhân hóa trải nghiệm và tối ưu hóa dịch vụ, mang lại giá trị
                    bền vững cho cả Khách hàng và Đối tác.
                  </Typography.Paragraph>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </section>

      <section className={"sectionContainer aboutInfoWrapper"}>
        <div className="contentWrapper">
          <div className={"aboutInfoBackground"}>
            <Row gutter={80} align={"middle"} className={"aboutInfoContent"}>
              <Col
                xs={24}
                lg={12}
                className={"aboutInfoContentLeft"}
                style={{ paddingTop: "40px" }}
              >
                {/* <Typography.Paragraph className={'infoLabel'}>
                  Lựa chọn hàng đầu
                </Typography.Paragraph> */}

                <Typography.Title className={"aboutInfoTitle"} level={2}>
                  Lựa chọn hàng đầu
                  <br />
                  để giải quyết các vấn đề
                </Typography.Title>

                <List
                  key={"id"}
                  dataSource={[
                    {
                      id: 1,
                      title: "Dễ dàng, nhanh chóng",
                      name: "Trung tâm kết nối dịch vụ chuyên nghiệp, giúp người dùng dễ dàng tạo hồ sơ và thu hút Khách hàng.",
                    },
                    {
                      id: 2,
                      title: "Đối tác uy tín",
                      name: "Danh sách Đối tác được chọn lọc kỹ lưỡng và được giám sát, hỗ trợ bởi đội ngũ iAgree trong suốt quá trình thực hiện công việc.",
                    },
                    {
                      id: 3,
                      title: "Xác thực & bảo mật tài khoản",
                      name: "Nền tảng minh bạch giúp xác thực thông tin Đối tác và Khách hàng ngay trên hệ thống. Mọi hồ sơ đều được kiểm duyệt, đảm bảo danh tính rõ ràng, bảo mật dữ liệu và tăng độ tin cậy trong từng giao dịch.",
                    },
                    {
                      id: 4,
                      title: "Tiện lợi và tối ưu dữ liệu",
                      name: "Ký hợp đồng trực tuyến với chữ ký số và chia sẻ 1000+ biểu mẫu tài liệu ở đa dạng lĩnh vực như pháp lý, tài chính, kế toán,...",
                    },
                  ]}
                  renderItem={(item) => {
                    return (
                      <List.Item>
                        <Space size={"middle"} align={"start"}>
                          <CheckCircleFilled
                            style={{
                              color: "#09993E",
                              fontSize: "20px",
                              marginTop: "6px",
                            }}
                          />
                          <Space
                            size={4}
                            direction={"vertical"}
                            className={"d-flex"}
                          >
                            <Typography.Title level={4} className={"nm-typo"}>
                              {item.title}
                            </Typography.Title>
                            <Typography.Paragraph
                              className={"infoItemLabel nm-typo"}
                              style={{ textAlign: "justify" }}
                            >
                              {item.name}
                            </Typography.Paragraph>
                          </Space>
                        </Space>
                      </List.Item>
                    );
                  }}
                />

                <Row justify={!isDesktop ? "center" : "start"}>
                  <ButtonWithIcon
                    icon={
                      <IconSvgLocal
                        name={"IC_ARROW_RIGHT"}
                        width={26}
                        height={9}
                      />
                    }
                    iconPosition={"end"}
                    onClick={() => router.push(PricingRouteUtils.toScreen())}
                  >
                    Tìm hiểu thêm
                  </ButtonWithIcon>
                </Row>
              </Col>

              <Col xs={24} lg={12} className={"aboutInfoContentRight"}>
                <Image
                  preview={false}
                  src={"/assets/img/about-us/about-us-2.png"}
                  className={"aboutInfoImage"}
                  alt={"How to we do"}
                />
              </Col>
            </Row>
          </div>
        </div>
      </section>

      <TopPartnersSection
        partnerSlideItems={partnerSlideItems}
        router={router}
      />

      <section className={"sectionContainer videoStatisticWrapper"}>
        <div className="contentWrapper">
          <div className={"statisticContainer"}>
            <Typography.Title
              className={"statisticContainerTitle text-center"}
              level={1}
            >
              Thành tựu của <span>IAGREE</span> qua các con số
            </Typography.Title>
            <Row gutter={!isDesktop ? [24, 24] : 30} justify={"center"}>
              <Col xs={12} lg={6}>
                <Card bordered={false} className={"statisticAboutUsCard"}>
                  <Image
                    preview={false}
                    src={"/assets/img/about-us/ic_digital.svg"}
                    alt={"iAgree"}
                    className={"statisticAboutUsImage"}
                  />
                  <Statistic
                    title={"Tổng Freelancer"}
                    value={aboutUsInitResource.getAboutUsReport.getTotalPartner}
                    className={"statisticAboutUsItem"}
                  />
                </Card>
              </Col>

              <Col xs={12} lg={6}>
                <Card bordered={false} className={"statisticAboutUsCard"}>
                  <Image
                    preview={false}
                    src={"/assets/img/about-us/ic_rating.svg"}
                    alt={"iAgree"}
                    className={"statisticAboutUsImage"}
                  />
                  <Statistic
                    title={"Đánh giá tích cực"}
                    // valueRender={() => (
                    //   <CountUp end={aboutUsInitResource.getAboutUsReport.getTotalReview} duration={100} separator="," />
                    // )}
                    value={aboutUsInitResource.getAboutUsReport.getTotalReview}
                    className={"statisticAboutUsItem"}
                  />
                </Card>
              </Col>

              <Col xs={12} lg={6}>
                <Card bordered={false} className={"statisticAboutUsCard"}>
                  <Image
                    preview={false}
                    src={"/assets/img/about-us/ic_handshake.svg"}
                    alt={"iAgree"}
                    className={"statisticAboutUsImage"}
                  />
                  <Statistic
                    title={"Đơn hàng đã nhận"}
                    value={aboutUsInitResource.getAboutUsReport.getTotalOrder}
                    className={"statisticAboutUsItem"}
                  />
                </Card>
              </Col>

              <Col xs={12} lg={6}>
                <Card bordered={false} className={"statisticAboutUsCard"}>
                  <Image
                    preview={false}
                    src={"/assets/img/about-us/ic_surveyor.svg"}
                    alt={"iAgree"}
                    className={"statisticAboutUsImage"}
                  />
                  <Statistic
                    title={"Dự án đã hoàn thành"}
                    value={
                      aboutUsInitResource.getAboutUsReport
                        .getTotalProjectCompleted
                    }
                    className={"statisticAboutUsItem"}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </section>

      <section className={"sectionContainer feedbackWrapper"}>
        <div className={"contentWrapper"}>
          <div className={"feedbackContentContainer"}>
            <Typography.Title className={"feedbackSectionTitle"} level={2}>
              Người dùng nói gì về chúng tôi
            </Typography.Title>
            <FeedbackCarousel />
          </div>
        </div>
      </section>

      <section className={"sectionContainer partnerWrapper wrapperImg"}>
        <div className="contentWrapper">
          <div className="partnerWrapperContainer">
            <Typography.Title
              className={"partnerSectionTitle text-center"}
              level={2}
            >
              Đối tác đồng hành cùng iAgree
            </Typography.Title>

            <div className="sectionContentContainer">
              <Space
                size={!isDesktop ? 30 : 60}
                className={"d-flex"}
                direction={"vertical"}
              >
                <Row gutter={[80, 30]} justify={"center"} align={"middle"}>
                  {ArrayUtils.arrayRange(1, 4).map((item) => (
                    <Col key={item}>
                      <Image
                        preview={false}
                        src={`/assets/img/partners/partner-${item}.png`}
                        className={"partnerImg"}
                        alt={`Partner-${item}`}
                      />
                    </Col>
                  ))}
                </Row>
                <Row gutter={[80, 30]} justify={"center"} align={"middle"}>
                  {ArrayUtils.arrayRange(5, 8).map((item) => (
                    <Col key={item}>
                      <Image
                        preview={false}
                        src={`/assets/img/partners/partner-${item}.png`}
                        className={"partnerImg"}
                        alt={`Partner-${item}`}
                      />
                    </Col>
                  ))}
                </Row>
                <Row gutter={[80, 30]} justify={"center"} align={"middle"}>
                  {ArrayUtils.arrayRange(9, 11).map((item) => (
                    <Col key={item}>
                      <Image
                        preview={false}
                        src={`/assets/img/partners/partner-${item}.png`}
                        className={"partnerImg"}
                        alt={`Partner-${item}`}
                      />
                    </Col>
                  ))}
                </Row>
              </Space>
            </div>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}

export default AboutUsScreen;

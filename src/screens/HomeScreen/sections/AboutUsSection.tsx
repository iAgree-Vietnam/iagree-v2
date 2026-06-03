
import { Col, Image, Row, Typography } from "antd";
import Link from "next/link";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import AboutUsRouteUtils from "@/src/data/aboutus/utils/AboutUsRouteUtils";
import { ButtonWithIcon } from "@/src/components/button";

type Props = {
  homeInitResource: any;
  isDesktop: boolean;
};

const AboutUsSection: React.FC<Props> = ({ homeInitResource, isDesktop }) => (
  <section className="sectionContainer aboutUsWrapper">
    <div className="contentWrapper">
      <div className="sectionContentShadowTop" />
      <div className="sectionContentShadowBottom" />
      <div className="sectionContentContainer">
        <Row gutter={[100, 16]}>
          {!isDesktop ? (
            <>
              <Col xs={24} lg={12}>
                <Image
                  preview={false}
                  src="/assets/img/home/about-us/about-us-1.png"
                  alt="iAgree"
                  className="aboutUsSectionImage"
                />
              </Col>
              <Col xs={24} lg={12}>
                <Typography.Title className="sectionTitle aboutUsTitle">
                  {homeInitResource.aboutUs?.name || "Về chúng tôi"}
                </Typography.Title>
                <Typography.Paragraph
                  className="aboutUsParagraph"
                  ellipsis={{ rows: 6 }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: homeInitResource.aboutUs?.description,
                    }}
                  />
                </Typography.Paragraph>
                <div className="aboutUsCtaContainer">
                  <Link href={AboutUsRouteUtils.toScreen()}>
                    <ButtonWithIcon
                      icon={
                        <IconSvgLocal
                          name="IC_ARROW_RIGHT"
                          width={26}
                          height={9}
                        />
                      }
                      iconPosition="end"
                    >
                      Tìm hiểu thêm
                    </ButtonWithIcon>
                  </Link>
                </div>
              </Col>
            </>
          ) : (
            <>
              <Col xs={24} lg={12}>
                <Typography.Title className="sectionTitle aboutUsTitle">
                  {homeInitResource.aboutUs?.name || "Về chúng tôi"}
                </Typography.Title>
                <Typography.Paragraph
                  className="aboutUsParagraph"
                  ellipsis={{ rows: 6 }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: homeInitResource.aboutUs?.description,
                    }}
                  />
                </Typography.Paragraph>
                <div className="aboutUsCtaContainer">
                  <Link href={AboutUsRouteUtils.toScreen()}>
                    <ButtonWithIcon
                      icon={
                        <IconSvgLocal
                          name="IC_ARROW_RIGHT"
                          width={26}
                          height={9}
                        />
                      }
                      iconPosition="end"
                    >
                      Tìm hiểu thêm
                    </ButtonWithIcon>
                  </Link>
                </div>
              </Col>
              <Col xs={24} lg={11}>
                <Image
                  preview={false}
                  src="/assets/img/home/about-us/about-us-1.png"
                  alt="iAgree"
                  className="aboutUsSectionImage"
                />
              </Col>
            </>
          )}
        </Row>
        <Row
          gutter={[30, 32]}
          className="statisticContainer"
          justify="space-around"
        >
          <Col span={!isDesktop ? 12 : "auto"}>
            <Typography.Paragraph className="statisticValue text-center">
              <span>{homeInitResource.getAboutUsReport.getTotalPartner}</span>
            </Typography.Paragraph>
            <Typography.Paragraph className="statisticLabel">
              Tổng Đối tác
            </Typography.Paragraph>
          </Col>
          <Col span={!isDesktop ? 12 : "auto"}>
            <Typography.Paragraph className="statisticValue text-center">
              <span>{homeInitResource.getAboutUsReport.getTotalReview}</span>
            </Typography.Paragraph>
            <Typography.Paragraph className="statisticLabel">
              Đánh giá tích cực
            </Typography.Paragraph>
          </Col>
          <Col span={!isDesktop ? 12 : "auto"}>
            <Typography.Paragraph className="statisticValue text-center">
              <span>{homeInitResource.getAboutUsReport.getTotalOrder}</span>
            </Typography.Paragraph>
            <Typography.Paragraph className="statisticLabel">
              Đơn hàng đã nhận
            </Typography.Paragraph>
          </Col>
          <Col span={!isDesktop ? 12 : "auto"}>
            <Typography.Paragraph className="statisticValue text-center">
              <span>
                {homeInitResource.getAboutUsReport.getTotalProjectCompleted}
              </span>
            </Typography.Paragraph>
            <Typography.Paragraph className="statisticLabel">
              Dự án đã hoàn thành
            </Typography.Paragraph>
          </Col>
        </Row>
        <div className="sectionContentLogoBackdrop">
          <Image
            preview={false}
            src="/assets/img/home/about-us/logo-backdrop.svg"
            alt="iAgree"
          />
        </div>
      </div>
    </div>
  </section>
);

export default AboutUsSection;

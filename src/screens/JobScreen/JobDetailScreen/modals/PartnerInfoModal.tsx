import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  message,
  Image,
} from "antd";
import Images from "@/src/constants/Images";
import { LeftOutlined, RightOutlined, StarFilled } from "@ant-design/icons";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import {
  CategoryResource,
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import services from "@/pages/services";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import JobItem from "@/src/components/jobs/JobItem";
import Constants from "@/src/constants/Constants";
import { CategoryServicesChipList } from "@/src/screens/PartnerScreen/components/CategoryServicesChipList";
import { PartnerComplain } from "@/src/screens/PartnerScreen/components/PartnerComplain";
import { PartnerEducationV2 } from "@/src/screens/PartnerScreen/components/PartnerEducationsV2";
import { PartnerFeaturedProjectsViewSection } from "@/src/screens/PartnerScreen/components/PartnerFeaturedProjectsView";
import { PartnerReviews } from "@/src/screens/PartnerScreen/components/PartnerReviews";
import { ServicesChipList } from "@/src/screens/PartnerScreen/components/ServicesChipList";
import { SkillsChipList } from "@/src/screens/PartnerScreen/components/SkillsChipList";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import NumberUtils from "@/src/utils/NumberUtils";
import rate from "antd/es/rate";
import { FullProfileResource } from "@/src/data/auth/models/types";
import { PartnerDetailResource } from "@/src/data/partner/models/partner.types";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import Slider from "@ant-design/react-slick";
import { map, size } from "lodash";
import { RawReviewResource } from "@/src/data/partner/models/partner.raw";

type PartnerInfoModalProps = {
  partnerDetail: PartnerDetailResource | null;
  isRate?: boolean
};

export interface PartnerInfoModalRef {
  open: () => void;
  close: () => void;
}

const PartnerInfoModal = React.forwardRef<
  PartnerInfoModalRef,
  PartnerInfoModalProps
>((props, ref) => {
  const { partnerDetail } = props;
  const [isOpen, setOpen] = useState(false);
  const { isDesktop } = useBreakpoint();
  const jobSlider = useRef<Slider>(null);

  const open = useCallback(() => setOpen(true), [partnerDetail]);
  const close = useCallback(() => setOpen(false), []);

  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    [open, close]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
  };

  const jobSlickSettings = {
    arrows: false,
    dots: !isDesktop ? true : false,
    infinite: false,
    speed: 500,
    slidesToShow: !isDesktop ? 1.25 : 2.5,
    slidesToScroll: 1,
  };

  useEffect(() => {
    if (!partnerDetail && isOpen) {
      setOpen(false);
    }
  }, [partnerDetail, isOpen]);

  if (!partnerDetail) {
    return null;
  }

  return (
    <Modal
      style={{ top: 20 }}
      width={{
        xs: "95%",
        sm: "90%",
        md: "85%",
        lg: "80%",
        xl: "75%",
        xxl: "70%",
      }}
      centered
      open={isOpen}
      className={"applyJobModalContainer"}
      footer={null}
      onCancel={() => close()}
      maskClosable={false}
    >
      <Row gutter={[40, 40]}>
        <Col xs={24} lg={24}>
          <Space direction={"vertical"} size={40} className={"d-flex"}>
        {!props.isRate ?    <>
              <Space
                direction={"vertical"}
                size={30}
                className={
                  "partnerDetailOverviewContainer borderedContainer d-flex"
                }
              >
                <Row gutter={30} align={"middle"}>
                  <Col>
                    <div
                      style={{
                        position: "relative",
                        width: 125,
                        height: 125,
                        margin: "0 auto",
                      }}
                    >
                      <Image
                        preview={false}
                        width={125}
                        height={125}
                        src={partnerDetail?.partner.user?.avatarUrl}
                        fallback={Images.ACCOUNT_DEFAULT}
                        alt="Avatar"
                        className="partnerAvatar"
                      />
                      {partnerDetail?.partner?.is_citizen_id_verified == 1 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            zIndex: 1,
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "white",
                              borderRadius: "50%",
                              padding: "0",
                              border: "2px solid white",
                            }}
                          >
                            <IconSvgLocal
                              name={"IC_VERIFIED"}
                              width={25}
                              height={25}
                              fill="#09993E"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col flex={1}>
                    <Row justify={"space-between"} align={"middle"}>
                      <Typography.Title
                        className={"partnerFullName nm-typo"}
                        style={{ fontSize: "25px" }}
                      >
                        {partnerDetail?.partner?.user?.fullName}
                      </Typography.Title>
                      {Boolean(partnerDetail?.partner?.isFounding) && (
                        <Tag className={"foundingTag"}>Founding Partner</Tag>
                      )}
                    </Row>

                    {/* {isShowReviews && ( */}
                    <Space>
                      <div
                        className={"rateContainer"}
                        style={{ marginTop: "5px" }}
                      >
                        <StarFilled style={{ fontSize: "22px" }} />
                        <Typography.Paragraph
                          className={"rateInfo"}
                          style={{ fontSize: "15px" }}
                        >
                          {NumberUtils.display(partnerDetail.partner.rate)}
                          <span className={"reviews"}>
                            ({partnerDetail.partner.totalReview} đánh giá)
                          </span>
                        </Typography.Paragraph>
                      </div>
                    </Space>
                    {/* )} */}
                  </Col>
                </Row>

                <Typography.Title
                  className={"partnerPosition"}
                  style={{ padding: "0", fontSize: "17px" }}
                >
                  {partnerDetail?.partner?.position}
                </Typography.Title>

                <Row gutter={[24, 24]} justify={"space-between"}>
                  <Col>
                    <Space size={"middle"} align={"center"}>
                      <div className={"iconWrapper"}>
                        <IconSvgLocal
                          name={"IC_BAG"}
                          fill={"#74767E"}
                          width={24}
                          height={24}
                        />
                      </div>
                      <div>
                        <Typography.Paragraph className={"infoTitle"}>
                          Lĩnh vực
                        </Typography.Paragraph>
                        <Typography.Paragraph className={"infoContent"}>
                          {partnerDetail.partner.categories
                            ?.map((item) => item.name)
                            .join(", ")}
                        </Typography.Paragraph>
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    <Space size={"middle"} align={"center"}>
                      <div className={"iconWrapper"}>
                        <IconSvgLocal
                          name={"IC_LANGUAGE"}
                          fill={"none"}
                          stroke={"#74767E"}
                          width={24}
                          height={24}
                        />
                      </div>

                      <div>
                        <Typography.Paragraph className={"infoTitle"}>
                          Ngôn ngữ
                        </Typography.Paragraph>
                        <Typography.Paragraph className={"infoContent"}>
                          {partnerDetail?.partner?.languages?.map((item) => item.name)
                            .join(", ")}
                        </Typography.Paragraph>
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    <Space size={"middle"} align={"center"}>
                      <div className={"iconWrapper"}>
                        <IconSvgLocal
                          name={"IC_LOCATION"}
                          fill={"#FBF6F5"}
                          width={18}
                          height={24}
                        />
                      </div>
                      <div>
                        <Typography.Paragraph className={"infoTitle"}>
                          Địa điểm
                        </Typography.Paragraph>
                        <Typography.Paragraph className={"infoContent"}>
                          {partnerDetail?.partner?.locations
                            ?.map((item) => item.name)
                            .join(", ")}
                        </Typography.Paragraph>
                      </div>
                    </Space>
                  </Col>
                </Row>

                {/* Skills */}
                <SkillsChipList
                  skills={partnerDetail.partner.skills}
                  type={"partner"}
                />

                {/* Category Services */}
                <CategoryServicesChipList
                  categories={partnerDetail.partner.categories}
                  categoryServices={partnerDetail.partner.categoryServices}
                  type={"partner"}
                />

                {/* Services */}
                <ServicesChipList
                  categories={partnerDetail.partner.categories}
                  categoryServices={partnerDetail.partner.categoryServices}
                  services={partnerDetail.partner.services}
                  type={"partner"}
                />
              </Space>

              {(partnerDetail?.partner?.description ||
                size(partnerDetail?.partner?.work_histories) > 0) && (
                <Space
                  direction={"vertical"}
                  size={40}
                  className={
                    "partnerDetailInfoContainer borderedContainer d-flex"
                  }
                >
                  {partnerDetail?.partner?.description && (
                    <div>
                      <Typography.Title className={"infoTitle"} level={4}>
                        Giới thiệu
                      </Typography.Title>
                      <div
                        className={"infoContent nm-typo"}
                        dangerouslySetInnerHTML={{
                          __html: partnerDetail?.partner?.description,
                        }}
                      />
                    </div>
                  )}
                  {size(partnerDetail.partner.work_histories) > 0 && (
                    <div>
                      <Typography.Title className={"infoTitle"} level={4}>
                        Kinh nghiệm làm việc
                      </Typography.Title>
                      <Space
                        direction={"vertical"}
                        size={"large"}
                        className={"d-flex"}
                      >
                        {map(partnerDetail.partner.work_histories,(item) => (
                          <Space
                            size={"large"}
                            key={item.workHistoryId}
                            align={"start"}
                          >
                            <div
                              className={"iconWrapper"}
                              style={{ borderRadius: "8px" }}
                            >
                              <IconSvgLocal
                                name={"IC_CITY"}
                                width={24}
                                height={24}
                              />
                            </div>
                            <div>
                              <Typography.Title
                                className={"companyName nm-typo"}
                                level={4}
                              >
                                {item.name}
                              </Typography.Title>

                              <Typography.Paragraph className={"position"}>
                                {item.position}
                              </Typography.Paragraph>

                              <Typography.Paragraph className={"workTime"}>
                                {datetimeUtils
                                  .getMoment(
                                    item.start_date,
                                    datetimeUtils.BACKEND_DATE_TIME
                                  )
                                  ?.format(
                                    datetimeUtils.LOCAL_DATE_WITHOUT_DAY
                                  )}
                                {" - "}
                                {item.end_date
                                  ? datetimeUtils
                                      .getMoment(
                                        item.end_date,
                                        datetimeUtils.BACKEND_DATE_TIME
                                      )
                                      ?.format(
                                        datetimeUtils.LOCAL_DATE_WITHOUT_DAY
                                      )
                                  : "Hiện tại"}
                              </Typography.Paragraph>

                              <div
                                className={"infoContent nm-typo"}
                                dangerouslySetInnerHTML={{
                                  __html: item.description,
                                }}
                              />
                            </div>
                          </Space>
                        ))}
                      </Space>
                    </div>
                  )}
                </Space>
              )}

              {size(partnerDetail.partner.typical_projects) > 0 && (
                <Space
                  direction={"vertical"}
                  size={40}
                  className={
                    "partnerDetailInfoContainer borderedContainer d-flex"
                  }
                >
                  {size(partnerDetail.partner.typical_projects) > 0 && (
                    <PartnerFeaturedProjectsViewSection
                      projects={partnerDetail.partner.typical_projects}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                    />
                  )}
                </Space>
              )}

              {size(partnerDetail.partner.educations) > 0 && (
                <Space
                  direction={"vertical"}
                  size={40}
                  className={
                    "partnerDetailInfoContainer borderedContainer d-flex"
                  }
                >
                  {size(partnerDetail.partner.educations) > 0 && (
                    <PartnerEducationV2
                      educations={partnerDetail.partner.educations}
                    />
                  )}
                </Space>
              )}

              {size(partnerDetail.projectCompleted) > 0 && (
                <Space
                  direction={"vertical"}
                  size={40}
                  className={
                    "partnerDetailInfoContainer borderedContainer d-flex"
                  }
                >
                  <div>
                    <Row
                      align={"top"}
                      justify={"space-between"}
                      style={{ marginBottom: "32px" }}
                    >
                      <Typography.Title
                        className={"infoTitle nm-typo"}
                        level={4}
                      >
                        Dự án đã hoàn thành
                      </Typography.Title>
                      {size(partnerDetail.projectCompleted) >
                        jobSlickSettings?.slidesToShow && (
                        <Space className={"hidden-mb"}>
                          <Button
                            onClick={() => {
                              jobSlider.current?.slickPrev();
                            }}
                            shape={"circle"}
                          >
                            <LeftOutlined />
                          </Button>

                          <Button
                            onClick={() => {
                              jobSlider.current?.slickNext();
                            }}
                            shape={"circle"}
                          >
                            <RightOutlined />
                          </Button>
                        </Space>
                      )}
                    </Row>
                    <Slider
                      {...jobSlickSettings}
                      ref={jobSlider}
                      className={"projectCompleteSlider"}
                    >
                      {partnerDetail.projectCompleted.map((job) => (
                        <JobItem data={job} key={job.jobId} />
                      ))}
                    </Slider>
                  </div>
                </Space>
              )}
            </>
            :
            <>
              <div
                className={"partnerDetailReviewsContainer borderedContainer"}
              >
                <PartnerReviews
                  partnerId={partnerDetail?.partner?.partnerId || 0}
                  isProfileDetails={false}
                />
              </div>

              <div
                className={"partnerDetailReviewsContainer borderedContainer"}
              >
                <PartnerComplain initData={partnerDetail?.complain} />
              </div>
            </>}
          </Space>

          <Space
            style={{ width: "100%", justifyContent: "flex-end", marginTop: 24 }}
          >
            <Button type="default" onClick={close}>
              Đóng
            </Button>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
});

PartnerInfoModal.displayName = "PartnerInfoModal";

export default PartnerInfoModal;

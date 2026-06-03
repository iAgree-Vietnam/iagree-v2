"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import RootLayout from "@/src/layouts/RootLayout";
import Head from "next/head";
import {
  Alert,
  Avatar,
  Breadcrumb,
  BreadcrumbProps,
  Button,
  Col,
  List,
  message,
  Modal,
  Row,
  Space,
  Steps,
  Typography,
} from "antd";
// import Slider from "@ant-design/react-slick";
import {
  HeartFilled,
  HeartOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import JobSign from "./parts/JobSign";
import JobReview from "./parts/JobReview";
import JobReport from "./parts/JobReport";
import JobPayment from "./parts/JobPayment";
import JobPartner from "./parts/JobPartner";
import { ModalizeHelperVisible } from "@/src/data/base/models/base.types";
import {
  FullJobResource,
  JobDetailInitResource,
  JobResultResource,
  PlatformFeeResponseResource,
  UserProjectBidResource,
} from "@/src/data/job/models/job.types";
import useSelectedJob from "./hooks/useSelectedJob";
import _, {
  filter,
  flatMap,
  includes,
  isEmpty,
  map,
  some,
  toNumber,
  toString,
} from "lodash";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { FullProfileResource } from "@/src/data/auth/models/types";
import Constants from "@/src/constants/Constants";
import useJobReaction from "@/src/screens/JobScreen/hooks/useJobReaction";
import JobUtils from "@/src/screens/JobScreen/JobDetailScreen/utils/JobUtils";
import useJobStep from "@/src/screens/JobScreen/JobDetailScreen/hooks/useJobStep";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import { ConstantsHelper } from "@/src/constants/ConstantsHelper";
import JobResult from "./parts/JobResult";
import { isMoment } from "moment";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { ButtonWithIcon } from "@/src/components/button";
import JobDeleteModal, {
  JobDeleteModalizeHelperVisible,
} from "./modals/JobDeteleModal";
import useJobUpdate from "../JobFormScreen/hooks/useJobUpdate";
import AuthJobRouteUtils from "@/src/data/auth/utils/AuthJobRouteUtils";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import { CategoryServicesChipList } from "../../PartnerScreen/components/CategoryServicesChipList";
import { ServicesChipList } from "../../PartnerScreen/components/ServicesChipList";
import { SkillsChipList } from "../../PartnerScreen/components/SkillsChipList";
import JobItem from "@/src/components/jobs/JobItem";
import { PrepayResource } from "@/src/data/payment/models/payment.types";
import Cookies from "js-cookie";
import ProjectBidTable from "./components/ProjectBidTable";
import useCalculateFee from "../JobApplyFormScreen/hooks/useCalculateFee";
import {
  Award,
  CalendarDays,
  MessageCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import JobServices from "@/src/data/job/services/JobServices";
import ApplyInfoTable from "./components/ApplyInfoTable";
import JobRate from "./parts/JobRate";
import moment from "moment";
import PricingRouteUtils from "@/src/data/pricing/utils/PricingRouteUtils";
import Images from "@/src/constants/Images";
import NumberUtils from "@/src/utils/NumberUtils";
import PriceUtils from "@/src/utils/PriceUtils";
import Link from "next/link";
import CancelJobModal, { UserRoleEnum } from "../modals/CancelJobModal";
import DisputeJobModal from "../modals/DisputeJobModal";
import { JobCancellationValidator } from "@/src/builder/JobCancellationValidator.service";
import useSWR from "swr";
import { CancelFlowService } from "@/src/data/cancel/CancelFlow.service";
import LiquidationTableWithActions from "./components/LiquidationTableWithActions";
import constants from "constants";
import JobItemV2 from "@/src/components/jobs/JobItemV2";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";

export interface JobDetailComponentProps {
  jobQuery: ReturnType<typeof useSelectedJob>;
  auth: Partial<FullProfileResource>;
  isCreated: boolean;
  isPartner: boolean;
  onEdit?: (resultResource: JobResultResource) => void;
  setStepName: (stepName: string) => void;
  isDesktop?: boolean;
}

const canceledStatuses = [
  Constants.JOB.STATUS.CANCEL_DANG_TUYEN,
  Constants.JOB.STATUS.CANCELED,
];

function JobDetailScreen(props: any) {
  const router = useRouter();
  const { isDesktop, isMobile } = useBreakpoint();
  const [paymentData, setPaymentData] = useState<PrepayResource | null>(null);
  // const platformFeeMutation = useCalculateFee();
  const [totalPaymentData, setTotalPaymentData] =
    useState<PlatformFeeResponseResource | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const { auth: userInfo } = useAccountContext();
  const [queryKey, setQueryKey] = useState(0);

  const applyJobRef = useRef<ModalizeHelperVisible>(null);
  const cancelJobRef = useRef<ModalizeHelperVisible>(null);
  const reportJobRef = useRef<ModalizeHelperVisible>(null);
  const disputeJobRef = useRef<ModalizeHelperVisible>(null);
  const jobDeleteModalRef = useRef<JobDeleteModalizeHelperVisible>(null);

  const isUpdateStep = useRef(false);
  const { auth: fullProfileResource, isLoggedIn } = useAccountContext();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const jobDetailInitResource: JobDetailInitResource = props.data;
  const jobQuery = useSelectedJob(
    jobDetailInitResource?.jobId,
    {
      initData: jobDetailInitResource,
    },
    queryKey
  );
  const reactionMutation = useJobReaction();

  const fullJobResource = jobQuery.data;

  const { data: dataSttCancel, isLoading: isLoadingCancelStatus } = useSWR(
    [JSON.stringify(fullJobResource?.jobId)],
    () => {
      return fullJobResource?.jobId
        ? new CancelFlowService().checkStatusCancel(fullJobResource?.jobId)
        : undefined;
    },
    {
      dedupingInterval: 10000,
    }
  );
  // ✨ Các status hủey
  const projectInfo = dataSttCancel?.data;
  const can_cancel_before_execution = projectInfo?.can_cancel_before_execution;
  const can_quick_cancel = projectInfo?.can_quick_cancel;
  const can_request_cancellation = projectInfo?.can_request_cancellation;
  const can_file_acceptance_complaint =
    projectInfo?.can_file_acceptance_complaint;
  const has_pending_cancellation = projectInfo?.has_pending_cancellation;
  const has_pending_complaint = projectInfo?.has_pending_complaint;

  // 🕒 Các mốc thời gian / Deadlines
  const hours_since_start = projectInfo?.hours_since_start;
  const days_since_delivery = projectInfo?.days_since_delivery;
  const started_at = projectInfo?.started_at;
  const delivered_at = projectInfo?.delivered_at;
  const quick_cancel_deadline = projectInfo?.quick_cancel_deadline;
  const acceptance_complaint_deadline =
    projectInfo?.acceptance_complaint_deadline;
  const show2button =
    can_cancel_before_execution ||
    can_quick_cancel ||
    can_request_cancellation ||
    can_file_acceptance_complaint ||
    has_pending_cancellation ||
    has_pending_complaint;

  // ✨ Gợi ý hành động
  const suggested_action = projectInfo?.suggested_action; // 1. Phân tích cú pháp ngày tạo
  const isValidUser =
    fullProfileResource &&
    fullProfileResource?.userId &&
    fullProfileResource?.fullName;
  const isActuallyLoggedIn = isLoggedIn && isValidUser;

  const {
    stepIndex,
    onChangeStepIndex,
    stepName,
    setStepName,
    setCurrentStepIndex,
    steps,
    isCreated,
    isPartner,
  } = useJobStep(fullProfileResource, fullJobResource as FullJobResource);

  // const validator1 = new JobCancellationValidator(fullJobResource, isPartner);
  const validator1 = new JobCancellationValidator(
    jobDetailInitResource,
    isPartner
  );
  const step = validator1.validate();

  const isProcessingPartner = useMemo(
    () => fullProfileResource?.partner?.status === Constants.PARTNER.CHO_DUYET,
    [fullProfileResource]
  );

  const isRejectPartner = useMemo(
    () => fullProfileResource?.partner?.status === Constants.PARTNER.TU_CHOI,
    [fullProfileResource]
  );

  // const jobUpdateMutation = useJobUpdate(fullJobResource as FullJobResource);

  const isShowApply =
    !isCreated &&
    // isActuallyLoggedIn &&
    [
      Constants.JOB.STATUS.DUYET_DANG_TUYEN,
      Constants.JOB.STATUS.CHO_UNG_TUYEN,
    ].includes(fullJobResource?.status || 0) &&
    (fullJobResource?.postingEndDate === null ||
      !moment(
        fullJobResource?.postingEndDate,
        datetimeUtils.LOCAL_DATE
      ).isBefore(moment(), "day"));

  // New function to determine whether to show Steps UI or Job Overview
  const shouldShowStepsUI = () => {
    if (!isActuallyLoggedIn) {
      return false;
    }

    if (isRejectedPartner) {
      return false;
    }

    if (!isCreated && !isPartner) {
      return false;
    }

    const stepsStatuses = [
      isCreated ? Constants.JOB.STATUS.DUYET_DANG_TUYEN : 999,
      isCreated ? Constants.JOB.STATUS.CHO_UNG_TUYEN : 999,
      // Constants.JOB.STATUS.CHO_UNG_TUYEN,
      Constants.JOB.STATUS.CHO_KY_HOP_DONG,
      Constants.JOB.STATUS.DA_KY_HOP_DONG,
      Constants.JOB.STATUS.DA_NGHIEM_THU,
      Constants.JOB.STATUS.DUYET_HOAN_THANH_CV,
      Constants.JOB.STATUS.CHO_NGHIEM_THU,
      Constants.JOB.STATUS.TAM_UNG_THANH_TOAN,
      Constants.JOB.STATUS.CHO_TAT_TOAN,
      Constants.JOB.STATUS.THANH_TOAN_PARTNER,
      Constants.JOB.STATUS.CANCEL_DANG_TUYEN,
      Constants.JOB.STATUS.CANCELED,
      Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN,
    ];

    const currentStatus = fullJobResource?.status || 0;

    // If status not in steps list, show Job Overview
    if (!stepsStatuses.includes(currentStatus)) {
      return false;
    }

    // Other statuses -> show Steps UI normally
    return true;
  };

  useEffect(() => {
    if (!fullJobResource || !fullProfileResource) return () => undefined;
    if (isUpdateStep.current) return () => undefined;

    let stepName = Constants.JOB.TAB.JOB_INFO;
    let stepIndex = 0;
    if (isCreated) {
      stepName = JobUtils.getCreateActiveStepName(fullJobResource);
      stepIndex = JobUtils.getCreateActiveStepIndex(stepName);
    }

    if (isPartner) {
      stepName = JobUtils.getPartnerActiveStepName(fullJobResource);
      stepIndex = JobUtils.getPartnerActiveStepIndex(stepName);
    }

    setStepName(stepName);
    setCurrentStepIndex(stepIndex);
    isUpdateStep.current = true;
  }, [
    fullJobResource,
    fullProfileResource,
    isCreated,
    isPartner,
    isUpdateStep,
  ]);

  const jobRelatedSlideItems = useMemo(
    () =>
      _.chunk(
        jobDetailInitResource?.projectRelated,
        isDesktop ? 4 : isMobile ? 1 : 2
      ),
    [jobDetailInitResource, isDesktop, isMobile]
  );

  const jobSlickSettings = {
    arrows: false,
    dots: true,
    infinite: true,
    centerMode: !!isMobile,
    centerPadding: "28px",
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const breadcrumbsItem = useMemo(() => {
    const items: BreadcrumbProps["items"] = [
      {
        title: (
          <>
            <IconSvgLocal name={"IC_HOME"} />
            <span>Trang chủ</span>
          </>
        ),
        href: "/",
      },
      { title: "Công việc", href: JobRouteUtils.toJobsSearchScreen({}) },
    ];
    // if (isCreated) {
    //   items.push({
    //     title: "Công việc đăng tuyển",
    //     href: AuthJobRouteUtils.toManagementUrl(),
    //   });
    // }
    // if (isPartner) {
    //   items.push({
    //     title: "Công việc ứng tuyển",
    //     href: AuthJobRouteUtils.toApplyUrl(),
    //   });
    // }
    items.push({ title: fullJobResource?.name });
    return items;
  }, [fullJobResource, isCreated, isPartner]);

  if (!isMounted) return <></>;

  const updateDate = datetimeUtils.getMoment(
    fullJobResource?.updatedDate || "",
    datetimeUtils.LOCAL_DATE
  );

  const jobStatusTitle = ConstantsHelper.getJobStatusTitle(
    fullJobResource?.status || 0,
    isPartner
  );

  const getJobDeadline = () => {
    let jobDurationType = "";
    if (fullJobResource?.jobDurationType === Constants.JOB.DURATION_TYPE.DAYS) {
      jobDurationType = "Ngày";
    } else if (
      fullJobResource?.jobDurationType === Constants.JOB.DURATION_TYPE.WEEKS
    ) {
      jobDurationType = "Tuần";
    } else if (
      fullJobResource?.jobDurationType === Constants.JOB.DURATION_TYPE.MONTHS
    ) {
      jobDurationType = "Tháng";
    }

    if (fullJobResource?.duration && jobDurationType) {
      return `${fullJobResource.duration} ${jobDurationType}`;
    }

    if (
      (!fullJobResource?.duration || !jobDurationType) &&
      fullJobResource?.startDate &&
      fullJobResource?.endDate
    ) {
      const startDate = fullJobResource.startDate;
      const endDate = fullJobResource.endDate;

      if (startDate && endDate) {
        return `${startDate} - ${endDate}`;
      }
    }

    return "Chưa xác định";
  };

  const hasApplied =
    !!fullProfileResource &&
    (fullJobResource?.userProjectBids?.some(
      (bid) => toString(bid?.userId) === toString(fullProfileResource?.userId)
    ) ||
      !_.isNull(fullJobResource?.bid));

  const actions = [
    { label: "Đồng ý", status: 1 as 1 },
    { label: "Từ chối", status: 0 as 0 },
  ];

  // ===== Handlers =====
  const confirmBid = async (status: 1 | 0) => {
    try {
      await jobService.confirmBid({
        status,
        jobId: toString(fullJobResource?.jobId),
      });
      setQueryKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplyClick = () => {
    // if (!fullProfileResource) {
    //   router.push(AuthRouteUtils.toLogin()).then(() => null);
    //   return message.error("Vui lòng đăng nhập để thực hiện ứng tuyển");
    // }

    if (isProcessingPartner) {
      return message.error(
        "Đơn đăng ký trở thành đối tác của bạn đang được iAgree phê duyệt."
      );
    }

    if (!isActuallyLoggedIn) {
      Cookies.set(
        "JOB_DETAIL_PAGE",
        JobRouteUtils.toDetailUrl(fullJobResource!)
      );
      router.push(AuthRouteUtils.toLogin()).then(() => null);
      return message.error("Để ứng tuyển, bạn phải là đối tác của iAgree.");
    }

    const notPartnerYet = isRejectPartner || !fullProfileResource?.partner;
    if (notPartnerYet) {
      Cookies.set(
        "JOB_DETAIL_PAGE",
        JobRouteUtils.toDetailUrl(fullJobResource!)
      );
      router
        .push(PartnerRouteUtils.toPartnerRegisterGetStart())
        .then(() => null);
      return message.error(
        "Để ứng tuyển, bạn phải đăng ký trở thành đối tác của iAgree."
      );
    }

    if (!_.isNull(fullJobResource?.bid)) {
      return message.error("Bạn đã ứng tuyển công việc này").then(() => null);
    }

    router.push(JobRouteUtils.toApplyUrl(fullJobResource!));
  };
  const isOver24Hours = datetimeUtils.isTimeExceeds(24, hours_since_start);

  const step1 = can_cancel_before_execution;

  const step2 = !isOver24Hours && can_request_cancellation;
  // step gửi hủy & thương lượng
  const step3 = isOver24Hours && can_request_cancellation;

  // const step1 = can_cancel_before_execution;

  // const isShowCancelButton =!isCancel &&   (!isPartner && (step1 || step2)) ;
  // const isShowDisputeButton =
  //   !isCancel && (!isPartner && (step1 || step2)) || (!step1 || !step2);
  const isShowCancelButton = true,
    isShowDisputeButton = true;

  const StepUI = () => {
    return (
      <div
        className={"jobStepControlContainer"}
        style={{
          opacity: [
            Constants.JOB.STATUS.CANCEL_DANG_TUYEN,
            Constants.JOB.STATUS.CANCELED,
          ].includes(fullJobResource!?.status)
            ? "0.5"
            : "1",
        }}
      >
        <Steps
          current={stepIndex}
          onChange={onChangeStepIndex}
          size={"small"}
          labelPlacement="vertical"
          items={steps as any}
          className={`jobSteps ${[
            Constants.JOB.STATUS.CANCEL_DANG_TUYEN,
            Constants.JOB.STATUS.CANCELED,
          ].includes(fullJobResource!?.status)
            ? "canceled"
            : ""
            }`}
          key={"title"}
        />

        <div
          style={{
            width: "100%",
            margin: "auto",
            marginTop: "10px",
          }}
        >
          <Alert
            message={
              "Nhấp vào các bước đã hoàn thành để xem lại thông tin chi tiết."
            }
            type="info"
            showIcon
          // style={{ width: "max-content" }}
          />
        </div>
      </div>
    );
  };

  const isAssignJobToPartner = some(
    fullJobResource?.userProjectBids,
    (it: UserProjectBidResource) =>
      it.status == toNumber(Constants.PARTNER.STATUS_APPLY_KEY.INVITED) &&
      it.userId === userInfo?.userId
  );

  const isPartnerRejectJob = some(
    fullJobResource?.userProjectBids,
    (it: UserProjectBidResource) =>
      it.status ==
      toNumber(Constants.PARTNER.STATUS_APPLY_KEY.PARTNER_REJECT) &&
      it.userId === userInfo?.userId
  );

  const isRejectedPartner = some(
    fullJobResource?.userProjectBids,
    (it: UserProjectBidResource) =>
      it.status == toNumber(Constants.PARTNER.STATUS_APPLY_KEY.REJECTED) &&
      it.userId === userInfo?.userId
  );

  const jobService = new JobServices();

  const isShowBuyConnectsButton = (() => {
    return (
      fullProfileResource?.userId != fullJobResource?.createdByUserId &&
      fullProfileResource?.partner?.opportunity_wallet?.current_balance! <
      fullJobResource?.connect!
    );
  })();

  const handleBuyConnectsButtonClick = () => {
    router.push(PricingRouteUtils.toScreen());
  };

  const clientInfo = fullJobResource?.userCreatedProject;

  const DescribeForm = () => {
    const [previewModal, setPreviewModal] = useState({
      visible: false,
      fileUrl: "",
      fileName: "",
      fileType: "",
    });

    const getFileIconAndColor = (fileName: string) => {
      const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

      if (fileExtension === "pdf") {
        return { icon: <FilePdfOutlined />, color: "#FF4D4F" };
      } else if (fileExtension === "doc" || fileExtension === "docx") {
        return { icon: <FileWordOutlined />, color: "#1890FF" };
      } else if (fileExtension === "xls" || fileExtension === "xlsx") {
        return { icon: <FileExcelOutlined />, color: "#52C41A" };
      } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
        return { icon: <FileImageOutlined />, color: "#FAAD14" };
      } else {
        return { icon: <FileOutlined />, color: "#BFBFBF" };
      }
    };

    const PREVIEWABLE_EXTENSIONS = [
      "pdf",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "doc",
      "docx",
    ];

    // Xử lý sự kiện mở Modal xem trước
    const handlePreview = (url: string, fileName: string) => {
      const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
      setPreviewModal({
        visible: true,
        fileUrl: url,
        fileName,
        fileType: fileExtension,
      });
    };

    // Xử lý sự kiện tải xuống tệp với Modal xác nhận
    const handleDownload = (url: string, fileName: string) => {
      Modal.confirm({
        title: "Xác nhận tải xuống",
        content: `Bạn có chắc chắn muốn tải tệp "${fileName}" xuống không?`,
        okText: "Tải xuống",
        cancelText: "Hủy",
        onOk() {
          window.open(url, "_blank");
        },
      });
    };

    const renderPreviewContent = () => {
      if (["pdf", "doc", "docx"].includes(previewModal.fileType)) {
        const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
          previewModal.fileUrl
        )}&embedded=true`;
        return (
          <iframe
            src={googleViewerUrl}
            width="100%"
            height="100%"
            style={{ border: "none", minHeight: "60vh" }}
            title={previewModal.fileName}
          />
        );
      } else if (
        ["jpg", "jpeg", "png", "gif"].includes(previewModal.fileType)
      ) {
        return (
          <div style={{ textAlign: "center" }}>
            <img
              src={previewModal.fileUrl}
              alt={previewModal.fileName}
              style={{ maxWidth: "100%", maxHeight: "70vh" }}
            />
          </div>
        );
      }
      return <Typography.Text>Không thể xem trước tệp này.</Typography.Text>;
    };

    return (
      <div
        style={{
          marginTop: "40px",
        }}
        className={"jobHeaderContainer"}
      >
        <Row gutter={[40, 40]}>
          <Col xs={24} lg={isShowApply ? 16 : 16}>
            <div className={" "}>
              <Typography.Text
                className={"jobDetailTitle"}
                style={{
                  color: "#25272D",
                  fontSize: "24px",
                  fontWeight: 500,
                  lineHeight: "normal",
                  rowGap: "12px",
                  display: "flex",
                  marginBottom: "24px",
                }}
              >
                Mô tả công việc
              </Typography.Text>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "normal",
                  letterSpacing: "-0.176px",
                  marginTop: "16px",
                  marginBottom: "20px",
                }}
                dangerouslySetInnerHTML={{
                  __html: fullJobResource?.description || "",
                }}
              ></div>{" "}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: !isMobile ? "1fr 1fr" : "1fr", // 2 cột bằng nhau
                  columnGap: "24px", // khoảng cách cột
                  rowGap: "16px", // khoảng cách hàng (nếu xuống dòng)
                }}
              >
                <Col xs={24} md={24}>
                  <Space size={"middle"} align={"center"}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div className={"iconWrapper"}>
                        <IconSvgLocal name={"IC_BAG"} width={24} height={24} />
                      </div>

                      <div className="">
                        <Typography.Paragraph
                          style={{
                            marginBottom: 0,
                          }}
                          className={" infoContent"}
                        >
                          Lĩnh vực:
                        </Typography.Paragraph>
                        <Typography.Paragraph
                          style={{ marginBottom: 0 }}
                          className={" !mb-0"}
                        >
                          {fullJobResource?.categories
                            ?.map((item) => item.name)
                            .join(", ")}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </Space>
                </Col>

                <Col xs={24} md={24}>
                  <Space size={"middle"} align={"center"}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div className={"iconWrapper"}>
                        <IconSvgLocal
                          name={"IC_MONEY_BAG"}
                          width={24}
                          height={24}
                        />
                      </div>

                      <div className="">
                        <Typography.Paragraph
                          style={{
                            marginBottom: 0,
                          }}
                          className={" infoContent"}
                        >
                          Thù lao công việc
                        </Typography.Paragraph>
                        <Typography.Paragraph
                          style={{ marginBottom: 0 }}
                          className={" !mb-0"}
                        >
                          {JobParseUtils.renderSalaryText(fullJobResource!)}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </Space>
                </Col>

                <Col xs={24} md={24}>
                  <Space size={"middle"} align={"center"}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div className={"iconWrapper"}>
                        <IconSvgLocal
                          name={"IC_CALENDAR"}
                          fill={"none"}
                          stroke={"#25272D"}
                          width={24}
                          height={24}
                        />
                      </div>

                      <div className="">
                        <Typography.Paragraph
                          style={{
                            marginBottom: 0,
                          }}
                          className={" infoContent"}
                        >
                          Thời gian thực hiện công việc
                        </Typography.Paragraph>
                        <Typography.Paragraph
                          style={{ marginBottom: 0 }}
                          className={" !mb-0"}
                        >
                          {getJobDeadline()}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </Space>
                </Col>

                <Col xs={24} md={24}>
                  <Space size={"middle"} align={"center"}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div className={"iconWrapper"}>
                        <IconSvgLocal
                          name={"IC_CLOCK"}
                          fill={"none"}
                          stroke={"#25272D"}
                          width={24}
                          height={24}
                        />
                      </div>

                      <div className="">
                        <Typography.Paragraph
                          style={{
                            marginBottom: 0,
                          }}
                          className={" infoContent"}
                        >
                          Thời hạn ứng tuyển
                        </Typography.Paragraph>

                        <Typography.Paragraph
                          style={{
                            marginBottom: 0,
                            color: (() => {
                              if (!fullJobResource?.postingEndDate)
                                return undefined;

                              const currentDate = moment().startOf("day");
                              const postingEndDate = moment(
                                fullJobResource.postingEndDate,
                                datetimeUtils.LOCAL_DATE
                              ).startOf("day");

                              if (!postingEndDate.isValid()) return undefined;

                              if (postingEndDate.isSame(currentDate))
                                return "#f97316";
                              if (postingEndDate.isBefore(currentDate))
                                return "#dc2626";

                              return undefined; // Default color for future dates
                            })(),
                          }}
                          className={" !mb-0"}
                        >
                          {(() => {
                            if (!fullJobResource?.postingEndDate)
                              return "Không xác định";

                            const currentDate = moment().startOf("day");
                            const postingEndDate = moment(
                              fullJobResource.postingEndDate,
                              datetimeUtils.LOCAL_DATE
                            ).startOf("day");

                            if (!postingEndDate.isValid()) {
                              return fullJobResource.postingEndDate;
                            }

                            if (postingEndDate.isSame(currentDate)) {
                              return "Hôm nay là hạn cuối";
                            } else if (postingEndDate.isBefore(currentDate)) {
                              return "Hết hạn ứng tuyển";
                            } else {
                              return fullJobResource.postingEndDate;
                            }
                          })()}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </Space>
                </Col>
              </div>
              {fullJobResource?.skills &&
                fullJobResource?.skills.length > 0 && (
                  <div style={{ margin: "20px 0 10px" }}>
                    <SkillsChipList
                      skills={fullJobResource?.skills || null}
                      type={"job"}
                    />
                  </div>
                )}
              {fullJobResource?.categoryServices &&
                fullJobResource?.categoryServices.length > 0 && (
                  // <Row gutter={[24, 24]} style={{ marginTop: "20px" }}>
                  <div style={{ margin: "20px 0 10px" }}>
                    <CategoryServicesChipList
                      categories={fullJobResource?.categories || null}
                      categoryServices={
                        fullJobResource?.categoryServices || null
                      }
                      type={"job"}
                    />
                  </div>
                )}
              {fullJobResource?.services &&
                fullJobResource?.services.length > 0 && (
                  // <Row gutter={[24, 24]} style={{ marginTop: "20px" }}>
                  <div style={{ margin: "20px 0 10px" }}>
                    <ServicesChipList
                      categories={fullJobResource?.categories || null}
                      categoryServices={
                        fullJobResource?.categoryServices || null
                      }
                      services={fullJobResource?.services || null}
                      type={"job"}
                    />
                  </div>
                )}
            </div>

            <div>
              <div style={{ marginTop: 24 }} className={""}>
                <div
                  className="jobPartTitleContainer"
                  style={{ marginBottom: 20 }}
                >
                  <div className="jobPartTitle">
                    Số lần nghiệm thu: {fullJobResource?.numberAccept}
                  </div>
                </div>

                {fullJobResource?.deliverableAttachments && (
                  <div style={{ display: "flex", gap: "4px" }}>
                    <div className="jobPartTitle">
                      Sản phẩm đầu ra mong muốn:
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "normal",
                        letterSpacing: "-0.176px",
                        // marginBottom: "40px",
                        color: "gray",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: fullJobResource?.deliverableAttachments || "",
                      }}
                    />
                  </div>
                )}

                {fullJobResource?.projectAttachmentFiles &&
                  fullJobResource.projectAttachmentFiles.length > 0 && (
                    <div style={{ marginTop: !fullJobResource?.note ? 20 : 0 }}>
                      <div className="jobPartTitleContainer">
                        <div className="jobPartTitle">Tệp đính kèm</div>
                      </div>
                      <div
                        style={{
                          marginTop: 20,
                        }}
                        className="jobPartContentContainer"
                      >
                        <List style={{ listStyleType: "none", padding: 0 }}>
                          {fullJobResource?.projectAttachmentFiles?.map(
                            (attachment, index) => {
                              const { icon, color } = getFileIconAndColor(
                                attachment.fileName
                              );
                              const fileExtension =
                                attachment.fileName
                                  .split(".")
                                  .pop()
                                  ?.toLowerCase() || "";
                              const canPreview =
                                PREVIEWABLE_EXTENSIONS.includes(fileExtension);

                              return (
                                <List.Item
                                  key={index}
                                  style={{
                                    marginBottom: 16,
                                  }}
                                >
                                  <div
                                    style={{
                                      border: "1px solid #d9d9d9",
                                      borderRadius: "8px",
                                      paddingInline: "24px",
                                      paddingBlock: "16px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      gap: 16,
                                    }}
                                  >
                                    <Space size={"middle"}>
                                      <div style={{ color, fontSize: 24 }}>
                                        {icon}
                                      </div>
                                      <Space
                                        direction="vertical"
                                        size={0}
                                        style={{ marginLeft: 4 }}
                                      >
                                        <Typography.Text>
                                          {attachment.fileName}
                                        </Typography.Text>
                                      </Space>
                                    </Space>
                                    <div>
                                      {canPreview && (
                                        <Link
                                          href={attachment.fileUrl}
                                          target="_blank"
                                        >
                                          <EyeOutlined
                                            style={{
                                              // marginRight: 20,
                                              flex: 1,
                                              cursor: "pointer",
                                            }}
                                          // onClick={() =>
                                          // handlePreview(
                                          //   attachment.fileUrl,
                                          //   attachment.fileName
                                          // )
                                          // router.push(
                                          // )
                                          // }
                                          />
                                        </Link>
                                      )}
                                      {/* <Link
                                        href={attachment?.fileUrl}
                                        // download={`${attachment.fileName}`}
                                        target="_blank"
                                        download
                                        rel="noopener noreferrer"
                                      >
                                        <DownloadOutlined
                                          style={{ cursor: "pointer" }}
                                          // onClick={() =>
                                          //   handleDownload(
                                          //     attachment.fileUrl,
                                          //     attachment.fileName
                                          //   )
                                          // }
                                        />
                                      </Link> */}
                                    </div>
                                  </div>
                                </List.Item>
                              );
                            }
                          )}
                        </List>
                      </div>
                    </div>
                  )}
              </div>

              {/* --- Phần Tệp đính kèm --- */}

              {/* Modal xem trước tệp */}
              <Modal
                title={previewModal.fileName}
                open={previewModal.visible}
                onCancel={() =>
                  setPreviewModal({ ...previewModal, visible: false })
                }
                footer={null}
                width={800}
                style={{ top: 20 }}
              >
                {renderPreviewContent()}
              </Modal>
            </div>
          </Col>

          {
            // isShowApply && (
            <Col xs={24} lg={8}>
              {/* Nếu khách hàng giao việc trực tiếp cho bạn */}
              {isAssignJobToPartner && (
                <>
                  <Alert
                    message="Khách hàng đã gửi công việc này cho bạn"
                    type="info"
                    showIcon
                    className="jobApplyAlert"
                    description={
                      <div style={{ marginTop: 8 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "center",
                          }}
                        >
                          {actions.map((action) => (
                            <Button
                              key={action.status}
                              onClick={() => confirmBid(action.status)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </>
              )}

              {isPartnerRejectJob && (
                <Alert
                  message="Bạn đã từ chối công việc này"
                  type="error"
                  showIcon
                  className="partnerRejectJobAlert"
                />
              )}

              {isRejectedPartner && (
                <Alert
                  message="Khách hàng đã từ chối đơn ứng tuyển của bạn"
                  type="error"
                  showIcon
                  className="partnerRejectJobAlert"
                />
              )}

              {/* Nếu bạn đã ứng tuyển */}
              {!isAssignJobToPartner &&
                hasApplied &&
                !isPartnerRejectJob &&
                !isRejectedPartner && (
                  <Alert
                    message="Bạn đã ứng tuyển công việc này"
                    type="success"
                    showIcon
                    className="jobApplyAlert"
                  />
                )}

              {/* Nếu chưa ứng tuyển */}
              {!isAssignJobToPartner && !hasApplied && (
                <div className="jobApplyContainer">
                  {isShowConnects && (
                    <Typography.Title className="hintText" level={4}>
                      Số Cơ Hội đang có:{" "}
                      <span style={{ color: "#09993E" }}>
                        {fullProfileResource?.partner?.opportunity_wallet
                          ?.current_balance ?? 0}{" "}
                        Cơ hội
                      </span>
                    </Typography.Title>
                  )}

                  {isShowBuyConnectsButton && (
                    <div
                      style={{
                        borderBottom: "1px solid gray",
                        marginBottom: "10px",
                      }}
                    >
                      <Typography.Title
                        className="hintText"
                        level={4}
                        style={{ color: "red", marginBlock: "10px" }}
                      >
                        Không đủ Cơ Hội để ứng tuyển
                      </Typography.Title>

                      <Button
                        block
                        type="primary"
                        size="large"
                        onClick={handleBuyConnectsButtonClick}
                        style={{ marginBottom: "10px" }}
                      >
                        Mua Cơ Hội
                      </Button>
                    </div>
                  )}

                  {isShowConnects && (
                    <Typography.Title className="hintText" level={4}>
                      Số Cơ Hội cần để ứng tuyển
                      <br />
                      <span style={{ color: "#09993E" }}>
                        {fullJobResource?.connect} Cơ Hội
                      </span>
                    </Typography.Title>
                  )}

                  {isShowApply && !isShowBuyConnectsButton && (
                    <Button
                      block
                      type="primary"
                      size="large"
                      onClick={handleApplyClick}
                    >
                      Ứng tuyển
                    </Button>
                  )}

                  {/* --- Thông tin nhà tuyển dụng --- */}
                  <Card
                    style={{
                      borderRadius: 8,
                      overflow: "hidden",
                      marginTop: 20,
                    }}
                  >
                    <CardHeader>
                      <CardTitle
                        style={{
                          color: "#000",
                          fontSize: 18,
                          fontWeight: 600,
                          paddingBottom: 5,
                        }}
                      >
                        Về khách hàng
                      </CardTitle>
                    </CardHeader>

                    <CardContent
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      }}
                    >
                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      />

                      {/* Company */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            backgroundColor: "#09993E20",
                            borderRadius: 9999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Avatar
                            src={
                              clientInfo?.user.avatar || Images.ACCOUNT_DEFAULT
                            }
                            size={"large"}
                            alt={"avatar"}
                            className={"customerAvatar"}
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div>
                          <p style={{ fontWeight: 500, color: "#000" }}>
                            {clientInfo?.user.userName}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      {clientInfo?.userReview.avgRate! > 0 && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                style={{
                                  width: 20,
                                  height: 20,
                                  fill:
                                    star <= clientInfo?.userReview.avgRate!
                                      ? "#facc15"
                                      : "none",
                                  color:
                                    star <= clientInfo?.userReview.avgRate!
                                      ? "#facc15"
                                      : "#d1d5db",
                                }}
                              />
                            ))}
                          </div>
                          <span
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              color: "#000",
                            }}
                          >
                            {NumberUtils.display(
                              clientInfo?.userReview.avgRate
                            )}
                          </span>
                          <span style={{ fontSize: 14, color: "#666" }}>
                            ({clientInfo?.userReview.total} đánh giá)
                          </span>
                        </div>
                      )}

                      {/* Hire Count */}
                      {clientInfo?.totalJobs! > 0 && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <Award
                            style={{ width: 20, height: 20, color: "#09993E" }}
                          />
                          <div>
                            <p style={{ fontWeight: 500, color: "#000" }}>
                              Số công việc đã thuê thành công
                            </p>
                            <p
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#09993E",
                              }}
                            >
                              {clientInfo?.totalJobs} công việc
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Response Speed */}
                      {clientInfo?.replyChat !== null && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <MessageCircle
                            style={{ width: 20, height: 20, color: "#0ea5e9" }}
                          />
                          <div>
                            <p style={{ fontWeight: 500, color: "#000" }}>
                              Tốc độ phản hồi
                            </p>
                            <p style={{ color: "#000" }}>
                              Trong vòng {clientInfo?.replyChat}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Total Spent */}
                      {clientInfo?.totalSpent.totalSpent! > 0 && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <TrendingUp
                            style={{ width: 20, height: 20, color: "#f97316" }}
                          />
                          <div>
                            <p style={{ fontWeight: 500, color: "#000" }}>
                              Tổng tiền chi trên iAgree
                            </p>
                            <p
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#f97316",
                              }}
                            >
                              {PriceUtils.displayVND(
                                clientInfo?.totalSpent.totalSpent
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </Col>
            // )
          }
        </Row>
      </div>
    );
  };

  const isWaitingApply =
    toString(fullJobResource?.status) ===
    toString(Constants.JOB.STATUS.CHO_UNG_TUYEN);

  const isUserApply = includes(
    map(fullJobResource?.userProjectBids, (it) => it?.userId),
    fullProfileResource?.userId
  );

  const isInvitedPartner = useMemo(() => {
    return fullJobResource?.userProjectBids.some(
      (bid: UserProjectBidResource) =>
        bid.bidType === Constants.JOB.BID.TYPE.INVITED &&
        bid.userId === fullProfileResource?.userId
    );
  }, [fullJobResource?.userProjectBids, fullProfileResource?.userId]);

  const isShowConnects =
    fullProfileResource?.partner &&
    fullProfileResource?.userId !== fullJobResource?.createdByUserId;
  const shouldShowStepsUIRes = shouldShowStepsUI();

  const currentDate = moment();

  const shouldShowReportButton = (() => {
    const allowedStatusesForReport = [
      Constants.JOB.STATUS.DUYET_DANG_TUYEN,
      Constants.JOB.STATUS.CHO_UNG_TUYEN,
    ];

    return (
      allowedStatusesForReport.includes(fullJobResource?.status || 0) &&
      !isCreated
    );
  })();

  const shouldShowLikeButton = (() => {
    const allowedStatusesForLike = [
      Constants.JOB.STATUS.DUYET_DANG_TUYEN,
      Constants.JOB.STATUS.CHO_UNG_TUYEN,
    ];

    return (
      allowedStatusesForLike.includes(fullJobResource?.status || 0) &&
      !isCreated
    );
  })();

  const shouldShowDisputeButton = (() => {
    if (fullJobResource?.status === Constants.JOB.STATUS.CHO_NGHIEM_THU) {
      return false;
    }

    const conditionA =
      fullJobResource?.numberAcceptRemaining! <= 0 &&
      fullJobResource?.status === Constants.JOB.STATUS.DA_KY_HOP_DONG;

    const endDate = moment(fullJobResource?.endDate);
    const conditionB =
      endDate.isValid() &&
      endDate.isSameOrAfter(currentDate) &&
      fullJobResource?.status === Constants.JOB.STATUS.DA_KY_HOP_DONG;

    return conditionA || conditionB;
    // return true
  })();

  const shouldShowCancelButton = (() => {
    if (isPartner) {
      const allowedStatusesForPartnerCancel = [
        Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN,
        Constants.JOB.STATUS.DA_KY_HOP_DONG,
      ];

      return allowedStatusesForPartnerCancel.includes(
        fullJobResource?.status || 0
      );
    }

    if (isCreated) {
      if (fullJobResource?.status === Constants.JOB.STATUS.CHO_NGHIEM_THU) {
        return false;
      }

      if (fullJobResource?.histories && fullJobResource.histories.length > 0) {
        return false;
      }

      return true;
    }

    return false;
  })();

  const getCancelButtonText = () => {
    if (isCreated) {
      return "Hủy công việc";
    }

    if (isPartner) {
      return " Hủy hợp đồng";
    }

    return "Hủy";
  };

  return (
    <RootLayout>
      {/* <Head>
        <title>{`Công việc ${fullJobResource?.name}`}</title>
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

      <section className={"breadcrumbContainer"}>
        <div className="contentWrapper">
          <Breadcrumb items={breadcrumbsItem} />
        </div>
      </section>

      <section className={"sectionContainer jobDetailSectionContainer"}>
        <div className={"contentWrapper"}>
          {(() => {
            if (
              !isActuallyLoggedIn &&
              !isCreated &&
              !isPartner &&
              fullJobResource?.isExpired === true
            ) {
              return (
                <Space style={{ marginBottom: "10px" }}>
                  <div
                    className={"jobStatusContainer"}
                    style={{
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                      borderColor: "#ff4d4f",
                      width: "auto",
                      minWidth: "94px",
                      padding: "0 8px",
                      borderRadius: "4px",
                    }}
                  >
                    Hết hạn
                  </div>
                </Space>
              );
            }

            if (isCreated || isPartner) {
              return (
                <Space style={{ marginBottom: "10px" }}>
                  <div
                    className={"jobStatusContainer"}
                    style={{
                      backgroundColor: jobStatusTitle.bgColor,
                      color: jobStatusTitle.color,
                      borderColor:
                        jobStatusTitle.borderColor || jobStatusTitle.bgColor,
                      width: "auto",
                      minWidth: "94px",
                      padding: "0 8px",
                    }}
                  >
                    {jobStatusTitle.name}
                  </div>
                </Space>
              );
            }

            if (!isActuallyLoggedIn) {
              if (canceledStatuses.includes(fullJobResource?.status || 0)) {
                return (
                  <Space style={{ marginBottom: "10px" }}>
                    <div
                      className={"jobStatusContainer"}
                      style={{
                        backgroundColor: jobStatusTitle.bgColor,
                        color: jobStatusTitle.color,
                        borderColor:
                          jobStatusTitle.borderColor || jobStatusTitle.bgColor,
                        width: "auto",
                        minWidth: "94px",
                        padding: "0 8px",
                      }}
                    >
                      {jobStatusTitle.name}
                    </div>
                  </Space>
                );
              }
              return null;
            }

            if (isActuallyLoggedIn) {
              const visibleStatuses = [
                Constants.JOB.STATUS.DUYET_DANG_TUYEN,
                Constants.JOB.STATUS.CHO_UNG_TUYEN,
                Constants.JOB.STATUS.CANCEL_DANG_TUYEN,
                Constants.JOB.STATUS.CANCELED,
              ];

              if (visibleStatuses.includes(fullJobResource?.status || 0)) {
                return (
                  <Space style={{ marginBottom: "10px" }}>
                    <div
                      className={"jobStatusContainer"}
                      style={{
                        backgroundColor: jobStatusTitle.bgColor,
                        color: jobStatusTitle.color,
                        borderColor:
                          jobStatusTitle.borderColor || jobStatusTitle.bgColor,
                        width: "auto",
                        minWidth: "94px",
                        padding: "0 8px",
                      }}
                    >
                      {jobStatusTitle.name}
                    </div>
                  </Space>
                );
              }
              return null;
            }

            return null;
          })()}

          {/* {(isCreated || isPartner) && (
            <Space style={{ marginBottom: "10px" }}>
              <div
                className={"jobStatusContainer"}
                style={{
                  backgroundColor: jobStatusTitle.bgColor,
                  color: jobStatusTitle.color,
                  borderColor:
                    jobStatusTitle.borderColor || jobStatusTitle.bgColor,
                  width: "auto",
                  minWidth: "94px",
                  padding: "0 8px",
                }}
              >
                {jobStatusTitle.name}
              </div>
            </Space>
          )} */}

          <Row
            justify={"space-between"}
            align={{ xs: "top", md: "middle" }}
            gutter={[8, 8]}
            wrap={false}
          >
            <Col>
              <Typography.Title className={"sectionTitle !mb-5"} level={4}>
                {fullJobResource?.name}
              </Typography.Title>

              {[
                Constants.JOB.STATUS.DA_KY_HOP_DONG,
                Constants.JOB.STATUS.CHO_NGHIEM_THU,
              ].includes(fullJobResource!?.status) ? (
                <div
                  style={{
                    ...(isMobile ? {} : { display: "flex" }),
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "8px",
                    color: "#059669",
                  }}
                >
                  <div style={{ fontSize: "17px" }}>
                    <CalendarDays
                      style={{
                        width: 16,
                        height: 16,
                        marginRight: "4px",
                      }}
                      className="w-4 h-4 mr-2"
                    />
                    Thời gian thực hiện: {fullJobResource?.startDate} -{" "}
                    {fullJobResource?.endDate}
                  </div>

                  {(() => {
                    const endDate = datetimeUtils.getMoment(
                      fullJobResource!.endDate,
                      datetimeUtils.LOCAL_DATE
                    );
                    const today = moment().startOf("day");

                    if (endDate?.isValid()) {
                      const endDateNormalized = endDate.startOf("day");
                      const daysRemaining = endDateNormalized.diff(
                        today,
                        "days"
                      );

                      if (daysRemaining > 0) {
                        return (
                          <span
                            style={{
                              ...(!isMobile
                                ? { marginLeft: "8px" }
                                : { marginTop: "8px" }),
                              color: "#d97706",
                              fontWeight: "500",
                              fontSize: "17px",
                            }}
                          >
                            (Còn {daysRemaining} ngày)
                          </span>
                        );
                      } else if (daysRemaining === 0) {
                        return (
                          <span
                            style={{
                              ...(!isMobile
                                ? { marginLeft: "8px" }
                                : { marginTop: "8px" }),
                              color: "#dc2626",
                              fontWeight: "500",
                            }}
                          >
                            (Hôm nay là hạn cuối)
                          </span>
                        );
                      } else {
                        return (
                          <>
                            <span
                              style={{
                                ...(!isMobile
                                  ? { marginLeft: "8px" }
                                  : { marginTop: "8px" }),
                                color: "#dc2626",
                                fontWeight: "500",
                              }}
                            >
                              (Đã quá hạn {Math.abs(daysRemaining)} ngày)
                            </span>
                          </>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
              ) : (
                ""
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "12px",
                }}
                className="flex !items-center !justify-center gap-2"
              >
                {/* <CalendarDays className="w-4 h-4 mr-2" /> */}
                <span>
                  Đăng
                  {` ${datetimeUtils.getDateFromNow(
                    new Date(updateDate as any).getTime()
                  )}`}
                </span>
              </div>
            </Col>

            <Col>
              {!_.isNull(fullProfileResource) && (
                <>
                  {/* Report button and like button*/}
                  <div
                    style={{
                      display: "flex",
                      // rowGap: "20px",
                      alignItems: "center",
                    }}
                    className="flex gap-x-7 flex-row"
                  >
                    {/* {shouldShowReportButton && (
                      <>
                        <Button
                          style={{
                            marginRight: "8px",
                          }}
                          type="primary"
                          icon={<ExclamationCircleOutlined />}
                          onClick={() => reportJobRef.current?.open()}
                          size="middle"
                          className="mr-4"
                        >
                          Báo cáo
                        </Button>
                        <ReportJobModal
                          ref={reportJobRef}
                          data={fullJobResource!}
                          onRefetch={jobQuery.refetch}
                        />
                      </>
                    )} */}

                    {shouldShowLikeButton && (
                      <>
                        <Button
                          block={true}
                          type={"text"}
                          disabled={reactionMutation.isPending}
                          onClick={() =>
                            reactionMutation.mutate({
                              jobId: fullJobResource!?.jobId,
                            })
                          }
                          size={"large"}
                          className={"btnLike"}
                        >
                          {fullJobResource?.isLiked ? (
                            <HeartFilled
                              style={{ color: "#09993E", fontSize: "36px" }}
                            />
                          ) : (
                            <HeartOutlined
                              style={{ color: "#25272D", fontSize: "36px" }}
                            />
                          )}
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Cancel and dispute button */}
                  {
                    // !shouldShowReportButton && (isCreated || isPartner) && (
                    !canceledStatuses.includes(fullJobResource?.status || 0) &&
                    show2button && (
                      <>
                        {/* Cancel button */}

                        {/* {isShowCancelButton && (
                            <>
                              <Button
                                danger
                                style={{
                                  marginRight: "8px",
                                }}
                                icon={<ExclamationCircleOutlined />}
                                onClick={() => cancelJobRef.current?.open()}
                                size="middle"
                                className="mr-4"
                              >
                                {getCancelButtonText()}
                              </Button>

                              <CancelJobModal
                                ref={cancelJobRef}
                                data={fullJobResource!}
                                reason={""}
                                onRefetch={jobQuery.refetch}
                                step={step}
                                dataSttCancel={dataSttCancel?.data || undefined}
                                userRole={
                                  isPartner
                                    ? UserRoleEnum.PARTNER
                                    : UserRoleEnum.CUSTOMER
                                }
                                refetch={() => setQueryKey((prev) => prev + 1)}
                              />
                            </>
                          )} */}

                        {/* {isShowDisputeButton && (
                            <>
                              <Button
                                danger
                                style={{
                                  marginRight: "8px",
                                }}
                                icon={<ExclamationCircleOutlined />}
                                onClick={() => disputeJobRef.current?.open()}
                                size="middle"
                                className="mr-4"
                              >
                                Khiếu nại
                              </Button>
                              <DisputeJobModal
                                ref={disputeJobRef}
                                data={fullJobResource!}
                                onRefetch={jobQuery.refetch}
                              />
                            </>
                          )} */}
                      </>
                    )
                  }
                </>

                // [
                //   Constants.JOB.STATUS.LUU_NHAP,
                //   Constants.JOB.STATUS.DUYET_DANG_TUYEN,
                //   Constants.JOB.STATUS.CHO_UNG_TUYEN,
                //   Constants.JOB.STATUS.YEU_CAU_DANG_TUYEN,
                //   Constants.JOB.STATUS.DA_KY_HOP_DONG
                // ].includes(fullJobResource!?.status) ? (
                //   // <Dropdown
                //   //   menu={{
                //   //     items: [
                //   //       {
                //   //         label: "Ngừng tuyển dụng",
                //   //         key: "1",
                //   //         icon: <StopOutlined />,
                //   //         onClick: () =>
                //   //           jobUpdateMutation.mutate({
                //   //             name: fullJobResource!.name,
                //   //             //@ts-ignore
                //   //             categoryId: fullJobResource?.category?.categoryId,
                //   //             //@ts-ignore
                //   //             locationId: fullJobResource?.location?.locationId,
                //   //             //@ts-ignore
                //   //             salaryId: fullJobResource?.salary?.salaryId,
                //   //             //@ts-ignore
                //   //             experienceId:
                //   //               fullJobResource!.experience?.experienceId,
                //   //             //@ts-ignore
                //   //             timeId: fullJobResource?.time?.timeId,
                //   //             tagIds: _.isArray(fullJobResource!.tags)
                //   //               ? fullJobResource!.tags.map(
                //   //                   (tItem) => tItem.tagId
                //   //                 )
                //   //               : [],
                //   //             description: fullJobResource!.description,
                //   //             requirements: fullJobResource!.jobRequirements,
                //   //             benefits: fullJobResource!.benefits,
                //   //             //@ts-ignore
                //   //             endDate: fullJobResource?.endDate
                //   //               ? datetimeUtils.getMoment(
                //   //                   fullJobResource?.endDate,
                //   //                   datetimeUtils.LOCAL_DATE
                //   //                 )
                //   //               : null,
                //   //             salaryType: fullJobResource!.salaryType,
                //   //             price: fullJobResource!.price, // Giá cố định
                //   //             priceMin: fullJobResource!.priceMin, // Giá thấp nhất
                //   //             priceMax: fullJobResource!.priceMax, // Giá cao nhất
                //   //             status: Constants.JOB.STATUS.CANCELED,
                //   //           }),
                //   //       },
                //   //       ...(fullJobResource!?.status ===
                //   //       Constants.JOB.STATUS.LUU_NHAP
                //   //         ? [
                //   //             {
                //   //               label: "Chỉnh sửa",
                //   //               key: "2",
                //   //               icon: <EditOutlined />,
                //   //               onClick: () =>
                //   //                 router.push(
                //   //                   JobRouteUtils.toEditUrl(fullJobResource!)
                //   //                 ),
                //   //             },
                //   //           ]
                //   //         : []),
                //   //       {
                //   //         label: "Xóa công việc",
                //   //         key: "3",
                //   //         icon: <DeleteOutlined />,
                //   //         onClick: () =>
                //   //           jobDeleteModalRef.current?.open(fullJobResource!),
                //   //       },
                //   //     ],
                //   //   }}
                //   //   placement={"bottomRight"}
                //   //   trigger={["click"]}
                //   // >
                //   //   <Button
                //   //     block={true}
                //   //     type={"text"}
                //   //     size={"large"}
                //   //     className={"btnLike"}
                //   //   >
                //   //     <IconSvgLocal name={"IC_MORE"} width={14} height={4} />
                //   //   </Button>
                //   // </Dropdown>

                //   <div
                //     style={{
                //       display: "flex",
                //       // rowGap: "20px",
                //       alignItems: "center",
                //     }}
                //     className="flex gap-x-7 flex-row"
                //   >
                //     <Button
                //       danger
                //       style={{
                //         marginRight: "8px",
                //       }}
                //       icon={<ExclamationCircleOutlined />}
                //       onClick={() => cancelJobRef.current?.open()}
                //       size="middle"
                //       className="mr-4"
                //     >
                //       Hủy công việc
                //     </Button>
                //     <CancelJobModal
                //       ref={cancelJobRef}
                //       data={fullJobResource!}
                //       onRefetch={jobQuery.refetch}
                //     />

                //     {(fullJobResource?.numberAcceptRemaining! <= 0) && (
                //       <><Button
                //       danger
                //       style={{
                //         marginRight: "8px",
                //       }}
                //       icon={<ExclamationCircleOutlined />}
                //       onClick={() => cancelJobRef.current?.open()}
                //       size="middle"
                //       className="mr-4"
                //     >
                //       Khiếu nại
                //     </Button>
                //     <DisputeJobModal
                //       ref={disputeJobRef}
                //       data={fullJobResource!}
                //       onRefetch={jobQuery.refetch}
                //     />
                //     </>)}

                //     {/* <Button
                //       style={{
                //         marginRight: "8px",
                //       }}
                //       type="primary"
                //       icon={<ExclamationCircleOutlined />}
                //       onClick={() => reportJobRef.current?.open()}
                //       size="middle"
                //       className="mr-4"
                //     >
                //       Báo cáo
                //     </Button>
                //     <ReportJobModal
                //       ref={reportJobRef}
                //       data={fullJobResource!}
                //       onRefetch={jobQuery.refetch}
                //     /> */}
                //   </div>
                // ) : (
                //   <div
                //     style={{
                //       display: "flex",
                //       // rowGap: "20px",
                //       alignItems: "center",
                //     }}
                //     className="flex gap-x-7 flex-row"
                //   >
                //     {/* <Button
                //       danger
                //       style={{
                //         marginRight: "8px",
                //       }}
                //       icon={<ExclamationCircleOutlined />}
                //       onClick={() => cancelJobRef.current?.open()}
                //       size="middle"
                //       className="mr-4"
                //     >
                //       Hủy công việc
                //     </Button>
                //     <CancelJobModal
                //       ref={cancelJobRef}
                //       data={fullJobResource!}
                //       onRefetch={jobQuery.refetch}
                //     /> */}

                //     <Button
                //       style={{
                //         marginRight: "8px",
                //       }}
                //       type="primary"
                //       icon={<ExclamationCircleOutlined />}
                //       onClick={() => reportJobRef.current?.open()}
                //       size="middle"
                //       className="mr-4"
                //     >
                //       Báo cáo
                //     </Button>
                //     <ReportJobModal
                //       ref={reportJobRef}
                //       data={fullJobResource!}
                //       onRefetch={jobQuery.refetch}
                //     />

                //     <Button
                //       block={true}
                //       type={"text"}
                //       disabled={reactionMutation.isPending}
                //       onClick={() =>
                //         reactionMutation.mutate({
                //           jobId: fullJobResource!?.jobId,
                //         })
                //       }
                //       size={"large"}
                //       className={"btnLike"}
                //     >
                //       {fullJobResource?.isLiked ? (
                //         <HeartFilled
                //           style={{ color: "#09993E", fontSize: "36px" }}
                //         />
                //       ) : (
                //         <HeartOutlined
                //           style={{ color: "#25272D", fontSize: "36px" }}
                //         />
                //       )}
                //     </Button>
                //   </div>
                // )
              )}
            </Col>
          </Row>

          {/* Updated condition to use shouldShowStepsUI function */}
          {isWaitingApply && isUserApply ? (
            <>
              <StepUI />
              <DescribeForm />
            </>
          ) : shouldShowStepsUIRes ? (
            <>
              <StepUI />
              {includes([0], stepIndex) && <DescribeForm />}
              {/* chỉ bước 1  */}
            </>
          ) : (
            <>
              <DescribeForm />
            </>
          )}
          <div
            className={"jobStepsContainer"}
            style={{
              opacity: [
                Constants.JOB.STATUS.CANCEL_DANG_TUYEN,
                Constants.JOB.STATUS.CANCELED,
              ].includes(fullJobResource!?.status)
                ? "0.5"
                : "1",
            }}
          >
            {/* <div
              style={{
                margin: "12px auto",
              }}
            >
              {!canceledStatuses.includes(fullJobResource?.status || 0) && (
                <LiquidationTableWithActions
                  // fullJobResource={fullJobResource}
                  fullJobResource={jobDetailInitResource}
                  queryKey={queryKey}
                  refetch={() => setQueryKey((prev) => prev + 1)}
                />
              )}
            </div> */}
            <div
              className={`jobStepContainer ${stepName === Constants.JOB.TAB.JOB_INFO ? "active" : null
                }`}
            >
              {/* <JobInfo
                jobQuery={jobQuery}
                auth={fullProfileResource}
                isCreated={isCreated}
                isPartner={isPartner}
                setStepName={setStepName}
                {...props}
              /> */}
              {isUserApply && (
                <>
                  <div
                    style={{
                      marginTop: "24px",
                    }}
                  >
                    {!isInvitedPartner && (
                      <ApplyInfoTable
                        title="Thông tin ứng tuyển"
                        // jobQuery={jobQuery}
                        jobQuery={
                          {
                            // ...jobQuery,
                            data: {
                              ...jobQuery.data,
                              userProjectBids: filter(
                                jobQuery?.data?.userProjectBids,
                                (it) => it?.userId === userInfo?.userId
                              ),
                            },
                            refetch: () => Promise.resolve(),
                          } as any
                        }
                      />
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: "24px",
                    }}
                  >
                    <ProjectBidTable
                      title="Lịch sử đề xuất"
                      jobRefetch={jobQuery}
                      jobQuery={
                        {
                          // ...jobQuery,
                          data: {
                            ...jobQuery.data,
                            userProjectBids: filter(
                              jobQuery?.data?.userProjectBids,
                              (it) => it?.userId === userInfo?.userId
                            ),
                          },
                          refetch: () => Promise.resolve(),
                        } as any
                      }
                      isDisplayResponse={true}
                    />
                  </div>
                </>
              )}
            </div>
            {/* <div
              style={{
                marginTop: "36px",
                overflow: "auto",
              }}
            >
              <ProjectBidTable title="Lịch sử đề xuất ( demo )" />
            </div> */}
            <div
              className={`jobStepContainer ${stepName === Constants.JOB.TAB.JOB_PARTNER ? "active" : null
                }`}
            >
              <JobPartner
                jobQuery={jobQuery}
                auth={fullProfileResource}
                isCreated={isCreated}
                isPartner={isPartner}
                setStepName={setStepName}
                isDesktop={isDesktop}
                {...props}
              />
            </div>

            <div
              className={`jobStepContainer ${stepName === Constants.JOB.TAB.JOB_PAYMENT ||
                stepName === Constants.JOB.TAB.JOB_SETTLEMENT
                ? "active"
                : null
                }`}
            >
              <JobPayment
                jobQuery={jobQuery}
                auth={fullProfileResource}
                isCreated={isCreated}
                isPartner={isPartner}
                setStepName={setStepName}
                payment={paymentData}
                totalPayment={totalPaymentData}
                isLoadingPayment={isLoadingPayment}
                {...props}
              />
            </div>

            {/* <div
              className={`jobStepContainer ${
                stepName === Constants.JOB.TAB.JOB_PROCESSING ? "active" : null
              }`}
            >
              <JobProcessing
                jobQuery={jobQuery}
                auth={fullProfileResource}
                isCreated={isCreated}
                isPartner={isPartner}
                setStepName={setStepName}
                {...props}
              />
            </div> */}

            <div
              className={`jobStepContainer ${stepName === Constants.JOB.TAB.JOB_SIGN ? "active" : null
                }`}
            >
              <JobSign
                jobQuery={jobQuery}
                auth={fullProfileResource}
                isCreated={isCreated}
                isPartner={isPartner}
                setStepName={setStepName}
                {...props}
              />
            </div>

            {/* Step 3 of Partner */}
            <div
              className={`jobStepContainer ${stepName === Constants.JOB.TAB.JOB_REPORT ? "active" : null
                }`}
            >
              <JobReport
                jobQuery={jobQuery}
                auth={fullProfileResource}
                isCreated={isCreated}
                isPartner={isPartner}
                setStepName={setStepName}
                {...props}
              />
            </div>

            {/* Step 5 of Client */}
            <div
              className={`jobStepContainer ${stepName === Constants.JOB.TAB.JOB_REVIEW ? "active" : null
                }`}
            >
              <JobReview
                jobQuery={jobQuery}
                auth={fullProfileResource}
                isCreated={isCreated}
                isPartner={isPartner}
                setStepName={setStepName}
                {...props}
              />
            </div>

            <div
              className={`jobStepContainer ${stepName === Constants.JOB.TAB.JOB_RATE ? "active" : null
                }`}
            >
              <JobRate
                jobQuery={jobQuery}
                auth={fullProfileResource}
                isCreated={isCreated}
                isPartner={isPartner}
                setStepName={setStepName}
                isDesktop={isDesktop}
                {...props}
              />
            </div>

            <div
              className={`jobStepContainer ${stepName === Constants.JOB.TAB.JOB_RESULT ? "active" : null
                }`}
            >
              <JobResult
                jobQuery={jobQuery}
                auth={fullProfileResource}
                isCreated={isCreated}
                isPartner={isPartner}
                setStepName={setStepName}
                {...props}
              />
            </div>
          </div>
        </div>
      </section>

      {!isCreated &&
        [
          Constants.JOB.STATUS.DUYET_DANG_TUYEN,
          Constants.JOB.STATUS.CHO_UNG_TUYEN,
        ].includes(fullJobResource!?.status) && (
          <section className={"sectionContainer jobWrapper related"}>
            <div className="contentWrapper">
              <div>
                <div className={"sectionTitleContainer"}>
                  <Typography.Title
                    className={"sectionTitle jobSectionTitle"}
                    level={2}
                    style={{ padding: !isDesktop ? "0 20px" : 0 }}
                  >
                    Công việc liên quan
                  </Typography.Title>
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
                      router.push(JobRouteUtils.toJobsSearchScreen())
                    }
                    className={"hidden-mb"}
                  >
                    Xem thêm
                  </ButtonWithIcon>
                </div>
              </div>

              <div className="sectionContentContainer">
                {/* <Slider {...jobSlickSettings}> */}
                {/* {(jobRelatedSlideItems).map((jobPages, jobPageIndex) => {
                    return (
                      <List
                        key={jobPageIndex}
                        grid={{
                          gutter: 24,
                          xs: 1,
                          sm: 2,
                          md: 2,
                          lg: 3,
                          xl: 3,
                          xxl: 3,
                        }}
                        dataSource={jobPages}
                        className={"jobListContainer centerSlide"}
                        renderItem={(item: FullJobResource) => {
                          return (
                            <List.Item>
                              <JobItem data={item} />
                            </List.Item>
                          );
                        }}
                      />
                    );
                  })} */}
                {/* </Slider> */}
                <List
                  grid={{
                    gutter: 24,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 3,
                    xxl: 3,
                  }}
                  dataSource={jobRelatedSlideItems.flat()}
                  pagination={{
                    pageSize: 3,
                    showSizeChanger: false,
                    // optional:
                    position: "bottom",
                    align: "center",
                  }}
                  renderItem={(item: FullJobResource) => (
                    <List.Item>
                      <JobItem data={item} />
                    </List.Item>
                  )}
                />
              </div>
              <Row
                className={"show-mb-flex"}
                style={{ marginTop: "40px", display: "none" }}
                justify={"center"}
              >
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
                    router.push(JobRouteUtils.toJobsSearchScreen())
                  }
                >
                  Xem thêm
                </ButtonWithIcon>
              </Row>
            </div>
          </section>
        )}

      <JobDeleteModal ref={jobDeleteModalRef} />
      {/* <ApplyJobModal ref={applyJobRef} data={fullJobResource!} /> */}
    </RootLayout>
  );
}

export default JobDetailScreen;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Avatar,
  Button,
  Col,
  Modal,
  Pagination,
  Rate,
  Row,
  Select,
  Tag,
  Typography,
} from "antd";
import {
  FullJobResource,
  UserProjectBidResource,
} from "../../../../data/job/models/job.types";
// 🛑 ĐỊNH NGHĨA PROPS RÕ RÀNG HƠN ĐỂ BIẾN TẤT CẢ THÀNH OPTIONAL
interface JobDetailComponentPropsOptional {
  jobQuery?: {
    data?: FullJobResource;
    refetch?: () => Promise<any>;
    // Thêm các thuộc tính khác của jobQuery nếu cần
  };
  isDesktop?: boolean;
  isMobile?: boolean;
}

import Constants from "@/src/constants/Constants";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FileWordOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import Images from "@/src/constants/Images";
import PriceUtils from "@/src/utils/PriceUtils";
import PartnerServices from "@/src/data/partner/services/PartnerServices";
import { PartnerDetailResource } from "@/src/data/partner/models/partner.types";
import PartnerInfoModal, {
  PartnerInfoModalRef,
} from "../modals/PartnerInfoModal";
import SendOfferToPartnerModal, {
  ClientConfirmOfferModalHelperVisible,
} from "../modals/SendOfferToPartnerModal";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import {
  includes,
  isEmpty,
  kebabCase,
  map,
  orderBy,
  size,
  slice,
  toNumber,
  toString,
  trim,
} from "lodash";
import useDetectDevice, {
  useDetectDeviceV2,
} from "@/src/hooks/useDetectDevice";
import { useAccountContext } from "@/src/contexts/AccountContext";
import NumberUtils from "@/src/utils/NumberUtils";
import { useRouter } from "next/router";
import FilePreviewModal from "../modals/ModalPreviewFile";
import ChatButton from "../components/ChatButton";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
// import StringUtils from "@/src/utils/StringUtils"; // Không dùng

const { Text, Paragraph } = Typography;

enum SortPartnerEnum {
  START_DATE = "startDate",
  END_DATE = "endDate",
  RATING = "user.partner.rate",
  PRICE = "negotiatePrice",
}

// 🟢 SỬ DỤNG INTERFACE OPTIONAL MỚI
function JobPartner(props: JobDetailComponentPropsOptional) {
  // 🟢 TRUY CẬP DỮ LIỆU VỚI OPTIONAL CHAINING
  const fullJobResource: FullJobResource | undefined = props.jobQuery?.data;
  const jobQueryRefetch = props.jobQuery?.refetch;

  const [currentPage, setCurrentPage] = useState(1);
  const [isRate, setIsRate] = useState(false);
  const [open, setOpen] = useState(false);
  const [urlPreview, setUrlPreview] = useState("");
  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const [sort, setSort] = useState<{
    field: SortPartnerEnum;
    order: number;
  }>({ field: SortPartnerEnum.START_DATE, order: -1 });

  const [selectedPartnerInfo, setSelectedPartnerInfo] =
    useState<PartnerDetailResource | null>(null);
  const [loadingPartnerInfo, setLoadingPartnerInfo] = useState(-1);
  const partnerInfoModalRef = useRef<PartnerInfoModalRef>(null);
  const sendOfferModalRef = useRef<any>(null);

  // 🟢 SỬ DỤNG HOOK TRỰC TIẾP HOẶC DÙNG PROPS NẾU CÓ
  // const { isMobile: hookIsMobile, isDesktop: hookIsDesktop } =
  //   useDetectDevice();
  // const isMobile = props.isMobile ?? hookIsMobile;
  // const isDesktop = props.isDesktop ?? hookIsDesktop;
  const { isMobile, isDesktop } = useDetectDeviceV2();

  const { auth: userInfo } = useAccountContext();
  const router = useRouter();

  // 🟢 Đảm bảo mảng userProjectBids luôn là mảng
  const userProjectBids: UserProjectBidResource[] =
    fullJobResource?.userProjectBids || [];

  const handleSendOfferSuccess = async () => {
    // 🟢 Dùng optional chaining cho refetch
    await jobQueryRefetch?.();
  };

  const viewPartnerInfo = async (
    partnerId: number | undefined | null,
    index: number
  ) => {
    if (!partnerId) return;
    try {
      setLoadingPartnerInfo(index);
      const partnerInfo = await new PartnerServices().getFullInfo(partnerId);
      setSelectedPartnerInfo(partnerInfo as PartnerDetailResource);
      // 🟢 Dùng optional chaining
      partnerInfoModalRef.current?.open();
    } catch (error) {
      console.error("Error fetching partner info:", error);
    } finally {
      setLoadingPartnerInfo(-1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getFileIconAndColor = (fileName: string) => {
    // 🟢 Xử lý fileName có thể là string rỗng
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
    if (fileExtension === "pdf")
      return { icon: <FilePdfOutlined />, color: "#FF4D4F" };
    if (["doc", "docx"].includes(fileExtension))
      return { icon: <FileWordOutlined />, color: "#1890FF" };
    if (["xls", "xlsx"].includes(fileExtension))
      return { icon: <FileExcelOutlined />, color: "#52C41A" };
    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension))
      return { icon: <FileImageOutlined />, color: "#FAAD14" };
    return { icon: <FileOutlined />, color: "#BFBFBF" };
  };

  const handleDownload = (url: string, fileName: string) => {
    Modal.confirm({
      title: "Xác nhận tải xuống",
      content: `Bạn có chắc chắn muốn tải tệp "${fileName}" xuống không?`,
      okText: "Tải xuống",
      cancelText: "Hủy",
      onOk() {
        // 🟢 Đảm bảo url hợp lệ
        if (url) window.open(url, "_blank");
      },
    });
  };

  // 🟢 TỐI ƯU LOGIC KIỂM TRA CHAT
  const checkCanReplyForSpecificPartner = (partnerId: number | undefined) => {
    // 🟢 Kiểm tra sự tồn tại của fullJobResource
    if (!fullJobResource?.userProjectBids || !userInfo || !partnerId)
      return false;

    // only job creator can send offers to partners
    if (fullJobResource.createdByUserId !== userInfo.userId) return false;

    const partnerBid = fullJobResource?.userProjectBids?.find(
      (bid: any) => bid.userId === partnerId
    );

    if (!partnerBid) return false;

    // if no deals exist, client can send first offer
    if (
      !partnerBid.userProjectDeals ||
      partnerBid.userProjectDeals.length === 0
    ) {
      return true;
    }

    // Lấy deal mới nhất (thường là deal[0])
    const latestDeal = partnerBid.userProjectDeals[0];

    // client can only reply to partner's deals (type = 2) with status = 0
    // 🟢 Đảm bảo latestDeal tồn tại
    if (latestDeal?.type === Constants.JOB.OFFER.TYPE.PARTNER) {
      if (latestDeal.dealStatus === Constants.JOB.OFFER.DEAL_STATUS.ACCEPTED) {
        return false;
      }

      return latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE;
    }

    // cannot reply to own deals or deals with status !== 0
    return false;
  };

  const handleSelectPartner = (partnerApplyInfo: UserProjectBidResource) => {
    // 🟢 Đảm bảo userId tồn tại
    const partnerUserId = partnerApplyInfo.userId;
    if (!partnerUserId) return;

    const canReplyForThisPartner =
      checkCanReplyForSpecificPartner(partnerUserId);

    if (
      !canReplyForThisPartner &&
      partnerApplyInfo.status !== Constants.PARTNER.STATUS_APPLY_KEY.DEAL
    ) {
      return;
    }

    // 🟢 Dùng optional chaining
    const confirmInfo = {
      userId: partnerApplyInfo.userId,
      partnerId: partnerApplyInfo.user?.partner?.id,
      partnerName: partnerApplyInfo.user?.fullName,
      projectName: fullJobResource?.name,
      startDate: partnerApplyInfo.startDate,
      endDate: partnerApplyInfo.endDate,
      negotiatePrice: partnerApplyInfo.negotiatePrice,
      numberAccept: partnerApplyInfo.numberAccept,
      description: fullJobResource?.description,
      jobSuggestion: partnerApplyInfo.description,
      deviceId: "",
      deviceName: "",
      platform: "",
    };

    if (sendOfferModalRef.current?.open) {
      sendOfferModalRef.current.open(confirmInfo);
    }
  };

  const getButtonConfirmState = (partnerApplyInfo: UserProjectBidResource) => {
    const partnerStatus = partnerApplyInfo.status;
    const canReply = checkCanReplyForSpecificPartner(partnerApplyInfo.userId);
    const latestDeal = partnerApplyInfo.userProjectDeals?.[0];

    // 🟢 Thêm optional chaining cho latestDeal
    const isPartnerAccepted =
      latestDeal?.type === Constants.JOB.OFFER.TYPE.PARTNER &&
      latestDeal?.dealStatus === Constants.JOB.OFFER.DEAL_STATUS.ACCEPTED;

    const isInvitedPartner =
      partnerApplyInfo.bidType === Constants.JOB.BID.TYPE.INVITED;

    switch (partnerStatus) {
      case 0:
        if (isPartnerAccepted) {
          return {
            disabled: false,
            text: "Xác nhận",
            isAcceptAction: true,
            isPending: false,
          };
        }

        // check if latestDeal is from partner and haven't responsed
        const partnerDealPending =
          latestDeal?.type === Constants.JOB.OFFER.TYPE.CLIENT &&
          latestDeal?.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE;

        return {
          disabled: !canReply,
          text: partnerDealPending
            ? "Chờ phản hồi"
            : canReply
            ? "Xem đề xuất"
            : "Không thể chọn",
          isAcceptAction: false,
          isPending: partnerDealPending,
        };

      case 1:
        return {
          disabled: true,
          text: "Đã chọn",
          isAcceptAction: false,
          isPending: false,
        };

      case 2:
        if (isPartnerAccepted) {
          return {
            disabled: false,
            text: "Xác nhận và ký hợp đồng",
            isAcceptAction: true,
            isPending: false,
          };
        }

        const partnerDealPendingCase2 =
          latestDeal?.type === Constants.JOB.OFFER.TYPE.CLIENT &&
          latestDeal?.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE;

        if (isInvitedPartner && !latestDeal) {
          return {
            disabled: false,
            text: "Gửi đề xuất",
            isAcceptAction: false,
            isPending: false,
          };
        }

        return {
          disabled: false,
          text: partnerDealPendingCase2 ? "Chờ phản hồi" : "Xem đề xuất",
          isAcceptAction: false,
          isPending: partnerDealPendingCase2,
        };

      case 3:
        return {
          disabled: true,
          text: "Đã từ chối",
          isAcceptAction: false,
          isPending: false,
        };

      case 4:
        return {
          disabled: true,
          text: "Đã mời",
          isAcceptAction: false,
          isPending: false,
        };

      case 5:
        return {
          disabled: true,
          text: "Đối Tác từ chối",
          isAcceptAction: false,
          isPending: false,
        };

      default:
        return {
          disabled: true,
          text: "Không xác định",
          isAcceptAction: false,
          isPending: false,
        };
    }
  };

  const STATUS_APPLY = useMemo(
    () =>
      new Map(
        Constants.PARTNER.STATUS_APPLY.map((item) => [
          item.key,
          { value: item.value, color: item.color, colorBlur: item.colorBlur },
        ])
      ),
    []
  );

  const sortedBids = useMemo(() => {
    // 🟢 Kiểm tra userProjectBids trước khi sort
    if (!sort || userProjectBids.length === 0) return userProjectBids;

    // return orderBy(
    //   userProjectBids,
    //   [
    //     (item) => {
    //       const val = item[sort.field as keyof typeof item];

    //       if (
    //         includes(
    //           [SortPartnerEnum.START_DATE, SortPartnerEnum.END_DATE],
    //           sort.field
    //         )
    //       ) {
    //         return val ? new Date(val as string).getTime() : 0;
    //       }
    //       if (sort.field === SortPartnerEnum.RATING) {
    //         // 🟢 Dùng optional chaining an toàn hơn cho item.user?.partner?.rate
    //         const rate = item.user?.partner?.rate;
    //         return NumberUtils.display(rate || 0);
    //       }

    //       return val;
    //     },
    //   ],
    //   [sort.order === -1 ? "desc" : "asc"]
    // );
    return userProjectBids;
  }, [userProjectBids, sort]);

  // 🟢 TÁCH LOGIC RENDER ITEM
  const renderPartnerItem = (
    partnerApplyInfo: UserProjectBidResource,
    index: number,
    expand: boolean
  ) => {
    const shouldShowChatButton = (() => {
      const allowToDisplayStatusBid = [
        Constants.PARTNER.STATUS_APPLY_KEY.APPLIED,
        Constants.PARTNER.STATUS_APPLY_KEY.DEAL,
        Constants.PARTNER.STATUS_APPLY_KEY.SELECTED,
      ];

      return allowToDisplayStatusBid.includes(partnerApplyInfo.status);
    })();

    const isInvitedPartner =
      partnerApplyInfo.bidType === Constants.JOB.BID.TYPE.INVITED;
    const latestDeal = partnerApplyInfo.userProjectDeals?.[0];
    const hasPartnerDeal =
      latestDeal?.type === Constants.JOB.OFFER.TYPE.PARTNER;
      const start = datetimeUtils.getMoment(
        latestDeal?.startDate || "",
        datetimeUtils.BACKEND_DATE_TIME
      );
      
      const end = datetimeUtils.getMoment(
        latestDeal?.endDate || "",
        datetimeUtils.BACKEND_DATE_TIME
      );
      
      const dateText =
        start && end
          ? `${start.format(datetimeUtils.LOCAL_DATE)} - ${end.format(
              datetimeUtils.LOCAL_DATE
            )}`
          : start
          ? `Từ ${start.format(datetimeUtils.LOCAL_DATE)}`
          : end
          ? `Đến ${end.format(datetimeUtils.LOCAL_DATE)}`
          : "Chưa cập nhật thời gian";
    // const status = STATUS_APPLY.get(toString(partnerApplyInfo?.status));
    const status = (() => {
      const defaultStatus = STATUS_APPLY.get(
        toString(partnerApplyInfo?.status)
      );

      // Check if we need to show "Chờ xác nhận" and change color to green
      if (
        partnerApplyInfo?.status === Constants.PARTNER.STATUS_APPLY_KEY.DEAL
      ) {
        // const latestDeal = partnerApplyInfo.userProjectDeals?.[0];

        if (
          latestDeal?.type === Constants.JOB.OFFER.TYPE.PARTNER &&
          latestDeal?.dealStatus === Constants.JOB.OFFER.DEAL_STATUS.ACCEPTED
        ) {
          return {
            ...defaultStatus,
            value: "Chờ xác nhận",
            color: "rgba(34, 197, 94, 1)",
            colorBlur: "rgba(34, 197, 94, 0.15)",
          };
        }
      }

      return defaultStatus;
    })();

    const buttonState = getButtonConfirmState(partnerApplyInfo);

    return (
      <div
        style={{
          position: "relative",
          padding: "0",
          width: "100%",
          transition: "0.5s",
          ...(!isMobile
            ? { height: "100%" }
            : {
                height: expand ? "100%" : "350px",
              }),
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-12px",
            top: "12px",
            zIndex: 50,
            backgroundColor: status?.color, // Nền đỏ
            color: "white", // Chữ trắng
            padding: "8px 16px", // Padding để tạo khoảng cách trong phần tử
            fontWeight: "600", // Đặt font chữ nửa đậm
            fontSize: "14px", // Kích thước chữ
            transition: "0.5s",
          }}
        >
          {/* {STATUS_APPLY.get(toString(partnerApplyInfo?.status))?.value} */}
          {(() => {
            const defaultStatus = STATUS_APPLY.get(
              toString(partnerApplyInfo?.status)
            );

            // Check if status is "Thương lượng" (key = "2") and if latest deal meets the condition
            if (
              partnerApplyInfo?.status ===
              Constants.PARTNER.STATUS_APPLY_KEY.DEAL
            ) {
              // const latestDeal = partnerApplyInfo.userProjectDeals?.[0];

              if (
                latestDeal?.type === Constants.JOB.OFFER.TYPE.PARTNER &&
                latestDeal?.dealStatus ===
                  Constants.JOB.OFFER.DEAL_STATUS.ACCEPTED
              ) {
                return "Chờ xác nhận";
              }
            }

            return defaultStatus?.value;
          })()}
        </div>
        <div
          style={{
            position: "absolute",
            top: "56px", // Đặt tam giác ở dưới
            right: "-12px",
            width: "0",
            height: "0",
            borderLeft: "20px solid transparent", // Bên trái của tam giác
            borderRight: "20px solid transparent", // Bên phải của tam giác
            borderTop: `20px solid ${status?.colorBlur}`, // Màu tam giác
          }}
        ></div>

        <div
          style={{
            background: "linear-gradient(135deg, #09993E 0%, #764ba2 100%)",
            borderRadius: "16px",
            padding: "2px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              padding: "12px",
              position: "relative",
              display: "flex",
              rowGap: "16px",
              flexWrap: "wrap",
              height: "100%",
            }}
          >
            {/* Header Section */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                gap: "8px",
                // marginBotto: "24px",
                // paddingBottom: "20px",
                // borderBottom: "1px solid #f0f0f0",
                width: "100%",
                ...(isMobile
                  ? {
                      paddingTop: "40px",
                    }
                  : {}),
                height: "max-content",
              }}
            >
              {/* Profile Section */}
              <div
                style={{
                  display: "flex",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <Avatar
                    size={64}
                    src={
                      partnerApplyInfo.user?.avatarUrl || Images.ACCOUNT_DEFAULT
                    }
                    style={{
                      border: "3px solid #09993E",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "140px",
                    paddingLeft: "16px",
                  }}
                >
                  <Text
                    strong
                    style={{
                      fontSize: "16px",
                      textAlign: "left",
                      marginBottom: "-2px",
                      color: "#1f2937",
                    }}
                  >
                    {partnerApplyInfo.user?.fullName}
                  </Text>

                  <div
                    style={{
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#374151",
                      marginBottom: "-2px",
                    }}
                  >
                    {partnerApplyInfo.user?.partner?.location_ids
                      ?.map((location) => location.name)
                      .join(", ") || "N/A"}{" "}
                    | {isMobile ? <br /> : ""}
                    {partnerApplyInfo.user?.partner?.position || "Đối tác"}
                  </div>
                  <div
                    onClick={() => {
                      setIsRate(true);
                      viewPartnerInfo(
                        partnerApplyInfo.user?.partner?.id,
                        index
                      );
                    }}
                  >
                    <Rate
                      allowHalf
                      disabled
                      defaultValue={NumberUtils.display(
                        partnerApplyInfo.user?.partner?.rate || 0
                      )}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  rowGap: "12px",
                  height: "32px",
                  marginBottom: "12px",
                  width:"100%"
                }}
              >
                <Button
                  type="primary"
                  loading={loadingPartnerInfo == index && !isRate}
                  onClick={() => {
                    setIsRate(false);
                    viewPartnerInfo(partnerApplyInfo.user?.partner?.id, index);
                  }}
                  style={{
                    background: "#09993E",
                    borderColor: "#09993E",
                    borderRadius: "8px",
                    fontSize: "12px",
                    // marginBottom: "20px",
                  }}
                >
                  Xem thông tin
                </Button>

                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Button
                    type="primary"
                    onClick={() => handleSelectPartner(partnerApplyInfo)}
                    disabled={buttonState?.disabled}
                    style={{
                      background: buttonState?.isPending
                        ? "rgba(255, 193, 7, 1)"
                        : buttonState?.disabled
                        ? "#d1d5db"
                        : "linear-gradient(135deg, #09993E 0%, #764ba2 100%)",
                      borderColor: "transparent",
                      borderRadius: "8px",
                      marginLeft: "12px",
                      //   height: "44px",
                      //   paddingInline: "32px",
                      fontSize: "14px",
                      fontWeight: "600",
                      boxShadow:
                        buttonState?.disabled || buttonState?.isPending
                          ? "none"
                          : "0 4px 12px rgba(102, 126, 234, 0.4)",
                      color: buttonState?.isPending ? "#fff" : undefined,
                    }}
                  >
                    {buttonState?.text}
                  </Button>
                </div>
              </div>
              {shouldShowChatButton && !isEmpty(fullJobResource) && (
                <ChatButton
                  fullJobResource={fullJobResource}
                  partnerApplyInfo={partnerApplyInfo}
                />
              )}
              {/* Main Content */}

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: isDesktop ? "36px" : "16px",
                  ...(isMobile
                    ? {
                        flexDirection: "column",
                      }
                    : {}),
                }}
              >
                {/* Proposal Details */}
                {partnerApplyInfo.status ===
                  Constants.PARTNER.STATUS_APPLY_KEY.INVITED && (
                  <div
                    style={{
                      background: "#fef3c7",
                      padding: "12px",
                      borderRadius: "8px",
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        fontWeight: "bold",
                      }}
                    >
                      Chờ phản hồi từ đối tác.
                    </div>
                  </div>
                )}

                {partnerApplyInfo.status ===
                  Constants.PARTNER.STATUS_APPLY_KEY.PARTNER_REJECT && (
                  <div
                    style={{
                      background: "rgba(108, 117, 125, 1)",
                      padding: "12px",
                      borderRadius: "8px",
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Đối tác đã từ chối lời mời.
                    </div>
                  </div>
                )}

                {isInvitedPartner &&
                  partnerApplyInfo.status ===
                    Constants.PARTNER.STATUS_APPLY_KEY.DEAL &&
                  hasPartnerDeal && (
                    // Always show full proposal section for invited partners with DEAL status
                    <div style={{ marginLeft: 12, flex: 1, marginTop: 16 }}>
                      <h4
                        style={{
                          margin: "0 0 16px 0",
                          color: "#1f2937",
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        Đề xuất của đối tác
                      </h4>
                      {/* Show partner's latest deal proposal or original bid details */}
                      {hasPartnerDeal ? (
                        // Display latest deal details from partner
                        <div>
                          {/* Price Information */}
                          <div
                            style={{
                              display: "flex",
                              marginBottom: "12px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                              }}
                            >
                              <div
                                style={{
                                  width: "4px",
                                  height: "16px",
                                  background: "#10b981",
                                  borderRadius: "2px",
                                }}
                              ></div>
                              <Text
                                style={{
                                  fontSize: "13px",
                                  marginRight: "12px",
                                  color: "#6b7280",
                                }}
                              >
                                Giá đề xuất:
                              </Text>
                              <Text
                                strong
                                style={{ fontSize: "15px", color: "#059669" }}
                              >
                                {PriceUtils.displayVND(
                                  latestDeal.negotiatePrice
                                )}
                              </Text>
                            </div>
                          </div>

                          {/* Timeline Information */}
                          <div style={{ marginBottom: "12px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                              }}
                            >
                              <div
                                style={{
                                  width: "4px",
                                  height: "16px",
                                  background: "#3b82f6",
                                  borderRadius: "2px",
                                }}
                              ></div>
                              <Text
                                style={{
                                  fontSize: "13px",
                                  color: "#6b7280",
                                }}
                              >
                                Thời gian thực hiện:
                              </Text>

                              <Text
                                strong
                                style={{
                                  fontSize: "14px",
                                  color: "#1f2937",
                                }}
                              >
                                {datetimeUtils
                                  .getMoment(
                                    latestDeal.startDate,
                                    datetimeUtils.BACKEND_DATE_TIME
                                  )
                                  ?.format(datetimeUtils.LOCAL_DATE)}{" "}
                                -{" "}
                                {datetimeUtils
                                  .getMoment(
                                    latestDeal.endDate,
                                    datetimeUtils.BACKEND_DATE_TIME
                                  )
                                  ?.format(datetimeUtils.LOCAL_DATE)}
                              </Text>
                            </div>
                          </div>

                          {/* Number of Reviews */}
                          <div style={{ marginBottom: "16px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                              }}
                            >
                              <div
                                style={{
                                  width: "4px",
                                  height: "16px",
                                  background: "#f59e0b",
                                  borderRadius: "2px",
                                }}
                              ></div>
                              <Text
                                style={{
                                  fontSize: "13px",
                                  color: "#6b7280",
                                }}
                              >
                                Số lần nghiệm thu:
                              </Text>
                              <Text
                                strong
                                style={{
                                  fontSize: "14px",
                                  color: "#1f2937",
                                }}
                              >
                                {latestDeal.numberAccept}
                              </Text>
                            </div>
                          </div>

                          {/* Deal Description */}
                          {!isEmpty(latestDeal?.description) && (
                            <div>
                              <Text
                                strong
                                style={{
                                  fontSize: "14px",
                                  color: "#1f2937",
                                  marginBottom: "8px",
                                  display: "block",
                                }}
                              >
                                Đề xuất:
                              </Text>
                              <Paragraph
                                style={{
                                  fontSize: 13,
                                  lineHeight: 1.5,
                                  margin: 0,
                                }}
                                ellipsis={{ rows: 2 }}
                              >
                                {latestDeal?.description}
                              </Paragraph>
                              <Button
                                type="link"
                                style={{ padding: 0, marginTop: 4 }}
                                onClick={() =>
                                  handleSelectPartner(partnerApplyInfo)
                                }
                              >
                                Xem chi tiết đề xuất
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Display original bid details with green banner
                        <div>
                          <div
                            style={{
                              background: "rgba(125, 214, 146, 1)",
                              padding: 12,
                              borderRadius: 8,
                              marginBottom: 16,
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "15px",
                                color: "#fff",
                                fontWeight: "bold",
                              }}
                            >
                              Đối tác đã đồng ý lời mời ứng tuyển. Gửi đề xuất
                              cho đối tác ngay.
                            </div>
                          </div>
                          {/* Original bid details */}
                        </div>
                      )}
                    </div>
                  )}

                {partnerApplyInfo.status !==
                  Constants.PARTNER.STATUS_APPLY_KEY.INVITED &&
                  partnerApplyInfo.status !==
                    Constants.PARTNER.STATUS_APPLY_KEY.PARTNER_REJECT &&
                  !isInvitedPartner && (
                    <>
                      <div
                        style={{
                          flex: 1,
                        }}
                        className="flex-1"
                        // style={{
                        //   display: "flex",
                        //   alignItems: "stretch", // This ensures equal height
                        //   gap: "12px",
                        //   marginTop: "16px",
                        // }}
                      >
                        {/* Left Column - Application Information */}

                        {/* Application Information */}
                        <div
                          style={{
                            marginTop: "16px",
                            // marginLeft: "12px",
                            // flex: 1,
                          }}
                        >
                          <h4
                            style={{
                              margin: "0 0 16px 0",
                              color: "#1f2937",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            Thông tin ứng tuyển
                          </h4>

                          <div>
                            <Text
                              strong
                              style={{
                                fontSize: "14px",
                                color: "#1f2937",
                                marginBottom: "8px",
                                display: "block",
                              }}
                            >
                              Thư giới thiệu:
                            </Text>
                            <Paragraph
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                lineHeight: "1.5",
                                maxHeight: "40px",
                                overflowY: "auto",
                              }}
                              // ellipsis={{ rows: 2 }}
                            >
                              {partnerApplyInfo.applicationLetter ||
                                "Không có dữ liệu"}
                            </Paragraph>
                          </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                          <Text
                            strong
                            style={{
                              fontSize: "14px",
                              color: "#1f2937",
                              marginBottom: "8px",
                              display: "block",
                            }}
                          >
                            Tài liệu ứng tuyển
                          </Text>

                          <div
                            style={{ maxHeight: "100px", overflowY: "auto" }}
                          >
                            {partnerApplyInfo.projectBidFiles &&
                            partnerApplyInfo.projectBidFiles.length > 0
                              ? partnerApplyInfo.projectBidFiles.map(
                                  (attachment, index) => {
                                    const { icon, color } = getFileIconAndColor(
                                      attachment.file
                                    );
                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          border: "1px solid #e5e7eb",
                                          borderRadius: "8px",
                                          padding: "8px 12px",
                                          marginBottom: "8px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          background: "#fafafa",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                          }}
                                        >
                                          <div
                                            style={{ color, fontSize: "18px" }}
                                          >
                                            {icon}
                                          </div>
                                          <Text
                                            style={{
                                              fontSize: "12px",
                                              color: "#6b7280",
                                            }}
                                          >
                                            Tệp đã gửi lên
                                          </Text>
                                        </div>
                                        <div>
                                          <EyeOutlined
                                            style={{
                                              fontSize: 14,
                                              cursor: "pointer",
                                              color: "#6b7280",
                                              marginRight: 8,
                                            }}
                                            onClick={() => {
                                              setOpen(true);
                                              setUrlPreview(attachment.file);
                                            }}
                                          />
                                          <FilePreviewModal
                                            onClose={() => setOpen(false)}
                                            open={open}
                                            title={attachment.note || ""}
                                            fileUrl={urlPreview}
                                          />
                                          <DownloadOutlined
                                            style={{
                                              cursor: "pointer",
                                              color: "#6b7280",
                                              fontSize: "14px",
                                            }}
                                            onClick={() =>
                                              handleDownload(
                                                attachment.file,
                                                "Tệp đã gửi"
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                )
                              : "Không có dữ liệu"}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          marginLeft: "12px",
                          flex: 1,
                          marginTop: "16px",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 16px 0",
                            color: "#1f2937",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          Đề xuất của đối tác:
                        </h4>

                        {(() => {
                          const userDeals =
                            partnerApplyInfo.userProjectDeals || [];
                          const dealOfPartner = userDeals.filter(
                            (deal) =>
                              deal.type === Constants.JOB.OFFER.TYPE.PARTNER
                          );

                          if (
                            userDeals.length === 0 ||
                            dealOfPartner.length === 0
                          ) {
                            return (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    marginBottom: "12px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "4px",
                                        height: "16px",
                                        background: "#10b981",
                                        borderRadius: "2px",
                                      }}
                                    ></div>
                                    <Text
                                      style={{
                                        fontSize: "13px",
                                        marginRight: "12px",
                                        color: "#6b7280",
                                      }}
                                    >
                                      Giá đề xuất:
                                    </Text>
                                  </div>
                                  <Text
                                    strong
                                    style={{
                                      fontSize: "15px",
                                      color: "#059669",
                                    }}
                                  >
                                    {PriceUtils.displayVND(
                                      partnerApplyInfo.negotiatePrice
                                    ) || "Giá đề xuất"}
                                  </Text>
                                </div>

                                <div style={{ marginBottom: "12px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "4px",
                                        height: "16px",
                                        background: "#3b82f6",
                                        borderRadius: "2px",
                                      }}
                                    ></div>
                                    <Text
                                      style={{
                                        fontSize: "13px",
                                        color: "#6b7280",
                                      }}
                                    >
                                      Thời gian thực hiện
                                    </Text>
                                    <Text
                                      strong
                                      style={{
                                        fontSize: "14px",
                                        color: "#1f2937",
                                      }}
                                    >
                                      {datetimeUtils
                                        .getMoment(
                                          partnerApplyInfo.startDate || "",
                                          datetimeUtils.BACKEND_DATE_TIME
                                        )
                                        ?.format(datetimeUtils.LOCAL_DATE) ||
                                        "Bắt đầu"}
                                      {" - "}
                                      {datetimeUtils
                                        .getMoment(
                                          partnerApplyInfo.endDate || "",
                                          datetimeUtils.BACKEND_DATE_TIME
                                        )
                                        ?.format(datetimeUtils.LOCAL_DATE) ||
                                        "Kết thúc"}
                                    </Text>
                                  </div>
                                </div>

                                <div style={{ marginBottom: "16px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "4px",
                                        height: "16px",
                                        background: "#f59e0b",
                                        borderRadius: "2px",
                                      }}
                                    ></div>
                                    <Text
                                      style={{
                                        fontSize: "13px",
                                        color: "#6b7280",
                                      }}
                                    >
                                      Số lần nghiệm thu
                                    </Text>
                                    <Text
                                      strong
                                      style={{
                                        fontSize: "14px",
                                        color: "#1f2937",
                                      }}
                                    >
                                      {partnerApplyInfo.numberAccept ||
                                        "Số lần nghiệm thu"}
                                    </Text>
                                  </div>
                                </div>

                                {!isEmpty(partnerApplyInfo?.description) && (
                                  <div>
                                    <Text
                                      strong
                                      style={{
                                        fontSize: "14px",
                                        color: "#1f2937",
                                        marginBottom: "8px",
                                        display: "block",
                                      }}
                                    >
                                      Đề xuất:
                                    </Text>

                                    <Paragraph
                                      style={{
                                        fontSize: 13,
                                        lineHeight: 1.5,
                                        margin: 0,
                                      }}
                                      ellipsis={{ rows: 2 }}
                                    >
                                      {partnerApplyInfo?.description || ""}
                                    </Paragraph>

                                    {/* <Button
                                      type="link"
                                      style={{ padding: 0, marginTop: 4 }}
                                      onClick={() =>
                                        handleSelectPartner(partnerApplyInfo)
                                      }
                                    >
                                      Xem chi tiết đề xuất
                                    </Button> */}
                                  </div>
                                )}
                              </>
                            );
                          } else {
                            const latestDealOfPartner = dealOfPartner[0];

                            return (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    marginBottom: "12px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "4px",
                                        height: "16px",
                                        background: "#10b981",
                                        borderRadius: "2px",
                                      }}
                                    ></div>
                                    <Text
                                      style={{
                                        fontSize: "13px",
                                        marginRight: "12px",
                                        color: "#6b7280",
                                      }}
                                    >
                                      Giá đề xuất:
                                    </Text>
                                  </div>
                                  <Text
                                    strong
                                    style={{
                                      fontSize: "15px",
                                      color: "#059669",
                                    }}
                                  >
                                    {PriceUtils.displayVND(
                                      latestDealOfPartner.negotiatePrice
                                    ) || "Giá đề xuất"}
                                  </Text>
                                </div>

                                <div style={{ marginBottom: "12px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "4px",
                                        height: "16px",
                                        background: "#3b82f6",
                                        borderRadius: "2px",
                                      }}
                                    ></div>
                                    <Text
                                      style={{
                                        fontSize: "13px",
                                        color: "#6b7280",
                                      }}
                                    >
                                      Thời gian thực hiện
                                    </Text>
                                    <Text
                                      strong
                                      style={{
                                        fontSize: "14px",
                                        color: "#1f2937",
                                      }}
                                    >
                                      {datetimeUtils
                                        .getMoment(
                                          latestDealOfPartner.startDate,
                                          datetimeUtils.BACKEND_DATE_TIME
                                        )
                                        ?.format(datetimeUtils.LOCAL_DATE) ||
                                        "Bắt đầu"}
                                      {" - "}
                                      {datetimeUtils
                                        .getMoment(
                                          latestDealOfPartner.endDate,
                                          datetimeUtils.BACKEND_DATE_TIME
                                        )
                                        ?.format(datetimeUtils.LOCAL_DATE) ||
                                        "Kết thúc"}
                                    </Text>
                                  </div>
                                </div>

                                <div style={{ marginBottom: "16px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "4px",
                                        height: "16px",
                                        background: "#f59e0b",
                                        borderRadius: "2px",
                                      }}
                                    ></div>
                                    <Text
                                      style={{
                                        fontSize: "13px",
                                        color: "#6b7280",
                                      }}
                                    >
                                      Số lần nghiệm thu
                                    </Text>
                                    <Text
                                      strong
                                      style={{
                                        fontSize: "14px",
                                        color: "#1f2937",
                                      }}
                                    >
                                      {latestDealOfPartner.numberAccept ||
                                        "Số lần nghiệm thu"}
                                    </Text>
                                  </div>
                                </div>

                                <div>
                                  <Text
                                    strong
                                    style={{
                                      fontSize: "14px",
                                      color: "#1f2937",
                                      marginBottom: "8px",
                                      display: "block",
                                    }}
                                  >
                                    Đề xuất:
                                  </Text>

                                  <Paragraph
                                    style={{
                                      fontSize: 13,
                                      lineHeight: 1.5,
                                      margin: 0,
                                    }}
                                    ellipsis={{ rows: 2 }}
                                  >
                                    {latestDealOfPartner?.description || ""}
                                  </Paragraph>

                                  <Button
                                    type="link"
                                    style={{ padding: 0, marginTop: 4 }}
                                    onClick={() =>
                                      handleSelectPartner(partnerApplyInfo)
                                    }
                                  >
                                    Xem chi tiết đề xuất
                                  </Button>
                                </div>
                              </>
                            );
                          }
                        })()}
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  
  if (!userProjectBids || userProjectBids?.length === 0) {
    return (
      <div className="jobPartContainer">
        <div className="jobPartTitleContainer">
          <div className="jobPartTitle">Danh sách đối tác</div>
        </div>
        <div className="jobPartContentContainer">
          <Alert
            message="Chưa có đối tác nào ứng tuyển cho công việc này"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        </div>
      </div>
    );
  }

  // ------------------------------------

  if (!userProjectBids || userProjectBids?.length === 0) {
    return (
      <div className="jobPartContainer">
        <div className="jobPartTitleContainer">
          <div className="jobPartTitle">Danh sách đối tác</div>
        </div>
        <div className="jobPartContentContainer">
          <Alert
            message="Chưa có đối tác nào ứng tuyển cho công việc này"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        </div>
      </div>
    );
  }

  // 🟢 Dùng isDesktop đã được tính toán
  const width = isDesktop ? "49%" : "100%";

  return (
    <div>
      <div className="jobPartContainer">
        <Row
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
          className="jobPartTitleContainer"
        >
          <div className="jobPartTitle">
            Danh sách đối tác ({userProjectBids?.length})
          </div>
          <Row>
            <Col>
              <Select
                style={{ marginRight: "8px" }}
                placeholder="Sắp xếp theo"
                options={[
                  { label: "Ngày bắt đầu", value: SortPartnerEnum.START_DATE },
                  { label: "Ngày kết thúc", value: SortPartnerEnum.END_DATE },
                  { label: "Giá đề xuất", value: SortPartnerEnum.PRICE },
                  { label: "Đánh giá", value: SortPartnerEnum.RATING },
                ]}
                value={sort.field}
                defaultValue={SortPartnerEnum.PRICE}
                onChange={(value: SortPartnerEnum) =>
                  setSort({ ...sort, field: value })
                }
              />
              <Select
                value={sort.order}
                placeholder="Thứ tự"
                options={[
                  {
                    label: includes(
                      [SortPartnerEnum.START_DATE, SortPartnerEnum.END_DATE],
                      sort.field
                    )
                      ? "Xa nhất"
                      : "Cao",
                    value: -1,
                  },
                  {
                    label: includes(
                      [SortPartnerEnum.START_DATE, SortPartnerEnum.END_DATE],
                      sort.field
                    )
                      ? "Gần nhất"
                      : "Thấp",
                    value: 1,
                  },
                ]}
                onChange={(value: number) => setSort({ ...sort, order: value })}
              />
            </Col>
          </Row>
        </Row>
        <div className="jobPartContentContainer">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {sortedBids
              ?.slice((currentPage - 1) * 4, currentPage * 4)
              ?.map((item, index) => {
                const expand = expandedItems[index] || false;

                return (
                  <div
                    style={{
                      width,
                      position: "relative",
                      transition: "0.5s",
                    }}
                    key={index}
                    className="p-4 rounded-md"
                    // onClick={() => {
                    //   // 🟢 Dùng optional chaining
                    //   const partnerId = item?.user?.partner?.id;
                    //   const partnerFullName = item?.user?.fullName;
                    //   if (!partnerId) return;

                    //   const routerr = `/partners/${kebabCase(
                    //     trim(partnerFullName || "")
                    //   )}.${partnerId}`;

                    //   if (typeof window !== "undefined") {
                    //     window.open(routerr, "_blank");
                    //   }
                    // }}
                  >
                    <div
                      style={{
                        height: "-webkit-fill-available",
                      }}
                    >
                      {renderPartnerItem(item, index, expand)}
                      {!isDesktop && (
                        <button
                          aria-label="Expand"
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện click cha
                            toggleExpand(index);
                          }}
                          style={{
                            width: "100%",
                            height: "36px",
                            transition: "0.5s",
                            marginTop: "8px",
                            zIndex: 50,
                          }}
                        >
                          {!expand ? "Mở rộng" : "Thu gọn"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Pagination */}
            <Pagination
              current={currentPage}
              pageSize={4}
              total={userProjectBids?.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              hideOnSinglePage={true}
              className="flex justify-center mt-4"
              style={{ marginTop: "16px" }}
            />
          </div>

          <PartnerInfoModal
            ref={partnerInfoModalRef}
            partnerDetail={selectedPartnerInfo}
            isRate={isRate}
          />

          <SendOfferToPartnerModal
            fullJobResource={fullJobResource!} // Giữ nguyên ! vì nó được kiểm tra ở phần trên
            ref={sendOfferModalRef}
            jobId={fullJobResource?.jobId}
            onSuccess={handleSendOfferSuccess}
          />
        </div>
      </div>
    </div>
  );
}

export default JobPartner;

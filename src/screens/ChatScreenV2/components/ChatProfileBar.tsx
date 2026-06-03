import type React from "react";
import { Star } from "lucide-react";
import { Typography, Col } from "antd";
import RippleButton from "./RippleButton";
import { useRef, useState } from "react";
import ClientConfirmOfferModal, {
  ClientConfirmOfferModalHelperVisible,
} from "../modals/ClientConfirmOfferModal";
import ClientCancelOfferModal, {
  ClientCancelOfferModalHelperVisible,
} from "../modals/ClientCancelOfferModal";
import PriceUtils from "@/src/utils/PriceUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import ClientSendOfferOrConfirmModal, {
  ClientSendOfferOrConfirmModalHelperVisible,
} from "../modals/ClientSendOfferOrConfirmModal";
import { RoomInfoDetailResource } from "@/src/data/message/models/message.types";
import { FullProfileResource } from "@/src/data/auth/models/types";
import PartnerServices from "@/src/data/partner/services/PartnerServices";
import { PartnerDetailResource } from "@/src/data/partner/models/partner.types";
import PartnerInfoModal, {
  PartnerInfoModalRef,
} from "../../JobScreen/JobDetailScreen/modals/PartnerInfoModal";
import PartnerSendOfferOrConfirmModal, {
  PartnerSendOfferOrConfirmModalHelperVisible,
} from "../modals/PartnerSendOfferOrConfirmModal";
import Constants from "@/src/constants/Constants";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { useRouter } from "next/router";
import { SharedMediaGallery } from "./SharedMediaGallery";
import { useAccountContext } from "@/src/contexts/AccountContext";
import PricingRouteUtils from "@/src/data/pricing/utils/PricingRouteUtils";
import BackendJobServices from "@/src/data/job/services/BackendJobServices";
import useSelectedJob from "../../JobScreen/JobDetailScreen/hooks/useSelectedJob";

interface ChatProfileSidebarProps {
  roomId: string;
  currentUserId: number;
  chatReceiverInfo: RoomInfoDetailResource | undefined;
  key?: number;
  disabled?: boolean;
}

export const ChatProfileSidebar: React.FC<ChatProfileSidebarProps> = ({
  roomId,
  currentUserId,
  chatReceiverInfo,
  key,
  disabled
}) => {
  const router = useRouter();

  const clientSendOfferOrConfirmModalRef =
    useRef<ClientSendOfferOrConfirmModalHelperVisible>(null);

  const partnerSendOfferOrConfirmModalRef =
    useRef<PartnerSendOfferOrConfirmModalHelperVisible>(null);

  const cancelContractModalRef =
    useRef<ClientCancelOfferModalHelperVisible>(null);

  const isPartner = currentUserId === chatReceiverInfo?.partnerId;

  // const [fullJobResource] = await Promise.all([
  //   new BackendJobServices(context).getFullInfo(jobId),

  const fullJobResource = useSelectedJob(
    chatReceiverInfo?.projectId || 0,
    {
      // initData: {
      // },
    },
    0
  );

  const handleDisagreeClick = () => {
    if (chatReceiverInfo) {
      cancelContractModalRef.current?.open(chatReceiverInfo);
    }
  };

  const handleClientSendOfferClick = () => {
    if (chatReceiverInfo) {
      clientSendOfferOrConfirmModalRef.current?.open(chatReceiverInfo);
    }
  };

  const handlePartnerSendOfferClick = () => {
    if (chatReceiverInfo) {
      partnerSendOfferOrConfirmModalRef.current?.open(chatReceiverInfo);
    }
  };

  const partnerInfoModalRef = useRef<PartnerInfoModalRef>(null);
  const [selectedPartnerInfo, setSelectedPartnerInfo] =
    useState<PartnerDetailResource | null>(null);
  const [isRate, setIsRate] = useState(false);
  const [loadingPartnerInfo, setLoadingPartnerInfo] = useState(false);
  const handleViewPartnerInfo = async () => {
    if (!chatReceiverInfo?.partnerId) return;
    try {
      setLoadingPartnerInfo(true);
      const partnerInfo = await new PartnerServices().getFullInfo(
        chatReceiverInfo?.partnerId
      );
      setSelectedPartnerInfo(partnerInfo as PartnerDetailResource);
      partnerInfoModalRef.current?.open();
    } catch (error) {
      console.error("Error fetching partner info:", error);
    } finally {
      setLoadingPartnerInfo(false);
    }
  };
  const { auth: fullProfileResource } = useAccountContext();

  const handleViewJobDetail = () => {
    if (chatReceiverInfo?.projectId) {
      router.push(
        JobRouteUtils.toJobDetailUrlFromChat(
          chatReceiverInfo.projectId,
          chatReceiverInfo.projectName
        )
      );
    }
  };

  const shouldShowOfferButton =
    chatReceiverInfo?.projectStatus === Constants.JOB.STATUS.CHO_UNG_TUYEN;

  const latestDeal = chatReceiverInfo?.userProjectBids?.userProjectDeals?.[0];
  const isPayment =
    fullProfileResource?.userId == chatReceiverInfo?.clientId &&
    chatReceiverInfo?.projectStatus === Constants.JOB.STATUS.TAM_UNG_THANH_TOAN;


  const getStatusButton = () => {
    if (!latestDeal || !shouldShowOfferButton) return null;

    if (!isPartner) {
      if (
        latestDeal.type === Constants.JOB.OFFER.TYPE.CLIENT &&
        latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE
      ) {
        return (
          <RippleButton
            variant="waiting"
            style={{ marginTop: 10 }}
            onClick={handleClientSendOfferClick}
          >
            Chờ phản hồi
          </RippleButton>
        );
      }

      if (
        latestDeal.type === Constants.JOB.OFFER.TYPE.PARTNER &&
        latestDeal.dealStatus === Constants.JOB.OFFER.DEAL_STATUS.ACCEPTED
      ) {
        return (
          <RippleButton
            variant="agree"
            style={{ marginTop: 10 }}
            onClick={handleClientSendOfferClick}
          >
            Chờ xác nhận
          </RippleButton>
        );
      }
    } else {
      if (
        latestDeal.type === Constants.JOB.OFFER.TYPE.PARTNER &&
        latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE
      ) {
        return (
          <RippleButton
            variant="waiting"
            style={{ marginTop: 10 }}
            onClick={handlePartnerSendOfferClick}
          >
            Chờ phản hồi
          </RippleButton>
        );
      }
    }

    return null;
  };

  const getJobStatusMessage = () => {
    const projectStatus = chatReceiverInfo?.projectStatus;

    if (projectStatus === Constants.JOB.STATUS.TAM_UNG_THANH_TOAN) {
      if (!isPartner) {
        return "Chuyển đến trang chi tiết công việc để xem thông tin giao dịch";
      } else {
        return "Đang chờ khách hàng thanh toán";
      }
    }

    if (projectStatus === Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN) {
      if (!isPartner) {
        return "Đang chờ đối tác xác nhận thực hiện công việc";
      } else {
        return "Chuyển đến trang chi tiết công việc để xác nhận và bắt đầu công việc";
      }
    }

    if (projectStatus === Constants.JOB.STATUS.DA_KY_HOP_DONG) {
      return "Công việc đang được thực hiện";
    }

    if (projectStatus === Constants.JOB.STATUS.CHO_NGHIEM_THU) {
      return "Công việc đang chờ nghiệm thu";
    }

    if (projectStatus === Constants.JOB.STATUS.DUYET_HOAN_THANH_CV) {
      return "Công việc đã hoàn thành";
    }

    return null;
  };

  const renderJobSection = () => {
    const statusMessage = getJobStatusMessage();
    const shouldShowMessage = [
      Constants.JOB.STATUS.TAM_UNG_THANH_TOAN,
      Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN,
      Constants.JOB.STATUS.DA_KY_HOP_DONG,
      Constants.JOB.STATUS.CHO_NGHIEM_THU,
      Constants.JOB.STATUS.DUYET_HOAN_THANH_CV,
    ].includes(chatReceiverInfo?.projectStatus || 0);

    return (
      <div
        style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: "#f0f8ff",
          borderRadius: 8,
        }}
      >
        {shouldShowMessage && statusMessage && (
          <Typography.Text
            style={{
              display: "block",
              marginBottom: 12,
              fontSize: 14,
              color: "#1890ff",
              fontWeight: 500,
            }}
          >
            {statusMessage}
          </Typography.Text>
        )}

        <RippleButton
          variant="offer"
          style={{
            width: "100%",
            marginBottom: 12,
          }}
          onClick={handleViewJobDetail}
        >
          Xem chi tiết công việc
        </RippleButton>

        {isPayment && (
          <RippleButton
            variant="offer"
            style={{ width: "100%" }}
            onClick={() => {
              const incompleteTransaction =
                fullJobResource?.data?.projectTransactionHistory?.find(
                  (t) =>
                    t.status === Constants.PAYMENT.STATUS.INCOMPLETE ||
                    Constants.PAYMENT.STATUS.REJECT
                );
              router.push(
                PricingRouteUtils.toPaymentJobsUrl(incompleteTransaction as any)
              ); // }
            }}
          >
            Thanh toán
          </RippleButton>
        )}
      </div>
    );
  };

  const statusButton = getStatusButton();
  const shouldShowStatusButton = !!statusButton;

  return (
    <>
      <Col
        xs={24} // ✅ Mobile: full width
        sm={24} // ✅ Small tablet: full width
        md={24} // ✅ Medium tablet: full width
        lg={24} // ✅ Desktop nhỏ: full width
        xl={6} // ✅ Desktop lớn: chia nửa
        xxl={6} // ✅ Ultra-wide: chia nửa
        span={6}
        style={{
          height: "100%",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          borderLeft: "1px solid #f0f0f0",
          backgroundColor: "#fafafa",
          boxSizing: "border-box",
          overflowY: "auto",
          overscrollBehavior: "contain",
        }}
      >
        <div
          style={{
            paddingTop: "24px",
            paddingBottom: "24px",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div style={{ paddingLeft: "12px", paddingRight: "12px" }}>
              <Typography.Title
                level={4}
                style={{ marginBottom: "5px", fontSize: "18px" }}
              >
                Thông tin về {!isPartner ? "đối tác" : "khách hàng"} <br />
                {!isPartner
                  ? chatReceiverInfo?.partnerName
                  : chatReceiverInfo?.clientName}
              </Typography.Title>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                {!isPartner && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <IconSvgLocal name={"IC_LOCATION"} height={22} width={22} />
                    <Typography.Text style={{ fontSize: "14px" }}>
                      {chatReceiverInfo?.location
                        ?.map((item) => item.name)
                        .join(", ")}
                    </Typography.Text>
                  </div>
                )}

                {!isPartner && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography.Text
                      style={{ color: "#8c8c8c", fontSize: "14px" }}
                    >
                      {!isPartner && "Vị trí công việc"}
                    </Typography.Text>
                    <Typography.Text style={{ fontSize: "14px" }}>
                      {/* {isPartner ? partner.jobPosition : "12 công việc"} */}
                      {chatReceiverInfo?.position}
                    </Typography.Text>
                  </div>
                )}

                {!isPartner && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography.Text
                      style={{ color: "#8c8c8c", fontSize: "14px" }}
                    >
                      {!isPartner && "Đánh giá"}
                    </Typography.Text>
                    {/* {isPartner ? ( */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Star
                        size={16}
                        style={{ color: "#fadb14", fill: "#fadb14" }}
                      />
                      <Typography.Text strong style={{ fontSize: "14px" }}>
                        {chatReceiverInfo?.rate}
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontSize: "14px", color: "#8c8c8c" }}
                      >
                        {/* ({partner.reviewCount}) */}
                      </Typography.Text>
                    </div>
                    {/* ) : (
                      <Typography.Text style={{ fontSize: "14px" }}>
                        8 đối tác
                      </Typography.Text>
                    )} */}
                  </div>
                )}
              </div>

              {/* TextButton */}
              {/* {!isPartner && (
                <div style={{ marginTop: "16px", textAlign: "left" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1890ff",
                      fontSize: "13px",
                      fontWeight: "600",
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: "0",
                      letterSpacing: "0.5px",
                    }}
                    onClick={() => {
                      setIsRate(true);
                      handleViewPartnerInfo()
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#40a9ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#1890ff";
                    }}
                  >
                    XEM TOÀN BỘ HỒ SƠ VỀ ĐỐI TÁC
                  </button>
                </div>
              )} */}
            </div>

            {/* Job Info */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #f0f0f0",
                borderRadius: "6px",
                padding: "12px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                textAlign: "center",
              }}
            >
              <Typography.Text
                strong
                style={{
                  fontSize: "15px",
                  color: "#262626",
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                {chatReceiverInfo?.projectName.toUpperCase()}
              </Typography.Text>
              <Typography.Text
                style={{
                  fontSize: "13px",
                  color: "#595959",
                  lineHeight: "1.5",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: chatReceiverInfo?.projectDes || "",
                  }}
                />
                {/* {chatReceiverInfo?.projectDes} */}
              </Typography.Text>
            </div>

            {/* Suggested Price */}
            {/* <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #f0f0f0",
                borderRadius: "6px",
                padding: "12px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                display: "flex",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography.Text
                strong
                style={{
                  fontSize: "15px",
                  color: "#262626",
                  fontWeight: "bold",
                }}
              >
                {isPartner ? "GIÁ ĐỐI TÁC ĐỀ XUẤT" : "GIÁ KHÁCH HÀNG ĐỀ XUẤT:"}
              </Typography.Text>
              <Typography.Text
                strong
                style={{ fontSize: "15px", color: "#52c41a" }}
              >
                {PriceUtils.displayVND(chatReceiverInfo?.userProjectBids?.negotiatePrice)}
                {"SuggestPrice"}
              </Typography.Text>
            </div> */}

            {/* Job Suggestion */}
            {/* <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #f0f0f0",
                borderRadius: "6px",
                padding: "12px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                textAlign: "center",
              }}
            >
              <Typography.Text
                strong
                style={{
                  fontSize: "15px",
                  color: "#262626",
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Thư ứng tuyển của Đối Tác
              </Typography.Text>
              <Typography.Text
                style={{
                  fontSize: "13px",
                  color: "#595959",
                  lineHeight: "1.5",
                }}
              >
                {chatReceiverInfo?.userProjectBids?.applicationLetter}
                {"Partner's suggestion"}
              </Typography.Text>
            </div> */}
          </div>

          {renderJobSection()}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "16px",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
          >
            {/* <RippleButton variant="disagree" onClick={handleDisagreeClick}>
              Disagree
            </RippleButton> */}

            {statusButton}

            {!disabled && !shouldShowStatusButton && !isPartner && shouldShowOfferButton && (
              <RippleButton
                variant="offer"
                onClick={handleClientSendOfferClick}
              >
                Xem đề xuất
              </RippleButton>
            )}

            {!disabled && !shouldShowStatusButton &&
              isPartner &&
              shouldShowOfferButton &&
              chatReceiverInfo?.userProjectBids?.userProjectDeals.length !==
                0 && (
                <RippleButton
                  variant="offer"
                  onClick={handlePartnerSendOfferClick}
                >
                  Xem đề xuất
                </RippleButton>
              )}
          </div>
          <SharedMediaGallery
            // loading
            key={key || 0}
            roomId={roomId}
            // loading={false}
          />
        </div>
      </Col>

      {/* Modals */}
      <ClientSendOfferOrConfirmModal
        ref={clientSendOfferOrConfirmModalRef as any}
        isClientRole={!isPartner}
        roomId={roomId}
        userProjectBids={chatReceiverInfo?.userProjectBids}
        projectId={chatReceiverInfo?.projectId}
        projectName={chatReceiverInfo?.projectName}
      />

      <PartnerSendOfferOrConfirmModal
        ref={partnerSendOfferOrConfirmModalRef as any}
        isPartnerRole={isPartner}
        roomId={roomId}
        userProjectBids={chatReceiverInfo?.userProjectBids}
        projectId={chatReceiverInfo?.projectId}
        projectName={chatReceiverInfo?.projectName}
      />

      <ClientCancelOfferModal ref={cancelContractModalRef} />
      <PartnerInfoModal
        ref={partnerInfoModalRef}
        partnerDetail={selectedPartnerInfo}
        isRate={isRate}
      />
    </>
  );
};

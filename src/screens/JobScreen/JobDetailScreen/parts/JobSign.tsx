import React, { useEffect, useRef, useState } from "react";
import {
    Avatar,
    Button,
    Col,
    Empty,
    Modal,
    Rate,
    Row,
    Space,
    Table,
    Typography,
} from "antd";
import UploadContractModal from "../../modals/UploadContractModal";
import { ModalizeHelperVisible } from "@/src/data/base/models/base.types";
import {
    ConfirmedProjectInfoResource,
    FullJobResource,
    JobContractResource,
    UserProjectBidResource,
} from "@/src/data/job/models/job.types";
import {
    MessageOutlined,
    StarFilled,
    ProjectFilled,
    DownloadOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
    FileImageOutlined,
    FileOutlined,
    FileWordOutlined,
} from "@ant-design/icons";
import { JobDetailComponentProps } from "../JobDetailScreen";
import _, { has, includes, isEmpty, toNumber, toString } from "lodash";
import dynamic from "next/dynamic";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import PriceUtils from "@/src/utils/PriceUtils";
import Images from "@/src/constants/Images";
import PartnerServices from "@/src/data/partner/services/PartnerServices";
import PartnerInfoModal, {
    PartnerInfoModalRef,
} from "../modals/PartnerInfoModal";
import { PartnerDetailResource } from "@/src/data/partner/models/partner.types";
import useDetectDevice from "@/src/hooks/useDetectDevice";
import Constants from "@/src/constants/Constants";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import PartnerConfirmModal, {
    PartnerConfirmModalHelperVisible,
} from "../modals/PartnerConfirmModal";
import NumberUtils from "@/src/utils/NumberUtils";

const { Text, Paragraph } = Typography;

function JobSign(props: JobDetailComponentProps) {
    const uploadContractModal = useRef<ModalizeHelperVisible>(null);
    const [partnerInfo, setPartnerInfo] = useState<any>(null);
    const [selectedPartnerInfo, setSelectedPartnerInfo] =
        useState<PartnerDetailResource | null>(null);
    const [loadingPartnerInfo, setLoadingPartnerInfo] = useState(false);
    const partnerInfoModalRef = useRef<PartnerInfoModalRef>(null);
    const partnerConfirmModalRef = useRef<PartnerConfirmModalHelperVisible>(null);
    const { isMobile, isDesktop } = useDetectDevice();
    const [isRate, setIsRate] = useState(false);

    const { jobQuery, isCreated, isPartner } = props;
    // const fullJobResource: FullJobResource = jobQuery.data;
    // const contractResources = fullJobResource.contracts;
    const fullJobResource: FullJobResource | undefined = jobQuery.data;

    const handleSendConfirmSuccess = async () => {
        await jobQuery.refetch?.();
    };

    const contractResources = fullJobResource?.contracts || [];

    // const partnerResource = fullJobResource.partnerUserId;

    const [contract, setContract] = useState<JobContractResource | null>(
        _.get(contractResources, 0)
    );

    const isPdfExtension = (contract?.fileUrl || "").includes(".pdf");

    useEffect(() => {
        setPartnerInfo(fullJobResource?.isApply?.user);
    }, [fullJobResource]);

    const viewPartnerInfo = async (partnerId: number | undefined | null) => {
        if (!partnerId) return;
        try {
            setLoadingPartnerInfo(true);
            const partnerInfo = await new PartnerServices().getFullInfo(partnerId);
            setSelectedPartnerInfo(partnerInfo as PartnerDetailResource);
            partnerInfoModalRef.current?.open();
        } catch (error) {
            console.error("Error fetching partner info:", error);
        } finally {
            setLoadingPartnerInfo(false);
        }
    };

    const getFileIconAndColor = (fileName: string) => {
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
                window.open(url, "_blank");
            },
        });
    };

    const STATUS_APPLY = new Map(
        Constants.PARTNER.STATUS_APPLY.map((item) => [
            item.key,
            { value: item.value, color: item.color, colorBlur: item.colorBlur },
        ])
    );

    let confirmedInfo: ConfirmedProjectInfoResource | null = null;
    try {
        if (fullJobResource?.confirmInfo) {
            confirmedInfo = JSON.parse(fullJobResource.confirmInfo);
        }
    } catch (error) {
        console.error("Error parsing confirmInfo:", error);
    }

    const renderPartnerItem = (partnerApplyInfo: UserProjectBidResource) => {
        const status = STATUS_APPLY.get(toString(partnerApplyInfo?.status));
        // const buttonState = getButtonConfirmState(partnerApplyInfo);

        return (
            <div
                style={{
                    position: "relative",
                    padding: "0",
                    width: "100%",
                    height: "100%",
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
                    }}
                >
                    {STATUS_APPLY.get(toString(partnerApplyInfo?.status))?.value}
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
                                ...(isMobile()
                                    ? {
                                        paddingTop: "40px",
                                    }
                                    : {}),
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
                                        // marginBottom: "12px",
                                    }}
                                >
                                    <Avatar
                                        size={64}
                                        src={
                                            partnerApplyInfo?.user?.avatarUrl || Images.ACCOUNT_DEFAULT
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
                                        {partnerApplyInfo?.user?.fullName}
                                    </Text>

                                    <div
                                        style={{
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            color: "#374151",
                                            marginBottom: "-2px",
                                        }}
                                    >
                                        {partnerApplyInfo?.user?.partner?.position || "Đối tác"}
                                    </div>
                                    <div>
                                        <Rate
                                            allowHalf
                                            disabled
                                            defaultValue={NumberUtils.display(
                                                partnerApplyInfo?.user?.partner?.rate || 0
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
                                }}
                            >
                                <Button
                                    type="primary"
                                    loading={loadingPartnerInfo}
                                    onClick={() =>
                                        viewPartnerInfo(partnerApplyInfo?.user?.partner?.id)
                                    }
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
                            </div>

                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    gap: isDesktop() ? "36px" : "16px",
                                    ...(isMobile()
                                        ? {
                                            flexDirection: "column",
                                        }
                                        : {}),
                                }}
                            >
                                {/* Proposal Details */}

                                {/* Stats and Skills */}
                                <div
                                    style={{
                                        flex: 1,
                                    }}
                                    className="flex-1"
                                >
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
                                            {<div
                                                style={{
                                                    background: "#f9fafb",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "8px",
                                                    padding: "12px",
                                                    maxHeight: "80px",
                                                    overflowY: "auto",
                                                }}
                                            >
                                                <Paragraph
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        lineHeight: "1.5",
                                                    }}
                                                >
                                                    {partnerApplyInfo?.applicationLetter || "Không có dữ liệu"}
                                                </Paragraph>
                                            </div>}
                                        </div>
                                    </div>

                                    {partnerApplyInfo?.projectBidFiles &&
                                        partnerApplyInfo?.projectBidFiles.length > 0 && (
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
                                                <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                                                    {partnerApplyInfo.projectBidFiles.map(
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
                                                                        <div style={{ color, fontSize: "18px" }}>
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
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>

                                {partnerApplyInfo?.status !==
                                    Constants.PARTNER.STATUS_APPLY_KEY.INVITED &&
                                    partnerApplyInfo?.status !==
                                    Constants.PARTNER.STATUS_APPLY_KEY.PARTNER_REJECT && (
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
                                                Thông tin xác nhận:
                                            </h4>

                                            {
                                                confirmedInfo && (
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
                                                                style={{ fontSize: "15px", color: "#059669" }}
                                                            >
                                                                {PriceUtils.displayVND(
                                                                    confirmedInfo.Project.price
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
                                                                            confirmedInfo.Project.start_date,
                                                                            datetimeUtils.BACKEND_DATE_TIME
                                                                        )
                                                                        ?.format(datetimeUtils.LOCAL_DATE) ||
                                                                        "Bắt đầu"}
                                                                    {" - "}
                                                                    {datetimeUtils
                                                                        .getMoment(
                                                                            confirmedInfo.Project.end_date,
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
                                                                    {confirmedInfo.Project.number_accept ||
                                                                        "Số lần nghiệm thu"}
                                                                </Text>
                                                            </div>
                                                        </div>

                                                        {/* <div>
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
                                                                <div
                                                                    style={{
                                                                        background: "#f9fafb",
                                                                        border: "1px solid #e5e7eb",
                                                                        borderRadius: "8px",
                                                                        padding: "12px",
                                                                        maxHeight: "80px",
                                                                        overflowY: "auto",
                                                                    }}
                                                                >
                                                                    <Paragraph
                                                                        style={{
                                                                            margin: 0,
                                                                            fontSize: "13px",
                                                                            lineHeight: "1.5",
                                                                        }}
                                                                    >
                                                                        {partnerApplyInfo?.description || ""}
                                                                    </Paragraph>
                                                                </div>
                                                            </div> */}
                                                    </>
                                                )
                                            }
                                        </div>
                                    )}
                            </div>

                            {/* Action Button */}
                            {/* */}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handlePartnerConfirm = () => {
        const confirmInfo = {
            userId: fullJobResource?.isApply?.userId,
            partnerId: fullJobResource?.isApply?.user?.partner?.id,
            partnerName: fullJobResource?.isApply?.user?.fullName,
            projectName: fullJobResource?.name,
            startDate: fullJobResource?.isApply?.startDate || "",
            endDate: fullJobResource?.isApply?.endDate || "",
            negotiatePrice: fullJobResource?.isApply?.negotiatePrice || 0,
            numberAccept: fullJobResource?.isApply?.numberAccept || 1,
            description: fullJobResource?.description,
            suggestion: fullJobResource?.isApply?.applicationLetter,
            deviceId: "",
            deviceName: "",
            platform: "WEB",
        };

        partnerConfirmModalRef.current?.open(confirmInfo);
    };


    return (
        <div>
            {isCreated && (
                <div className={"jobPartContainer"}>
                    <Row
                        className="jobPartTitleContainer"
                        align={"middle"}
                        justify={"space-between"}
                    >
                        <div className="jobPartTitle">Thông tin đối tác</div>
                    </Row>

                    {fullJobResource?.isApply !== null &&
                        renderPartnerItem(
                            fullJobResource?.isApply as unknown as UserProjectBidResource
                        )}

                    <PartnerInfoModal
                        ref={partnerInfoModalRef}
                        partnerDetail={selectedPartnerInfo}
                    />
                </div>
            )}

            {!isCreated &&
                fullJobResource?.status === Constants.JOB.STATUS.TAM_UNG_THANH_TOAN && (
                    <div className={"jobPartContainer"}>
                        <div
                            className="jobPartContentContainer"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "20px",
                                minHeight: "100px",
                            }}
                        >
                            <p style={{ marginBottom: "16px", fontSize: "16px" }}>
                                Đang chờ khách hàng thanh toán.
                            </p>
                        </div>
                    </div>
                )
            }

            {!isCreated &&
                fullJobResource?.status === Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN && (
                    <div className={"jobPartContainer"}>
                        <Row
                            className="jobPartTitleContainer"
                            align={"middle"}
                            justify={"space-between"}
                        >
                            <div className="jobPartTitle">Xác nhận thực hiện công việc</div>
                        </Row>

                        <div
                            className="jobPartContentContainer"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "20px",
                                minHeight: "100px",
                            }}
                        >
                            <p style={{ marginBottom: "16px", fontSize: "16px" }}>
                                Khách hàng đã thanh toán cho iAgree. Vui lòng xác nhận thực hiện
                                để bắt đầu công việc.
                            </p>

                            <Row justify="center" gutter={16}>
                                <Space>
                                    <Button
                                        type="primary"
                                        size="middle"
                                        onClick={() => handlePartnerConfirm()}
                                        disabled={
                                            fullJobResource?.status !== Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN
                                        }
                                    >
                                        {fullJobResource?.status === Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN
                                            ? "Xác nhận"
                                            : "Đã xác nhận"}
                                    </Button>

                                    {/* <Button
                                        danger
                                        size="middle"
                                        //   onClick={() => handlePartnerCancel()}
                                        disabled={
                                            fullJobResource?.status !== Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN
                                        }
                                    >
                                        Hủy
                                    </Button> */}
                                </Space>
                            </Row>
                        </div>
                    </div>
                )
            }

            <div className={"jobPartContainer"}>
                <Row
                    className="jobPartTitleContainer"
                    align={"middle"}
                    justify={"space-between"}
                >
                    <div className="jobPartTitle">Thông tin đã xác nhận</div>
                </Row>

                <div className="jobPartContentContainer">
                    <Table
                        columns={[
                            // {
                            //     dataIndex: "applicationLetter",
                            //     key: "applicationLetter",
                            //     title: "Đề xuất",
                            //     // render: (value, contractResource: JobContractResource) =>
                            //     //     contractResource.body,
                            // },
                            {
                                dataIndex: "start_date",
                                key: "start_date",
                                title: "Ngày bắt đầu",
                                // render: (value, contractResource: JobContractResource) =>
                                //     contractResource.name,
                            },
                            {
                                dataIndex: "end_date",
                                key: "end_date",
                                title: "Ngày kết thúc",
                                // render: (value, contractResource: JobContractResource) =>
                                //     contractResource.updatedDate,
                            },
                            {
                                dataIndex: "price",
                                key: "price",
                                title: "Thù lao",
                                render: (value: number) => PriceUtils.display(value || 0),
                            },
                            {
                                dataIndex: "number_accept",
                                key: "number_accept",
                                title: "Số lần nghiệm thu",
                                // render: () => fullJobResource?.numberAccept,
                            },
                        ]}
                        locale={{ emptyText: "Không có dữ liệu" }}
                        dataSource={
                            confirmedInfo?.Project ? [confirmedInfo.Project] : []
                        }
                        pagination={false}
                        size={"small"}
                        scroll={{ x: "max-content" }}
                    />
                </div>
            </div>

            {/* <UploadContractModal ref={uploadContractModal} /> */}

            <PartnerConfirmModal
                ref={partnerConfirmModalRef}
                jobId={fullJobResource?.jobId}
                fullJobResource={fullJobResource}
                onSuccess={handleSendConfirmSuccess}
            />
        </div>
    );
}

export default JobSign;

"use client";
import React, {
    useCallback,
    useImperativeHandle,
    useState,
    useEffect,
    useMemo,
    useRef,
} from "react";
import {
    Button,
    Checkbox,
    Form,
    Input,
    Modal,
    Row,
    Typography,
    Col,
    InputNumber,
    DatePicker,
    Steps,
    message,
    Spin,
} from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Constants from "@/src/constants/Constants";
import { ConfirmPartnerParams, FullJobResource } from "@/src/data/job/models/job.types";
import useConfirmPartner from "../hooks/useConfirmPartner";
import { useClientInfo } from "@/src/screens/VerifyOtpScreenV2/hooks/useClientInfo";
import { usePathname } from "next/navigation";

// Dynamic import PDFViewer
const PDFViewer = dynamic(
    async () => {
        const { Document, Page, pdfjs } = await import("react-pdf");
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        return function PDFViewerComponent({
            fileUrl,
            onReachEnd,
        }: {
            fileUrl: string;
            onReachEnd?: () => void;
        }) {
        const [numPages, setNumPages] = useState(0);
        const [loading, setLoading] = useState(true);
        const scrollRef = useRef<HTMLDivElement>(null);

        const handleScroll = () => {
            const div = scrollRef.current;
            if (div && onReachEnd) {
                const { scrollTop, scrollHeight, clientHeight } = div;
                if (scrollTop + clientHeight >= scrollHeight - 10) {
                    onReachEnd();
                }
            }
        };

        const baseUrl = process.env.BASE_URL;

        return (
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className={"hide-scroll"}
                style={{
                    height: "500px",
                    overflowY: "auto",
                    border: "1px solid #d9d9d9",
                    padding: "8px",
                    margin: 0,
                }}
            >
                {/* {loading && (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <Spin />
                    </div>
                )} */}
                {/* <Document
                    file={fileUrl}
                    onLoadSuccess={({ numPages }) => {
                        setNumPages(numPages);
                        setLoading(false);
                    }}
                    onLoadError={(err) => {
                        console.error("Error loading PDF:", err);
                        setLoading(false);
                    }}
                    loading=""
                >
                    {Array.from(new Array(numPages), (_, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={940}
                    />
                    ))}
                </Document> */}

                <iframe
                    src={`${baseUrl}/policy/serviceProvideContract.html`}
                    style={{
                    width: "100%",
                    height: "100%",

                    border: "none",
                    borderRadius: 8,
                    }}
                    title={"form-khach-hang"}
                />
            </div>
        );
        };
    },
    { ssr: false }
);

interface ConfirmInfoResource {
    userId: number | undefined | null;
    partnerId: number | undefined | null;
    partnerName: string | undefined | null;
    projectName: string | undefined | null;
    startDate: string;
    endDate: string;
    negotiatePrice: number;
    numberAccept: number;
    description: string | undefined;
    suggestion: string | undefined | null;
    deviceId: string;
    deviceName: string;
    platform: string;
}

type SendOfferToPartnerModalProps = {
    jobId?: number;
    onSuccess?: () => void;
    fullJobResource?: FullJobResource;
};

export interface PartnerConfirmModalHelperVisible {
    open: (confirmInfo: ConfirmInfoResource) => void;
    close: () => void;
}

const PartnerConfirmModal = React.forwardRef<
    PartnerConfirmModalHelperVisible,
    SendOfferToPartnerModalProps
>(({ jobId, onSuccess, fullJobResource }, ref) => {
    const [currentURL, setCurrentURL] = useState('');
    const pathname = usePathname();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentURL(`${window.location.origin}${pathname}`);
        }
    }, [pathname]);

    const [form] = Form.useForm();
    const [confirmInfo, setConfirmInfo] = useState<ConfirmInfoResource | null>(null);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [canAgree, setCanAgree] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const { clientIp, browserInfo } = useClientInfo();

    const baseUrl = process.env.BASE_URL;
    const pdfLink = `${baseUrl}/policy/serviceProvideContract.html`;

    const open = useCallback((info: ConfirmInfoResource) => {
        setConfirmInfo(info);
        setPdfUrl(pdfLink); // Load PDF ngay khi mở modal
        setAgreeToTerms(false);
        setCanAgree(false);
    }, [pdfLink]);

    const close = useCallback(() => {
        setConfirmInfo(null);
        setPdfUrl("");
        setAgreeToTerms(false);
        setCanAgree(false);
    }, []);

    useImperativeHandle(ref, () => ({ open, close }), [open, close]);

    const confirmOfferMutation = useConfirmPartner(jobId!, '');
    const handleConfirmOffer = useCallback(async () => {
        if (!agreeToTerms) {
            message.error("Vui lòng đồng ý với điều khoản công việc để xác nhận");
            return;
        }
    
        try {
            const applyData = fullJobResource?.isApply;
        
            const dataToSubmit = {
                user_id: applyData?.userId,
                start_date: applyData?.startDate
                    ? dayjs(applyData.startDate).format("YYYY-MM-DD")
                    : null,
                end_date: applyData?.endDate
                    ? dayjs(applyData.endDate).format("YYYY-MM-DD")
                    : null,
                negotiate_price: applyData?.negotiatePrice,
                number_accept: applyData?.numberAccept,
                description: applyData?.applicationLetter,
                client_ip: clientIp,
                device_name: browserInfo?.browser,
                platform: "WEB",
            };

        
            if (jobId) {
                await confirmOfferMutation.mutateAsync(dataToSubmit as unknown as ConfirmPartnerParams);
                close();
                onSuccess?.();
            } else {
                message.error("Không thể xác nhận công việc!");
            }
        } catch (err) {
          console.error("Validation failed:", err);
        }
    }, [
        form,
        close,
        agreeToTerms,
        confirmInfo,
        jobId,
        onSuccess,
        confirmOfferMutation,
    ]);

    return (
        <Modal
            title="Xác nhận thực hiện công việc"
            open={Boolean(confirmInfo)}
            footer={[
                <Button key="cancel" onClick={close} size="large">
                    Hủy
                </Button>,
                <Button
                    key="confirm"
                    type="primary"
                    onClick={handleConfirmOffer}
                    disabled={!agreeToTerms}
                    size="large"
                >
                    Xác nhận
                </Button>
            ]}
            onCancel={close}
            width={900}
            bodyStyle={{ padding: '16px' }}
        >
            <div style={{ marginBottom: 16 }}>
                {pdfUrl && (
                    <PDFViewer 
                        fileUrl={pdfUrl} 
                        onReachEnd={() => setCanAgree(true)} 
                    />
                )}
            </div>

            {/* Checkbox đồng ý điều khoản */}
            <div>
                <Typography.Text strong style={{ color: 'red' }}>
                    Vui lòng đọc hết nội dung để đồng ý.
                </Typography.Text>
                          
                <Checkbox
                    checked={agreeToTerms}
                    disabled={!canAgree}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                >
                    <Typography.Text strong>
                        Tôi đồng ý đã đọc và đồng ý với nội dụng hợp đồng cung cấp dịch ở trên theo ID công việc số {fullJobResource?.jobId} {' '}
                        và <a href={`${baseUrl}/policy/serviceProvideContract.html`} target="_blank">điều khoản dịch vụ</a>
                        <br/>
                        (
                            <Typography.Link
                                href={currentURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: 'inherit',
                                    color: '#1890ff',
                                    textDecoration: 'underline'
                                }}
                                onClick={(e) => e.stopPropagation()} // Prevent checkbox toggle when clicking link
                            >
                                {currentURL}
                            </Typography.Link>
                        )
                    </Typography.Text>
                </Checkbox>
            </div>
        </Modal>
    );
});

PartnerConfirmModal.displayName = "PartnerConfirmModal";
export default PartnerConfirmModal;

import React, { useEffect, useMemo, useState } from "react"; // 🟢 THÊM useEffect và useState
import {
    Button,
    Col,
    Row,
    Space,
    Typography,
    Form,
    Rate,
    Input,
    Upload,
    message,
} from "antd";
import {
    FullJobResource,
} from "../../../../data/job/models/job.types";
import { JobDetailComponentProps } from "../JobDetailScreen";
import _ from "lodash";
import Constants from "@/src/constants/Constants";
import {
    UploadOutlined
} from "@ant-design/icons";
import usePartnerRate from "../../hooks/usePartnerRate";
import { withThemeRevert } from "@/theme";
import { UploadFile } from "antd/lib/upload/interface";

const { Text } = Typography;

function JobRate(props: JobDetailComponentProps) {
    const [form] = Form.useForm();
    const { jobQuery } = props;
    const fullJobResource: FullJobResource | undefined = jobQuery.data;
    
    // 🟢 STATE ĐỂ NGĂN HYDRATION MISMATCH
    const [isClient, setIsClient] = useState(false);

    // 🟢 CHẠY SAU KHI COMPONENT MOUNT THÀNH CÔNG
    useEffect(() => {
        setIsClient(true);
    }, []);

    const agreeMutation = usePartnerRate(
        fullJobResource?.jobId || 0, 
            {
            onSuccess: async () => {
                // 🟢 Dùng optional chaining cho refetch
                await jobQuery.refetch?.(); 
            }
        }
    );

    const handleBeforeUpload = (file: File) => {
        const maxFileSize = Constants.MAX_FILE_SIZE;

        const currentFiles: UploadFile[] = form.getFieldValue('attachment_files') || [];

        const isDuplicate = currentFiles.some(
            (existingFile) =>
                existingFile.name === file.name &&
                existingFile.size === file.size
        );

        if (isDuplicate) {
            message.warning(`Tệp ${file.name} đã tồn tại!`);
            return Upload.LIST_IGNORE;
        }

        if (file.size > maxFileSize) {
            message.error(`File ${file.name} vượt quá ${maxFileSize / 1024 / 1024} MB`);
            return Upload.LIST_IGNORE;
        }

        const updatedFiles = [...currentFiles, file];
        form.setFieldValue('attachment_files', updatedFiles);

        return false;
    }

    const hasPartnerReview = useMemo(() => {
        // 🟢 SỬ DỤNG OPTIONAL CHAINING AN TOÀN
        return fullJobResource?.reviews?.some(review => review.type === Constants.JOB.REVIEW.TYPE.PARTNER) || false;
    }, [fullJobResource?.reviews]);

    const clientReview = fullJobResource?.reviews?.find((review) => review.type === Constants.JOB.REVIEW.TYPE.CLIENT);

    // 🟢 LOGIC TRUY CẬP WATCH NẰM TRONG HÀM RENDER CHÍNH (Sẽ chạy an toàn sau khi isClient=true)
    const maxLength = Constants.REASON_MAX_LENGTH;
    const description = Form.useWatch("description", form);
    const currentLength = description ? description.length : 0;

    // 🟢 FIX 1: HIỂN THỊ PLACEHOLDER TRONG QUÁ TRÌNH SSR/HYDRATION
    if (!isClient) {
        // Trả về một div đơn giản, không sử dụng hooks phức tạp
        return <div className={"jobPartContainer"} style={{ minHeight: '300px', opacity: 0 }} />;
    }


    if (hasPartnerReview) {
        return (
            <div className={"jobPartContainer"}>
                <Row
                    className="jobPartTitleContainer"
                    align={"middle"}
                    justify={"space-between"}
                >
                    <div className="jobPartTitle">Gửi đánh giá khách hàng</div>
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
                        Bạn đã đánh giá khách hàng cho dự án này.
                    </p>
                </div>
            </div>
        );
    }

    // 🟢 FIX 2: HIỂN THỊ FORM CHỈ KHI ĐÃ MOUNT
    return (
        <div>
            <div className={'jobPartContainer'}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Row
                            className="jobPartTitleContainer"
                            align={"middle"}
                            justify={"space-between"}
                        >
                            <div className="jobPartTitle">Để lại đánh giá</div>
                        </Row>

                        <div>
                            <Form
                                form={form}
                                layout={'vertical'}
                                initialValues={{
                                    rate: null,
                                    description: null,
                                }}
                                onFinish={agreeMutation.mutate}
                                style={{ width: "80%", margin: "auto" }}
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Đánh giá chất lượng công việc'}
                                            name={'rate'}
                                            rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
                                        >
                                            <Rate style={{ color: '#09993E' }} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            label={'Đánh giá'}
                                            name={'description'}
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập đánh giá' },
                                                {
                                                    max: maxLength,
                                                    message: `Đánh giá không được vượt quá ${maxLength} ký tự.`,
                                                },
                                            ]}
                                        >
                                            <Input.TextArea
                                                size={'large'}
                                                placeholder={'Hãy nhập đánh giá của bạn'}
                                                rows={5}
                                            />
                                        </Form.Item>

                                        <div style={{ textAlign: "right", marginTop: "-12px" }}>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    color: currentLength > maxLength ? "red" : undefined,
                                                }}
                                            >
                                            ({`${currentLength} / ${maxLength}`})
                                            </Text>
                                        </div>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            label={'Tải tệp'}
                                            name={'attachment_files'}
                                            valuePropName={'fileList'}
                                            getValueFromEvent={(e) => e.fileList}
                                        >
                                            <Upload
                                                beforeUpload={(file) => handleBeforeUpload(file)}
                                                onRemove={(file) => {
                                                    const currentFiles = form.getFieldValue('attachment_files') || [];
                                                    const updatedFiles = currentFiles.filter((f: any) => f.uid !== file.uid);
                                                    form.setFieldValue('attachment_files', updatedFiles);
                                                }}
                                                maxCount={5}
                                                multiple={true}
                                                className={'uploadFullWidth'}
                                            >
                                                <Row className={'uploadDropzoneContainer'} justify={'space-between'} align={'middle'}>
                                                    <Typography.Paragraph type={'secondary'} className={'nm-typo'}>
                                                        Hỗ trợ tệp PDF, CSV..
                                                    </Typography.Paragraph>

                                                    <Button size={'small'} icon={(<UploadOutlined />)}>
                                                        Tải tài liệu
                                                    </Button>
                                                </Row>
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row justify={'center'}>
                                    {withThemeRevert(
                                        <Button
                                            onClick={form.submit}
                                            loading={agreeMutation.isPending}
                                            disabled={agreeMutation.isPending}
                                            type={'primary'}
                                        >
                                            {agreeMutation.isPending
                                                ? 'Đang gửi'
                                                : 'Gửi đánh giá'}
                                        </Button>
                                    )}
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default JobRate;
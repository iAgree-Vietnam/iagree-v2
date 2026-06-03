import { Row, Col, Form, Input, Typography, Upload, Button } from "antd";
import { PartnerRegisterProps } from "../PartnerRegisterScreen";
// import AppIDUpload from "../../components/AppIDUpload";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import AppIDUpload from "@/src/screens/ProfileScreen/components/AppIDUpload";
import { useState } from "react";
import BusinessLicenseViewModal from "../modals/BusinessLicenseViewModal";

function PartnerCompanyRegisterVerify(props: PartnerRegisterProps) {
    const form = Form.useFormInstance();
    const [isBusinessLicenseModalVisible, setIsBusinessLicenseModalVisible] = useState(false);

    return (
        <>
            <div className={'formGroupContainer'}>
                <div className={'formGroupContentContainer'}>
                    <Row gutter={[20, 0]}>
                        <Col xs={24} lg={24}>
                            <Form.Item
                                label={'Mã số thuế doanh nghiệp'}
                                name={'taxCode'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mã số thuế doanh nghiệp',
                                    },
                                ]}
                            >
                                <Input size={'large'} placeholder={'Nhập mã số thuế doanh nghiệp'} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} lg={24}>
                            <Form.Item
                                label={"Giấy phép kinh doanh"}
                                name={"businessLicense"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng tải lên giấy phép kinh doanh",
                                    },
                                ]}
                            >
                                {props.businessLicenseFile && (
                                    <div style={{ marginBottom: 8 }}>
                                        <Typography.Text strong>Tệp đã tải lên: </Typography.Text>
                                        <span>{props.businessLicenseFile.name}</span>
                                        <Button
                                            type="link"
                                            icon={<EyeOutlined />}
                                            onClick={() => setIsBusinessLicenseModalVisible(true)}
                                            style={{ marginLeft: 8 }}
                                        >
                                            Xem file
                                        </Button>
                                    </div>
                                )}
                                <Upload
                                    accept={[".pdf"].join(",")}
                                    maxCount={1}
                                    multiple={false}
                                    className={"uploadFullWidth"}
                                    beforeUpload={() => false}
                                    onChange={(file) => {
                                        if (file?.fileList?.length > 0) {
                                            const selectedFile = file.fileList[0].originFileObj as File;
                                            props.setBusinessLicenseFile?.(selectedFile);
                                            form.setFieldValue('businessLicense', selectedFile);
                                        } else {
                                            props.setBusinessLicenseFile?.(null);
                                            form.setFieldValue('businessLicense', null);
                                        }
                                    }}
                                >
                                    <Row
                                        className={"uploadDropzoneContainer"}
                                        justify={"space-between"}
                                        align={"middle"}
                                        style={{ 
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '6px',
                                        padding: '8px',
                                        marginTop: '10px'
                                        }}
                                    >
                                        <Typography.Paragraph type={"secondary"} className={"nm-typo"}>
                                        Nhập số giấy phép kinh doanh
                                        </Typography.Paragraph>

                                        <Button size={"small"} icon={<UploadOutlined />}>
                                        Tải lên giấy phép
                                        </Button>
                                    </Row>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col xs={24} lg={24}>
                            <Typography.Title>Thông tin người đại diện theo pháp luật</Typography.Title>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={"Người đại diện"}
                                name={"nameRep"}
                                rules={[
                                    { required: true, message: "Vui lòng nhập tên người đại diện" },
                                ]}
                            >
                                <Input size={"large"} placeholder={"Người đại diện"} />
                            </Form.Item>

                            <Form.Item
                                label={'Hình CCCD/CMND mặt trước'}
                                // name={'citizen_photo_front'}
                                name={'frontCard'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn hình CCCD/CMND mặt trước',
                                    },
                                ]}
                            >
                                <AppIDUpload />
                            </Form.Item>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={'Số CCCD/CMND'}
                                // name={'citizenId'}
                                name={'cardNumber'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số CCCD/CMND',
                                    },
                                    {
                                        max: 12,
                                        message: 'Vui lòng nhập số CCCD/CMND hợp lệ',
                                    },
                                ]}
                            >
                                <Input size={'large'} placeholder={'Nhập số CCCD/CMND'} />
                            </Form.Item>

                            <Form.Item
                                label={'Hình CCCD/CMND mặt sau'}
                                // name={'citizen_photo_back'}
                                name={'backCard'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn hình CCCD/CMND mặt sau',
                                    },
                                ]}
                            >
                                <AppIDUpload />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Typography.Paragraph>
                                Vui lòng xác minh Căn cước công dân và các thông tin của bạn để đảm bảo bạn là thật 
                                và đủ điều kiện cung cấp dịch vụ trên iAgree.
                            </Typography.Paragraph>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={'Hình chân dung cầm CCCD/CMND'}
                                name={'portraitCard'}
                                rules={[
                                    {
                                        // required: true,
                                        message: 'Vui lòng chọn hình chân dung cầm CCCD/CMND',
                                    },
                                ]}
                            >
                                <AppIDUpload />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            </div>

            <BusinessLicenseViewModal
                isVisible={isBusinessLicenseModalVisible}
                onClose={() => setIsBusinessLicenseModalVisible(false)}
                businessLicenseFile={props.businessLicenseFile || null}
            />
        </>
    );
}

export default PartnerCompanyRegisterVerify;
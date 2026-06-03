import { Row, Col, Form, Input, Typography } from "antd";
import { PartnerRegisterProps } from "../PartnerRegisterScreen";
import AppIDUpload from "@/src/screens/ProfileScreen/components/AppIDUpload";

function PartnerRegisterVerify(props: PartnerRegisterProps) {
    // const form = Form.useFormInstance();

    return (
        <div className={'formGroupContainer'}>
            <div className={'formGroupContentContainer'}>
                <Row gutter={[20, 0]}>
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
                    </Col>

                    <Col xs={24} lg={12}>
                        <Form.Item
                            label={'Mã số thuế cá nhân'}
                            name={'taxCode'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã số thuế cá nhân',
                                },
                                // {
                                //     min: 10,
                                //     message: 'Vui lòng nhập số CCCD/CMND hợp lệ',
                                // },
                                // {
                                //     max: 12,
                                //     message: 'Vui lòng nhập số CCCD/CMND hợp lệ',
                                // },
                            ]}
                        >
                            <Input size={'large'} placeholder={'Nhập mã số thuế cá nhân'} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} lg={12}>
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
                                    required: true,
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
    );
}

export default PartnerRegisterVerify;
import { useAccountContext } from "@/src/contexts/AccountContext";
import { Row, Col, Form, Input, Select,  } from "antd";
import { usePartnerSelectBox } from "../../hooks/usePartnerSelectBox";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";
import { PartnerRegisterProps } from "../PartnerRegisterScreen";
import AppIDUpload from "@/src/screens/ProfileScreen/components/AppIDUpload";

function PartnerRegisterPayment(props: PartnerRegisterProps) {
    // const { auth: userInfo } = useAccountContext();
    const selectBoxQuery = usePartnerSelectBox();
    // const selectBoxResource: PartnerSelectBoxResource = selectBoxQuery.data;
    const selectBoxResource = selectBoxQuery.data as PartnerSelectBoxResource;
    
    return (
        <div className={'formGroupContainer'}>
            <div className={'formGroupContentContainer'}>
                <Row gutter={[20, 0]}>
                    <Col xs={24}>
                        <Form.Item
                            label={'Ngân hàng'}
                            name={'bankId'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngân hàng',
                                },
                            ]}
                        >
                            <Select
                                options={selectBoxResource.banks.map(
                                    (bankItem) => ({
                                        value: bankItem.bankId,
                                        label: bankItem.name,
                                    })
                                )}
                                placeholder={'Chọn ngân hàng'}
                                size={'large'}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            label={'Số tài khoản'}
                            name={'accountNumber'}
                            rules={[
                                {
                                    required: true, 
                                    message: 'Vui lòng nhập số tài khoản nhận',
                                },
                            ]}
                        >
                            <Input size={'large'} placeholder={'Nhập số tài khoản'} />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            label={'Hình QR mã tài khoản nhận thanh toán'}
                            name={'qrCode'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn hình QR mã tài khoản',
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

export default PartnerRegisterPayment;
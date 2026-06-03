import React from 'react';
import { Divider, Form, Input, Typography } from 'antd';

function ContractInfo(props: any) {

    const [form] = Form.useForm();

    return (
        <div>
            <Divider orientation={'left' as any}>Thông tin hợp đồng</Divider>

            <Form
                name={'contractForm'}
                form={form}
                initialValues={{
                    title: 'Xin chào thế giới',
                }}
                onFinish={(values) => null}
                layout={'vertical'}
                labelAlign={'left'}
                labelCol={{ lg: 7 }}
                className={'contractFormContainer'}
            >
                <Form.Item
                    label={'Tên hợp đồng'}
                    name={'title'}
                    rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
                >
                    <Input
                        size={'large'}
                        placeholder={'Nhập tên công việc'}
                    />
                </Form.Item>

                <div className={'contractPreviewContainer'}>
                    <Typography.Paragraph>Hợp đồng</Typography.Paragraph>

                    <object data={'https://www.africau.edu/images/default/sample.pdf'} type="application/pdf" width="100%" className={'jobContractPreview'}/>
                </div>
            </Form>
        </div>
    );
}

export default ContractInfo;

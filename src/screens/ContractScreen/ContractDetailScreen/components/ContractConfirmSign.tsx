import React from 'react';
import { Col, Divider, Input, Row, Table, Typography } from 'antd';

function ContractConfirmSign(props: any) {
    return (
        <div>
            <div className={'contractBoxContainer'}>
                <Divider orientation={'left' as any}>Thông tin luồng ký</Divider>

                <Table
                    columns={[
                        {
                            key: 'index',
                            dataIndex: 'index',
                            title: 'STT',
                            render: (value, record, index) => index + 1,
                        },
                        {
                            key: 'actions',
                            dataIndex: 'actions',
                            title: 'Thao tác',
                            render: (value) => value ? 'X' : '',
                        },
                        {
                            key: 'receiverName',
                            dataIndex: 'receiverName',
                            title: 'Tên người nhận',
                        },
                        {
                            key: 'phoneNumber',
                            dataIndex: 'phoneNumber',
                            title: 'Số điện thoại',
                        },
                        {
                            key: 'email',
                            dataIndex: 'email',
                            title: 'Email',
                        },
                    ]}
                    dataSource={[
                        {
                            actions: true,
                            receiverName: 'Hoàng Xuân Hiếu',
                            phoneNumber: '0966886218',
                            email: 'xuanhieu.pd@gmail.com',
                        },
                        {
                            actions: true,
                            receiverName: 'Nguyễn Thị Phương Anh',
                            phoneNumber: '0363604076',
                            email: 'phuonganh28101995@gmail.com',
                        },
                    ]}
                    pagination={false}
                    rowKey={'phoneNumber'}
                />
            </div>

            <div className={'contractBoxContainer'}>
                <object data={'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'} type="application/pdf" width="100%" className={'jobContractPreview'}/>
            </div>
        </div>
    );
}

export default ContractConfirmSign;

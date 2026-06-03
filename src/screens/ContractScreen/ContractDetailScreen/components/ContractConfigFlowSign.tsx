import React from 'react';
import { Button, Divider, Input, Row, Space, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function ContractConfigFlowSign(props: any) {
    return (
        <div>
            <div className={'addMemberToSignFormContainer'}>
                <Button size={'small'} type={'primary'} icon={(<PlusOutlined/>)}>
                    Thêm người ký
                </Button>
            </div>

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
    );
}

export default ContractConfigFlowSign;

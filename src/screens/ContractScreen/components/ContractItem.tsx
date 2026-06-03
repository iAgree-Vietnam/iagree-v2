import React from 'react';
import { ContractResource } from '@/src/data/contract/models/contract.types';
import { Button, Card, Descriptions, Divider, Dropdown, List, Popconfirm, Space, Typography } from 'antd';
import { DeleteOutlined, EllipsisOutlined, StopOutlined } from '@ant-design/icons';
import { ConstantsHelper } from '@/src/constants/ConstantsHelper';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import Constants from '@/src/constants/Constants';
import useContractResendSignRequest from '../hooks/flow/useContractResendSignRequest';

interface ContractItemProps {
    data: ContractResource;
    onView: (contractResource: ContractResource) => void,
    onCancel: (contractResource: ContractResource) => void,
    onDelete: (contractResource: ContractResource) => void,
}

function ContractItem(props: ContractItemProps) {

    const contractResource = props.data;

    const resendSignRequest = useContractResendSignRequest();

    return (
        <List.Item style={{ marginTop: 24, borderBottom: 'none' }}>
            <Card
                title={contractResource.name}
                extra={(
                    <Space size={'small'}>
                        <Button onClick={() => props.onView(contractResource)}>Xem</Button>
                        <Dropdown
                            trigger={['click']}
                            menu={{
                                items: [
                                    {
                                        label: (
                                            <Popconfirm
                                                placement={'topLeft'}
                                                title={'Hủy luồng ký'}
                                                description={(
                                                    <>
                                                        <Typography.Paragraph type={'secondary'} className={'nm-typo'}>Bạn có chắc chắn muốn hủy luồng ký ?</Typography.Paragraph>
                                                        <Typography.Paragraph type={'secondary'} className={'nm-typo'}>IAgree không chịu trách nhiệm bảo toàn số lượt ký của những người liên quan sau khi hủy luồng ký.</Typography.Paragraph>
                                                    </>
                                                )}
                                                okText={'Hủy luồng ký'}
                                                cancelText={'Hủy'}
                                                onConfirm={() => props.onCancel(contractResource)}
                                                disabled={contractResource.status !== Constants.CONTRACT.STATUS.DANG_XU_LY}
                                            >
                                                <Space size={'small'}>
                                                    <StopOutlined />
                                                    Hủy luồng ký
                                                </Space>
                                            </Popconfirm>
                                        ),
                                        key: 'CANCEL',
                                        // icon: <StopOutlined/>,
                                        disabled: contractResource.status !== Constants.CONTRACT.STATUS.DANG_XU_LY,
                                    },
                                    {
                                        label: (
                                            <Popconfirm
                                                placement={'topLeft'}
                                                title={'Xóa hợp đồng'}
                                                description={'Bạn có chắc chắn muốn xóa hợp đồng này'}
                                                okText={'Xóa hợp đồng'}
                                                cancelText={'Hủy'}
                                                onConfirm={() => props.onDelete(contractResource)}
                                                disabled={contractResource.status !== Constants.CONTRACT.STATUS.HUY && contractResource.status !== Constants.CONTRACT.STATUS.TU_CHOI && contractResource.status !== Constants.CONTRACT.STATUS.LUU_NHAP}
                                            >
                                                <Space size={'small'}>
                                                    <DeleteOutlined />
                                                    Xóa hợp đồng
                                                </Space>
                                            </Popconfirm>
                                        ),
                                        key: 'DELETE',
                                        disabled: contractResource.status !== Constants.CONTRACT.STATUS.HUY && contractResource.status !== Constants.CONTRACT.STATUS.TU_CHOI && contractResource.status !== Constants.CONTRACT.STATUS.LUU_NHAP,
                                    },
                                ],
                                onClick: (e) => null,
                            }}
                        >
                            <Button>
                                <EllipsisOutlined />
                            </Button>
                        </Dropdown>
                    </Space>
                )}
                className={'contractItemContainer'}
            >
                <Descriptions
                    size={'small'}
                    column={4}
                    items={[
                        {
                            span: 24,
                            key: 'CREATED_BY',
                            label: 'Người tạo',
                            children: contractResource.userName || 'Chưa xác định',
                        },
                        {
                            key: 'STATUS',
                            label: 'Trạng thái',
                            children: ConstantsHelper.getContractStatusTitle(contractResource.status),
                        },

                        {
                            key: 'SIGN_TYPE',
                            label: 'Cách thức',
                            children: ConstantsHelper.getSignTypeTitle(contractResource.signType),
                        },
                        {
                            key: 'RELEASE_DATE',
                            label: 'Ngày ban hành',
                            children: contractResource.releaseDate ? datetimeUtils.getMoment(contractResource.releaseDate)?.format(datetimeUtils.LOCAL_DATE) : '...',
                        },
                        {
                            key: 'CREATED_DATE',
                            label: 'Tạo lúc',
                            children: datetimeUtils.getMoment(contractResource.lastModifiedDate, datetimeUtils.BACKEND_DATE_TIME)?.format(datetimeUtils.LOCAL_DATE_TIME),
                        },
                    ]}
                />

                <Divider plain={true} style={{ margin: '6px 0' }} />

                <List
                    header={(<Typography.Paragraph className={'nm-typo'} strong={true}>Danh sách người ký</Typography.Paragraph>)}
                    className={'contractSignListContainer'}
                    grid={{ column: 4 }}
                    size={'small'}
                    dataSource={contractResource.signUsers}
                    locale={{
                        emptyText: 'Hợp đồng này chưa có người ký nào',
                    }}
                    bordered={false}
                    renderItem={(item) => {
                        return (
                            <List.Item style={{ paddingLeft: 0 }}>
                                <div>
                                    <Typography.Paragraph mark={true} className={'nm-typo'}>Trạng thái: {item.status !== Constants.CONTRACT.SIGN_STATUS.EXTENSION ? ConstantsHelper.getContractSignStatusTitle(item.status) : item.appMysignDescription}</Typography.Paragraph>
                                    {
                                        item.status === Constants.CONTRACT.SIGN_STATUS.EXTENSION && (
                                            <Button
                                                size={'small'}
                                                type={'primary'}
                                                danger
                                                onClick={() => resendSignRequest.mutate(item)}
                                                disabled={resendSignRequest.isLoading}
                                            >
                                                Gửi yêu cầu ký trên MySign
                                            </Button>
                                        )
                                    }
                                    <Typography.Paragraph ellipsis={{ tooltip: item.email, rows: 1 }} className={'nm-typo'}>{item.email}</Typography.Paragraph>
                                </div>
                            </List.Item>
                        );
                    }}
                    rowKey={'signId'}
                />
            </Card>
        </List.Item>
    );
}

export default ContractItem;

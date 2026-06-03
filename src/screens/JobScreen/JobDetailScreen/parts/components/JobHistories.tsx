import React, { useRef } from 'react';
import { ConstantsHelper } from '@/src/constants/ConstantsHelper';
import { Button, message, Row, Space, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { FullJobResource, HistoryJobResultResource, JobResultResource } from '@/src/data/job/models/job.types';
import Constants from '@/src/constants/Constants';
import ViewResultHistoryModal, { ViewResultHistoryModalizeHelperVisible } from '../../modals/ViewResultHistoryModal';
import { ColumnType } from 'antd/es/table';

interface JobHistoriesProps {
    job: FullJobResource;
}

function JobHistories(props: JobHistoriesProps) {
    const { job: fullJobResource } = props;
    const viewResultHistoryModalRef = useRef<ViewResultHistoryModalizeHelperVisible>(null);

    const columns: ColumnType<HistoryJobResultResource>[] = [
        {
            key: 'createdDate',
            dataIndex: 'createdDate',
            title: 'Ngày gửi',
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Trạng thái',
            render: (value: number) => ConstantsHelper.getJobResultStatusTitle(value),
        },
        {
            key: 'updatedDate',
            dataIndex: 'updatedDate',
            title: 'Ngày duyệt',
            render: (value: string, record: any) => {
                if (record.status === Constants.JOB.RESULT_STATUS.WAITING_APPROVE) {
                    return "-";
                }
                return value || '-';
            }
        },
        {
            key: 'note',
            dataIndex: 'note',
            title: 'Ghi chú',
            render: (value) => value || '...',
        },
        {
            key: "actions",
            dataIndex: "actions",
            title: "Hành động",
            fixed: "right",
            align: "right",
            width: 150,
            render: (value: any, historyResource: HistoryJobResultResource) => {
                return (
                    <Row justify={"end"}>
                        <Space>
                            <Button
                                className="btnAction"
                                icon={<EyeOutlined />}
                                onClick={() => {
                                    viewResultHistoryModalRef.current?.open(fullJobResource!, historyResource);
                                }}
                            />

                            <ViewResultHistoryModal 
                                ref={viewResultHistoryModalRef} 
                            />
                        </Space>
                    </Row>
                );
            },
        },
    ]

    return (
        <Table
            columns={columns}
            dataSource={fullJobResource?.histories?.map((hItem, hIndex) => ({ ...hItem, itemId: hIndex }))}
            rowKey={'itemId'}
            pagination={false}
            size={'small'}
            locale={{ emptyText: 'Không có dữ liệu' }}
            scroll={{ x: 'max-content' }}
        />
    );
}

export default JobHistories;

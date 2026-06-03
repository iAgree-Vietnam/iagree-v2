import React from 'react';
import { Table, Space, Button, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export interface PartnerDocument {
  id: string;
  name: string;
  description: string;
  file: string;
}

export interface IPartnerDocumentsProps {
  documentList: PartnerDocument[];
  removeDocument: (index: number) => void;
  onChangeDescription: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export function PartnerDocuments({
  documentList,
  removeDocument,
  onChangeDescription,
}: IPartnerDocumentsProps) {
  return (
    <Table
      columns={[
        {
          key: 'index',
          dataIndex: 'index',
          title: 'STT',
          render: (_, __, index) => index + 1,
        },
        {
          key: 'name',
          dataIndex: 'name',
          title: 'Tên tài liệu',
        },
        {
          key: 'description',
          dataIndex: 'description',
          title: 'Mô tả',
          render: (value, _, index) => {
            return (
              <Space className='d-flex' direction='vertical'>
                <Input
                  value={value}
                  onChange={(e) => onChangeDescription(index, e)}
                />
              </Space>
            );
          },
        },
        {
          key: 'actions',
          dataIndex: 'actions',
          title: 'Hành động',
          fixed: 'right',
          width: 150,
          render: (_, __, index) => {
            return (
              <Space>
                <Button
                  onClick={() => removeDocument(index)}
                  icon={<DeleteOutlined />}
                />
              </Space>
            );
          },
        },
      ]}
      dataSource={documentList}
      locale={{ emptyText: 'Không có dữ liệu' }}
      rowKey={'id'}
      pagination={false}
      size={'middle'}
    />
  );
}

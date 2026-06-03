import React from 'react';
import { Menu, Typography } from 'antd';
import Link from 'next/link';
import Constants from '@/src/constants/Constants';
import DocumentRouteUtils from '@/src/data/document/utils/DocumentRouteUtils';

interface DocumentSidebarRoutesProps {
    statusId: number | null;
}

function DocumentSidebarRoutes(props: DocumentSidebarRoutesProps) {
    const { statusId = '' } = props;

    return (
        <div className={'jobManageMenu'}>
            <Typography className={'greetingText'}>Quản lý văn bản</Typography>
            <Menu
                mode={'inline'}
                className={'filterMenuContainer jobSidebarRoutes'}
                selectedKeys={[(statusId || '').toString()]}
                items={[
                    { key: Constants.TEMPLATE.STATUS.ALL, label: (<Link href={DocumentRouteUtils.toScreen({})}>Văn bản của tôi</Link>) },
                    { key: Constants.TEMPLATE.STATUS.PAID, label: (<Link href={DocumentRouteUtils.toSharedScreen({})}>Văn bản được chia sẻ</Link>) },
                ]}
            />
        </div>
    );
}

export default DocumentSidebarRoutes;

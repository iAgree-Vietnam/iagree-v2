import React from 'react';
import { Menu, Typography } from 'antd';
import Link from 'next/link';
import Constants from '@/src/constants/Constants';
import ContractRouteUtils from '@/src/data/contract/utils/ContractRouteUtils';
import { useRouter } from 'next/router';

interface ContractSidebarRoutesProps {
    statusId: number | null;
}

function ContractSidebarRoutes(props: ContractSidebarRoutesProps) {
    const { statusId = '' } = props;

    const route = useRouter();

    const selectedKeys = [
        (route.pathname === ContractRouteUtils.toUploadScreen())
            ? Constants.CONTRACT.UPLOAD_CONTRACT
            : (statusId || Constants.CONTRACT.STATUS.LUU_NHAP).toString()
    ];

    return (
        <div className={'jobManageMenu'}>
            <Typography className={'greetingText'}>Ký số trực tuyến</Typography>
            <Menu
                mode={'inline'}
                className={'filterMenuContainer jobSidebarRoutes'}
                selectedKeys={selectedKeys}
                items={[
                    { key: Constants.CONTRACT.UPLOAD_CONTRACT, label: (<Link href={ContractRouteUtils.toUploadScreen()}>Tải tài liệu ký</Link>) },
                    { key: Constants.CONTRACT.STATUS.LUU_NHAP, label: (<Link href={ContractRouteUtils.toScreen({})}>Tài liệu của tôi</Link>) },
                    { key: Constants.CONTRACT.STATUS.DA_BAN_HANH, label: (<Link href={ContractRouteUtils.toScreen({ statusId: Constants.CONTRACT.STATUS.DA_BAN_HANH })}>Tài liệu đã ký</Link>) },
                    { key: Constants.CONTRACT.STATUS.HUY, label: (<Link href={ContractRouteUtils.toScreen({ statusId: Constants.CONTRACT.STATUS.HUY })}>Tài liệu bị hủy</Link>) },
                ]}
            />
        </div>
    );
}

export default ContractSidebarRoutes;

import React from 'react';
import { Collapse, Menu, Typography } from 'antd';
import Link from 'next/link';
import AuthJobRouteUtils from '../../../data/auth/utils/AuthJobRouteUtils';
import Constants from '../../../constants/Constants';
import { useAccountContext } from '@/src/contexts/AccountContext';
import { useRouter } from 'next/router';
import { PartnerRouteUtils } from '@/src/data/partner/utils/PartnerRouteUtils';

interface JobSidebarRoutesProps {
    type?: number | null;
    statusId?: number | string;
}

function JobSidebarRoutes(props: JobSidebarRoutesProps) {
    const { type = null, statusId = '' } = props;

    const router = useRouter();

    const { auth: fullProfileResource } = useAccountContext();

    function getMenus() {
        const menuResults: any[] = [];

        menuResults.push({
            key: 'CREATE',
            label: (
                <Link href={AuthJobRouteUtils.toManagementUrl()}>
                    Quản lý đăng tuyển
                </Link>
            ),
        });

        if (fullProfileResource?.partner && fullProfileResource.partner.status === Constants.PARTNER.DA_DUYET) {
            menuResults.push({
                key: 'APPLY',
                label: (
                    <Link
                        href={
                            fullProfileResource.partner.status === Constants.PARTNER.DA_DUYET
                                ? AuthJobRouteUtils.toApplyUrl()
                                : PartnerRouteUtils.toProfileUrl()
                        }
                    >
                        Quản lý ứng tuyển
                    </Link>
                ),
            });
        }

        // if (fullProfileResource?.partner && fullProfileResource.partner.status === Constants.PARTNER.DA_DUYET) {
        //     menuResults.push({
        //         key: 'INVITED',
        //         label: (
        //             <Link
        //                 href={
        //                     fullProfileResource.partner.status === Constants.PARTNER.DA_DUYET
        //                         ? AuthJobRouteUtils.toInvitedUrl()
        //                         : PartnerRouteUtils.toProfileUrl()
        //                 }
        //             >
        //                 Công việc được mời
        //             </Link>
        //         ),
        //     });
        // }

        return menuResults;
    }

    return (
        <div className={'jobManageMenu'}>
            <Typography className={'greetingText'}>Quản lý công việc</Typography>
            <Menu
                mode={'inline'}
                className={'filterMenuContainer jobSidebarRoutes'}
                selectedKeys={[
                    type === Constants.JOB.TYPE.MANAGEMENT 
                    ? 'CREATE'
                    : type === Constants.JOB.TYPE.APPLY
                    ? 'APPLY'
                    : type === Constants.JOB.TYPE.INVITED
                    ? 'INVITED'
                    : '',
                ]}
                items={getMenus()}
            />
        </div>
    );
}

export default JobSidebarRoutes;

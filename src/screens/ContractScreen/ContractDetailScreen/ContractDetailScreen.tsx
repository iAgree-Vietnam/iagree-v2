import React, { useRef } from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import { FullContractResource } from '@/src/data/contract/models/contract.types';
import useSelectedContract from '../hooks/useSelectedContract';
import dynamic from 'next/dynamic';
import { Breadcrumb, Button, Row, Space, Typography, message } from 'antd';
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import ContractRouteUtils from '@/src/data/contract/utils/ContractRouteUtils';
import Constants from '@/src/constants/Constants';
import ContractEditModal, {
    ContractEditModalizeHelperVisible,
} from '../modals/ContractEditModal';
import ContractDeleteModal from '../modals/ContractDeteleModal';
import ContractSignModal from '../modals/ContractSignModal';
import { ModalizeHelperVisible } from '@/src/data/base/models/base.types';
import { withThemeRevert } from '@/theme';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import FileUtils from '@/src/utils/FileUtils';
import StringUtils from '@/src/utils/StringUtils';

const ContractDetailViewClient = dynamic(
    () => import('../modals/components/ContractDetailView'),
    {
        ssr: false,
    }
);

function ContractsDetailScreen({ contractId }: any) {
    const { isDesktop } = useBreakpoint();
    const contractEditModalRef = useRef<ContractEditModalizeHelperVisible>(null);
    const contractDeleteModalRef =
        useRef<ContractEditModalizeHelperVisible>(null);
    const contractSignModalRef = useRef<ModalizeHelperVisible>(null);

    const contractQuery = useSelectedContract(Number(contractId));
    const fullContractResource: FullContractResource | undefined =
        contractQuery.data;

    return (
        <RootLayout>
            <Head>
                <title>Tài liệu {fullContractResource?.name}</title>
            </Head>

            <section className={'breadcrumbContainer'}>
                <div className="contentWrapper">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <>
                                        <IconSvgLocal name={'IC_HOME'} />
                                        <span>Trang chủ</span>
                                    </>
                                ),
                                href: '/',
                            },
                            {
                                title: 'Tài liệu',
                                href: ContractRouteUtils.toScreen({}),
                            },
                            { title: fullContractResource?.name },
                        ]}
                    />
                </div>
            </section>

            <section className={'sectionContainer jobManage'}>
                <div className="contentWrapper">
                    <Row
                        className={'sectionTitleContainer'}
                        justify={'space-between'}
                        align={'top'}
                        style={{ marginBottom: !isDesktop ? '24px' : 0 }}
                    >
                        <Typography.Title className={'sectionTitle'} level={3}>
                            {fullContractResource?.name}
                        </Typography.Title>

                        <Space
                            size={10}
                            align={!isDesktop ? 'start' : 'end'}
                            wrap={!isDesktop ? true : false}
                        >
                            <Button
                                disabled={
                                    fullContractResource?.status !==
                                    Constants.CONTRACT.STATUS.HUY &&
                                    fullContractResource?.status !==
                                    Constants.CONTRACT.STATUS.TU_CHOI &&
                                    fullContractResource?.status !==
                                    Constants.CONTRACT.STATUS.LUU_NHAP
                                }
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    if (fullContractResource)
                                        contractDeleteModalRef.current?.open(fullContractResource);
                                }}
                                danger
                            >
                                Xóa
                            </Button>
                            <Button
                                type={'primary'}
                                icon={<DownloadOutlined />}
                                onClick={() => {
                                    if (!fullContractResource?.fileUrl) {
                                        return;
                                    }

                                    const fileResource = fullContractResource?.fileUrl;
                                        
                                    const fileName = StringUtils.normalizeDownloadFilename(
                                        fullContractResource?.name || ''
                                    );
                                        
                                    const fileExt = FileUtils.getFileExtension(fileResource);
                                        
                                    FileUtils.downloadFromUrl(
                                        fileResource,
                                        `${fileName}.${fileExt}`
                                    );
                                }}
                            >
                                Tải tài liệu
                            </Button>
                            <Button
                                disabled={
                                    fullContractResource?.status !==
                                    Constants.CONTRACT.STATUS.LUU_NHAP
                                }
                                icon={<EditOutlined />}
                                onClick={() => {
                                    if (fullContractResource)
                                        contractEditModalRef.current?.open(fullContractResource);
                                }}
                            >
                                Chỉnh sửa
                            </Button>
                            {withThemeRevert(
                                <Button
                                    block
                                    type={'primary'}
                                    disabled={
                                        fullContractResource?.status !==
                                        Constants.CONTRACT.STATUS.LUU_NHAP
                                    }
                                    onClick={() => contractSignModalRef.current?.open()}
                                    icon={<UserAddOutlined />}
                                >
                                    Thêm người ký
                                </Button>
                            )}
                        </Space>
                    </Row>
                    {fullContractResource && (
                        <div className={'signBodyDrawerContainer'}>
                            <ContractDetailViewClient data={fullContractResource} />
                        </div>
                    )}
                </div>
            </section>

            {fullContractResource && (
                <ContractSignModal
                    ref={contractSignModalRef}
                    data={fullContractResource}
                />
            )}
            <ContractEditModal ref={contractEditModalRef} />
            <ContractDeleteModal ref={contractDeleteModalRef} isDetail />
        </RootLayout>
    );
}

export default ContractsDetailScreen;

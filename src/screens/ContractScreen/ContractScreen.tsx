import React, { useCallback, useEffect, useRef, useState } from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import {
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Row,
    Space,
    Table,
    Typography,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    StopOutlined,
} from '@ant-design/icons';
import { usePaginatedContracts } from '@/src/screens/ContractScreen/hooks/usePaginatedContracts';
import {
    ContractFilterParams,
    ContractResource,
} from '@/src/data/contract/models/contract.types';
import ContractUploadModal from '@/src/screens/ContractScreen/modals/ContractUploadModal';
import { ModalizeHelperVisible } from '@/src/data/base/models/base.types';
import ContractDetailModal, {
    ContractDetailModalizeHelper,
} from '@/src/screens/ContractScreen/modals/ContractDetailModal';
import ContractSidebarRoutes from './components/ContractSidebarRoutes';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import Constants from '@/src/constants/Constants';
import { ConstantsHelper } from '@/src/constants/ConstantsHelper';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import ContractEditModal, {
    ContractEditModalizeHelperVisible,
} from './modals/ContractEditModal';
import ContractDeleteModal from './modals/ContractDeteleModal';
import ContractCancelModal from './modals/ContractCancelModal';
import { useRouter } from 'next/router';
import ContractRouteUtils from '@/src/data/contract/utils/ContractRouteUtils';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { withThemeRevert } from '@/theme';

interface ContractsScreenProps {
    filters: ContractFilterParams;
    id: string | null;
}

function ContractsScreen(props: ContractsScreenProps) {
    const { filters: requestFilters, id: contractId } = props;

    const router = useRouter();
    const [form] = Form.useForm();
    const { isDesktop } = useBreakpoint();

    const contractUploadModalRef = useRef<ModalizeHelperVisible>(null);
    const contractDetailModalRef = useRef<ContractDetailModalizeHelper>(null);
    const contractEditModalRef = useRef<ContractEditModalizeHelperVisible>(null);
    const contractDeleteModalRef =
        useRef<ContractEditModalizeHelperVisible>(null);
    const contractCancelModalRef =
        useRef<ContractEditModalizeHelperVisible>(null);

    const [search, setSearch] = useState<string | null>(null);
    const [filters, setFilters] = useState<ContractFilterParams>(requestFilters);

    const dataQuery = usePaginatedContracts({ filters });

    const contractResources: ContractResource[] = dataQuery.data.items;

    useEffect(() => {
        setFilters({ ...requestFilters });
    }, [requestFilters]);

    // useEffect(() => {
    //     if (!contractId) return;
    //     const contract = contractResources.find(item => item.contractId.toString() === contractId);
    //     if (contract) onView(contract);
    // }, [contractId, contractResources])

    function goSearch() {
        setFilters((prevState) => ({ ...prevState, search }));
    }

    function onView(contractResource: ContractResource) {
        // contractDetailModalRef.current?.open(contractResource);
        router.push(ContractRouteUtils.toDetailUrl(contractResource));
    }

    // function sortByLastModified(a: ContractResource, b:ContractResource) {
    //     return datetimeUtils.getMoment(b.updatedDate)?.diff(datetimeUtils.getMoment(a.updatedDate)) || 0;
    // }

    const titleLabel = {
        [Constants.CONTRACT.STATUS.LUU_NHAP]: 'Tài liệu của tôi',
        [Constants.CONTRACT.STATUS.DA_BAN_HANH]: 'Tài liệu đã ký',
        [Constants.CONTRACT.STATUS.HUY]: 'Tài liệu bị hủy',
    };

    const statusId =
        requestFilters.statusId ?? Constants.CONTRACT.STATUS.LUU_NHAP;

    return (
        <RootLayout>
            <Head>
                <title>{titleLabel[statusId]}</title>
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
                            { title: titleLabel[statusId] },
                        ]}
                    />
                </div>
            </section>

            <section className={'sectionContainer jobManage'}>
                <div className="contentWrapper">
                    <Row gutter={[60, 24]}>
                        <Col xs={24} lg={6}>
                            <div className={'desktopFilterContainer'}>
                                <ContractSidebarRoutes statusId={statusId} />
                            </div>
                        </Col>

                        <Col xs={24} lg={18}>
                            <Space
                                size={40}
                                direction={'vertical'}
                                className={'jobListContainer d-flex'}
                            >
                                <Row
                                    justify={'space-between'}
                                    align={'middle'}
                                    gutter={[20, 20]}
                                >
                                    <Col>
                                        <Typography.Title level={3} className={'title nm-typo'}>
                                            {titleLabel[statusId]}
                                        </Typography.Title>
                                    </Col>
                                    {/* {statusId === Constants.CONTRACT.STATUS.LUU_NHAP && (
                                        <Col span={!isDesktop ? 24 : 'auto'}>
                                            <Button
                                                type={'default'}
                                                onClick={() => contractUploadModalRef.current?.open()}
                                                icon={<UploadOutlined />}
                                                block
                                            >
                                                Upload file ký
                                            </Button>
                                        </Col>
                                    )} */}
                                </Row>

                                <div className={'searchContainer'}>
                                    <Form.Item label={'Tìm hợp đồng'} layout={'vertical'}>
                                        <Input
                                            value={search || ''}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onPressEnter={() => goSearch()}
                                            size={'large'}
                                            placeholder={'Nhập từ khóa tìm kiếm'}
                                            suffix={
                                                <IconSvgLocal
                                                    name={'IC_SEARCH'}
                                                    width={20}
                                                    height={20}
                                                    onClick={goSearch}
                                                    fill={'#25272D'}
                                                />
                                            }
                                        />
                                    </Form.Item>
                                </div>

                                <Table
                                    rowKey={'contractId'}
                                    columns={[
                                        {
                                            key: 'name',
                                            dataIndex: 'name',
                                            title: 'Tên tài liệu',
                                        },
                                        {
                                            key: 'userName',
                                            dataIndex: 'userName',
                                            title: 'Người tạo',
                                            render: (value) => value || 'Chưa xác định',
                                        },
                                        {
                                            key: 'signType',
                                            dataIndex: 'signType',
                                            title: 'Cách thức ký',
                                            render: (value) =>
                                                ConstantsHelper.getSignTypeTitle(value),
                                        },
                                        {
                                            key: 'status',
                                            dataIndex: 'status',
                                            title: 'Trạng thái',
                                            render: (value) =>
                                                ConstantsHelper.getContractStatusTitle(value),
                                        },
                                        {
                                            key: 'releaseDate',
                                            dataIndex: 'releaseDate',
                                            title: 'Ngày ban hành',
                                            render: (value) =>
                                                value
                                                    ? datetimeUtils
                                                        .getMoment(value)
                                                        ?.format(datetimeUtils.LOCAL_DATE)
                                                    : '...',
                                        },
                                        {
                                            key: 'lastModifiedDate',
                                            dataIndex: 'lastModifiedDate',
                                            title: 'Tạo lúc',
                                            render: (value) =>
                                                datetimeUtils
                                                    .getMoment(value, datetimeUtils.BACKEND_DATE_TIME)
                                                    ?.format(datetimeUtils.LOCAL_DATE_TIME),
                                        },
                                        {
                                            key: 'actions',
                                            dataIndex: 'actions',
                                            title: 'Hành động',
                                            fixed: 'right',
                                            align: 'right',
                                            render: (value, contractResource: ContractResource) => {
                                                return (
                                                    <Row justify={'end'}>
                                                        <Space size={'small'} align={'end'}>
                                                            <Button
                                                                className={'btnAction'}
                                                                icon={<EyeOutlined />}
                                                                onClick={() => onView(contractResource)}
                                                            />

                                                            <Button
                                                                className={'btnAction'}
                                                                disabled={
                                                                    contractResource.status !==
                                                                    Constants.CONTRACT.STATUS.LUU_NHAP
                                                                }
                                                                icon={<EditOutlined />}
                                                                onClick={() =>
                                                                    contractEditModalRef.current?.open(
                                                                        contractResource
                                                                    )
                                                                }
                                                            />

                                                            <Button
                                                                className={'btnAction'}
                                                                disabled={
                                                                    contractResource.status !==
                                                                    Constants.CONTRACT.STATUS.DANG_XU_LY
                                                                }
                                                                icon={<StopOutlined />}
                                                                onClick={() =>
                                                                    contractCancelModalRef.current?.open(
                                                                        contractResource
                                                                    )
                                                                }
                                                            />

                                                            <Button
                                                                className={'btnAction'}
                                                                disabled={
                                                                    contractResource.status !==
                                                                    Constants.CONTRACT.STATUS.HUY &&
                                                                    contractResource.status !==
                                                                    Constants.CONTRACT.STATUS.TU_CHOI &&
                                                                    contractResource.status !==
                                                                    Constants.CONTRACT.STATUS.LUU_NHAP
                                                                }
                                                                icon={<DeleteOutlined />}
                                                                onClick={() =>
                                                                    contractDeleteModalRef.current?.open(
                                                                        contractResource
                                                                    )
                                                                }
                                                            />
                                                        </Space>
                                                    </Row>
                                                );
                                            },
                                        },
                                    ]}
                                    dataSource={contractResources}
                                    loading={dataQuery.isFetching}
                                    locale={{
                                        emptyText: (
                                            <Space
                                                direction={'vertical'}
                                                className={'d-flex'}
                                                size={30}
                                            >
                                                <Typography.Title
                                                    level={5}
                                                    className={'nm-typo text-center'}
                                                    style={{ marginTop: '14px' }}
                                                >
                                                    {statusId === Constants.CONTRACT.STATUS.LUU_NHAP ? (
                                                        <>
                                                            Bạn chưa tải lên hợp đồng nào.
                                                            <br />
                                                            Hãy bắt đầu bằng cách tải lên để sử dụng ngay!
                                                        </>
                                                    ) : (
                                                        'Không có dữ liệu'
                                                    )}
                                                </Typography.Title>
                                            </Space>
                                        ),
                                    }}
                                    pagination={{
                                        pageSize: 10,
                                        total: dataQuery.data.total,
                                        hideOnSinglePage: true,
                                        showSizeChanger: false,
                                        current: filters.page,
                                        position: ['bottomCenter'],
                                        onChange: (pageNumber: number) =>
                                            setFilters((prevState) => ({
                                                ...prevState,
                                                page: pageNumber,
                                            })),
                                    }}
                                    scroll={{ x: 'max-content' }}
                                />
                            </Space>
                        </Col>
                    </Row>
                </div>
            </section>

            <ContractUploadModal ref={contractUploadModalRef} onView={onView} />
            <ContractDetailModal ref={contractDetailModalRef} />
            <ContractEditModal ref={contractEditModalRef} />
            <ContractDeleteModal ref={contractDeleteModalRef} isDetail={false} />
            <ContractCancelModal ref={contractCancelModalRef} />
        </RootLayout>
    );
}

export default ContractsScreen;

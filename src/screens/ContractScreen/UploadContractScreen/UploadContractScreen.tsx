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
    Upload,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    StopOutlined,
    UploadOutlined,
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
import ContractSidebarRoutes from '@/src/screens/ContractScreen/components/ContractSidebarRoutes';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import Constants from '@/src/constants/Constants';
import { ConstantsHelper } from '@/src/constants/ConstantsHelper';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import { useRouter } from 'next/router';
import ContractRouteUtils from '@/src/data/contract/utils/ContractRouteUtils';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { withThemeRevert } from '@/theme';
import useContractSave from '@/src/screens/ContractScreen/hooks/useContractSave';

interface UploadContractScreenProps {
    filters: ContractFilterParams;
    id: string | null;
}

function UploadContractScreen(props: UploadContractScreenProps) {
    const { filters: requestFilters, id: contractId } = props;

    const router = useRouter();
    const [form] = Form.useForm();
    const { isDesktop } = useBreakpoint();

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

    function onView(contractResource: ContractResource) {
        // contractDetailModalRef.current?.open(contractResource);
        router.push(ContractRouteUtils.toDetailUrl(contractResource));
    }

    // function sortByLastModified(a: ContractResource, b:ContractResource) {
    //     return datetimeUtils.getMoment(b.updatedDate)?.diff(datetimeUtils.getMoment(a.updatedDate)) || 0;
    // }

    const onContractSaveSuccess = useCallback((data: ContractResource) => {
        onView(data);
        form.resetFields();
    }, [onView]);

    const contractSaveMutation = useContractSave({
        onSuccess: onContractSaveSuccess,
    })

    return (
        <RootLayout>
            <Head>
                <title>Tải tài liệu ký</title>
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
                            { title: 'Tải tài liệu ký' },
                        ]}
                    />
                </div>
            </section>

            <section className={'sectionContainer jobManage'}>
                <div className="contentWrapper">
                    <Row gutter={[60, 24]}>
                        <Col xs={24} lg={6}>
                            <div className={'desktopFilterContainer'}>
                                <ContractSidebarRoutes statusId={ null } />
                            </div>
                        </Col>

                        <Col xs={24} lg={18}>
                            <Space
                                size={40}
                                direction={'vertical'}
                                className={'jobListContainer d-flex'}
                                style={{
                                    marginBottom: '15px'
                                }}
                            >
                                <Row
                                    justify={'space-between'}
                                    align={'middle'}
                                    gutter={[20, 20]}
                                >
                                    <Col>
                                        <Typography.Title level={3} className={'title nm-typo'}>
                                            Tải tài liệu ký
                                        </Typography.Title>
                                    </Col>
                                </Row>

                                <Form
                                    form={form}
                                    layout={'vertical'}
                                    initialValues={{
                                        name: null,
                                        attachments: [],
                                    }}
                                    onFinish={contractSaveMutation.mutate}
                                >
                                    <Row gutter={[16, 0]}>
                                        <Col span={12}>
                                            <Form.Item
                                                label={'Tên tài liệu'}
                                                name={'name'}
                                                rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu' }]}
                                            >
                                                <Input
                                                    size={'large'}
                                                    placeholder={'Nhập tên tài liệu'}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                label={'Tài liệu'}
                                                name={'attachments'}
                                                rules={[{ required: true, message: 'Vui lòng tải tài liệu' }]}
                                                valuePropName={'fileList'}
                                                getValueFromEvent={(e) => e.fileList}
                                            >
                                                <Upload
                                                    beforeUpload={(fileInfo, files) => {
                                                        form.setFieldValue('attachments', files);
                                                        return false;
                                                    }}
                                                    onRemove={() => form.setFieldValue('attachments', [])}
                                                    accept={['.pdf'].join(',')}
                                                    maxCount={5}
                                                    multiple={true}
                                                    className={'uploadFullWidth'}
                                                >
                                                    <Row className={'uploadDropzoneContainer'} justify={'space-between'} align={'middle'}>
                                                        <Typography.Paragraph type={'secondary'} className={'nm-typo'}>
                                                            Vui lòng tải lên tệp PDF
                                                        </Typography.Paragraph>

                                                        <Button size={'small'} icon={(<UploadOutlined />)}>
                                                            Tải tệp
                                                        </Button>
                                                    </Row>
                                                </Upload>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                                
                                <Row justify={'center'}>
                                    {withThemeRevert(
                                        <Button
                                            onClick={form.submit}
                                            loading={contractSaveMutation.isLoading}
                                            disabled={contractSaveMutation.isLoading}
                                            type={'primary'}
                                            style={{ width: '150px' }}
                                        >
                                            {contractSaveMutation.isLoading ? 'Đang tải...' : 'Tải tài liệu'}
                                        </Button>
                                    )}
                                </Row>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </section>
        </RootLayout>
    );
}

export default UploadContractScreen;

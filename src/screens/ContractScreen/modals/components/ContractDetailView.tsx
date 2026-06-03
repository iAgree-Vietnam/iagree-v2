import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Button,
    Col,
    Descriptions,
    List,
    Popconfirm,
    Row,
    Space,
    Typography,
} from 'antd';
import {
    DownloadOutlined,
    SendOutlined,
    StopOutlined,
} from '@ant-design/icons';
import {
    FullContractResource,
    SignatureOutputResource,
} from '@/src/data/contract/models/contract.types';
import SignUserItem from '@/src/screens/ContractScreen/modals/components/SignUserItem';
import useContractSignDelete from '@/src/screens/ContractScreen/hooks/sign/useContractSignDelete';
import PDFViewer from '@/src/components/pdf-viewer/PDFViewer';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import {
    DroppablePage,
    DropParams,
} from '@/src/screens/ContractScreen/modals/components/DroppablePage';
import StringUtils from '@/src/utils/StringUtils';
import _, { divide } from 'lodash';
import useContractCheckSignOnMySign from '@/src/screens/ContractScreen/hooks/flow/useContractCheckSignOnMySign';
import useContractUpdateSignatures from '@/src/screens/ContractScreen/hooks/sign/useContractUpdateSignatures';
import Constants from '@/src/constants/Constants';
import useContractResendSignRequest from '../../hooks/flow/useContractResendSignRequest';
import useContractRequestMailToSign from '../../hooks/flow/useContractRequestMailToSign';
import FileUtils from '@/src/utils/FileUtils';
import { PDFDocument } from 'pdf-lib';
import useContractUpdatePDF from '../../hooks/useContractUpdatePDF';
import { ContractEditModalizeHelperVisible } from '../ContractEditModal';
import ContractCancelModal from '../ContractCancelModal';
import { ConstantsHelper } from '@/src/constants/ConstantsHelper';
import ContractSendSignRequestModal from '../ContractSendSignRequestModal';
import { ModalizeHelperVisible } from '@/src/data/base/models/base.types';
import ContractSendSignRequestSuccessModal from '../ContractSendSignRequestSuccessModal';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

interface ContractDetailViewProps {
    data: FullContractResource;
}

function ContractDetailView(props: ContractDetailViewProps) {
    const { isDesktop } = useBreakpoint();

    const contractCancelModalRef =
        useRef<ContractEditModalizeHelperVisible>(null);
    const contractSendSignRequestModalRef = useRef<ModalizeHelperVisible>(null);
    const contractSendSignRequestSuccessModalRef =
        useRef<ModalizeHelperVisible>(null);
    const fullContractResource = props.data;

    const [signatures, setSignatures] = useState<SignatureOutputResource[]>([]);
    const updateSignMutation = useContractUpdateSignatures();
    const deleteMutation = useContractSignDelete(fullContractResource);
    const requestMailToSignMutation = useContractRequestMailToSign({
        onSuccess: () => contractSendSignRequestSuccessModalRef.current?.open(),
    });
    const updatePDFMutation = useContractUpdatePDF();

    // const checkSignOnMySignMutation = useContractCheckSignOnMySign();
    const resendSignRequest = useContractResendSignRequest();

    useEffect(() => {
        if (!_.isEmpty(signatures)) {
            updateSignMutation.mutate({
                ...fullContractResource,
                signatures: signatures,
            });
        }
    }, [signatures]);

    function onDrop(dropParams: DropParams) {
        const { pageNumber, item: signUserResource, coordinates } = dropParams;

        setSignatures((prevState: any[]) => {
            const filterDatas = prevState.filter(
                (i) => i.uniqueId !== signUserResource.uniqueId
            );

            const signResult: SignatureOutputResource = {
                uniqueId: _.isEmpty(signUserResource.uniqueId)
                    ? [StringUtils.uuid(), new Date().valueOf()].join('_')
                    : (signUserResource.uniqueId as string | undefined),
                signId: signUserResource.signId,
                pageNumber: pageNumber,
                x: coordinates.x,
                y: coordinates.y,
                imageUrl: signUserResource.imageUrl,
                width: Constants.CONTRACT.SIGN_IMG_SIZE.WIDTH,
                height: Constants.CONTRACT.SIGN_IMG_SIZE.HEIGHT,
            };

            return filterDatas.concat([signResult]);
        });
    }

    function onSignatureResize(id: string | undefined, width: number, height: number) {
        if (!id) return;
        
        setSignatures((prevState) => {
            return prevState.map((signature) => {
                if (signature.uniqueId === id) {
                    return {
                        ...signature,
                        width,
                        height,
                    };
                }
                return signature;
            });
        });
    }

    const confirmRequestMailToSign = async () => {
        if (!fullContractResource) return;

        let isSetupSign = true;

        fullContractResource?.signUsers?.forEach((signUser) => {
            const { pageNumber, top, left } = signUser;
            if (!pageNumber || !top || !left) {
                isSetupSign = false;
                return;
            }
        });

        // if (!isSetupSign) {
        //     message.error('Vui lòng cấu hình chân ký');
        //     return;
        // }

        if (isSetupSign) {
            await addImageToPDF();
        }

        requestMailToSignMutation.mutate(fullContractResource);
        contractSendSignRequestModalRef.current?.close();
    };

    async function addImageToPDF() {
        try {
            if (!fullContractResource) return;

            // Load PDF hiện tại
            const existingPdfBytes = await fetch(fullContractResource.fileUrl).then(
                (res) => res.arrayBuffer()
            );

            // Tạo một tài liệu PDF từ file hiện có
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();

            let isDrewSign = false;

            // for (const signUser of fullContractResource.signUsers) {
            //     const { pageNumber, imageUrl, top, left } = signUser;

            //     if (!pageNumber || !top || !left) {
            //         isDrewSign = false;
            //         return;
            //     }

            //     // Load page có chữ ký
            //     const currentPage = pages[pageNumber - 1];
            //     // Load ảnh từ URL
            //     const imageBytes = await fetch(imageUrl).then((res) =>
            //         res.arrayBuffer()
            //     );

            //     let image = null;

            //     const isJpgExtension = imageUrl.toLowerCase().includes('.jpg');
            //     const isPngExtension = imageUrl.toLowerCase().includes('.png');

            //     // Nhúng ảnh vào PDF
            //     if (isJpgExtension) {
            //         image = await pdfDoc.embedJpg(imageBytes);
            //     }
            //     if (isPngExtension) {
            //         image = await pdfDoc.embedPng(imageBytes);
            //     }

            //     if (image) {
            //         const { height: pdfHeight } = currentPage.getSize();

            //         // const scale = pdfHeight / pageHeight
            //         const scale = 1;

            //         // Thêm ảnh vào trang với tọa độ cụ thể (x, y)
            //         currentPage.drawImage(image, {
            //             x: left,
            //             y:
            //                 pdfHeight - top * scale - Constants.CONTRACT.SIGN_IMG_SIZE.HEIGHT,
            //             width: Constants.CONTRACT.SIGN_IMG_SIZE.WIDTH,
            //             height: Constants.CONTRACT.SIGN_IMG_SIZE.HEIGHT,
            //         });
            //         isDrewSign = true;
            //     }
            // }

            const signaturesByUser = new Map();
            signatures.forEach(signature => {
                signaturesByUser.set(signature.signId, signature);
            });

            for (const signUser of fullContractResource.signUsers) {
                const { signId, pageNumber, imageUrl } = signUser;
                
                // Get the signature for this user if it exists
                const signature = signaturesByUser.get(signId);
                
                if (!signature) continue;
                
                const { pageNumber: sigPageNumber, x, y, width, height, imageUrl: sigImageUrl } = signature;

                if (!sigPageNumber) {
                    continue;
                }

                // Load page có chữ ký
                const currentPage = pages[sigPageNumber - 1];
                // Load ảnh từ URL
                const imageBytes = await fetch(sigImageUrl).then((res) =>
                    res.arrayBuffer()
                );

                let image = null;

                const isJpgExtension = sigImageUrl.toLowerCase().includes('.jpg');
                const isPngExtension = sigImageUrl.toLowerCase().includes('.png');

                // Nhúng ảnh vào PDF
                if (isJpgExtension) {
                    image = await pdfDoc.embedJpg(imageBytes);
                }
                if (isPngExtension) {
                    image = await pdfDoc.embedPng(imageBytes);
                }

                if (image) {
                    const { height: pdfHeight } = currentPage.getSize();

                    // Use signature's width and height if available, otherwise use defaults
                    const signWidth = width || Constants.CONTRACT.SIGN_IMG_SIZE.WIDTH;
                    const signHeight = height || Constants.CONTRACT.SIGN_IMG_SIZE.HEIGHT;

                    // Thêm ảnh vào trang với tọa độ cụ thể (x, y) và kích thước tùy chỉnh
                    currentPage.drawImage(image, {
                        x: x,
                        y: pdfHeight - y - signHeight, // Adjust y coordinate for PDF coordinate system
                        width: signWidth,
                        height: signHeight,
                    });
                    isDrewSign = true;
                }
            }

            if (isDrewSign) {
                // Lưu PDF đã chỉnh sửa thành file mới
                const pdfBytes: any = await pdfDoc.save();

                // Lưu file dưới dạng Blob để tải xuống
                const blob: any = new Blob([pdfBytes], { type: 'application/pdf' });

                const pdfFile = new File([blob], 'signed.pdf', {
                    type: 'application/pdf',
                });

                updatePDFMutation.mutate({
                    pdfFile,
                    contractId: fullContractResource.contractId,
                });
            }
        } catch (err) { }
    }

    const downloadInfo = useMemo(() => {
        if (!fullContractResource) return;

        const fileResource = fullContractResource.fileUrl;
        const fileName = StringUtils.normalizeDownloadFilename(
            fullContractResource.name
        );
        const fileExt = FileUtils.getFileExtension(fileResource);
        return {
            fileResource,
            fileName: `${fileName}.${fileExt}`,
        };
    }, [fullContractResource]);

    const onDownloadContract = () => {
        if (!downloadInfo) return;
        FileUtils.downloadFromUrl(downloadInfo.fileResource, downloadInfo.fileName);
    };

    return (
        <DndProvider backend={HTML5Backend} debugMode={true}>
            <Row gutter={[40, 40]} align={'top'} wrap={!isDesktop ? true : false}>
                {fullContractResource.signUsers.length > 0 && (
                    <Col {...(!isDesktop ? { span: 24 } : { flex: '325px' })}>
                        <div className={'signListContainer'}>
                            <List
                                dataSource={fullContractResource.signUsers}
                                renderItem={(item, index) => {
                                    return (
                                        <SignUserItem
                                            index={index}
                                            data={item}
                                            onDelete={
                                                fullContractResource.status ===
                                                    Constants.CONTRACT.STATUS.LUU_NHAP
                                                    ? deleteMutation.mutate
                                                    : null
                                            }
                                            onResendSignRequest={resendSignRequest.mutate}
                                        // onCheckStatus={checkSignOnMySignMutation.mutate}
                                        />
                                    );
                                }}
                                rowKey={'signId'}
                            />
                        </div>
                    </Col>
                )}

                <Col {...(!isDesktop ? { span: 24 } : { flex: 'auto' })}>
                    <PDFViewer
                        fileUrl={fullContractResource.fileUrl}
                        pageProps={{ width: undefined, className: 'reactPdfPageContainer' }}
                        renderPage={
                            fullContractResource.status === Constants.CONTRACT.STATUS.LUU_NHAP
                                ? ({ index }) => {
                                    return (
                                        <DroppablePage
                                            pageProps={{
                                                pageNumber: index,
                                                width: undefined,
                                                className: 'reactPdfPageContainer',
                                            }}
                                            signatures={signatures}
                                            onDrop={onDrop}
                                            onSignatureResize={onSignatureResize}
                                        />
                                    );
                                }
                                : undefined
                        }
                    />
                </Col>

                <Col {...(!isDesktop ? { span: 24 } : { flex: '325px' })}>
                    <Space className={'d-flex'} direction={'vertical'} size={[20, 20]}>
                        <div className={'gradientView rounded'}>
                            <Typography.Title className={'title nm-typo'} level={3}>
                                Trạng thái
                            </Typography.Title>
                            <div
                                className={'status'}
                                style={{
                                    backgroundColor: ConstantsHelper.getContractStatusBg(
                                        fullContractResource.status
                                    ),
                                }}
                            >
                                {ConstantsHelper.getContractStatusTitle(
                                    fullContractResource.status
                                )}
                            </div>
                        </div>
                        <Space
                            className={'rounded d-flex'}
                            size={[20, 20]}
                            direction={'vertical'}
                        >
                            <Typography.Title className={'title nm-typo'} level={3}>
                                Danh sách người ký
                            </Typography.Title>
                            <Space
                                className={'gradientView d-flex'}
                                direction={'vertical'}
                                size={15}
                            >
                                {fullContractResource.signUsers.length > 0
                                    ? fullContractResource.signUsers.map((item) => (
                                        <div
                                            key={item.signId}
                                            className={'d-flex'}
                                            style={{ justifyContent: 'space-between', gap: '16px' }}
                                        >
                                            <Typography.Title
                                                level={5}
                                                className={'nm-typo'}
                                                style={{ fontSize: '15px', lineHeight: '20px' }}
                                            >
                                                {item.signName}
                                            </Typography.Title>
                                            <div
                                                className={'statusSign'}
                                                style={{
                                                    backgroundColor:
                                                        ConstantsHelper.getContractSignStatusBg(
                                                            fullContractResource.status
                                                        ),
                                                }}
                                            >
                                                {item.status !==
                                                    Constants.CONTRACT.SIGN_STATUS.EXTENSION
                                                    ? ConstantsHelper.getContractSignStatusTitle(
                                                        item.status
                                                    )
                                                    : 'Đang chờ'}
                                            </div>
                                        </div>
                                    ))
                                    : 'Chưa có người ký'}
                            </Space>
                            <Space
                                className={'d-flex'}
                                size={[10, 10]}
                                direction={'vertical'}
                            >
                                {fullContractResource.status ===
                                    Constants.CONTRACT.STATUS.LUU_NHAP && (
                                        <Button
                                            onClick={() =>
                                                contractSendSignRequestModalRef.current?.open()
                                            }
                                            icon={<SendOutlined />}
                                            type={'primary'}
                                            block
                                        >
                                            Gửi yêu cầu ký
                                        </Button>
                                    )}
                                {/* {fullContractResource.status !==
                                    Constants.CONTRACT.STATUS.LUU_NHAP &&
                                    downloadInfo && (
                                        <Popconfirm
                                            placement={'topLeft'}
                                            title={'Tải xuống hợp đồng'}
                                            description={
                                                <Typography>
                                                    Xác nhận tải xuống hợp đồng{' '}
                                                    <strong>{downloadInfo.fileName}</strong>
                                                </Typography>
                                            }
                                            okText={'Tải xuống'}
                                            cancelText={'Hủy'}
                                            onConfirm={onDownloadContract}
                                        >
                                            <Button
                                                block
                                                icon={<DownloadOutlined />}
                                                type={'primary'}
                                            >
                                                Tải xuống hợp đồng
                                            </Button>
                                        </Popconfirm>
                                    )} */}
                                {fullContractResource.status ===
                                    Constants.CONTRACT.STATUS.DANG_XU_LY && (
                                        <Button
                                            block
                                            disabled={
                                                fullContractResource.status !==
                                                Constants.CONTRACT.STATUS.DANG_XU_LY
                                            }
                                            icon={<StopOutlined />}
                                            onClick={() =>
                                                contractCancelModalRef.current?.open(fullContractResource)
                                            }
                                        >
                                            Hủy luồng ký
                                        </Button>
                                    )}
                            </Space>
                        </Space>
                    </Space>
                </Col>
            </Row>

            <ContractCancelModal ref={contractCancelModalRef} />
            <ContractSendSignRequestModal
                onConfirm={confirmRequestMailToSign}
                ref={contractSendSignRequestModalRef}
            />
            <ContractSendSignRequestSuccessModal
                ref={contractSendSignRequestSuccessModalRef}
            />
        </DndProvider>
    );
}

export default ContractDetailView;

import React, { useCallback, useImperativeHandle, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Modal, Spin, Typography } from 'antd';
import { withThemeRevert } from '@/theme';
import useUpdateDocument from '../hooks/useUpdateDocument';
import useDocumentDirectPreview from '../hooks/useDocumentDirectPreview';
import { DocumentDirectPreviewParams } from '@/src/data/document/models/document.types';

export type ModalizeDocumentPreviewHelperVisible = {
    open: (variables: DocumentDirectPreviewParams) => void;
    close: () => void;
};

const PDFViewerSlider = dynamic(
    () => import('@/src/components/pdf-viewer/PDFViewerSlider'),
    {
        ssr: false,
    }
);

const DocumentPreviewModal = React.forwardRef((props, ref) => {
    const [isOpen, setOpen] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [params, setParams] = useState<DocumentDirectPreviewParams | null>(null);
    const directPreviewMutation = useDocumentDirectPreview({
        onSuccess: (data, variables) => {
            setFileUrl(data), setParams(variables);
        },
    });

    const close = useCallback(() => setOpen(false), []);
    const open = useCallback((variables: DocumentDirectPreviewParams) => {
        setOpen(true);
        directPreviewMutation.mutate(variables);
    }, []);

    useImperativeHandle(
        ref,
        useCallback(() => ({ open, close }), [open, close])
    );

    const documentSaveMutation = useUpdateDocument();

    function renderView() {
        if (directPreviewMutation.isLoading || !fileUrl) {
            return (
                <div className={'templatePreviewLoading'}>
                    <div className={'templatePreviewLoadingSpin'}>
                        <Spin size={'small'} />
                    </div>

                    <Typography.Paragraph>
                        Đang tải bản xem trước, xin đợi...
                    </Typography.Paragraph>
                </div>
            );
        }

        return (
            <PDFViewerSlider fileUrl={fileUrl as string} pageProps={{ width: 500 }} />
        );
    }

    function renderInfo() {
        return (
            <div className={'previewContentWrapper'}>
                <Typography.Title className={'templateName nm-typo'} level={3}>
                    Xem trước văn bản
                </Typography.Title>
                <Typography.Title className={'labelTemplate'} level={4}>
                    Tên văn bản
                </Typography.Title>
                <div className={'priceLineContainer'} style={{ background: '#EFF0F3' }}>
                    {params?.title}
                </div>
                {withThemeRevert(
                    <Button
                        type={'primary'}
                        loading={documentSaveMutation.isLoading}
                        disabled={documentSaveMutation.isLoading}
                        onClick={() => {
                            if (params)
                                documentSaveMutation.mutate({
                                    ...params
                                });
                        }}
                        block
                        style={{ marginTop: '20px' }}
                    >
                        Lưu
                    </Button>
                )}
            </div>
        );
    }

    return (
        <Modal
            open={isOpen}
            className={'templatePreviewModalContainer'}
            onCancel={close}
            footer={null}
            centered={true}
            width={'900px'}
        >
            <div className={'previewRowContainer'}>
                <div className="previewWrapperSlider">{renderView()}</div>
                {renderInfo()}
            </div>
        </Modal>
    );
});

DocumentPreviewModal.displayName = 'DocumentPreviewModal';

export default DocumentPreviewModal;

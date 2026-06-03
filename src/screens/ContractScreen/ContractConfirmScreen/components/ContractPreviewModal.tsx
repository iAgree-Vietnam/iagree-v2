import React, { useCallback, useImperativeHandle, useState } from 'react';
import dynamic from 'next/dynamic';
import { Modal } from 'antd';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

export type ModalizeContractPreviewHelperVisible = {
    open: (fileUrl: string) => void;
    close: () => void;
};

const PDFViewerSlider = dynamic(
    () => import('@/src/components/pdf-viewer/PDFViewerSlider'),
    {
        ssr: false,
    }
);

const ContractPreviewModal = React.forwardRef((props, ref) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const { isTablet } = useBreakpoint();

    const close = useCallback(() => setFileUrl(null), []);
    const open = useCallback((fileUrl: string) => setFileUrl(fileUrl), []);

    useImperativeHandle(
        ref,
        useCallback(() => ({ open, close }), [open, close])
    );

    function renderView() {
        return (
            <PDFViewerSlider fileUrl={fileUrl as string} pageProps={{ width: 500 }} />
        );
    }

    return (
        <Modal
            open={Boolean(fileUrl)}
            className={'templatePreviewModalContainer'}
            onCancel={close}
            footer={null}
            title={'Xem hợp đồng'}
            centered={true}
            width={isTablet ? '100vw' : '580px'}
        >
            <div className={'previewRowContainer'}>
                <div className="previewWrapperSlider">{renderView()}</div>
            </div>
        </Modal>
    );
});

ContractPreviewModal.displayName = 'ContractPreviewModal';

export default ContractPreviewModal;

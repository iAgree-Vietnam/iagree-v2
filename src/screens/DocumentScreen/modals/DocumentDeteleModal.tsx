import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Col, Modal, Row, Typography } from 'antd';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import useDocumentDelete from '../hooks/useDocumentDelete';
import { DocumentResource } from '@/src/data/document/models/document.types';

export interface DocumentDeleteModalizeHelperVisible {
    open: (documentResource: DocumentResource) => void;
    close: () => void;
}

const DocumentDeleteModal = React.forwardRef((_, ref) => {
    const [documentResource, setDocumentResource] =
        useState<DocumentResource | null>(null);

    const deleteMutation = useDocumentDelete();

    const open = useCallback(
        (documentResource: DocumentResource) =>
            setDocumentResource(documentResource),
        []
    );
    const close = useCallback(() => setDocumentResource(null), []);

    useImperativeHandle(
        ref,
        useCallback(() => ({ open, close }), [open, close])
    );

    return (
        <Modal
            open={Boolean(documentResource)}
            className={'documentDeleteModalContainer'}
            onCancel={close}
            footer={null}
            width={'500px'}
        >
            <Row justify={'center'} gutter={[30, 30]}>
                <Col span={24}>
                    <Row justify={'center'} style={{ marginBottom: '12px' }}>
                        <IconSvgLocal
                            fill={'none'}
                            name={'IC_INFO_DANGER'}
                            width={60}
                            height={59}
                        />
                    </Row>
                    <Typography.Paragraph className={'modalTitle'}>
                        Xác nhận xoá văn bản
                    </Typography.Paragraph>
                    <Typography.Paragraph className={'modalSubtitle text-center nm-typo'}>
                        Bạn chắc chắn muốn xoá văn bản này không? Sau khi xoá sẽ không thể
                        xem và khôi phục dữ liệu về văn bản này nữa.
                    </Typography.Paragraph>
                </Col>

                <Button
                    onClick={() => {
                        if (documentResource) deleteMutation.mutate(documentResource);
                        close();
                    }}
                    loading={deleteMutation.isLoading}
                    disabled={deleteMutation.isLoading}
                    type={'primary'}
                    danger
                >
                    Xóa văn bản
                </Button>
            </Row>
        </Modal>
    );
});

DocumentDeleteModal.displayName = 'DocumentDeleteModal';

export default DocumentDeleteModal;

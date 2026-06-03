import React, {
    useState,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { Modal, Typography } from 'antd';
import _ from 'lodash';

import { DocumentSharedResource } from '@/src/data/document/models/document.types';
import useRejectShareDocument from '@/src/screens/DocumentScreen/DocumentSharedScreen/hooks/useRejectShareDocument';

export type DocumentSharedRejectModalizeHelperVisible = {
    open: (modal: ModalState) => void;
    close: () => void;
};

interface ModalState {
    documentResource: DocumentSharedResource | null;
    successCallback?: () => void;
}

const DocumentSharedRejectModal = forwardRef((props, ref) => {
    const [modal, setModal] = useState<ModalState>({ documentResource: null });

    const rejectShareMutation = useRejectShareDocument({
        onSuccess: () => {
            close();
            if (modal.successCallback) modal.successCallback();
        },
    });

    const open = useCallback((modal: ModalState) => setModal(modal), [setModal]);
    const close = useCallback(() => {
        setModal({ documentResource: null });
    }, [setModal]);

    useImperativeHandle(
        ref,
        useCallback(() => ({ open, close }), [open, close])
    );

    return (
        <Modal
            title={'Từ chối văn bản'}
            open={!_.isNull(modal.documentResource)}
            cancelText={'Hủy'}
            onCancel={close}
            okType={'danger'}
            okText={'Từ chối'}
            onOk={() =>
                modal.documentResource &&
                rejectShareMutation.mutate(modal.documentResource)
            }
            centered={true}
        >
            <Typography>Bạn có chắc chắn muốn từ chối văn bản này?</Typography>
            <Typography>
                Văn bản bị từ chối sẽ không thể được truy cập hoặc xem lại cho đến khi
                chủ sở hữu thực hiện chia sẻ lại văn bản
            </Typography>
        </Modal>
    );
});

DocumentSharedRejectModal.displayName = 'DocumentSharedRejectModal';

export default DocumentSharedRejectModal;

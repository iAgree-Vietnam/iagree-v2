import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Col, Modal, Row, Typography } from 'antd';
import { FullJobResource } from '@/src/data/job/models/job.types';
import useDeleteJob from '@/src/screens/UserScreen/UserJobsScreen/hooks/useDeleteJob';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

export interface JobDeleteModalizeHelperVisible {
    open: (jobResource: FullJobResource) => void;
    close: () => void;
}

const JobDeleteModal = React.forwardRef((_, ref) => {
    const [jobResource, setJobResource] = useState<FullJobResource | null>(null);

    const deleteMutation = useDeleteJob();

    const open = useCallback(
        (jobResource: FullJobResource) => setJobResource(jobResource),
        []
    );
    const close = useCallback(() => setJobResource(null), []);

    useImperativeHandle(
        ref,
        useCallback(() => ({ open, close }), [open, close])
    );

    return (
        <Modal
            open={Boolean(jobResource)}
            className={'jobDeleteModalContainer'}
            onCancel={close}
            footer={null}
            width={'500px'}
        >
            <Row justify={'center'} gutter={[30, 30]}>
                <Col span={24}>
                    <Row justify={'center'} style={{ marginBottom: '12px' }}>
                        <IconSvgLocal fill={'none'} name={'IC_INFO_DANGER'} width={60} height={59} />
                    </Row>
                    <Typography.Paragraph
                        className={'modalTitle'}
                    >
                        Xác nhận xoá công việc
                    </Typography.Paragraph>
                    <Typography.Paragraph
                        className={'modalSubtitle text-center nm-typo'}
                    >
                        Bạn chắc chắn muốn xoá công việc này không? Sau khi xoá sẽ không thể
                        xem và khôi phục dữ liệu về công việc này nữa.
                    </Typography.Paragraph>
                </Col>

                <Button
                    onClick={async () => {
                        if (jobResource) {
                            try {
                                await deleteMutation.mutateAsync({ jobId: jobResource.jobId });
                                close();
                            } catch (err) { }
                        }
                    }}
                    loading={deleteMutation.isLoading}
                    disabled={deleteMutation.isLoading}
                    type={'primary'}
                    danger
                >
                    Xóa công việc
                </Button>
            </Row>
        </Modal>
    );
});

JobDeleteModal.displayName = 'JobDeleteModal';

export default JobDeleteModal;

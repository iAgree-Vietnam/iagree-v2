import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Col, Modal, Row, Typography } from 'antd';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { FullContractResource } from '@/src/data/contract/models/contract.types';
import useContractCancel from '../hooks/useContractCancel';

const ContractCancelModal = React.forwardRef((_, ref) => {
    const [contractResource, setContractResource] =
        useState<FullContractResource | null>(null);

    const cancelMutation = useContractCancel();

    const open = useCallback(
        (data: FullContractResource) => setContractResource(data),
        []
    );
    const close = useCallback(() => setContractResource(null), []);

    useImperativeHandle(
        ref,
        useCallback(() => ({ open, close }), [open, close])
    );

    return (
        <Modal
            open={Boolean(contractResource)}
            className={'contractCancelModalContainer'}
            onCancel={close}
            footer={null}
            width={'500px'}
        >
            <Row justify={'center'} gutter={[30, 30]}>
                <Col span={24}>
                    <Row justify={'center'} style={{ marginBottom: '12px' }}>
                        <IconSvgLocal
                            name={'IC_INFO_DANGER'}
                            width={60}
                            height={59}
                        />
                    </Row>
                    <Typography.Paragraph className={'modalTitle'}>
                        Xác nhận hủy luồng ký
                    </Typography.Paragraph>
                    <Typography.Paragraph className={'modalSubtitle text-center nm-typo'}>
                        Bạn chắc chắn muốn hủy luồng ký này? Tất cả tiến trình sẽ bị mất và tài liệu sẽ trở về trạng thái chưa ký
                    </Typography.Paragraph>
                </Col>

                <Button
                    onClick={() => {
                        if (contractResource) cancelMutation.mutate(contractResource);
                        close();
                    }}
                    loading={cancelMutation.isLoading}
                    disabled={cancelMutation.isLoading}
                    type={'primary'}
                    danger
                >
                    Hủy luồng ký
                </Button>
            </Row>
        </Modal>
    );
});

ContractCancelModal.displayName = 'ContractCancelModal';

export default ContractCancelModal;

import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Col, Modal, Row, Typography } from 'antd';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { FullContractResource } from '@/src/data/contract/models/contract.types';
import useContractDelete from '../hooks/useContractDelete';

interface ContractDeleteModalProps {
    isDetail: boolean;
}

const ContractDeleteModal = React.forwardRef(
    ({ isDetail }: ContractDeleteModalProps, ref) => {
        const [contractResource, setContractResource] =
            useState<FullContractResource | null>(null);

        const deleteMutation = useContractDelete(isDetail);

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
                className={'contractDeleteModalContainer'}
                onCancel={close}
                footer={null}
                width={'500px'}
            >
                <Row justify={'center'} gutter={[30, 30]}>
                    <Col span={24}>
                        <Row justify={'center'} style={{ marginBottom: '12px' }}>
                            <IconSvgLocal name={'IC_INFO_DANGER'} width={60} height={59} />
                        </Row>
                        <Typography.Paragraph className={'modalTitle'}>
                            Xác nhận xoá hợp đồng
                        </Typography.Paragraph>
                        <Typography.Paragraph
                            className={'modalSubtitle text-center nm-typo'}
                        >
                            Bạn chắc chắn muốn xoá hợp đồng này không? Sau khi xoá sẽ không
                            thể xem và khôi phục dữ liệu về hợp đồng này nữa.
                        </Typography.Paragraph>
                    </Col>

                    <Button
                        onClick={() => {
                            if (contractResource) deleteMutation.mutate(contractResource);
                            close();
                        }}
                        loading={deleteMutation.isLoading}
                        disabled={deleteMutation.isLoading}
                        type={'primary'}
                        danger
                    >
                        Xóa hợp đồng
                    </Button>
                </Row>
            </Modal>
        );
    }
);

ContractDeleteModal.displayName = 'ContractDeleteModal';

export default ContractDeleteModal;

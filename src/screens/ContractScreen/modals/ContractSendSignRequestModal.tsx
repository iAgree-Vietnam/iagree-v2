import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Col, Modal, Row, Typography } from 'antd';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { withThemeRevert } from '@/theme';

interface ContractSendSignRequestModalProps {
    onConfirm: () => void;
}

const ContractSendSignRequestModal = React.forwardRef(
    ({ onConfirm }: ContractSendSignRequestModalProps, ref) => {
        const [isOpen, setOpen] = useState<boolean>(false);

        const open = useCallback(() => setOpen(true), []);
        const close = useCallback(() => setOpen(false), []);

        useImperativeHandle(
            ref,
            useCallback(() => ({ open, close }), [open, close])
        );

        return (
            <Modal
                open={isOpen}
                className={'contractSendSignRequestModalContainer'}
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
                            Xác nhận gửi yêu cầu ký
                        </Typography.Paragraph>
                        <Typography.Paragraph className={'modalSubtitle text-center nm-typo'}>
                            Bạn có chắc muốn gửi yêu cầu ký hợp đồng này? Vui lòng kiểm tra kỹ
                            thông tin trước khi xác nhận. Sau khi gửi, bạn sẽ không thể thay
                            đổi thông tin
                        </Typography.Paragraph>
                    </Col>

                    {withThemeRevert(
                        <Button
                            onClick={onConfirm}
                            type={'primary'}
                        >
                            Gửi yêu cầu ký
                        </Button>
                    )}
                </Row>
            </Modal>
        );
    }
);

ContractSendSignRequestModal.displayName = 'ContractSendSignRequestModal';

export default ContractSendSignRequestModal;

import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Col, Modal, Row, Typography } from 'antd';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { withThemeRevert } from '@/theme';
import Link from 'next/link';
import ContractRouteUtils from '@/src/data/contract/utils/ContractRouteUtils';

const ContractSendSignRequestSuccessModal = React.forwardRef((_, ref) => {
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
            className={'contractSendSignRequestSuccessModalContainer'}
            onCancel={close}
            closeIcon={null}
            footer={null}
            width={'500px'}
        >
            <Row justify={'center'} gutter={[30, 30]}>
                <Col span={24}>
                    <Row justify={'center'} style={{ marginBottom: '12px' }}>
                        <IconSvgLocal name={'IC_CHECK_SUCCESS'} fill={'none'} width={60} height={59} />
                    </Row>
                    <Typography.Paragraph className={'modalTitle'}>
                        Gửi yêu cầu ký thành công
                    </Typography.Paragraph>
                    <Typography.Paragraph className={'modalSubtitle text-center nm-typo'}>
                        Yêu cầu ký hợp đồng của bạn dã được gửi thành công!
                        <br />
                        Bạn cũng có thể theo dõi trạng thái hợp đồng tại <Link href={ContractRouteUtils.toScreen({})} className={'link'}>trang quản lý hợp đồng.</Link>
                    </Typography.Paragraph>
                </Col>

                {withThemeRevert(
                    <Button onClick={close} type={'primary'} style={{ width: '120px' }}>
                        Đóng
                    </Button>
                )}
            </Row>
        </Modal>
    );
});

ContractSendSignRequestSuccessModal.displayName =
    'ContractSendSignRequestSuccessModal';

export default ContractSendSignRequestSuccessModal;

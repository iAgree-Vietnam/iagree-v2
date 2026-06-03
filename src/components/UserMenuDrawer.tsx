import React, {
  useCallback,
  useImperativeHandle,
  useState,
  forwardRef,
} from 'react';
import {
  Drawer,
  Menu,
  MenuProps,
  Grid,
  Space,
  Row,
  Col,
  Image,
  Typography,
} from 'antd';
import Link from 'next/link';
import { UseMutationResult } from '@tanstack/react-query';

import { FullProfileResource } from '@/src/data/auth/models/types';
import Images from '../constants/Images';

export interface UserMenuDrawerProps {
  fullProfileResource: Partial<FullProfileResource> | null;
  logoutMutation: UseMutationResult<unknown, unknown, void, unknown>;
  userMenu: MenuProps['items'];
  handleClickLogin: () => void;
}

const { useBreakpoint } = Grid;

const UserMenuDrawer = forwardRef((props: UserMenuDrawerProps, ref) => {
  const { fullProfileResource, logoutMutation, userMenu, handleClickLogin } =
    props;

  const screens = useBreakpoint();

  const [open, setOpen] = useState<boolean>(false);

  const openDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  useImperativeHandle(
    ref,
    useCallback(() => ({ openDrawer, closeDrawer }), [openDrawer, closeDrawer])
  );

  return (
    <Drawer
      title={
        <Link className={'logo'} href={'/'}>
          <img
            alt={'iagree'}
            src={'/assets/img/logo.svg'}
            className={'logoImg'}
          />
        </Link>
      }
      placement={'left'}
      width={'85%'}
      onClose={closeDrawer}
      open={open}
      closeIcon={false}
      className="menuDrawer"
    >
      <div className="menuWrapper">
        <Space
          direction={'vertical'}
          className={'d-flex'}
          size={20}
          style={{ padding: '24px 12px 12px 12px' }}
        >
          <Row gutter={16}>
            <Col flex={'72px'}>
              <Image
                preview={false}
                src={fullProfileResource?.avatarUrl}
                fallback={Images.ACCOUNT_DEFAULT}
                alt={'avatar'}
                className={'imgRounded'}
                width={56}
                height={56}
              />
            </Col>
            <Col flex={'none'}>
              <Typography.Title level={4} style={{ marginBottom: '4px' }}>
                {fullProfileResource?.fullName}
              </Typography.Title>
              <Typography.Paragraph
                className={'nm-typo'}
                style={{ color: '#74767E' }}
              >
                {fullProfileResource?.email}
              </Typography.Paragraph>
            </Col>
          </Row>
          <Menu className={'profileHeaderMenu'} items={userMenu} />
        </Space>
      </div>
    </Drawer>
  );
});

UserMenuDrawer.displayName = 'UserMenuDrawer';

export default UserMenuDrawer;

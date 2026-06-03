import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Row,
  Col,
  Menu,
  Typography,
  Space,
} from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import styles from './InternalWalletContainer.module.css';
import {
  SafetyOutlined,
} from "@ant-design/icons";
import { useAccountContext } from '@/src/contexts/AccountContext';
import AuthRouteUtils from '@/src/data/auth/utils/AuthRouteUtils';
import { IconSvgLocal } from './icon-svg-local';
import Constants from '../constants/Constants';

interface InternalWalletContainerProps {
  children: React.ReactNode;
}
export function InternalWalletContentBox({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
  return <div className="content" style={style}>{children}</div>;
}

export function InternalWalletContainer({ children }: InternalWalletContainerProps) {
  const router = useRouter();
  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;
  const isPartner = fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET;
  
  const { auth: userInfo } = useAccountContext();
  const internalWalletSideMenu: Array<ItemType & { key: string }> = [
    {
      key: AuthRouteUtils.toInternalWallet(),
      label: <Link href={AuthRouteUtils.toInternalWallet()}>Quản lý tài chính</Link>,
      icon: <IconSvgLocal name={'IC_WALLET'} />,
    },
    // {
    //   key: AuthRouteUtils.toWithDrawalMoney(),
    //   label: (
    //     <Link href={AuthRouteUtils.toWithDrawalMoney()}>{isPartner ? 'Hoàn/Rút tiền' : 'Yêu cầu rút tiền'}</Link>
    //   ),
    //   icon: <IconSvgLocal name={'IC_MONEY'} />,
    // },
    {
      key: AuthRouteUtils.toTransactionHistory(),
      label: <Link href={AuthRouteUtils.toTransactionHistory()}>
        Lịch sử giao dịch
        {/* {!isPartner ? 'Lịch sử chi tiêu ' : 'Lịch sử giao qua ví '} */}
        </Link>,
      icon: <IconSvgLocal name={'IC_TRANSACTION_HISTORY'} />,
    },
     {
      key: AuthRouteUtils.toManageInfo(),
      label: (
        <Link href={AuthRouteUtils.toManageInfo()}>
          Quản lý thông tin tài khoản 
        </Link>
      ),
      icon:  <SafetyOutlined />
    },
  ];

  if (isPartner) {
    // internalWalletSideMenu.push({
    //   key: AuthRouteUtils.toIncomeReconciliation(), 
    //   label: <Link href={AuthRouteUtils.toIncomeReconciliation()}>Thu nhập & Đối soát</Link>,
    //   icon: <IconSvgLocal name={'IC_INCOME'} />,
    // });
  }

  const selectedMenu = useMemo(() => {
    if (router.asPath === AuthRouteUtils.toInternalWallet()) {
      return [router.asPath];
    } else {
      const active = internalWalletSideMenu
        .slice(1)
        .find((item) => router.asPath.startsWith(item.key));
      if (active) return [active.key];
      else return [];
    }
  }, [router.asPath]);

  return (
    <section className={'sectionContainer templateSectionContainer profile'}>
      <div className="contentWrapper">
        <Row gutter={[60, 24]} align={'top'}>
          <Col xs={24} lg={6}>
            <div className={`sidebar ${styles.sideMenu}`}>
              <Space
                align={'start'}
                direction={'vertical'}
                size={'small'}
                className={'d-flex'}
              >
                <Typography className={'greetingText'}>Xin chào</Typography>
                <Typography className={'userFullname'}>
                  {userInfo?.fullName}
                </Typography>
              </Space>
              <Menu
                items={internalWalletSideMenu}
                selectedKeys={selectedMenu}
              />
            </div>
          </Col>
          <Col xs={24} lg={18}>
            {children}
          </Col>
        </Row>
      </div>
    </section>
  );
}
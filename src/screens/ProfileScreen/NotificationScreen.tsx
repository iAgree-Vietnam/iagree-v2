import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { Breadcrumb, Button, Col, List, Modal, Row } from 'antd';

import RootLayout from '@/src/layouts/RootLayout';
import { ProfileContainer } from '@/src/components/ProfileContainer';
import useFetchNotification from '@/src/hooks/query/useFetchNotification';
import { NotificationItem } from '@/src/components/notifications/NotificationItem';
import { NotificationFilterParams } from '@/src/data/notification/models/notification.types';
import { useDeleteNotification } from '@/src/screens/ProfileScreen/hooks/useDeleteNotification';
import DialogUtils from '@/src/utils/DialogUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { useUpdateNotification } from './hooks/useUpdateNotification';
import Constants from '@/src/constants/Constants';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

interface DeleteModalState {
  open: boolean;
  notificationId: number | null;
}

export function NotificationScreen() {
  const { isDesktop } = useBreakpoint();
  const [filters, setFilters] = useState<NotificationFilterParams>({
    page: 1,
    per_page: 10,
  });

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    open: false,
    notificationId: null,
  });

  const { data: notifications, isFetching } = useFetchNotification(filters);

  const deleteMutation = useDeleteNotification();

  const handleOpenDeleteModal = useCallback(
    (notificationId: number) => setDeleteModal({ open: true, notificationId }),
    []
  );

  const onDeleteNotification = useCallback(async () => {
    if (deleteModal.notificationId) {
      await deleteMutation.mutateAsync(deleteModal.notificationId);
      setDeleteModal({ open: false, notificationId: null });
    } else DialogUtils.showResponseError({}, 'NOTIFICATION_DELETE');
  }, [deleteModal.notificationId, deleteMutation]);

  const updateMutation = useUpdateNotification();

  return (
    <RootLayout>
      <Head>
        <title>Thông báo</title>
      </Head>

      <section className={'breadcrumbContainer'}>
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={'IC_HOME'} />
                    <span>Trang chủ</span>
                  </>
                ),
                href: '/',
              },
              { title: 'Thông báo' },
            ]}
          />
        </div>
      </section>
      <ProfileContainer>
        <Row gutter={40} align={'top'} justify={'space-between'}>
          <Col>
            <h1 className={'pageHeaderTitle'}>Thông báo</h1>
          </Col>
          <Col span={!isDesktop ? 24 : 'auto'}>
            <Button
              onClick={() => {
                if (notifications?.items)
                  updateMutation.mutate({
                    items: [
                      {
                        id: 'all',
                        status: Constants.NOTIFICATION.STATUS.DA_DOC,
                      },
                    ],
                  });
              }}
              loading={updateMutation.isPending}
              disabled={updateMutation.isPending}
              block
              style={{ marginBottom: !isDesktop ? '24px' : 0 }}
            >
              Đánh dấu tất cả là đã đọc
            </Button>
          </Col>
        </Row>
        {notifications && (
          <List
            pagination={{
              current: filters.page,
              pageSize: 10,
              total: notifications.total,
              align: 'center',
              onChange: (pageNumber) =>
                setFilters((prevState) => ({ ...prevState, page: pageNumber })),
              showSizeChanger: false,
              hideOnSinglePage: true,
            }}
            loading={isFetching}
            locale={{ emptyText: 'Không có dữ liệu' }}
            dataSource={notifications.items}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 1,
              lg: 1,
              xl: 1,
              xxl: 1,
            }}
            renderItem={(item) => {
              return (
                <List.Item className={'notificationItemContainer'}>
                  <NotificationItem
                    dataItem={item}
                    onOpenDeleteModal={handleOpenDeleteModal}
                  />
                </List.Item>
              );
            }}
          />
        )}
      </ProfileContainer>
      <Modal
        title={'Xóa thông báo'}
        open={deleteModal.open}
        cancelText={'Đóng'}
        onCancel={() => setDeleteModal({ open: false, notificationId: null })}
        okText={'Xóa'}
        onOk={onDeleteNotification}
        centered={true}
      >
        Bạn có chắc chắn muốn xóa thông báo này
      </Modal>
    </RootLayout>
  );
}

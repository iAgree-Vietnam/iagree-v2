"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import {
  Popover,
  List,
  Button,
  Badge,
  Typography,
  Divider,
  Dropdown,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateNumberChat } from "@/src/store/slices/notify";

import { NotificationItem } from "@/src/components/notifications/NotificationItem";
import useFetchNotification from "@/src/hooks/query/useFetchNotification";
import Constants from "@/src/constants/Constants";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import { IconSvgLocal } from "../icon-svg-local";
import { includes, map, toNumber, toString, groupBy, orderBy } from "lodash";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { useNotify } from "@/src/hooks/useNotify";
import { updateNotify } from "@/src/store/slices/notify";
import { useAppSelector } from "@/src/hooks/store";
import {
  NotificationResource,
  NotificationUpdateStatusParams,
} from "@/src/data/notification/models/notification.types";
import NotificationServices from "@/src/data/notification/services/NotificationService";
import useIsMobile from "@/src/screens/HomeScreen/hooks/useIsMobile";
import { fetchChatList, updateChatListActive } from "@/src/store/slices/chat";

export function ButtonHeaderNotification() {
  const router = useRouter();
  const dispatch = useDispatch();

  // ===== state =====
  const [showPopover, setShowPopover] = useState(false);
  const [total, setTotal] = useState("0");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // paging
  const PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [stateFetch, setStateFetch] = useState(false); // trigger cho hook

  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // fetch notifications (hook này refetch theo stateFetch)
  const { data: notifications, isFetching: isFetchingNotification } =
    useFetchNotification({ page, per_page: PER_PAGE }, stateFetch);

  // store
  const listNoti = useAppSelector((s) => s.notify.notifications);

  // đồng bộ fetch -> store (replace trang 1, append các trang sau)
  useEffect(() => {
    if (!notifications) return;

    const items = notifications.items || [];
    const got = items.length;

    // còn trang tiếp nếu số nhận được >= PER_PAGE
    setHasMore(got >= PER_PAGE);

    if (page === 1) {
      dispatch(updateNotify(items));
    } else if (got) {
      dispatch(updateNotify([...(listNoti || []), ...items]));
    }

    // nếu đang loadingMore và nhận xong data trang > 1 -> tắt cờ
    if (page > 1 && loadingMore) {
      setLoadingMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications?.items, page]);

  // const dispatch = useDispatch()
    useEffect(()=>{
      dispatch(updateNumberChat(
        notifications?.totalUnreadChatRooms
      ))
    },[notifications?.totalUnreadChatRooms])

  // tổng chưa đọc
  useEffect(() => {
    const unreadCount = notifications?.total_unread || 0;
    setTotal(
      unreadCount > toNumber(Constants.NOTIFICATION.MAX_COUNT)
        ? `${Constants.NOTIFICATION.MAX_COUNT}+`
        : toString(unreadCount)
    );
  }, [notifications?.total_unread]);

  // realtime prepend
  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;
  useNotify(fullProfileResource?.userId || 0, (n) => {
    dispatch(updateNotify([n, ...(listNoti || [])]));
    setTotal(includes(total, "+") ? total : toString(toNumber(total) + 1));
  });

  // reset khi mở popover
  useEffect(() => {
    if (showPopover) {
      setPage(1);
      setHasMore(true);
      setLoadingMore(false);
      setStateFetch((v) => !v); // refetch trang 1
    }
  }, [showPopover]);

  // infinite scroll: lắng nghe scroll của khung danh sách
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      if (isFetchingNotification || loadingMore || !hasMore) return;

      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
      if (nearBottom) {
        setLoadingMore(true);
        setPage((p) => p + 1);
        setStateFetch((v) => !v); // buộc hook refetch trang mới
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [isFetchingNotification, loadingMore, hasMore]);

  // khóa body scroll khi popover mở (desktop)
  useEffect(() => {
    if (isMobile || !showPopover) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, showPopover]);

  // chặn rò rỉ scroll (desktop)
  useEffect(() => {
    if (isMobile) return;
    const el = scrollRef.current;
    if (!showPopover || !el) return;

    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;
      if ((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop))
        e.preventDefault();
      e.stopPropagation();
    };
    const onTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel as any);
      el.removeEventListener("touchmove", onTouchMove as any);
    };
  }, [isMobile, showPopover]);

  // actions
  const handleBellClick = () => {
    if (isMobile) router.push(AuthRouteUtils.toNotification());
    else setShowPopover((p) => !p);
  };

  const toggleOne = useCallback((id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const notiService = new NotificationServices();
  const markAllRead = useCallback(async () => {
    try {
      const params = {
        items: map(listNoti, (n: any) => ({ status: 1, id: n.notificationId })),
      };
      await notiService.updateNotificationsStatus(
        params as unknown as NotificationUpdateStatusParams
      );
      // reload từ trang 1
      setPage(1);
      setHasMore(true);
      setStateFetch((v) => !v);
      setSelectedIds(new Set());
    } catch (e) {
      console.error("Error mark all read", e);
    }
  }, [listNoti]);

  const visibleItems = useMemo(() => listNoti || [], [listNoti]);

  // group hôm nay / trước đó
  const groups = useMemo(() => {
    const todayStr = new Date().toDateString();
    return groupBy(visibleItems, (n: any) => {
      const d = new Date(
        n?.createdAt || n?.created_at || Date.now()
      ).toDateString();
      return d === todayStr ? "today" : "earlier";
    });
  }, [visibleItems]);

  useNotify(fullProfileResource?.userId || 0, (n) => {
    try {
      if (!n?.description) return;
      const isMessage = n?.description?.includes('{"id":');

      if (!isMessage) {
        dispatch(updateNotify([n, ...(listNoti || [])]));
        setTotal((prev) => (prev.includes("+") ? prev : String(+prev + 1)));
      }
    } catch (err) {
      console.error("❌ useNotify callback error", err);
    }
  });

  //
  const menu = {
    items: [
      {
        key: "markAll",
        label: "Đánh dấu tất cả là đã đọc",
        onClick: () => markAllRead(),
      },
      {
        key: "open",
        label: "Xem tất cả",
        onClick: () => router.push(AuthRouteUtils.toNotification()),
      },
    ],
  };

  // ===== Bell button (giữ ở dưới cùng file) =====
  const BellButton = (
    <Badge count={total}>
      <Button
        className="headerExtraBtn"
        type="text"
        icon={<IconSvgLocal name="IC_NOTIFICATION" width={20} height={20} />}
        onClick={handleBellClick}
      />
    </Badge>
  );

  if (isMobile) return BellButton;

  return (
    <Popover
      style={{ width: 400 }}
      placement="bottomRight"
      trigger="click"
      open={showPopover}
      onOpenChange={(v) => setShowPopover(v)}
      overlayClassName="notificationsPopover"
      content={
        <div
          style={{
            maxHeight: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              padding: "10px 12px",
              background: "#fff",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <Typography.Text strong style={{ fontSize: 16 }}>
              Thông báo
            </Typography.Text>
            <Dropdown menu={menu} placement="bottomRight" trigger={["click"]}>
              <Button type="text" shape="circle" icon={<MoreOutlined />} />
            </Dropdown>
          </div>

          {/* List */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden", // chặn scroll ngang
              overscrollBehavior: "contain",
              background: "#fff",
            }}
          >
            {/* Hôm nay */}
            {groups.today?.length ? (
              <>
                <Typography.Text
                  strong
                  style={{ display: "block", padding: "8px 12px" }}
                >
                  Hôm nay
                </Typography.Text>
                <List
                  dataSource={groups.today}
                  renderItem={(item: NotificationResource) => (
                    <List.Item
                      key={item.notificationId}
                      style={{ cursor: "pointer", padding: "10px 12px" }}
                    >
                      <NotificationItem
                        checked={selectedIds.has(item.notificationId)}
                        toggleOne={toggleOne}
                        dataItem={item}
                      />
                    </List.Item>
                  )}
                />
                <Divider style={{ margin: 0 }} />
              </>
            ) : null}

            {/* Trước đó */}
            {groups.earlier?.length ? (
              <>
                <Typography.Text
                  strong
                  style={{ display: "block", padding: "8px 12px" }}
                >
                  Trước đó
                </Typography.Text>
                <List
                  dataSource={groups.earlier}
                  renderItem={(item: NotificationResource) => (
                    <List.Item
                      key={item.notificationId}
                      style={{ cursor: "pointer", padding: "10px 12px" }}
                    >
                      <NotificationItem
                        checked={selectedIds.has(item.notificationId)}
                        toggleOne={toggleOne}
                        dataItem={item}
                      />
                    </List.Item>
                  )}
                  footer={
                    <div style={{ textAlign: "center", padding: "6px 0" }}>
                      {(isFetchingNotification || loadingMore) && (
                        <Typography.Text type="secondary">
                          Đang tải thêm…
                        </Typography.Text>
                      )}
                      {!hasMore && !!visibleItems.length && (
                        <Typography.Text type="secondary">
                          — Đã Tải Hết —
                        </Typography.Text>
                      )}
                    </div>
                  }
                />
              </>
            ) : null}
          </div>

          {/* Footer */}
          {!!visibleItems.length && (
            <Button
              type="text"
              className="btnViewAllNotification full-width"
              onClick={() => {
                setShowPopover(false);
                router.push(AuthRouteUtils.toNotification());
              }}
              style={{
                borderTop: "1px solid #f0f0f0",
                borderRadius: 0,
                textAlign: "center",
                padding: "10px 0",
              }}
            >
              Xem tất cả thông báo
            </Button>
          )}
        </div>
      }
    >
      {BellButton}
    </Popover>
  );
}

export default ButtonHeaderNotification;

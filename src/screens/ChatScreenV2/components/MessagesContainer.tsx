import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Button } from "antd";
import { ChevronDown } from "lucide-react";
import { compact } from "lodash";
import { MessageItem } from "./MessageItem";
import {
  ChatRoomInfoResource,
  MessageItemsResource,
} from "@/src/data/message/models/message.types";

/* ===================== Types ===================== */
interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export type ArrivalMeta = {
  id: string | number;
  senderId: number;
  roomId?: string;
  at: number;
};

interface MessagesContainerProps {
  chat: ChatRoomInfoResource;
  currentUserId: number;

  onImageClick: (attachments: MessageAttachment[], startIndex?: number) => void;
  onVideoClick: (attachments: MessageAttachment[], startIndex?: number) => void;
  onFileClick: (attachments: MessageAttachment[], startIndex?: number) => void;

  /** Click reply trên 1 message */
  onReply: (message: MessageItemsResource, userName?: string) => void;

  room_id?: string;

  /** Tín hiệu có tin nhắn mới (socket) truyền từ cha xuống */
  newArrival?: ArrivalMeta;

  /** Tải chi tiết thread reply cho 1 message */
  getDetailReply: (messId: string) => void;

  /** Dữ liệu chọn từ list (MessageItem đang yêu cầu prop này) */
  selectedChatFromList: any;

  /** Optional - loading trạng thái ngoài (nếu cần show overlay) */
  isLoadingMore?: boolean;
}

export interface MessagesContainerRef {
  scrollToMessage: (messageId: string | number) => void;
}

/* ===================== Component ===================== */
export const MessagesContainer = forwardRef<
  MessagesContainerRef,
  MessagesContainerProps
>(function MessagesContainer(
  {
    chat,
    currentUserId,
    onImageClick,
    onVideoClick,
    onFileClick,
    onReply,
    room_id,
    newArrival,
    getDetailReply,
    selectedChatFromList,
    isLoadingMore,
  },
  ref
) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string | number, HTMLDivElement>>({});
  const [showJump, setShowJump] = useState(false);

  // ===== SORT ASC: newest ở cuối =====
  const messages = useMemo(() => {
    if (!chat?.items) return [];
    return [...chat.items]
      .filter((item): item is MessageItemsResource => !!item?.createdAt)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [chat.items]);

  useImperativeHandle(ref, () => ({
    scrollToMessage: (messageId: string | number) => {
      try {
        const el = messageRefs.current[messageId];
        const container = messagesContainerRef.current;
        if (!el || !container) return;

        const elementTop = el.offsetTop;
        const elementHeight = el.offsetHeight;
        const containerHeight = container.clientHeight;
        const top = elementTop - containerHeight / 2 + elementHeight / 2;

        container.scrollTo({
          top,
          behavior: "smooth",
        });

        el.style.backgroundColor = "#fff7e6";
        el.style.border = "1px solid #ffa940";
        el.style.borderRadius = "12px";
        el.style.padding = "6px";
        el.style.transition = "all 0.3s ease";
        setTimeout(() => {
          el.style.backgroundColor = "";
          el.style.border = "";
        }, 2000);
      } catch {}
    },
  }));

  const isNearBottom = (el: HTMLElement) =>
    el.scrollHeight - (el.scrollTop + el.clientHeight) < 40;

  const scrollToBottomSmooth = (smooth = false) => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Arrival từ người khác: gần đáy thì auto bám đáy, không thì hiện nút
  useEffect(() => {
    if (!newArrival) return;
    if (newArrival.roomId && room_id && newArrival.roomId !== room_id) return;

    const el = messagesContainerRef.current;
    if (!el) return;

    const fromOther = newArrival.senderId !== currentUserId;
    if (!fromOther) {
      // 🔥 Nếu là CHÍNH MÌNH vừa gửi (echo từ socket) → luôn kéo xuống đáy
      scrollToBottomSmooth();
      setShowJump(false);
      return;
    }

    if (isNearBottom(el)) {
      scrollToBottomSmooth();
      setShowJump(false);
    } else {
      setShowJump(true);
    }
  }, [newArrival, currentUserId, room_id]);

  // Đổi room → bám đáy
  useEffect(() => {
    scrollToBottomSmooth(false);
  }, [room_id]);

  // Nếu đang gần đáy → bám đáy khi length thay đổi
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    if (isNearBottom(el)) scrollToBottomSmooth();
  }, [messages.length]);

  // 🔥 Bổ sung: mỗi khi có message mới mà LAST là của current user → luôn scroll đáy
  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    if (last?.senderId === currentUserId) {
      scrollToBottomSmooth();
      setShowJump(false);
    }
  }, [messages.length, currentUserId]); // chỉ cần theo dõi length

  // ======= CHẶN RÒ RỈ SCROLL RA NGOÀI =======
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    // Wheel: luôn stopPropagation; tại mép thì preventDefault để không “bật” body
    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      if ((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop)) {
        e.preventDefault();
      }
      e.stopPropagation();
    };

    // Touch (iOS): chặn “bật” body khi ở mép; cho phép cuộn trong el
    let lastY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const diff = lastY - currentY; // >0 cuộn lên; <0 cuộn xuống

      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      if ((diff < 0 && atTop) || (diff > 0 && atBottom)) {
        if (e.cancelable) e.preventDefault();
      }
      e.stopPropagation();
    };

    // Key scroll (Space/Arrow/PageUp/Down): chặn bubble ra ngoài
    const onKeyDown = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      const keys = [
        "Space",
        "PageDown",
        "PageUp",
        "ArrowDown",
        "ArrowUp",
        "Home",
        "End",
      ];
      if (keys.includes(e.code)) {
        e.stopPropagation();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown, {
      passive: true,
      capture: true,
    });

    return () => {
      el.removeEventListener("wheel", onWheel as any);
      el.removeEventListener("touchstart", onTouchStart as any);
      el.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("keydown", onKeyDown as any, true);
    };
  }, []);

  return (
    <div
      ref={messagesContainerRef}
      tabIndex={0}
      style={{
        flex: 1,
        overflowY: "auto",
        paddingTop: 12,
        paddingLeft: 12,
        paddingRight: 12,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        position: "relative",
        overscrollBehavior: "contain",
        touchAction: "pan-y",
        background: "#fff",
      }}
      onWheel={(e) => e.stopPropagation()}
      onScroll={(e) => e.stopPropagation()}
    >
      {compact(messages)?.map((m) => {
        const isMine = m?.senderId === currentUserId;
        return (
          <div
            key={m?.id}
            style={{ position: "relative" }}
            ref={(node) => {
              if (node) messageRefs.current[m?.id] = node;
            }}
          >
            <MessageItem
              chat={chat}
              message={m}
              isCurrentUser={isMine}
              partnerName={chat?.infoDetail?.partnerName}
              onReply={(msg) => onReply(msg, chat?.infoDetail?.partnerName)}
              currentUserId={currentUserId}
              getDetailReply={() => getDetailReply?.(m.id)}
              onScrollToMessage={(messageId) => {
                const el = messageRefs.current[messageId];
                const container = messagesContainerRef.current;
                if (!el || !container) return;
                const elementTop = el.offsetTop;
                const elementHeight = el.offsetHeight;
                const containerHeight = container.clientHeight;
                const top =
                  elementTop - containerHeight / 2 + elementHeight / 2;
                container.scrollTo({ top, behavior: "smooth" });

                el.style.backgroundColor = "#fff7e6";
                el.style.border = "1px solid #ffa940";
                el.style.borderRadius = "12px";
                el.style.padding = "6px";
                el.style.transition = "all 0.3s ease";
                setTimeout(() => {
                  el.style.backgroundColor = "";
                  el.style.border = "";
                }, 2000);
              }}
              selectedChatFromList={selectedChatFromList}
            />
          </div>
        );
      })}

      {showJump && (
        <div
          style={{
            position: "sticky",
            bottom: 12,
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Button
            type="primary"
            shape="round"
            icon={<ChevronDown size={16} />}
            onClick={() => {
              scrollToBottomSmooth();
              setShowJump(false);
            }}
            style={{ boxShadow: "0 6px 14px rgba(0,0,0,0.15)" }}
          >
            Tin mới
          </Button>
        </div>
      )}
    </div>
  );
});

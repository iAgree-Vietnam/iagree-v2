import { useEffect, useRef } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
// import Constants from "@/src/constants/Constants";
import { ChatRoomInfoResource } from "../data/message/models/message.types";
import Constants from "../constants/Constants";

type NotificationPayload = {
  userId: number | string;
  title?: string;
  body?: string;
  data?: any;
  notificationId?: number;
  user_id?: number;
  type?: number;
  type_id?: number;
  name?: string;
  description?: string; // JSON string
  date?: string;
  note?: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
  itemName?: string | null;
};

export function useNotify(
  userId: number,
  onNotify?: (n: any) => void,
  eventNameChannel?: string
) {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !userId) return;

    // 1) Echo singleton
    if (!(window as any).Echo) {
      (window as any).Pusher = Pusher;
      (window as any).Echo = new Echo(Constants.SOCKET_CONFIG as any);
    }

    const echo: any = (window as any).Echo;
    const channelName = "channel.notification";
    const eventName = eventNameChannel || `send.notification.${userId}`; // TÊN EVENT TRÊN NETWORK

    // console.log("🧭 Subscribe:", { channelName, eventName });

    // 2) Gỡ lắng nghe cũ trước khi bind mới (an toàn)
    try {
      echo.channel(channelName).stopListening(eventName); // sẽ không ảnh hưởng .on nhưng cứ cleanup
    } catch {}

    // 3) Join channel
    const channel: any = echo.channel(channelName);
    channelRef.current = channel;

    channel.bind?.("pusher:subscription_succeeded", () => {
      // console.log("✅ Subscribed to", channelName)
    });
    channel.bind?.("pusher:subscription_error", (st: any) => {
      //  console.error("❌ subscription_error", st)
    });

    // 4) NHẬN EVENT: dùng .on thay vì .listen (KHÔNG tự thêm '.')
    const handler = (raw: any) => {
      // Trên network bạn thấy data là string JSON => parse
      const payload =
        typeof raw === "string"
          ? JSON.parse(raw)
          : typeof raw?.data === "string"
          ? JSON.parse(raw.data)
          : raw;
      // if (eventNameChannel) {
      // console.log("🔔 Notification event received:", {
      //     event: eventName,
      //     raw,
      //     parsed: payload,
      //   });
      // }

      onNotify?.(payload);
    };

    channel.on(eventName, handler);
    // Nếu bạn vẫn muốn dùng listen: channel.listen("." + eventName, handler);

    // 5) Cleanup
    return () => {
      try {
        channel.unbind?.(eventName, handler);
        echo.channel(channelName).stopListening(eventName);
        // console.log("🧹 Cleanup listener", { channelName, eventName });
      } catch (e) {
        console.error("⚠️ Cleanup error:", e);
      }
    };
  }, [userId, onNotify]);
}

export default useNotify;

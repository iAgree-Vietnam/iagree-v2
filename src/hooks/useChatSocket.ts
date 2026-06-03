import { useEffect, useState, useRef } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Constants from "../constants/Constants";
// import Constants from "@/src/constants/Constants";

/* ===========================================================
   🔌 Hook kết nối & quản lý Echo (Singleton)
   =========================================================== */
export function useEchoConnection() {
  const echoRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Nếu chưa có instance Echo toàn cục
    if (!(window as any).Echo) {
      (window as any).Pusher = Pusher;
      (window as any).Echo = new Echo(Constants.SOCKET_CONFIG as any);
    }

    echoRef.current = (window as any).Echo;

    return () => {
      // không disconnect, giữ singleton dùng chung toàn app
    };
  }, []);

  return echoRef.current;
}

/* ===========================================================
   💬 Hook lắng nghe tin nhắn cho 1 room cụ thể
   =========================================================== */
interface MessageEvent {
  roomId: string;
  message: {
    id: string | number;
    senderId: number;
    [key: string]: any;
  };
}

export function useChatSocket(selectedChatId?: string | number) {
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [arrival, setArrival] = useState<{
    id: string | number;
    senderId: number;
    roomId: string | number;
    at: number;
  } | null>(null);

  const echo = useEchoConnection();

  useEffect(() => {
    if (!echo || typeof window === "undefined" || !selectedChatId) return;

    const channelName = `chat-room.${selectedChatId}`;

    // 🧹 Cleanup listener cũ trước khi bind mới
    try {
      echo.channel(channelName).stopListening(".send.message");
    } catch {}

    const channel = echo.channel(channelName);

    // 👂 Lắng nghe event tin nhắn
    channel.listen(".send.message", (e: MessageEvent) => {
      // console.log("lastMessage", e);

      setLastMessage(e.message);
      setArrival({
        id: e.message.id,
        senderId: e.message.senderId,
        roomId: e.roomId,
        at: Date.now(),
      });
    });

    // 🧹 Cleanup khi rời room hoặc unmount
    return () => {
      try {
        echo.channel(channelName).stopListening(".send.message");
      } catch {}
    };
  }, [echo, selectedChatId]);

  return { lastMessage, arrival };
}

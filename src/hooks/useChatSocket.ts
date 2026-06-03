/**
 * useChatSocket.ts
 * laravel-echo / pusher-js removed — replaced with no-op stubs.
 * TODO: re-implement with Supabase Realtime when chat backend is migrated.
 */
import { useEffect, useState, useRef } from "react";

/* ===========================================================
   Echo connection stub (was laravel-echo)
   =========================================================== */
export function useEchoConnection() {
  // No-op: Supabase Realtime integration pending
  return null;
}

/* ===========================================================
   Chat socket hook stub
   =========================================================== */
export function useChatSocket(selectedChatId?: string | number) {
  const [lastMessage] = useState<any>(null);
  const [arrival] = useState<{
    id: string | number;
    senderId: number;
    roomId: string | number;
    at: number;
  } | null>(null);

  // TODO: subscribe to supabase.channel(`chat-room-${selectedChatId}`)
  useEffect(() => {
    if (!selectedChatId) return;
    // Supabase Realtime stub — no-op until backend is migrated
  }, [selectedChatId]);

  return { lastMessage, arrival };
}

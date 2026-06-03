/**
 * useNotify.tsx
 * laravel-echo / pusher-js removed — replaced with no-op stub.
 * TODO: re-implement with Supabase Realtime when notification backend is migrated.
 */
import { useEffect } from "react";

export function useNotify(
  userId: number,
  onNotify?: (n: any) => void,
  eventNameChannel?: string
) {
  useEffect(() => {
    if (!userId) return;
    // TODO: subscribe to supabase realtime channel for notifications
    // Supabase Realtime stub — no-op until backend is migrated
  }, [userId, onNotify, eventNameChannel]);
}

export default useNotify;

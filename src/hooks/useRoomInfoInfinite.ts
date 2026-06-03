import { useEffect, useMemo, useRef, useState } from "react";
import { useFetchRoomInfo } from "../screens/ChatScreenV2/hooks/useFetchRoomInfo";
import { useDispatch } from "react-redux";
import { updateRoomInfoData } from "../store/slices/chat";
import { ChatRoomInfoResource } from "../data/message/models/message.types";
import { isEmpty } from "lodash";

// Tuỳ dự án của bạn, chỉnh lại type cho khớp
type MessageLike = { id: string | number; [k: string]: any };

type UseRoomInfoInfiniteArgs = {
  selectedChatId: string;
  pageMessages: number;
  perPage?: number;
  // nhận thêm optional params nếu cần
  extraParams?: Record<string, any>;
};

/**
 * Hook bọc quanh useFetchRoomInfo:
 * - Đổi roomId => reset
 * - Đổi page => prepend items mới vào đầu, giữ field khác
 */
export function useRoomInfoInfinite({
  selectedChatId,
  pageMessages,
  perPage = 25,
  extraParams,
}: UseRoomInfoInfiniteArgs) {
  const prevChatIdRef = useRef<string | null>(null);
  // gọi hook gốc của bạn
  const dispatch = useDispatch();
  const {
    data: fetchedData,
    isLoading: isLoadingRoomInfoData,
    refetch: refetchRoomInfo,
  } = useFetchRoomInfo(selectedChatId, {
    per_page: perPage,
    page: pageMessages,
    ...(extraParams ?? {}),
  });

  const [accumulated, setAccumulated] = useState<
    ChatRoomInfoResource | undefined
  >(undefined);

  // dedup theo id
  const dedupById = (list: MessageLike[]) => {
    const seen = new Set<string | number>();
    const out: MessageLike[] = [];
    for (const it of list) {
      const key = it?.id;
      if (key == null) {
        out.push(it);
        continue;
      }
      if (!seen.has(key)) {
        seen.add(key);
        out.push(it);
      }
    }
    return out;
  };

  //   // reset khi đổi phòng
  useEffect(() => {
    // lần đầu mount
    if (prevChatIdRef.current === null) {
      prevChatIdRef.current = selectedChatId;
      return;
    }

    // nếu selectedChatId đổi → reset
    if (prevChatIdRef.current !== selectedChatId) {
      setAccumulated(undefined);
      prevChatIdRef.current = selectedChatId;
    }
  }, [selectedChatId]);

  // hợp nhất khi có data mới
  useEffect(() => {
    if (!fetchedData) return;

    const newItems: MessageLike[] = Array.isArray(fetchedData.items)
      ? fetchedData.items
      : [];

    setAccumulated((prev: any) => {
      // Trường hợp đầu tiên hoặc page=1 → thay hẳn (giữ semantics “fresh”)
      if (!prev || pageMessages === 1) {
        return {
          ...fetchedData,
          items: dedupById(newItems),
        };
      }

      // Cùng room + page > 1 → prepend items mới, giữ field khác
      // Ưu tiên meta mới từ fetchedData (hasMore, nextCursor, ...), nhưng items thì gộp
      const prevItems = Array.isArray(prev.items) ? prev.items : [];
      return {
        ...prev,
        ...fetchedData,
        items: dedupById([...newItems, ...prevItems]), // prepend
      };
    });
  }, [fetchedData, pageMessages]);

  // tiện ích reset thủ công (tuỳ component cần)
  const reset = () => setAccumulated(undefined);
  if (!isEmpty(accumulated)) {
    dispatch(updateRoomInfoData(accumulated));
  }
  return {
    data: accumulated,
    isLoading: isLoadingRoomInfoData,
    refetch: refetchRoomInfo,
    reset,
  };
}

// src/features/counter/counterSlice.ts
import { useAccountContext } from "@/src/contexts/AccountContext";
import { RawListRoomChatOfUser } from "@/src/data/message/models/message.raw";
import { ChatRoomInfoResource } from "@/src/data/message/models/message.types";
import MessageServices from "@/src/data/message/services/MessageServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isEmpty, map } from "lodash";

type CounterState = {
  pageMessages: number;
  roomInfoData?: ChatRoomInfoResource | RawListRoomChatOfUser;
  chatList?: ChatRoomInfoResource[] | RawListRoomChatOfUser[];
  chatActive?: ChatRoomInfoResource[] | RawListRoomChatOfUser[];
};
const initialState: CounterState = { pageMessages: 1 };

export const fetchChatList = createAsyncThunk(
  "chat/fetchChatList",
  async (
    {
      userId,
      params,
    }: {
      userId?: number;
      params?: {
        message: number;
      };
    },
    { rejectWithValue }
  ) => {
    return !isEmpty(userId)
      ? new MessageServices().getAllChatRooms(userId, params)
      : [];

    // return response as ChatRoomInfoResource[]; // Assuming the API returns the list of chats
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    increment(state) {
      state.pageMessages += 1;
    },
    decrement(state) {
      state.pageMessages -= 1;
    },
    addBy(state, action: PayloadAction<number>) {
      state.pageMessages = action.payload;
    },
    updateRoomInfoData(state, action: PayloadAction<ChatRoomInfoResource>) {
      state.roomInfoData = action.payload;
    },
    resetChat(state) {
      state = initialState;
    },
    updateChatList(state, action) {
      state.chatList = action.payload;
    },
    updateChatListActive(state, action) {
      state.chatActive = map(action.payload, (it) => ({
        ...it,
        lastDate: new Date().getTime(),
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      // Khi API trả về thành công, set dữ liệu vào chatList và isLoading là false
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.chatList = action.payload;
      });
  },
});

export const {
  increment,
  decrement,
  addBy,
  updateRoomInfoData,
  resetChat,
  updateChatList,
  updateChatListActive,
} = chatSlice.actions;
export default chatSlice.reducer;

import { NotificationResource } from "@/src/data/notification/models/notification.types";
import { createSlice } from "@reduxjs/toolkit";

type NotifyState = {
  notifications: NotificationResource[];
  numberChat: number;
};
const initialState: NotifyState = { notifications: [], numberChat: 0 };

const notifySlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateNotify(state, action) {
      state.notifications = action.payload;
    },
    updateNumberChat(state, action) {
      state.numberChat = action.payload;
    },
  },
});

export const { updateNotify, updateNumberChat } = notifySlice.actions;
export default notifySlice.reducer;

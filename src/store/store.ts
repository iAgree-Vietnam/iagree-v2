import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chat";
import notifyReducer from "./slices/notify";
import authReducer from "./slices/auth";

// import authReducer from "@/features/auth/authSlice";
// import { api } from "@/services/api"; // RTK Query (optional)

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    notify: notifyReducer,
    auth: authReducer,
    // auth: authReducer,
    // [api.reducerPath]: api.reducer, // RTK Query
  },
  middleware: (getDefault) =>
    getDefault({
      // Bật/tắt check nếu bạn có non-serializable (FormData, Date, class…)
      serializableCheck: false,
    }).concat(), // nếu dùng RTK Query

  //   middleware: (getDefault) => getDefault().concat(api.middleware), // RTK Query
  //   devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

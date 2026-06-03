import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  isValidRefCode: boolean;
};
const initialState: AuthState = { isValidRefCode: true };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateValidRefCode(state, action) {
      state.isValidRefCode = action.payload.isValid;
    },
  },
});

export const { updateValidRefCode } = authSlice.actions;
export default authSlice.reducer;

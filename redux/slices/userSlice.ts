import { createSlice } from "@reduxjs/toolkit";
const INITIAL_STATE: any = {
  currentUser: null,
};
const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;

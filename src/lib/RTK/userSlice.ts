import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    user_id: 0,
    user_name: "",
  },
};

const userSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user.user_id = action.payload.user.user_id;
      state.user.user_name = action.payload.user.user_name;
    },
    clearUser: (state) => {
      state.user.user_id = 0;
      state.user.user_name = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
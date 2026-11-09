import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OnlineUser } from "@/socket/interfaces/socketInterfaces";

interface OnlineUsersState {
  onlineUsers: OnlineUser[];
  isOnlineSidebarOpen: boolean;
}

const initialState: OnlineUsersState = {
  onlineUsers: [],
  isOnlineSidebarOpen: false,
};

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<OnlineUser[]>) => {
      state.onlineUsers = action.payload;
    },
    toggleOnlineSidebar: (state) => {
      state.isOnlineSidebarOpen = !state.isOnlineSidebarOpen;
    },
    openOnlineSidebar: (state) => {
      state.isOnlineSidebarOpen = true;
    },
    closeOnlineSidebar: (state) => {
      state.isOnlineSidebarOpen = false;
    },
  },
});

export const {
  setOnlineUsers,
  toggleOnlineSidebar,
  openOnlineSidebar,
  closeOnlineSidebar,
} = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;


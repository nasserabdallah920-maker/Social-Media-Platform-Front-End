import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import badgeReducer from './badgeSlice';
import chatReducer from './chatSlice';
import onlineUsersReducer from './onlineUsersSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    badge: badgeReducer,
    chat: chatReducer,
    onlineUsers: onlineUsersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

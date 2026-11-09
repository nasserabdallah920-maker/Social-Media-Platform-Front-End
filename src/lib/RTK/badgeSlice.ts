import {createSlice} from "@reduxjs/toolkit"
type CountTitle = "Notifications" | "Messages" | "Requests";

type CountItem = {
  title: CountTitle;
  count: number;
};
const initialState = {
  Notifications:0,
  Messages:0,
  Requests:0,
};
const badgeSlice = createSlice({
  name: "badgeCount",
  initialState,
  reducers: {
    setBadge: (state, action) => {
      action.payload.forEach((item: CountItem) => {
        state[item.title] = item.count;
      });
    },
    incrementBadge: (state, action) => {
      const title = action.payload as CountTitle;
      if (title in state) {
        state[title] += 1;
      }
    },
  },
});

export const { setBadge, incrementBadge } = badgeSlice.actions;
export default badgeSlice.reducer
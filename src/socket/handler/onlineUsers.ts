import { Socket } from "socket.io-client";
import { store } from "@/lib/RTK/store";
import { setOnlineUsers } from "@/lib/RTK/onlineUsersSlice";
import { OnlineUser } from "../interfaces/socketInterfaces";

export const onlineUsersFn = (socket: Socket) => {
  socket.emit("get-online-users");
  socket.on("online-user", (data: OnlineUser) => {
    if (
      data.is_online &&
      !store.getState().onlineUsers.onlineUsers.find((e) => e.id === data.id)
    ) {
      store.dispatch(
        setOnlineUsers([...store.getState().onlineUsers.onlineUsers, data]),
      );
    } else if (
      !data.is_online &&
      store.getState().onlineUsers.onlineUsers.find((e) => e.id === data.id)
    ) {
      store.dispatch(
        setOnlineUsers(
          store
            .getState()
            .onlineUsers.onlineUsers.filter((user) => user.id !== data.id),
        ),
      );
    }
  });
  socket.off("online-users");
  socket.on("online-users", (onlineUsers: OnlineUser[]) => {
    if (Array.isArray(onlineUsers)) {
      store.dispatch(setOnlineUsers(onlineUsers));
    }
  });
};

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import * as jose from "jose";
import { setUser } from "@/lib/RTK/userSlice";
import { RootState } from "@/lib/RTK/store";
import { updateSocketToken } from "@/socket/socketConfig";

const cookies = new Cookies();

export default function UserSync() {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.user.user_id);

  useEffect(() => {
    if (userId !== 0) return;

    const token = cookies.get("access_token");
    if (!token) return;

    try {
      const decoded = jose.decodeJwt(token);
      const decodedUserId = Number(decoded.id ?? decoded.user_id ?? decoded.sub);
      const decodedUserName = decoded.user_name ?? decoded.username ?? "";

      if (decodedUserId) {
        updateSocketToken(token);
        dispatch(
          setUser({
            user: {
              user_id: decodedUserId,
              user_name: decodedUserName,
            },
          })
        );
      }
    } catch {
      // Ignored
    }
  }, [dispatch, userId]);

  return null;
}


"use client";
import MessageCard, { MessageData } from "@/components/Message";
import NotificationCard, { Notification } from "@/components/Notification";
import {
  connectionErrorFn,
  connectionFn,
} from "@/socket/handler/connectionHandler";
import { onlineUsersFn } from "@/socket/handler/onlineUsers";
import socket, { updateSocketToken } from "@/socket/socketConfig";
import React, { useEffect, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function SocketProvider({ children }: AuthProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    updateSocketToken();

    const onNotification = (data: Notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === data.id)) return prev;
        return [data, ...prev];
      });
    };

    const onNewMessage = (data: MessageData) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("notification", onNotification);
    socket.on("new-message", onNewMessage);

    return () => {
      socket.off("notification", onNotification);
      socket.off("new-message", onNewMessage);
    };
  }, []);

  const removeNotification = (notification: Notification) => {
    setNotifications((prev) =>
      prev.filter((not) => not.id !== notification.id),
    );
  };
  const removeMessage = (message: MessageData) => {
    setMessages((prev) => prev.filter((mess) => mess.id !== message.id));
  };

  useEffect(() => {
    connectionErrorFn(socket);
    connectionFn(socket);
    onlineUsersFn(socket);
  }, []);

  return (
    <div className="relative">
      {/* Toast Container - Notifications & Messages */}
      <div className="fixed z-50 bottom-4 right-4 flex flex-col-reverse gap-3 max-w-sm w-full pointer-events-none items-end">
        {/* Notifications List */}
        {notifications.map((notification, index) => (
          <div
            key={notification.id || index}
            className="pointer-events-auto w-full bg-white/80 backdrop-blur-lg backdrop-saturate-150 border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-900/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-3"
          >
            <NotificationCard
              fn={removeNotification}
              notification={notification}
            />
          </div>
        ))}

        {/* Messages List */}
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className="pointer-events-auto w-full bg-white/80 backdrop-blur-lg backdrop-saturate-150 border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-900/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-3"
          >
            <MessageCard message={message} fn={removeMessage} />
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}

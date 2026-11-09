"use client";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Header from "@/components/Header";
import { RootState } from "@/lib/RTK/store";
import FixedConversationSidebar from "@/features/chat/pages/FixedConversationSidebar";
import OnlineFriendsSidebar from "@/features/chat/pages/OnlineFriendsSidebar";
import SocketProvider from "@/providers/SocketProviders";
import UserSync from "@/providers/UserSync";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const userId = useSelector((state: RootState) => state.user.user.user_id);
  const isAuthenticated = Boolean(userId);
  const isOnlineOpen = useSelector((state: RootState) => state.onlineUsers.isOnlineSidebarOpen);
  const isChatOpen = useSelector((state: RootState) => state.chat.isSidebarOpen);

  const hideHeaderRoutes = ["/login", "/signup", "/reset"];
  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      <UserSync />
      {!shouldHideHeader && <Header />}
      <SocketProvider>
        <div className="relative min-h-[calc(100vh-4rem)] bg-[#FAFAFA]">
          {/* Online Friends Sidebar (Left side) when user is logged in */}
          {!shouldHideHeader && isAuthenticated && (
            <OnlineFriendsSidebar />
          )}

          <div
            className={`w-full transition-all duration-300 ${
              isOnlineOpen ? "lg:pl-72 xl:pl-80" : "lg:pl-0"
            } ${
              isChatOpen ? "lg:pr-72 xl:pr-80" : "lg:pr-0"
            }`}
          >
            {children}
          </div>

          {/* Fixed Conversation Sidebar (Right side) when user is logged in */}
          {!shouldHideHeader && isAuthenticated && (
            <FixedConversationSidebar />
          )}
        </div>
      </SocketProvider>
    </>
  );
}

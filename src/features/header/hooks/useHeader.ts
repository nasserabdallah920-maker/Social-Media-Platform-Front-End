import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { RootState } from "@/lib/RTK/store";
import { setBadge } from "@/lib/RTK/badgeSlice";
import { headerService } from "../services/headerServices";
import { Notification } from "../interfaces/headerInterfaces";

export const useHeader = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  // States & Selectors
  const user_id = useSelector((state: RootState) => state.user.user.user_id);
  const badge = useSelector((state: RootState) => state.badge);
  const isAuthenticated = Boolean(user_id);

  const [openSettings, setOpenSettings] = useState(false);
  const [input, setInput] = useState<string | null>(null);

  // ==================== 1. QUERIES ====================

  // جلب بيانات المستخدم الأساسية
  const { data, isPending, isError } = useQuery({
    queryKey: ["user", { user_id }],
    queryFn: () => headerService.getUser(user_id),
    enabled: isAuthenticated,
  });

  // جلب عدادات الإشعارات والرسائل والطلبات
  const { data: notifCountData } = useQuery({
    queryKey: ["notifications-count", user_id],
    queryFn: headerService.getUnreadNotificationsCount,
    enabled: isAuthenticated,
  });

  const { data: messagesCountData } = useQuery({
    queryKey: ["messages-count", user_id],
    queryFn: headerService.getUnreadMessagesCount,
    enabled: isAuthenticated,
  });

  const { data: requestsCountData } = useQuery({
    queryKey: ["requests-count", user_id],
    queryFn: headerService.getPendingRequestsCount,
    enabled: isAuthenticated,
  });

  // جلب الإشعارات (Infinite Query)
  const {
    data: notificationsData,
    fetchNextPage: fetchNextNotifications,
    hasNextPage: hasNextNotifications,
    isFetchingNextPage: isFetchingNextNotifications,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => headerService.getUserNotifications({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: isAuthenticated,
  });

  // جلب طلبات الصداقة (Infinite Query)
  const {
    data: requestsData,
    fetchNextPage: fetchNextRequests,
    hasNextPage: hasNextRequests,
    isFetchingNextPage: isFetchingNextRequests,
  } = useInfiniteQuery({
    queryKey: ["requests"],
    queryFn: ({ pageParam }) => headerService.getUserRequests({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: isAuthenticated,
  });

  // ==================== 2. EFFECTS (Redux Sync) ====================

  // تحديث عداد الإشعارات في الـ Redux عند جلب البيانات
  useEffect(() => {
    if (notifCountData) {
      dispatch(
        setBadge([
          {
            title: "Notifications",
            count: notifCountData.unread_count ?? 0,
          },
        ])
      );
    }
  }, [notifCountData, dispatch]);

  // تحديث عداد الرسائل في الـ Redux
  useEffect(() => {
    if (messagesCountData) {
      dispatch(
        setBadge([
          { 
            title: "Messages", 
            count: messagesCountData.data?.count ?? 0 
          }
        ])
      );
    }
  }, [messagesCountData, dispatch]);

  // تحديث عداد الطلبات في الـ Redux
  useEffect(() => {
    if (requestsCountData) {
      dispatch(
        setBadge([
          { 
            title: "Requests", 
            count: requestsCountData.data?.count ?? 0 
          }
        ])
      );
    }
  }, [requestsCountData, dispatch]);

  // ==================== 3. MUTATIONS ====================

  const readAllNotificationsMutate = useMutation({
    mutationFn: () => headerService.readAllNotifications(),
    mutationKey: ["read-all-notifications"],
    onSuccess: () => {
      dispatch(
        setBadge([
          {
            title: "Notifications",
            count: 0,
          },
        ])
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const readSingleNotificationMutation = useMutation({
    mutationFn: (id: number) => headerService.readSingleNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: (from_user_id: number) => headerService.acceptRequest(from_user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests-count"] });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: (from_user_id: number) => headerService.rejectRequest(from_user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests-count"] });
    },
  });

  // ==================== 4. HANDLERS & HELPERS ====================

  const handleNotificationClick = async (notif: Notification) => {
    if (notif.is_read === 0) {
      readSingleNotificationMutation.mutate(notif.id);
      dispatch(
        setBadge([
          {
            title: "Notifications",
            count: Math.max(0, badge.Notifications - 1),
          },
        ])
      );
    }

    switch (notif.type) {
      case "like":
      case "comment":
      case "reply":
        return notif.post_id ? `/post/${notif.post_id}` : null;

      case "follow":
      case "follow_request":
      case "follow_accept":
        return notif.actor_id ? `/profile/${notif.actor_id}` : null;

      default:
        return null;
    }
  };
  

  const userRequests = requestsData?.pages.flatMap((page) => page.data) ?? [];
  const userNotifications = notificationsData?.pages.flatMap((page) => page.data) ?? [];

  // ==================== 5. RETURN ====================

  return {
    // States & Status
    avatarError: isError,
    avatarPending: isPending,
    openSettings,
    setOpenSettings,
    input,
    setInput,
    
    // Data
    data,
    badge,
    userRequests,
    userNotifications,

    // Pagination & Infinite Scroll
    fetchNextNotifications,
    hasNextNotifications,
    isFetchingNextNotifications,
    fetchNextRequests,
    hasNextRequests,
    isFetchingNextRequests,

    // Actions & Mutations
    logOut: headerService.logOut,
    acceptRequest: acceptRequestMutation.mutate,
    rejectRequest: rejectRequestMutation.mutate,
    readAllNotificationsMutate,
    handleNotificationClick,
  };
};
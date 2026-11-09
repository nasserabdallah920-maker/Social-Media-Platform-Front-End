import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation } from "@/features/chat/interfaces/chatInterfaces";

interface ChatState {
  isSidebarOpen: boolean;
  activeConversation: Conversation | null;
}

const initialState: ChatState = {
  isSidebarOpen: false,
  activeConversation: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    setActiveConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.activeConversation = action.payload;
    },
    openChatWithUser: (
      state,
      action: PayloadAction<{
        conversation_id?: number | null;
        user_id: number;
        user_name: string;
        avatar?: string | null;
      }>
    ) => {
      state.isSidebarOpen = true;
      state.activeConversation = {
        id: action.payload.conversation_id || 0, // 0 يعني لا توجد محادثة سابقة
        type: "direct",
        created_at: new Date().toISOString(),
        avatar: action.payload.avatar || null,
        user_name: action.payload.user_name,
        text: null,
        sent_at: null,
        sender_id: null,
        unreaded: 0,
        user_id: action.payload.user_id,
        isNew: !action.payload.conversation_id, // flag لمعرفة إن كانت محادثة جديدة
      };
    },
  },
});

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  setActiveConversation,
  openChatWithUser,
} = chatSlice.actions;

export default chatSlice.reducer;

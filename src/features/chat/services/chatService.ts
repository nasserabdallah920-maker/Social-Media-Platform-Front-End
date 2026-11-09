import { useAxios } from "@/lib/axios/axios";
import { SendMessagePayload } from "../interfaces/chatInterfaces";

export const chatService = {
  getConversations: async (page: number) => {
    const res = await useAxios.get(`/conversations?page=${page}`);
    return res.data;
  },

  getMessages: async (conversation_id: number, page: number) => {
    const res = await useAxios.get(`/messages/${conversation_id}?page=${page}`);
    return res.data;
  },

  deleteConversation: async (conversationId: number) => {
    const response = await useAxios.delete(`/conversations/${conversationId}`);
    return response.data;
  },

  getGroupDetails: async (conversation_id: number) => {
    const res = await useAxios.get(`/conversations/${conversation_id}`);
    return res.data;
  },

  createGroup: async ({ name, users, avatar }: { name: string; users: (number | string)[]; avatar?: File }) => {
    const formData = new FormData();
    formData.append("name", name);
    users.forEach((userId) => {
      formData.append("users[]", String(userId));
    });
    formData.append("users", JSON.stringify(users));

    if (avatar) {
      formData.append("avatar", avatar);
    }

    const res = await useAxios.post("/conversations/create-group", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  updateConversation: async ({
    conversation_id,
    name,
    avatar,
  }: {
    conversation_id: number;
    name?: string;
    avatar?: File;
  }) => {
    const formData = new FormData();
    if (name !== undefined && name !== null) {
      formData.append("name", name);
    }
    if (avatar) {
      formData.append("avatar", avatar);
    }

    const res = await useAxios.patch(`/conversations/${conversation_id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  addMembers: async ({
    conversation_id,
    users,
  }: {
    conversation_id: number;
    users: (number | string)[];
  }) => {
    const res = await useAxios.post(
      `/conversations/${conversation_id}/members`,
      { users }
    );
    return res.data;
  },

  removeMember: async ({
    conversation_id,
    member_id,
  }: {
    conversation_id: number;
    member_id: number | string;
  }) => {
    const res = await useAxios.delete(
      `/conversations/${conversation_id}/members/${member_id}`
    );
    return res.data;
  },

  sendMessage: async ({
    conversation_id,
    to_user_id,
    conversation_type,
    text,
    file,
  }: SendMessagePayload) => {
    const formData = new FormData();
    formData.append("to_user_id", String(to_user_id));
    formData.append("conversation_type", conversation_type);
    if (text) {
      formData.append("text", text);
    }
    if (file) {
      formData.append("file", file);
    }

    const endpoint =
      conversation_id && conversation_id > 0
        ? `/messages/new/${conversation_id}`
        : `/messages/new`;

    const res = await useAxios.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  editMessage: async ({
    message_id,
    text,
  }: {
    message_id: number;
    text: string;
  }) => {
    const res = await useAxios.patch(`/messages/${message_id}`, { text });
    return res.data;
  },

  deleteMessage: async ({
    message_id,
    conversation_id,
  }: {
    message_id: number;
    conversation_id: number;
  }) => {
    const res = await useAxios.delete(
      `/messages/${message_id}/${conversation_id}`,
    );
    return res.data;
  },
};

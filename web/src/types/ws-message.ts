import { Message } from "./message";

type WsMessageChatMessage = {
  type: "chat_message";
  payload: Message;
};

type WsMessageLoadMessages = {
  type: "load_messages";
  payload: {
    channelId: string;
    messages: Message[];
    hasMore: boolean;
  };
};

type WsMessageLoadChannels = {
  type: 'load_channels',
  payload: {
    channels: {
      id: string,
      name: string
      avatarUrl: string
      lastMessage: {
        content: string
        date: string
      }
    }[]
  }
}

export type WsMessage = WsMessageChatMessage | WsMessageLoadMessages | WsMessageLoadChannels;
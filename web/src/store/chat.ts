import { Channel } from "@/types/channel";
import { Message } from "@/types/message";
import { WsMessage } from "@/types/ws-message";
import { create } from "zustand";

type WsReadyState =
  | WebSocket["CONNECTING"]
  | WebSocket["OPEN"]
  | WebSocket["CLOSING"]
  | WebSocket["CLOSED"];

type SendChatMessageParams = {
  channelId: string,
  content: string,
}

type ChannelsStateProps = {
  hasMoreMessages: boolean
}

type ChatState = {
  channels: Channel[]
  wsClient: WebSocket | null
  currentChannel: Channel | null
  wsErrorMessage: string
  wsReadyState: WsReadyState
  userId: string
  messages: Map<string, Message[]>;
  isLoadingMoreMessages: boolean;
  channelsState: Map<string, ChannelsStateProps>;
  getFirstMessageId: (channelId?: string) => string | undefined;
  setCurrentChannel: (channel: Channel) => void;
  startWs: () => void;
  closeWs: () => void;
  sendChatMessage: (chatMessage: SendChatMessageParams) => void
  loadMoreMessages: (channelId: string, token?: string) => void;
  _sendWsMessage: (message: unknown) => void;
  _loadChannels: () => void
}

export const chatStore = create<ChatState>((set, get) => ({
  channels: [],
  wsClient: null,
  currentChannel: null,
  wsErrorMessage: "",
  wsReadyState: WebSocket.CLOSED,
  userId: '',
  isLoadingMoreMessages: false,
  messages: new Map(),
  channelsState: new Map(),

  getFirstMessageId: (channelId?: string) => {
    if (!channelId) {
      return undefined
    }
    const messages = get().messages.get(channelId)
    return messages?.[0]?.id
  },

  setCurrentChannel: (channel) => {
    set({
      currentChannel: channel
    })
  },

  startWs: () => {
    const url = new URL(window.location.href);
    const userId = url.searchParams.get("userId")!;
    set({ userId })

    const wsClient = new WebSocket(`ws://localhost:3000?userId=${userId}`);

    function onMessage(message: MessageEvent) {
      const data: WsMessage = JSON.parse(message.data);
      const { messages: prevMessages } = get()

      if (data.type === 'chat_message') {
        const newMessages = [...(prevMessages.get(data.payload.channelId) || []), data.payload];
        const newMap = new Map(prevMessages);
        newMap.set(data.payload.channelId, newMessages);

        const { channels } = get()
        const newChannels = channels.map(channel => {
          if (channel.id === data.payload.channelId) {
            return {...channel, lastMessage: { content: data.payload.content, date: data.payload.createdAt }}
          }
          return channel
        })

        set({ messages: newMap, channels: newChannels })
      } else if (data.type === "load_messages") {
        const payload = data.payload;

        const newMessagesList = [
          ...payload.messages,
          ...(prevMessages.get(payload.channelId) || []),
        ];
        const newMap = new Map(prevMessages);
        newMap.set(payload.channelId, newMessagesList);

        const channelState = get().channelsState.get(payload.channelId) || { hasMoreMessages: true }
        channelState.hasMoreMessages = payload.hasMore
        const newChannelStateMap = new Map(get().channelsState.set(payload.channelId, channelState))

        set({ messages: newMap, isLoadingMoreMessages: false, channelsState: newChannelStateMap })
      } else if (data.type === 'load_channels') {
        const channels = data.payload.channels

        set({ channels })
      }
    }

    function onOpen() {
      set({
        wsErrorMessage: '',
        wsReadyState: WebSocket.OPEN
      })

      get()._loadChannels()
    }

    function onError() {
      set({
        wsErrorMessage: 'Error trying to connect to WS server.',
        wsReadyState: WebSocket.CLOSED,
        isLoadingMoreMessages: false
      })
    }

    function onClose() {
      set({
        wsErrorMessage: '',
        wsReadyState: WebSocket.CLOSED,
        isLoadingMoreMessages: false
      })
    }

    wsClient.addEventListener("message", onMessage);
    wsClient.addEventListener("open", onOpen);
    wsClient.addEventListener("error", onError);
    wsClient.addEventListener("close", onClose);

    set({ wsClient })
  },

  closeWs: () => {
    get().wsClient?.close()
  },

  sendChatMessage({ channelId, content }: SendChatMessageParams) {
    get()._sendWsMessage({
      type: "chat_message",
      payload: {
        channelId,
        content,
      },
    })
  },

  loadMoreMessages(channelId: string, token?: string) {
    set({
      isLoadingMoreMessages: true
    })

    get()._sendWsMessage({
      type: "load_messages",
      payload: {
        channelId,
        token
      },
    })
  },

  _loadChannels() {
    get()._sendWsMessage({
      type: 'load_channels',
      payload: {
        userId: get().userId
      }
    })
  },

  _sendWsMessage(message: unknown) {
    const { wsClient } = get()

    if (!wsClient || wsClient.readyState !== WebSocket.OPEN) {
      return;
    }

    wsClient.send(JSON.stringify(message));
  }
}))
import { Channel } from "@/types/channel";

export const channels: Channel[] = [
  {
    id: "b5bd790c-8b54-4d19-8952-920ceab32200",
    user: {
      id: 1,
      name: "John Doe",
      avatarUrl: "https://i.pravatar.cc/50",
    },
    lastMessage: {
      content: "Hello, how are you?",
      date: "2023-03-01T12:00:00Z",
    },
  },
  {
    id: "b5bd790c-8b54-4d19-8952-920ceab32200",
    user: {
      id: 2,
      name: "Jane Smith",
      avatarUrl: "https://i.pravatar.cc/50",
    },
    lastMessage: {
      content: "I'm doing well, thanks for asking!",
      date: "2023-03-02T14:30:00Z",
    },
  },
  {
    id: "4c83f7d0-a667-42f5-be75-17b212621a46",
    user: {
      id: 3,
      name: "Richard",
      avatarUrl: "https://i.pravatar.cc/50",
    },
    lastMessage: {
      content: "I'm doing well, thanks for asking!",
      date: "2023-03-02T14:30:00Z",
    },
  },
];
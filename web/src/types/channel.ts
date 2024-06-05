export type Channel = {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessage: {
    content: string;
    date: string;
  };
};
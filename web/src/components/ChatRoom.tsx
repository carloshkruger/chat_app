import { useStore } from "zustand";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatMessages } from "./ChatMessages";
import { chatStore } from "@/store/chat";
import { NoContactSelectedMessage } from "./NoContactSelectedMessage";

export function ChatRoom() {
  const currentChannel = useStore(chatStore, (store) => store.currentChannel);

  if (!currentChannel) {
    return <NoContactSelectedMessage />;
  }

  return (
    <div className="flex flex-col flex-1 justify-between max-h-screen">
      <Header />
      <ChatMessages />
      <Footer />
    </div>
  );
}

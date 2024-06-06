import { useEffect } from "react";
import { useStore } from "zustand";
import { ChatRoom } from "@/components/ChatRoom";
import { ContactList } from "@/components/ContactList";
import { WebSocketErrorMessage } from "@/components/WebSocketErrorMessage";
import { ConnectionLost } from "@/components/ConnectionLost";
import { Loading } from "@/components/Loading";
import { chatStore } from "@/store/chat";
import { useHeartbeat } from "@/hooks/useHeartbeat";

function App() {
  const startWs = useStore(chatStore, (store) => store.startWs);
  const closeWs = useStore(chatStore, (store) => store.closeWs);
  const wsErrorMessage = useStore(chatStore, (store) => store.wsErrorMessage);
  const wsReadyState = useStore(chatStore, (store) => store.wsReadyState);

  useEffect(() => {
    startWs();

    return () => closeWs();
  }, [startWs, closeWs]);

  useHeartbeat();

  if (wsReadyState === WebSocket.CONNECTING) {
    return <Loading />;
  }

  if (wsReadyState === WebSocket.CLOSED) {
    return <ConnectionLost />;
  }

  if (wsErrorMessage) {
    return <WebSocketErrorMessage message={wsErrorMessage} />;
  }

  return (
    <main className="min-h-screen">
      <div className="flex w-full max-w-screen-2xl mx-auto min-h-screen border-x-2 border-zinc-100">
        <ContactList />
        <ChatRoom />
      </div>
    </main>
  );
}

export default App;

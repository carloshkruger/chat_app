import { useEffect } from "react";
import { useStore } from "zustand";
import { ChatRoom } from "@/components/ChatRoom";
import { ContactList } from "@/components/ContactList";
import { WebSocketErrorMessage } from "@/components/WebSocketErrorMessage";
import { Button } from "@/components/ui/button";
import { sendHeartbeat } from "@/api/heartbeat";
import { chatStore } from "@/store/chat";

function App() {
  const startWs = useStore(chatStore, (store) => store.startWs);
  const closeWs = useStore(chatStore, (store) => store.closeWs);
  const userId = useStore(chatStore, (store) => store.userId);
  const wsErrorMessage = useStore(chatStore, (store) => store.wsErrorMessage);
  const wsReadyState = useStore(chatStore, (store) => store.wsReadyState);

  useEffect(() => {
    startWs();

    return () => closeWs();
  }, [startWs, closeWs]);

  useEffect(() => {
    let heartbeatIntervalId: ReturnType<typeof setInterval>;

    function setHeartbeatInterval() {
      clearInterval(heartbeatIntervalId);
      heartbeatIntervalId = setInterval(() => sendHeartbeat(userId), 10_000);
    }

    function changeUserPresence(e: Event) {
      const isUserActive = e.type === "focus";

      if (isUserActive) {
        sendHeartbeat(userId);
        setHeartbeatInterval();
      } else {
        clearInterval(heartbeatIntervalId);
      }
    }

    setHeartbeatInterval();
    window.addEventListener("blur", changeUserPresence);
    window.addEventListener("focus", changeUserPresence);

    return () => {
      clearInterval(heartbeatIntervalId);
      window.removeEventListener("blur", changeUserPresence);
      window.removeEventListener("focus", changeUserPresence);
    };
  }, [userId]);

  function reloadPage() {
    window.location.reload();
  }

  if (wsReadyState === WebSocket.CONNECTING) {
    return (
      <div className="flex flex-col items-center gap-4 pt-4">Loading...</div>
    );
  }

  if (wsReadyState === WebSocket.CLOSED) {
    return (
      <div className="flex flex-col items-center gap-4 pt-4">
        <p>Connection lost.</p>
        <Button variant="outline" onClick={reloadPage}>
          Reload page
        </Button>
      </div>
    );
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

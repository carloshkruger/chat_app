import { useEffect } from "react";
import { useStore } from "zustand";
import { sendHeartbeat } from "@/api/heartbeat";
import { chatStore } from "@/store/chat";

export function useHeartbeat() {
  const userId = useStore(chatStore, (store) => store.userId);

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
}
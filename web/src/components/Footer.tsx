import { FormEvent, useState } from "react";
import { Mic, Plus, Smile } from "lucide-react";
import { useStore } from "zustand";
import { chatStore } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const { sendChatMessage, channel } = useStore(chatStore, (store) => ({
    sendChatMessage: store.sendChatMessage,
    channel: store.currentChannel,
  }));
  const [currentMessage, setCurrentMessage] = useState("");
  const channelId = channel!.id;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const content = currentMessage.trim();

    if (content.length === 0) {
      setCurrentMessage("");
      return;
    }

    sendChatMessage({
      channelId,
      content,
    });
    setCurrentMessage("");
  }

  return (
    <div className="flex items-center pb-4 px-2 pt-2 border-t-2 border-zinc-100">
      <Button variant="ghost" className="p-2">
        <Smile />
      </Button>
      <Button variant="ghost" className="p-2">
        <Plus />
      </Button>

      <form className="w-full mx-2" onSubmit={handleSubmit}>
        <Input
          name="content"
          type="text"
          placeholder="Type a message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          required
        />
      </form>

      <Button variant="ghost" className="p-2">
        <Mic />
      </Button>
    </div>
  );
}

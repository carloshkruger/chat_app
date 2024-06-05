import { useStore } from "zustand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { chatStore } from "@/store/chat";

export function ContactList() {
  const channels = useStore(chatStore, (store) => store.channels);
  const setCurrentChannel = useStore(
    chatStore,
    (store) => store.setCurrentChannel
  );

  return (
    <ScrollArea className="min-w-80 max-w-sm h-screen border-r-2 border-zinc-100">
      {!channels.length && (
        <p className="flex justify-center pt-4">No contact found</p>
      )}
      {channels.map((channel) => (
        <div
          key={channel.id}
          onClick={() => setCurrentChannel(channel)}
          className="flex items-center gap-4 p-4 hover:bg-secondary cursor-pointer border-b-2 border-zinc-100"
        >
          <Avatar>
            <AvatarImage src={channel.avatarUrl} />
            <AvatarFallback>Image</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-primary text-md">{channel.name}</p>
            <p className="text-xs line-clamp-1">
              {channel.lastMessage?.content}
            </p>
          </div>
        </div>
      ))}
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}

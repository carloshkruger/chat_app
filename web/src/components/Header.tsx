import { MoreVertical, Search } from "lucide-react";
import { useStore } from "zustand";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { chatStore } from "@/store/chat";

export function Header() {
  const { channel } = useStore(chatStore, (store) => ({
    channel: store.currentChannel,
  }));

  return (
    <header className="flex items-center justify-between p-4 border-b-2 border-zinc-100">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={channel!.avatarUrl} alt={channel!.name} />
        </Avatar>
        <strong>{channel!.name}</strong>
      </div>
      <div className="flex">
        <Button variant="ghost" title="Search">
          <Search />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" title="Menu">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Contact info</DropdownMenuItem>
            <DropdownMenuItem>Select messages</DropdownMenuItem>
            <DropdownMenuItem>Close chat</DropdownMenuItem>
            <DropdownMenuItem>Mute notifications</DropdownMenuItem>
            <DropdownMenuItem>Disappearing messages</DropdownMenuItem>
            <DropdownMenuItem>Clear chat</DropdownMenuItem>
            <DropdownMenuItem>Delete chat</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Block</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

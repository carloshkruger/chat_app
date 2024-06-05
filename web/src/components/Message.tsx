import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type MessageProps = {
  createdAt: string;
  content: string;
  loggedUserSent?: boolean;
};

export function Message({
  content,
  createdAt,
  loggedUserSent = false,
}: MessageProps) {
  const sentTime = new Date(createdAt);
  const sentTimeString = sentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "bg-primary-foreground p-2 w-fit flex flex-col rounded-md",
        loggedUserSent ? "self-end bg-green-100" : "self-start"
      )}
    >
      <p>{content}</p>
      <span className="flex items-center gap-1 self-end text-xs opacity-50">
        {sentTimeString}
        {loggedUserSent && <CheckCheck className="w-4 h-4" />}
      </span>
    </div>
  );
}

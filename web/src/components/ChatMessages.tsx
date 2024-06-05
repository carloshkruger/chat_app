import { useCallback, useEffect, useRef } from "react";
import { useStore } from "zustand";
import { chatStore } from "@/store/chat";
import { Message } from "@/components/Message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export function ChatMessages() {
  const messages = useStore(chatStore, (store) => store.messages);
  const loggedUserId = useStore(chatStore, (store) => store.userId);
  const channelsState = useStore(chatStore, (store) => store.channelsState);
  const channel = useStore(chatStore, (store) => store.currentChannel);
  const isLoadingMoreMessages = useStore(
    chatStore,
    (store) => store.isLoadingMoreMessages
  );
  const loadMoreMessages = useStore(
    chatStore,
    (store) => store.loadMoreMessages
  );
  const getFirstMessageId = useStore(
    chatStore,
    (store) => store.getFirstMessageId
  );
  const scrollTarget = useRef<HTMLDivElement>(null);

  const channelId = channel!.id;
  const currentMessages = messages.get(channelId) ?? [];
  const currentChannelState = channelsState.get(channelId);
  const lastMessageId = currentMessages.at(-1)?.id;

  useEffect(() => {
    if (scrollTarget.current) {
      scrollTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lastMessageId]);

  const handleLoadMoreMessages = useCallback(() => {
    loadMoreMessages(channelId, getFirstMessageId(channelId));
  }, [channelId, loadMoreMessages, getFirstMessageId]);

  useEffect(() => {
    handleLoadMoreMessages();
  }, [handleLoadMoreMessages]);

  return (
    <ScrollArea className="h-full">
      <div className="h-full flex flex-col gap-1 rounded-md px-10 overflow-y-auto my-2">
        <div className="flex justify-center">
          {currentChannelState?.hasMoreMessages && (
            <Button
              onClick={handleLoadMoreMessages}
              variant="outline"
              disabled={isLoadingMoreMessages}
            >
              Load more messages
            </Button>
          )}
        </div>
        {currentMessages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            createdAt={message.createdAt}
            loggedUserSent={message.authorId === loggedUserId}
          />
        ))}
        <div ref={scrollTarget} />
      </div>
    </ScrollArea>
  );
}

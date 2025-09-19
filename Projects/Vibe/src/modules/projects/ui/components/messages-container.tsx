"use client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/trpc/client";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";
import { type Fragment } from "@/generated/prisma";
import { MessageLoading } from "./message-loading";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

export function MessagesContainer({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) {
  const { data: messages } = useQuery({
    ...trpc.messages.getMany.useQuery({ projectId }),
    refetchInterval: 2000, // 2 seconds
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    const lastAssistantMessage = messages?.findLast(
      (msg) => msg.role === "assistant"
    );
    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessage.id !== lastAssistantMessageIdRef.current
    ) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastAssistantMessageIdRef.current = lastAssistantMessage.id;
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const lastMessage = messages?.[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "user";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages?.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={activeFragment?.id === message.fragment?.id}
              onFragmentClick={(fragment) => setActiveFragment(fragment)}
              type={message.type}
            />
          ))}
          {isLastMessageUser && <MessageLoading />}
        </div>
        <div ref={bottomRef} />
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
}
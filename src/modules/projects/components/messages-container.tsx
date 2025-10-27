"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import type { Fragment } from "@/generated/client"
import { useTRPC } from "@/trpc/client"
import { MessageCard } from "./message-card"
import { MessageForm } from "./message-form"
import { MessageLoading } from "./message-loading"

interface Props {
  projectId: string
  activeFragment: Fragment | null
  setActiveFragment: (fragment: Fragment | null) => void
}

export const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const trpc = useTRPC()
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      {
        refetchInterval: 5000,
      }
    )
  )

  const bottomRef = useRef<HTMLDivElement>(null)
  const lastAssistantMessageIdRef = useRef<string | null>(null)

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    )

    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessage.id !== lastAssistantMessageIdRef.current
    ) {
      setActiveFragment(lastAssistantMessage.fragment)
      lastAssistantMessageIdRef.current = lastAssistantMessage.id
    }
  }, [messages, setActiveFragment])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const lastMessage = messages[messages.length - 1]
  const isLastMessageUser = lastMessage.role === "USER"

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={activeFragment?.id === message.fragment?.id}
              onFragmentClick={() => setActiveFragment(message.fragment)}
              type={message.type}
            />
          ))}
          {/* remove if dont need auto bottom scroll */}
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="relative p-3 pt-1">
        <div className="-top-6 pointer-events-none absolute right-0 left-0 h-6 bg-gradient-to-b from-transparent to-background/70" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  )
}

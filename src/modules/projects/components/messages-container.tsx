"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useTRPC } from "@/trpc/client"
import { MessageCard } from "./message-card"
import { MessageForm } from "./message-form"

interface Props {
  projectId: string
}

export const MessagesContainer = ({ projectId }: Props) => {
  const trpc = useTRPC()
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  )

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    )

    if (lastAssistantMessage) {
      // Set active Fragment
    }
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [])

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
              isActiveFragment={false}
              onFragmentClick={() => {}}
              type={message.type}
            />
          ))}
          {/* remove if dont need auto bottom scroll */}
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

import { format } from "date-fns"
import { ChevronRight, Code2 } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { Fragment, MessageRole, MessageType } from "@/generated/client"
import { cn } from "@/lib/utils"

interface Props {
  content: string
  role: MessageRole
  fragment: Fragment | null
  createdAt: Date
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment) => void
  type: MessageType
}

interface UserMessageProps {
  content: string
}

interface AssistantMessageProps {
  content: string
  fragment: Fragment | null
  createdAt: Date
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment) => void
  type: MessageType
}

interface FragmentCardProps {
  fragment: Fragment
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment) => void
}

export const MessageCard = ({
  content,
  createdAt,
  fragment,
  isActiveFragment,
  onFragmentClick,
  role,
  type,
}: Props) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    )
  }

  return <UserMessage content={content} />
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pr-2 pb-4 pl-10">
      <Card className="max-w-[80%] break-words rounded-lg border-none bg-muted p-3 shadow-none">
        {content}
      </Card>
    </div>
  )
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      type="button"
      className={cn(
        "flex w-fit items-start gap-2 rounded-lg border bg-muted p-3 text-start transition-colors hover:bg-secondary",
        isActiveFragment &&
          "border-primary bg-primary text-primary-foreground hover:bg-primary"
      )}
      onClick={() => onFragmentClick(fragment)}>
      <Code2 className="mt-0.5 size-4" />
      <div className="flex flex-1 flex-col">
        <span className="line-clamp-1 font-medium text-sm">
          {fragment.title}
        </span>
        <span className="text-sm">Preview</span>
      </div>

      <div className="mt-0.5 flex items-center justify-center">
        <ChevronRight className="size-4" />
      </div>
    </button>
  )
}

const AssistantMessage = ({
  content,
  createdAt,
  fragment,
  type,
  onFragmentClick,
  isActiveFragment,
}: AssistantMessageProps) => {
  return (
    <div
      className={cn(
        "group flex flex-col px-2 pb-4",
        type === "ERROR" && "text-red-700 dark:text-red-500"
      )}>
      <div className="mb-2 flex items-center gap-2 pl-2">
        <Image
          src="/logo.svg"
          alt="vibe"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="font-medium text-sm">Vibe</span>
        <span className="text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100">
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>

      <div className="flex flex-col gap-y-4 pl-8.5">
        <span>{content}</span>
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  )
}

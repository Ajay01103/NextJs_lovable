"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowUp, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "sonner"
import { z } from "zod/v4"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"

interface Props {
  projectId: string
}

const formSchema = z.object({
  value: z.string().min(1, "value is required").max(10000, "value is too long"),
})

export const MessageForm = ({ projectId }: Props) => {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const { mutateAsync: createMessage, isPending } = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset()
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
        )
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )

  const [isFocused, setIsFocused] = useState(false)
  const showUsage = false

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  })

  const isDisabled = isPending || !form.formState.isValid

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await createMessage({ value: data.value, projectId })
  }

  return (
    <Form {...form}>
      <form
        className={cn(
          "relative rounded-xl border bg-sidebar p-4 pt-1 transition-all dark:bg-sidebar",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
        onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isPending}
              minRows={2}
              maxRows={8}
              className="w-full resize-none border-none bg-transparent pt-4 outline-none"
              placeholder="what would you like to build"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault()
                  form.handleSubmit(onSubmit)(e)
                }
              }}
            />
          )}
        />

        <div className="flex items-end justify-between gap-x-2 pt-2">
          <div className="font-mono text-[10px] text-muted-foreground">
            <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground">
              <span>&#8984;</span> Enter
            </kbd>
            &nbsp; to submit
          </div>
          <Button
            disabled={isDisabled}
            className={cn(
              "size-8 rounded-full",
              isDisabled && "border bg-muted-foreground"
            )}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUp />
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

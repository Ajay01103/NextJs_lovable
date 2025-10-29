"use client"

import { useClerk } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowUp, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "sonner"
import { z } from "zod/v4"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { PROJECT_TEMPLATES } from "../constants"

const formSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, "value is required")
    .max(10000, "value is too long"),
})

export const ProjectForm = () => {
  const router = useRouter()
  const clerk = useClerk()
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const { mutateAsync: createProject, isPending } = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions())
        router.push(`/projects/${data.id}`)
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn()
        }

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
    await createProject({ value: data.value })
  }

  const onSelect = (value: string) => {
    form.setValue("value", value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    })
  }

  return (
    <Form {...form}>
      <section className="space-y-6">
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
      </section>

      <div className="hidden max-w-3xl flex-wrap justify-center gap-2 md:flex">
        {PROJECT_TEMPLATES.map((template) => (
          <Button
            key={template.title}
            variant="outline"
            size="sm"
            className="bg-white dark:bg-sidebar"
            onClick={() => onSelect(template.prompt)}>
            {template.emoji} {template.title}
          </Button>
        ))}
      </div>
    </Form>
  )
}

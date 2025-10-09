"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTRPC } from "@/trpc/client"

export default function Home() {
  const [value, setValue] = useState("")
  const trpc = useTRPC()

  const { mutate: createProject, isPending } = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-y-4">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          disabled={isPending}
          onClick={() => createProject({ value })}>
          Click to invoke Event
        </Button>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"

export default function Home() {
  const trpc = useTRPC()
  const { mutate, isPending } = useMutation(trpc.invoke.mutationOptions())
  return (
    <div>
      <Button
        disabled={isPending}
        onClick={() => mutate({ email: "amit@gmail.com" })}>
        Click to invoke Event
      </Button>
    </div>
  )
}

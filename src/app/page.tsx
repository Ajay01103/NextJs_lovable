"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTRPC } from "@/trpc/client"

export default function Home() {
  const [value, setValue] = useState("")
  const trpc = useTRPC()

  const { data } = useQuery(trpc.message.getMany.queryOptions())
  const { mutate, isPending } = useMutation(
    trpc.message.create.mutationOptions()
  )
  return (
    <div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        disabled={isPending}
        onClick={() => mutate({ value })}>
        Click to invoke Event
      </Button>

      {JSON.stringify(data)}
    </div>
  )
}

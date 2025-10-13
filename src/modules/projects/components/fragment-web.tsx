/** biome-ignore-all lint/a11y/useIframeTitle: fine to use */
"use client"

import { ExternalLink, RefreshCcw } from "lucide-react"
import { useState } from "react"
import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import type { Fragment } from "@/generated/client"

interface Props {
  data: Fragment
}

export const FragmentWeb = ({ data }: Props) => {
  const [fragmentKey, setFragmentKey] = useState(0)
  const [copied, setCopied] = useState(false)

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-x-2 border-b bg-sidebar p-2">
        <Hint
          text="refresh"
          side="bottom"
          align="start">
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}>
            <RefreshCcw />
          </Button>
        </Hint>

        <Hint
          text="click to copy"
          side="bottom">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!data.sandboxUrl || copied}
            className="flex-1 justify-start text-start font-normal">
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>

        <Hint
          text="open in new tab"
          side="bottom"
          align="start">
          <Button
            size="sm"
            disabled={!data.sandboxUrl}
            variant="outline"
            onClick={() => {
              if (!data.sandboxUrl) return
              window.open(data.sandboxUrl, "_blank")
            }}>
            <ExternalLink />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  )
}

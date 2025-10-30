import { useAuth } from "@clerk/nextjs"
import { formatDuration, intervalToDuration } from "date-fns"
import { Crown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Props {
  points: number
  msBeforeNext: number
}

export const Usage = ({ msBeforeNext, points }: Props) => {
  const { has } = useAuth()
  const hasProAccess = has?.({ plan: "pro" })

  return (
    <div className="rounded-t-xl border border-b-0 bg-background p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {points} {hasProAccess ? "" : "free credits left"}
          </p>
          <p className="text-muted-foreground text-xs">
            Resets in{" "}
            {formatDuration(
              intervalToDuration({
                start: new Date(),
                end: new Date(Date.now() + msBeforeNext),
              }),
              { format: ["months", "days", "hours"] }
            )}
          </p>
        </div>

        {!hasProAccess && (
          <Button
            asChild
            variant="tertiary"
            size="sm"
            className="ml-auto">
            <Link href="/pricing">
              <Crown />
              Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

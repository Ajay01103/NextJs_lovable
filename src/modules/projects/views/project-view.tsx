"use client"

import { Suspense, useState } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import type { Fragment } from "@/generated/client"
import { MessagesContainer } from "../components/messages-container"
import { ProjectHeader } from "../components/project-header"

interface Props {
  projectId: string
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex min-h-0 flex-col">
          <Suspense fallback={<p>Loading...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>

          <MessagesContainer
            projectId={projectId}
            activeFragment={activeFragment}
            setActiveFragment={setActiveFragment}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={65}
          minSize={50}>
          TODO: Preview
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

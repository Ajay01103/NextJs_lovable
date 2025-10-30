"use client"

import { useAuth } from "@clerk/nextjs"
import { Code, Crown, Eye } from "lucide-react"
import Link from "next/link"
import { Suspense, useState } from "react"
import { FileExplorer } from "@/components/file-explorer"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserControl } from "@/components/user-control"
import type { Fragment } from "@/generated/client"
import { FragmentWeb } from "../components/fragment-web"
import { MessagesContainer } from "../components/messages-container"
import { ProjectHeader } from "../components/project-header"

interface Props {
  projectId: string
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
  const [tabsState, settabsState] = useState<"preview" | "code">("preview")

  const { has } = useAuth()
  const hasProAccess = has?.({ plan: "pro" })

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
        <ResizableHandle className="transition-colors hover:bg-primary" />
        <ResizablePanel
          defaultSize={65}
          minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabsState}
            onValueChange={(value) =>
              settabsState(value as "preview" | "code")
            }>
            <div className="flex w-full items-center gap-x-2 border-b p-2">
              <TabsList className="h-0 rounded-md border p-0">
                <TabsTrigger
                  value="preview"
                  className="rounded-md">
                  <Eye /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="rounded-md">
                  <Code /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button
                    asChild
                    size="sm"
                    variant="tertiary">
                    <Link href={"/pricing"}>
                      <Crown /> Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent
              value="code"
              className="min-h-0">
              {activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

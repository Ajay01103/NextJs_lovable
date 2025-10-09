import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { ProjectView } from "@/modules/projects/views/project-view"
import { getQueryClient, trpc } from "@/trpc/server"

interface Props {
  params: Promise<{
    projectId: string
  }>
}

const ProjectIdPage = async ({ params }: Props) => {
  const { projectId } = await params

  const queryClient = getQueryClient()

  // trpc prefetching
  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  )
  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({
      id: projectId,
    })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  )
}

export default ProjectIdPage

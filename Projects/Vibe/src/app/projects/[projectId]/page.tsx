import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ProjectView } from "@/modules/projects/ui/views/project-view";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: {
    projectId: string;
  };
}

export default async function Page({ params }: Props) {
  const projectId = params.projectId;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<div>Project Page Error</div>}>
        <Suspense fallback={<div>Loading Project...</div>}>
          <ProjectView projectId={projectId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
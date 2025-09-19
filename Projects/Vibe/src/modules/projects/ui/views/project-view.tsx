"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Suspense, useState } from "react";
import { ProjectHeader } from "../components/project-header";
import { MessagesContainer } from "../components/messages-container";
import { type Fragment } from "@/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, EyeIcon, CrownIcon } from "lucide-react";
import { FragmentWeb } from "../components/fragment-web";
import { FileExplorer } from "@/components/file-explorer";
import { UserControl } from "@/components/user-control";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  projectId: string;
}

export function ProjectView({ projectId }: Props) {
  const { has } = useAuth();
  const hasProAccess = has && has({ plan: "pro" });
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary fallback={<div>Project Header Error</div>}>
            <Suspense fallback={<div>Loading Project...</div>}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<div>Messages Container Error</div>}>
            <Suspense fallback={<div>Loading Messages...</div>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full flex flex-col gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-auto p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon className="size-4 mr-2" />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon className="size-4 mr-2" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="tertiary">
                    <Link href="/pricing">
                      <CrownIcon className="size-4 mr-2" />
                      Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            <TabsContent value="preview" className="flex-1 min-h-0">
              {activeFragment ? (
                <FragmentWeb data={activeFragment} />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Select a fragment to view its preview.
                </div>
              )}
            </TabsContent>
            <TabsContent value="code" className="flex-1 min-h-0">
              {activeFragment?.files ? (
                <FileExplorer files={activeFragment.files as any} />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Select a fragment to view its code.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
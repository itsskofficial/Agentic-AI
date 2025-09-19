"use client";
import { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Fragment } from "@/generated/prisma";
import { Hint } from "@/components/hint";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [fragmentKey, setFragmentKey] = useState(0);
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    copyToClipboard(data.sandboxUrl);
  };

  const handleOpenNewTab = () => {
    if (!data.sandboxUrl) return;
    window.open(data.sandboxUrl, "_blank");
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh" side="bottom">
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCcwIcon className="size-4" />
          </Button>
        </Hint>
        <Button
          variant="outline"
          className="flex-1 justify-start text-start font-normal"
          onClick={handleCopy}
          disabled={!data.sandboxUrl || isCopied}
        >
          <span className="truncate">{data.sandboxUrl}</span>
        </Button>
        <Hint text="Open in a new tab" side="bottom">
          <Button
            variant="outline"
            size="icon"
            disabled={!data.sandboxUrl}
            onClick={handleOpenNewTab}
          >
            <ExternalLinkIcon className="size-4" />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
        src={data.sandboxUrl}
        title="Vibe Preview"
      />
    </div>
  );
}
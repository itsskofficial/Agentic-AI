"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const shimmerMessages = [
  "Thinking...",
  "Loading...",
  "Generating...",
  "Analyzing your request...",
  "Building your website...",
  "Crafting components...",
];

function ShimmerMessages() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % shimmerMessages.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {shimmerMessages[currentMessageIndex]}
      </span>
    </div>
  );
}

export function MessageLoading() {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="Vibe"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Vibe</span>
      </div>
      <div className="pl-8 flex flex-col gap-y-4">
        <ShimmerMessages />
      </div>
    </div>
  );
}
"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard.");
      });
  }, []);

  return { isCopied, copyToClipboard };
};
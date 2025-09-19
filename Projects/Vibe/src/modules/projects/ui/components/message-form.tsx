"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Usage } from "./usage";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Prompt is required" })
    .max(10000, { message: "Prompt is too long" }),
});

interface Props {
  projectId: string;
}

export function MessageForm({ projectId }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: usage } = useQuery(trpc.usage.status.useQuery());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createMessage = useMutation({
    mutationFn: trpc.messages.create.mutate,
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({
        queryKey: trpc.messages.getMany.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: trpc.usage.status.queryKey,
      });
    },
    onError: (error) => {
      if (error.data?.code === "TOO_MANY_REQUESTS") {
        router.push("/pricing");
      } else {
        toast.error(error.message);
      }
    },
  });

  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;
  const showUsage = !!usage;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createMessage.mutateAsync({ value: values.value, projectId });
  }

  return (
    <>
      {showUsage && (
        <Usage
          points={usage.remainingPoints}
          millisecondsBeforeNextReset={usage.msBeforeNext}
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 bg-sidebar dark:bg-sidebar transition-all",
            showUsage ? "rounded-b-2xl" : "rounded-2xl",
            isFocused && "shadow-sm"
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={2}
                maxRows={8}
                className="pt-4 resize-none border-none w-full outline-none bg-transparent placeholder:text-muted-foreground"
                placeholder="What would you like to build?"
                disabled={isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />
          <div className="flex gap-x-2 items-end justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>Enter
              </kbd>
              &nbsp;to submit
            </div>
            <Button
              type="submit"
              size="icon"
              className={cn(
                "size-8 rounded-full",
                isButtonDisabled && "bg-muted-foreground border"
              )}
              disabled={isButtonDisabled}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <ArrowUpIcon className="size-4" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

interface Props {
  points: number;
  millisecondsBeforeNextReset: number;
}

export function Usage({ points, millisecondsBeforeNextReset }: Props) {
  const { has } = useAuth();
  const hasProAccess = has && has({ plan: "pro" });

  const resetTime = useMemo(() => {
    try {
      return formatDuration(
        intervalToDuration({
          start: new Date(),
          end: new Date(Date.now() + millisecondsBeforeNextReset),
        }),
        { format: ["months", "days", "hours"] }
      );
    } catch (error) {
      console.error("Error formatting duration:", error);
      return "soon";
    }
  }, [millisecondsBeforeNextReset]);

  return (
    <div className="rounded-t-2xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div className="flex-1">
          <p className="text-sm">
            You have {points} {hasProAccess ? "" : "free"} credits remaining.
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in {resetTime}
          </p>
        </div>
        {!hasProAccess && (
          <Button asChild size="sm" variant="tertiary" className="ml-auto">
            <Link href="/pricing">
              <CrownIcon className="size-4 mr-2" />
              Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
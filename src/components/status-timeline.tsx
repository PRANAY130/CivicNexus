
"use client";

import { cn } from "@/lib/utils";
import { Check, Loader } from "lucide-react";

type Status = "Submitted" | "In Progress" | "Pending Approval" | "Resolved";
const statuses: Status[] = ["Submitted", "In Progress", "Pending Approval", "Resolved"];

interface StatusTimelineProps {
  currentStatus: Status;
}

export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="w-full px-2 pt-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 bg-muted rounded-full"></div>
        <div
          className="absolute left-0 top-1/2 h-2 -translate-y-1/2 bg-gradient-to-r from-accent to-primary transition-all duration-500 rounded-full"
          style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        ></div>
        {statuses.map((status, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={status} className="relative z-10 flex flex-col items-center w-24">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-card transition-all duration-500",
                  isActive ? "border-primary" : "border-border",
                  isCurrent && "shadow-lg shadow-primary/30"
                )}
              >
                {isActive ? (
                    isCurrent ? (
                        <Loader className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                        <Check className="h-5 w-5 text-primary" />
                    )
                ) : (
                    <div className="h-2 w-2 rounded-full bg-border transition-colors duration-500"></div>
                )}
              </div>
              <p
                className={cn(
                  "mt-2 text-xs text-center font-semibold transition-colors duration-500",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {status}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

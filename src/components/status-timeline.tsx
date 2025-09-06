"use client";

import { cn } from "@/lib/utils";

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
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-border"></div>
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-500"
          style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        ></div>
        {statuses.map((status, index) => {
          const isActive = index <= currentIndex;
          return (
            <div key={status} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 bg-card transition-colors duration-500",
                  isActive ? "border-primary" : "border-border"
                )}
              >
                <div
                  className={cn(
                    "h-3 w-3 rounded-full transition-colors duration-500",
                    isActive ? "bg-primary" : "bg-border"
                  )}
                ></div>
              </div>
              <p
                className={cn(
                  "mt-2 text-xs text-center font-medium transition-colors duration-500",
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

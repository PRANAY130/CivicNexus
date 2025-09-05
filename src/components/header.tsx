"use client";

import { Megaphone } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight font-headline text-foreground">
              CivicPulse
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}

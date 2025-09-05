"use client";

import { Megaphone, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
          {user && (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

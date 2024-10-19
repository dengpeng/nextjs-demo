"use client";

import { Loader2 } from "lucide-react";
import { useGlobalUrlState } from "@/_hooks/global-url-state";
import { cn } from "@/_utils/style";

export default function GlobalLoader({ className }: { className?: string }) {
  const [isPending] = useGlobalUrlState();

  return isPending ? (
    <Loader2
      className={cn("size-6 animate-spin text-muted-foreground", className)}
    />
  ) : (
    <></>
  );
}

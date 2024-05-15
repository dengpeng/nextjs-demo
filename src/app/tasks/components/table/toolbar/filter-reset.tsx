"use client";

import { X } from "lucide-react";
import { Button } from "@/_components/ui/button";
import { useUrlStateReset } from "@/_hooks/use-url-state";
import { cn } from "~/app/_utils/style";

export default function FilterReset({ className }: { className?: string }) {
  const [reset] = useUrlStateReset(
    "search",
    "status",
    "priority",
    "category",
    "createdAt",
  );
  return (
    <Button
      variant="ghost"
      onClick={() => reset()}
      className={cn("h-8 px-2 text-muted-foreground lg:px-3", className)}
    >
      Clear Filters
      <X className="ml-2 h-4 w-4" />
    </Button>
  );
}

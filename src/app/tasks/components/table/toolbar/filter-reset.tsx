"use client";

import { X } from "lucide-react";
import { Button } from "@/_components/ui/button";
import { useUrlStateReset } from "@/_hooks/use-url-state";

export default function FilterReset() {
  const [reset] = useUrlStateReset("search", "status", "priority", "category");
  return (
    <Button
      variant="ghost"
      onClick={() => reset()}
      className="h-8 px-2 text-muted-foreground lg:px-3"
    >
      Clear Filters
      <X className="ml-2 h-4 w-4" />
    </Button>
  );
}

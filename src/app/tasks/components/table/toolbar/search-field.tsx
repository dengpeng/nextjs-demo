"use client";

import { Loader2, X } from "lucide-react";
import { Input } from "@/_components/ui/input";
import { useUrlState } from "@/_hooks/use-url-state";
import { Button } from "@/_components/ui/button";

export default function SearchField({ value }: { value: string | undefined }) {
  const [optimisticValue, updateValue, isPending] = useUrlState({
    key: "search",
    value: value,
    decode: (value) => value ?? "",
  });

  return (
    <div className="relative w-full md:w-auto">
      <Input
        placeholder="Filter tasks..."
        value={optimisticValue}
        onChange={(event) => updateValue(event.target.value)}
        className="h-8 w-full md:w-[150px] lg:w-[250px]"
      />
      {isPending && (
        <Loader2 className="absolute right-2 top-2 size-4 animate-spin" />
      )}
      {!isPending && optimisticValue && (
        <Button
          variant={"ghost"}
          size="icon"
          className="absolute right-2 top-1.5 size-5 text-muted-foreground"
          onClick={() => updateValue("")}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}

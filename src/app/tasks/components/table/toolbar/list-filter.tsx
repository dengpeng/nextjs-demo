"use client";

import { CheckIcon, Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/_components/ui/popover";
import { useUrlState } from "@/_hooks/use-url-state";
import { Badge } from "@/_components/ui/badge";
import { Separator } from "@/_components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/_components/ui/command";
import { cn } from "../../../../_utils/style";

export default function ListFilter({
  parameter,
  title,
  value,
  options,
}: {
  parameter: string;
  title: string;
  value: string[];
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    stats?: number;
  }[];
}) {
  const [optimisticValue, updateValue, isPending] = useUrlState<
    string[],
    string[]
  >({
    key: parameter,
    value,
    decode: (value) => value,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 size-4" />
          )}
          {title}
          {optimisticValue.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {optimisticValue.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {optimisticValue.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {optimisticValue.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => optimisticValue.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = optimisticValue.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        updateValue(
                          optimisticValue.filter((v) => v !== option.value),
                        );
                      } else {
                        updateValue([...optimisticValue, option.value]);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("size-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 size-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {!!option.stats && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {option.stats}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {optimisticValue.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => updateValue([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

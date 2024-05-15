"use client";

import { endOfDay, format, isEqual } from "date-fns";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { Calendar } from "~/app/_components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import { useUrlState } from "~/app/_hooks/use-url-state";
import { Badge } from "@/_components/ui/badge";
import { Separator } from "@/_components/ui/separator";
import { type QueryParamDateRange } from "~/app/tasks/schema";

export default function DateRangeFilter({
  title,
  parameter,
  value,
}: {
  title: string;
  parameter: string;
  value: QueryParamDateRange;
  className?: string;
}) {
  const [optimisticValue, updateValue, isPending] = useUrlState<
    QueryParamDateRange,
    QueryParamDateRange
  >({
    key: parameter,
    value,
    decode: (value) => value,
    encode: (value, key, searchParams) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(key);

      if (value) {
        if (value?.from && value?.to && isEqual(value.from, value.to)) {
          value.to = endOfDay(value.to);
        }
        newSearchParams.set(
          key,
          `${value.from?.getTime() ?? ""}:${value.to?.getTime() ?? ""}`,
        );
      } else {
        newSearchParams.set(key, "");
      }

      return newSearchParams.toString();
    },
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
          {optimisticValue && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="min-w-6 justify-center rounded-sm px-1 font-normal lg:hidden"
              >
                {Object.values(optimisticValue).filter((v) => !!v).length}
              </Badge>
              {optimisticValue.from && (
                <Badge
                  variant="secondary"
                  className="hidden rounded-sm px-1 font-normal lg:flex"
                >
                  {format(optimisticValue.from, "yyyy-MM-dd")}
                </Badge>
              )}
              {!!(optimisticValue.from ?? optimisticValue.to) && (
                <span className="mx-1 hidden lg:inline-block">&ndash;</span>
              )}
              {optimisticValue.to && (
                <Badge
                  variant="secondary"
                  className="hidden rounded-sm px-1 font-normal lg:flex"
                >
                  {format(optimisticValue.to, "yyyy-MM-dd")}
                </Badge>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          selected={{ from: undefined, ...optimisticValue }} // Just a walk around, since the Calendar component requires the "from" property to be defined
          defaultMonth={optimisticValue?.from ?? new Date()}
          onSelect={updateValue}
          numberOfMonths={2}
        />
        <div className="px-2 pb-2">
          <Button
            variant="secondary"
            className="w-full"
            size="sm"
            disabled={!optimisticValue}
            onClick={() => updateValue(undefined)}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

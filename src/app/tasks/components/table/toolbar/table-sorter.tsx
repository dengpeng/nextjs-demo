"use client";

import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { useUrlState } from "~/app/_hooks/use-url-state";
import { cn } from "~/app/_utils/style";
import { type Sorter, type SorterInfo } from "~/app/tasks/schema";

export default function TableSorter<TData>({
  sort,
  sorters,
  className,
}: {
  sort: Sorter<TData>;
  sorters: SorterInfo<TData>[];
  className?: string;
}) {
  const [optimisticValue, updateValue] = useUrlState<
    SorterInfo<TData>,
    Sorter<TData>
  >({
    key: "sort",
    value: sort,
    decode: (v) =>
      sorters.find((s) => s.field === v.field && s.direction === v.direction) ??
      sorters[0]!,
    encode: (value, key, searchParams) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, `${String(value.field)}:${value.direction}`);
      return newSearchParams.toString();
    },
  });

  const selectedSorterIndex =
    sorters.findIndex(
      (s) =>
        s.field === optimisticValue.field &&
        s.direction === optimisticValue.direction,
    ) ?? 0;
  const selectedSorter = sorters[selectedSorterIndex];

  return (
    <Select
      value={`${selectedSorterIndex}`}
      onValueChange={(value) => {
        const sorter = sorters[Number(value)] ?? sorters[0];
        if (sorter) {
          updateValue(sorter);
        }
      }}
    >
      <SelectTrigger className={cn("h-8 w-52", className)}>
        <SelectValue asChild>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort by</span>
            {selectedSorter && <SorterSelectItem sorterInfo={selectedSorter} />}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent side="top">
        {sorters.map((s, idx) => (
          <SelectItem key={idx} value={`${idx}`}>
            <SorterSelectItem sorterInfo={s} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SorterSelectItem<TData>({
  sorterInfo,
}: {
  sorterInfo: SorterInfo<TData>;
}) {
  return (
    <div className="flex items-center gap-2">
      {sorterInfo.label}{" "}
      {sorterInfo.direction === "asc" ? (
        <ArrowDownWideNarrow className="size-4 text-muted-foreground" />
      ) : (
        <ArrowUpNarrowWide className="size-4 text-muted-foreground" />
      )}
    </div>
  );
}

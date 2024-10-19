"use client";

import {
  ArrowDown,
  ArrowDownIcon,
  ArrowUp,
  ArrowUpIcon,
  ChevronsUpDown,
  EyeOff,
} from "lucide-react";
import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { cn } from "@/_utils/style";
import { type ColumnDef } from "../../schema";
import { useUrlState } from "@/_hooks/use-url-state";

type Sorter<TData> = { field: keyof TData; direction: "asc" | "desc" };

export default function TableColumnHeader<TData>({
  column,
  className,
  title,
  sort,
  visibleColumns,
}: {
  column: Omit<ColumnDef<TData>, "renderer">;
  sort: Sorter<TData>;
  visibleColumns: Array<keyof TData>;
} & React.HTMLAttributes<HTMLDivElement>) {
  const caption = title ?? column.label;

  const [optimisticSort, updateSort] = useUrlState<
    Sorter<TData>,
    Sorter<TData>
  >({
    key: "sort",
    value: sort,
    decode: (value) => value,
    encode: (value, key, searchParams) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, `${String(value.field)}:${value.direction}`);
      return newSearchParams.toString();
    },
  });

  const [, updateColumns] = useUrlState<Array<keyof TData>, Array<keyof TData>>(
    {
      key: "columns",
      value: visibleColumns,
      decode: (value) => value,
    },
  );

  if (!column.sortable) {
    return <div className={cn(className)}>{caption}</div>;
  }

  const isDesc =
    optimisticSort.field === column.field &&
    optimisticSort.direction === "desc";

  const isAsc =
    optimisticSort.field === column.field && optimisticSort.direction === "asc";

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{caption}</span>
            {isDesc ? (
              <ArrowDown className="ml-2 size-4 text-foreground" />
            ) : isAsc ? (
              <ArrowUp className="ml-2 size-4 text-foreground" />
            ) : (
              <ChevronsUpDown className="ml-2 size-4 text-muted-foreground/50" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() =>
              updateSort({
                field: column.field,
                direction: "asc",
              })
            }
          >
            <ArrowUpIcon className="mr-2 size-3.5 text-muted-foreground/70" />
            Sort Ascending
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              updateSort({
                field: column.field,
                direction: "desc",
              })
            }
          >
            <ArrowDownIcon className="mr-2 size-3.5 text-muted-foreground/70" />
            Sort Descending
          </DropdownMenuItem>

          {column.hideable && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  updateColumns(
                    visibleColumns.filter((c) => c !== column.field),
                  );
                }}
              >
                <EyeOff className="mr-2 size-3.5 text-muted-foreground/70" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

"use client";

import { Loader2, Settings2, Undo2 } from "lucide-react";
import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { type ColumnDef } from "@/(demo)/tasks/schema";
import { useUrlState } from "@/_hooks/use-url-state";

export default function TableViewOptions<TData>({
  visibleColumns,
  columnDefs,
}: {
  visibleColumns: string[];
  columnDefs: Omit<ColumnDef<TData>, "renderer">[];
}) {
  const [optimisticValue, updateValue, isPending] = useUrlState<
    string[],
    string[]
  >({
    key: "columns",
    value: visibleColumns,
    decode: (value) => value,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Settings2 className="mr-2 size-4" />
          )}
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columnDefs
          .filter((column) => column.hideable !== false)
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.field}
                className="capitalize"
                checked={visibleColumns.includes(column.field)}
                onCheckedChange={(value) => {
                  updateValue(
                    value
                      ? [...optimisticValue, column.field]
                      : optimisticValue.filter(
                          (field) => field !== column.field,
                        ),
                  );
                }}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            );
          })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-muted-foreground"
          onClick={() => updateValue([])}
        >
          <Undo2 className="size-4" />
          Reset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import {
  Pagination,
  PaginationButton,
  PaginationButtonNext,
  PaginationButtonPrevious,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/_components/ui/pagination";
import usePagination, { ELLIPSIS } from "@/_hooks/use-pagination";
import { useUrlState } from "@/_hooks/use-url-state";
import PageSizeSelect from "./page-size-select";
import { Button } from "~/app/_components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TablePagination({
  totalPages,
  currentPage,
  pageSize,
}: {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  currentItems: number;
  pageSize: number;
}) {
  const [optimitiscValue, updateValue] = useUrlState<number, number>({
    key: "page",
    value: currentPage,
    decode: (v) => v,
  });

  const actualPage = optimitiscValue + 1;

  const { range, hasNext, hasPrevious } = usePagination({
    currentPage: actualPage,
    totalPages,
  });

  return (
    <div className="flex items-center justify-between gap-4 md:gap-6 lg:gap-8">
      <div className="flex shrink-0 items-center gap-2">
        <p className="shrink-0 text-sm font-medium">Rows per page</p>
        <PageSizeSelect pageSize={pageSize} />
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <Button size="icon" variant="ghost" className="size-8">
          <ChevronLeft className="size-4" />
        </Button>
        <Select
          value={`${actualPage}`}
          onValueChange={(value) => {
            updateValue(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-20">
            <SelectValue placeholder={actualPage} />
          </SelectTrigger>
          <SelectContent side="top">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
              (p) => (
                <SelectItem key={p} value={`${p}`}>
                  {p} / {totalPages}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        <Button size="icon" variant="ghost" className="size-8">
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <Pagination className="mx-0 hidden w-auto md:flex">
        <PaginationContent>
          <PaginationItem>
            <PaginationButtonPrevious
              disabled={!hasPrevious}
              onClick={() => updateValue(optimitiscValue - 1)}
            />
          </PaginationItem>
          {range.map((page, index) => (
            <PaginationItem key={index} className="hidden md:list-item">
              {page === ELLIPSIS ? (
                <PaginationEllipsis />
              ) : (
                <PaginationButton
                  isCurrent={page === actualPage}
                  onClick={() => updateValue(page - 1)}
                >
                  {page}
                </PaginationButton>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationButtonNext
              disabled={!hasNext}
              onClick={() => updateValue(optimitiscValue + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

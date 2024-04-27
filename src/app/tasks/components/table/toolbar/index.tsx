import { Plus } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { type QueryParams } from "../../../schema";
import { TaskDialog, TaskDialogContent } from "../../task-dialog";
import TaskMutationProvider from "../../task-mutation-context";
import CategoryFilter from "./category-filter";
import FilterReset from "./filter-reset";
import PriorityFilter from "./priority-filter";
import SearchField from "./search-field";
import StatusFilter from "./status-filter";
import TableViewOptions from "./table-view-options";
import { columnDefs, sorters } from "../columns";
import { DialogTrigger } from "~/app/_components/ui/dialog";
import TableSorter from "./table-sorter";

export default async function TableToolbar({
  queryParams,
}: {
  queryParams: QueryParams;
}) {
  const isFiltered =
    !!queryParams.search ||
    queryParams.status.length > 0 ||
    queryParams.priority.length > 0 ||
    queryParams.category.length > 0;

  return (
    <div className="flex flex-col-reverse justify-between gap-4 md:flex-row md:items-center">
      <div className="flex grow flex-col items-stretch gap-2 md:flex-1 md:flex-row md:items-center">
        <SearchField value={queryParams.search} />
        <div className="grid grid-cols-2 gap-2 md:flex md:justify-start">
          <StatusFilter queryParams={queryParams} />
          <PriorityFilter queryParams={queryParams} />
          <CategoryFilter queryParams={queryParams} />
          {isFiltered && <FilterReset />}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 md:justify-start">
        <TableViewOptions
          columnDefs={columnDefs.map(({ renderer: _, ...item }) => item)}
          visibleColumns={queryParams.columns}
        />
        <TableSorter
          sort={queryParams.sort}
          sorters={sorters}
          className="md:hidden"
        />
        <TaskMutationProvider>
          <TaskDialog>
            <DialogTrigger asChild>
              <Button className="h-8 gap-2">
                <Plus className="size-4" />
                New Task
              </Button>
            </DialogTrigger>
            <TaskDialogContent />
          </TaskDialog>
        </TaskMutationProvider>
      </div>
    </div>
  );
}

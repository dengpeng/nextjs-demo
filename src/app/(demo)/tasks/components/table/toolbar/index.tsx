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
import DateRangeFilter from "./date-range-filter";

export default async function TableToolbar({
  queryParams,
}: {
  queryParams: QueryParams;
}) {
  const isFiltered =
    !!queryParams.search ||
    queryParams.status.length > 0 ||
    queryParams.priority.length > 0 ||
    queryParams.category.length > 0 ||
    !!queryParams.createdAt?.from ||
    !!queryParams.createdAt?.to;

  return (
    <div className="grid grid-flow-row-dense gap-4 lg:grid-cols-2">
      <SearchField value={queryParams.search} />
      <div className="grid grid-cols-2 gap-2 lg:col-span-2 lg:col-start-1 lg:flex lg:justify-start">
        <StatusFilter queryParams={queryParams} />
        <PriorityFilter queryParams={queryParams} />
        <CategoryFilter queryParams={queryParams} />
        <DateRangeFilter
          parameter="createdAt"
          value={queryParams.createdAt}
          title="Created At"
        />
        {isFiltered && <FilterReset className="col-span-2 lg:col-span-1" />}
      </div>
      <div className="row-start-1 flex items-center justify-between gap-2 lg:row-auto lg:justify-start lg:place-self-end">
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
      {/* <div className="flex grow flex-col items-stretch gap-2 md:flex-1 md:flex-row md:items-center">
        <SearchField value={queryParams.search} />        
      </div>
      <div className="grid grid-cols-2 gap-2 md:flex md:justify-start">
          
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
      </div> */}
    </div>
  );
}

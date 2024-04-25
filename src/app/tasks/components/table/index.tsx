import { and, inArray, like, count, asc, desc } from "drizzle-orm";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/app/_components/ui/table";
import { cn } from "~/app/_utils/style";
import { db } from "~/server/db";
import { type QueryParams, tasks } from "../../schema";
import TablePagination from "./footer/table-pagination";
import TableToolbar from "./toolbar";
import { columnDefs } from "./columns";
import TableColumnHeader from "./table-column-header";
import TableRowAction from "./table-row-action";

export async function TaskTable({ queryParams }: { queryParams: QueryParams }) {
  const { page, pageSize, search, status, category, priority, columns, sort } =
    queryParams;

  const whereConditions = and(
    status.length > 0 ? inArray(tasks.status, status) : undefined,
    priority.length > 0 ? inArray(tasks.priority, priority) : undefined,
    category.length > 0 ? inArray(tasks.category, category) : undefined,
    !!search ? like(tasks.title, `%${search}%`) : undefined,
  );

  const totalItems = await db
    .select({ count: count(tasks.id) })
    .from(tasks)
    .where(whereConditions)
    .then((result) => result[0]?.count ?? 0);

  const totalPages = Math.ceil(totalItems / pageSize);
  const actualPage = Math.min(page, totalPages - 1);

  const taskData = await db
    .select()
    .from(tasks)
    .where(whereConditions)
    .orderBy(
      sort.direction === "asc"
        ? asc(tasks[sort.field])
        : desc(tasks[sort.field]),
    )
    .limit(pageSize)
    .offset(actualPage * pageSize);

  return (
    <div className="space-y-4">
      <TableToolbar queryParams={queryParams} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hidden md:table-row">
              {columnDefs.map((columnDef) => {
                const isVisible =
                  columns.includes(columnDef.field) || !columnDef.hideable;

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { renderer, ...columnDefSlim } = columnDef;

                return isVisible ? (
                  <TableHead key={columnDef.field} className="text-xs">
                    <TableColumnHeader
                      column={columnDefSlim}
                      sort={sort}
                      visibleColumns={columns}
                    />
                  </TableHead>
                ) : null;
              })}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskData.length > 0 &&
              taskData.map((task) => (
                <TableRow key={task.id}>
                  {columnDefs.map((columnDef) => {
                    const isVisible =
                      columns.includes(columnDef.field) || !columnDef.hideable;

                    return isVisible ? (
                      <TableCell
                        key={`${task.id}-${columnDef.field}`}
                        className={cn(
                          columnDef.field === "title"
                            ? ""
                            : "hidden md:table-cell",
                        )}
                      >
                        {columnDef.renderer(task, columnDef.field)}
                      </TableCell>
                    ) : null;
                  })}
                  <TableCell>
                    <TableRowAction task={task} />
                  </TableCell>
                </TableRow>
              ))}
            {taskData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-muted-foreground"
                >
                  No tasks found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentItems={taskData.length}
        totalItems={totalItems}
        currentPage={actualPage}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </div>
  );
}

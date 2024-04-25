import { and, count, inArray, like } from "drizzle-orm";
import { db } from "~/server/db";
import { taskStatus, tasks } from "../../../schema";
import { labelize } from "../../../../_utils/text";
import ListFilter from "./list-filter";
import { type QueryParams } from "../../../schema";

export default async function StatusFilter({
  queryParams: { status, category, priority, search },
}: {
  queryParams: QueryParams;
}) {
  const statsByStatus = await db
    .select({
      count: count(tasks.id),
      status: tasks.status,
    })
    .from(tasks)
    .where(
      and(
        category.length > 0 ? inArray(tasks.category, category) : undefined,
        priority.length > 0 ? inArray(tasks.priority, priority) : undefined,
        !!search ? like(tasks.title, `%${search}%`) : undefined,
      ),
    )
    .groupBy(tasks.status);

  const options = taskStatus.map((status) => ({
    label: labelize(status),
    value: status,
    stats: statsByStatus.find((stats) => stats.status === status)?.count ?? 0,
    // icon:
    //   status === "todo"
    //     ? CircleDotDashed
    //     : status === "done"
    //       ? CheckCircle2
    //       : Clock,
  }));

  return (
    <ListFilter
      parameter="status"
      title="Status"
      options={options}
      value={status}
    />
  );
}

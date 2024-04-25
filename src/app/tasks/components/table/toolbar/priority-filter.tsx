import { and, count, inArray, like } from "drizzle-orm";
import { db } from "~/server/db";
import { taskPriority, tasks } from "../../../schema";
import { labelize } from "../../../../_utils/text";
import ListFilter from "./list-filter";
import { type QueryParams } from "../../../schema";

export default async function PriorityFilter({
  queryParams: { status, category, priority, search },
}: {
  queryParams: QueryParams;
}) {
  const statsByPriority = await db
    .select({
      count: count(tasks.id),
      priority: tasks.priority,
    })
    .from(tasks)
    .where(
      and(
        category.length > 0 ? inArray(tasks.category, category) : undefined,
        status.length > 0 ? inArray(tasks.status, status) : undefined,
        !!search ? like(tasks.title, `%${search}%`) : undefined,
      ),
    )
    .groupBy(tasks.priority);

  const options = taskPriority.map((priority) => ({
    label: labelize(priority),
    value: priority,
    stats:
      statsByPriority.find((stats) => stats.priority === priority)?.count ?? 0,
  }));

  return (
    <ListFilter
      parameter="priority"
      title="Priority"
      options={options}
      value={priority}
    />
  );
}

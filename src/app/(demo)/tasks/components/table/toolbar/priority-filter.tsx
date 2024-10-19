import { count } from "drizzle-orm";
import { db } from "~/server/db";
import { labelize } from "@/_utils/text";
import {
  buildWhereConditions,
  taskPriority,
  tasks,
  type QueryParams,
} from "../../../schema";
import ListFilter from "./list-filter";

export default async function PriorityFilter({
  queryParams,
}: {
  queryParams: QueryParams;
}) {
  const statsByPriority = await db
    .select({
      count: count(tasks.id),
      priority: tasks.priority,
    })
    .from(tasks)
    .where(buildWhereConditions(queryParams, ["priority"]))
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
      value={queryParams.priority}
    />
  );
}

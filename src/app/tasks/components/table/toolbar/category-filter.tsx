import { and, inArray, count, like } from "drizzle-orm";
import { db } from "~/server/db";
import { taskCategory, tasks } from "../../../schema";
import { labelize } from "../../../../_utils/text";
import ListFilter from "./list-filter";
import { type QueryParams } from "../../../schema";

export default async function CategoryFilter({
  queryParams: { status, category, priority, search },
}: {
  queryParams: QueryParams;
}) {
  const statsByCategory = await db
    .select({
      count: count(tasks.id),
      category: tasks.category,
    })
    .from(tasks)
    .where(
      and(
        status.length > 0 ? inArray(tasks.status, status) : undefined,
        priority.length > 0 ? inArray(tasks.priority, priority) : undefined,
        !!search ? like(tasks.title, `%${search}%`) : undefined,
      ),
    )
    .groupBy(tasks.category);

  const options = taskCategory.map((category) => ({
    label: labelize(category),
    value: category,
    stats:
      statsByCategory.find((stats) => stats.category === category)?.count ?? 0,
  }));

  return (
    <ListFilter
      parameter="category"
      title="Category"
      options={options}
      value={category}
    />
  );
}

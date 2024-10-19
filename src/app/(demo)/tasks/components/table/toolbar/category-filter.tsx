import { count } from "drizzle-orm";
import { db } from "~/server/db";
import { labelize } from "@/_utils/text";
import {
  buildWhereConditions,
  taskCategory,
  tasks,
  type QueryParams,
} from "../../../schema";
import ListFilter from "./list-filter";

export default async function CategoryFilter({
  queryParams,
}: {
  queryParams: QueryParams;
}) {
  const statsByCategory = await db
    .select({
      count: count(tasks.id),
      category: tasks.category,
    })
    .from(tasks)
    .where(buildWhereConditions(queryParams, ["category"]))
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
      value={queryParams.category}
    />
  );
}

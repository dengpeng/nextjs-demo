import { count } from "drizzle-orm";
import { db } from "~/server/db";
import { labelize } from "../../../../_utils/text";
import {
  buildWhereConditions,
  taskStatus,
  tasks,
  type QueryParams,
} from "../../../schema";
import ListFilter from "./list-filter";

export default async function StatusFilter({
  queryParams,
}: {
  queryParams: QueryParams;
}) {
  const statsByStatus = await db
    .select({
      count: count(tasks.id),
      status: tasks.status,
    })
    .from(tasks)
    .where(buildWhereConditions(queryParams, ["status"]))
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
      value={queryParams.status}
    />
  );
}

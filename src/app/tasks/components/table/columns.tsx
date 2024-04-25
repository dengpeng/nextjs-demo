import { formatDistanceToNow } from "date-fns";
import { labelize } from "~/app/_utils/text";
import { type SelectedTask } from "../../schema";
import PriorityIcon from "../priority-icon";
import StatusIcon from "../status-icon";
import { Badge } from "~/app/_components/ui/badge";
import { type ColumnDef } from "../../schema";

export const columnDefs: ColumnDef<SelectedTask>[] = [
  {
    field: "id",
    label: "ID",
    sortable: true,
    hideable: false,
    renderer: (record) => (
      <span className="text-muted-foreground">TASK-{record.id}</span>
    ),
  },
  {
    field: "title",
    label: "Title",
    sortable: true,
    hideable: true,
    renderer: (record) => (
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground md:hidden">
            TASK-{record.id}
          </span>
          <Badge variant="outline" className="rounded capitalize">
            {record.category}
          </Badge>
        </div>
        <span className="text-base font-medium md:text-sm">{record.title}</span>
        <div className="flex w-full items-center justify-between gap-4 md:hidden">
          <div className="flex items-center gap-2">
            <StatusIcon status={record.status} />
            <span className="text-muted-foreground">
              {labelize(record.status)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PriorityIcon priority={record.priority} />
            <span className="text-muted-foreground">
              {labelize(record.priority)}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    field: "status",
    label: "Status",
    sortable: true,
    hideable: true,
    renderer: (record) => (
      <div className="flex items-center gap-2">
        <StatusIcon status={record.status} />
        <span className="hidden text-muted-foreground md:inline">
          {labelize(record.status)}
        </span>
      </div>
    ),
  },
  {
    field: "priority",
    label: "Priority",
    sortable: true,
    hideable: true,
    renderer: (record) => (
      <div className="flex items-center gap-2">
        <PriorityIcon priority={record.priority} />
        <span className="hidden text-muted-foreground md:inline">
          {labelize(record.priority)}
        </span>
      </div>
    ),
  },
  {
    field: "createdAt",
    label: "Created At",
    sortable: true,
    hideable: true,
    renderer: (record) => (
      <span className="text-muted-foreground">
        {formatDistanceToNow(record.createdAt, { addSuffix: true })}
      </span>
    ),
  },
  {
    field: "updatedAt",
    label: "Updated At",
    sortable: true,
    hideable: true,
    renderer: (record) => (
      <span className="text-muted-foreground">
        {record.updatedAt
          ? formatDistanceToNow(record.updatedAt, { addSuffix: true })
          : "-"}
      </span>
    ),
  },
];

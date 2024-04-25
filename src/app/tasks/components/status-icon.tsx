import { CheckCircle2, CircleDashed, Clock } from "lucide-react";
import { type TaskStatus } from "../schema";

export default function StatusIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case "done":
      return <CheckCircle2 className="size-4 text-lime-500/75" />;
    case "in-progress":
      return <Clock className="size-4 text-sky-500/75" />;
    case "todo":
      return <CircleDashed className="size-4 text-orange-500/75" />;
    default:
      return <></>;
  }
}

import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";
import { type TaskPriority } from "../schema";

export default function PriorityIcon({ priority }: { priority: TaskPriority }) {
  switch (priority) {
    case "P0":
      return <ArrowUp className="size-5 text-red-500/75 md:size-4" />;
    case "P1":
      return <ArrowRight className="size-5 text-yellow-500/75 md:size-4" />;
    case "P2":
      return <ArrowDown className="size-5 text-slate-500/75 md:size-4" />;
    default:
      return <></>;
  }
}

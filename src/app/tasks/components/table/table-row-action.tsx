"use client";

import { Ellipsis, Loader2 } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/app/_components/ui/alert-dialog";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import { DialogTrigger } from "~/app/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { labelize } from "~/app/_utils/text";
import { deleteTask, duplicate, updateTask } from "../../actions";
import {
  taskCategory,
  taskPriority,
  taskStatus,
  type SelectedTask,
  type TaskCategory,
  type TaskPriority,
  type TaskStatus,
} from "../../schema";
import PriorityIcon from "../priority-icon";
import StatusIcon from "../status-icon";
import { TaskDialog, TaskDialogContent } from "../task-dialog";
import TaskMutationProvider from "../task-mutation-context";

export default function TableRowAction({ task }: { task: SelectedTask }) {
  const [isPending, startTransition] = useTransition();

  const [category, setCategory] = useOptimistic(task.category);
  const [status, setStatus] = useOptimistic(task.status);
  const [priority, setPriority] = useOptimistic(task.priority);

  return (
    <TaskMutationProvider key={task.id} task={task}>
      <TaskDialog>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Ellipsis className="size-4" />
                )}
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DialogTrigger asChild>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                onClick={() => {
                  startTransition(() => {
                    void duplicate(task);
                  });
                }}
              >
                Make a copy
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={status}
                    onValueChange={(value) => {
                      startTransition(() => {
                        setStatus(value as TaskStatus);
                        void updateTask({
                          id: task.id,
                          status: value as TaskStatus,
                        });
                      });
                    }}
                  >
                    {taskStatus.map((status) => (
                      <DropdownMenuRadioItem
                        key={status}
                        value={status}
                        className="gap-2"
                      >
                        <StatusIcon status={status} />
                        {labelize(status)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={priority}
                    onValueChange={(value) => {
                      startTransition(() => {
                        setPriority(value as TaskPriority);
                        void updateTask({
                          id: task.id,
                          priority: value as TaskPriority,
                        });
                      });
                    }}
                  >
                    {taskPriority.map((priority) => (
                      <DropdownMenuRadioItem
                        key={priority}
                        value={priority}
                        className="gap-2"
                      >
                        <PriorityIcon priority={priority} />
                        {labelize(priority)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={category}
                    onValueChange={(value) => {
                      startTransition(() => {
                        setCategory(value as TaskCategory);
                        void updateTask({
                          id: task.id,
                          category: value as TaskCategory,
                        });
                      });
                    }}
                  >
                    {taskCategory.map((category) => (
                      <DropdownMenuRadioItem key={category} value={category}>
                        {labelize(category)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem className="text-destructive" asChild>
        </DropdownMenuItem> */}
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sure to delete this task?</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="grid grid-cols-3 gap-4 p-2">
              <div className="col-span-3">{task.title}</div>
              <div className="">
                <Badge variant="secondary">{labelize(task.category)}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={task.status} /> {labelize(task.status)}
              </div>
              <div className="flex items-center gap-2">
                <PriorityIcon priority={task.priority} />{" "}
                {labelize(task.priority)}
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  startTransition(() => {
                    void deleteTask({ id: task.id });
                  });
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <TaskDialogContent />
      </TaskDialog>
    </TaskMutationProvider>
  );
}

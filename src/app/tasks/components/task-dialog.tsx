"use client";

import { Dialog } from "~/app/_components/ui/dialog";

import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "~/app/_components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { labelize } from "~/app/_utils/text";
import { type FormState } from "../actions";
import {
  taskCategory,
  taskPriority,
  taskStatus,
  type TaskCategory,
  type TaskField,
  type TaskPriority,
  type TaskStatus,
} from "../schema";
import PriorityIcon from "./priority-icon";
import StatusIcon from "./status-icon";
import { useTaskMutation } from "./task-mutation-context";
import { DialogClose } from "@radix-ui/react-dialog";

export function TaskDialog({ children }: { children: React.ReactNode }) {
  const { formState, reset } = useTaskMutation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (formState.status === "success") {
      setOpen(false);
    }
  }, [formState, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        if (!open) {
          reset();
        }
        setOpen(open);
      }}
    >
      {children}
    </Dialog>
  );
}

export function TaskDialogContent() {
  const { formErrors, formAction, payload, setPayload } = useTaskMutation();

  return (
    <DialogContent className="w-full max-w-2xl">
      <DialogHeader>
        <DialogTitle>{payload.id ? "Edit Task" : "Create Task"}</DialogTitle>
      </DialogHeader>
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {payload.id && (
            <div className="md:col-span-3">
              <input type="hidden" name="id" value={payload.id} />
              <div className="text-sm text-muted-foreground">
                TASK-{payload.id}
              </div>
            </div>
          )}
          <div className="space-y-1 md:col-span-3">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={payload.title}
              onChange={(e) =>
                setPayload((data) => ({ ...data, title: e.target.value }))
              }
            />
            <Message errors={formErrors} field="title" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <Select
              name="category"
              value={payload.category}
              onValueChange={(value) =>
                setPayload((data) => ({
                  ...data,
                  category: value as TaskCategory,
                }))
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                {taskCategory.map((category) => (
                  <SelectItem value={category} key={category}>
                    {labelize(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Message errors={formErrors} field="category" />
          </div>
          <div className="space-y-1 ">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={payload.status}
              onValueChange={(value) =>
                setPayload((data) => ({
                  ...data,
                  status: value as TaskStatus,
                }))
              }
            >
              <SelectTrigger id="status">
                <SelectValue asChild>
                  {payload.status ? (
                    <div className="flex items-center gap-2">
                      <StatusIcon status={payload.status} />
                      {labelize(payload.status)}
                    </div>
                  ) : (
                    <div>Please select</div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {taskStatus.map((status) => (
                  <SelectItem value={status} key={status}>
                    <span className="inline-flex items-center gap-2">
                      <StatusIcon status={status} />
                      {labelize(status)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Message errors={formErrors} field="status" />
          </div>
          <div className="space-y-1 ">
            <Label htmlFor="priority">Priority</Label>
            <Select
              name="priority"
              value={payload.priority}
              onValueChange={(value) =>
                setPayload((data) => ({
                  ...data,
                  priority: value as TaskPriority,
                }))
              }
            >
              <SelectTrigger id="priority">
                <SelectValue asChild>
                  {payload.priority ? (
                    <div className="inline-flex items-center gap-2">
                      <PriorityIcon priority={payload.priority} />
                      {labelize(payload.priority)}
                    </div>
                  ) : (
                    <div>Please select</div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {taskPriority.map((priority) => (
                  <SelectItem value={priority} key={priority}>
                    <span className="inline-flex items-center gap-2">
                      <PriorityIcon priority={priority} />
                      {labelize(priority)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Message errors={formErrors} field="priority" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <FormSubmitButon />
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function Message({
  errors,
  field,
}: {
  errors: FormState["errors"];
  field: TaskField;
}) {
  const error = errors?.[field] ?? [];

  if (error.length > 0) {
    return <p className="text-sm text-destructive">{error[0]}</p>;
  } else {
    return null;
  }
}

function FormSubmitButon() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Check className="size-4" />
      )}
      Confirm
    </Button>
  );
}

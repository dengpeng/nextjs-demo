"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import {
  type TaskPriority,
  type TaskStatus,
  tasks,
  type SelectedTask,
  type TaskCategory,
  type TaskField,
  insertTaskSchema,
} from "./schema";

export async function updateTask({
  id,
  title,
  category,
  priority,
  status,
}: {
  id: number;
  title?: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  status?: TaskStatus;
}) {
  await db
    .update(tasks)
    .set({ title, category, priority, status })
    .where(eq(tasks.id, id));
  revalidatePath("/tasks");
}

export async function deleteTask({ id }: { id: number }) {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/tasks");
}

export async function duplicate(task: SelectedTask) {
  await db.insert(tasks).values({
    title: task.title,
    category: task.category,
    priority: task.priority,
    status: task.status,
  });
  revalidatePath("/tasks");
}

export type FormState = {
  status: "success" | "pending" | "error";
  message: string | null;
  timestamp?: number;
  errors?: Partial<Record<TaskField, string[] | undefined>>;
};

export async function taskMutation(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = insertTaskSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    console.log({ error: parsed.error });
    return {
      status: "error",
      timestamp: Date.now(),
      message: parsed.error.issues[0]?.message ?? "An error occurred",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.id !== undefined) {
    await db.update(tasks).set(parsed.data).where(eq(tasks.id, parsed.data.id));
  } else {
    await db.insert(tasks).values(parsed.data);
  }

  revalidatePath("/tasks");

  return {
    status: "success",
    timestamp: Date.now(),
    message: parsed.data.id ? "Task updated" : "Task created",
  };
}

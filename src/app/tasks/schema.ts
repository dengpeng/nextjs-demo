import { index, int, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { createTable } from "~/server/db/helpers";

export const taskCategory = [
  "document",
  "feature",
  "bugfix",
  "refactory",
] as const;
export type TaskCategory = (typeof taskCategory)[number];

export const taskStatus = ["todo", "in-progress", "done"] as const;
export type TaskStatus = (typeof taskStatus)[number];

export const taskPriority = ["P0", "P1", "P2"] as const;
export type TaskPriority = (typeof taskPriority)[number];

export const tasks = createTable(
  "tasks",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }).notNull(),
    status: text("status", { enum: taskStatus }).notNull(),
    category: text("category", { enum: taskCategory }).notNull(),
    priority: text("priority", { enum: taskPriority }).notNull(),
    createdAt: int("created_at", { mode: "timestamp_ms" })
      .$default(() => new Date())
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp_ms" }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    titleIndex: index("score_idx").on(table.title),
    categoryIndex: index("subject_idx").on(table.category),
    statusIndex: index("status_idx").on(table.status),
    priorityIndex: index("priority_idx").on(table.priority),
  }),
);

export const selectTaskSchema = createSelectSchema(tasks);
export const insertTaskSchema = createInsertSchema(tasks, {
  id: z.coerce.number().optional(),
  title: (schema) => schema.title.min(1, "Title cannot be empty"),
  category: (schema) => schema.category,
});
export const taskFieldSchema = selectTaskSchema.keyof();

export type SelectedTask = z.infer<typeof selectTaskSchema>;
export type InsertedTask = z.infer<typeof insertTaskSchema>;
export type TaskField = z.infer<typeof taskFieldSchema>;

// ----

const defaultColumns: TaskField[] = ["id", "title", "status", "priority"];

export const queryParamSchema = z.object({
  page: z.coerce.number().nonnegative().optional().default(0).catch(0),
  pageSize: z.coerce.number().positive().optional().default(10).catch(10),
  search: z.string().optional().default("").catch(""),
  status: z
    .union([z.enum(taskStatus), z.array(z.enum(taskStatus))])
    .optional()
    .default([])
    .catch([])
    .transform((val) => (Array.isArray(val) ? val : [val])),
  category: z
    .union([z.enum(taskCategory), z.array(z.enum(taskCategory))])
    .optional()
    .default([])
    .catch([])
    .transform((val) => (Array.isArray(val) ? val : [val])),
  priority: z
    .union([z.enum(taskPriority), z.array(z.enum(taskPriority))])
    .optional()
    .default([])
    .catch([])
    .transform((val) => (Array.isArray(val) ? val : [val])),
  columns: z
    .union([taskFieldSchema, z.array(taskFieldSchema)])
    .optional()
    .default([...defaultColumns])
    .catch([...defaultColumns])
    .transform((val) => (Array.isArray(val) ? val : [val])),
  sort: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const [field, direction] = val.split(":");
        return { field, direction };
      }
      return undefined;
    },
    z
      .object({
        field: taskFieldSchema,
        direction: z.enum(["asc", "desc"]),
      })
      .optional()
      .default({ field: "createdAt", direction: "desc" })
      .catch({ field: "createdAt", direction: "desc" }),
  ),
});

export type QueryParams = z.infer<typeof queryParamSchema>;

export type ColumnDef<TData> = {
  field: string & keyof TData;
  label: string;
  sortable: boolean;
  hideable: boolean;
  renderer: (record: TData, field: string & keyof TData) => JSX.Element;
};

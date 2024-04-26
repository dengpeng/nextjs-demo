import type { NextRequest } from "next/server";
import { env } from "~/env";
import { faker } from "@faker-js/faker";
import {
  taskCategory,
  taskPriority,
  taskStatus,
  tasks,
} from "~/app/tasks/schema";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  await initDb();

  return Response.json({ success: true });
}

async function initDb() {
  faker.seed(123);

  await db.transaction(async (tx) => {
    await tx.delete(tasks);

    await tx.insert(tasks).values(
      Array.from({ length: 50 }, () => {
        const timestamp = faker.date.recent({ days: 60 });

        return {
          category: faker.helpers.arrayElement(taskCategory),
          status: faker.helpers.arrayElement(taskStatus),
          priority: faker.helpers.arrayElement(taskPriority),
          title: faker.hacker.phrase(),
          createdAt: timestamp,
          updatedAt: timestamp,
        };
      }),
    );
  });
}

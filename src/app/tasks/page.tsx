import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { GlobalUrlStateProvider } from "../_hooks/global-url-state";
import GlobalLoader from "./components/global-loader";
import { TaskTable } from "./components/table";
import { queryParamSchema } from "./schema";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Next.js Demo - Tasks",
  description:
    "A simple CRUD demo with React server components and optimitisc updates",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    page?: number;
    pageSize?: number;
    search?: string;
    columns?: string[];
    status?: string | string[];
    category?: string | string[];
    priority?: string | string[];
  };
}) {
  const queryParams = queryParamSchema.parse(searchParams);

  return (
    <GlobalUrlStateProvider>
      <main className="flex min-h-screen flex-col items-center justify-start p-0 md:p-4">
        <Card className="relative w-full max-w-7xl border-none shadow-none">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>{metadata.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex justify-center py-12">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              }
            >
              <TaskTable queryParams={queryParams} />
            </Suspense>
          </CardContent>
          <GlobalLoader className="absolute right-8 top-8" />
        </Card>
      </main>
    </GlobalUrlStateProvider>
  );
}

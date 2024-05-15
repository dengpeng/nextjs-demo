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
import { type Metadata } from "next";

const title =
  "Tasks - A Next.js Demo using RSC, server actions and optimistic updates";
const description =
  'A simple task manager application that demostrate the usage of server components, server actions and optimistic updates. The UI is based on the "task" exmaple from shadcn UI.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/og-tasks.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@_pdeng",
    images: [
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/og-tasks.png`,
    ],
  },
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
            <CardDescription className="max-w-3xl">
              {metadata.description}
            </CardDescription>
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

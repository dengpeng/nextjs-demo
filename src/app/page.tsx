import Link from "next/link";
import { Button } from "./_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./_components/ui/card";
import { GitHub } from "./_components/icons/github";
import Image from "next/image";
import tasksScreenshot from "./_assets/tasks.png";

const patterns = [
  {
    title: "Tasks",
    description:
      "A simple task manager application that demostrate the usage of server components, server actions and optimistic updates. The UI is based on the “task” example from shadcn UI.",
    demoLink: "/tasks",
    // writeupLink: "/tasks/writeup",
    screenshot: (
      <Image
        src={tasksScreenshot}
        alt="Tasks screenshot"
        objectFit="fill"
        fill
      />
    ),
  },
  {
    title: "Telegram Mini App",
    description:
      "Demo the usage of Next.js together with the Ton & TonConnect UI SDK to build a Telegram mini app. It also demonstrates how to accept and process crypto payments using the TON network",
    demoLink: "",
    // writeupLink: "/telegram-mini-app/writeup",
    screenshot: (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p className="font-bold text-muted-foreground">Coming soon...</p>
      </div>
    ),
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-12 md:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Next.js Patterns</h1>
      <p className="mt-4 text-balance text-center text-lg text-muted-foreground">
        A (working-in-progress) collection of demos and examples of common
        patterns & best practices used in the development of Next.js & React
        applications.
      </p>

      <div className="mt-12 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {patterns.map((pattern) => (
          <PatternCard key={pattern.title} {...pattern} />
        ))}
      </div>

      <div className="mt-12">
        <Link href="https://github.com/dengpeng/nextjs-demo">
          <Button variant="link" className="gap-2">
            <GitHub className="size-4" />
            View on GitHub
          </Button>
        </Link>
      </div>
    </main>
  );
}

function PatternCard({
  title,
  description,
  demoLink,
  writeupLink,
  screenshot,
}: {
  title: string;
  description: string;
  demoLink: string;
  writeupLink?: string;
  screenshot?: React.ReactNode;
}) {
  return (
    <Card className="group flex flex-col items-stretch transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grow">
        {screenshot && (
          <div className="relative aspect-video overflow-clip rounded-md border">
            {screenshot}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/80 opacity-100 transition-opacity duration-500 group-hover:opacity-0"></div>
          </div>
        )}
        {!screenshot && <div className="aspect-video rounded-md border"></div>}
      </CardContent>
      <CardFooter className="gap-2">
        {!!demoLink ? (
          <Link href={demoLink} className="w-1/2 md:w-24">
            <Button className="w-full">Demo</Button>
          </Link>
        ) : (
          <Button className="w-1/2 md:w-24" disabled>
            Demo
          </Button>
        )}
        {writeupLink && (
          <Link href={writeupLink} className="w-1/2 md:w-24">
            <Button variant="outline" className="w-full">
              Writeup
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

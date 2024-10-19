import { Home } from "lucide-react";
import { Button } from "../_components/ui/button";
import Link from "next/link";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      <div className="absolute left-1/2 top-0 flex w-full max-w-7xl -translate-x-1/2 justify-end p-4 md:p-5">
        <Link href="/">
          <Button
            variant="outline"
            className="h-8 gap-2 text-xs md:h-10 md:text-sm"
          >
            <Home className="size-4" />
            Go Back
          </Button>
        </Link>
      </div>
    </>
  );
}

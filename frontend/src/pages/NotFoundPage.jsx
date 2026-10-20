import { Button } from "@heroui/react";
import { Link } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon } from "@hugeicons/core-free-icons";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const NotFoundPage = () => {
  useDocumentTitle("Page Not Found");
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl">404</h1>
        <h2 className="text-3xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="max-w-[600px] text-muted-foreground">
          We couldn't find the page you were looking for. The page might have
          been removed or the link might be broken.
        </p>
        <div className="flex justify-center gap-2">
          <Link to="/">
            <Button className="cursor-pointer">
              <HugeiconsIcon
                icon={Home01Icon}
                strokeWidth={2}
                className="size-4"
              />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

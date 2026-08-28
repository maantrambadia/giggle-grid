import { Button, Separator } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload04Icon, Fire02Icon } from "@hugeicons/core-free-icons";

const FeedHeader = ({
  onUpload,
  onTrending,
  isTrending = false,
  user,
  rightContent,
}) => {
  return (
    <header className="pt-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="hidden min-w-0 items-center gap-3 sm:flex">
          <img
            src="/images/gigglegrid-header-icon.png"
            alt="GiggleGrid"
            className="h-10 w-auto shrink-0 select-none"
            draggable={false}
          />
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Fresh memes
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Browse the grid. Login to upload, like, and comment.
            </p>
            {user ? (
              <p className="mt-0.5 text-sm text-muted/70">@{user.username}</p>
            ) : null}
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
          <Button
            className="flex-1 sm:flex-initial"
            color="success"
            onPress={onUpload}
          >
            <span className="flex w-full items-center justify-center gap-2">
              <HugeiconsIcon
                icon={Upload04Icon}
                strokeWidth={2}
                className="size-5"
              />
              <span>Upload</span>
            </span>
          </Button>
          <Button
            className="flex-1 sm:flex-initial"
            variant={isTrending ? "solid" : "tertiary"}
            color={isTrending ? "warning" : "default"}
            onPress={onTrending}
          >
            <span className="flex w-full items-center justify-center gap-2">
              <HugeiconsIcon
                icon={Fire02Icon}
                strokeWidth={2}
                className="size-5"
              />
              <span>Trending</span>
            </span>
          </Button>
          {rightContent}
        </div>
      </div>

      <Separator className="mt-6" />
    </header>
  );
};

export default FeedHeader;

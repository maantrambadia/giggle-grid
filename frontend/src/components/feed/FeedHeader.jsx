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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/images/gigglegrid-header-icon.png"
            alt="GiggleGrid"
            className="h-10 w-auto select-none"
            draggable={false}
          />
          <div>
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

        <div className="flex items-center gap-2">
          <Button color="success" onPress={onUpload}>
            <span className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Upload04Icon}
                strokeWidth={2}
                className="size-5"
              />
              <span>Upload</span>
            </span>
          </Button>
          <Button
            variant={isTrending ? "solid" : "flat"}
            color={isTrending ? "warning" : "default"}
            onPress={onTrending}
          >
            <span className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Fire02Icon}
                strokeWidth={2}
                className="size-5"
              />
              <span>Trending</span>
            </span>
          </Button>
          {rightContent ? <div className="ml-2">{rightContent}</div> : null}
        </div>
      </div>

      <Separator className="mt-6" />
    </header>
  );
};

export default FeedHeader;

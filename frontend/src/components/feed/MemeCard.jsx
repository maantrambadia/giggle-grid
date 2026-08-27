import { Card } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, Comment01Icon } from "@hugeicons/core-free-icons";

const MemeCard = ({ meme, onOpen }) => {
  const likes = meme.likeCount ?? meme.likes ?? 0;
  const comments = meme.commentCount ?? meme.comments ?? 0;

  return (
    <Card variant="secondary" className="h-full overflow-hidden">
      <div className="p-4">
        <button
          type="button"
          className="block w-full text-left"
          onClick={() => onOpen(meme)}
        >
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={meme.imageUrl}
              alt={meme.caption}
              className="h-64 w-full rounded-2xl object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/55 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/90 backdrop-blur">
                @{meme.author || meme.username || "user"}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <p className="mb-2 line-clamp-2 text-[15px] font-medium leading-snug">
              {meme.caption}
            </p>

            <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={FavouriteIcon}
                  strokeWidth={2}
                  className="size-5"
                />
                {likes}
              </div>
              <div className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={Comment01Icon}
                  strokeWidth={2}
                  className="size-5"
                />
                {comments}
              </div>
            </div>
          </div>
        </button>
      </div>
    </Card>
  );
};

export default MemeCard;

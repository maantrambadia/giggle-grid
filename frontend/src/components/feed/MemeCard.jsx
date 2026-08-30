import { useMemo } from "react";
import { Card, Button, Spinner } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, Comment01Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/hooks/auth";
import { toggleLike } from "@/services/memeService";

const MemeCard = ({ meme, onOpen }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const likes = meme.likeCount ?? 0;
  const comments = meme.commentCount ?? 0;

  const isLiked = useMemo(() => !!meme.hasUserLiked, [meme.hasUserLiked]);

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(meme.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["memes"] });
      await queryClient.cancelQueries({ queryKey: ["meme", meme.id] });

      const previousMemes = queryClient.getQueryData(["memes"]);
      const previousMeme = queryClient.getQueryData(["meme", meme.id]);

      const liked = isLiked;
      const updater = (m) => {
        if (!m || m.id !== meme.id) return m;
        return {
          ...m,
          hasUserLiked: !liked,
          likeCount: (m.likeCount ?? 0) + (liked ? -1 : 1),
        };
      };

      queryClient.setQueryData(["memes"], (old) =>
        Array.isArray(old) ? old.map(updater) : old,
      );
      queryClient.setQueryData(["meme", meme.id], (old) => updater(old));

      return { previousMemes, previousMeme };
    },
    onError: (err, variables, context) => {
      if (context?.previousMemes !== undefined) {
        queryClient.setQueryData(["memes"], context.previousMemes);
      }
      if (context?.previousMeme !== undefined) {
        queryClient.setQueryData(["meme", meme.id], context.previousMeme);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      queryClient.invalidateQueries({ queryKey: ["meme", meme.id] });
    },
  });

  const handleOpen = () => onOpen(meme);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!user || likeMutation.isPending) return;
    likeMutation.mutate();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <Card variant="secondary" className="h-full overflow-hidden">
      <div className="p-2">
        <div
          className="cursor-pointer text-left"
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={meme.imageUrl}
              alt={meme.caption}
              className="h-64 w-full rounded-2xl object-cover"
              loading="lazy"
              draggable={false}
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

            <div className="mt-4 flex items-center gap-6 text-sm">
              <Button
                size="sm"
                variant="ghost"
                color={isLiked ? "danger" : "default"}
                isDisabled={!user}
                isPending={likeMutation.isPending}
                onClick={handleLike}
              >
                {({ isPending }) => (
                  <span className="flex items-center gap-2">
                    {isPending ? (
                      <Spinner color="current" size="sm" />
                    ) : (
                      <HugeiconsIcon
                        icon={FavouriteIcon}
                        strokeWidth={2}
                        className={
                          isLiked
                            ? "size-5 text-danger fill-current"
                            : "size-5 text-muted-foreground"
                        }
                      />
                    )}
                    <span
                      className={
                        isLiked ? "text-danger" : "text-muted-foreground"
                      }
                    >
                      {likes}
                    </span>
                  </span>
                )}
              </Button>

              <Button size="sm" variant="ghost" isDisabled>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <HugeiconsIcon
                    icon={Comment01Icon}
                    strokeWidth={2}
                    className="size-5"
                  />
                  <span>{comments}</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MemeCard;

import { useMemo, useState } from "react";
import {
  Button,
  Modal,
  Skeleton,
  TextField,
  Label,
  InputGroup,
  Separator,
  ScrollShadow,
} from "@heroui/react";
import StateMessage from "@/components/ui/StateMessage";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download04Icon,
  Cancel01Icon,
  FavouriteIcon,
  Comment01Icon,
  TrashIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/hooks/auth";
import {
  addComment,
  deleteMeme,
  getMeme,
  toggleLike,
} from "@/services/memeService";

const MemeModal = ({ isOpen, onClose, meme }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const memeId = meme?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["meme", memeId],
    queryFn: () => getMeme(memeId),
    enabled: !!memeId && isOpen,
  });

  const full = data || meme;

  const hasLiked = useMemo(() => !!full?.hasUserLiked, [full?.hasUserLiked]);
  const likeCount = full?.likeCount ?? 0;
  const commentCount = full?.commentCount ?? 0;
  const comments = Array.isArray(full?.comments) ? full.comments : [];

  const imageUrl = full?.imageUrl;
  const caption = full?.caption;
  const author = full?.author || full?.username || "user";

  const isOwner = useMemo(() => {
    if (!user?.username) return false;
    return user.username === author;
  }, [user?.username, author]);

  const [commentText, setCommentText] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(memeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meme", memeId] });
      queryClient.invalidateQueries({ queryKey: ["memes"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: () => addComment(memeId, commentText.trim()),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["meme", memeId] });
      queryClient.invalidateQueries({ queryKey: ["memes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMeme(memeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      onClose();
    },
  });

  const canSubmitComment =
    commentText.trim().length > 0 && !commentMutation.isPending;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => (!open ? onClose() : null)}
      >
        {/* Modal expects a trigger child (pressable). Controlled open still needs one. */}
        <Button className="hidden" />
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Header>
                <div className="flex w-full items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">
                      @{author}
                    </div>
                    <div className="truncate text-lg font-semibold">
                      {caption}
                    </div>
                  </div>
                  <Button isIconOnly variant="ghost" onPress={onClose}>
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      strokeWidth={2}
                      className="size-5"
                    />
                  </Button>
                </div>
              </Modal.Header>

              <Modal.Body>
                <ScrollShadow hideScrollBar className="max-h-[60vh]">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-72 w-full rounded-2xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : isError ? (
                    <StateMessage
                      title="Can't open meme"
                      description="Failed to load meme details."
                      className="mt-0"
                    />
                  ) : (
                    <div className="space-y-4">
                      {imageUrl ? (
                        <div className="overflow-hidden rounded-2xl">
                          <img
                            src={imageUrl}
                            alt={caption}
                            className="w-full object-contain"
                          />
                        </div>
                      ) : null}

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          color={hasLiked ? "danger" : "default"}
                          isDisabled={!user || likeMutation.isPending}
                          onPress={() => likeMutation.mutate()}
                        >
                          <span className="flex items-center gap-2">
                            <HugeiconsIcon
                              icon={FavouriteIcon}
                              strokeWidth={2}
                              className={
                                hasLiked
                                  ? "size-5 text-danger fill-current"
                                  : "size-5"
                              }
                            />
                            <span className={hasLiked ? "text-danger" : ""}>
                              {likeCount}
                            </span>
                          </span>
                        </Button>

                        <Button size="sm" variant="ghost" isDisabled>
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <HugeiconsIcon
                              icon={Comment01Icon}
                              strokeWidth={2}
                              className="size-5"
                            />
                            <span>{commentCount}</span>
                          </span>
                        </Button>

                        {imageUrl ? (
                          <Button
                            size="sm"
                            color="primary"
                            as="a"
                            href={imageUrl}
                            download
                          >
                            <span className="flex items-center gap-2">
                              <HugeiconsIcon
                                icon={Download04Icon}
                                strokeWidth={2}
                                className="size-5"
                              />
                              <span>Download</span>
                            </span>
                          </Button>
                        ) : null}

                        {isOwner ? (
                          <Button
                            size="sm"
                            variant="danger-soft"
                            isPending={deleteMutation.isPending}
                            onPress={() => setShowDelete(true)}
                          >
                            <span className="flex items-center gap-2">
                              <HugeiconsIcon
                                icon={TrashIcon}
                                strokeWidth={2}
                                className="size-5"
                              />
                              <span>Delete</span>
                            </span>
                          </Button>
                        ) : null}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="text-sm font-semibold">Comments</div>

                        {comments.length === 0 ? (
                          <div className="text-sm text-muted-foreground">
                            No comments yet.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {comments.map((c) => (
                              <div
                                key={c.id}
                                className="rounded-xl border border-divider p-3"
                              >
                                <div className="text-xs text-muted-foreground">
                                  @{c.author}
                                </div>
                                <div className="mt-1 text-sm">{c.text}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        <TextField
                          name="comment"
                          onChange={setCommentText}
                          isDisabled={!user || commentMutation.isPending}
                          className="rounded-xl border-b"
                        >
                          <Label>Add comment</Label>
                          <InputGroup className="h-12 text-base">
                            <InputGroup.Input
                              className="w-full px-4 text-base"
                              placeholder={
                                user ? "Write a comment..." : "Login to comment"
                              }
                              value={commentText}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && canSubmitComment) {
                                  commentMutation.mutate();
                                }
                              }}
                            />
                          </InputGroup>
                        </TextField>

                        <Button
                          size="sm"
                          color="primary"
                          isDisabled={!canSubmitComment || !user}
                          isPending={commentMutation.isPending}
                          onPress={() => commentMutation.mutate()}
                        >
                          <span className="flex items-center gap-2">
                            <HugeiconsIcon
                              icon={SentIcon}
                              strokeWidth={2}
                              className="size-5"
                            />
                            <span>Post comment</span>
                          </span>
                        </Button>
                      </div>
                    </div>
                  )}
                </ScrollShadow>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  size="sm"
                  variant="tertiary"
                  color="default"
                  onPress={onClose}
                >
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      strokeWidth={2}
                      className="size-5"
                    />
                    <span>Close</span>
                  </span>
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <ConfirmDialog
        isOpen={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete meme?"
        description="This will permanently delete this meme and all its comments and likes. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        confirmIcon={TrashIcon}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export default MemeModal;

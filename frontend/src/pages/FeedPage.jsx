import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { listMemes } from "@/services/memeService";
import { useAuth } from "@/hooks/auth";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout03Icon,
  Alert02Icon,
  Image02Icon,
} from "@hugeicons/core-free-icons";
import useDocumentTitle from "@/hooks/useDocumentTitle";

import FeedHeader from "@/components/feed/FeedHeader";
import MemeSkeletonGrid from "@/components/feed/MemeSkeletonGrid";
import MemeScrollGrid from "@/components/feed/MemeScrollGrid";
import MemeModal from "@/components/feed/MemeModal";

const sortByTrending = (a, b) => {
  const al = a?.likeCount ?? 0;
  const bl = b?.likeCount ?? 0;
  if (bl !== al) return bl - al;

  const ad = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
  const bd = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
  return bd - ad;
};

const FeedPage = () => {
  useDocumentTitle("Feed");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isTrending, setIsTrending] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: memes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["memes"],
    queryFn: listMemes,
  });

  const list = useMemo(() => {
    const arr = Array.isArray(memes) ? memes : [];
    if (!isTrending) return arr;
    return [...arr].sort(sortByTrending);
  }, [memes, isTrending]);

  const openMeme = (meme) => {
    setSelected(meme);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-4">
        <FeedHeader
          user={user}
          onUpload={() => navigate(user ? "/upload" : "/login")}
          onTrending={() => setIsTrending((v) => !v)}
          isTrending={isTrending}
          rightContent={
            user ? (
              <Button variant="danger-soft" onPress={logout}>
                <span className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Logout03Icon}
                    strokeWidth={2}
                    className="size-5"
                  />
                  <span>Logout</span>
                </span>
              </Button>
            ) : null
          }
        />

        {isLoading ? (
          <div className="mt-6">
            <MemeSkeletonGrid count={9} />
          </div>
        ) : isError ? (
          <div className="mt-10 flex justify-center">
            <div className="flex max-w-xl items-center gap-3 rounded-2xl border border-divider bg-default/20 px-4 py-3 text-sm text-muted-foreground">
              <HugeiconsIcon
                icon={Alert02Icon}
                strokeWidth={2}
                className="size-5 text-danger"
              />
              <span>
                Can’t load memes right now. Make sure Tomcat is running and
                refresh.
              </span>
            </div>
          </div>
        ) : list.length === 0 ? (
          <div className="mt-10 flex justify-center">
            <div className="flex max-w-xl items-center gap-3 rounded-2xl border border-divider bg-default/20 px-4 py-3 text-sm text-muted-foreground">
              <HugeiconsIcon
                icon={Image02Icon}
                strokeWidth={2}
                className="size-5"
              />
              <span>No memes found. Be the first one to upload a meme.</span>
            </div>
          </div>
        ) : (
          <MemeScrollGrid memes={list} onOpen={openMeme} />
        )}
      </main>

      <MemeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        meme={selected}
      />
    </div>
  );
};

export default FeedPage;

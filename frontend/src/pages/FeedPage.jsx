import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { listMemes } from "@/services/memeService";
import { useAuth } from "@/hooks/auth";
import { Button, ScrollShadow } from "@heroui/react";
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
import ConfirmDialog from "@/components/ui/ConfirmDialog";

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
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const keyword = useMemo(() => debouncedSearch.trim(), [debouncedSearch]);

  const [lastSuccessfulKeyword, setLastSuccessfulKeyword] = useState(null);

  const {
    data: memes,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["memes", { keyword }],
    queryFn: () => listMemes(keyword),
    onSuccess: () => {
      setLastSuccessfulKeyword(keyword);
    },
  });

  const showSkeleton =
    isLoading ||
    (isFetching &&
      lastSuccessfulKeyword !== null &&
      keyword !== lastSuccessfulKeyword);

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
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden px-4">
        <div className="shrink-0">
          <FeedHeader
            user={user}
            onUpload={() => navigate(user ? "/upload" : "/login")}
            onTrending={() => setIsTrending((v) => !v)}
            isTrending={isTrending}
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            rightContent={
              user ? (
                <Button
                  className="flex-1 sm:flex-initial"
                  variant="danger-soft"
                  onPress={() => setShowLogout(true)}
                >
                  <span className="flex w-full items-center justify-center gap-2">
                    <HugeiconsIcon
                      icon={Logout03Icon}
                      strokeWidth={2}
                      className="size-5"
                    />
                    <span className="sm:hidden">Logout</span>
                  </span>
                </Button>
              ) : null
            }
          />
        </div>

        <ScrollShadow
          ref={scrollRef}
          hideScrollBar
          size="40"
          className="min-h-0 flex-1"
        >
          <AnimatePresence mode="wait">
            {showSkeleton ? (
              <motion.div
                key="loading"
                initial={false}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <MemeSkeletonGrid count={9} />
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="flex justify-center"
              >
                <div className="flex max-w-xl items-center gap-3 rounded-2xl border border-divider bg-default/20 px-4 py-3 text-sm text-muted-foreground">
                  <HugeiconsIcon
                    icon={Alert02Icon}
                    strokeWidth={2}
                    className="size-5 text-danger"
                  />
                  <span>Can’t load memes right now.</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`${keyword}::${list.length === 0 ? "empty" : "list"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              >
                {list.length === 0 ? (
                  <div className="flex justify-center">
                    <div className="flex max-w-xl items-center gap-3 rounded-2xl border border-divider bg-default/20 px-4 py-3 text-sm text-muted-foreground">
                      <HugeiconsIcon
                        icon={Image02Icon}
                        strokeWidth={2}
                        className="size-5"
                      />
                      <span>
                        No memes found. Be the first one to upload a meme.
                      </span>
                    </div>
                  </div>
                ) : (
                  <MemeScrollGrid
                    memes={list}
                    onOpen={openMeme}
                    isTrending={isTrending}
                    scrollContainerRef={scrollRef}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollShadow>

        <footer className="shrink-0 py-4 text-center text-sm text-muted">
          © {new Date().getFullYear()} GiggleGrid. Built for laughs.
        </footer>
      </main>

      <MemeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        meme={selected}
      />

      <ConfirmDialog
        isOpen={showLogout}
        onOpenChange={setShowLogout}
        onConfirm={logout}
        title="Log out?"
        description="Are you sure you want to log out of your account?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmColor="danger"
        confirmIcon={Logout03Icon}
      />
    </div>
  );
};

export default FeedPage;

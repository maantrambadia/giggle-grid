import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import MemeCard from "@/components/feed/MemeCard";

const PAGE_SIZE = 9;

const MemeScrollGrid = ({
  memes,
  onOpen,
  isTrending = false,
  scrollContainerRef,
}) => {
  const MotionDiv = motion.div;
  const hasReset = useRef(false);
  const sentinelRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = useMemo(() => {
    return (memes || []).slice(0, visibleCount);
  }, [memes, visibleCount]);

  const hasMore = (memes || []).length > visibleCount;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, (memes || []).length));
        }
      },
      { root: scrollContainerRef?.current ?? null, rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, memes, scrollContainerRef]);

  useEffect(() => {
    if (hasReset.current) {
      setVisibleCount(PAGE_SIZE);
      scrollContainerRef?.current?.scrollTo?.({ top: 0, behavior: "smooth" });
    } else {
      hasReset.current = true;
    }
  }, [isTrending, scrollContainerRef]);

  return (
    <div>
      <MotionDiv
        layout
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="grid gap-6 pb-1 sm:pb-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((meme) => (
          <MotionDiv
            key={meme.id}
            layout
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <MemeCard meme={meme} onOpen={onOpen} />
          </MotionDiv>
        ))}
      </MotionDiv>

      {hasMore ? (
        <div ref={sentinelRef} aria-hidden className="h-1 w-full" />
      ) : null}
    </div>
  );
};

export default MemeScrollGrid;

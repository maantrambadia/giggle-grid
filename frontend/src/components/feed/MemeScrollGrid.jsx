import { ScrollShadow } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import MemeCard from "@/components/feed/MemeCard";

const PAGE_SIZE = 9;

const MemeScrollGrid = ({ memes, onOpen, isTrending = false }) => {
  const scrollerRef = useRef(null);
  const hasReset = useRef(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = useMemo(() => {
    return (memes || []).slice(0, visibleCount);
  }, [memes, visibleCount]);

  const hasMore = (memes || []).length > visibleCount;

  const loadMore = () => {
    if (!hasMore) return;
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, (memes || []).length));
  };

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 220;
    if (nearBottom) loadMore();
  };

  useEffect(() => {
    if (hasReset.current) {
      setVisibleCount(PAGE_SIZE);
      scrollerRef.current?.scrollTo?.({
        top: 0,
        behavior: "smooth",
      });
    } else {
      hasReset.current = true;
    }
  }, [isTrending]);

  return (
    <ScrollShadow
      ref={scrollerRef}
      hideScrollBar
      className="mt-3 max-h-[calc(100dvh-140px)] sm:mt-6 sm:max-h-[calc(100dvh-200px)] lg:max-h-[calc(100dvh-220px)]"
      onScroll={handleScroll}
    >
      <div className="grid gap-6 pb-1 sm:pb-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((meme) => (
          <MemeCard key={meme.id} meme={meme} onOpen={onOpen} />
        ))}
      </div>
    </ScrollShadow>
  );
};

export default MemeScrollGrid;

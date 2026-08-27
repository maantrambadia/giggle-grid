import { ScrollShadow } from "@heroui/react";
import { useMemo, useRef, useState } from "react";
import MemeCard from "@/components/feed/MemeCard";

const PAGE_SIZE = 9;

const MemeScrollGrid = ({ memes, onOpen }) => {
  const scrollerRef = useRef(null);
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

  return (
    <ScrollShadow
      ref={scrollerRef}
      hideScrollBar
      className="mt-6 max-h-[calc(100vh-240px)]"
      onScroll={handleScroll}
    >
      <div className="grid gap-6 pb-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((meme) => (
          <MemeCard key={meme.id} meme={meme} onOpen={onOpen} />
        ))}
      </div>
    </ScrollShadow>
  );
};

export default MemeScrollGrid;

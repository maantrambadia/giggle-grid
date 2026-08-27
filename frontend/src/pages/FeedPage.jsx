import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Button, Input } from "@heroui/react";
import api from "@/lib/axios";

const mockMemes = [
  {
    id: 1,
    caption: "When the code finally compiles",
    author: "devlife",
    likes: 42,
    comments: 7,
  },
  {
    id: 2,
    caption: "Me explaining to my mom what I do",
    author: "coder_one",
    likes: 128,
    comments: 15,
  },
  {
    id: 3,
    caption: "One does not simply skip testing",
    author: "bug_hunter",
    likes: 89,
    comments: 4,
  },
  {
    id: 4,
    caption: "It works on my machine",
    author: "deployer",
    likes: 256,
    comments: 31,
  },
];

const FeedPage = () => {
  const [search, setSearch] = useState("");

  const { data: memes } = useQuery({
    queryKey: ["memes"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/memes");
        return data;
      } catch {
        return mockMemes;
      }
    },
  });

  const list = memes || mockMemes;
  const filtered = list.filter(
    (m) =>
      m.caption.toLowerCase().includes(search.toLowerCase()) ||
      m.author.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(900px_circle_at_20%_10%,color-mix(in_oklch,var(--accent)_18%,transparent),transparent_60%),radial-gradient(800px_circle_at_80%_0%,color-mix(in_oklch,var(--success)_14%,transparent),transparent_55%)]" />

      <main className="mx-auto max-w-6xl p-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Fresh memes
            </h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Browse the grid. Login to upload, like, and comment.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button color="success">Upload meme</Button>
            <Button variant="flat">Trending</Button>
          </div>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search memes, users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((meme) => (
            <motion.div
              key={meme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="group overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_20px_60px_-30px_rgba(0,0,0,.7)]"
            >
              <div className="relative">
                <img
                  src={`https://picsum.photos/seed/${meme.id}/900/600`}
                  alt={meme.caption}
                  className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.55),transparent_55%)]" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/90 backdrop-blur">
                    @{meme.author}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <p className="mb-2 line-clamp-2 text-[15px] font-medium leading-snug">
                  {meme.caption}
                </p>
                <div className="mt-4 flex items-center gap-6 text-sm text-[color:var(--muted)]">
                  <button className="flex items-center gap-1 transition hover:text-[color:var(--accent)]">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {meme.likes}
                  </button>
                  <button className="flex items-center gap-1 transition hover:text-[color:var(--accent)]">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {meme.comments}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FeedPage;

import Image from "next/image";
import Link from "next/link";
import { reader } from "./reader";

export default async function Home() {
  const posts = await reader.collections.posts.all();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/keystatic"
            target="_blank"
            rel="noopener noreferrer"
          >
            Admin UI
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            <Link href={`/${post.slug}`}>{post.entry.title}</Link>
          </li>
        ))}
      </footer>
    </div>
  );
}

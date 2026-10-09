import Link from "next/link";
import { ApiKeyButton } from "./ApiKeySettings";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-full bg-ink text-paper transition-transform group-hover:-rotate-12">
        <span className="font-serif text-lg leading-none font-black">R</span>
      </span>
      <span className="font-mono text-sm font-semibold tracking-tight">
        rehearse<span className="text-accent">.</span>
      </span>
    </Link>
  );
}

export default function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        {!minimal && (
          <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
            <Link href="/#features" className="hover:text-ink">功能</Link>
            <Link href="/#how" className="hover:text-ink">流程</Link>
            <Link href="/#faq" className="hover:text-ink">常見問題</Link>
          </nav>
        )}
        <div className="flex items-center gap-3">
          <ApiKeyButton />
          {minimal ? (
            <Link href="/" className="text-sm text-ink-soft hover:text-ink">
              ← 回首頁
            </Link>
          ) : (
            <Link
              href="/practice"
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent"
            >
              開始練習
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

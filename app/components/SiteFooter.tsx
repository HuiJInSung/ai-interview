import Link from "next/link";
import { Logo } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
            在真正的面試之前，先和 AI 面試官排練一次。
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-mono text-xs tracking-widest text-ink-soft uppercase">Product</span>
          <Link href="/practice" className="hover:text-accent">開始練習</Link>
          <Link href="/#features" className="hover:text-accent">功能</Link>
          <Link href="/#how" className="hover:text-accent">流程</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-mono text-xs tracking-widest text-ink-soft uppercase">Help</span>
          <Link href="/#faq" className="hover:text-accent">常見問題</Link>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 font-mono text-xs text-ink-soft sm:flex-row sm:justify-between sm:px-6">
          <span>© 2026 Rehearse</span>
          <span>Powered by OpenAI</span>
        </div>
      </div>
    </footer>
  );
}

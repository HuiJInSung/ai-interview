import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

const features = [
  {
    no: "01",
    title: "依職缺量身出題",
    body: "貼上任何職缺描述，面試官會從職責、技能要求與情境中挑出最可能被問到的問題。",
  },
  {
    no: "02",
    title: "會追問的面試官",
    body: "回答太籠統？它會像真人一樣追問細節，逼你把經驗講得具體、有說服力。",
  },
  {
    no: "03",
    title: "評分與具體建議",
    body: "三題結束後給出 0–100 分、整體評語，以及你的優點和下一步該補強的地方。",
  },
  {
    no: "04",
    title: "免註冊，打開就練",
    body: "不需要帳號，也不用安裝。通勤時、面試前十分鐘，隨時都能來一場。",
  },
];

const steps = [
  { title: "貼上職缺", body: "從 104、LinkedIn 或公司官網複製職缺描述。" },
  { title: "回答三題", body: "面試官依你的回答決定追問或換題，像真的面試一樣。" },
  { title: "拿到回饋", body: "立即看到分數、優點與改進建議，再練一次。" },
];

const faqs = [
  {
    q: "需要付費或註冊嗎？",
    a: "不需要。打開練習頁、貼上職缺描述就能開始。",
  },
  {
    q: "面試內容會被保存嗎？",
    a: "不會。對話只存在你的瀏覽器分頁中，重新整理或按「重新開始」就會清除。內容會傳送給 OpenAI 以產生問題與評分。",
  },
  {
    q: "適合哪些職位？",
    a: "任何有職缺描述的職位都可以，從工程師、設計師到行銷、業務皆適用。",
  },
  {
    q: "評分準確嗎？",
    a: "評分由 AI 根據你的回答與職缺要求產生，適合作為練習參考，不代表任何公司的實際錄取標準。",
  },
];

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

function PreviewCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-3 -rotate-2 rounded-[28px] bg-accent" aria-hidden />
      <div className="relative flex flex-col gap-4 rounded-3xl border border-ink bg-paper p-5 shadow-[8px_8px_0_0_var(--ink)] sm:p-6">
        <div className="flex items-center justify-between font-mono text-xs text-ink-soft">
          <span>● 面試進行中</span>
          <span>Q2 / 3</span>
        </div>
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-paper-deep px-4 py-3 text-sm leading-relaxed">
          你提到用虛擬列表優化效能，能具體說明當時的資料量，以及優化前後的差異嗎？
        </div>
        <div className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-ink px-4 py-3 text-sm leading-relaxed text-paper">
          <span className="caret">當時表格大約有兩萬筆資料，首次渲染要</span>
        </div>
        <div className="mt-2 flex items-center gap-4 rounded-2xl border border-dashed border-line p-4">
          <div className="font-serif text-4xl font-black text-moss">85</div>
          <div className="text-xs leading-relaxed text-ink-soft">
            <div className="font-medium text-ink">面試結束後的評分</div>
            回答具體、有數據支撐；建議多補充團隊協作的例子。
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="grain relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-24 sm:px-6 md:pt-24 lg:grid-cols-[1.15fr_1fr]">
            <div className="rise flex flex-col items-start gap-7">
              <span className="rounded-full border border-ink/15 bg-paper px-3 py-1 font-mono text-xs text-ink-soft">
                AI Mock Interview · 免費使用
              </span>
              <h1 className="font-serif text-5xl leading-[1.15] font-black tracking-tight sm:text-6xl lg:text-7xl">
                下一場面試，
                <br />
                先在這裡
                <span className="relative inline-block">
                  <span className="relative z-10">排練</span>
                  <span className="absolute inset-x-0 bottom-1 h-4 bg-accent/80 sm:h-5" aria-hidden />
                </span>
                一次。
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-ink-soft">
                貼上職缺描述，和一位會追問的 AI 面試官練習三題。結束後立刻拿到評分，以及你該怎麼答得更好。
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/practice"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-white shadow-[4px_4px_0_0_var(--ink)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--ink)]"
                >
                  開始模擬面試 <Arrow />
                </Link>
                <a href="#how" className="text-sm font-medium text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-accent">
                  看看怎麼運作
                </a>
              </div>
            </div>
            <div className="rise [animation-delay:150ms]">
              <PreviewCard />
            </div>
          </div>
        </section>

        {/* Marquee strip */}
        <section className="border-y border-ink bg-ink text-paper">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-4 font-mono text-xs tracking-widest uppercase sm:justify-between">
            <span>3 題深度面試</span>
            <span className="text-accent">✦</span>
            <span>即時追問</span>
            <span className="text-accent">✦</span>
            <span>0–100 評分</span>
            <span className="text-accent">✦</span>
            <span>免註冊</span>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-16">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-lg font-serif text-4xl leading-tight font-black sm:text-5xl">
                不是題庫，
                <br />
                是一位真的會聽你說話的面試官。
              </h2>
              <p className="max-w-sm text-ink-soft">
                背好的標準答案在真實面試裡很快就會被看穿。Rehearse 讓你練的是臨場應答，而不是背稿。
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-ink bg-ink sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.no} className="group flex flex-col gap-4 bg-paper p-8 transition-colors hover:bg-accent-soft">
                  <span className="font-mono text-sm text-accent">{f.no}</span>
                  <h3 className="text-xl font-bold">{f.title}</h3>
                  <p className="leading-relaxed text-ink-soft">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-16 bg-paper-deep">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <span className="font-mono text-xs tracking-widest text-ink-soft uppercase">How it works</span>
            <h2 className="mt-3 mb-14 font-serif text-4xl font-black sm:text-5xl">三個步驟，十分鐘練完。</h2>
            <ol className="grid gap-10 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="flex flex-col gap-3 border-t-2 border-ink pt-6">
                  <span className="font-serif text-6xl font-black text-accent">{i + 1}</span>
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="leading-relaxed text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-16">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-[1fr_1.6fr]">
            <h2 className="font-serif text-4xl font-black sm:text-5xl">常見問題</h2>
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                    {f.q}
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-ink text-sm transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-24 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-ink px-6 py-16 text-center text-paper sm:px-12 sm:py-20">
            <div className="absolute -top-24 -right-24 size-72 rounded-full bg-accent/30 blur-3xl" aria-hidden />
            <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-moss/60 blur-3xl" aria-hidden />
            <div className="relative flex flex-col items-center gap-6">
              <h2 className="font-serif text-4xl leading-tight font-black sm:text-5xl">
                面試只有一次，
                <br />
                練習可以無限次。
              </h2>
              <Link
                href="/practice"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-medium text-white transition-colors hover:bg-paper hover:text-ink"
              >
                立即開始，免費 <Arrow />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

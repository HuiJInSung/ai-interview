"use client";

import { useEffect, useRef, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useOpenSettings } from "../components/ApiKeySettings";
import { API_KEY_HEADER, getApiKey, useApiKey } from "../lib/apiKey";

type ChatMessage = { role: "interviewer" | "candidate"; content: string };

type Evaluation = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

const TOTAL_QUESTIONS = 3;

function scoreLabel(score: number) {
  if (score >= 85) return "表現出色";
  if (score >= 70) return "表現不錯";
  if (score >= 50) return "還有進步空間";
  return "需要多加練習";
}

export default function PracticePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyError, setKeyError] = useState(false);
  const apiKey = useApiKey();
  const openSettings = useOpenSettings();
  const bottomRef = useRef<HTMLDivElement>(null);

  const answered = messages.filter((m) => m.role === "candidate").length;
  const current = evaluation ? TOTAL_QUESTIONS : Math.min(answered + 1, TOTAL_QUESTIONS);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, evaluation, loading]);

  async function askInterviewer(history: ChatMessage[]) {
    setLoading(true);
    setError("");
    setKeyError(false);
    try {
      const res = await fetch("/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json", [API_KEY_HEADER]: getApiKey() },
        body: JSON.stringify({ jobDescription, messages: history }),
      });
      const data = await res.json();
      if (!res.ok) {
        setKeyError(res.status === 401);
        throw new Error(data.error ?? "發生錯誤");
      }

      if (data.type === "question") {
        setMessages([...history, { role: "interviewer", content: data.content }]);
      } else {
        setEvaluation(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  function start() {
    if (!jobDescription.trim()) return;
    if (!apiKey) {
      openSettings();
      return;
    }
    setStarted(true);
    askInterviewer([]);
  }

  function submitAnswer() {
    if (!answer.trim() || loading) return;
    const history: ChatMessage[] = [...messages, { role: "candidate", content: answer.trim() }];
    setMessages(history);
    setAnswer("");
    askInterviewer(history);
  }

  function retry() {
    askInterviewer(messages);
  }

  function reset() {
    setStarted(false);
    setMessages([]);
    setAnswer("");
    setEvaluation(null);
    setError("");
    setKeyError(false);
  }

  return (
    <>
      <SiteHeader minimal />
      <main className="grain flex flex-1 justify-center px-4 py-12 sm:px-6">
        <div className="flex w-full max-w-2xl flex-col gap-8">
          {!started ? (
            <section className="rise flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs tracking-widest text-ink-soft uppercase">Step 1 · 職缺描述</span>
                <h1 className="font-serif text-4xl leading-tight font-black sm:text-5xl">你想練習哪個職缺？</h1>
                <p className="text-ink-soft">貼上職缺描述，面試官會根據內容出題。越完整，題目越貼近真實面試。</p>
              </div>
              {!apiKey && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-accent bg-accent-soft px-5 py-3.5 text-sm">
                  <span>面試官使用你自己的 OpenAI API Key，開始前請先設定。</span>
                  <button onClick={openSettings} className="shrink-0 font-medium underline underline-offset-4">
                    設定 API Key
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-4 rounded-3xl border border-ink bg-paper p-5 shadow-[6px_6px_0_0_var(--ink)] sm:p-6">
                <label htmlFor="jd" className="sr-only">職缺描述</label>
                <textarea
                  id="jd"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={9}
                  placeholder={"例如：\n資深前端工程師\n・熟悉 React、TypeScript\n・3 年以上大型專案經驗\n・具效能優化與跨部門溝通經驗"}
                  className="resize-none bg-transparent leading-relaxed outline-none placeholder:text-ink-soft/60"
                />
                <div className="flex items-center justify-between border-t border-line pt-4">
                  <span className="font-mono text-xs text-ink-soft">{jobDescription.length} 字</span>
                  <button
                    onClick={start}
                    disabled={!jobDescription.trim()}
                    className="rounded-full bg-accent px-6 py-2.5 font-medium text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
                  >
                    開始面試 →
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* Progress */}
              <div className="flex items-center gap-4">
                <div className="flex flex-1 gap-1.5">
                  {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i < answered || evaluation ? "bg-ink" : i === answered ? "bg-accent" : "bg-line"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs text-ink-soft">
                  {evaluation ? "面試結束" : `Q${current} / ${TOTAL_QUESTIONS}`}
                </span>
              </div>

              {/* Chat */}
              <section className="flex flex-col gap-5">
                {messages.map((m, i) => (
                  <div key={i} className={`rise flex flex-col gap-1.5 ${m.role === "interviewer" ? "items-start" : "items-end"}`}>
                    <span className="font-mono text-[11px] tracking-widest text-ink-soft uppercase">
                      {m.role === "interviewer" ? "面試官" : "你"}
                    </span>
                    <div
                      className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-5 py-3.5 leading-relaxed ${
                        m.role === "interviewer"
                          ? "rounded-tl-sm border border-line bg-paper"
                          : "rounded-tr-sm bg-ink text-paper"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex flex-col items-start gap-1.5">
                    <span className="font-mono text-[11px] tracking-widest text-ink-soft uppercase">面試官</span>
                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-line bg-paper px-5 py-3.5 text-ink-soft">
                      <span className="flex gap-1">
                        <span className="size-1.5 animate-bounce rounded-full bg-accent" />
                        <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:120ms]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:240ms]" />
                      </span>
                      {answered >= TOTAL_QUESTIONS ? "正在評分中" : "思考中"}
                    </div>
                  </div>
                )}
                {error && (
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-accent bg-accent-soft px-5 py-3.5 text-sm">
                    <span>{error}</span>
                    <span className="flex shrink-0 gap-4">
                      {keyError && (
                        <button onClick={openSettings} className="font-medium underline underline-offset-4">
                          設定 API Key
                        </button>
                      )}
                      <button onClick={retry} className="font-medium underline underline-offset-4">
                        重試
                      </button>
                    </span>
                  </div>
                )}
              </section>

              {/* Evaluation */}
              {evaluation && (
                <section className="rise overflow-hidden rounded-3xl border border-ink bg-paper shadow-[6px_6px_0_0_var(--ink)]">
                  <div className="flex items-center gap-6 bg-ink p-6 text-paper sm:p-8">
                    <div className="font-serif text-7xl leading-none font-black text-accent">{evaluation.score}</div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs tracking-widest text-paper/60 uppercase">Score / 100</span>
                      <span className="text-xl font-bold">{scoreLabel(evaluation.score)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 p-6 sm:p-8">
                    <p className="leading-relaxed">{evaluation.summary}</p>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col gap-3">
                        <h2 className="font-mono text-xs tracking-widest text-moss uppercase">✓ 優點</h2>
                        <ul className="flex flex-col gap-2 text-sm leading-relaxed">
                          {evaluation.strengths?.map((s, i) => (
                            <li key={i} className="border-l-2 border-moss pl-3">{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col gap-3">
                        <h2 className="font-mono text-xs tracking-widest text-accent uppercase">→ 改進建議</h2>
                        <ul className="flex flex-col gap-2 text-sm leading-relaxed">
                          {evaluation.improvements?.map((s, i) => (
                            <li key={i} className="border-l-2 border-accent pl-3">{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button
                      onClick={reset}
                      className="self-start rounded-full bg-accent px-6 py-2.5 font-medium text-white transition-colors hover:bg-ink"
                    >
                      再練一次
                    </button>
                  </div>
                </section>
              )}

              {/* Answer box */}
              {!evaluation && answered < TOTAL_QUESTIONS && messages.length > 0 && (
                <section className="sticky bottom-4 flex flex-col gap-3 rounded-3xl border border-ink bg-paper p-4 shadow-[6px_6px_0_0_var(--ink)]">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        submitAnswer();
                      }
                    }}
                    rows={3}
                    disabled={loading}
                    placeholder="輸入你的回答…"
                    className="resize-none bg-transparent leading-relaxed outline-none placeholder:text-ink-soft/60 disabled:opacity-50"
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ink-soft">Enter 送出 · Shift+Enter 換行</span>
                    <button
                      onClick={submitAnswer}
                      disabled={loading || !answer.trim()}
                      className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
                    >
                      送出回答
                    </button>
                  </div>
                </section>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

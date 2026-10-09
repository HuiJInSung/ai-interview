"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { maskApiKey, setApiKey, useApiKey } from "../lib/apiKey";

const SettingsContext = createContext<() => void>(() => {});

export function useOpenSettings() {
  return useContext(SettingsContext);
}

export function ApiKeySettingsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SettingsContext.Provider value={() => setOpen(true)}>
      {children}
      {open && <ApiKeyDialog onClose={() => setOpen(false)} />}
    </SettingsContext.Provider>
  );
}

export function ApiKeyButton() {
  const apiKey = useApiKey();
  const openSettings = useOpenSettings();

  return (
    <button
      onClick={openSettings}
      className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink"
    >
      <span className={`size-2 rounded-full ${apiKey ? "bg-moss" : "bg-accent"}`} />
      {apiKey ? "API Key 已設定" : "設定 API Key"}
    </button>
  );
}

function ApiKeyDialog({ onClose }: { onClose: () => void }) {
  const savedKey = useApiKey();
  const [draft, setDraft] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const trimmed = draft.trim();
  const looksValid = trimmed.startsWith("sk-");

  function save() {
    if (!looksValid) return;
    setApiKey(trimmed);
    onClose();
  }

  function clear() {
    setApiKey("");
    setDraft("");
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-key-title"
        onClick={(e) => e.stopPropagation()}
        className="rise flex w-full max-w-md flex-col gap-5 rounded-3xl border border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)]"
      >
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs tracking-widest text-ink-soft uppercase">Settings · BYOK</span>
          <h2 id="api-key-title" className="font-serif text-2xl font-black">OpenAI API Key</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            面試官使用你自己的 OpenAI API Key。Key 只會存在這個瀏覽器的 localStorage，
            每次面試時隨請求送出，伺服器不會保存。
          </p>
        </div>

        {savedKey && (
          <div className="flex items-center justify-between rounded-2xl border border-line px-4 py-3 text-sm">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-moss" />
              目前使用 <code className="font-mono">{maskApiKey(savedKey)}</code>
            </span>
            <button onClick={clear} className="text-accent underline underline-offset-4">
              清除
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="flex flex-col gap-3"
        >
          <label htmlFor="api-key" className="text-sm font-medium">
            {savedKey ? "更換 Key" : "輸入 Key"}
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-ink px-4 py-3">
            <input
              id="api-key"
              type={visible ? "text" : "password"}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              spellCheck={false}
              autoFocus
              className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-ink-soft/60"
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="shrink-0 font-mono text-xs text-ink-soft hover:text-ink"
            >
              {visible ? "隱藏" : "顯示"}
            </button>
          </div>
          {trimmed && !looksValid && (
            <p className="text-xs text-accent">OpenAI API Key 通常以 sk- 開頭</p>
          )}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noreferrer"
            className="self-start text-xs text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            還沒有 Key？到 OpenAI 後台建立 ↗
          </a>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2 text-sm text-ink-soft hover:text-ink"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!looksValid}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
            >
              儲存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

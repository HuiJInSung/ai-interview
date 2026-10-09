import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import { ApiKeySettingsProvider } from "./components/ApiKeySettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["400", "500", "700"],
  preload: false,
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  weight: ["600", "900"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Rehearse — AI 面試模擬器",
  description: "貼上職缺描述，和會追問的 AI 面試官練習三題，立即拿到評分與具體建議。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} ${notoSerifTC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ApiKeySettingsProvider>{children}</ApiKeySettingsProvider>
      </body>
    </html>
  );
}

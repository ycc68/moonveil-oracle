"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { requireUser } from "@/lib/requireUser"

type Lang = "en" | "zh"

type ReadingItem = {
  id: string
  user_id: string
  card1: string
  card2: string
  card3: string
  reading: string
  created_at: string
}

const copy = {
  en: {
    archive: "Reading Archive",
    title: "Your Tarot History",
    signedIn: "Signed in as",
    loading: "Loading your readings...",
    emptyTitle: "No readings yet",
    emptyDesc: "You have not saved any mystical readings yet.",
    startFirst: "Start Your First Reading",
    home: "Home",
    newReading: "New Reading",
    reading: "Reading",
    past: "Past",
    present: "Present",
    future: "Future",
    interpretation: "Interpretation",
    openAgain: "Open again",
    newLabel: "New",
  },
  zh: {
    archive: "占卜档案",
    title: "你的占卜历史",
    signedIn: "当前登录账号",
    loading: "正在加载你的历史记录...",
    emptyTitle: "还没有历史记录",
    emptyDesc: "你还没有保存任何神秘占卜记录。",
    startFirst: "开始第一次占卜",
    home: "首页",
    newReading: "新的占卜",
    reading: "占卜",
    past: "过去",
    present: "现在",
    future: "未来",
    interpretation: "解读",
    openAgain: "重新打开",
    newLabel: "新的",
  },
} as const

function extractModeAndText(rawReading: string) {
  const match = rawReading.match(/^\[(love|career|money|general)\]\s*/i)

  if (!match) {
    return {
      mode: "general",
      text: rawReading,
    }
  }

  const mode = match[1].toLowerCase()
  const text = rawReading.replace(/^\[(love|career|money|general)\]\s*/i, "")

  return { mode, text }
}

function modeLabel(mode: string, lang: Lang) {
  if (mode === "love") return lang === "zh" ? "感情占卜" : "Love Reading"
  if (mode === "career") return lang === "zh" ? "事业占卜" : "Career Reading"
  if (mode === "money") return lang === "zh" ? "财运占卜" : "Money Reading"
  return lang === "zh" ? "综合占卜" : "General Reading"
}

function modeEmoji(mode: string) {
  if (mode === "love") return "💗"
  if (mode === "career") return "💼"
  if (mode === "money") return "💰"
  return "✨"
}

export default function HistoryPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [readings, setReadings] = useState<ReadingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")

  const t = copy[lang]

  useEffect(() => {
    const savedLang = window.localStorage.getItem("site_lang") as Lang | null
    if (savedLang === "en" || savedLang === "zh") {
      setLang(savedLang)
    }
  }, [])

  useEffect(() => {
    const fetchReadings = async () => {
      const user = await requireUser()
      if (!user) return

      setUserEmail(user.email || "")

      const { data, error } = await supabase
        .from("readings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setReadings(data as ReadingItem[])
      }

      setLoading(false)
    }

    fetchReadings()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#120a24] via-[#24124d] to-[#12345f] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl text-sm mb-5">
            <span>📚</span>
            <span>{t.archive}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {t.title}
          </h1>

          <p className="text-white/70 text-lg">
            {userEmail ? `${t.signedIn} ${userEmail}` : t.title}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href="/"
            className="px-5 py-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            {t.home}
          </Link>

          <Link
            href="/reading?mode=general"
            className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-[1.02] transition font-semibold"
          >
            {t.newReading}
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-2xl p-8 text-white/70">
            {t.loading}
          </div>
        ) : readings.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-2xl p-10">
            <div className="text-2xl font-semibold mb-3">{t.emptyTitle}</div>
            <p className="text-white/70 mb-6 leading-8">
              {t.emptyDesc}
            </p>
            <Link
              href="/reading?mode=general"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-[1.02] transition font-semibold"
            >
              {t.startFirst}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {readings.map((item, index) => {
              const parsed = extractModeAndText(item.reading)

              return (
                <div
                  key={item.id}
                  className="rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-2xl p-6 md:p-7 shadow-2xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                      <div className="text-sm uppercase tracking-[0.25em] text-purple-200 mb-2">
                        {t.reading} #{readings.length - index}
                      </div>
                      <div className="text-white/60 text-sm">
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-sm px-4 py-2 rounded-full bg-white/10 border border-white/10">
                      {modeEmoji(parsed.mode)} {modeLabel(parsed.mode, lang)}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-5">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.25em] text-purple-200 mb-2">
                        {t.past}
                      </div>
                      <div className="text-lg font-semibold">{item.card1}</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.25em] text-purple-200 mb-2">
                        {t.present}
                      </div>
                      <div className="text-lg font-semibold">{item.card2}</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.25em] text-purple-200 mb-2">
                        {t.future}
                      </div>
                      <div className="text-lg font-semibold">{item.card3}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5 mb-5">
                    <div className="text-sm uppercase tracking-[0.25em] text-purple-200 mb-3">
                      {t.interpretation}
                    </div>
                    <p className="text-white/85 whitespace-pre-line leading-8">
                      {parsed.text}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/reading?id=${item.id}&history=true`}
                      className="inline-block px-5 py-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
                    >
                      {t.openAgain}
                    </Link>

                    <Link
                      href={`/reading?mode=${parsed.mode}`}
                      className="inline-block px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-[1.02] transition font-semibold"
                    >
                      {t.newLabel} {modeLabel(parsed.mode, lang)}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
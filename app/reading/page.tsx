"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { requireUser } from "@/lib/requireUser"

type Lang = "en" | "zh"

const cards = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
]

const modeLabels: Record<string, { en: string; zh: string }> = {
  love: { en: "Love Reading", zh: "感情占卜" },
  career: { en: "Career Reading", zh: "事业占卜" },
  money: { en: "Money Reading", zh: "财运占卜" },
  general: { en: "General Reading", zh: "综合占卜" },
}

const modeIcons: Record<string, string> = {
  love: "💗",
  career: "💼",
  money: "💰",
  general: "✨",
}

const copy = {
  en: {
    openingSaved: "Opening your saved reading...",
    generating: "Generating your reading...",
    noCreditsTag: "No Credits Left",
    noCreditsTitle: "You have used your free reading",
    noCreditsDesc:
      "Your first glimpse behind the veil has already been revealed. Upgrade to continue unlocking deeper guidance.",
    upgradeNow: "Upgrade Now",
    viewHistory: "View History",
    savedPrefix: "Saved",
    savedTitle: "Your Saved Reading",
    savedDesc: "This is a past message you have already received.",
    readingTitle: "The Cards Have Spoken",
    readingDesc: "A message from the veil has now been revealed to you.",
    creditsLeft: "Credits left",
    past: "Past",
    present: "Present",
    future: "Future",
    interpretation: "Interpretation",
    backToHistory: "Back to History",
    newReading: "New Reading",
    home: "Home",
    failedProfile: "Failed to load your profile.",
    noProfile: "No profile found for this user.",
    failedSaved: "Failed to load this saved reading.",
    missingSaved: "This saved reading could not be found.",
    fallback: (c1: string, c2: string, c3: string) =>
      `Your past is shaped by ${c1}.\nYour present is influenced by ${c2}.\nYour future is guided by ${c3}.`,
  },
  zh: {
    openingSaved: "正在打开你保存的占卜结果...",
    generating: "正在生成你的占卜...",
    noCreditsTag: "次数已用完",
    noCreditsTitle: "你的免费占卜已经用完",
    noCreditsDesc:
      "你已经看见了第一道来自命运的讯息。升级后可继续解锁更深层的神秘指引。",
    upgradeNow: "立即升级",
    viewHistory: "查看历史记录",
    savedPrefix: "已保存的",
    savedTitle: "你保存的占卜",
    savedDesc: "这是你之前已经获得过的一条讯息。",
    readingTitle: "卡牌已经开口",
    readingDesc: "来自帷幕之后的讯息，已经向你显现。",
    creditsLeft: "剩余次数",
    past: "过去",
    present: "现在",
    future: "未来",
    interpretation: "解读",
    backToHistory: "返回历史记录",
    newReading: "新的占卜",
    home: "首页",
    failedProfile: "读取你的用户资料失败。",
    noProfile: "没有找到该用户的资料。",
    failedSaved: "读取这条历史占卜失败。",
    missingSaved: "没有找到这条保存的占卜。",
    fallback: (c1: string, c2: string, c3: string) =>
      `你的过去受到 ${c1} 的影响。\n你的现在受到 ${c2} 的牵引。\n你的未来将由 ${c3} 指引。`,
  },
} as const

function randomCard() {
  return cards[Math.floor(Math.random() * cards.length)]
}

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

function ReadingPageContent() {
  const searchParams = useSearchParams()
  const historyId = searchParams.get("id")
  const selectedModeFromUrl = searchParams.get("mode") || "general"

  const [lang, setLang] = useState<Lang>("en")
  const [langReady, setLangReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reading, setReading] = useState("")
  const [card1, setCard1] = useState("")
  const [card2, setCard2] = useState("")
  const [card3, setCard3] = useState("")
  const [noCredits, setNoCredits] = useState(false)
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null)
  const [mode, setMode] = useState("general")
  const [isHistoryView, setIsHistoryView] = useState(false)

  const t = copy[lang]

  useEffect(() => {
    const savedLang = window.localStorage.getItem("site_lang") as Lang | null
    if (savedLang === "en" || savedLang === "zh") {
      setLang(savedLang)
    }
    setLangReady(true)
  }, [])

  useEffect(() => {
    if (!langReady) return

    const start = async () => {
      const user = await requireUser()
      if (!user) return

      if (historyId) {
        await loadHistoryReading(user.id, historyId)
      } else {
        const safeMode = modeLabels[selectedModeFromUrl]
          ? selectedModeFromUrl
          : "general"

        setMode(safeMode)
        await generateReading(user.id, safeMode, lang)
      }
    }

    start()
  }, [historyId, selectedModeFromUrl, langReady, lang])

  const loadHistoryReading = async (userId: string, readingId: string) => {
    setLoading(true)
    setIsHistoryView(true)
    setNoCredits(false)

    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .eq("id", readingId)
      .eq("user_id", userId)
      .maybeSingle()

    if (error) {
      console.error("Failed to load history reading:", error.message)
      setReading(t.failedSaved)
      setLoading(false)
      return
    }

    if (!data) {
      setReading(t.missingSaved)
      setLoading(false)
      return
    }

    const parsed = extractModeAndText(data.reading || "")

    setMode(parsed.mode)
    setCard1(data.card1 || "")
    setCard2(data.card2 || "")
    setCard3(data.card3 || "")
    setReading(parsed.text || data.reading || "")
    setLoading(false)
  }

  const generateReading = async (
    userId: string,
    selectedMode: string,
    currentLang: Lang
  ) => {
    setLoading(true)
    setIsHistoryView(false)
    setNoCredits(false)

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (profileError) {
      console.log("profile warning:", profileError)
      setReading(copy[currentLang].failedProfile)
      setLoading(false)
      return
    }

    if (!profile) {
      setReading(copy[currentLang].noProfile)
      setLoading(false)
      return
    }

    if (profile.credits <= 0) {
      setNoCredits(true)
      setCreditsLeft(0)
      setLoading(false)
      return
    }

    setCreditsLeft(profile.credits)

    const c1 = randomCard()
    const c2 = randomCard()
    const c3 = randomCard()

    setCard1(c1)
    setCard2(c2)
    setCard3(c3)

    let text = copy[currentLang].fallback(c1, c2, c3)

    try {
      const aiRes = await fetch("/api/generate-reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card1: c1,
          card2: c2,
          card3: c3,
          mode: selectedMode,
          lang: currentLang,
        }),
      })

      const aiData = await aiRes.json()

      if (aiRes.ok && aiData.reading) {
        text = aiData.reading
      }
    } catch (error) {
      console.error("AI reading fallback:", error)
    }

    setReading(text)

    const storedReading = `[${selectedMode}] ${text}`

    const { error: insertError } = await supabase.from("readings").insert({
      user_id: userId,
      card1: c1,
      card2: c2,
      card3: c3,
      reading: storedReading,
    })

    if (insertError) {
      console.error("Failed to save reading:", insertError.message)
    }

    const { error: creditError } = await supabase.rpc("use_credit", {
      user_id: userId,
    })

    if (creditError) {
      console.error("Failed to use credit:", creditError.message)
    } else {
      setCreditsLeft(profile.credits - 1)
    }

    setLoading(false)
  }

  if (!langReady || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#120a24] via-[#24124d] to-[#12345f] text-white flex items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl px-8 py-6 text-lg shadow-2xl">
          {historyId ? t.openingSaved : t.generating}
        </div>
      </main>
    )
  }

  if (noCredits) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#120a24] via-[#24124d] to-[#12345f] text-white px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-2xl p-10 text-center shadow-2xl">
            <div className="text-sm uppercase tracking-[0.3em] text-purple-200 mb-4">
              {t.noCreditsTag}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t.noCreditsTitle}
            </h1>

            <p className="text-white/75 mb-8 leading-8">
              {t.noCreditsDesc}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/tarot"
                className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-[1.02] transition font-semibold"
              >
                {t.upgradeNow}
              </a>

              <a
                href="/history"
                className="inline-block px-6 py-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
              >
                {t.viewHistory}
              </a>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#120a24] via-[#24124d] to-[#12345f] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl text-sm mb-5">
            <span>{modeIcons[mode] || "✨"}</span>
            <span>
              {isHistoryView
                ? `${t.savedPrefix} ${modeLabels[mode]?.[lang] || modeLabels.general[lang]}`
                : modeLabels[mode]?.[lang] || modeLabels.general[lang]}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {isHistoryView ? t.savedTitle : t.readingTitle}
          </h1>

          <p className="text-white/75 text-lg leading-8 max-w-2xl">
            {isHistoryView ? t.savedDesc : t.readingDesc}
          </p>

          {!isHistoryView && creditsLeft !== null && (
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm">
              <span>{t.creditsLeft}:</span>
              <span className="font-semibold">{creditsLeft}</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-6">
          <div className="rounded-[24px] border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
            <div className="text-sm uppercase tracking-[0.25em] text-purple-200 mb-3">
              {t.past}
            </div>
            <div className="text-2xl font-bold">{card1}</div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
            <div className="text-sm uppercase tracking-[0.25em] text-purple-200 mb-3">
              {t.present}
            </div>
            <div className="text-2xl font-bold">{card2}</div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
            <div className="text-sm uppercase tracking-[0.25em] text-purple-200 mb-3">
              {t.future}
            </div>
            <div className="text-2xl font-bold">{card3}</div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-2xl p-8 shadow-2xl mb-8">
          <div className="text-sm uppercase tracking-[0.25em] text-purple-200 mb-4">
            {t.interpretation}
          </div>

          <p className="whitespace-pre-line text-white/90 leading-8 text-lg">
            {reading}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <a
            href="/history"
            className="inline-block px-5 py-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            {t.backToHistory}
          </a>

          {!isHistoryView && (
            <a
              href={`/reading?mode=${mode}`}
              className="inline-block px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-[1.02] transition font-semibold"
            >
              {t.newReading}
            </a>
          )}

          <a
            href="/"
            className="inline-block px-5 py-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            {t.home}
          </a>
        </div>
      </div>
    </main>
  )
}

function ReadingPageFallback() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#120a24] via-[#24124d] to-[#12345f] text-white flex items-center justify-center px-6">
      <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl px-8 py-6 text-lg shadow-2xl">
        Loading...
      </div>
    </main>
  )
}

export default function ReadingPage() {
  return (
    <Suspense fallback={<ReadingPageFallback />}>
      <ReadingPageContent />
    </Suspense>
  )
}
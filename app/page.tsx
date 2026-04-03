"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Lang = "en" | "zh"

const copy = {
  en: {
    brand: "Moonveil Oracle",
    subtitle: "Tarot • Astrology • Bazi",
    credits: "Credits",
    welcome: "Welcome",
    guest: "Guest",
    history: "History",
    reading: "Reading",
    login: "Login",
    logout: "Logout",
    badge: "✦ Mystical guidance for your next chapter",
    hero1: "Reveal What The",
    hero2: "Universe Is Hiding",
    heroDesc:
      "Choose a reading mode and let the cards speak to your heart, your work, your money, or your whole path.",
    startGeneral: "Start General Reading",
    enterTemple: "Enter the Temple",
    modesTag: "Reading Modes",
    modesTitle: "Choose your focus",
    modesDesc:
      "Each mode shapes the interpretation in a different direction.",
    love: "Love",
    loveDesc:
      "Romance, longing, emotional connection, and relationship energy.",
    openLove: "Open Love Reading →",
    career: "Career",
    careerDesc:
      "Work direction, ambition, decisions, leadership, and growth.",
    openCareer: "Open Career Reading →",
    money: "Money",
    moneyDesc:
      "Abundance, security, spending, earning, and financial energy.",
    openMoney: "Open Money Reading →",
    general: "General",
    generalDesc:
      "Intuition, growth, timing, and overall life direction.",
    openGeneral: "Open General Reading →",
    tarotTitle: "Tarot Reading",
    tarotDesc:
      "Draw cards and reveal hidden messages surrounding your current path and emotional energy.",
    openCards: "Open the cards →",
    astroTitle: "Astrology Insight",
    astroDesc:
      "Discover your cosmic energy and how celestial timing influences your next chapter.",
    readStars: "Read the stars →",
    baziTitle: "Bazi Destiny",
    baziDesc:
      "Explore your eastern fate blueprint and gain deeper insight into long-term patterns.",
    revealChart: "Reveal your chart →",
    pricingTag: "Mystic Pricing",
    pricingTitle: "Unlock your next message",
    pricingDesc:
      "Start with one question or enter a recurring ritual for deeper guidance.",
    single: "Single Reading",
    singleDesc: "One mystical reading for a single question.",
    unlockOnce: "Unlock Once",
    weekly: "Weekly Oracle",
    weeklyDesc: "Unlimited weekly readings and recurring guidance.",
    openWeek: "Open the Week",
    monthly: "Monthly Oracle",
    monthlyDesc: "Unlimited monthly access for full spiritual support.",
    monthBtn: "Enter the Temple",
    popular: "Most Popular",
    langLabel: "Language",
  },
  zh: {
    brand: "Moonveil Oracle",
    subtitle: "塔罗 • 占星 • 八字",
    credits: "剩余次数",
    welcome: "欢迎",
    guest: "游客",
    history: "历史记录",
    reading: "开始占卜",
    login: "登录",
    logout: "退出登录",
    badge: "✦ 为你下一阶段带来神秘指引",
    hero1: "揭开宇宙",
    hero2: "隐藏的讯息",
    heroDesc:
      "选择你的占卜方向，让卡牌回应你的感情、事业、财运与人生道路。",
    startGeneral: "开始综合占卜",
    enterTemple: "进入神殿",
    modesTag: "占卜模式",
    modesTitle: "选择你的方向",
    modesDesc: "不同模式会生成不同风格的解读。",
    love: "感情",
    loveDesc: "爱情、暧昧、情绪连接、关系能量与内心渴望。",
    openLove: "进入感情占卜 →",
    career: "事业",
    careerDesc: "工作方向、 ambition、决定、领导力与成长机会。",
    openCareer: "进入事业占卜 →",
    money: "财运",
    moneyDesc: "金钱流动、安全感、收入、消费与物质稳定。",
    openMoney: "进入财运占卜 →",
    general: "综合",
    generalDesc: "直觉、成长、时机与整体人生方向。",
    openGeneral: "进入综合占卜 →",
    tarotTitle: "塔罗占卜",
    tarotDesc: "抽取卡牌，揭示围绕你当前道路与情绪状态的隐藏讯息。",
    openCards: "开始抽牌 →",
    astroTitle: "占星洞察",
    astroDesc: "探索你的宇宙能量，了解天体时机如何影响下一阶段。",
    readStars: "查看星象 →",
    baziTitle: "八字命盘",
    baziDesc: "探索你的东方命运蓝图，获得更深层的长期趋势洞察。",
    revealChart: "查看命盘 →",
    pricingTag: "价格方案",
    pricingTitle: "解锁下一条讯息",
    pricingDesc: "你可以从单次开始，也可以开启周期性的深度指引。",
    single: "单次占卜",
    singleDesc: "适合一个问题的一次神秘解读。",
    unlockOnce: "单次解锁",
    weekly: "每周神谕",
    weeklyDesc: "每周持续获得解读与周期性指引。",
    openWeek: "开启每周方案",
    monthly: "每月神谕",
    monthlyDesc: "整月无限制使用完整灵性支持。",
    monthBtn: "进入月度方案",
    popular: "最受欢迎",
    langLabel: "语言",
  },
} as const

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<number | null>(null)
  const [lang, setLang] = useState<Lang>("en")

  const t = copy[lang]

  useEffect(() => {
    const savedLang = window.localStorage.getItem("site_lang") as Lang | null
    if (savedLang === "en" || savedLang === "zh") {
      setLang(savedLang)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("site_lang", lang)
  }, [lang])

  useEffect(() => {
    const loadUserAndCredits = async () => {
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user ?? null
      setUser(currentUser)

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", currentUser.id)
          .maybeSingle()

        setCredits(profile?.credits ?? 0)
      } else {
        setCredits(null)
      }

      setLoading(false)
    }

    loadUserAndCredits()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", currentUser.id)
          .maybeSingle()

        setCredits(profile?.credits ?? 0)
      } else {
        setCredits(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCredits(null)
    window.location.href = "/"
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <style>{`
        .bg-layer {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(255, 215, 140, 0.14), transparent 18%),
            radial-gradient(circle at 80% 18%, rgba(168, 85, 247, 0.20), transparent 20%),
            radial-gradient(circle at 50% 75%, rgba(56, 189, 248, 0.12), transparent 24%),
            linear-gradient(135deg, #140b26 0%, #24124d 30%, #183a66 68%, #5a2c83 100%);
        }

        .glass {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .shine {
          background: linear-gradient(90deg, #f9f1c7, #ffffff, #d8b4fe);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .moon {
          position: absolute;
          top: 140px;
          right: 72px;
          width: 96px;
          height: 96px;
          border-radius: 9999px;
          background: radial-gradient(circle at 35% 35%, #fff8df, #f6dfa4 60%, #c79a48 100%);
          box-shadow:
            0 0 30px rgba(255, 225, 150, .4),
            0 0 70px rgba(255, 225, 150, .16);
          opacity: .92;
          pointer-events: none;
        }

        .moon::after {
          content: "";
          position: absolute;
          top: 8px;
          left: 24px;
          width: 80px;
          height: 80px;
          border-radius: 9999px;
          background: rgba(26, 10, 50, .92);
        }

        .mode-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 28px;
          transition: transform .25s ease, background .25s ease;
        }

        .mode-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.09);
        }

        .feature {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 28px;
          transition: transform .25s ease, background .25s ease;
        }

        .feature:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.09);
        }

        .price {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 26px;
          padding: 30px 24px;
          transition: transform .25s ease, background .25s ease;
        }

        .price:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.1);
        }

        .lang-select {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          border-radius: 9999px;
          padding: 10px 14px;
          outline: none;
        }

        .lang-select option {
          color: black;
        }
      `}</style>

      <div className="bg-layer" />
      <div className="moon hidden md:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <header className="mb-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold shine">{t.brand}</h1>
            <p className="text-sm opacity-70 tracking-[0.2em] uppercase mt-2">
              {t.subtitle}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4">
            {loading ? (
              <div className="px-5 py-2 rounded-full glass border border-white/10 text-sm">
                Loading...
              </div>
            ) : user ? (
              <>
                <div className="px-5 py-2 rounded-full glass border border-white/10 text-sm whitespace-nowrap">
                  {t.credits}: <span className="font-semibold">{credits ?? 0}</span>
                </div>

                <div className="px-5 py-2 rounded-full glass border border-white/10 text-sm whitespace-nowrap">
                  {user.email}
                </div>

                <Link
                  href="/history"
                  className="px-5 py-2 rounded-full glass border border-white/10 hover:bg-white/20 transition whitespace-nowrap"
                >
                  {t.history}
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full glass border border-white/10 hover:bg-white/20 transition whitespace-nowrap"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <div className="px-5 py-2 rounded-full glass border border-white/10 text-sm whitespace-nowrap">
                  {t.welcome}
                </div>

                <div className="px-5 py-2 rounded-full glass border border-white/10 text-sm whitespace-nowrap">
                  {t.guest}
                </div>

                <Link
                  href="/history"
                  className="px-5 py-2 rounded-full glass border border-white/10 hover:bg-white/20 transition whitespace-nowrap"
                >
                  {t.history}
                </Link>

                <Link
                  href="/login"
                  className="px-5 py-2 rounded-full glass border border-white/10 hover:bg-white/20 transition whitespace-nowrap"
                >
                  {t.login}
                </Link>
              </>
            )}

            <div className="flex items-center gap-3 px-5 py-2 rounded-full glass border border-white/10">
              <span className="text-sm whitespace-nowrap">{t.langLabel}</span>
              <select
                className="lang-select text-sm"
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        </header>

        <section className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm mb-6">
            {t.badge}
          </div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.05]">
            {t.hero1}
            <span className="block shine">{t.hero2}</span>
          </h2>

          <p className="text-lg md:text-xl opacity-80 mb-10 max-w-3xl mx-auto">
            {t.heroDesc}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/reading?mode=general"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-[1.02] transition shadow-lg font-semibold"
            >
              {t.startGeneral}
            </Link>

            {!user && (
              <Link
                href="/login"
                className="px-8 py-4 rounded-full glass border border-white/10 hover:bg-white/10 transition"
              >
                {t.enterTemple}
              </Link>
            )}
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-10">
            <div className="text-sm uppercase tracking-[0.25em] text-purple-200 mb-3">
              {t.modesTag}
            </div>
            <h3 className="text-4xl md:text-5xl font-bold mb-4 shine">
              {t.modesTitle}
            </h3>
            <p className="opacity-75 max-w-2xl mx-auto">{t.modesDesc}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Link href="/reading?mode=love" className="mode-card text-center block">
              <div className="text-4xl mb-4">💗</div>
              <h4 className="text-2xl font-bold mb-3">{t.love}</h4>
              <p className="opacity-75 mb-4 text-sm">{t.loveDesc}</p>
              <div className="text-pink-200 font-semibold">{t.openLove}</div>
            </Link>

            <Link href="/reading?mode=career" className="mode-card text-center block">
              <div className="text-4xl mb-4">💼</div>
              <h4 className="text-2xl font-bold mb-3">{t.career}</h4>
              <p className="opacity-75 mb-4 text-sm">{t.careerDesc}</p>
              <div className="text-blue-200 font-semibold">{t.openCareer}</div>
            </Link>

            <Link href="/reading?mode=money" className="mode-card text-center block">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-2xl font-bold mb-3">{t.money}</h4>
              <p className="opacity-75 mb-4 text-sm">{t.moneyDesc}</p>
              <div className="text-yellow-100 font-semibold">{t.openMoney}</div>
            </Link>

            <Link href="/reading?mode=general" className="mode-card text-center block">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-2xl font-bold mb-3">{t.general}</h4>
              <p className="opacity-75 mb-4 text-sm">{t.generalDesc}</p>
              <div className="text-purple-200 font-semibold">{t.openGeneral}</div>
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="feature">
            <div className="text-4xl mb-4">🔮</div>
            <h3 className="text-2xl font-bold mb-3">{t.tarotTitle}</h3>
            <p className="opacity-75 mb-4">{t.tarotDesc}</p>
            <Link href="/reading?mode=general" className="text-purple-200 font-semibold">
              {t.openCards}
            </Link>
          </div>

          <div className="feature">
            <div className="text-4xl mb-4">🌙</div>
            <h3 className="text-2xl font-bold mb-3">{t.astroTitle}</h3>
            <p className="opacity-75 mb-4">{t.astroDesc}</p>
            <Link href="/reading?mode=general" className="text-blue-200 font-semibold">
              {t.readStars}
            </Link>
          </div>

          <div className="feature">
            <div className="text-4xl mb-4">☯</div>
            <h3 className="text-2xl font-bold mb-3">{t.baziTitle}</h3>
            <p className="opacity-75 mb-4">{t.baziDesc}</p>
            <Link href="/reading?mode=general" className="text-yellow-100 font-semibold">
              {t.revealChart}
            </Link>
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-10">
            <div className="text-sm uppercase tracking-[0.25em] text-purple-200 mb-3">
              {t.pricingTag}
            </div>
            <h3 className="text-4xl md:text-5xl font-bold mb-4 shine">
              {t.pricingTitle}
            </h3>
            <p className="opacity-75 max-w-2xl mx-auto">{t.pricingDesc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="price text-center">
              <div className="text-lg mb-2 text-purple-100">{t.single}</div>
              <div className="text-5xl font-bold mb-4">$2.99</div>
              <p className="opacity-70 mb-6">{t.singleDesc}</p>
              <Link
                href="/tarot"
                className="inline-block px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 transition font-semibold"
              >
                {t.unlockOnce}
              </Link>
            </div>

            <div className="price text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-500 text-sm font-semibold">
                {t.popular}
              </div>
              <div className="text-lg mb-2 text-blue-100">{t.weekly}</div>
              <div className="text-5xl font-bold mb-4">$4.99</div>
              <p className="opacity-70 mb-6">{t.weeklyDesc}</p>
              <Link
                href="/tarot"
                className="inline-block px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition font-semibold"
              >
                {t.openWeek}
              </Link>
            </div>

            <div className="price text-center">
              <div className="text-lg mb-2 text-green-100">{t.monthly}</div>
              <div className="text-5xl font-bold mb-4">$9.99</div>
              <p className="opacity-70 mb-6">{t.monthlyDesc}</p>
              <Link
                href="/tarot"
                className="inline-block px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 transition font-semibold"
              >
                {t.monthBtn}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
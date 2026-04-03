"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function TarotPage() {
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
      }
    }

    getUser()
  }, [])

  const handleCheckout = async (priceId: string) => {
    if (!userId) {
      alert("Please login first")
      window.location.href = "/login"
      return
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to create checkout session")
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Something went wrong")
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <style>{`
        .sky {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 18%, rgba(255, 215, 140, 0.14), transparent 18%),
            radial-gradient(circle at 82% 16%, rgba(168, 85, 247, 0.20), transparent 20%),
            radial-gradient(circle at 50% 72%, rgba(56, 189, 248, 0.12), transparent 24%),
            linear-gradient(135deg, #140b26 0%, #24124d 30%, #183a66 68%, #5a2c83 100%);
          background-size: 140% 140%;
          animation: skyMove 16s ease-in-out infinite alternate;
        }

        @keyframes skyMove {
          0% { background-position: 0% 50%; transform: scale(1); }
          100% { background-position: 100% 50%; transform: scale(1.03); }
        }

        .glass {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .shine-text {
          background: linear-gradient(90deg, #f9f1c7, #ffffff, #d8b4fe);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .price-card {
          position: relative;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 28px;
          padding: 32px 24px;
          transition: transform .35s ease, box-shadow .35s ease, background .35s ease;
        }

        .price-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 0 36px rgba(168,85,247,.12),
            0 0 70px rgba(59,130,246,.08);
          background: rgba(255,255,255,0.09);
        }

        .price-card.popular {
          box-shadow: 0 0 40px rgba(96,165,250,.14);
        }
      `}</style>

      <div className="sky" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-yellow-200/15 text-sm text-yellow-100 mb-6">
            ✦ Choose your ritual ✦
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 shine-text">
            Tarot Reading
          </h1>

          <p className="text-white/75 max-w-2xl mx-auto text-lg">
            Select a mystical plan and unlock your personalized tarot guidance.
          </p >
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="price-card text-center">
            <div className="text-4xl mb-4">🔮</div>
            <div className="text-lg text-purple-100 mb-2">Single Reading</div>
            <div className="text-5xl font-bold mb-4">$2.99</div>
            <p className="text-white/68 mb-6">
              One mystical reading for a single question.
            </p >
            <button
              onClick={() => handleCheckout("price_1TI3fTCIsC9Bp9ELsxeqwqKU")}
              className="inline-block px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 transition font-semibold"
            >
              Unlock Once
            </button>
          </div>

          <div className="price-card popular text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold">
              Most Popular
            </div>
            <div className="text-4xl mb-4">🌙</div>
            <div className="text-lg text-blue-100 mb-2">Weekly Oracle</div>
            <div className="text-5xl font-bold mb-4">$4.99</div>
            <p className="text-white/68 mb-6">
              Unlimited weekly readings and recurring guidance.
            </p >
            <button
              onClick={() => handleCheckout("price_1TI3hICIsC9Bp9EL7WUJvKym")}
              className="inline-block px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition font-semibold"
            >
              Open the Week
            </button>
          </div>

          <div className="price-card text-center">
            <div className="text-4xl mb-4">✨</div>
            <div className="text-lg text-green-100 mb-2">Monthly Oracle</div>
            <div className="text-5xl font-bold mb-4">$9.99</div>
            <p className="text-white/68 mb-6">
              Unlimited monthly access for full spiritual support.
            </p >
            <button
              onClick={() => handleCheckout("price_1TI3iKCIsC9Bp9ELfBp0LH9y")}
              className="inline-block px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 transition font-semibold"
            >
              Enter the Temple
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  // 自动检测登录状态
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/")
      }
    }
    check()
  }, [router])

  const handleLogin = async () => {
    setMessage("")

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://https://moonveil-oracle.vercel.app"
      }
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Magic link sent ✨ Check your email")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">

      <div className="bg-black/60 backdrop-blur-xl border border-white/20 p-8 rounded-2xl w-[380px] text-center shadow-2xl">

        <div className="text-3xl mb-2">🌙</div>

        <h1 className="text-2xl font-semibold mb-2">
          Enter the Temple
        </h1>

        <p className="text-sm opacity-70 mb-6">
          Sign in to unlock your readings and save your history.
        </p >

        <input
          className="
          w-full
          p-3
          rounded-lg
          bg-black/80
          text-white
          border border-purple-400/40
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-purple-500/50
          transition
          "
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="
          w-full
          mt-4
          py-3
          rounded-lg
          bg-gradient-to-r
          from-purple-500
          to-indigo-500
          hover:scale-[1.02]
          transition
          shadow-lg
          "
        >
          Send Magic Link
        </button>

        {message && (
          <p className="mt-4 text-sm opacity-80">
            {message}
          </p >
        )}

      </div>

    </main>
  )
}
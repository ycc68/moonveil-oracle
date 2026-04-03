"use client"

import { useEffect, useState } from "react"

export default function SuccessPage() {
  const [message, setMessage] = useState("Processing your payment...")

  useEffect(() => {
    const applyCredits = async () => {
      const params = new URLSearchParams(window.location.search)
      const sessionId = params.get("session_id")

      if (!sessionId) {
        setMessage("Missing session id.")
        return
      }

      try {
        const res = await fetch("/api/apply-credits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        })

        const data = await res.json()

        if (!res.ok) {
          setMessage(data.error || "Failed to apply credits.")
          return
        }

        setMessage(`Payment successful. ${data.creditsAdded} credits added.`)
      } catch (error) {
        console.error(error)
        setMessage("Something went wrong while processing payment.")
      }
    }

    applyCredits()
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white px-6">
      <div className="max-w-xl text-center bg-white/10 border border-white/10 rounded-3xl p-8">
        <h1 className="text-4xl font-bold mb-4">Payment Success</h1>
        <p className="text-white/80 mb-6">{message}</p >

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href=" "
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
          >
            Go to Reading
          </a >

          <a
            href="/history"
            className="inline-block px-6 py-3 rounded-full bg-white/10 border border-white/10"
          >
            View History
          </a >
        </div>
      </div>
    </main>
  )
}
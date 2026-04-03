"use client"

import { useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TestPage() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.auth.getSession()

      console.log("SUPABASE TEST:", data, error)
    }

    test()
  }, [])

  return (
    <div style={{ padding: 40 }}>
      Supabase Test Page
    </div>
  )
}
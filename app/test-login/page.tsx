"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function TestLogin() {
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState("")

  const login = async () => {
    setMsg("sending...")

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    })

    if (error) {
      setMsg(error.message)
    } else {
      setMsg("email sent")
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        color: "white"
      }}
    >
      <div style={{ width: 300 }}>
        <h2>Supabase Test Login</h2>

        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="email"
          style={{
            width: "100%",
            padding: 10,
            background: "black",
            color: "white",
            border: "1px solid white"
          }}
        />

        <button
          onClick={login}
          style={{
            marginTop: 10,
            width: "100%",
            padding: 10
          }}
        >
          login
        </button>

        <p>{msg}</p >
      </div>
    </div>
  )
}
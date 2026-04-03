import { supabase } from "@/lib/supabase"

export async function requireUser(redirectTo = "/login") {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    window.location.href = redirectTo
    return null
  }

  return user
}
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const userId = session.metadata?.userId
    const priceId = session.metadata?.priceId

    if (!userId || !priceId) {
      return Response.json({ error: "Missing metadata" }, { status: 400 })
    }

    let addCredits = 0

    if (priceId === "price_1TI3fTCIsC9Bp9ELsxeqwqKU") addCredits = 1
    if (priceId === "price_1TI3hICIsC9Bp9EL7WUJvKym") addCredits = 7
    if (priceId === "price_1TI3iKCIsC9Bp9ELfBp0LH9y") addCredits = 30

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .maybeSingle()

    if (profileError) {
      return Response.json({ error: profileError.message }, { status: 500 })
    }

    const currentCredits = profile?.credits ?? 0

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        credits: currentCredits + addCredits,
      })
      .eq("id", userId)

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      creditsAdded: addCredits,
    })
  } catch (error) {
    console.error("Apply credits error:", error)
    return Response.json(
      { error: "Failed to apply credits" },
      { status: 500 }
    )
  }
}
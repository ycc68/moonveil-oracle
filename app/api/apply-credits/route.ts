import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey) {
      throw new Error("Missing STRIPE_SECRET_KEY")
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-06-20",
    })

    const { sessionId } = await req.json()

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const userId = session.metadata?.userId
    const priceId = session.metadata?.priceId

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let credits = 0

    if (priceId === "price_1") credits = 1
    if (priceId === "price_7") credits = 7
    if (priceId === "price_30") credits = 30

    const { data } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single()

    await supabase
      .from("profiles")
      .update({
        credits: (data?.credits || 0) + credits,
      })
      .eq("id", userId)

    return Response.json({ success: true })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "failed" }, { status: 500 })
  }
}
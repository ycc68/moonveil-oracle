import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json()

    if (!priceId || !userId) {
      return Response.json(
        { error: "Missing priceId or userId" },
        { status: 400 }
      )
    }

    const origin = new URL(req.url).origin

    const isSubscription =
      priceId === "price_1TI3hICIsC9Bp9EL7WUJvKym" ||
      priceId === "price_1TI3iKCIsC9Bp9ELfBp0LH9y"

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        priceId,
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tarot`,
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)

    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
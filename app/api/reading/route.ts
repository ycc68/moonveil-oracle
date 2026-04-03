export async function POST(req: Request) {
    const body = await req.json()
    const prompt = body.prompt
  
    return Response.json({
      text: `The cards reveal a powerful moment of inner change. ${prompt.includes("The Fool") ? "A new journey is opening before you. " : ""}${prompt.includes("The Moon") ? "Hidden emotions and intuition are guiding you. " : ""}${prompt.includes("The Emperor") ? "Structure, control, and stability will shape your next step. " : ""}Trust your instincts and move forward with courage.`
    })
  }

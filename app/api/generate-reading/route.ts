export async function POST(req: Request) {
    try {
      const { card1, card2, card3, mode, lang } = await req.json()
  
      if (!card1 || !card2 || !card3) {
        return Response.json({ error: "Missing cards" }, { status: 400 })
      }
  
      const safeLang = lang === "zh" ? "zh" : "en"
  
      const modePromptMap = {
        love: {
          en: "Focus on love, romance, emotional connection, longing, heartbreak, compatibility, and relationship energy.",
          zh: "重点围绕爱情、暧昧、情绪连接、思念、心碎、匹配度与关系能量来解读。",
        },
        career: {
          en: "Focus on career, ambition, work decisions, growth, opportunities, leadership, and professional direction.",
          zh: "重点围绕事业、野心、工作决定、成长机会、领导力与职业方向来解读。",
        },
        money: {
          en: "Focus on finances, abundance, scarcity, spending, earning, security, and material stability.",
          zh: "重点围绕财务、丰盛感、匮乏感、支出、收入、安全感与物质稳定来解读。",
        },
        general: {
          en: "Focus on overall life direction, emotional energy, intuition, personal growth, and spiritual guidance.",
          zh: "重点围绕整体人生方向、情绪能量、直觉、个人成长与灵性指引来解读。",
        },
      } as const
  
      const selectedMode =
        mode && modePromptMap[mode as keyof typeof modePromptMap]
          ? (mode as keyof typeof modePromptMap)
          : "general"
  
      const prompt =
        safeLang === "zh"
          ? `
  你是一位神秘而温柔的塔罗占卜师。
  
  请根据以下三张牌，写一段有情绪深度、具有灵性氛围的中文塔罗解读。
  
  占卜模式：${selectedMode}
  模式说明：${modePromptMap[selectedMode].zh}
  
  牌面：
  过去：${card1}
  现在：${card2}
  未来：${card3}
  
  要求：
  - 使用自然流畅的简体中文
  - 风格要温柔、神秘、细腻、有安抚感
  - 字数控制在 120 到 220 字左右
  - 自然提到三张牌
  - 不要使用项目符号
  - 不要写得像机器人
  - 让解读明显符合当前模式
  `
          : `
  You are a mystical tarot reader.
  
  Write a short but emotionally rich tarot reading based on these three cards.
  
  Reading mode: ${selectedMode}
  Mode guidance: ${modePromptMap[selectedMode].en}
  
  Cards:
  Past: ${card1}
  Present: ${card2}
  Future: ${card3}
  
  Requirements:
  - Write in English
  - Make it sound spiritual, warm, elegant, and insightful
  - 120 to 180 words
  - Mention all three cards naturally
  - Do not use bullet points
  - Do not sound robotic
  - Make the interpretation clearly fit the selected mode
  `
  
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          input: [
            {
              role: "system",
              content:
                safeLang === "zh"
                  ? "你是一位专业的塔罗占卜师，为高端灵性产品撰写优雅、神秘、细腻且富有情感洞察的中文解读。"
                  : "You are an expert tarot reader who writes elegant, mystical, emotionally intelligent readings for a premium spiritual app.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        console.error("OpenAI API error:", data)
        return Response.json(
          { error: data?.error?.message || "Failed to generate reading" },
          { status: 500 }
        )
      }
  
      let text = ""
  
      if (typeof data?.output_text === "string" && data.output_text.trim()) {
        text = data.output_text.trim()
      }
  
      if (!text && Array.isArray(data?.output)) {
        for (const item of data.output) {
          if (item?.type === "message" && Array.isArray(item?.content)) {
            for (const part of item.content) {
              if (part?.type === "output_text" && part?.text?.trim()) {
                text = part.text.trim()
                break
              }
            }
          }
          if (text) break
        }
      }
  
      if (!text) {
        text =
          safeLang === "zh"
            ? `在 ${card1}、${card2} 与 ${card3} 的能量之间，你正站在一个微妙的转折点。命运没有沉默，只是它正在用更安静的方式提醒你：真正的答案，正在你的内心慢慢浮现。`
            : `A veil of mystery surrounds ${card1}, ${card2}, and ${card3}. Their message is present, but not yet fully spoken. Stay still, listen inwardly, and the deeper meaning will reveal itself in time.`
      }
  
      return Response.json({ reading: text })
    } catch (error) {
      console.error("Generate reading error:", error)
      return Response.json(
        { error: "Failed to generate reading" },
        { status: 500 }
      )
    }
  }
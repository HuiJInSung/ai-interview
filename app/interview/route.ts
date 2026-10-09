const TOTAL_QUESTIONS = 3;

type ChatMessage = { role: "interviewer" | "candidate"; content: string };

type OpenAIMessage = { role: "system" | "user" | "assistant"; content: string };

const MODEL = "gpt-4o-mini";

async function callOpenAI(messages: OpenAIMessage[], json = false) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      ...(json && { response_format: { type: "json_object" } }),
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.choices[0].message.content as string;
}

function toOpenAIMessages(history: ChatMessage[]): OpenAIMessage[] {
  return history.map((m) => ({
    role: m.role === "interviewer" ? "assistant" : "user",
    content: m.content,
  }));
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "伺服器未設定 OPENAI_API_KEY" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const jobDescription: unknown = body?.jobDescription;
  const history: unknown = body?.messages ?? [];

  if (typeof jobDescription !== "string" || !jobDescription.trim()) {
    return Response.json({ error: "請提供職缺描述" }, { status: 400 });
  }
  if (
    !Array.isArray(history) ||
    !history.every(
      (m) =>
        (m?.role === "interviewer" || m?.role === "candidate") &&
        typeof m?.content === "string",
    )
  ) {
    return Response.json({ error: "對話格式錯誤" }, { status: 400 });
  }

  const messages = history as ChatMessage[];
  const answered = messages.filter((m) => m.role === "candidate").length;

  try {
    if (answered < TOTAL_QUESTIONS) {
      const system = `你是一位專業、友善的面試官，正在針對以下職缺面試候選人。
職缺描述：
"""
${jobDescription}
"""

規則：
- 本次面試共 ${TOTAL_QUESTIONS} 題，現在要提出第 ${answered + 1} 題。
- ${
        answered === 0
          ? "這是第一題，請先簡短打招呼，再提出與職缺相關的問題。"
          : "請根據候選人上一個回答決定：若回答不夠具體或值得深入，就追問；否則換一個新的面向出題。"
      }
- 一次只問一個問題，簡潔清楚，使用繁體中文。
- 不要在此時給出評分或評語。`;

      const question = await callOpenAI([
        { role: "system", content: system },
        ...toOpenAIMessages(messages),
      ]);

      return Response.json({
        type: "question",
        questionNumber: answered + 1,
        content: question,
      });
    }

    const system = `你是一位專業的面試官，剛完成以下職缺的 ${TOTAL_QUESTIONS} 題面試。
職缺描述：
"""
${jobDescription}
"""

請根據整段面試對話評估候選人，使用繁體中文，並只輸出以下格式的 JSON：
{
  "score": 0 到 100 的整數,
  "summary": "整體評語（2-3 句）",
  "strengths": ["優點1", "優點2"],
  "improvements": ["建議1", "建議2"]
}`;

    const raw = await callOpenAI(
      [{ role: "system", content: system }, ...toOpenAIMessages(messages)],
      true,
    );
    const evaluation = JSON.parse(raw);

    return Response.json({ type: "evaluation", ...evaluation });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "AI 面試官暫時無法回應，請稍後再試" }, { status: 502 });
  }
}

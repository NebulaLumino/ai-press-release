import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: "https://api.deepseek.com/v1" });

export async function POST(req: NextRequest) {
  try {
    const { company, announcement, audience, tone } = await req.json();
    const prompt = `Write a professional press release:\nCompany: ${company || "Company Name"}\nAnnouncement: ${announcement || "Major company news..."}\nTarget Audience: ${audience || "General public"}\nTone: ${tone || "Professional and newsworthy"}\n\nFormat with: Dateline, headline, subheadline, body paragraphs (Who, What, When, Where, Why), quote from spokesperson, boilerplate, and media contact.`;
    const completion = await client.chat.completions.create({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 1500, temperature: 0.5 });
    return NextResponse.json({ result: completion.choices[0]?.message?.content || "No output." });
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

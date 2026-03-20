import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { company, announcement, details, contactName, contactEmail } = await req.json();
    if (!company?.trim() || !announcement?.trim()) {
      return NextResponse.json({ error: "Company name and announcement are required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert PR copywriter with decades of experience writing press releases for tech companies. Follow AP style and standard press release format. Write newsworthy, journalist-ready releases.`,
        },
        {
          role: "user",
          content: `Write a complete press release:

**Company:** ${company}
**Announcement / News Angle:** ${announcement}
**Details:** ${details || "Provide key details, quotes, facts"}
**Media Contact:** ${contactName || "PR Contact"} | ${contactEmail || "press@company.com"}

Generate a complete press release with ALL of the following:

## Press Release Format:

### FOR IMMEDIATE RELEASE / FOR RELEASE [date]

[Location] — [Opening paragraph — who, what, when, where, why in journalistic inverted pyramid style]

[Second paragraph — expand on the news with context and significance]

### About ${company}
[A brief company boilerplate — 2-3 sentences on what the company does and its mission]

### Quote Section
Include 1-2 quotes:
- Executive quote (CEO or relevant VP) — forward-looking, enthusiastic, meaningful
- [Optional] Partner or customer quote

### Key Facts
Bullet list of the most newsworthy facts or stats

### About [Company Name] (boilerplate)
2-3 paragraph company description.

### Media Contact
${contactName || "PR Contact"}
${contactEmail || "press@company.com"}
[Company website]

---

### Media Notes (for the writer):
- Why this is newsworthy right now
- Suggested headline variants (3)
- Who journalists might want to follow up with
- Related topics/angles to explore

Write in AP style. No marketing jargon. Make it genuinely newsworthy.`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.62,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Press release generation failed." }, { status: 500 });
  }
}

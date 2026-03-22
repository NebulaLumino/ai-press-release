import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { companyName, announcementType, keyMessage, audience, quote, date } = await req.json();
    if (!companyName?.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    const userContent = [
      "Generate a professional press release for:",
      "",
      "**Company:** " + (companyName || "My Company"),
      "**Announcement Type:** " + (announcementType || "New product launch, funding, partnership, milestone, executive hire"),
      "**Key Message:** " + (keyMessage || "The most important thing to communicate"),
      "**Target Audience:** " + (audience || "Press, media, industry analysts, customers"),
      "**Quote:** " + (quote || "Quote from company founder/executive to include"),
      "**Date:** " + (date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Full Press Release",
      "Write a complete, professional press release following AP style:",
      "",
      "[CITY, STATE — DATE] — [LEAD PARAGRAPH: Who, what, when, where, why — in 1-2 compelling sentences]",
      "",
      "[BODY — organized by importance:]",
      "- Background and context on the announcement",
      "- Key details and specifics",
      "- Quote from company (founder, CEO, or relevant executive)",
      "- Quote from partner/customer/analyst if relevant",
      "- Market context or industry significance",
      "- How to learn more (URL, contact info)",
      "",
      "[ABOUT SECTION — boilerplate:]",
      "[Company name] is [one-line description]. Founded [year], [company name] helps [target customer] [key value prop]. Learn more at [website].",
      "",
      "## 2. Headline Options (5 variants)",
      "- Breaking news style",
      "- Benefit-led style",
      "- Quote-in-headline style",
      "- Question style",
      "- Data/stats-led style",
      "",
      "## 3. Subheadline Options (3 variants)",
      "One compelling supporting sentence for under the headline.",
      "",
      "## 4. Boilerplate",
      "Standard company description for media:",
      "- Short version (2-3 sentences)",
      "- Medium version (1 paragraph)",
      "- Media/press contact information",
      "",
      "## 5. Social Media Distribution Copy",
      "- Twitter/X (280 chars) with hashtags",
      "- LinkedIn post (professional tone)",
      "- Email pitch to journalists (subject + 2-3 sentence body)",
      "",
      "## 6. Media FAQ",
      "Anticipate 5-6 questions journalists will ask and provide suggested answers.",
      "",
      "## 7. Distribution Recommendations",
      "- Best channels to distribute this release",
      "- Target publications and journalists",
      "- Best time to send (day of week, time of day)",
      "- Follow-up strategy for journalists",
      "",
      "Write in proper AP style. Make it newsworthy and compelling. Avoid marketing language.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert PR strategist and press release writer." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Press release generation failed." }, { status: 500 });
  }
}

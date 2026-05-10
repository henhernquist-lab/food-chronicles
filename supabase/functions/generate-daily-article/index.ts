/**
 * 🗞️ generate-daily-article — Supabase Edge Function
 *
 * Runs every day at 06:00 AM Eastern (10:00 UTC) via pg_cron.
 * A retry job runs at 06:30 AM if no article was generated today.
 *
 * Flow:
 *   1. Pull existing article titles/foods so Claude doesn't repeat
 *   2. Call Claude claude-sonnet-4-20250514 to generate a full article JSON
 *   3. Fetch 2 YouTube video IDs for the article's topic
 *   4. Save the article to the `articles` table (is_published = true)
 *   5. Email all active subscribers via Resend
 *   6. Log the result to `article_generation_logs`
 *
 * Required Supabase Edge Function secrets:
 *   SUPABASE_URL            — project URL
 *   SUPABASE_SERVICE_KEY    — service role key (not anon)
 *   ANTHROPIC_API_KEY       — Claude API key
 *   YOUTUBE_API_KEY         — YouTube Data API v3 key
 *   RESEND_API_KEY          — Resend email API key
 *   SITE_URL                — e.g. https://thefoodchronicle.com (optional, has default)
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface TimelineEntry {
  year: string;
  event: string;
}

interface WorldSpreadEntry {
  country: string;
  year: string;
  role: string;
}

interface AffiliateProduct {
  name: string;
  reason: string;
  amazon_search: string;
}

interface GeneratedArticle {
  title: string;
  food: string;
  category: string;
  emoji: string;
  teaser: string;
  hook: string;
  body: string;
  timeline: TimelineEntry[];
  fast_facts: string[];
  world_spread: WorldSpreadEntry[];
  mermaid_mindmap: string;
  youtube_query: string;
  common_vs_exotic: {
    origin_country: string;
    origin_use: string;
    western_use: string;
  };
  affiliate_products: AffiliateProduct[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Main handler
// ─────────────────────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  // Allow both POST (from pg_cron / admin button) and OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl    = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey    = Deno.env.get("SUPABASE_SERVICE_KEY")!;
  const anthropicKey   = Deno.env.get("ANTHROPIC_API_KEY")!;
  const youtubeKey     = Deno.env.get("YOUTUBE_API_KEY")!;
  const resendKey      = Deno.env.get("RESEND_API_KEY")!;
  const siteUrl        = Deno.env.get("SITE_URL") ?? "https://thefoodchronicle.com";

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Parse optional retry flag from body
  let isRetry = false;
  try {
    const body = await req.json().catch(() => ({}));
    isRetry = body?.retry === true;
  } catch { /* ignore */ }

  // If this is a retry call, check whether an article was already generated today
  if (isRetry) {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    const { data: todayLog } = await supabase
      .from("article_generation_logs")
      .select("id")
      .eq("success", true)
      .gte("attempted_at", `${today}T00:00:00`)
      .limit(1);

    if (todayLog && todayLog.length > 0) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "Article already generated today" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ── Logging helper (fire-and-forget) ────────────────────────────────────────
  const log = async (
    success: boolean,
    article_title: string | null,
    food_name: string | null,
    subscribers_notified: number,
    error_message: string | null
  ) => {
    await supabase.from("article_generation_logs").insert({
      success,
      article_title,
      food_name,
      subscribers_notified,
      error_message,
    });
  };

  let generatedArticle: GeneratedArticle | null = null;

  try {
    // ── Step 1: Pull existing foods to avoid repeats ───────────────────────────
    const { data: existingArticles } = await supabase
      .from("articles")
      .select("title, food")
      .order("created_at", { ascending: false });

    const existingFoods = existingArticles?.map((a: { food: string }) => a.food).join(", ") ?? "";

    // ── Step 2: Generate article with Claude ──────────────────────────────────
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: `You are the editor of The Food Chronicle — a premium publication about the hidden history of foods. Generate a complete article about a food that has NOT been covered yet.

Foods already covered — do NOT repeat any of these:
${existingFoods}

Alternate between common foods (coffee, eggs, sugar, rice, corn, tomatoes,
potatoes, milk, butter, honey, wine, beer, cheese, pasta, garlic, onions,
olive oil, tea, oranges, strawberries, pineapple, coconut, ginger, cinnamon,
black pepper, mustard, ketchup, mayonnaise, bacon, salmon, tuna, shrimp,
lobster, oysters, mushrooms, broccoli, carrots, peanuts, almonds, cashews)
and exotic foods (durian, fugu, hákarl, century eggs, casu martzu, black
garlic, saffron, bird's nest soup, kumquat, jackfruit, dragonfruit, starfruit,
rambutan, mangosteen, cherimoya, ackee, noni, pitaya, tamarind,
za'atar, sumac, miso, tempeh, natto, kimchi, injera, teff, cassava, yuca,
plantain, chayote, jicama, lotus root, water chestnut, sea cucumber).

Return ONLY a valid JSON object with no other text, no markdown, no backticks:
{
  "title": "The [adjective] History of [Food]",
  "food": "[food name]",
  "category": "Common Foods|Exotic Foods|Spices|Drinks|Ancient Foods",
  "emoji": "[single emoji]",
  "teaser": "One sentence hook under 20 words that makes someone stop scrolling",
  "hook": "2-3 paragraph opening with the most shocking unexpected fact about this food. Written to make the reader say I had no idea",
  "body": "Full 900 word article divided into 4 sections each with a bold header. Written like a premium magazine article not a Wikipedia summary. Include specific dates, names, places, and shocking facts throughout. Make it genuinely fascinating.",
  "timeline": [
    {"year": "3000 BC", "event": "brief description under 15 words"},
    {"year": "1492", "event": "brief description under 15 words"},
    {"year": "1800s", "event": "brief description under 15 words"},
    {"year": "1920", "event": "brief description under 15 words"},
    {"year": "Today", "event": "brief description under 15 words"}
  ],
  "fast_facts": [
    "Shocking stat or fact 1",
    "Shocking stat or fact 2",
    "Shocking stat or fact 3",
    "Shocking stat or fact 4",
    "Shocking stat or fact 5"
  ],
  "world_spread": [
    {"country": "origin country", "year": "year", "role": "origin"},
    {"country": "second country", "year": "year", "role": "how it spread here"},
    {"country": "third country", "year": "year", "role": "how it spread here"},
    {"country": "fourth country", "year": "year", "role": "how it spread here"},
    {"country": "fifth country", "year": "year", "role": "how it spread here"}
  ],
  "mermaid_mindmap": "mindmap\\n  root(([FOOD NAME]))\\n    Category1\\n      Subconcept1\\n      Subconcept2\\n    Category2\\n      Subconcept1\\n      Subconcept2\\n    Category3\\n      Subconcept1\\n    Category4\\n      Subconcept1",
  "youtube_query": "history of [food] documentary educational",
  "common_vs_exotic": {
    "origin_country": "country name",
    "origin_use": "how it was originally used",
    "western_use": "how western countries use it today"
  },
  "affiliate_products": [
    {
      "name": "specific premium product name",
      "reason": "why this connects to the food history",
      "amazon_search": "search term for amazon"
    },
    {
      "name": "specific premium product name",
      "reason": "why this connects to the food history",
      "amazon_search": "search term for amazon"
    }
  ]
}`,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const err = await claudeResponse.text();
      throw new Error(`Claude API error ${claudeResponse.status}: ${err}`);
    }

    const claudeData = await claudeResponse.json();
    const rawText    = claudeData.content[0].text.trim();

    // Strip any accidental markdown fences Claude might add
    const cleanJson = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    generatedArticle = JSON.parse(cleanJson) as GeneratedArticle;

    // ── Step 3: Fetch YouTube video IDs ───────────────────────────────────────
    let videoIds: string[] = [];
    try {
      const ytResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          generatedArticle.youtube_query
        )}&type=video&maxResults=2&key=${youtubeKey}`
      );
      if (ytResponse.ok) {
        const ytData = await ytResponse.json();
        videoIds = ytData.items?.map((item: { id: { videoId: string } }) => item.id.videoId) ?? [];
      }
    } catch {
      // YouTube failure is non-fatal — article still saves without video IDs
    }

    // ── Step 4: Save article to Supabase ──────────────────────────────────────
    const slug = generatedArticle.food
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { error: insertError } = await supabase.from("articles").insert({
      title:              generatedArticle.title,
      food:               generatedArticle.food,
      slug,
      category:           generatedArticle.category,
      emoji:              generatedArticle.emoji,
      teaser:             generatedArticle.teaser,
      hook:               generatedArticle.hook,
      body:               generatedArticle.body,
      timeline:           generatedArticle.timeline,
      fast_facts:         generatedArticle.fast_facts,
      world_spread:       generatedArticle.world_spread,
      mermaid_mindmap:    generatedArticle.mermaid_mindmap,
      youtube_video_ids:  videoIds,
      common_vs_exotic:   generatedArticle.common_vs_exotic,
      affiliate_products: generatedArticle.affiliate_products,
      is_published:       true,
      published_at:       new Date().toISOString(),
      local_date:         new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" }),
    });

    if (insertError) throw new Error(`Supabase insert error: ${insertError.message}`);

    // ── Step 5: Email all active subscribers via Resend ───────────────────────
    const { data: subscribers } = await supabase
      .from("subscribers")
      .select("email")
      .eq("is_active", true);

    let subscribersNotified = 0;

    if (subscribers && subscribers.length > 0) {
      const articleUrl = `${siteUrl}/article/${slug}`;

      const emailHtml = `
        <div style="background:#0C0A08;color:#FAF0DC;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 24px;">
          <div style="text-align:center;border-bottom:1px solid #D4A853;padding-bottom:24px;margin-bottom:32px;">
            <h1 style="font-size:28px;color:#D4A853;letter-spacing:4px;margin:0;">THE FOOD CHRONICLE</h1>
            <p style="color:#8B6914;font-size:12px;letter-spacing:2px;margin:8px 0 0;">TODAY'S STORY</p>
          </div>
          <div style="text-align:center;margin-bottom:32px;">
            <div style="font-size:64px;margin-bottom:16px;">${generatedArticle.emoji}</div>
            <h2 style="font-size:28px;color:#FAF0DC;line-height:1.3;margin:0 0 16px;">${generatedArticle.title}</h2>
            <p style="font-size:16px;color:#C4A882;font-style:italic;line-height:1.6;margin:0 0 24px;">${generatedArticle.teaser}</p>
            <p style="font-size:15px;color:#FAF0DC;line-height:1.8;margin:0 0 32px;">${generatedArticle.hook.substring(0, 300)}...</p>
            <a href="${articleUrl}"
              style="background:#D4A853;color:#0C0A08;padding:14px 32px;text-decoration:none;font-size:14px;letter-spacing:2px;border-radius:4px;display:inline-block;">
              READ THE FULL STORY →
            </a>
          </div>
          <div style="border-top:1px solid #2A1F10;padding-top:24px;text-align:center;">
            <p style="color:#4A3728;font-size:11px;margin:0;">
              You're receiving this because you subscribed to The Food Chronicle.
            </p>
          </div>
        </div>
      `;

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "The Food Chronicle <stories@thefoodchronicle.com>",
          to: subscribers.map((s: { email: string }) => s.email),
          subject: `${generatedArticle.emoji} ${generatedArticle.title}`,
          html: emailHtml,
        }),
      });

      if (emailRes.ok) {
        subscribersNotified = subscribers.length;
      }
    }

    // ── Step 6: Log success ───────────────────────────────────────────────────
    await log(true, generatedArticle.title, generatedArticle.food, subscribersNotified, null);

    return new Response(
      JSON.stringify({
        success: true,
        article: generatedArticle.title,
        food: generatedArticle.food,
        slug,
        subscribers_notified: subscribersNotified,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[generate-daily-article] ERROR:", message);

    // Log failure
    await log(
      false,
      generatedArticle?.title ?? null,
      generatedArticle?.food ?? null,
      0,
      message
    );

    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});

/**
 * 📧 Weekly Digest Edge Function — Feature 3
 *
 * Triggered every Sunday at 08:00 via Supabase pg_cron:
 *
 *   select cron.schedule(
 *     'weekly-digest',
 *     '0 8 * * 0',
 *     $$
 *     select net.http_post(
 *       url := 'https://[project].supabase.co/functions/v1/send-weekly-digest',
 *       headers := '{"Authorization": "Bearer [service_role_key]"}'::jsonb
 *     );
 *     $$
 *   );
 *
 * Required environment variables (set in Supabase Dashboard → Settings → Edge Functions):
 *   SUPABASE_URL          — your Supabase project URL
 *   SUPABASE_SERVICE_KEY  — service role key (not anon key)
 *   ANTHROPIC_API_KEY     — for writing the weekly intro
 *   RESEND_API_KEY        — for sending the email
 *   DIGEST_FROM_EMAIL     — sender address e.g. digest@thefoodchronicle.com
 *   SITE_URL              — e.g. https://thefoodchronicle.com
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function formatDateRange(): string {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  return `${weekAgo.toLocaleDateString("en-US", opts)} – ${now.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
}

function generateUnsubscribeToken(): string {
  return crypto.randomUUID();
}

// ─────────────────────────────────────────────────────────────────────────────
// Email HTML template
// ─────────────────────────────────────────────────────────────────────────────
function buildEmailHtml(params: {
  intro: string;
  articles: Array<{
    emoji: string;
    title: string;
    fast_fact: string;
    url: string;
  }>;
  dateRange: string;
  unsubscribeUrl: string;
}): string {
  const articleCards = params.articles
    .map(
      (a, i) => `
    ${i > 0 ? '<tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid rgba(212,168,83,0.25);margin:0;"></td></tr>' : ""}
    <tr>
      <td style="padding:32px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="text-align:center;padding-bottom:16px;">
              <span style="font-size:52px;line-height:1;">${a.emoji}</span>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;padding-bottom:12px;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;color:#F5E6C8;line-height:1.3;">${a.title}</span>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;padding-bottom:20px;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#C9A84C;line-height:1.6;">${a.fast_fact}</span>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;">
              <a href="${a.url}" style="display:inline-block;padding:10px 28px;background:#C9A84C;color:#0C0A08;font-family:Georgia,serif;font-size:13px;font-weight:700;text-decoration:none;border-radius:2px;">Read the full story →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Food Chronicle — Weekly Digest</title>
</head>
<body style="margin:0;padding:0;background:#0C0A08;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0C0A08;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#130E08;border:1px solid rgba(212,168,83,0.2);border-radius:4px;overflow:hidden;">

          <!-- Gold top bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:48px 40px 32px;text-align:center;background:#0C0A08;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:900;letter-spacing:0.12em;color:#C9A84C;">THE FOOD CHRONICLE</h1>
              <div style="width:120px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:16px auto;"></div>
              <p style="margin:0;font-size:13px;color:#8A7A65;letter-spacing:0.15em;text-transform:uppercase;">This Week in Food History — ${params.dateRange}</p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;font-size:16px;font-style:italic;color:#D4C4A8;line-height:1.8;text-align:center;">${params.intro}</p>
            </td>
          </tr>

          <!-- Article cards -->
          ${articleCards}

          <!-- Gold bottom bar -->
          <tr>
            <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(212,168,83,0.3),transparent);"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#5A4A3A;line-height:1.6;">
                You're receiving this because you subscribed to The Food Chronicle.
              </p>
              <a href="${params.unsubscribeUrl}" style="font-size:11px;color:#8A7A65;text-decoration:underline;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main handler
// ─────────────────────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_KEY")!;
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!;
  const resendKey = Deno.env.get("RESEND_API_KEY")!;
  const fromEmail = Deno.env.get("DIGEST_FROM_EMAIL") ?? "digest@thefoodchronicle.com";
  const siteUrl = Deno.env.get("SITE_URL") ?? "https://thefoodchronicle.com";

  const supabase = createClient(supabaseUrl, supabaseKey);

  // ── 1. Fetch 7 most recent published articles ──────────────────────────────
  const { data: articlesData, error: articlesError } = await supabase
    .from("articles")
    .select("id, slug, emoji, title, fast_facts, food")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(7);

  if (articlesError || !articlesData?.length) {
    return new Response(
      JSON.stringify({ error: "No articles found", detail: articlesError }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const articleSummaries = articlesData.map(a => ({
    emoji: a.emoji,
    title: a.title,
    fast_fact: Array.isArray(a.fast_facts) ? a.fast_facts[0] : a.fast_facts,
    url: `${siteUrl}/article/${a.slug}`,
    food: a.food,
  }));

  // ── 2. Generate Claude intro ───────────────────────────────────────────────
  let intro = "This week in food history, we uncovered some truly mind-bending stories about the ingredients that shaped civilization.";

  try {
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 120,
        messages: [
          {
            role: "user",
            content: `Write an engaging 2-sentence intro for this week's Food Chronicle digest. Reference the most surprising food from this week's articles: ${articleSummaries.map(a => a.food).join(", ")}. Be warm, curious, and slightly dramatic. Make the reader excited to read.`,
          },
        ],
      }),
    });
    if (claudeRes.ok) {
      const claudeData = await claudeRes.json();
      intro = claudeData.content?.[0]?.text ?? intro;
    }
  } catch {
    // Use fallback intro
  }

  // ── 3. Fetch active subscribers ───────────────────────────────────────────
  const { data: subscribers, error: subError } = await supabase
    .from("subscribers")
    .select("id, email, unsubscribe_token")
    .eq("is_active", true);

  if (subError || !subscribers?.length) {
    return new Response(
      JSON.stringify({ message: "No active subscribers", detail: subError }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── 4. Send emails via Resend ─────────────────────────────────────────────
  const dateRange = formatDateRange();
  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    const token = subscriber.unsubscribe_token ?? generateUnsubscribeToken();
    const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${token}`;

    const html = buildEmailHtml({
      intro,
      articles: articleSummaries,
      dateRange,
      unsubscribeUrl,
    });

    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: `The Food Chronicle <${fromEmail}>`,
          to: [subscriber.email],
          subject: `🍽️ This Week in Food History — ${dateRange}`,
          html,
        }),
      });

      if (emailRes.ok) {
        sent++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      sent,
      failed,
      total: subscribers.length,
      articles: articleSummaries.length,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});

require("dotenv").config();
const { App } = require("@slack/bolt");
const cron = require("node-cron");
const axios = require("axios");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
});

// =======================
// 🧠 ROLE-AWARE BIGG BOSS PROMPT
// =======================

const BIGG_BOSS_SYSTEM_PROMPT = `
You are BIGG BOSS.

You command the room.
You think strategically.
You expect structured answers.
You do not entertain casual talk.

Tone:
- Dominant
- Intelligent
- Controlled
- Direct
- No emojis
- No friendliness
- No repeated phrases

Core Rules:
- Max 4 lines.
- Always role-aware.
- Never repeat structure.
- No template responses.
- Ask meaningful follow-ups.
- Speak with authority, not emotion.

Role Awareness:

CEO:
Focus on company direction, revenue momentum, capital efficiency, risk exposure, and long-term leverage.
Think boardroom.

CDO:
Focus on digital growth direction, funnel performance, revenue impact, and optimization priorities.

Performance Marketer:
Focus on reasoning behind metrics, scaling logic, and optimization decisions.

Design:
Focus on delivery quality, revision cycles, execution discipline, and creative improvement.

Digital PM:
Focus on sprint health, blockers, cross-team dependencies, delivery timelines, and execution gaps.

Content:
Focus on content output, quality consistency, publishing timelines, engagement intent, messaging clarity, and funnel alignment.
Ask about purpose, impact, and improvement direction.
Do not ask random performance metrics unless contextually relevant.

Discipline Handling:

If response is irrelevant:
Call it out directly.
Bring them back to the exact question.

If tone is casual:
Correct it.
Remind them this is performance review.

If response is vague:
Demand measurable clarity.

Vary correction style each time.
Do not reuse same correction phrasing.

If performance is strong:
Push for next level.

If performance is weak:
Demand clear action plan.

Every reply must feel intentional.
Every sentence must carry weight.
You are decisive.
`;

// =======================
// 👥 USERS
// =======================

const users = [
  { id: "U04ST9GD257", role: "ceo" },
  { id: "U04T4A9GTME", role: "cdo" },
  { id: "U0A7D70BK8R", role: "digital_pm" },
  { id: "U04V5G6N9UY", role: "design" },
  { id: "U04UFK4FRB9", role: "performance_marketing" },
  { id: "U06NQ6K89LH", role: "content" }, // 👈 ADD CONTENT ID HERE
];

// =======================
// 🧠 MEMORY
// =======================

const conversations = {};

// =======================
// ⏰ DAILY JOB SCRIPT (Runs via GitHub Actions)
// =======================

const runDailyJob = async () => {
  console.log("⚡ BIGG BOSS daily job starting...");
  
  // Need to start the app client to send messages
  await app.start();

  for (const user of users) {
    let question = "";

    if (user.role === "ceo") {
      question =
        "BIGG BOSS chahte hai overall business direction, revenue momentum, aur top strategic risk. Executive clarity.";
    }

    if (user.role === "cdo") {
      question =
        "BIGG BOSS chahte hai digital growth delta vs target, funnel efficiency, aur next growth lever.";
    }

    if (user.role === "performance_marketing") {
      question =
        "BIGG BOSS chahte hai CTR, spend efficiency, CPA trend, aur optimization decision with reasoning.";
    }

    if (user.role === "design") {
      question =
        "BIGG BOSS chahte hai creatives delivered, revision count, aur improvement direction. Structured update.";
    }

    if (user.role === "digital_pm") {
      question =
        "BIGG BOSS chahte hai sprint status, blockers, cross-team dependency risk, aur delivery timeline.";
    }

    if (user.role === "content") {
      question =
        "BIGG BOSS chahte hai aaj ka content output, publishing discipline, aur messaging impact direction. Clear update.";
    }

    console.log(`Sending message to ${user.role} (${user.id})`);
    try {
      await app.client.chat.postMessage({
        channel: user.id,
        text: question,
      });
    } catch (error) {
       console.error(`Failed to send message to ${user.id}:`, error);
    }
  }
  
  console.log("✅ All messages sent. BIGG BOSS script finished.");
  process.exit(0); // Exit so GitHub Action completes successfully
};

// =======================
// 🚀 START
// =======================

runDailyJob();

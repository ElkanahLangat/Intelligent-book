import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily/safely
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// AI Advisor API Endpoint
app.post("/api/advisor", async (req, res) => {
  try {
    const { chapterTitle, chapterSummary, userPrompt, startupContext, mode } = req.body;

    const ai = getAIClient();
    if (!ai) {
      // Graceful fallback response if key is not configured
      return res.json({
        advice: `[Author/Mentor Note] Since the GEMINI_API_KEY is not yet configured, here is a foundational lesson from "${chapterTitle || 'Startup Lessons'}": Focus relentlessly on talking to 5 real prospective users this week. Ask about the specific friction they experienced in their last real workflow rather than asking if they'd like your idea. Validate with past commitments and actual time/money spent.`,
        suggestedActions: [
          "Conduct 5 customer discovery interviews using The Mom Test principles",
          "Map out your primary retention cohort curve",
          "Calculate your net burn rate and current runway months"
        ]
      });
    }

    let systemInstruction = `You are a battle-tested Silicon Valley serial founder, Y Combinator mentor, and the author of the bestselling eBook "Startup Lessons: The Founder's Field Manual".
Your advice is pragmatic, direct, empathetic, and ruthlessly focused on product-market fit, retention, authentic customer demand, and avoiding common startup pitfalls.
Do NOT give generic cheerleading. Give concrete, actionable, high-signal guidance based on startup reality.`;

    let prompt = "";
    if (mode === "idea-audit") {
      prompt = `The founder is reading the chapter "${chapterTitle}".
Chapter Core Summary: ${chapterSummary}
Founder's Startup Idea / Concept: "${userPrompt}"
Startup Context: "${startupContext || 'Early stage'}"

Please analyze this startup concept strictly through the lens of this chapter's lessons.
Provide:
1. Brutal Reality Check & Pitfalls to watch out for
2. Key Assumption that must be proven first
3. 3-step immediate Action Plan to de-risk this within 7 days.

Format with clear headers and bullet points.`;
    } else if (mode === "chapter-qna") {
      prompt = `The founder is reading Chapter: "${chapterTitle}".
Chapter Summary: ${chapterSummary}
Founder's Question: "${userPrompt}"
Additional context: "${startupContext || 'None'}"

Provide a deep, authoritative answer based on startup principles, real-world case studies (like Airbnb, Stripe, Superhuman, Figma), and tactical advice. Keep it engaging, structured, and immediately applicable.`;
    } else {
      prompt = `Founder's request in chapter "${chapterTitle}": "${userPrompt}". Provide crisp, expert founder advice with 3 concrete next steps.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      advice: response.text || "Keep iterating on user feedback and focus on your core metrics.",
    });
  } catch (error: any) {
    console.error("AI Advisor Error:", error);
    res.status(500).json({
      error: "Failed to generate AI advice",
      details: error.message || "Unknown error",
      fallbackAdvice: "Always prioritize talking to customers over building in isolation. When in doubt, simplify your MVP and test the riskiest assumption first."
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Startup Lessons eBook server running on http://localhost:${PORT}`);
  });
}

startServer();

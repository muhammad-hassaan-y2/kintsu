# KINTSU — AI-Powered Correctional Rehabilitation Platform

> **"A single counselor. 150 inmates. 3 weeks until release. How do you stop someone from coming back?"**

---

## 💡 Inspiration: The 1:150 Crisis & The Golden Scar

In correctional facilities today, **67% of released individuals return to prison within three years**. 

Behind that statistic is an impossible human bottleneck: **a single counselor manages over 150 inmates**. Between endless administrative paperwork and crisis checks, counselors have less than 15 minutes a week per person. Inmates are handed generic, photocopied worksheets from the 1990s. But you cannot cure deep-seated trauma, acute anger triggers, or impulsive aggression with a generic piece of paper.

We named our platform **KINTSU** after *Kintsugi*—the ancient Japanese art of mending broken pottery with lacquer dusted in powdered gold. The philosophy is simple: **fractures are not flaws to hide; they are history that makes the vessel stronger**. 

We built KINTSU to do the same for correctional rehabilitation: turning fragmented institutional records into personalized, gold-standard cognitive behavioral therapy (CBT) that permanently breaks the cycle of recidivism.

---

## 🎯 What It Does: Turning Prison Data into Human Transformation

KINTSU is an intelligent rehabilitation operating system that gives every counselor the power of an expert clinical team:

1. **🧠 AI Rehabilitation Session Builder**: A counselor selects an inmate (e.g., *Marcus Vance, Block 4B, High Risk*). In under 2 seconds, KINTSU pulls his profile and case notes to synthesize a customized 4-step CBT curriculum complete with emotional grounding drills, trigger audits, and clinical action plans.
2. **🎭 Real-Time Conflict De-escalation Simulator**: De-escalation cannot be learned from a book—it must be practiced under pressure. KINTSU simulates realistic prison friction points (cellmate disputes, contraband peer pressure, dining hall provocations) and scores each dialogue turn on **De-escalation (0–100)** and **Empathy**, coaching inmates on active listening.
3. **📋 Living Case Notes Timeline**: Every behavioral breakthrough, counseling check, or incident note is permanently logged in Neon PostgreSQL. Crucially, **these notes feed directly into the AI’s next prompt chain**, creating an evolving memory that adapts as the inmate grows.
4. **📊 Instant Parole & Progress Reporting**: Generates real-time SVG behavioral trend lines and 1-click downloadable CSVs and print-ready PDF progress summaries for parole hearings and facility reviews.
5. **🔒 Institutional Security**: A strict 5-minute session auto-logout countdown timer and automatic demo session isolation protect sensitive prisoner records.

---

## 🛠️ How We Solved the Hard Engineering Problems

| The Real-World Challenge | Our Technical Solution |
| :--- | :--- |
| **Generic AI Hallucinations**: LLMs default to shallow motivational clichés instead of clinical therapy. | **LangChain Dynamic Context Ingestion**: We built structured `PromptTemplate` pipelines that inject live custody data (risk classification, security unit, prior case notes) as dynamic context memory into **Google GenAI `gemini-2.5-flash`** with strict JSON schema enforcement (`response_mime_type="application/json"`). |
| **Dual-Stack Serverless Deployment**: Hosting Next.js 15 alongside Python FastAPI without expensive dedicated servers. | **Unified Vercel ASGI Monorepo**: Engineered `api/index.py` and `vercel.json` rewrites that execute all FastAPI routes serverlessly under `/api/*` on Vercel, sharing the same domain with 0 CORS overhead. |
| **Lost Clinical Continuity**: Notes written by case workers typically die in paper files. | **Neon PostgreSQL Evolving Feedback Loop**: Structured SQLAlchemy models (`prisoner_files`, `case_notes`, `sessions`) query and update live records, ensuring prior counseling notes actively reshape future AI curriculum generation. |
| **Zero-Latency In-Facility Use**: Slow AI prompts disrupt live classroom flow. | **Gemini 2.5 Flash Optimization**: Generating multi-step clinical modules and turn-by-turn dialogue evaluations in **under 2.2 seconds**. |

---

## 🏆 Accomplishments We're Proud Of

- **100% Dynamic, Zero-Mock Platform**: Every inmate file, scheduled classroom session, case note timeline entry, and SVG chart point is powered live by **Neon PostgreSQL**.
- **Real Clinical Value**: We worked with forensic psychology CBT frameworks (Stop-Think-Act, 5-4-3-2-1 Grounding) rather than superficial chat bots.
- **Dignified & Beautiful Interface**: A bespoke metallic midnight navy (`#0A1628`) and radiant gold (`#C9A227`) design system that treats rehabilitation with clinical dignity.
- **Production-Ready & Fully Deployed**: 8/8 static pages compiling cleanly on Next.js 15 App Router, coupled with a serverless FastAPI backend.

---

## 🚀 What We Learned

- **Context Memory is Everything**: In institutional settings, an AI is only as safe as its grounding. Injecting real counselor observations transformed the AI from a generic chatbot into an authentic rehabilitation partner.
- **Design Drives Rehabilitation**: When interfaces look institutional and punitive, participants disengage. When interfaces look dignified and thoughtful, engagement surges.

---

## 🔮 What's Next for KINTSU

- **🎙️ Real-Time Voice De-escalation**: Leveraging the Gemini Multimodal Live Audio API so residents can speak directly into microphones during roleplay, receiving feedback on vocal cadence, stress pitch, and verbal pacing.
- **📱 Secure Tablet PWA**: Local-first offline caching for deployment on air-gapped correctional tablets.
- **🤝 Detention Pilot Partnerships**: Piloting KINTSU with county juvenile centers and community re-entry non-profits to measure real-world reduction in recidivism.

---

### 💻 Tech Stack
`Next.js 15` · `TypeScript` · `Python 3.12` · `FastAPI` · `Google Gemini 2.5 Flash` · `LangChain Core` · `Neon PostgreSQL` · `SQLAlchemy` · `Tailwind CSS` · `Vercel Serverless`

Repository: [`https://github.com/muhammad-hassaan-y2/kintsu.git`](https://github.com/muhammad-hassaan-y2/kintsu.git)

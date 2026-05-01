# 🗳️ VoteWise — AI-Powered Civic Command Center

> Your personalized, AI-driven roadmap to an informed vote. Built with Next.js, Tailwind CSS, and Google Gemini AI.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🏠 Smart Dashboard
- **Quick Stats** — Country, location, voter status, and age at a glance
- **Election Countdown** — Live countdown timer to the next election in your country
- **Readiness Checklist** — Country-specific document checklist with progress tracking
- **Election Timeline** — Visual phase tracker (Awareness → Nomination → Polling)
- **Election News Feed** — Curated, country-specific election news
- **Quick Actions** — One-tap access to Fact Check and Learn tools

### 🧭 AI Voting Journey
- **Personalized Roadmap** — AI generates a step-by-step voting plan tailored to your location, age, and registration status
- **Actionable Links** — Direct links to official election resources (e.g., voters.eci.gov.in, vote.gov)
- **Regeneration** — Refresh your roadmap anytime

### 📚 Knowledge Center
- **AI Civic Explainer** — Ask any civic concept and get explanations at Simple, Detailed, or Expert level
- **Popular Topics** — Pre-loaded country-specific civic topics (Lok Sabha, Electoral College, etc.)
- **Related Concepts** — Explore connected topics with one click
- **Manifesto Decoder** — Paste any political manifesto and get a neutral AI summary

### 🛡️ Safety & Verification
- **AI Fact Checker** — Paste any news article or social media post to verify accuracy
- **Confidence Scoring** — See how confident the AI is in its assessment
- **Misinformation Stats** — Visual stats on election misinformation trends

### 🏆 Civic Quiz
- **8 Country-Specific Questions** — Test your civic knowledge with India-specific or general questions
- **Instant Feedback** — See correct answers with detailed explanations
- **Score Grading** — Civic Champion 🏆, Informed Citizen ⭐, Growing Learner 📚, or Civic Beginner 🌱
- **Visual Answer Breakdown** — See your performance at a glance

### 🎨 Premium Design
- **Dark Glassmorphism** — Stunning dark mode with frosted glass effects
- **Animated Gradients** — Floating orb background animations
- **Micro-Animations** — Hover effects, staggered entry, pulse indicators
- **Gradient Accents** — Purple-to-teal gradient system throughout
- **Mobile-First** — Fully responsive with bottom navigation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Google Gemini API Key](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/aayushsinha30/voter-.git
cd voter-

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Start development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

### Environment Variables

Create a `.env` file in the root:
```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework with App Router |
| **Tailwind CSS 3** | Utility-first styling |
| **Google Gemini AI** | AI-powered civic tools |
| **Genkit** | AI orchestration framework |
| **Radix UI** | Accessible component primitives |
| **Lucide Icons** | Beautiful icon library |
| **TypeScript** | Type safety |

---

## 📁 Project Structure

```
src/
├── ai/
│   ├── flows/           # AI flow definitions
│   │   ├── civic-concept-explainer-flow.ts
│   │   ├── manifesto-summarizer-flow.ts
│   │   ├── misinformation-checker-flow.ts
│   │   └── personal-voting-roadmap-flow.ts
│   └── genkit.ts        # Genkit AI configuration
├── app/
│   ├── journey/         # AI Roadmap page
│   ├── learn/           # Knowledge Center page
│   ├── tools/           # Safety & Verification page
│   ├── quiz/            # Civic Quiz page
│   ├── lib/             # User store (localStorage)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home dashboard
│   └── globals.css      # Design system
├── components/
│   ├── civic/           # Civic Explainer
│   ├── layout/          # TopBar, BottomNav
│   ├── manifesto/       # Manifesto Decoder
│   ├── safety/          # Misinfo Checker
│   ├── voting/          # Onboarding, Checklist, Countdown, etc.
│   └── ui/              # Radix-based UI primitives
└── hooks/               # Custom React hooks
```

---

## 🌍 Supported Countries

- 🇮🇳 India
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇨🇦 Canada
- 🇦🇺 Australia
- 🇩🇪 Germany
- 🇫🇷 France
- 🇧🇷 Brazil
- 🇯🇵 Japan
- 🇰🇷 South Korea

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for democracy.**

export interface KnowledgeDataset {
  id: string;
  name: string;
  category: string;
  content: string;
  suggestedQuestions: string[];
}

export const DEFAULT_DATASETS: KnowledgeDataset[] = [
  {
    id: 'startup-metrics',
    name: 'SaaS Pitch & Unit Economics',
    category: 'Startup',
    content: `Company: NexusFlow Inc.
Product: Asynchronous team knowledge engine & workflow hub
Target Market: Remote-first tech companies (50-500 employees)
Total Addressable Market (TAM): $14.2 Billion globally

Unit Economics & Traction:
- Monthly Recurring Revenue (MRR): $42,500 (+18% MoM)
- Gross Margin: 82%
- Customer Acquisition Cost (CAC): $1,450
- Lifetime Value (LTV): $8,700
- LTV / CAC Ratio: 6.0x (Top quartile SaaS benchmark)
- Net Revenue Retention (NRR): 118%
- Current Cash Runway: 14.5 months at $35k/mo net burn
- Primary Growth Channel: Product-led viral referrals and interactive engineering blogs

Key Risk & Milestones:
- Main threat: Slack / Notion native feature convergence
- Q4 Milestone: Release AI Knowledge-Base integration to lift contract ACV from $3k to $9k.`,
    suggestedQuestions: [
      "What is the company's LTV/CAC ratio and gross margin?",
      "How many months of cash runway remain?",
      "What is the primary risk and the Q4 milestone?"
    ]
  },
  {
    id: 'note-ipynb-orion',
    name: 'Project Orion (from note.ipynb)',
    category: 'Space & Tech',
    content: `Project Orion is a secret space exploration mission launching in November 2027.
The mission commander is Captain Alex Mercer.
The target destination is Europa, a moon of Jupiter, looking for water ice.
The trip will take exactly 3 years using advanced ion propulsion engines.
The mission payload includes an autonomous robotic submersible probe to melt through the outer ice crust.`,
    suggestedQuestions: [
      "Who is the mission commander and when is the launch date?",
      "What is the target destination and what are they looking for?",
      "How long will the trip take and what propulsion is used?"
    ]
  },
  {
    id: 'wealth-psychology',
    name: 'Wealth Compounding & Runway Rules',
    category: 'Wealth',
    content: `The Psychology of Wealth: Internal Operating Principles

Principle 1: Wealth vs Prestige
Prestige is spent cash; wealth is unspent freedom. When a startup achieves liquidity, the primary risk is lifestyle creep that forces the founder back into high-burn dependency.

Principle 2: The Freedom Dividend
Maintain 24 months of personal living expenses in liquid, low-volatility assets completely decoupled from company valuation. This psychological safety net allows high-conviction risk-taking without fear of destitution.

Principle 3: Asymmetric Compounding
Warren Buffett generated over 99% of his net worth after his 50th birthday. Endurance and avoiding catastrophic downfalls matters more than chasing speculative 100x gains.`,
    suggestedQuestions: [
      "What is the difference between wealth and prestige?",
      "How many months of liquid expenses does the rule advise?",
      "Why is endurance more critical than chasing speculative 100x returns?"
    ]
  }
];

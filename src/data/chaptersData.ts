import { Chapter } from '../types';

export const EBOOK_METADATA = {
  title: "Startup Lessons: The Founder's Field Manual",
  subtitle: "Hard-Won Principles on Idea Validation, Product-Market Fit, Unit Economics, and Resilience",
  edition: "2026 Founder Edition",
  author: "Venture Insights & Founder Collective",
  totalChapters: 8,
  estimatedTotalReadTime: 42,
  description: "A battle-tested, no-nonsense tactical guide for early-stage and venture-backed founders navigating the messy journey from zero to product-market fit."
};

export const CHAPTERS: Chapter[] = [
  {
    id: "intro",
    number: 0,
    title: "Introduction: The Asymmetry of Startups",
    subtitle: "Why Startups Exist, The Cost of Delusion, and The Survival Mindset",
    readTimeMinutes: 4,
    category: "Foundation",
    summary: "Startups are not smaller versions of large companies; they are temporary search engines designed to discover a repeatable, scalable business model before running out of cash.",
    introQuote: {
      quote: "A startup is an institution designed to deliver a new product or service under conditions of extreme uncertainty.",
      author: "Eric Ries, The Lean Startup"
    },
    sections: [
      {
        id: "intro-1",
        title: "The Physics of Zero to One",
        paragraphs: [
          "Every year, hundreds of thousands of founders embark on building software, hardware, or consumer services. Within three years, over 90% of them quietly shut down. The common post-mortem lists reasons like running out of money, hiring the wrong people, or fierce competition.",
          "These reasons are almost always symptoms, not the root disease. The ultimate killer of startups is building something that people simply do not desperately need. Founders fall in love with their clever solutions rather than the agonizing problems of their users.",
          "A startup is fundamentally an asymmetric bet. Your downside is capped at the capital and time you invest, while your upside is theoretically non-linear. However, asymmetry works in your favor only if you survive long enough to iterate into truth."
        ],
        pullQuote: {
          text: "Most startups don't die from competition; they die from suicide by building things nobody wants.",
          author: "Paul Graham",
          role: "Co-Founder, Y Combinator"
        },
        keyTakeaways: [
          "Startups are temporary search experiments, not steady-state enterprises.",
          "Premature scaling (hiring or spending before product-market fit) accounts for 74% of startup failures.",
          "Your sole competitive advantage as an early-stage startup is speed of learning cycles per unit of capital."
        ]
      },
      {
        id: "intro-2",
        title: "The Founder's First Principle: Truth Over Comfort",
        paragraphs: [
          "The most dangerous trap for an entrepreneur is self-delusion. In the early days, you are surrounded by polite friends, enthusiastic family members, and non-committal investors who praise your deck. None of these constitute validation.",
          "Real validation is brutally binary: do customers sacrifice their scarce time, rewire their existing broken habits, and repeatedly swipe their credit card to keep using what you built?",
          "This field manual collects the painful, hard-won lessons from founders who survived the 'Trough of Sorrow'—the desolate period between initial launch hype and actual organic traction."
        ],
        checklist: [
          "Accept that your initial product hypothesis is almost certainly 50% wrong.",
          "Commit to measuring real behaviors (usage, retention, payment) rather than polite opinions.",
          "Protect your runway: every dollar saved is another day of learning."
        ]
      }
    ],
    actionPlan: [
      "Write down the single riskiest assumption your startup is making right now.",
      "Identify the exact metric that will prove or disprove that assumption within 14 days.",
      "Eliminate every non-essential product feature that does not directly test this core hypothesis."
    ]
  },
  {
    id: "ch-1-problem-validation",
    number: 1,
    title: "Chapter 1: The Problem Space & Idea Validation",
    subtitle: "Hunting for 'Hair-on-Fire' Problems & Avoiding the Vitamin Trap",
    readTimeMinutes: 6,
    category: "Foundation",
    summary: "Great startups start with urgent, painful, and frequent problems. Learn how to distinguish between nice-to-have vitamins and mission-critical painkiller solutions.",
    introQuote: {
      quote: "Fall in love with the problem, not your solution.",
      author: "Uri Levine, Co-founder of Waze"
    },
    sections: [
      {
        id: "ch1-1",
        title: "The Vitamin vs. Painkiller Dilemma",
        paragraphs: [
          "Founders frequently mistake an interesting capability for a viable business. They create tools that are 'cool' or 'convenient'—vitamins that improve life slightly on good days. But when budgets tighten or cognitive overload sets in, vitamins are discarded instantly.",
          "Painkillers, by contrast, address urgent, visceral bleeding. If a user's hair is on fire, they will not evaluate whether your bucket of water has a sleek UI, whether it supports OAuth 2.0, or whether it costs $10 vs $50. They will grab the bucket and pour it over their head.",
          "The best startup ideas combine three traits: high frequency (occurs daily or weekly), high pain (costs significant revenue, time, or compliance risk), and urgent timing (must be solved this quarter)."
        ],
        warStory: {
          company: "Segment (formerly ClassMap & Segment.io)",
          outcome: "Pivot",
          headline: "From 2 Failed Products to a $3.2B Acquisition",
          lesson: "The team burned through half their seed money building a classroom analytics tool and an idea-voting app that nobody used. Desperate, they open-sourced a tiny 500-line JavaScript library they built for internal tracking. The repo exploded on Hacker News. They immediately pivoted the entire company to that tiny snippet.",
          founder: "Peter Reinhardt",
          quote: "We spent months building things we thought were brilliant. Our real business came from a 500-line utility we made just to solve our own annoying data pipeline headache."
        },
        pullQuote: {
          text: "If you have to convince someone they have a problem, you are not in the painkiller business. You are in the education business.",
          author: "Michael Seibel",
          role: "Managing Director, Y Combinator"
        },
        keyTakeaways: [
          "Urgency trumps addressable market size in the seed stage: 100 people who love you beats 10,000 who vaguely like you.",
          "Look for existing 'duct-tape' solutions: spreadsheets, Zapier workarounds, and manual copy-pasting are huge signal indicators.",
          "Validate before writing code: letters of intent (LOIs), pre-orders, and deposits prove real demand."
        ]
      },
      {
        id: "ch1-2",
        title: "The Counter-Intuitive Truth About Big Competitors",
        paragraphs: [
          "Novice founders often panic when they discover an established incumbent in their target space. However, the total absence of competition is rarely a sign of genius; it is usually evidence of a market graveyard.",
          "Incumbents are constrained by their best customers. They cannot radically simplify their interface, slash prices, or cater to underserved niches without jeopardizing their core legacy revenue. This is the classic Innovator's Dilemma.",
          "Your strategy is not to beat the incumbent everywhere. It is to find a singular, wedge use-case where the incumbent is slow, bloated, or indifferent—and be 10x faster, simpler, or more specialized."
        ],
        checklist: [
          "Map out the existing manual workarounds your target customer uses today.",
          "Confirm the buyer has an existing allocated budget or measurable loss caused by the problem.",
          "Test willingness to pay before writing line one of production code."
        ]
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Which of the following is the strongest indicator of genuine problem-market demand?",
        options: [
          "50 people signed up on a beautiful waiting list after seeing a tweet.",
          "An enterprise lead signs a binding pre-order contract with a refundable deposit on a prototype.",
          "A friend at a major tech company says 'This looks awesome, I'd totally use it'.",
          "You received an award at a local startup hackathon."
        ],
        correctIndex: 1,
        explanation: "Capital commitments (deposits, paid pilots, LOIs with penalties) require real sacrifice and provide unassailable proof of urgency.",
        founderTakeaway: "Never confuse verbal enthusiasm with economic commitment."
      },
      {
        id: "q2",
        question: "What is the primary danger of building a 'Vitamin' startup?",
        options: [
          "Competitors will steal your idea too quickly.",
          "Users will stop using it the moment their workflow gets busy or budgets get trimmed.",
          "Cloud hosting bills will scale faster than revenue.",
          "Venture capitalists only invest in hardware."
        ],
        correctIndex: 1,
        explanation: "Vitamins do not solve urgent bleeding. During budget cuts or busy periods, nice-to-have tools are the first items cancelled.",
        founderTakeaway: "Search for hair-on-fire problems where inaction costs the buyer real money or pain."
      }
    ],
    actionPlan: [
      "Interview 5 potential buyers this week without pitching your solution once.",
      "Ask them: 'How do you currently solve this problem, and what did you spend on it last year?'",
      "If they haven't actively tried to solve it in the past 6 months, discard the hypothesis."
    ]
  },
  {
    id: "ch-2-pmf",
    number: 2,
    title: "Chapter 2: The Elusive Product-Market Fit (PMF)",
    subtitle: "Retention Curves, The Sean Ellis 40% Rule, and Scaling Too Early",
    readTimeMinutes: 7,
    category: "Product",
    summary: "Product-Market Fit is not a feeling or a launch milestone; it is a mathematical reality evidenced by flattening retention curves and organic word-of-mouth.",
    introQuote: {
      quote: "Product/market fit means being in a good market with a product that can satisfy that market.",
      author: "Marc Andreessen, Netscape & a16z"
    },
    sections: [
      {
        id: "ch2-1",
        title: "The Math of Retention: Flattening the Curve",
        paragraphs: [
          "The single greatest metric in all of software is cohort retention. If you plot active users over time (Day 1, Day 7, Day 30, Day 90), an unviable product will show a retention line asymptotically approaching zero.",
          "Pouring marketing dollars or hiring salespeople into a leaky bucket is the fastest way to incinerate venture capital. Until your cohort curve flattens out—meaning a loyal core of users continues using the product indefinitely—you do not have PMF.",
          "When retention flattens at 25% or 30%, you have discovered a beachhead. Your job is not to expand features for everyone; it is to figure out what those retained 30% have in common and double down on their specific use-case."
        ],
        framework: {
          type: "pmf-score",
          title: "The Sean Ellis PMF Test Calculator",
          subtitle: "Interactive Customer Disappointment Benchmark",
          description: "Survey your active users with the question: 'How would you feel if you could no longer use this product?' If ≥40% answer 'Very Disappointed', you have achieved Product-Market Fit."
        },
        pullQuote: {
          text: "When you have PMF, the customers are pulling the product out of your hands. You are struggling to keep the servers up.",
          author: "Andy Rachleff",
          role: "Co-Founder, Benchmark & Wealthfront"
        },
        keyTakeaways: [
          "Retention is king: no amount of top-of-funnel acquisition can compensate for zero Day-90 retention.",
          "The Sean Ellis 40% 'Very Disappointed' threshold is the industry gold-standard leading indicator.",
          "Do things that don't scale: manually onboard your first 100 users to observe their friction points in real-time."
        ]
      },
      {
        id: "ch2-2",
        title: "False PMF and The Vanity Metric Trap",
        paragraphs: [
          "Many founders deceive themselves with top-line vanity metrics: total registered users, press mentions, App Store downloads, or gross pageviews. None of these reflect value creation.",
          "A startup with 10,000 signups and 99% monthly churn is dead on arrival. A startup with 200 signups who use the tool 5 times a day and aggressively complain whenever the API is down has a billion-dollar seed.",
          "Look for organic pull: are users referring colleagues without referral bonuses? Are they integrating your tool into their daily operational heartbeat?"
        ],
        warStory: {
          company: "Superhuman",
          outcome: "Success",
          headline: "Using the PMF Engine to Turn 22% into 58%",
          lesson: "When Rahul Vohra surveyed early users, only 22% said they would be 'very disappointed' without Superhuman. Instead of panicking, they segmented the data, filtered out lukewarm respondents, and focused exclusively on the subset who loved speed. By systematically building for that high-frequency profile, they drove the score past 58%.",
          founder: "Rahul Vohra",
          quote: "If you try to make everyone happy, your PMF score plummets. Double down on what your superfans adore and address the objections of people on the fence."
        }
      }
    ],
    quiz: [
      {
        id: "q3",
        question: "According to the Sean Ellis benchmark, what percentage of surveyed users must respond 'Very Disappointed' to indicate PMF?",
        options: [
          "At least 15%",
          "At least 25%",
          "At least 40%",
          "At least 80%"
        ],
        correctIndex: 2,
        explanation: "Across hundreds of startup case studies, products that achieved breakout scalable growth consistently scored 40% or higher on the disappointment metric.",
        founderTakeaway: "Audit your user base regularly to track shifts in product-market fit."
      }
    ],
    actionPlan: [
      "Send a 3-question survey to all users who used your product more than twice in the past 14 days.",
      "Ask: 1) How would you feel if this product disappeared? 2) What is the main benefit you receive? 3) What type of person benefits most?",
      "Calculate your 'Very Disappointed' percentage and analyze common traits among superfans."
    ]
  },
  {
    id: "ch-3-customer-discovery",
    number: 3,
    title: "Chapter 3: The Art of Customer Discovery",
    subtitle: "How to Talk to Users Without Hearing Polite Lies",
    readTimeMinutes: 5,
    category: "Product",
    summary: "Customers will lie to you if you ask hypothetical questions. Learn the principles of 'The Mom Test' to extract unvarnished behavioral data.",
    introQuote: {
      quote: "The customer is not a moron; she's your wife. You insult her intelligence if you assume that a mere slogan will win her over.",
      author: "David Ogilvy"
    },
    sections: [
      {
        id: "ch3-1",
        title: "The Golden Rules of The Mom Test",
        paragraphs: [
          "When you ask someone: 'Would you pay $20/month for an AI tool that organizes your receipts?', they will almost certainly say 'Yes, that sounds useful!' Why? Because saying yes costs them nothing, makes them look agreeable, and ends the awkward conversation quickly.",
          "Hypothetical questions yield hypothetical commitments. The first golden rule of user research is: Never ask people what they might do in the future. Ask what they actually did in the past.",
          "Instead of 'Would you use this?', ask: 'When was the last time you tried to solve this? Walk me through what you did. What tool did you buy, how much did it cost, and what sucked about it?'"
        ],
        pullQuote: {
          text: "People don't buy what you make; they buy what it does for them. Talk about their life, not your idea.",
          author: "Rob Fitzpatrick",
          role: "Author, The Mom Test"
        },
        keyTakeaways: [
          "Talk about their past behavior, never their future predictions.",
          "Never mention your solution or product idea in the first 20 minutes of an interview.",
          "Listen for emotion: frustration, anger, and wasted money are fertile soil for startups."
        ]
      },
      {
        id: "ch3-2",
        title: "The 5 Whys: Uncovering Root Friction",
        paragraphs: [
          "Surface-level feedback is often misleading. A user might complain: 'I wish this button was blue' or 'Can you add an export to CSV feature?'",
          "If you build every requested feature, you will end up with an unmaintainable Frankenstein tool. Instead, apply the '5 Whys' method pioneered by Taiichi Ohno at Toyota.",
          "Why do you need the CSV export? 'Because I have to send it to my accountant.' Why? 'Because she needs to reconcile sales tax.' Why? 'Because our current point of sale misses regional tax exemptions.' Now you have found the real problem: automated tax compliance, not a CSV button."
        ],
        checklist: [
          "Disallow yourself from pitching your product during discovery calls.",
          "Record sessions (with permission) to capture the exact vocabulary customers use to describe their pain.",
          "Disregard all feedback from people who have never spent time or money trying to solve the problem."
        ]
      }
    ],
    actionPlan: [
      "Draft a 5-question script focusing entirely on past actions, current workarounds, and budget authority.",
      "Conduct 3 user interviews where you speak for less than 20% of the call duration.",
      "Document the exact verbatim phrases users use to describe their frustration."
    ]
  },
  {
    id: "ch-4-unit-economics",
    number: 4,
    title: "Chapter 4: Pricing, Monetization & Unit Economics",
    subtitle: "Why Founders Underprice, The LTV:CAC Ratio & Payback Realities",
    readTimeMinutes: 6,
    category: "Growth",
    summary: "Monetization is not an afterthought; it is the ultimate validation of product value. Master the core levers of SaaS and consumer economics.",
    introQuote: {
      quote: "Pricing is the single most powerful lever for maximizing operating income.",
      author: "Warren Buffett"
    },
    sections: [
      {
        id: "ch4-1",
        title: "The Cowardice of Underpricing",
        paragraphs: [
          "Early-stage founders almost universally underprice their software. They charge $5/month or offer an unlimited free tier because they lack confidence in their product and fear rejection.",
          "Low prices create three devastating problems: 1) You attract low-intent, high-maintenance customers who generate 80% of support tickets; 2) You cannot afford paid customer acquisition; 3) Enterprise buyers perceive cheap software as insecure and toy-like.",
          "If your tool genuinely saves a company 10 hours of engineer time a month ($1,000+ in loaded cost), charging $19/month is economic madness. Charge a fraction of the value created, not the marginal cost of hosting."
        ],
        framework: {
          type: "ltv-cac",
          title: "Unit Economics Health Diagnostic",
          subtitle: "LTV to CAC Ratio & Payback Period Calculator",
          description: "A healthy SaaS company requires an LTV:CAC ratio ≥ 3:1 and a CAC payback period under 12 months for self-funding growth."
        },
        pullQuote: {
          text: "Double your prices right now. If nobody complains, double them again until someone hesitates.",
          author: "Marc Andreessen",
          role: "General Partner, a16z"
        },
        keyTakeaways: [
          "Price on value created, never cost-plus hosting fees.",
          "Healthy SaaS metrics: LTV/CAC > 3x, Gross Margin > 75%, Net Revenue Retention > 110%.",
          "Freemium is an acquisition channel, not a business model. Do not launch freemium without clear upgrade catalysts."
        ]
      },
      {
        id: "ch4-2",
        title: "Payback Period: The Hidden Driver of Runway",
        paragraphs: [
          "LTV (Lifetime Value) is a theoretical calculation based on assumptions about churn that may take 3 years to materialize. In contrast, CAC Payback Period (the months required to recoup the cost of acquiring a customer) directly determines your cash flow.",
          "If your payback period is 6 months, cash recycled from existing customers can fund new customer acquisition rapidly without dilution. If your payback period is 24 months, scaling quickly will starve your company of liquidity.",
          "Structure contracts with upfront annual billing. Offering a 15% discount for annual upfront payment turns customers into your primary financing source."
        ],
        warStory: {
          company: "Basecamp (37signals)",
          outcome: "Success",
          headline: "Profitable from Day One by Charging Upfront",
          lesson: "While dot-com competitors gave away free software to chase eyeballs and venture rounds, Jason Fried and DHH charged $49/month on day one. By prioritizing profitability and cash-flow positive customers, they built a multimillion-dollar software empire without outside capital.",
          founder: "Jason Fried & DHH",
          quote: "If you want to build a sustainable business, ask people for money from day one. Free users don't tell you if your product is worth paying for."
        }
      }
    ],
    actionPlan: [
      "Review your current pricing page. If you have no paid tiers, introduce one immediately.",
      "Add an annual upfront payment option with a 15-20% discount to pull cash flow forward.",
      "Calculate your true fully-loaded Customer Acquisition Cost (including sales and marketing salaries)."
    ]
  },
  {
    id: "ch-5-team-and-culture",
    number: 5,
    title: "Chapter 5: Co-Founders, Equity & The First 10 Hires",
    subtitle: "Vesting Cliff Mechanics, Alignment Talks, and High-Bar Hiring",
    readTimeMinutes: 5,
    category: "Operations",
    summary: "Co-founder blowups are the #1 non-market cause of early-stage mortality. Learn how to structure equity, handle tough conversations, and recruit 10x talent.",
    introQuote: {
      quote: "First-rate people hire first-rate people; second-rate people hire third-rate people.",
      author: "Leo Rosten"
    },
    sections: [
      {
        id: "ch5-1",
        title: "The Inviolable Rule of 4-Year Vesting with a 1-Year Cliff",
        paragraphs: [
          "Never, under any circumstance, award unvested equity on day one. Two friends starting a company on a 50/50 handshake without vesting is financial suicide. If one founder burns out or leaves after 3 months, they walk away with half the company's cap table, rendering the startup uninvestable.",
          "Standard venture vesting is 4 years with a 1-year cliff. If a co-founder leaves in month 8, they receive 0% of the company. If they stay past month 12, 25% vests, with the remainder vesting monthly over the next 36 months.",
          "Have the hard equity and role division conversations before writing code. Who is the CEO with final tie-breaking decision authority? What happens if one person wants to quit and return to a corporate job?"
        ],
        framework: {
          type: "equity-split",
          title: "Co-Founder Equity & Alignment Matrix",
          subtitle: "Evaluate Commitment, IP, Ideation, and Execution Weight",
          description: "Avoid generic 50/50 splits without discussing full-time commitment, technical execution, domain knowledge, and runway contribution."
        },
        pullQuote: {
          text: "Equity splits are not a reward for having the initial idea; they are compensation for the 7 to 10 years of grueling execution ahead.",
          author: "Sam Altman",
          role: "CEO of OpenAI, Former President Y Combinator"
        },
        keyTakeaways: [
          "Always implement 4-year vesting with a 1-year cliff for all founders and early employees.",
          "Define a single CEO who holds final operational tie-breaking power.",
          "Hire slowly for slope (learning speed), not just pedigree: early startups need resourceful athletes, not managers."
        ]
      },
      {
        id: "ch5-2",
        title: "The 'Fuck Yes or No' Hiring Standard",
        paragraphs: [
          "In early-stage hiring, a mediocre hire is not zero value; it is profoundly negative value. A poor first engineer or designer introduces technical debt, slows down the entire team, and degrades company culture.",
          "If your reaction after an interview loop is not an emphatic 'Hell Yes!', it is an automatic 'No'. Do not compromise standards because you feel overwhelmed with work.",
          "Test candidates with paid, real-world work trials. Have them work with your team for a weekend on a real bug or feature rather than asking abstract puzzle questions."
        ],
        checklist: [
          "Implement founder vesting agreements with acceleration terms (single/double trigger).",
          "Conduct a 2-day paid trial project with finalist candidates before issuing an offer letter.",
          "Establish an explicit 90-day review period for every new hire."
        ]
      }
    ],
    actionPlan: [
      "Verify that all team members have signed legal intellectual property assignment and vesting contracts.",
      "Write down the 3 core values your startup will enforce even when it costs revenue.",
      "Design a hands-on technical or commercial trial project for your next open hiring role."
    ]
  },
  {
    id: "ch-6-fundraising-vs-bootstrapping",
    number: 6,
    title: "Chapter 6: Fundraising Realities & The 'Default Alive' Imperative",
    subtitle: "SAFEs, Investor Psychology, Pitching Narratives & Runway Management",
    readTimeMinutes: 5,
    category: "Operations",
    summary: "Fundraising is not a victory lap; it is selling a piece of your life's work for fuel. Learn how to maintain leverage and reach 'Default Alive'.",
    introQuote: {
      quote: "The best way to raise money is to build a company that doesn't need any.",
      author: "Naval Ravikant, Founder of AngelList"
    },
    sections: [
      {
        id: "ch6-1",
        title: "Default Alive vs. Default Dead",
        paragraphs: [
          "Paul Graham coined the vital distinction between 'Default Alive' and 'Default Dead'. If your startup continues at its current revenue growth rate and burn rate without raising another dime, will you reach profitability before your bank balance hits zero?",
          "If the answer is yes, you are Default Alive. You have all the leverage in investor negotiations because you can walk away. If the answer is no, you are Default Dead. You are on a ticking timer, and professional investors will smell your desperation and squeeze your valuation or pass entirely.",
          "Fundraising is a game of momentum and FOMO (Fear Of Missing Out). Investors rarely invest based on intellectual spreadsheets; they invest because they see a fast-moving train they do not want to be left behind on."
        ],
        framework: {
          type: "runway-calc",
          title: "Runway & Default Alive/Dead Calculator",
          subtitle: "Calculate Zero Cash Date & Required Growth Trajectory",
          description: "Input cash balance, gross revenue, and monthly expenses to calculate exact runway months and determine if your startup is Default Alive."
        },
        pullQuote: {
          text: "When you fundraise, you are not asking for a favor. You are offering investors a rare seat on an accelerating rocket ship.",
          author: "Elad Gil",
          role: "Author, High Growth Handbook"
        },
        keyTakeaways: [
          "Know your exact runway in months and your net monthly burn rate at all times.",
          "Run a tight, time-boxed fundraising process (2 to 4 weeks max) to generate competitive tension.",
          "Use standard YC Post-Money SAFEs to minimize legal fees and avoid premature board seats."
        ]
      },
      {
        id: "ch6-2",
        title: "The Structure of a Killer Seed Pitch",
        paragraphs: [
          "A great pitch deck is not an exhaustive encyclopedia of your product; it is an emotional and logical narrative that answers 5 fundamental questions: 1) What massive market shift is happening now? 2) Why is the existing solution horribly broken? 3) What is your unfair secret/insight? 4) What early traction proves it? 5) Why are you the only team capable of winning?",
          "Keep your seed deck under 12 slides. Replace dense text with clear customer quotes, retention graphs, and clean unit economics."
        ],
        warStory: {
          company: "Airbnb",
          outcome: "Success",
          headline: "Rejected by 7 Top VCs to a $90B Public Titan",
          lesson: "In 2008, Brian Chesky and Joe Gebbia sought $150,000 for 10% of Airbnb ($1.5M valuation). 7 prominent VCs rejected them, thinking strangers would never sleep in other people's homes. To survive, the founders sold $40 boxes of Obama O's cereal to fund their runway and kept talking to New York hosts.",
          founder: "Brian Chesky & Joe Gebbia",
          quote: "If you can survive on cereal and grit when everyone tells you it's impossible, you give yourself the chance to win."
        }
      }
    ],
    actionPlan: [
      "Calculate your exact Net Burn Rate and Runway in months right now.",
      "Refine your elevator pitch into a 2-sentence narrative: Problem + Unique Wedge.",
      "If your runway is under 6 months, immediately cut non-essential SaaS tools and freeze hiring."
    ]
  },
  {
    id: "ch-7-founder-psychology",
    number: 7,
    title: "Chapter 7: Founder Psychology, Burnout & The Trough of Sorrow",
    subtitle: "Managing Your Own Psychology, Handling Crisis & Detaching Self-Worth",
    readTimeMinutes: 4,
    category: "Psychology",
    summary: "The hardest skill in entrepreneurship is not coding, sales, or capital raising; it is managing your own psychology when everything is falling apart.",
    introQuote: {
      quote: "By far the most difficult skill I learned as CEO was the ability to manage my own psychology.",
      author: "Ben Horowitz, The Hard Thing About Hard Things"
    },
    sections: [
      {
        id: "ch7-1",
        title: "Surviving the Trough of Sorrow",
        paragraphs: [
          "Every startup follows the same emotional cycle: The Initial Euphoria of starting -> The TechCrunch Launch Spike -> The Long, Grueling Trough of Sorrow -> The Crash of Bad Experiments -> and finally, for those who don't quit, The Slope of Enlightened PMF.",
          "During the Trough of Sorrow, key employees will leave, big deals will fall through at the eleventh hour, and your product will break in production. Your mind will tell you that you are a fraudulent failure.",
          "You must separate your identity as a human being from the fluctuating valuation and metrics of your startup entity. Your startup is an experiment you are conducting, not your personal worth."
        ],
        pullQuote: {
          text: "Whenever I feel overwhelmed, I ask myself: 'Is this problem going to matter in 5 years?' If not, focus on the single next move on the chessboard.",
          author: "Jessica Livingston",
          role: "Co-Founder, Y Combinator & Author of Founders at Work"
        },
        keyTakeaways: [
          "Emotional equanimity is a competitive edge: never make permanent decisions based on temporary emotional lows.",
          "Build a confidential mastermind peer group of fellow active founders who understand the battle.",
          "Prioritize 7 hours of sleep and regular physical movement: burnout impairs cognitive decision-making."
        ]
      },
      {
        id: "ch7-2",
        title: "Focus: The Power of Saying No",
        paragraphs: [
          "The greatest danger to an early startup is not running out of ideas; it is drowning in too many mediocre opportunities. Saying yes to a custom enterprise feature, a partnership with a legacy firm, or a tertiary marketing channel will dilute your engineering horsepower.",
          "Strategy is not choosing what to do; strategy is deciding what NOT to do. Great founders have the discipline to say NO to 99 good distractions so they can execute on the 1 transformative priority."
        ],
        checklist: [
          "Designate 1 hour every week to step outside daily firefighting and review top-level goals.",
          "Maintain non-negotiable boundaries for physical sleep and mental recovery.",
          "Focus on inputs (customer calls made, features shipped) rather than lagging outcomes."
        ]
      }
    ],
    actionPlan: [
      "Identify the #1 operational anxiety keeping you awake at night and write a concrete mitigation plan.",
      "Reach out to 2 fellow founders to schedule a candid monthly peer support session.",
      "List 3 ongoing projects or feature requests you will kill today to regain 100% focus."
    ]
  },
  {
    id: "epilogue",
    number: 8,
    title: "Epilogue: The 10 Inviolable Laws of Startup Longevity",
    subtitle: "A Pocket Manifesto for the Relentless Founder",
    readTimeMinutes: 3,
    category: "Foundation",
    summary: "A compact checklist of the ten timeless laws of startup creation to keep pinned to your desk throughout your journey.",
    introQuote: {
      quote: "Relentlessly resourceful. That is the one quality shared by all successful founders.",
      author: "Paul Graham"
    },
    sections: [
      {
        id: "ep-1",
        title: "The Ten Commandments of Early-Stage Execution",
        paragraphs: [
          "As you build, pivot, and scale, return to these ten fundamental axioms whenever you find yourself drifting off course:"
        ],
        checklist: [
          "1. Build what people want, not what you think they should want.",
          "2. Talk to 5 customers every week, rain or shine.",
          "3. Retention is the only honest metric; vanity metrics will lie to you.",
          "4. Charge for your product early; price is the ultimate validation.",
          "5. Ship fast, launch imperfectly, and iterate based on real feedback.",
          "6. Protect your runway like your life depends on it—because your company's life does.",
          "7. Hire slowly for high learning velocity; fire quickly when values diverge.",
          "8. Do things that don't scale until you have overwhelming demand.",
          "9. Say NO to 90% of requests to keep your core product laser-focused.",
          "10. Be relentlessly resourceful; the winner is often the last founder who refuses to quit."
        ]
      }
    ],
    actionPlan: [
      "Bookmark this manual and review your highlighted notes every quarter.",
      "Share your key takeaways with your co-founders and team.",
      "Keep shipping and stay relentlessly resourceful!"
    ]
  }
];

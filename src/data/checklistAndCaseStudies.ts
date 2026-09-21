import { ChecklistItem, DetailedCaseStudy } from '../types';

export const INITIAL_VALIDATION_CHECKLIST: ChecklistItem[] = [
  // STAGE 1: Problem Definition
  {
    id: 'val-1',
    stage: 'Stage 1: Problem Definition',
    title: 'Define the Specific Ideal Customer Profile (ICP)',
    action: 'Narrow your target customer down to a specific role, company size, and budget rather than "small businesses" or "consumers".',
    proTip: 'Target someone with an acute title (e.g., "VP of Engineering at 50-person SaaS companies using AWS") rather than broad generalizations.',
    falsifiableMetric: 'You can identify 30 specific named individuals with this exact role on LinkedIn.',
    completed: false
  },
  {
    id: 'val-2',
    stage: 'Stage 1: Problem Definition',
    title: 'Identify the "Hair-on-Fire" Pain & Cost of Inaction',
    action: 'Document the quantifiable financial, time, or compliance damage the customer incurs every week by not solving this problem.',
    proTip: 'If inaction only causes minor annoyance, you have a vitamin. Look for problems causing churn, compliance fines, or lost revenue.',
    falsifiableMetric: 'The problem costs the target ICP at least $5,000/year or 10+ hours/week.',
    completed: false
  },
  {
    id: 'val-3',
    stage: 'Stage 1: Problem Definition',
    title: 'Audit Existing "Duct-Tape" Workarounds',
    action: 'Investigate how the customer currently solves or patches this problem today using spreadsheets, manual copy-pasting, or internal scripts.',
    proTip: 'A great idea displaces an ugly hack that the customer is already actively maintaining. No workaround usually means no real urgency.',
    falsifiableMetric: 'Find at least 3 distinct makeshift workarounds the customer has already tried.',
    completed: false
  },

  // STAGE 2: Customer Discovery
  {
    id: 'val-4',
    stage: 'Stage 2: Customer Discovery',
    title: 'Conduct 15 Non-Leading Discovery Interviews ("The Mom Test")',
    action: 'Interview 15 target buyers without pitching your solution once. Ask only about past behaviors, past expenditures, and recent frustrations.',
    proTip: 'Ask: "When was the last time this happened? Walk me through what you did step-by-step. What tools did you buy?"',
    falsifiableMetric: 'Complete 15 calls where you speak for <20% of the time and pitch 0% of the time.',
    completed: false
  },
  {
    id: 'val-5',
    stage: 'Stage 2: Customer Discovery',
    title: 'Extract Verbatim Customer Language & Emotional Triggers',
    action: 'Transcribe calls and document the exact phrases customers use to describe their pain, anger, and desired outcome.',
    proTip: 'Use their exact words on your landing page copy. Never invent clever marketing jargon when customer words convert 3x higher.',
    falsifiableMetric: 'Compile a spreadsheet of at least 25 verbatim quotes categorized by emotional intensity.',
    completed: false
  },
  {
    id: 'val-6',
    stage: 'Stage 2: Customer Discovery',
    title: 'Verify Buyer Authority and Existing Budget Allocation',
    action: 'Confirm whether the person feeling the pain has the credit card or procurement authority to purchase software without board approval.',
    proTip: 'In B2B, the user and the economic buyer are often different. Identify who signs the check and what budget line it comes from.',
    falsifiableMetric: 'Confirm the existence of a designated discretionary budget line for this category.',
    completed: false
  },

  // STAGE 3: Smoke Testing & Pre-Sales
  {
    id: 'val-7',
    stage: 'Stage 3: Smoke Testing',
    title: 'Build a High-Converting Smoke Test Landing Page',
    action: 'Create a single-page value proposition explaining the problem, core solution benefit, and pricing, with an explicit Call-to-Action.',
    proTip: 'Do not just collect passive email addresses. Include a "Request Early Access & Book Onboarding" or refundable pre-order button.',
    falsifiableMetric: 'Achieve >15% conversion rate on cold target traffic requesting onboarding.',
    completed: false
  },
  {
    id: 'val-8',
    stage: 'Stage 3: Smoke Testing',
    title: 'Execute a "Concierge / Wizard of Oz" MVP Test',
    action: 'Deliver the core value manually behind the scenes using spreadsheets, Zapier, or manual labor before writing backend code.',
    proTip: 'Doing things manually teaches you all the edge cases and operational friction points before you spend $50k on engineering.',
    falsifiableMetric: 'Successfully solve the problem manually for 5 initial test clients.',
    completed: false
  },
  {
    id: 'val-9',
    stage: 'Stage 3: Smoke Testing',
    title: 'Secure 3 Paid Pre-Orders, Deposits, or Signed LOIs',
    action: 'Ask early testers for financial commitment (a $100 refundable pilot deposit or a signed Letter of Intent with commercial terms).',
    proTip: 'Capital sacrifice is the only honest truth in business. If they hesitate at $100 after praising the idea, the idea is not validated.',
    falsifiableMetric: 'At least 3 customers put down money or sign binding trial commitments.',
    completed: false
  },

  // STAGE 4: Unit Economics & Pricing
  {
    id: 'val-10',
    stage: 'Stage 4: Unit Economics',
    title: 'Test Value-Based Pricing (Never Cost-Plus)',
    action: 'Set your price at a 10x ROI relative to the value created or cost saved, rather than matching cheap commoditized competitors.',
    proTip: 'Start at least 2x higher than your instinctive comfortable price. You can always discount, but raising prices later is painful.',
    falsifiableMetric: 'At least 2 buyers agree to your proposed price tier without requesting freemium.',
    completed: false
  },
  {
    id: 'val-11',
    stage: 'Stage 4: Unit Economics',
    title: 'Model Customer Acquisition Channels & CAC Ceiling',
    action: 'Calculate the maximum allowable Customer Acquisition Cost (CAC) such that LTV:CAC remains >3:1 with a payback period <12 months.',
    proTip: 'If your pricing is $10/month ($120/year), your allowable CAC is under $40, ruling out direct sales or expensive Google Ads.',
    falsifiableMetric: 'Identify at least 1 acquisition channel capable of delivering positive unit economics.',
    completed: false
  },

  // STAGE 5: Go/No-Go Decision Gate
  {
    id: 'val-12',
    stage: 'Stage 5: Go/No-Go Gate',
    title: 'Conduct the Sean Ellis 40% PMF Leading Indicator Audit',
    action: 'Ask initial pilot users: "How would you feel if you could no longer use this solution?"',
    proTip: 'If ≥40% say "Very Disappointed", you have validated real pull. If <25%, iterate on the problem wedge before scaling.',
    falsifiableMetric: 'Over 40% of active testers state they would be "Very Disappointed" without the product.',
    completed: false
  },
  {
    id: 'val-13',
    stage: 'Stage 5: Go/No-Go Gate',
    title: 'Make the Final Build / Pivot / Kill Commitment',
    action: 'Review all qualitative interview notes, conversion metrics, and financial deposits against falsifiable targets.',
    proTip: 'Killing a bad idea after 3 weeks of validation is a massive victory that saves you 2 years of painful slow failure.',
    falsifiableMetric: 'Formal team consensus with documented evidence backing the next 6-month roadmap.',
    completed: false
  }
];

export const DETAILED_CASE_STUDIES: DetailedCaseStudy[] = [
  {
    id: 'case-airbnb',
    company: 'Airbnb',
    founders: 'Brian Chesky, Joe Gebbia, Nathan Blecharczyk',
    category: 'Funding',
    outcome: 'Success',
    tagline: 'From 7 VC Rejections & Selling Cereal Boxes to a $90B Global Hospitality Titan',
    metrics: [
      { label: 'Seed Valuation Sought', value: '$1.5M ($150k for 10%)' },
      { label: 'VC Rejections', value: '7 Top Firms' },
      { label: 'Cereal Revenue Raised', value: '$40,000 (Obama O\'s)' },
      { label: 'Current Enterprise Value', value: '>$85B' }
    ],
    theChallenge:
      'In 2008, the founders faced total capital starvation. Top venture capitalists passed on them because the idea of sleeping on an air mattress in a stranger\'s living room sounded dangerous, unscalable, and bizarre. With credit card debt mounting past $20,000 each and zero traction outside conference spikes, the company was weeks from shutting down.',
    theTurningPoint:
      'The founders executed two legendary unscalable moves: 1) To fund their runway without predatory debt, they designed and sold limited-edition political cereal boxes ("Obama O\'s" and "Cap\'n McCain\'s") at the 2008 DNC, generating $40k in life-saving capital. 2) Paul Graham instructed them: "Go to your users in New York." Chesky and Gebbia flew to NYC, knocked on hosts\' doors with a rented camera, took professional photos of listings, and sat in living rooms understanding user friction. Bookings immediately doubled.',
    keyLessons: [
      'Funding Challenge: When institutional investors reject you, be relentlessly resourceful. Bootstrapping cash flow through creative side-hustles can buy the runway needed to find traction.',
      'Market Fit Lesson: "Do things that don\'t scale." Meeting your first 100 users in person reveals subtle friction (like blurry photos or payment trust) that analytics dashboards hide.',
      'Team & Resilience: The ability to endure public skepticism and economic humiliation is often the primary filter separating surviving startups from defunct ones.'
    ],
    founderQuote: {
      quote: 'If we could sell $40 boxes of cereal, we could keep the company alive for another month. We realized that being relentlessly resourceful was our only real weapon.',
      author: 'Brian Chesky',
      context: 'Reflecting on the 2008 funding crisis at Y Combinator Startup School'
    }
  },
  {
    id: 'case-slack',
    company: 'Slack (Tiny Speck / Glitch)',
    founders: 'Stewart Butterfield, Cal Henderson, Eric Costello, Serguei Mourachov',
    category: 'Team & Pivot',
    outcome: 'Pivot',
    tagline: 'How a Failed Multiplayer Video Game Pivoted Into the Fastest Growing SaaS in History',
    metrics: [
      { label: 'Capital Invested in Game', value: '$17M+' },
      { label: 'Game Active Users', value: '<5,000 (Failing)' },
      { label: 'Acquisition Price (Salesforce)', value: '$27.7 Billion' },
      { label: 'Growth Milestone', value: '$0 to $100M ARR in 2.5 yrs' }
    ],
    theChallenge:
      'Tiny Speck raised over $17 million to build "Glitch", an ambitious web-based multiplayer video game. Despite incredible artistic craft, the game failed to achieve mass consumer retention. By late 2012, with millions still in the bank, Stewart Butterfield recognized that Glitch was economically unviable and made the agonizing decision to shut it down and return remaining capital or pivot.',
    theTurningPoint:
      'While building Glitch across distributed teams in San Francisco and Vancouver, the engineering team had built an internal IRC-based messaging tool with file sharing and searchable archives to avoid messy email chains. When Glitch died, the founders realized they could never work in a company without that internal tool again. They pivoted 100% of the team and remaining capital to commercializing that internal tool, naming it Slack (Searchable Log of All Conversation & Knowledge).',
    keyLessons: [
      'Pivot Mastery: Recognize failure early before cash is exhausted. Butterfield killed Glitch while having millions in runway rather than slowly burning out in denial.',
      'Scratching Your Own Itch: The strongest B2B products often emerge as internal utilities that solve the founders\' own daily operational friction.',
      'Team Cohesion: Because the core engineering team was world-class and deeply trusted each other, they smoothly transitioned from game development to enterprise chat without catastrophic turnover.'
    ],
    founderQuote: {
      quote: 'We were not trying to build a business when we made the early tool. We just wanted to work together without drowning in email. When we shut down Glitch, we realized the tool was the real treasure.',
      author: 'Stewart Butterfield',
      context: 'Describing the pivot from Glitch to Slack'
    }
  },
  {
    id: 'case-dropbox',
    company: 'Dropbox',
    founders: 'Drew Houston, Arash Ferdowsi',
    category: 'Smoke Testing',
    outcome: 'Success',
    tagline: 'Validating Massive Market Demand with a 3-Minute Screen Recording Video',
    metrics: [
      { label: 'Initial Waiting List', value: '5,000 Users' },
      { label: 'Overnight Waitlist Post-Video', value: '75,000 Users' },
      { label: 'First Day Digg Upvotes', value: 'Top #1 on Frontpage' },
      { label: 'IPO Valuation', value: '>$12 Billion' }
    ],
    theChallenge:
      'Building cloud file synchronization across Windows, Mac, Linux, and multiple file systems was an extraordinarily difficult technical undertaking requiring low-level OS drivers and distributed storage. Building the full infrastructure before knowing if users would trust a third-party cloud folder was a massive financial and engineering risk.',
    theTurningPoint:
      'Instead of spending 18 months building the full backend cloud infrastructure, Drew Houston created a 3-minute screen recording demonstrating the prototype. He tailored the video specifically to early tech adopters on Digg and Hacker News, peppering it with witty inside jokes and easter eggs. The video went viral, driving the beta waiting list from 5,000 to over 75,000 signups overnight, proving unassailable consumer demand before scaling servers.',
    keyLessons: [
      'Smoke Testing Mastery: Validate customer intent before building complex backend architecture. A simple demo video can prove demand faster than 100,000 lines of code.',
      'Distribution Wedge: Target passionate early adopters where they hang out with tailored, culturally authentic messaging.',
      'Viral Growth Loops: Once validated, Dropbox created the legendary two-sided referral program ("Get 500MB free storage for referring a friend"), driving 3,900% growth in 15 months.'
    ],
    founderQuote: {
      quote: 'The biggest risk is not that your code won\'t work; it\'s that you build something really well that nobody gives a damn about. The video proved people cared.',
      author: 'Drew Houston',
      context: 'Speaking on smoke testing prototypes at MIT'
    }
  },
  {
    id: 'case-segment',
    company: 'Segment',
    founders: 'Peter Reinhardt, Calvin French-Owen, Ian Storm Taylor, Ilya Volodarsky',
    category: 'Market Fit',
    outcome: 'Pivot',
    tagline: 'From 2 Failed Products & Burning 50% Seed Cash to an Accidental 500-Line PMF Rocket',
    metrics: [
      { label: 'Failed Products Before Pivot', value: '2 (ClassMap & Analytics Voting)' },
      { label: 'Lines of Code in Winning Repo', value: '~500 Lines of JS' },
      { label: 'Hacker News Reception', value: '#1 Post with 1,000+ stars in 24 hrs' },
      { label: 'Twilio Acquisition Price', value: '$3.2 Billion' }
    ],
    theChallenge:
      'The four MIT founders raised $600,000 from Y Combinator and spent over a year building two elaborate software products: "ClassMap" (a classroom engagement lecture tool) and an analytics idea-voting board. Both products had virtually zero retention. With half their seed money incinerated and runway dwindling to months, morale collapsed and the founders almost disbanded.',
    theTurningPoint:
      'To measure analytics across both failed products, they had built a tiny 500-line open-source JavaScript wrapper named "Analytics.js" to route data to Google Analytics, Mixpanel, and Kissmetrics with one API call. One co-founder suggested making a landing page for it. Another thought it was too trivial to be a business. They built a simple landing page, open-sourced the library, and posted it to Hacker News. The post exploded to #1, crashing their server and generating thousands of enthusiastic developer emails.',
    keyLessons: [
      'Market Pull vs. Push: When you have true PMF, you don\'t have to convince people; they pull the product out of your hands and demand features.',
      'The Vanity of Complexity: Founders often value features by how hard they were to code, while customers value tools solely by how much pain they remove.',
      'Lean Experimentation: If your initial thesis has zero organic pull after 6 months, stop polishing and test alternative wedge hypotheses.'
    ],
    founderQuote: {
      quote: 'We spent a year and a half building products that we thought were deep and complicated. Our real multi-billion dollar business came from an open-source library we almost didn\'t publish because we thought it was too simple.',
      author: 'Peter Reinhardt',
      context: 'Reflecting on the Segment founding journey'
    }
  },
  {
    id: 'case-quibi-vs-superhuman',
    company: 'Quibi vs. Superhuman (Contrast Study)',
    founders: 'Quibi (Jeffrey Katzenberg & Meg Whitman) vs. Superhuman (Rahul Vohra)',
    category: 'Premature Scaling',
    outcome: 'Cautionary Failure',
    tagline: 'Why $1.75 Billion in Capital Cannot Buy Product-Market Fit Without Feedback Loops',
    metrics: [
      { label: 'Quibi Capital Burned', value: '$1.75 Billion in 6 Months' },
      { label: 'Quibi Post-Launch Lifetime', value: 'Shut down after 199 days' },
      { label: 'Superhuman Sean Ellis Score', value: 'Grew from 22% to 58%' },
      { label: 'Superhuman PMF Strategy', value: 'Systematic High-Retention Cohort Engine' }
    ],
    theChallenge:
      'Quibi attempted to force product-market fit through brute-force capital: raising $1.75B, hiring Hollywood celebrities for $100k/minute videos, buying Super Bowl commercials, and preventing mobile screenshots. They never ran beta feedback loops, never tested willing-to-pay behavior, and launched a rigid 10-minute mobile video app right when the world entered lockdowns.',
    theTurningPoint:
      'While Quibi collapsed within 6 months, Superhuman took the opposite scientific approach. Rahul Vohra surveyed early users and found only 22% would be "Very Disappointed" without Superhuman (well below the 40% PMF benchmark). Instead of spending money on marketing, Vohra segmented the user base, identified the exact traits of the 22% superfans (founders and executives managing 100+ daily emails), polished the keyboard shortcuts specifically for them, and systematically raised the PMF score to 58% before opening public signups.',
    keyLessons: [
      'Premature Scaling is Fatal: Capital accelerates a working engine; it cannot fix a broken value proposition. Scaling marketing before retention is burning cash.',
      'The Sean Ellis Metric Works: Superhuman proved that PMF can be engineered by segmenting feedback and doubling down exclusively on your highest-retention superfans.',
      'Humility in Customer Discovery: Never assume you know what users want because of past celebrity or executive status. The market is the ultimate judge.'
    ],
    founderQuote: {
      quote: 'The number one cause of startup death is premature scaling. If you don\'t have a repeatable retention curve, raising more money just makes the explosion louder.',
      author: 'Rahul Vohra',
      context: 'Presenting the Superhuman Product-Market Fit Engine'
    }
  }
];

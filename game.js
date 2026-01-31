// ===== THE CMO GAME =====
// A strategy game about brand, budget, and corporate survival

// ===== CONSTANTS =====
const PRODUCTS = {
  soda: {
    name: 'Soda', namingLabel: 'soda brand', icon: '🥤', baseRevenue: 300000, growth: 0.07,
    desc: 'Fizzy margins, popping competition. Don\'t let your growth go flat, or prepare to get canned.',
    flavor: 'beverage',
    namingExamples: ['Sip Happens', 'Fizzness Casual', 'LiquidLife']
  },
  sneakers: {
    name: 'Shoes', namingLabel: 'shoe brand', icon: '👟', baseRevenue: 250000, growth: 0.09,
    desc: 'Lace up for a marathon, not a sprint. Tread carefully. One misstep, and you\'re on the clearance rack.',
    flavor: 'fashion',
    namingExamples: ['SoleMate', 'Kicks & Giggles', 'Shoe La La']
  },
  skincare: {
    name: 'Skincare', namingLabel: 'skincare product', icon: '✨', baseRevenue: 200000, growth: 0.11,
    desc: 'Pore over the data for a breakout hit. But don\'t be rash: One wrinkle in the launch and your brand ages poorly.',
    flavor: 'beauty',
    namingExamples: ['Zit Happens', 'Pore Decisions', 'Unwrinkle in Time']
  },
  software: {
    name: 'Software', namingLabel: 'software product', icon: '💾', baseRevenue: 150000, growth: 0.15,
    desc: 'Time to get SaaSy. Launch to the moon... or at least the cloud. Watch your churn and burn or you\'ll crash.',
    flavor: 'tech',
    namingExamples: ['Glitch Please', 'Byte Club', 'SaaS-quatch']
  }
};

const POSITIONINGS = {
  premium: { name: 'Premium', icon: '👑', brandBonus: 2.5, revMult: 1.2, desc: 'High margins, high expectations. Your customers pay more and complain louder.' },
  value: { name: 'Value', icon: '🏷️', brandBonus: 0.5, revMult: 0.85, desc: 'Race to the bottom? More like sprint to volume. Hope your margins survive.' },
  disruptor: { name: 'Disruptor', icon: '⚡', brandBonus: 1.5, revMult: 1.0, desc: 'Move fast and break things - including possibly your career. High risk, high reward.' },
  lifestyle: { name: 'Lifestyle', icon: '🌟', brandBonus: 3.0, revMult: 1.1, desc: 'You\'re not selling a product, you\'re selling a vibe. Hope Gen Z agrees.' }
};

const ROLES = [
  { id: 'brand', name: 'Product Marketing', icon: '🎯', ftCost: 50000, agCost: 25000, ftDesc: 'Strategy insights that sharpen your product-market fit.', agDesc: 'Project-based positioning and market research.', ftEffect: 'Compounding product-market fit gains', agEffect: 'Periodic market fit insights', skipEffect: 'Product-market fit decays faster' },
  { id: 'content', name: 'Brand & Creative', icon: '🎨', ftCost: 50000, agCost: 25000, ftDesc: 'In-house engine for ads, social, and brand storytelling.', agDesc: 'Handles execution but with higher margins.', ftEffect: '+15% compounding brand equity', agEffect: '+8% brand equity growth', skipEffect: 'Your brand looks like placeholder text' },
  { id: 'growth', name: 'Growth / Performance', icon: '📈', ftCost: 50000, agCost: 25000, ftDesc: 'Optimizes every dollar in real-time.', agDesc: 'Cross-platform insights and optimization.', ftEffect: '+12% compounding ROI', agEffect: 'Deep channel insights across platforms', skipEffect: 'Burning budget blindly' },
  { id: 'pr', name: 'PR & Communications', icon: '📣', ftCost: 50000, agCost: 25000, ftDesc: 'Navigates the narrative internally.', agDesc: 'High-leverage media relations.', ftEffect: 'Strategic crisis management', agEffect: 'Broad media reach', skipEffect: 'PR crises hit 2x harder' },
  { id: 'data', name: 'Data & Analytics', icon: '📊', ftCost: 50000, agCost: 25000, ftDesc: 'Unlocks insights from your stack.', agDesc: 'Reporting as a service.', ftEffect: 'Compounding intelligence gains', agEffect: 'Standard attribution', skipEffect: 'Flying completely blind' }
];

const BRAND_TIERS = [
  { id: 'diy', name: 'DIY', cost: 2500, equity: 3, revBonus: -0.05, desc: '"My cousin knows Photoshop"' },
  { id: 'boutique', name: 'Boutique Agency', cost: 125000, equity: 10, revBonus: 0, desc: 'Clean, professional, forgettable' },
  { id: 'topTier', name: 'Top Agency', cost: 250000, equity: 22, revBonus: 0.05, desc: 'Award-worthy. People notice.' },
  { id: 'worldClass', name: 'World-Class', cost: 500000, equity: 35, revBonus: 0.10, desc: 'A world-class design firm called. They\'re interested.' }
];

const SITE_TIERS = [
  { id: 'template', name: 'Template Site', cost: 2500, revBonus: -0.10, desc: 'WordPress template #47. Your competitor has #46.' },
  { id: 'custom', name: 'Custom Build', cost: 150000, revBonus: 0, desc: 'Leading platform with custom theme. Solid.' },
  { id: 'premium', name: 'Premium Build', cost: 325000, revBonus: 0.08, desc: 'Fully custom, buttery smooth, converts like crazy.' },
  { id: 'enterprise', name: 'Enterprise', cost: 600000, revBonus: 0.14, desc: 'The Goliath of ecommerce. Overkill? Maybe. Beautiful? Absolutely.' }
];

const RESEARCH_TIERS = [
  { id: 'none', name: 'Wing It', cost: 0, bonus: -0.05, desc: '"I AM the focus group" - You, to your CEO' },
  { id: 'basic', name: 'Survey + Focus Group', cost: 75000, bonus: 0.05, desc: 'You asked 200 people. 3 of them were honest.' },
  { id: 'full', name: 'Full Research', cost: 175000, bonus: 0.12, desc: 'Quant, qual, competitive analysis. You actually know your customer.' }
];

const LAUNCH_TACTICS = [
  { id: 'organic', name: 'Organic / Word of Mouth', cost: 0, revBoost: 0.02, brandBoost: 2, desc: 'Free but slow as molasses.' },
  { id: 'press', name: 'Press Release', cost: 5000, revBoost: 0.05, brandBoost: 3, desc: 'Spray and pray to the media gods.' },
  { id: 'blog', name: 'Blog + Social Posts', cost: 40000, revBoost: 0.06, brandBoost: 4, desc: 'Content is king. Distribution is king kong.' },
  { id: 'influencer', name: 'Influencer Seeding', cost: 150000, revBoost: 0.15, brandBoost: 6, desc: 'Send free product to people with ring lights.' },
  { id: 'event', name: 'Launch Event', cost: 275000, revBoost: 0.12, brandBoost: 10, desc: 'Open bar = open wallets. Usually.' },
  { id: 'tv', name: 'TV Commercial', cost: 750000, revBoost: 0.25, brandBoost: 12, desc: 'Super Bowl dreams on a mid-market budget.' },
  { id: 'social', name: 'Social Media Blitz', cost: 125000, revBoost: 0.13, brandBoost: 5, desc: 'Every platform, all at once. Everywhere.' },
  { id: 'prag', name: 'PR Agency Launch', cost: 200000, revBoost: 0.10, brandBoost: 8, desc: 'Let the PR pros earn their retainer.' }
];

const ALLOC_CATEGORIES = [
  { id: 'brand', name: 'Brand Building', icon: '🏗️', desc: 'Content, brand campaigns, sponsorships', equityPerDollar: 0.0001, revPerDollar: 0.3 },
  { id: 'performance', name: 'Performance Marketing', icon: '🎯', desc: 'Paid search, social ads, display', equityPerDollar: -0.00002, revPerDollar: 1.2 },
  { id: 'pr', name: 'PR & Influencers', icon: '📢', desc: 'Earned media, influencer deals', equityPerDollar: 0.00005, revPerDollar: 0.6 },
  { id: 'events', name: 'Events & Experiential', icon: '🎪', desc: 'Trade shows, pop-ups, activations', equityPerDollar: 0.00008, revPerDollar: 0.4 }
];

const PRESETS = {
  brandBuilder: { name: '🏗️ Brand Builder', brand: 25000, performance: 5000, pr: 10000, events: 10000 },
  growthMode: { name: '📈 Growth Mode', brand: 5000, performance: 30000, pr: 10000, events: 5000 },
  balanced: { name: '⚖️ Balanced', brand: 15000, performance: 15000, pr: 10000, events: 10000 },
  prBlitz: { name: '📢 PR Blitz', brand: 5000, performance: 10000, pr: 25000, events: 10000 }
};

// ===== CONFLICTS =====
const CONFLICTS = [
  {
    id: 'cancel_culture', type: 'crisis', title: '🔥 Cancel Culture Comes Calling',
    text: 'A pre-launch beta tester screenshots an internal Slack message where someone on your team called customers "walking wallets." It\'s trending. #Boycott{product} has 50k tweets and counting.',
    choices: [
      { text: 'Issue a sincere public apology + donate $30k to consumer advocacy', cost: 30000, brandEquity: 5, revMult: 0.9, ceoPat: -5, outcome: 'Your apology is well-received. The news cycle moves on. Your brand actually gains some respect for owning it. Marketing lesson: Crisis response speed matters more than perfection.' },
      { text: 'Delete everything. Deny, deny, deny.', cost: 0, brandEquity: -12, revMult: 0.8, ceoPat: -15, luck: [0.4, { brandEquity: 2, revMult: 1.0, ceoPat: 0, override: 'Somehow, miraculously, the internet got distracted by a celebrity scandal. You got lucky. Very lucky.' }], outcome: 'The Streisand Effect kicks in. Screenshots of the deletion go viral. Now you look guilty AND incompetent. Marketing lesson: The internet never forgets. The cover-up is always worse than the crime.' },
      { text: 'Lean into it with self-deprecating humor campaign', cost: 10000, brandEquity: 0, revMult: 0.95, ceoPat: -5, luck: [0.35, { brandEquity: 15, revMult: 1.1, ceoPat: 10, override: 'Your meme game is STRONG. The self-roast goes viral in a good way. People love a brand that can laugh at itself. You just pulled off the rarest move in crisis PR.' }], outcome: 'Humor during a genuine controversy comes across as tone-deaf. People think you\'re not taking it seriously. Marketing lesson: Read the room before going for laughs.' },
      { text: '"We\'ve terminated the employee responsible" (throw someone under the bus)', cost: 0, brandEquity: -5, revMult: 0.95, ceoPat: 5, outcome: 'The public execution satisfies the mob temporarily, but your team\'s trust in you plummets. Morale craters. Your best content creator starts updating their LinkedIn. Marketing lesson: Sacrificing team members for PR is a short-term fix with long-term consequences.' }
    ]
  },
  {
    id: 'ceo_nephew', type: 'pressure', title: '👔 The CEO\'s Nephew Has "Ideas"',
    text: 'The CEO\'s nephew - fresh MBA, zero marketing experience - has been "assigned" to your team. His first proposal: pivot your entire social strategy to the metaverse. He\'s already bought a $40k virtual billboard. In Decentraland. Where 12 people visit daily.',
    choices: [
      { text: 'Give him a harmless side project ("Head of Innovation")', cost: 10000, brandEquity: 0, revMult: 1.0, ceoPat: 10, outcome: 'He spends 3 months building a "Web3 loyalty program" that nobody uses, but he\'s out of your hair. The CEO is happy his nephew is "learning." Marketing lesson: Sometimes the best strategy is creative containment.' },
      { text: 'Actually try his metaverse idea', cost: 50000, brandEquity: -3, revMult: 0.95, ceoPat: 15, luck: [0.15, { brandEquity: 12, revMult: 1.15, ceoPat: 20, override: 'Against all odds, a gaming streamer discovers your metaverse presence and features it. 2 million views. The nephew is now insufferable, but hey, it worked.' }], outcome: 'You just spent $50k on a metaverse presence that got 47 visitors. The nephew calls it a "soft launch." Your team calls it something else. Marketing lesson: Don\'t let politics override strategy.' },
      { text: 'Go to HR: "This is a conflict of interest"', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: -20, outcome: 'HR agrees with you technically, but the CEO is FURIOUS. "I was just trying to give the kid experience!" Your next budget review is going to be... interesting. Marketing lesson: Being right and being politically smart are different skills.' },
      { text: 'Make him "Chief Vibes Officer" with a Slack channel nobody reads', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: 5, outcome: 'He posts daily "vibe checks" to a channel with 2 members (him and the bot). Everyone wins. He feels important, you keep control. Marketing lesson: The org chart is a suggestion, not a prison.' }
    ]
  },
  {
    id: 'quarter_crunch', type: 'pressure', title: '📊 Quarter-End Crunch Time',
    text: 'It\'s the end of the quarter. Sales is at 82% of target. The CEO, CFO, and VP Sales are in your office. "We need you to shift EVERYTHING to performance marketing. Run a 40% discount. NOW." The CFO is literally sweating.',
    choices: [
      { text: 'Comply: slash prices 40% and blast performance ads', cost: 20000, brandEquity: -12, revMult: 1.35, ceoPat: 15, outcome: 'Revenue spikes! The quarter is saved! But your brand now screams "discount bin." Customers who paid full price last week are livid. And now everyone will wait for the next sale. Marketing lesson: Discounting is a drug - easy to start, hard to stop.' },
      { text: 'Push back with a brand investment roadmap', cost: 0, brandEquity: 3, revMult: 0.95, ceoPat: -15, outcome: 'You present a beautiful deck about "long-term brand equity compound growth." The CFO falls asleep on slide 3. The CEO respects your conviction but questions your priorities. Marketing lesson: Being strategically right doesn\'t help if you get fired before the strategy plays out.' },
      { text: 'Compromise: 15% promo with brand-safe messaging', cost: 10000, brandEquity: -4, revMult: 1.12, ceoPat: 5, outcome: 'A measured response. Nobody\'s thrilled, nobody\'s fired. You thread the needle between brand integrity and commercial reality. Marketing lesson: The best answer in corporate life is usually the one where everyone is equally unhappy.' },
      { text: 'Propose a creative campaign that drives urgency without discounting', cost: 25000, brandEquity: 5, revMult: 1.0, ceoPat: -5, luck: [0.45, { brandEquity: 10, revMult: 1.25, ceoPat: 15, override: 'Your "limited edition" campaign creates genuine FOMO. Sales spike without a single discount. The CEO hugs you in the elevator. It\'s awkward but validating.' }], outcome: 'The creative campaign takes too long to produce. By the time it launches, the quarter is over. Results are meh. The CEO sends you a one-word Slack: "Noted." Marketing lesson: Timing matters as much as quality.' }
    ]
  },
  {
    id: 'influencer_rogue', type: 'crisis', title: '🤳 Influencer Gone Rogue',
    text: 'Your top influencer partner (850K followers, $15k/month retainer) just posted a video doing something deeply questionable while prominently displaying your product. It\'s at 2 million views and climbing. TMZ is calling.',
    choices: [
      { text: 'Cut ties immediately + public statement', cost: 15000, brandEquity: 5, revMult: 0.9, ceoPat: 5, outcome: 'Swift and decisive. You eat the cancellation fee, but the narrative becomes "brand with integrity." Crisis PR textbook stuff. Marketing lesson: The cost of ending a bad partnership is always less than the cost of keeping one.' },
      { text: 'Wait 48 hours - the internet has the memory of a goldfish', cost: 0, brandEquity: -5, revMult: 0.95, ceoPat: 0, luck: [0.5, { brandEquity: 0, revMult: 1.0, ceoPat: 5, override: 'You waited it out and... it actually blew over. A politician did something dumber the next day. Sometimes doing nothing IS the strategy.' }], outcome: 'Day 1: "They\'ll forget." Day 2: "Why haven\'t they dropped this influencer?!" Day 3: You\'re now part of the story. Marketing lesson: "Wait and see" is a strategy. Just not always a good one.' },
      { text: 'Find a bigger influencer to change the narrative ($40k)', cost: 40000, brandEquity: 3, revMult: 1.0, ceoPat: 5, outcome: 'You sign a wholesome mega-influencer who "just happens" to post about your product. The news cycle shifts. Expensive, but effective. Marketing lesson: In attention economics, you can always buy a new narrative.' },
      { text: 'Lean in: "We don\'t control our community, we celebrate them"', cost: 0, brandEquity: -8, revMult: 1.05, ceoPat: -10, luck: [0.25, { brandEquity: 10, revMult: 1.15, ceoPat: 5, override: 'Your radical authenticity somehow resonates. "Finally, a brand that doesn\'t pretend to be perfect!" becomes the take. Gen Z approves.' }], outcome: 'The "celebrate them" angle backfires spectacularly. You are now the brand that endorses bad behavior. Parents are emailing. Marketing lesson: Authenticity has limits. Know where yours are.' }
    ]
  },
  {
    id: 'ad_apocalypse', type: 'crisis', title: '💸 The Ad-pocalypse',
    text: 'Your Meta ads account got flagged by an overzealous algorithm. Your Google quality score tanked because a competitor filed bogus complaints. CPMs tripled overnight. Your $50k monthly ad budget is now delivering the results of $15k.',
    choices: [
      { text: 'Pause all paid media, pivot 100% to organic', cost: 0, brandEquity: 3, revMult: 0.7, ceoPat: -10, outcome: 'Revenue drops hard. Organic content takes months to compound. The CEO asks "where did the sales go?" Your data analyst shows a very sad chart. Marketing lesson: Never be 100% dependent on any single channel.' },
      { text: 'Double the budget to maintain volume', cost: 40000, brandEquity: -2, revMult: 0.95, ceoPat: 0, outcome: 'You\'re throwing money into a broken machine. It sort of works, but your CAC is now higher than your LTV. Your finance team starts involuntarily twitching. Marketing lesson: Spending more on a broken system just breaks it faster.' },
      { text: 'Diversify to TikTok, Reddit, and emerging channels', cost: 20000, brandEquity: 2, revMult: 0.85, ceoPat: -5, luck: [0.5, { brandEquity: 8, revMult: 1.2, ceoPat: 10, override: 'You struck GOLD on TikTok. A scrappy ad made on an iPhone outperforms your entire Meta strategy. Your intern who "knows TikTok" is now your most important employee.' }], outcome: 'The new channels take time to optimize. Results are mixed - Reddit users roast your ads, TikTok shows promise but you don\'t have the creative muscle yet. Marketing lesson: Channel diversification is insurance, not a quick fix.' },
      { text: 'Call your platform reps, escalate, fight it', cost: 5000, brandEquity: 0, revMult: 0.9, ceoPat: 0, luck: [0.6, { brandEquity: 0, revMult: 1.05, ceoPat: 5, override: 'Your rep actually comes through! Account restored, competitor complaints dismissed. Back to business. Sometimes the boring solution works.' }], outcome: 'You spend 3 weeks in platform support hell. Automated responses. Ticket escalations. "We\'ll look into it." Meanwhile, no ads running. Marketing lesson: Platform dependency is a business risk, not just a marketing one.' }
    ]
  },
  {
    id: 'review_bomb', type: 'crisis', title: '⭐ The Review Bomb',
    text: 'A Reddit user posted "I tried {product} and here\'s what ACTUALLY happened" - a scathing (and somewhat unfair) review. It hit the front page. Now your rating has dropped from 4.5 to 2.3 stars. Sales are in freefall.',
    choices: [
      { text: 'Launch review generation campaign with happy customers ($15k)', cost: 15000, brandEquity: 3, revMult: 0.9, ceoPat: 5, outcome: 'Real reviews from real customers slowly push the rating back up. It takes a month, but authenticity wins. Your rating recovers to 3.8. Marketing lesson: The best defense against fake outrage is real advocacy.' },
      { text: 'Respond personally to every negative review', cost: 0, brandEquity: 5, revMult: 0.85, ceoPat: 0, outcome: 'It takes you 60 hours, but people notice. Screenshots of your thoughtful responses go viral in a GOOD way. "This brand actually cares" becomes the new narrative. Marketing lesson: The unsexy work often has the highest ROI.' },
      { text: 'Hire a reputation management firm ($30k)', cost: 30000, brandEquity: -2, revMult: 0.95, ceoPat: 5, luck: [0.5, { brandEquity: 5, revMult: 1.05, ceoPat: 5, override: 'The firm works their magic. Bad reviews suppressed, positive content amplified. Ethically gray? Sure. Effective? Absolutely.' }], outcome: 'The firm\'s tactics get exposed by a journalist writing about "corporate astroturfing." Now you have TWO PR problems. Marketing lesson: Authenticity shortcuts usually cost more in the end.' },
      { text: 'Actually improve the product based on the feedback ($50k)', cost: 50000, brandEquity: 10, revMult: 0.75, ceoPat: -5, futureRevBonus: 0.15, outcome: 'Revenue takes a hit this month as you invest in product improvements. But the next version is genuinely better. The original Reddit reviewer posts an update: "They actually listened." Marketing lesson: Sometimes the best marketing is a better product.' }
    ]
  },
  {
    id: 'celebrity', type: 'positive', title: '🌟 Celebrity Sighting!',
    text: 'BREAKING: A-list celebrity was photographed using your {product} at Soho House! Paparazzi photos are everywhere. Your social mentions just 10x\'d. The phone is ringing off the hook.',
    choices: [
      { text: 'Reach out for a paid endorsement deal ($80k)', cost: 80000, brandEquity: 18, revMult: 1.3, ceoPat: 15, outcome: 'They sign! Your brand is now officially celebrity-endorsed. Revenue soars, brand equity skyrockets. The contract is expensive, but the halo effect is worth it. Marketing lesson: Strike while the iron is hot - authenticity has a short shelf life.' },
      { text: 'Amplify organically - repost, engage, ride the wave', cost: 0, brandEquity: 10, revMult: 1.15, ceoPat: 10, outcome: 'Free publicity! You repost, the comments section explodes, and your social team works overtime. The buzz lasts about 2 weeks. Marketing lesson: Organic moments are precious - and temporary.' },
      { text: 'Create an entire UGC campaign around it ($35k)', cost: 35000, brandEquity: 14, revMult: 1.2, ceoPat: 10, outcome: 'You launch a "Spotted In The Wild" campaign featuring real customers alongside the celeb sighting. It feels organic and aspirational. Marketing lesson: The best campaigns make customers feel like they\'re part of the story.' },
      { text: 'Play it cool - don\'t acknowledge it', cost: 0, brandEquity: 5, revMult: 1.05, ceoPat: -5, outcome: 'Mystery is underrated. By not acknowledging it, you seem too cool to care. Some brand enthusiasts love the subtlety. Others wonder why you\'re ignoring your biggest moment. Marketing lesson: Playing it cool works for luxury. Not great for mass market.' }
    ]
  },
  {
    id: 'tiktok_viral', type: 'positive', title: '📱 TikTok Famous (For the Right Reasons)',
    text: 'A 19-year-old just posted a TikTok using your {product} in a completely unexpected way. 8 million views. 500k likes. Comments are overwhelmingly positive. Your website traffic is up 300%.',
    choices: [
      { text: 'Duet the video + offer them a micro-influencer deal ($5k)', cost: 5000, brandEquity: 12, revMult: 1.25, ceoPat: 15, outcome: 'They\'re thrilled! Your brand duet gets another 3 million views. Authentic, scrappy, and exactly what TikTok rewards. This is how brands win in 2024. Marketing lesson: Micro-influencer authenticity beats macro-influencer reach.' },
      { text: 'Launch a TikTok challenge campaign ($20k)', cost: 20000, brandEquity: 8, revMult: 1.1, ceoPat: 10, luck: [0.6, { brandEquity: 20, revMult: 1.4, ceoPat: 20, override: 'The challenge EXPLODES. 50 million views across all participants. You\'re the #1 trending brand on TikTok. Your intern cries tears of joy. This is the moment.' }], outcome: 'The challenge gets moderate participation. It\'s fine, but it feels like a brand trying too hard to be cool. "How do you do, fellow kids?" energy. Marketing lesson: You can\'t manufacture virality.' },
      { text: 'Send free product + personal note, hope for more content', cost: 2000, brandEquity: 6, revMult: 1.1, ceoPat: 5, outcome: 'They post an unboxing! "OMG {product} actually sent me free stuff!" Another 2 million views. The gift that keeps on giving. Marketing lesson: Generosity is the cheapest form of marketing.' },
      { text: 'Boost the original video with paid media ($10k)', cost: 10000, brandEquity: 4, revMult: 1.2, ceoPat: 10, outcome: 'Smart move. You amplify authentic content rather than creating fake authenticity. The boosted video drives real conversions. Marketing lesson: Amplify what works. Don\'t reinvent it.' }
    ]
  },
  {
    id: 'budget_cuts', type: 'pressure', title: '✂️ Budget Cuts Incoming',
    text: 'The CFO just sent a company-wide email: "Strategic cost optimization initiative." Translation: budget cuts. They want $100k back from marketing. The CEO says "do more with less." (Everyone takes a shot.)',
    choices: [
      { text: 'Accept gracefully and optimize', cost: -100000, brandEquity: 0, revMult: 0.85, ceoPat: 15, outcome: 'You\'re $100k lighter but the CEO respects your team-player attitude. You find some genuine waste to cut. The performance marketing campaign that was spending $8k/month on bot clicks? Gone. Marketing lesson: Constraints breed creativity. (That\'s what you tell yourself.)' },
      { text: 'Present ROI analysis to fight the cuts', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: -5, luck: [0.55, { brandEquity: 2, revMult: 1.0, ceoPat: 10, override: 'Your data is AIRTIGHT. The CFO actually reverses the cut and apologizes. "I didn\'t realize marketing was driving this much pipeline." Screenshot this moment. It will never happen again.', cost: 0 }], outcome: 'The CFO doesn\'t care about your attribution model. "Every department thinks they\'re special." Budget cut stands. You also now have an enemy in Finance. Marketing lesson: Data only wins arguments with people who believe in data.' },
      { text: 'Threaten to quit', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: -25, luck: [0.2, { brandEquity: 0, revMult: 1.0, ceoPat: 5, override: 'The CEO blinks! "Fine, keep your budget." You feel powerful for exactly 24 hours until you realize you can never use this card again.', cost: 0 }], outcome: '"We\'ll miss you." The CEO calls your bluff. Security is walking you out while you try to explain you were just negotiating. Marketing lesson: Don\'t bring a threat to a spreadsheet fight.', gameOver: 0.6 },
      { text: 'Propose cutting 50k and reallocating to higher-ROI channels', cost: -50000, brandEquity: 0, revMult: 0.95, ceoPat: 10, outcome: 'The compromise lands well. You lose less than threatened, and the reallocation actually improves efficiency. The CFO feels like they won. You feel like you won. Classic corporate win-win-lose (the budget lost). Marketing lesson: Compromise is the language of survival.' }
    ]
  },
  {
    id: 'sales_fight', type: 'pressure', title: '⚔️ Sales vs. Marketing Showdown',
    text: 'The VP of Sales storms into your standup. "YOUR LEADS ARE GARBAGE. My team is wasting time on tire-kickers who can\'t spell their own credit card number!" He\'s red-faced. The CEO is cc\'d on the angry email.',
    choices: [
      { text: 'Implement lead scoring + SLA between teams ($10k)', cost: 10000, brandEquity: 2, revMult: 1.05, ceoPat: 10, outcome: 'You set up proper lead scoring, define MQLs vs SQLs, and create a handoff SLA. It takes a month to calibrate, but suddenly Sales and Marketing are speaking the same language. Marketing lesson: Alignment > argument. Process > politics.' },
      { text: '"Your team can\'t close a door, let alone a deal"', cost: 0, brandEquity: 0, revMult: 0.95, ceoPat: -15, outcome: 'SHOTS FIRED. The war between Sales and Marketing goes nuclear. The CEO calls an all-hands to address "team culture." You both get a talking-to. Marketing lesson: Being right doesn\'t matter if you burn the relationship.' },
      { text: 'Joint "smarketing" workshop + shared dashboard ($5k)', cost: 5000, brandEquity: 3, revMult: 1.0, ceoPat: 5, outcome: 'You bring pizza and a shared Looker dashboard. It\'s awkward for 30 minutes, then actually productive. You discover Sales was ignoring follow-up emails. They discover your lead forms were broken on mobile. Marketing lesson: 80% of marketing-sales problems are communication problems.' },
      { text: 'Give Sales exactly what they want: gate everything, qualify harder', cost: 0, brandEquity: -3, revMult: 0.9, ceoPat: 5, outcome: 'Lead volume drops 60%. The leads are "better" but there are so few that Sales still can\'t hit quota. Now it\'s somehow still your fault. Marketing lesson: Giving people what they ask for and what they need are different things.' }
    ]
  },
  {
    id: 'algorithm_change', type: 'market', title: '🔄 Algorithm Apocalypse',
    text: 'Instagram and TikTok both changed their algorithms on the same week. Your organic reach dropped 75%. The content strategy you spent 3 months building? Worthless. Your social media manager is stress-eating in the break room.',
    choices: [
      { text: 'Pivot to short-form video + Reels ($15k production)', cost: 15000, brandEquity: 2, revMult: 0.9, ceoPat: 0, luck: [0.55, { brandEquity: 8, revMult: 1.1, ceoPat: 10, override: 'Your pivot to video pays off beautifully. The new Reels strategy actually gets MORE reach than the old approach. Turns out the algorithm change was a gift in disguise.' }], outcome: 'The pivot takes time. Your first batch of Reels looks like a hostage video. Quality improves by week 3, but you\'ve lost momentum. Marketing lesson: Platform dependency is a strategic risk. Always have a Plan B.' },
      { text: 'Shift budget from organic to paid social', cost: 15000, brandEquity: -3, revMult: 1.0, ceoPat: 5, outcome: 'You\'re now paying for what you used to get free. The platforms win again. Your paid social works but it\'s essentially a tax on reach. Marketing lesson: Zuckerberg always wins. Always.' },
      { text: 'Invest in owned channels: email, SEO, community ($25k)', cost: 25000, brandEquity: 8, revMult: 0.85, ceoPat: -5, futureRevBonus: 0.10, outcome: 'Revenue dips this month but you\'re building on land you OWN. Email list grows. SEO starts climbing. Your community Discord has 5,000 members who actually care. Marketing lesson: Rented audiences are rented. Build on owned land.' },
      { text: 'Create engagement bait content to game the algorithm', cost: 0, brandEquity: -8, revMult: 1.05, ceoPat: 0, outcome: '"Tag someone who needs to see this!" "Save for later!" Your content becomes the marketing equivalent of clickbait. Reach recovers but your audience quality plummets. Marketing lesson: Gaming algorithms is a treadmill - you\'ll never stop running.' }
    ]
  },
  {
    id: 'copycat', type: 'market', title: '🐱 The Copycat Competitor',
    text: 'A VC-backed competitor just launched a nearly identical {product} at 20% less. They\'re running side-by-side comparison ads. Their tagline? "Like {name}, but better." They have $5M in funding. You have anxiety.',
    choices: [
      { text: 'Differentiate: double down on brand story ($30k)', cost: 30000, brandEquity: 12, revMult: 0.95, ceoPat: 5, outcome: 'You can\'t outspend them, so you outbrand them. Your "why" story resonates deeper than their "what" features. Customers who love your brand are immune to price competition. Marketing lesson: Brand is the only sustainable competitive moat.' },
      { text: 'Match their price', cost: 0, brandEquity: -8, revMult: 0.85, ceoPat: 0, outcome: 'You can match their price but not their funding. They can keep bleeding; can you? Revenue drops as margins shrink. This is a war of attrition you can\'t win. Marketing lesson: Never compete on price unless you\'re the low-cost leader.' },
      { text: 'Sue for trademark/trade dress infringement ($50k)', cost: 50000, brandEquity: 0, revMult: 0.9, ceoPat: -5, luck: [0.3, { brandEquity: 10, revMult: 1.1, ceoPat: 15, override: 'You win the injunction! Competitor forced to rebrand. The press coverage frames you as the original innovator. Sometimes lawyers ARE the best marketing channel.', cost: -20000 }], outcome: 'Legal drags on for months. Meanwhile, they keep selling. The judge says it\'s not similar enough to warrant an injunction. You\'re out $50k with nothing to show for it. Marketing lesson: Litigation is not a marketing strategy.' },
      { text: 'Ignore them and focus on your core audience', cost: 0, brandEquity: 3, revMult: 0.9, ceoPat: -5, luck: [0.4, { brandEquity: 5, revMult: 1.05, ceoPat: 5, override: 'Your confidence pays off. They run out of funding in 6 months and pivot to crypto. Your audience respects that you didn\'t flinch.' }], outcome: 'Staying the course while a competitor eats your lunch requires nerves of steel. And a board that believes in you. Yours is getting nervous. Marketing lesson: Ignoring competition is only a strategy if you\'re genuinely ahead.' }
    ]
  },
  {
    id: 'data_breach', type: 'crisis', title: '🔐 Data Breach Scare',
    text: 'Your email service provider was hacked. Customer emails and purchase history may have been exposed. A security researcher just tweeted about it. Media is reaching out for comment. Legal is panicking.',
    choices: [
      { text: 'Full transparency: notify everyone, offer credit monitoring ($40k)', cost: 40000, brandEquity: 8, revMult: 0.85, ceoPat: -5, outcome: 'You take a revenue hit and the CEO is furious about the cost, but customers TRUST you now. Privacy-conscious consumers become loyal advocates. Marketing lesson: Transparency is expensive in the short term and invaluable in the long term.' },
      { text: 'Minimal disclosure: notify only confirmed affected users ($15k)', cost: 15000, brandEquity: -2, revMult: 0.92, ceoPat: 5, luck: [0.4, { brandEquity: -15, revMult: 0.7, ceoPat: -15, override: 'A journalist discovers you under-reported the breach. Now it\'s not just a data incident - it\'s a COVER-UP. Regulators are involved. This is a nightmare.' }], outcome: 'You thread the legal needle. Technically compliant, ethically questionable. Most customers never notice. Marketing lesson: Minimum compliance is a strategy - until it isn\'t.' },
      { text: 'Spin it: "We proactively identified a security concern" ($10k)', cost: 10000, brandEquity: -5, revMult: 0.95, ceoPat: 5, outcome: 'The spin works on boomers. Gen Z sees right through it and drags you on Twitter. "Proactively identified" becomes a meme. Marketing lesson: Corporate euphemisms are a language nobody trusts.' },
      { text: 'Say nothing. Hope it goes away.', cost: 0, brandEquity: -10, revMult: 0.9, ceoPat: 0, luck: [0.3, { brandEquity: 0, revMult: 1.0, ceoPat: 5, override: 'By some miracle, the story gets buried under bigger news. You got away with it this time. Start looking for a better email provider.' }], outcome: 'The journalist publishes without your comment. "Company refused to respond" is never a good look. The narrative is written without you. Marketing lesson: Silence is not a communications strategy.' }
    ]
  },
  {
    id: 'viral_fail', type: 'crisis', title: '😬 The Viral Fail',
    text: 'Your latest campaign went viral... for the wrong reasons. The ad intended to be empowering is being called tone-deaf. There are already 15 parody versions. Your brand name is trending with 🤡 emojis.',
    choices: [
      { text: 'Pull the campaign immediately', cost: 20000, brandEquity: -3, revMult: 0.9, ceoPat: -5, outcome: 'You eat the production cost and move on. The memes die in 48 hours. Your brand takes a small hit but recovers quickly. Marketing lesson: Kill your darlings fast. Sunk costs are sunk.' },
      { text: 'Lean into the memes - repost and laugh at yourself', cost: 0, brandEquity: 0, revMult: 0.95, ceoPat: -5, luck: [0.5, { brandEquity: 12, revMult: 1.1, ceoPat: 10, override: 'MASTERCLASS in self-awareness. You repost the best parodies, create your own, and the narrative flips from "tone-deaf brand" to "brand with actual personality." BrandWeek writes about your response.' }], outcome: 'Laughing at yourself while people are genuinely upset reads as dismissive. The memes continue, now with "they think this is funny" added to the criticism. Marketing lesson: Self-deprecation only works when you\'re not the villain.' },
      { text: 'Double down: "We stand by our creative vision"', cost: 0, brandEquity: -10, revMult: 0.85, ceoPat: -10, luck: [0.2, { brandEquity: 8, revMult: 1.1, ceoPat: 10, override: 'Somehow your defiance resonates. "At least they have conviction," people say. Contrarians rally to your defense. You just became a cult brand by accident.' }], outcome: 'The "we stand by it" statement becomes its own meme. You are now the brand that doesn\'t listen to customers. Bold strategy. Marketing lesson: Conviction is admirable. Stubbornness is not.' },
      { text: 'Quietly replace the ad and redirect the conversation ($5k)', cost: 5000, brandEquity: -1, revMult: 0.95, ceoPat: 0, outcome: 'You swap the creative, post something unrelated and upbeat, and slowly the conversation moves on. Not glamorous, but effective. Marketing lesson: Sometimes the best marketing is just showing up normal the next day.' }
    ]
  },
  {
    id: 'recession', type: 'market', title: '📉 Recession Vibes',
    text: 'The economy is shaking. Consumer confidence is down. Your category is seeing 15% declines across the board. The board wants to know: do you cut marketing or lean in while competitors retreat?',
    choices: [
      { text: 'Cut marketing spend 30% to preserve runway', cost: -30000, brandEquity: -5, revMult: 0.8, ceoPat: 10, outcome: 'You survive but shrink. Every marketing textbook says this is the wrong move, but the CFO\'s relief is palpable. You\'ll spend months rebuilding what you cut. Marketing lesson: Brands that cut during recessions lose market share they never recover.' },
      { text: 'Maintain spending - grab market share while competitors hide', cost: 0, brandEquity: 8, revMult: 0.9, ceoPat: -10, outcome: 'Revenue dips because the MARKET dips, but your share of voice increases. When the recovery comes, you\'ll be positioned to win. If you survive that long. Marketing lesson: Recessions reward the brave (and well-funded).' },
      { text: 'Shift to value messaging and practical positioning ($10k)', cost: 10000, brandEquity: 3, revMult: 0.95, ceoPat: 5, outcome: 'Smart pivot. "Why {product} is worth it, even now" resonates with anxious consumers. You don\'t look out of touch, and you don\'t look desperate. Marketing lesson: Match your messaging to the moment.' },
      { text: 'Go AGGRESSIVE: "Buy when there\'s blood in the streets" ($50k extra)', cost: 50000, brandEquity: 5, revMult: 0.85, ceoPat: -15, luck: [0.4, { brandEquity: 15, revMult: 1.3, ceoPat: 15, override: 'LEGENDARY MOVE. You gobbled up cheap ad inventory, hired two people your competitor laid off, and when the market rebounds, you EXPLODE. Marketing case studies will be written about this.' }], outcome: 'You burn through cash during a downturn. The board is apoplectic. Revenue doesn\'t spike because consumer spending is DOWN regardless of your ad spend. Marketing lesson: You can\'t advertise your way out of a recession.' }
    ]
  },
  {
    id: 'press_feature', type: 'positive', title: '📰 Glowing Press Coverage',
    text: 'The New York Times just published a feature: "How {product} Is Changing the {industry}." The article is overwhelmingly positive. Your PR team is popping champagne at 10am (acceptable in PR).',
    choices: [
      { text: 'Maximize it: social amplification + email blast + landing page ($8k)', cost: 8000, brandEquity: 15, revMult: 1.2, ceoPat: 15, outcome: 'You squeeze every drop of value from that NYT feature. "As seen in The New York Times" becomes your new email signature, LinkedIn banner, and conversation starter. Marketing lesson: Earned media has a multiplier effect when properly amplified.' },
      { text: 'Use it to pitch more outlets - ride the press wave ($3k)', cost: 3000, brandEquity: 10, revMult: 1.1, ceoPat: 10, outcome: 'Other outlets pick up the story. Forbes, Business Insider, and three podcasts want to interview you. Press begets press. Marketing lesson: PR momentum compounds. One story can become ten.' },
      { text: 'Negotiate a sponsored content series with NYT ($60k)', cost: 60000, brandEquity: 8, revMult: 1.15, ceoPat: 5, outcome: 'The sponsored content is professional but everyone can tell it\'s an ad. It\'s fine, but lacks the magic of the original organic feature. Marketing lesson: You can\'t buy what earned media gives you for free.' },
      { text: 'Stay humble - just share it once and move on', cost: 0, brandEquity: 6, revMult: 1.05, ceoPat: 0, outcome: 'Understated. Some people respect the humility. Your CEO, however, is furious you\'re not making a bigger deal of it. Marketing lesson: In the attention economy, modesty is a luxury few brands can afford.' }
    ]
  },
  {
    id: 'community_love', type: 'positive', title: '💕 Organic Community Growth',
    text: 'Something beautiful is happening. Without any paid effort, a community of {product} fans has formed. They have a subreddit (12k members), a Discord (8k), and they\'re creating memes, fan art, and unboxing videos. This is the holy grail.',
    choices: [
      { text: 'Nurture it: dedicate resources to community management ($12k)', cost: 12000, brandEquity: 15, revMult: 1.15, ceoPat: 10, outcome: 'You hire a community manager who actually Gets It. They engage authentically, share insider content, and the community grows 3x in a month. These are your most loyal customers. Marketing lesson: Community is the most undervalued marketing channel.' },
      { text: 'Monetize it: launch an ambassador/referral program ($8k)', cost: 8000, brandEquity: 5, revMult: 1.2, ceoPat: 15, outcome: 'The referral program converts community love into revenue. Some purists grumble about "selling out," but most people appreciate the discount codes. Marketing lesson: There\'s a thin line between empowering a community and exploiting it.' },
      { text: 'Join it as the brand - post directly in the community', cost: 0, brandEquity: 8, revMult: 1.05, ceoPat: 5, luck: [0.5, { brandEquity: 12, revMult: 1.15, ceoPat: 10, override: 'Your brand\'s presence in the community is welcomed with open arms! They love that you\'re "one of them." Direct feedback improves your product AND your marketing.' }], outcome: 'The community has mixed feelings about the brand showing up in "their" space. Some welcome it, others feel like the cool indie thing just got corporate. Tread carefully. Marketing lesson: Brands entering organic communities should listen 10x more than they speak.' },
      { text: 'Leave it alone - organic is organic, don\'t ruin it', cost: 0, brandEquity: 5, revMult: 1.05, ceoPat: -5, outcome: 'The community continues to grow naturally. No intervention, no interference. It\'s authentic and pure. But also, you\'re leaving money and brand equity on the table. Marketing lesson: Sometimes the best marketing decision is not marketing.' }
    ]
  },
  {
    id: 'rebrand_tempt', type: 'pressure', title: '🎨 The Rebrand Temptation',
    text: 'Your agency (or your designer, if you didn\'t hire an agency) pitches a complete rebrand. New logo, new colors, new messaging, new everything. The mockups are stunning. But you\'re only {month} months in...',
    choices: [
      { text: 'Full rebrand! Out with the old! ($60k)', cost: 60000, brandEquity: -15, revMult: 0.85, ceoPat: -10, luck: [0.3, { brandEquity: 20, revMult: 1.1, ceoPat: 10, override: 'Against all odds, the rebrand is a SMASH. The new identity perfectly captures the zeitgeist. Customers love it. Design blogs feature it. You just pulled off the riskiest move in marketing.', brandEquity: 15 }], outcome: 'You just reset 6 months of brand recognition to zero. Existing customers are confused. "Is this the same company?" Your SEO tanks as the brand name change destroys search equity. Marketing lesson: Rebranding mid-launch is like changing planes mid-flight.' },
      { text: 'Minor refresh - keep the core, update the edges ($15k)', cost: 15000, brandEquity: 3, revMult: 1.0, ceoPat: 5, outcome: 'A sensible evolution. New brand photography, tightened messaging, updated social templates. Familiar enough to keep recognition, fresh enough to feel current. Marketing lesson: Brand evolution > brand revolution.' },
      { text: 'Stick with what we have', cost: 0, brandEquity: 1, revMult: 1.0, ceoPat: 0, outcome: 'Consistency is an underrated superpower. Your brand may not be perfect, but people recognize it. In a world of constant change, staying the course IS a strategy. Marketing lesson: The best brands are boringly consistent.' },
      { text: 'Fire the agency for suggesting this', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: 0, outcome: 'Dramatic. The agency is stunned. (They also bill you for the pitch work: $8k.) But your message is clear: we\'re focused on execution, not decoration. Marketing lesson: Know when creativity serves strategy and when it derails it.' }
    ]
  },
  {
    id: 'supply_chain', type: 'crisis', title: '📦 Supply Chain Meltdown',
    text: 'Your manufacturer just called: production delays mean you\'ll have 60% less inventory for the next 6 weeks. Your best-selling SKU is already out of stock. Customer service is drowning in "where\'s my order" emails.',
    choices: [
      { text: 'Pause marketing completely until supply stabilizes', cost: 0, brandEquity: -3, revMult: 0.5, ceoPat: -10, outcome: 'Revenue craters but at least you\'re not advertising something people can\'t buy. The dark period feels like an eternity. Your team starts "exploring other opportunities." Marketing lesson: Going dark is rarely the right answer - you\'re ceding ground to competitors.' },
      { text: 'Pivot to waitlist / pre-order strategy ($10k)', cost: 10000, brandEquity: 8, revMult: 0.7, ceoPat: 5, outcome: 'Scarcity becomes a feature, not a bug. "Join the waitlist" creates FOMO. When products ship, the unboxing content is GRATEFUL, not entitled. Marketing lesson: Scarcity + transparency = desire.' },
      { text: 'Keep marketing but shift to brand storytelling', cost: 5000, brandEquity: 6, revMult: 0.6, ceoPat: 0, outcome: 'You use the downtime to invest in content: founder story, behind-the-scenes, production quality features. People fall in love with the brand even before they can buy. Marketing lesson: When you can\'t sell, tell stories.' },
      { text: 'Source from a backup manufacturer at 2x cost ($30k premium)', cost: 30000, brandEquity: 0, revMult: 0.9, ceoPat: 10, outcome: 'Product keeps flowing, but margins are razor-thin. The backup quality is slightly lower. Three 1-star reviews mention it. Marketing lesson: Quality consistency IS marketing.' }
    ]
  }
];

// Holiday season special event
const HOLIDAY_EVENT = {
  title: '🎄 Holiday Season: The Final Push',
  text: 'It\'s November. The holiday season has arrived - the Super Bowl of commerce. Every decision you\'ve made leads to this moment. Your brand equity score will determine your holiday multiplier. This is where fortunes are made... or lost.',
  strategies: [
    { name: 'Brand-Led Holiday Campaign', cost: 40000, brandMult: 1.0, perfMult: 0.3, desc: 'Emotional storytelling. "The holidays are about..." You know the type. Coca-Cola polar bears energy.', icon: '🎅' },
    { name: 'Black Friday Blitz', cost: 30000, brandMult: 0.2, perfMult: 1.0, desc: '50% OFF EVERYTHING. DOORBUSTER DEALS. LOWEST PRICES OF THE YEAR. Your brand equity weeps quietly.', icon: '🏷️' },
    { name: 'Balanced Holiday Mix', cost: 35000, brandMult: 0.6, perfMult: 0.6, desc: 'Taste the holiday spirit with a blend of brand-building and promotional tactics.', icon: '⚖️' },
    { name: 'Influencer Gift Guide Push', cost: 50000, brandMult: 0.8, perfMult: 0.7, desc: 'Get into every "Gift Guide" and "Holiday Haul" video. Expensive but effective.', icon: '🎁' }
  ]
};

// ===== GAME STATE =====
let G = {};

function initState() {
  G = {
    screen: 'title',
    playerName: '',
    product: null,
    productName: '',
    positioning: null,
    team: {},
    budget: 5000000,
    startingBudget: 5000000,
    totalRevenue: 0,
    monthlyRevenue: [],
    brandEquity: 10,
    ceoPat: 75,
    turn: 0,
    maxTurns: 12,
    allocation: { brand: 50000, performance: 75000, pr: 40000, events: 25000 },
    teamCostPerMonth: 0,
    brandTier: null,
    siteTier: null,
    researchTier: null,
    launchTactics: [],
    conflictOrder: [],
    prelaunchRevBonus: 0,
    siteRevBonus: 0,
    futureRevBonus: 0,
    _launchRevBoost: 0,
    title: 'VP of Marketing',
    gameOver: false,
    gameOverReason: '',
    consecutiveBad: 0,
    lastConflictOutcome: null,
    bonusesReceived: 0,
    hasSave: false,
    midYearReviewDone: false
  };

  // Check for save
  try {
    if (localStorage.getItem('cmoGameSave')) {
      G.hasSave = true;
    }
  } catch (e) { }
}

function saveGame() {
  try {
    localStorage.setItem('cmoGameSave', JSON.stringify(G));
  } catch (e) { console.error('Save failed', e); }
}

function loadGame() {
  try {
    const saved = localStorage.getItem('cmoGameSave');
    if (saved) {
      G = JSON.parse(saved);
      // Ensure hasSave is true so they don't lose the button if they quit again immediately
      G.hasSave = true;
      render();
    }
  } catch (e) { console.error('Load failed', e); }
}

function clearSave() {
  try {
    localStorage.removeItem('cmoGameSave');
    G.hasSave = false;
  } catch (e) { }
}

function runConfetti(type) {
  if (typeof confetti === 'undefined') return;

  if (type === 'launch') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  } else if (type === 'goodMonth') {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#00ff41', '#ffd700']
    });
  } else if (type === 'win') {
    var duration = 3000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: rand(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: rand(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }
}

// ===== UTILITY FUNCTIONS =====
function $(s) { return document.querySelector(s); }
function $$(s) { return document.querySelectorAll(s); }
function fmt(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'k';
  return '$' + n.toLocaleString();
}
function fmtFull(n) { return '$' + Math.round(n).toLocaleString(); }
function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function shuffleConflicts() {
  let pool = [...CONFLICTS];
  // Ensure mix of types
  let crises = pool.filter(c => c.type === 'crisis');
  let positive = pool.filter(c => c.type === 'positive');
  let pressure = pool.filter(c => c.type === 'pressure');
  let market = pool.filter(c => c.type === 'market');

  // Shuffle each pool
  [crises, positive, pressure, market].forEach(arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  });

  // Build 11 conflicts ensuring variety
  let selected = [];
  // At least 3 crises, 2 positive, 2 pressure, 2 market
  selected.push(...crises.slice(0, 3));
  selected.push(...positive.slice(0, 2));
  selected.push(...pressure.slice(0, 2));
  selected.push(...market.slice(0, 2));

  // Fill remaining 2 slots randomly
  let remaining = [...crises.slice(3), ...positive.slice(2), ...pressure.slice(2), ...market.slice(2)];
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }
  selected.push(...remaining.slice(0, 2));

  // Shuffle the selected conflicts, but try to spread types
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  // Ensure we don't start with a positive event (feels weird)
  if (selected[0].type === 'positive') {
    const swapIdx = selected.findIndex(c => c.type !== 'positive');
    [selected[0], selected[swapIdx]] = [selected[swapIdx], selected[0]];
  }

  G.conflictOrder = selected;
}

// ===== REVENUE CALCULATION =====
function calcTeamMultiplier() {
  let mult = 0.7; // base with no team
  const t = G.team;
  ROLES.forEach(r => {
    if (t[r.id] === 'ft') mult += 0.08;
    else if (t[r.id] === 'agency') mult += 0.06;
    // skip = 0
  });
  // Bonus for performance agency (they're specialists)
  if (t.growth === 'agency') mult += 0.03;
  // Bonus for full-time brand strategist
  if (t.brand === 'ft') mult += 0.02;
  return mult;
}

function calcTeamCost() {
  let cost = 0;
  ROLES.forEach(r => {
    if (G.team[r.id] === 'ft') cost += r.ftCost;
    else if (G.team[r.id] === 'agency') cost += r.agCost;
  });
  G.teamCostPerMonth = cost;
}

function calcMonthlyRevenue(month, allocOverride) {
  const p = PRODUCTS[G.product];
  const pos = POSITIONINGS[G.positioning];
  const alloc = allocOverride || G.allocation;

  let base = p.baseRevenue;
  let growth = 1 + (month - 1) * p.growth;
  let brandMult = 1 + (G.brandEquity / 100) * 0.8;
  let teamMult = calcTeamMultiplier();
  let posMult = pos.revMult;
  let siteMult = 1 + G.siteRevBonus;
  let brandTierMult = 1 + G.prelaunchRevBonus;
  let futureMult = 1 + G.futureRevBonus;

  // Allocation effects
  let perfBoost = 1 + (alloc.performance / 40000) * 0.25;
  let prBoost = 1 + (alloc.pr / 25000) * 0.1;
  let eventBoost = 1 + (alloc.events / 25000) * 0.08;
  let brandAllocBoost = 1 + (alloc.brand / 30000) * 0.05;

  let rev = base * growth * brandMult * teamMult * posMult * siteMult * brandTierMult * futureMult * perfBoost * prBoost * eventBoost * brandAllocBoost;

  // Randomness: +/- 15%
  rev *= rand(0.85, 1.15);

  return Math.round(rev);
}

function calcBrandEquityChange(alloc) {
  let change = 0;
  const t = G.team;

  // Team effects
  if (t.brand === 'ft') change += 2.0;
  else if (t.brand === 'agency') change += 1.0;
  else change -= 1.0;

  if (t.content === 'ft') change += 0.5;
  if (t.data === 'ft') change += 0.3;

  // Positioning bonus
  change += POSITIONINGS[G.positioning].brandBonus * 0.3;

  // Allocation effects
  change += alloc.brand * ALLOC_CATEGORIES[0].equityPerDollar;
  change += alloc.performance * ALLOC_CATEGORIES[1].equityPerDollar; // slightly negative
  change += alloc.pr * ALLOC_CATEGORIES[2].equityPerDollar;
  change += alloc.events * ALLOC_CATEGORIES[3].equityPerDollar;

  return change;
}

function processMonth() {
  const alloc = G.allocation;
  const totalSpend = alloc.brand + alloc.performance + alloc.pr + alloc.events + G.teamCostPerMonth;

  // Deduct spend
  G.budget -= totalSpend;

  // Calculate revenue
  let rev = calcMonthlyRevenue(G.turn);
  // Apply one-time launch boost to first month
  if (G._launchRevBoost) {
    rev = Math.round(rev * (1 + G._launchRevBoost));
    G._launchRevBoost = 0;
  }
  G.monthlyRevenue.push(rev);
  G.totalRevenue += rev;

  // Update brand equity
  const beChange = calcBrandEquityChange(alloc);
  G.brandEquity = clamp(G.brandEquity + beChange, 0, 100);

  // CEO patience decay / growth based on revenue trend
  if (G.monthlyRevenue.length >= 2) {
    const prev = G.monthlyRevenue[G.monthlyRevenue.length - 2];
    if (rev > prev * 1.1) G.ceoPat = clamp(G.ceoPat + 5, 0, 100);
    else if (rev < prev * 0.85) G.ceoPat = clamp(G.ceoPat - 8, 0, 100);
  }

  // Revenue bonus: if great month, CEO gives bonus budget
  const avgRev = G.totalRevenue / G.monthlyRevenue.length;
  if (rev > avgRev * 1.3 && Math.random() > 0.5) {
    const bonus = Math.round(rand(30000, 80000));
    G.budget += bonus;
    G.bonusesReceived += bonus;
    // Auto-save
    saveGame();
    return { rev, totalSpend, beChange, bonus };
  }

  // Auto-save after processing month
  saveGame();

  return { rev, totalSpend, beChange, bonus: 0 };
}

function processHoliday(strategyIdx) {
  const strat = HOLIDAY_EVENT.strategies[strategyIdx];
  G.budget -= strat.cost;

  // Holiday multiplier based on brand equity
  const baseHolidayMult = 1.5;
  const brandBonus = (G.brandEquity / 100) * 2.5;
  const holidayMult = baseHolidayMult + brandBonus;

  // Strategy affects how much of the multiplier you capture
  const effectiveMult = holidayMult * (0.5 + strat.brandMult * 0.3 + strat.perfMult * 0.2);

  const baseRev = calcMonthlyRevenue(13);
  const holidayRev = Math.round(baseRev * effectiveMult);

  G.monthlyRevenue.push(holidayRev);
  G.totalRevenue += holidayRev;
  G.turn = 13;

  return { holidayRev, holidayMult: effectiveMult, strategy: strat };
}

function applyConflictChoice(conflictIdx, choiceIdx) {
  const conflict = G.conflictOrder[conflictIdx];
  const choice = conflict.choices[choiceIdx];

  let outcome = choice.outcome;
  let effects = {
    cost: choice.cost || 0,
    brandEquity: choice.brandEquity || 0,
    revMult: choice.revMult || 1.0,
    ceoPat: choice.ceoPat || 0,
    gameOver: false
  };
  let isLucky = false;

  // Check for luck
  if (choice.luck) {
    const [chance, luckyEffects] = choice.luck;
    if (Math.random() < chance) {
      isLucky = true;
      outcome = luckyEffects.override || outcome;
      effects.brandEquity = luckyEffects.brandEquity ?? effects.brandEquity;
      effects.revMult = luckyEffects.revMult ?? effects.revMult;
      effects.ceoPat = luckyEffects.ceoPat ?? effects.ceoPat;
      if (luckyEffects.cost !== undefined) effects.cost = luckyEffects.cost;
    }
  }

  // Check for game over chance
  if (choice.gameOver && !isLucky) {
    if (Math.random() < choice.gameOver) {
      effects.gameOver = true;
    }
  }

  // Apply effects
  G.budget -= effects.cost;
  G.brandEquity = clamp(G.brandEquity + effects.brandEquity, 0, 100);
  G.ceoPat = clamp(G.ceoPat + effects.ceoPat, 0, 100);

  // Future revenue bonus
  if (choice.futureRevBonus) {
    G.futureRevBonus += choice.futureRevBonus;
  }

  // Track bad outcomes for consecutive counter
  if (effects.brandEquity < -5 || effects.revMult < 0.85) {
    G.consecutiveBad++;
  } else {
    G.consecutiveBad = 0;
  }

  // Revenue multiplier applies this turn
  const revEffect = effects.revMult;

  // Check game over conditions
  if (effects.gameOver) {
    G.gameOver = true;
    G.gameOverReason = 'You pushed too hard and got pushed out. The CEO accepted your "resignation" before you even offered it.';
  } else if (G.budget < 0) {
    G.gameOver = true;
    G.gameOverReason = 'Your budget hit zero. The CFO personally escorted you to HR. "We appreciate your creativity," they said, not meaning it at all.';
  } else if (G.ceoPat <= 0) {
    G.gameOver = true;
    G.gameOverReason = 'The CEO\'s patience ran out. "We\'re going in a different direction," they said, which is corporate for "you\'re going in the direction of the exit."';
  } else if (G.consecutiveBad >= 4) {
    G.gameOver = true;
    G.gameOverReason = 'Four bad moves in a row. The board has lost confidence. Your "strategic leadership" is being "transitioned." You have 30 minutes to clean out your desk.';
  }

  // Store revenue multiplier for this month's processing
  G._tempRevMult = revEffect;

  return { outcome, effects, isLucky, conflict };
}

// ===== LEADERBOARD =====
function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem('marketingTrailLeaderboard') || '[]');
  } catch { return []; }
}

function saveScore() {
  const entry = {
    name: G.playerName,
    product: G.productName,
    category: PRODUCTS[G.product].name,
    revenue: G.totalRevenue,
    brandEquity: Math.round(G.brandEquity),
    title: G.title,
    date: new Date().toLocaleDateString(),
    turns: G.turn
  };
  const lb = getLeaderboard();
  lb.push(entry);
  lb.sort((a, b) => b.revenue - a.revenue);
  localStorage.setItem('marketingTrailLeaderboard', JSON.stringify(lb.slice(0, 20)));
  return entry;
}

function getShareText() {
  const grade = G.totalRevenue >= 8000000 ? '🏆' : G.totalRevenue >= 5000000 ? '⭐' : G.totalRevenue >= 2500000 ? '✅' : '💀';
  return `🎮 The Marketing Trail ${grade}
📦 ${G.productName} (${PRODUCTS[G.product].name})
💰 Revenue: ${fmt(G.totalRevenue)}
🏗️ Brand Equity: ${Math.round(G.brandEquity)}/100
👔 Final Title: ${G.title}
🗓️ Survived: ${G.turn}/13 months

Can you beat my score?`;
}

// ===== RENDERING =====
function render() {
  window.scrollTo(0, 0);
  const app = document.getElementById('app');
  switch (G.screen) {
    case 'title': app.innerHTML = renderTitle(); break;
    case 'productSelect': app.innerHTML = renderProductSelect(); break;
    case 'naming': app.innerHTML = renderNaming(); break;
    case 'positioning': app.innerHTML = renderPositioning(); break;
    case 'teamBuilding': app.innerHTML = renderTeamBuilding(); break;
    case 'preLaunch': app.innerHTML = renderPreLaunch(); break;
    case 'preLaunchSummary': app.innerHTML = renderPreLaunchSummary(); break;
    case 'conflict': app.innerHTML = renderConflict(); break;
    case 'conflictResult': app.innerHTML = renderConflictResult(); break;
    case 'allocation': app.innerHTML = renderAllocation(); break;
    case 'monthResults': app.innerHTML = renderMonthResults(); break;
    case 'holiday': app.innerHTML = renderHoliday(); break;
    case 'holidayResults': app.innerHTML = renderHolidayResults(); break;
    case 'finalResults': app.innerHTML = renderFinalResults(); break;
    case 'gameOver': app.innerHTML = renderGameOver(); break;
    case 'leaderboard': app.innerHTML = renderLeaderboard(); break;
  }
}

function renderStatsBar() {
  const equityColor = G.brandEquity >= 60 ? 'green' : G.brandEquity >= 30 ? 'amber' : 'red';
  const ceoColor = G.ceoPat >= 60 ? 'green' : G.ceoPat >= 30 ? 'amber' : 'red';

  // Run rate calculation
  const alloc = G.allocation;
  const monthlyBurn = alloc.brand + alloc.performance + alloc.pr + alloc.events + G.teamCostPerMonth;
  const monthsLeft = Math.max(1, 13 - G.turn + 1);
  const runwayMonths = monthlyBurn > 0 ? Math.floor(G.budget / monthlyBurn) : 99;
  const runRateWarning = runwayMonths < monthsLeft;

  return `<div class="stats-bar">
    <div class="stat"><div class="label">Remaining Budget</div><div class="value money">${fmtFull(G.budget)}</div>
      ${G.turn >= 1 ? `<div style="font-size:.6rem;margin-top:3px;color:${runRateWarning ? 'var(--red)' : 'var(--muted)'}">~${runwayMonths}mo runway${runRateWarning ? ' ⚠️' : ''}</div>` : ''}</div>
    <div class="stat"><div class="label">Total Revenue</div><div class="value money">${fmtFull(G.totalRevenue)}</div></div>
    <div class="stat"><div class="label">Brand Equity</div><div class="value equity">${Math.round(G.brandEquity)}/100</div>
      <div class="progress-bar"><div class="fill ${equityColor}" style="width:${G.brandEquity}%"></div></div></div>
    <div class="stat"><div class="label">CEO Patience</div><div class="value ${ceoColor === 'red' ? 'danger' : ''}">${Math.round(G.ceoPat)}/100</div>
      <div class="progress-bar"><div class="fill ${ceoColor}" style="width:${G.ceoPat}%"></div></div></div>
  </div>
  <div class="journey-bar">${Array.from({ length: 13 }, (_, i) => {
    const cls = i < G.turn ? 'done' : i === G.turn ? 'current' : 'future';
    return `<div class="journey-dot ${cls}" title="Month ${i + 1}"></div>`;
  }).join('')}</div>`;
}

function renderTitle() {
  return `<div class="screen title-screen">
    <h1 class="pixel">THE CMO GAME</h1>
    <div class="subtitle pixel">MARKETING SIMULATOR</div>
    <div class="tagline">Navigate 12 months of growth targets, PR crises, and budget battles.</div>
    <div class="card" style="max-width:500px;margin:20px auto;text-align:center">
      <input type="text" id="playerName" placeholder="Enter Your Name" maxlength="20" style="display:block;margin:0 auto" autofocus>
      <div style="margin-top:10px;font-size:0.85rem;color:var(--muted)">
        Do you build brand equity or chase short-term sales?<br>Your choices will send you to the C-Suite... or the unemployment line.
      </div>
    </div>
    <div class="btn-group">
      <button class="btn primary" data-action="startGame">Launch Your Product</button>
      ${G.hasSave ? '<button class="btn gold" data-action="continueGame">📂 Resume Strategy</button>' : ''}
    </div>
    <div class="btn-group">
      <button class="btn" style="font-size:.7rem;padding:8px 16px" data-action="showLeaderboard">🏆 Hall of Fame</button>
    </div>
  </div>
  <div style="margin-top:auto;padding:20px 0;text-align:center;color:var(--muted);font-size:.75rem">
    Created by <a href="https://andrewmitrak.com" target="_blank" style="color:var(--muted);text-decoration:underline">Andrew Mitrak</a>
  </div>`;
}

function renderProductSelect() {
  const cards = Object.entries(PRODUCTS).map(([key, p]) =>
    `<div class="choice-btn" data-action="selectProduct" data-value="${key}">
      <div class="choice-title">${p.icon} ${p.name}</div>
      <div class="choice-desc">${p.desc}</div>
    </div>`
  ).join('');
  return `<div class="screen">
    <div class="section-title">What Are You Marketing?</div>
    <div class="section-sub">Choose your product category. Each has different growth curves and challenges.</div>
    <div class="choice-grid">${cards}</div>
  </div>`;
}

function renderNaming() {
  const p = PRODUCTS[G.product];
  const examples = p.namingExamples.join(', ');
  return `<div class="screen text-center">
    <div class="section-title">Name your ${p.namingLabel}</div>
    <div class="section-sub">Make your brand memorable and SEO-optimized. Don't use a pun. (Okay, you can use a pun.)</div>
    <div class="card" style="max-width:500px;margin:20px auto">
      <input type="text" id="productName" placeholder="Brand Name" maxlength="25" autofocus>
      <div style="margin-top:10px;font-size:.75rem;color:var(--muted)">Examples: ${examples}</div>
    </div>
    <div class="btn-group">
      <button class="btn primary" data-action="confirmName">Lock It In</button>
      <button class="btn" data-action="productSelect">← Back</button>
    </div>
  </div>`;
}

function renderPositioning() {
  const p = PRODUCTS[G.product];
  const rows = Object.entries(POSITIONINGS).map(([id, pos]) => {
    const active = G.positioning === id;
    return `<div class="card clickable ${active ? 'active' : ''}" data-action="setPositioning" data-id="${id}">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-weight:700">${pos.icon} ${pos.name}</div>
      </div>
      <div style="font-size:.8rem;color:var(--muted);margin-top:5px">${pos.desc}</div>
    </div>`;
  }).join('');

  return `<div class="screen">
    <div class="section-title">Market Positioning</div>
    <div class="section-sub">How will ${G.productName} compete in the market?</div>
    ${rows}
    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="teamBuilding" ${G.positioning ? '' : 'disabled'}>Confirm Positioning</button>
    </div>
  </div>`;
}

function renderTeamBuilding() {
  let totalCost = 0;
  const rows = ROLES.map(r => {
    const sel = G.team[r.id];
    let effectLabel = '';
    if (sel === 'ft') {
      totalCost += r.ftCost;
      effectLabel = `<span class="text-green">Effect: ${r.ftEffect}</span>`;
    } else if (sel === 'agency') {
      totalCost += r.agCost;
      effectLabel = `<span class="text-blue" style="color:var(--blue)">Effect: ${r.agEffect}</span>`;
    } else if (sel === 'skip') {
      effectLabel = `<span class="text-red">Effect: ${r.skipEffect}</span>`;
    }

    return `<div class="card" style="padding:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <div style="font-weight:600">${r.icon} ${r.name}</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="radio-btn ${sel === 'ft' ? 'active' : ''}" data-action="setTeam" data-role="${r.id}" data-choice="ft">
            In-House ${fmt(r.ftCost)}/mo
          </button>
          <button class="radio-btn agency ${sel === 'agency' ? 'active' : ''}" data-action="setTeam" data-role="${r.id}" data-choice="agency">
            Agency ${fmt(r.agCost)}/mo
          </button>
          <button class="radio-btn skip ${sel === 'skip' ? 'active' : ''}" data-action="setTeam" data-role="${r.id}" data-choice="skip">
            Skip
          </button>
        </div>
      </div>
      <div style="font-size:.75rem;color:var(--muted);margin-top:8px">
        ${effectLabel}
      </div>
    </div>`;
  }).join('');

  const allSet = ROLES.every(r => G.team[r.id]);
  const isAllInHouse = ROLES.every(r => G.team[r.id] === 'ft');
  const isAllSkip = ROLES.every(r => G.team[r.id] === 'skip');
  const totalSpend = totalCost * 12;

  let bottomMessage = '';
  if (isAllInHouse) {
    bottomMessage = '<div style="text-align:center;color:var(--amber);margin-bottom:15px">Big spender, huh? Watch your budget.</div>';
  } else if (isAllSkip || (totalCost < (ROLES.length * 25000 / 2))) {
    bottomMessage = '<div style="text-align:center;color:var(--red);margin-bottom:15px">This definitely won\'t backfire...</div>';
  }

  return `<div class="screen">
    <div class="section-title">Build Your Team</div>
    <div class="section-sub">Hire in-house talent, outsource to an agency, or skip entirely. Monthly team burn: <strong class="text-amber">${fmt(totalCost)}/mo</strong> (${fmt(totalSpend)}/year)</div>
    ${rows}
    ${bottomMessage}
    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="confirmTeam" ${allSet ? '' : 'disabled'}>Lock In Team${allSet ? '' : ' (select all roles)'}</button>
    </div>
  </div>`;
}

function renderPreLaunch() {
  const brandCards = BRAND_TIERS.map(t =>
    `<div class="tier-card ${G.brandTier === t.id ? 'selected' : ''}" data-action="setBrand" data-value="${t.id}">
      <div class="tier-name">${t.name}</div>
      <div class="tier-cost">${fmtFull(t.cost)}</div>
      <div class="tier-desc">${t.desc}</div>
    </div>`
  ).join('');

  const siteCards = SITE_TIERS.map(t =>
    `<div class="tier-card ${G.siteTier === t.id ? 'selected' : ''}" data-action="setSite" data-value="${t.id}">
      <div class="tier-name">${t.name}</div>
      <div class="tier-cost">${fmtFull(t.cost)}</div>
      <div class="tier-desc">${t.desc}</div>
    </div>`
  ).join('');

  const researchCards = RESEARCH_TIERS.map(t =>
    `<div class="tier-card ${G.researchTier === t.id ? 'selected' : ''}" data-action="setResearch" data-value="${t.id}">
      <div class="tier-name">${t.name}</div>
      <div class="tier-cost">${t.cost > 0 ? fmtFull(t.cost) : 'Free'}</div>
      <div class="tier-desc">${t.desc}</div>
    </div>`
  ).join('');

  const launchCards = LAUNCH_TACTICS.map(t =>
    `<div class="launch-option ${G.launchTactics.includes(t.id) ? 'checked' : ''}" data-action="toggleLaunch" data-value="${t.id}">
      <div class="checkbox">${G.launchTactics.includes(t.id) ? '✓' : ''}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.9rem">${t.name} <span class="text-amber">${t.cost > 0 ? fmtFull(t.cost) : 'Free'}</span></div>
        <div style="font-size:.75rem;color:var(--muted)">${t.desc}</div>
      </div>
    </div>`
  ).join('');

  // Calculate total pre-launch cost
  let total = 0;
  if (G.brandTier) total += BRAND_TIERS.find(t => t.id === G.brandTier).cost;
  if (G.siteTier) total += SITE_TIERS.find(t => t.id === G.siteTier).cost;
  if (G.researchTier) total += RESEARCH_TIERS.find(t => t.id === G.researchTier).cost;
  G.launchTactics.forEach(id => { total += LAUNCH_TACTICS.find(t => t.id === id).cost; });

  const canProceed = G.brandTier && G.siteTier && G.researchTier;

  return `<div class="screen">
    <div class="section-title">Pre-Launch Investments</div>
    <div class="section-sub">This is the "buying supplies at the general store" part. Budget: <strong class="text-amber">${fmtFull(G.budget)}</strong> | Pre-launch total: <strong class="${total > G.budget * 0.5 ? 'text-red' : 'text-amber'}">${fmtFull(total)}</strong></div>

    <h3 style="margin-top:20px;margin-bottom:8px">🎨 Brand Identity</h3>
    <div class="tier-group">${brandCards}</div>

    <h3 style="margin-top:20px;margin-bottom:8px">🌐 Website & E-Commerce</h3>
    <div class="tier-group">${siteCards}</div>

    <h3 style="margin-top:20px;margin-bottom:8px">🔬 Positioning Research</h3>
    <div class="tier-group">${researchCards}</div>

    <h3 style="margin-top:20px;margin-bottom:8px">🚀 Launch Tactics <span style="font-weight:400;font-size:.8rem;color:var(--muted)">(select any combination)</span></h3>
    ${launchCards}

    <div class="btn-group" style="margin-top:25px">
      <button class="btn primary" data-action="confirmPreLaunch" ${canProceed ? '' : 'disabled'}>
        Launch ${G.productName}! (Spend ${fmtFull(total)})
      </button>
    </div>
  </div>`;
}

function renderPreLaunchSummary() {
  const p = PRODUCTS[G.product];
  const brand = BRAND_TIERS.find(t => t.id === G.brandTier);
  const site = SITE_TIERS.find(t => t.id === G.siteTier);
  const research = RESEARCH_TIERS.find(t => t.id === G.researchTier);
  const tactics = G.launchTactics.map(id => LAUNCH_TACTICS.find(t => t.id === id).name).join(', ') || 'None';

  const teamSummary = ROLES.map(r => {
    const choice = G.team[r.id];
    return `${r.icon} ${r.name}: ${choice === 'ft' ? '✅ In-House' : choice === 'agency' ? '🔵 Agency' : '❌ Skipped'}`;
  }).join('<br>');

  return `<div class="screen">
    <div class="narrative">
      <div class="event-title">🚀 ${G.productName} is Launching!</div>
      <p>You, <strong>${G.playerName}</strong>, VP of Marketing, are about to launch <strong>${G.productName}</strong> — a ${POSITIONINGS[G.positioning].name.toLowerCase()} ${p.name.toLowerCase()} brand into a market that doesn't know it needs you yet.</p>
      <p style="margin-top:10px">You've assembled your team, invested in your brand, and chosen your launch strategy. The next 12 months will determine whether you're a marketing genius or a cautionary tale in a business school case study.</p>
    </div>

    <div class="card">
      <h3>📋 Launch Summary</h3>
      <p><strong>Product:</strong> ${p.icon} ${G.productName} (${p.name})<br>
      <strong>Positioning:</strong> ${POSITIONINGS[G.positioning].icon} ${POSITIONINGS[G.positioning].name}<br>
      <strong>Brand Identity:</strong> ${brand.name} (${fmtFull(brand.cost)})<br>
      <strong>Website:</strong> ${site.name} (${fmtFull(site.cost)})<br>
      <strong>Research:</strong> ${research.name} (${fmtFull(research.cost)})<br>
      <strong>Launch Tactics:</strong> ${tactics}<br>
      <strong>Monthly Team Cost:</strong> ${fmtFull(G.teamCostPerMonth)}/mo</p>
    </div>

    <div class="card">
      <h3>👥 Your Team</h3>
      <p>${teamSummary}</p>
    </div>

    ${renderStatsBar()}

    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="beginJourney">🚀 Launch Product</button>
    </div>
    <script>setTimeout(() => runConfetti('launch'), 500);</script>
  </div>`;
}

function renderConflict() {
  const conflictIdx = G.turn - 2; // turns 2-12 map to conflicts 0-10
  const conflict = G.conflictOrder[conflictIdx];

  // Replace placeholders
  let text = conflict.text
    .replace(/\{product\}/g, G.productName)
    .replace(/\{name\}/g, G.productName)
    .replace(/\{industry\}/g, PRODUCTS[G.product].flavor)
    .replace(/\{month\}/g, G.turn);

  const choices = conflict.choices.map((c, i) =>
    `<div class="choice-btn" data-action="chooseConflict" data-value="${i}">
      <div class="choice-title">${c.text}</div>
      ${c.cost > 0 ? `<div class="choice-cost">Cost: ${fmtFull(c.cost)}</div>` : c.cost < 0 ? `<div class="choice-cost text-green">Returns: ${fmtFull(Math.abs(c.cost))}</div>` : ''}
    </div>`
  ).join('');

  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">Month ${G.turn} of 13</div>
    <div class="narrative">
      <div class="event-title">${conflict.title}</div>
      <p>${text}</p>
    </div>
    <div class="section-sub" style="margin-top:15px">What do you do?</div>
    <div class="choice-grid">${choices}</div>
  </div>`;
}

function renderConflictResult() {
  const r = G.lastConflictOutcome;
  const isGood = r.effects.brandEquity >= 0 && r.effects.revMult >= 1;
  const cls = r.isLucky ? 'good' : isGood ? 'good' : r.effects.brandEquity < -8 ? 'bad' : 'neutral';

  let effectsText = [];
  if (r.effects.cost > 0) effectsText.push(`💸 Spent ${fmtFull(r.effects.cost)}`);
  if (r.effects.cost < 0) effectsText.push(`💰 Returned ${fmtFull(Math.abs(r.effects.cost))}`);
  if (r.effects.brandEquity > 0) effectsText.push(`📈 Brand Equity +${r.effects.brandEquity}`);
  if (r.effects.brandEquity < 0) effectsText.push(`📉 Brand Equity ${r.effects.brandEquity}`);
  if (r.effects.ceoPat > 0) effectsText.push(`😊 CEO Patience +${r.effects.ceoPat}`);
  if (r.effects.ceoPat < 0) effectsText.push(`😤 CEO Patience ${r.effects.ceoPat}`);

  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">Month ${G.turn} — Outcome</div>
    <div class="outcome-box ${cls}">
      ${r.isLucky ? '<div style="font-size:1.1rem;font-weight:700;margin-bottom:8px">🍀 Lucky Break!</div>' : ''}
      <p>${r.outcome}</p>
      <div style="margin-top:12px;font-size:.85rem">${effectsText.join(' &nbsp;|&nbsp; ')}</div>
      <div class="lesson">💡 ${r.outcome.split('Marketing lesson: ')[1] || ''}</div>
    </div>
    <div class="btn-group">
      <button class="btn primary" data-action="goToAllocation">Set Monthly Budget →</button>
    </div>
  </div>`;
}

function renderAllocation() {
  const a = G.allocation;
  const total = a.brand + a.performance + a.pr + a.events;
  const totalWithTeam = total + G.teamCostPerMonth;
  const remaining = G.budget;
  const monthsLeft = 13 - G.turn + 1;
  const suggested = Math.round(remaining / monthsLeft);

  const presetBtns = Object.entries(PRESETS).map(([key, p]) =>
    `<button class="btn" data-action="applyPreset" data-value="${key}" style="font-size:.75rem;padding:8px 12px">${p.name}</button>`
  ).join('');

  const rows = ALLOC_CATEGORIES.map(cat => {
    const val = a[cat.id];
    return `<div class="alloc-row">
      <div>
        <div class="alloc-label">${cat.icon} ${cat.name}</div>
        <div class="alloc-detail">${cat.desc}</div>
      </div>
      <input type="range" class="alloc-slider" min="0" max="60000" step="1000" value="${val}" data-action="updateAlloc" data-cat="${cat.id}">
      <div class="alloc-value" id="alloc-${cat.id}">${fmt(val)}</div>
    </div>`;
  }).join('');

  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">Monthly Budget Allocation — Month ${G.turn}</div>
    <div class="section-sub">
      Team cost: ${fmt(G.teamCostPerMonth)}/mo (fixed) | Marketing spend: <strong class="text-amber">${fmt(total)}</strong> | Total: <strong class="${totalWithTeam > suggested ? 'text-red' : 'text-amber'}">${fmt(totalWithTeam)}/mo</strong><br>
      Budget remaining: ${fmtFull(remaining)} | Suggested monthly: ~${fmt(suggested)}
    </div>
    <div class="btn-group" style="justify-content:flex-start;margin:10px 0">${presetBtns}</div>
    ${rows}
    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="confirmAllocation">Lock In & Run Month ${G.turn} →</button>
    </div >
  </div > `;
}

function renderMidYearReview() {
  const p = PRODUCTS[G.product];
  const brand = BRAND_TIERS.find(t => t.id === G.brandTier);
  const site = SITE_TIERS.find(t => t.id === G.siteTier);
  const research = RESEARCH_TIERS.find(t => t.id === G.researchTier);

  const totalRevenue = G.monthlyRevenue.reduce((sum, r) => sum + r, 0);
  const avgMonthlyRev = totalRevenue / G.monthlyRevenue.length;
  const spent = G.startingBudget - G.budget;
  const roi = spent > 0 ? ((totalRevenue - spent) / spent * 100).toFixed(0) : 0;

  let ceoCommentary = '';
  if (totalRevenue >= 3000000) {
    ceoCommentary = 'The CEO is ecstatic! "This is exceeding all expectations. Keep up the incredible work!"';
  } else if (totalRevenue >= 1500000) {
    ceoCommentary = 'The CEO is pleased. "Solid performance. We\'re on track, but there\'s always room to grow."';
  } else if (totalRevenue >= 500000) {
    ceoCommentary = 'The CEO is concerned. "We need to see more traction. What\'s the plan to accelerate growth?"';
  } else {
    ceoCommentary = 'The CEO is furious. "These numbers are unacceptable. We need a drastic change, or heads will roll!"';
  }

  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">🗓️ Mid-Year Review (Month 6)</div>
    <div class="narrative">
      <div class="event-title">Performance Check-in</div>
      <p>It's been six months since ${G.productName} launched. The CEO has called you in for a mid-year performance review.</p>
      <p style="margin-top:10px"><strong>CEO's Feedback:</strong> "${ceoCommentary}"</p>
    </div>

    <div class="card">
      <h3>📈 Your Performance So Far</h3>
      <p><strong>Total Revenue:</strong> ${fmtFull(totalRevenue)}<br>
      <strong>Average Monthly Revenue:</strong> ${fmtFull(avgMonthlyRev)}<br>
      <strong>Brand Equity:</strong> ${Math.round(G.brandEquity)}/100<br>
      <strong>Budget ROI:</strong> <span class="${parseInt(roi) > 0 ? 'money' : 'danger'}">${roi}%</span></p>
    </div>

    <div style="margin:20px 0">
      <h3>👥 Team Performance Review</h3>
      <p style="font-size:0.85rem;color:var(--muted);margin-bottom:10px">Adjust your team burn here. Firing or hiring will update your monthly costs.</p>
      ${ROLES.map(r => {
    const sel = G.team[r.id];
    return `<div class="card" style="padding:10px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div>${r.icon} ${r.name}: <strong>${sel === 'ft' ? 'In-House' : sel === 'agency' ? 'Agency' : 'Skipped'}</strong></div>
            <div style="display:flex;gap:5px">
              ${sel !== 'skip' ? `<button class="btn" style="font-size:.6rem;padding:4px 8px;background:var(--red)" data-action="fireRole" data-id="${r.id}">Fire</button>` : ''}
              ${sel !== 'ft' ? `<button class="btn" style="font-size:.6rem;padding:4px 8px;background:var(--green)" data-action="hireRole" data-id="${r.id}" data-type="ft">Hire In-House</button>` : ''}
              ${sel !== 'agency' ? `<button class="btn" style="font-size:.6rem;padding:4px 8px;background:var(--blue)" data-action="hireRole" data-id="${r.id}" data-type="agency">Hire Agency</button>` : ''}
            </div>
          </div>
        </div>`;
  }).join('')}
    </div>

    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="continueAfterMidYearReview">Complete Review & Continue →</button>
    </div>
  </div>`;
}

function renderMonthResults() {
  const r = G._monthResult;
  const monthNum = G.turn;
  const rev = G.monthlyRevenue[monthNum - 1] || 0;
  const lastRev = G.monthlyRevenue[monthNum - 2] || 0;
  const growth = lastRev === 0 ? 0 : Math.round(((rev - lastRev) / lastRev) * 100);
  const growthColor = rev > lastRev ? 'text-green' : rev < lastRev ? 'text-red' : 'text-amber';

  // Month 6 Special Review
  if (G.turn === 6 && !G.midYearReviewDone) {
    return renderMidYearReview();
  }

  let commentary = '';
  if (rev > 200000) commentary = pick(['🔥 The numbers are looking fire.', '📈 Wall Street is taking notice.', '💰 Revenue printer goes brrr.']);
  else if (rev > 100000) commentary = pick(['Not bad. The CEO stopped sending passive-aggressive Slacks.', 'Solid month. Your LinkedIn recruiter messages have decreased. Good sign.', 'Your brand is finding its groove.']);
  else commentary = pick(['It\'s a start. Rome wasn\'t built in a day. But they also had more than $5M.', 'The CEO sent you an article titled "10 Signs Your Marketing Is Failing."', 'Your mom says she\'s proud of you, which is nice but not a KPI.']);

  let bonusText = '';
  if (r.bonus > 0) {
    bonusText = `<div class="outcome-box good"><strong>🎉 Bonus!</strong> The CEO was impressed with your performance. "+${fmtFull(r.bonus)} added to your budget."(They phrased it as "investing in what's working." Don't get used to it.)</div>`;
  }

  const isLastMonth = G.turn >= 12;

  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">📊 Month ${G.turn} Results</div>
    <div class="card">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:15px;text-align:center">
        <div>
          <div style="font-size:.75rem;color:var(--muted)">Monthly Revenue</div>
          <div style="font-size:1.8rem;font-weight:700;color:var(--amber)">${fmtFull(rev)}</div>
          <div class="${growthColor}" style="font-size:.85rem">${rev >= lastRev ? '▲' : '▼'} ${growth}% vs last month</div>
        </div>
        <div>
          <div style="font-size:.75rem;color:var(--muted)">Total Revenue</div>
          <div style="font-size:1.8rem;font-weight:700;color:var(--amber)">${fmtFull(G.totalRevenue)}</div>
          <div style="font-size:.85rem;color:var(--muted)">across ${G.monthlyRevenue.length} months</div>
        </div>
      </div>
      <div style="margin-top:15px;padding-top:12px;border-top:1px solid var(--border);display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;text-align:center;font-size:.85rem">
        <div><span class="text-muted">Spent:</span> <span class="text-red">${fmtFull(r.totalSpend)}</span></div>
        <div><span class="text-muted">Brand Δ:</span> <span class="${r.beChange >= 0 ? 'text-green' : 'text-red'}">${r.beChange >= 0 ? '+' : ''}${r.beChange.toFixed(1)}</span></div>
        <div><span class="text-muted">Budget left:</span> <span class="text-amber">${fmtFull(G.budget)}</span></div>
      </div>
    </div>
    ${bonusText}
    <div style="text-align:center;color:var(--muted);font-style:italic;margin:15px 0">${commentary}</div>
    <div class="btn-group">
      <button class="btn primary" data-action="${isLastMonth ? 'goToHoliday' : 'nextMonth'}">${isLastMonth ? '🎄 Enter Holiday Season →' : 'Continue to Month ' + (G.turn + 1) + ' →'}</button>
    </div>
  </div>
  <script>
    ${rev > lastRev ? "setTimeout(() => runConfetti('goodMonth'), 300);" : ""}
  </script>`;
}

function renderHoliday() {
  const brandMult = (1.5 + (G.brandEquity / 100) * 2.5).toFixed(1);

  const choices = HOLIDAY_EVENT.strategies.map((s, i) =>
    `<div class="choice-btn" data-action="chooseHoliday" data-value="${i}">
      <div class="choice-title">${s.icon} ${s.name}</div>
      <div class="choice-desc">${s.desc}</div>
      <div class="choice-cost">Cost: ${fmtFull(s.cost)}</div>
    </div>`
  ).join('');

  return `<div class="screen">
    ${renderStatsBar()}
    <div class="narrative">
      <div class="event-title">${HOLIDAY_EVENT.title}</div>
      <p>${HOLIDAY_EVENT.text}</p>
      <p style="margin-top:10px">Your brand equity of <strong class="text-green">${Math.round(G.brandEquity)}</strong> gives you a holiday multiplier of <strong class="text-amber">${brandMult}x</strong>. ${G.brandEquity >= 60 ? 'All those brand investments are about to pay off BIG.' : G.brandEquity >= 30 ? 'A decent multiplier. Those brand investments helped.' : 'Ouch. Low brand equity means a weak holiday showing. Should\'ve invested in brand earlier.'}</p>
    </div>
    <div class="section-sub">Choose your holiday strategy:</div>
    <div class="choice-grid">${choices}</div>
  </div>`;
}

function renderHolidayResults() {
  const r = G._holidayResult;
  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">🎄 Holiday Season Results</div>
    <div class="card" style="text-align:center">
      <div style="font-size:.85rem;color:var(--muted)">Holiday Revenue</div>
      <div style="font-size:2.5rem;font-weight:700;color:var(--amber)">${fmtFull(r.holidayRev)}</div>
      <div style="font-size:1rem;margin-top:5px">Holiday Multiplier: <strong class="text-green">${r.holidayMult.toFixed(1)}x</strong></div>
      <div style="font-size:.85rem;color:var(--muted);margin-top:5px">Strategy: ${r.strategy.icon} ${r.strategy.name}</div>
    </div>
    <div class="narrative" style="text-align:center">
      ${r.holidayRev > 500000 ? '🎉 MASSIVE holiday season! Your brand equity paid off in spades. The CFO is buying YOU a gift this year.' :
      r.holidayRev > 250000 ? '🎄 Solid holiday performance. Not record-breaking, but your year-end bonus is looking healthy.' :
        '🎅 The holiday season was... underwhelming. Like getting socks as a present. Functional but disappointing.'}
    </div>
    <div class="btn-group">
      <button class="btn primary" data-action="showFinalResults">See Final Results →</button>
    </div>
  </div>`;
}

function renderFinalResults() {
  const totalRev = G.totalRevenue;
  const budgetLeft = G.budget;
  const brandEq = Math.round(G.brandEquity);
  const spent = G.startingBudget - budgetLeft + G.bonusesReceived;
  const roi = ((totalRev - spent) / spent * 100).toFixed(0);

  // Determine title/result
  let result, resultEmoji, resultText;
  if (totalRev >= 30000000) {
    G.title = 'Global CMO';
    result = 'PROMOTED TO GLOBAL CMO';
    resultEmoji = '👑';
    resultText = 'The board is stunned. You\'ve turned ${G.productName} into a global phenomenon. The corner office is yours.';
  } else if (totalRev >= 15000000) {
    G.title = 'VP of Marketing';
    result = 'PROMOTED';
    resultEmoji = '⭐';
    resultText = 'Excellent year. You\'ve hit your growth targets and earned a seat at the leadership table.';
  } else if (totalRev >= 7500000) {
    G.title = 'Senior Marketing Director';
    result = 'SURVIVED';
    resultEmoji = '✅';
    resultText = 'You kept the lights on and the brand alive. Adequate performance in a tough market.';
  } else {
    G.title = 'Former Marketing Director';
    result = 'REPLACED';
    resultEmoji = '💀';
    resultText = 'The growth wasn\'t there. HR has the box ready for your desk. Time to update the resume.';
  }

  const entry = saveScore();

  return `<div class="screen">
    <div class="final-score">
      <div style="font-size:4rem">${resultEmoji}</div>
      <div class="pixel" style="color:${result === 'FIRED' ? 'var(--red)' : result === 'SURVIVED' ? 'var(--amber)' : 'var(--green)'};font-size:1.2rem;margin:10px 0">${result}</div>
      <div style="color:var(--muted);margin-bottom:20px">${resultText}</div>
      <div class="big-number">${fmtFull(totalRev)}</div>
      <div style="color:var(--muted)">Total Revenue in 12 Months</div>
    </div>

    <div class="stats-bar">
      <div class="stat"><div class="label">Final Title</div><div class="value" style="font-size:.9rem">${G.title}</div></div>
      <div class="stat"><div class="label">Brand Equity</div><div class="value equity">${brandEq}/100</div></div>
      <div class="stat"><div class="label">Budget ROI</div><div class="value ${parseInt(roi) > 0 ? 'money' : 'danger'}">${roi}%</div></div>
      <div class="stat"><div class="label">Budget Remaining</div><div class="value money">${fmtFull(budgetLeft)}</div></div>
    </div>

    <div class="card">
      <h3>📊 Revenue by Month</h3>
      <div style="width:100%;height:200px;margin-top:10px">
          <canvas id="revenueChart"></canvas>
      </div>
    </div>

    <div class="share-box" id="shareText">${getShareText()}</div>

    <div class="btn-group">
      <button class="btn primary" data-action="copyShare">📋 Copy Score</button>
      <button class="btn gold" data-action="showLeaderboard">🏆 Leaderboard</button>
      <button class="btn" data-action="playAgain">🔄 Play Again</button>
    </div>
  </div>
  <script>
    setTimeout(() => {
      new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
          labels: Array.from({length: ${G.monthlyRevenue.length}}, (_, i) => 'Month ' + (i + 1)),
          datasets: [{
            label: 'Revenue',
            data: [${G.monthlyRevenue.join(',')}],
            borderColor: '#00ff41',
            backgroundColor: 'rgba(0, 255, 65, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Revenue Growth', color: '#8b949e' }
          },
          scales: {
            y: { grid: { color: '#30363d' }, ticks: { color: '#8b949e' } },
            x: { grid: { display: false }, ticks: { color: '#8b949e' } }
          }
        }
      });
      ${result !== 'FIRED' ? "runConfetti('win');" : ""}
    }, 100);
  </script>`;
}

function renderGameOver() {
  saveScore();
  return `<div class="screen game-over">
    <div class="tombstone">🪦</div>
    <h1 class="pixel" style="color:var(--red)">GAME OVER</h1>
    <div style="font-size:1.5rem;margin:15px 0">Your brand has died of market irrelevance.</div>
    <div class="card" style="text-align:left;max-width:500px;margin:20px auto">
      <p>${G.gameOverReason}</p>
      <p style="margin-top:10px;font-style:italic;color:var(--muted)">Here lies ${G.productName}. They had a $5M budget and dreams of the C-Suite. They lasted ${G.turn} months.</p>
    </div>
    <div class="stats-bar" style="max-width:500px;margin:15px auto">
      <div class="stat"><div class="label">Revenue Earned</div><div class="value money">${fmtFull(G.totalRevenue)}</div></div>
      <div class="stat"><div class="label">Months Survived</div><div class="value danger">${G.turn}/12</div></div>
      <div class="stat"><div class="label">Brand Equity</div><div class="value">${Math.round(G.brandEquity)}/100</div></div>
    </div>
    <div class="share-box" style="max-width:500px;margin:15px auto">${getShareText()}</div>
    <div class="btn-group">
      <button class="btn primary" data-action="copyShare">📋 Copy Score</button>
      <button class="btn gold" data-action="showLeaderboard">🏆 Leaderboard</button>
      <button class="btn" data-action="playAgain">🔄 Try Again</button>
    </div>
  </div>`;
}

function renderLeaderboard() {
  const lb = getLeaderboard();
  const rows = lb.length > 0 ? lb.map((e, i) =>
    `<tr>
      <td>${i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
      <td>${e.name}</td>
      <td>${e.product} (${e.category})</td>
      <td class="text-amber">${fmtFull(e.revenue)}</td>
      <td>${e.brandEquity}/100</td>
      <td>${e.title}</td>
    </tr>`
  ).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--muted)">No scores yet. Be the first to blaze the trail!</td></tr>';

  return `<div class="screen">
    <div class="section-title">🏆 Leaderboard</div>
    <div class="section-sub">The marketing legends who dared to spend a million dollars.</div>
    <div class="leaderboard-scroll">
      <table class="leaderboard-table">
        <thead><tr><th>#</th><th>Name</th><th>Product</th><th>Revenue</th><th>Brand</th><th>Title</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="playAgain">🔄 Play ${G.gameOver || G.turn >= 13 ? 'Again' : ''}</button>
      ${G.turn === 0 ? '<button class="btn" data-action="backToTitle">← Back</button>' : ''}
    </div>
  </div>`;
}

// ===== EVENT HANDLING =====
document.getElementById('app').addEventListener('click', function (e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const value = el.dataset.value;

  switch (action) {
    case 'startGame': {
      const name = document.getElementById('playerName')?.value.trim();
      if (!name) { document.getElementById('playerName').style.borderColor = 'var(--red)'; return; }
      G.playerName = name;
      G.screen = 'productSelect';
      break;
    }
    case 'selectProduct':
      G.product = value;
      G.screen = 'naming';
      break;
    case 'confirmName': {
      const name = document.getElementById('productName')?.value.trim();
      if (!name) { document.getElementById('productName').style.borderColor = 'var(--red)'; return; }
      G.productName = name;
      G.screen = 'positioning';
      break;
    }
    case 'setPositioning':
      G.positioning = el.dataset.id;
      G.screen = 'positioning';
      break;
    case 'teamBuilding':
      if (!G.positioning) return;
      G.screen = 'teamBuilding';
      break;
    case 'productSelect':
      G.screen = 'productSelect';
      break;
    case 'continueGame':
      loadGame();
      return;
    case 'setTeam': {
      G.team[el.dataset.role] = el.dataset.choice;
      calcTeamCost();
      G.screen = 'teamBuilding'; // re-render
      break;
    }
    case 'confirmTeam':
      if (!ROLES.every(r => G.team[r.id])) return;
      G.screen = 'preLaunch';
      break;
    case 'fireRole':
      G.team[el.dataset.id] = 'skip';
      calcTeamCost();
      render();
      break;
    case 'hireRole':
      G.team[el.dataset.id] = el.dataset.type;
      calcTeamCost();
      render();
      break;
    case 'continueAfterMidYearReview':
      G.midYearReviewDone = true;
      render();
      break;
    case 'setBrand':
      G.brandTier = value;
      G.screen = 'preLaunch';
      break;
    case 'setSite':
      G.siteTier = value;
      G.screen = 'preLaunch';
      break;
    case 'setResearch':
      G.researchTier = value;
      G.screen = 'preLaunch';
      break;
    case 'toggleLaunch': {
      const idx = G.launchTactics.indexOf(value);
      if (idx >= 0) G.launchTactics.splice(idx, 1);
      else G.launchTactics.push(value);
      G.screen = 'preLaunch';
      break;
    }
    case 'confirmPreLaunch': {
      if (!G.brandTier || !G.siteTier || !G.researchTier) return;
      // Deduct pre-launch costs
      const brand = BRAND_TIERS.find(t => t.id === G.brandTier);
      const site = SITE_TIERS.find(t => t.id === G.siteTier);
      const research = RESEARCH_TIERS.find(t => t.id === G.researchTier);
      G.budget -= brand.cost + site.cost + research.cost;
      G.launchTactics.forEach(id => { G.budget -= LAUNCH_TACTICS.find(t => t.id === id).cost; });
      // Apply bonuses
      G.brandEquity = brand.equity;
      G.prelaunchRevBonus = brand.revBonus;
      G.siteRevBonus = site.revBonus;
      if (research.bonus) G.prelaunchRevBonus += research.bonus;
      // Launch boost
      let launchRevBoost = 0;
      let launchBrandBoost = 0;
      G.launchTactics.forEach(id => {
        const t = LAUNCH_TACTICS.find(t => t.id === id);
        launchRevBoost += t.revBoost;
        launchBrandBoost += t.brandBoost;
      });
      G.brandEquity = clamp(G.brandEquity + launchBrandBoost, 0, 100);
      // Store launch boost for month 1 revenue
      G._launchRevBoost = launchRevBoost;
      G.turn = 0;
      // Shuffle conflicts
      shuffleConflicts();
      G.screen = 'preLaunchSummary';
      break;
    }
    case 'beginJourney':
      G.turn = 1; // Month 1 begins
      G.screen = 'allocation';
      break;
    case 'chooseConflict': {
      const conflictIdx = G.turn - 2;
      const result = applyConflictChoice(conflictIdx, parseInt(value));
      G.lastConflictOutcome = result;
      if (G.gameOver) {
        G.screen = 'gameOver';
      } else {
        G.screen = 'conflictResult';
      }
      break;
    }
    case 'goToAllocation':
      G.screen = 'allocation';
      break;
    case 'applyPreset': {
      const preset = PRESETS[value];
      G.allocation = { brand: preset.brand, performance: preset.performance, pr: preset.pr, events: preset.events };
      G.screen = 'allocation';
      break;
    }
    case 'confirmAllocation': {
      // Apply temp revenue multiplier from conflict
      if (G._tempRevMult && G._tempRevMult !== 1) {
        // Modify allocation effectiveness temporarily
        const origPerf = G.allocation.performance;
        G.allocation.performance = Math.round(origPerf * G._tempRevMult);
      }
      const monthResult = processMonth();
      G._monthResult = monthResult;
      if (G._tempRevMult) {
        // Restore
        G._tempRevMult = null;
      }
      if (G.budget < 0) {
        G.gameOver = true;
        G.gameOverReason = 'You ran out of money! The CFO cut up your corporate card in front of the whole team. "Marketing is not a money pit," they said, despite evidence to the contrary.';
        G.screen = 'gameOver';
      } else if (G.ceoPat <= 0) {
        G.gameOver = true;
        G.gameOverReason = 'The CEO lost all patience. "I\'ve seen better ROI from a lemonade stand," were their last words to you before HR stepped in.';
        G.screen = 'gameOver';
      } else {
        G.screen = 'monthResults';
      }
      break;
    }
    case 'nextMonth':
      G.turn++;
      G.screen = 'conflict';
      break;
    case 'goToHoliday':
      G.turn = 13;
      G.screen = 'holiday';
      break;
    case 'chooseHoliday': {
      const result = processHoliday(parseInt(value));
      G._holidayResult = result;
      G.screen = 'holidayResults';
      break;
    }
    case 'showFinalResults':
      G.screen = 'finalResults';
      break;
    case 'showLeaderboard':
      G.screen = 'leaderboard';
      break;
    case 'backToTitle':
      G.screen = 'title';
      break;
    case 'copyShare': {
      const text = getShareText();
      navigator.clipboard?.writeText(text).then(() => {
        el.textContent = '✅ Copied!';
        setTimeout(() => { el.textContent = '📋 Copy Score'; }, 2000);
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        el.textContent = '✅ Copied!';
        setTimeout(() => { el.textContent = '📋 Copy Score'; }, 2000);
      });
      return; // Don't re-render
    }
    case 'playAgain':
      clearSave();
      initState();
      G.screen = 'title';
      break;
  }

  render();
});

// Handle slider inputs
document.getElementById('app').addEventListener('input', function (e) {
  if (e.target.dataset.action === 'updateAlloc') {
    const cat = e.target.dataset.cat;
    const val = parseInt(e.target.value);
    G.allocation[cat] = val;
    const display = document.getElementById('alloc-' + cat);
    if (display) display.textContent = fmt(val);
  }
});

// Handle Enter key on text inputs
document.getElementById('app').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    if (e.target.id === 'playerName') {
      document.querySelector('[data-action="startGame"]')?.click();
    } else if (e.target.id === 'productName') {
      document.querySelector('[data-action="confirmName"]')?.click();
    }
  }
});

// ===== INIT =====
initState();
render();

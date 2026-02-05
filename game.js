// ===== THE CMO GAME =====
// A strategy game about brand, budget, and corporate survival

// ===== PROFANITY FILTER =====
const BLOCKED_WORDS = ['fuck','shit','ass','damn','bitch','cunt','dick','cock','pussy','fag','faggot','nigger','nigga','retard','slut','whore','bastard','asshole','bullshit','piss','crap','kike','jew','chink','gook','spic','wetback','beaner','towelhead','raghead','tranny','dyke','homo','queer','penis','vagina','boob','boobs','boobies','tits','titties','anus','dildo','jizz','cum','semen','porn','hentai','nazi','hitler','rape','molest','pedo','pedophile'];
const PROFANITY_RESPONSES = [
  'Keep it professional.',
  'I\'m calling HR.',
  'Legal wants a word.',
  'Not on company time.',
  'This goes in your file.',
  'That\'s a write-up.',
  'PR would like a word.',
  'Think of the shareholders.'
];
function containsProfanity(text) {
  const lower = text.toLowerCase().replace(/[^a-z]/g, '');
  return BLOCKED_WORDS.some(w => lower.includes(w));
}
function getProfanityResponse() {
  return PROFANITY_RESPONSES[Math.floor(Math.random() * PROFANITY_RESPONSES.length)];
}

// ===== CONSTANTS =====
const PRODUCTS = {
  soda: {
    name: 'Soda', namingLabel: 'soda brand', icon: '🥤', baseRevenue: 300000, growth: 0.07,
    desc: 'Fizzy margins, popping competition. If growth goes flat, you\'ll get canned.',
    flavor: 'beverage',
    namingExamples: ['Sip Happens', 'Fizzness Casual', 'LiquidLife']
  },
  sneakers: {
    name: 'Shoes', namingLabel: 'shoe brand', icon: '👟', baseRevenue: 250000, growth: 0.09,
    desc: 'It\'s a marathon, not a sprint. One misstep, and you\'re on the clearance rack.',
    flavor: 'fashion',
    namingExamples: ['SoleMate', 'Kicks & Giggles', 'Shoe La La']
  },
  skincare: {
    name: 'Skincare', namingLabel: 'skincare product', icon: '✨', baseRevenue: 200000, growth: 0.11,
    desc: 'Pore over data for a breakout hit. Don\'t be rash or your brand won\'t age well.',
    flavor: 'beauty',
    namingExamples: ['Zit Happens', 'Pore Decisions', 'Unwrinkle in Time']
  },
  software: {
    name: 'Software', namingLabel: 'software product', icon: '💾', baseRevenue: 150000, growth: 0.15,
    desc: 'Time to get SaaSy. Launch to the moon... or at least the cloud.',
    flavor: 'tech',
    namingExamples: ['Glitch Please', 'Byte Club', 'SaaS-quatch']
  }
};

const POSITIONINGS = {
  premium: { name: 'Premium', icon: '👑', brandBonus: 2.5, revMult: 1.2, desc: 'High margins, high expectations. Your customers pay more and complain louder.' },
  lifestyle: { name: 'Lifestyle', icon: '🌟', brandBonus: 3.0, revMult: 1.1, desc: 'You\'re not selling a product, you\'re selling a vibe. Hope Gen Z agrees.' },
  value: { name: 'Value', icon: '🏷️', brandBonus: 0.5, revMult: 0.85, desc: 'Race to the bottom? More like sprint to volume. Hope your margins survive.' },
  disruptor: { name: 'Disruptor', icon: '⚡', brandBonus: 1.5, revMult: 1.0, desc: 'Move fast and break things - including possibly your career. High risk, high reward.' }
};

const SOFTWARE_POSITIONINGS = {
  enterprise: { name: 'Enterprise', icon: '🏢', brandBonus: 1.5, revMult: 1.2, desc: 'Whale hunting. Prepare for 12-month sales cycles, security audits, and procurement hell. But one signed contract makes your year.' },
  smb: { name: 'Startup', icon: '🦄', brandBonus: 1.0, revMult: 0.9, desc: 'They want enterprise features on a shoestring budget. Expect high volume, high churn, and support tickets written in ALL CAPS.' },
  consumer: { name: 'Consumer', icon: '📱', brandBonus: 2.5, revMult: 1.0, desc: 'The B2C lottery. You\'re at the mercy of the App Store gods and Gen Z\'s attention span. You\'re either viral or you\'re invisible.' },
  government: { name: 'Government', icon: '🏛️', brandBonus: 2.0, revMult: 1.1, desc: 'The long game. Navigate red tape and 100-page RFPs. It takes two years to close a deal, but once you\'re in, the taxpayer funds you forever.' }
};

const ROLES = [
  { id: 'brand', name: 'Product Marketing', icon: '🎯', ftCost: 50000, agCost: 25000, ftDesc: 'Strategy insights that sharpen your product-market fit.', agDesc: 'Project-based positioning and market research.', ftEffect: 'Compounding product-market fit gains', agEffect: 'Periodic market fit insights', skipEffect: 'Product-market fit decays faster' },
  { id: 'content', name: 'Brand & Creative', icon: '🎨', ftCost: 50000, agCost: 25000, ftDesc: 'In-house engine for ads, social, and brand storytelling.', agDesc: 'Handles execution but with higher margins.', ftEffect: 'Faster brand equity growth', agEffect: 'Modest brand equity growth', skipEffect: 'Your brand looks like placeholder text' },
  { id: 'growth', name: 'Growth / Performance', icon: '📈', ftCost: 50000, agCost: 25000, ftDesc: 'Optimizes every dollar in real-time.', agDesc: 'Cross-platform insights and optimization.', ftEffect: 'Compounding ROI on ads', agEffect: 'Deep channel insights across platforms', skipEffect: 'Burning budget blindly' },
  { id: 'pr', name: 'PR & Communications', icon: '📣', ftCost: 50000, agCost: 25000, ftDesc: 'Navigates the narrative internally.', agDesc: 'High-leverage media relations.', ftEffect: 'Strategic crisis management', agEffect: 'Broad media reach', skipEffect: 'PR crises hit 2x harder' },
  { id: 'data', name: 'Data & Analytics', icon: '📊', ftCost: 50000, agCost: 25000, ftDesc: 'Unlocks insights from your stack.', agDesc: 'Reporting as a service.', ftEffect: 'Compounding intelligence gains', agEffect: 'Standard attribution', skipEffect: 'Flying completely blind' }
];

const BRAND_TIERS = [
  { id: 'diy', name: 'DIY', cost: 2500, equity: 2, revBonus: -0.05, desc: '"My cousin knows Photoshop"' },
  { id: 'boutique', name: 'Boutique Agency', cost: 125000, equity: 5, revBonus: 0, desc: 'Clean, professional, forgettable' },
  { id: 'topTier', name: 'Top Agency', cost: 250000, equity: 10, revBonus: 0.05, desc: 'Award-worthy. People notice.' },
  { id: 'worldClass', name: 'World-Class', cost: 500000, equity: 18, revBonus: 0.10, desc: 'A world-class design firm called. They\'re interested.' }
];

const SITE_TIERS = [
  { id: 'template', name: 'Template Site', cost: 2500, revBonus: -0.10, desc: 'Off-the-shelf template #47. Your competitor has #46.' },
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
  { id: 'organic', name: 'Organic / Word of Mouth', cost: 0, revBoost: 0.02, brandBoost: 1, desc: 'Free but slow as molasses.' },
  { id: 'press', name: 'Press Release', cost: 5000, revBoost: 0.05, brandBoost: 2, desc: 'Spray and pray to the media gods.' },
  { id: 'influencer', name: 'Influencer Seeding', cost: 150000, revBoost: 0.15, brandBoost: 3, desc: 'Send free product to people with ring lights.' },
  { id: 'event', name: 'Launch Event', cost: 275000, revBoost: 0.12, brandBoost: 5, desc: 'Open bar = open wallets. Usually.' },
  { id: 'tv', name: 'TV Commercial', cost: 750000, revBoost: 0.25, brandBoost: 6, desc: 'Super Bowl dreams on a mid-market budget.' },
  { id: 'social', name: 'Social Media Blitz', cost: 125000, revBoost: 0.13, brandBoost: 3, desc: 'Every platform, all at once. Everywhere.' }
];

const ALLOC_CATEGORIES = [
  { id: 'brand', name: 'Brand Building', icon: '🏗️', desc: 'Content, brand campaigns, sponsorships', equityPerDollar: 0.00004, revPerDollar: 0.3 },
  { id: 'performance', name: 'Performance Marketing', icon: '🎯', desc: 'Paid search, social ads, display', equityPerDollar: -0.00002, revPerDollar: 1.2 },
  { id: 'pr', name: 'PR & Influencers', icon: '📢', desc: 'Earned media, influencer deals', equityPerDollar: 0.00002, revPerDollar: 0.6 },
  { id: 'events', name: 'Events & Experiential', icon: '🎪', desc: 'Trade shows, pop-ups, activations', equityPerDollar: 0.00003, revPerDollar: 0.4 }
];

const PRESETS = {
  brandBuilder: { name: '🏗️ Brand Builder', brand: 40000, performance: 5000, pr: 5000, events: 10000 },
  highGrowth: { name: '📈 Growth Hacker', brand: 5000, performance: 40000, pr: 5000, events: 10000 },
  organic: { name: '🌱 Organic', brand: 0, performance: 0, pr: 0, events: 0 },
  allOutBlitz: { name: '🚀 All Out Blitz', brand: 60000, performance: 60000, pr: 60000, events: 60000 }
};

const RANKS = [
  { rank: 1, title: 'Director of Marketing', icon: '📋', short: 'Director' },
  { rank: 2, title: 'Senior Director of Marketing', icon: '📊', short: 'Sr. Director' },
  { rank: 3, title: 'VP of Marketing', icon: '⭐', short: 'VP' },
  { rank: 4, title: 'EVP of Marketing', icon: '🏆', short: 'EVP' },
  { rank: 5, title: 'CMO', icon: '👑', short: 'CMO' }
];

const EVENT_EFFICACY = {
  premium: 1.5, lifestyle: 1.5, enterprise: 1.5, government: 1.5,
  value: 0.0, disruptor: 0.5, smb: 0.75, consumer: 0.75
};

// ===== CONFLICTS =====
const CONFLICTS = [
  {
    id: 'cancel_culture', type: 'crisis', title: '🔥 Cancel Culture Comes Calling',
    text: 'A pre-launch beta tester screenshots an internal chat message where someone on your team called customers "walking wallets." It\'s trending. #Boycott{product} has 50k posts and counting.',
    choices: [
      { text: 'Issue a sincere public apology + donate $30k to consumer advocacy', cost: 30000, brandEquity: 2, revMult: 0.9, ceoPat: -5, outcome: 'Your apology is well-received. The news cycle moves on. Your brand actually gains some respect for owning it. Marketing lesson: Crisis response speed matters more than perfection.' },
      { text: 'Delete everything. Deny, deny, deny.', cost: 0, brandEquity: -15, revMult: 0.8, ceoPat: -15, luck: [0.4, { brandEquity: 2, revMult: 1.0, ceoPat: 0, override: 'Somehow, miraculously, the internet got distracted by a celebrity scandal. You got lucky. Very lucky.' }], outcome: 'The Streisand Effect kicks in. Screenshots of the deletion go viral. Now you look guilty AND incompetent. Marketing lesson: The internet never forgets. The cover-up is always worse than the crime.' },
      { text: 'Lean into it with self-deprecating humor campaign', cost: 10000, brandEquity: 0, revMult: 0.95, ceoPat: -5, luck: [0.35, { brandEquity: 9, revMult: 1.1, ceoPat: 10, override: 'Your meme game is STRONG. The self-roast goes viral in a good way. People love a brand that can laugh at itself. You just pulled off the rarest move in crisis PR.' }], outcome: 'Humor during a genuine controversy comes across as tone-deaf. People think you\'re not taking it seriously. Marketing lesson: Read the room before going for laughs.' },
      { text: '"We\'ve terminated the employee responsible" (throw someone under the bus)', cost: 0, brandEquity: -8, revMult: 0.95, ceoPat: 5, outcome: 'The public execution satisfies the mob temporarily, but your team\'s trust in you plummets. Morale craters. Your best content creator starts updating their resume. Marketing lesson: Sacrificing team members for PR is a short-term fix with long-term consequences.' }
    ]
  },
  {
    id: 'ceo_nephew', type: 'pressure', title: '👔 The CEO\'s Nephew Has "Ideas"',
    text: 'The CEO\'s nephew - fresh MBA, zero marketing experience - has been "assigned" to your team. His first proposal: pivot your entire social strategy to the metaverse. He\'s already bought a $40k virtual billboard in a virtual world where 12 people visit daily.',
    choices: [
      { text: 'Give him a harmless side project ("Head of Innovation")', cost: 10000, brandEquity: 0, revMult: 1.0, ceoPat: 10, outcome: 'He spends 3 months building a "Web3 loyalty program" that nobody uses, but he\'s out of your hair. The CEO is happy his nephew is "learning." Marketing lesson: Sometimes the best strategy is creative containment.' },
      { text: 'Actually try his metaverse idea', cost: 50000, brandEquity: -3, revMult: 0.95, ceoPat: 15, luck: [0.15, { brandEquity: 7, revMult: 1.15, ceoPat: 20, override: 'Against all odds, a gaming streamer discovers your metaverse presence and features it. 2 million views. The nephew is now insufferable, but hey, it worked.' }], outcome: 'You just spent $50k on a metaverse presence that got 47 visitors. The nephew calls it a "soft launch." Your team calls it something else. Marketing lesson: Don\'t let politics override strategy.' },
      { text: 'Go to HR: "This is a conflict of interest"', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: -20, outcome: 'HR agrees with you technically, but the CEO is FURIOUS. "I was just trying to give the kid experience!" Your next budget review is going to be... interesting. Marketing lesson: Being right and being politically smart are different skills.' },
      { text: 'Make him "Chief Vibes Officer" with a chat channel nobody reads', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: 5, outcome: 'He posts daily "vibe checks" to a channel with 2 members (him and the bot). Everyone wins. He feels important, you keep control. Marketing lesson: The org chart is a suggestion, not a prison.' }
    ]
  },
  {
    id: 'quarter_crunch', type: 'pressure', title: '📊 Quarter-End Crunch Time',
    text: 'It\'s the end of the quarter. Sales is at 82% of target. The CEO, CFO, and VP Sales are in your office. "We need you to shift EVERYTHING to performance marketing. Run a 40% discount. NOW." The CFO is literally sweating.',
    choices: [
      { text: 'Comply: slash prices 40% and blast performance ads', cost: 20000, brandEquity: -15, revMult: 1.35, ceoPat: 15, outcome: 'Revenue spikes! The quarter is saved! But your brand now screams "discount bin." Customers who paid full price last week are livid. And now everyone will wait for the next sale. Marketing lesson: Discounting is a drug - easy to start, hard to stop.' },
      { text: 'Push back with a brand investment roadmap', cost: 0, brandEquity: 3, revMult: 0.95, ceoPat: -15, outcome: 'You present a beautiful deck about "long-term brand equity compound growth." The CFO falls asleep on slide 3. The CEO respects your conviction but questions your priorities. Marketing lesson: Being strategically right doesn\'t help if you get fired before the strategy plays out.' },
      { text: 'Compromise: 15% promo with brand-safe messaging', cost: 10000, brandEquity: -6, revMult: 1.12, ceoPat: 5, outcome: 'A measured response. Nobody\'s thrilled, nobody\'s fired. You thread the needle between brand integrity and commercial reality. Marketing lesson: The best answer in corporate life is usually the one where everyone is equally unhappy.' },
      { text: 'Propose a creative campaign that drives urgency without discounting', cost: 25000, brandEquity: 5, revMult: 1.0, ceoPat: -5, luck: [0.45, { brandEquity: 10, revMult: 1.25, ceoPat: 15, override: 'Your "limited edition" campaign creates genuine FOMO. Sales spike without a single discount. The CEO hugs you in the elevator. It\'s awkward but validating.' }], outcome: 'The creative campaign takes too long to produce. By the time it launches, the quarter is over. Results are meh. The CEO sends you a one-word message: "Noted." Marketing lesson: Timing matters as much as quality.' }
    ]
  },
  {
    id: 'influencer_rogue', type: 'crisis', title: '🤳 Influencer Gone Rogue',
    text: 'Your top influencer partner (850K followers, $15k/month retainer) just posted a video doing something deeply questionable while prominently displaying your product. It\'s at 2 million views and climbing. The tabloids are calling.',
    choices: [
      { text: 'Cut ties immediately + public statement', cost: 15000, brandEquity: 2, revMult: 0.9, ceoPat: 5, outcome: 'Swift and decisive. You eat the cancellation fee, but the narrative becomes "brand with integrity." Crisis PR textbook stuff. Marketing lesson: The cost of ending a bad partnership is always less than the cost of keeping one.' },
      { text: 'Wait 48 hours - the internet has the memory of a goldfish', cost: 0, brandEquity: -8, revMult: 0.95, ceoPat: 0, luck: [0.5, { brandEquity: 0, revMult: 1.0, ceoPat: 5, override: 'You waited it out and... it actually blew over. A politician did something dumber the next day. Sometimes doing nothing IS the strategy.' }], outcome: 'Day 1: "They\'ll forget." Day 2: "Why haven\'t they dropped this influencer?!" Day 3: You\'re now part of the story. Marketing lesson: "Wait and see" is a strategy. Just not always a good one.' },
      { text: 'Find a bigger influencer to change the narrative ($40k)', cost: 40000, brandEquity: 3, revMult: 1.0, ceoPat: 5, outcome: 'You sign a wholesome mega-influencer who "just happens" to post about your product. The news cycle shifts. Expensive, but effective. Marketing lesson: In the attention economy, you can always buy a new narrative.' },
      { text: 'Lean in: "We don\'t control our community, we celebrate them"', cost: 0, brandEquity: -12, revMult: 1.05, ceoPat: -10, luck: [0.25, { brandEquity: 6, revMult: 1.15, ceoPat: 5, override: 'Your radical authenticity somehow resonates. "Finally, a brand that doesn\'t pretend to be perfect!" becomes the take. Gen Z approves.' }], outcome: 'The "celebrate them" angle backfires spectacularly. You are now the brand that endorses bad behavior. Parents are emailing. Marketing lesson: Authenticity has limits. Know where yours are.' }
    ]
  },
  {
    id: 'ad_apocalypse', type: 'crisis', title: '💸 The Ad-pocalypse',
    text: 'Your paid ads account got flagged by an overzealous algorithm. Your search quality score tanked because a competitor filed bogus complaints. CPMs tripled overnight. Your $50k monthly ad budget is now delivering the results of $15k.',
    choices: [
      { text: 'Pause all paid media, pivot 100% to organic', cost: 0, brandEquity: 3, revMult: 0.7, ceoPat: -10, outcome: 'Revenue drops hard. Organic content takes months to compound. The CEO asks "where did the sales go?" Your data analyst shows a very sad chart. Marketing lesson: Never be 100% dependent on any single channel.' },
      { text: 'Double the budget to maintain volume', cost: 40000, brandEquity: -2, revMult: 0.95, ceoPat: 0, outcome: 'You\'re throwing money into a broken machine. It sort of works, but your CAC is now higher than your LTV. Your finance team starts involuntarily twitching. Marketing lesson: Spending more on a broken system just breaks it faster.' },
      { text: 'Diversify to new and emerging channels', cost: 20000, brandEquity: 2, revMult: 0.85, ceoPat: -5, luck: [0.5, { brandEquity: 8, revMult: 1.2, ceoPat: 10, override: 'You struck GOLD on short-form video. A scrappy ad made on an iPhone outperforms your entire paid strategy. Your intern who "knows social" is now your most important employee.' }], outcome: 'The new channels take time to optimize. Results are mixed - Forum users roast your ads, short-form video shows promise but you don\'t have the creative muscle yet. Marketing lesson: Channel diversification is insurance, not a quick fix.' },
      { text: 'Call your platform reps, escalate, fight it', cost: 5000, brandEquity: 0, revMult: 0.9, ceoPat: 0, luck: [0.6, { brandEquity: 0, revMult: 1.05, ceoPat: 5, override: 'Your rep actually comes through! Account restored, competitor complaints dismissed. Back to business. Sometimes the boring solution works.' }], outcome: 'You spend 3 weeks in platform support hell. Automated responses. Ticket escalations. "We\'ll look into it." Meanwhile, no ads running. Marketing lesson: Platform dependency is a business risk, not just a marketing one.' }
    ]
  },
  {
    id: 'review_bomb', type: 'crisis', title: '⭐ The Review Bomb',
    text: 'Someone posted "I tried {product} and here\'s what ACTUALLY happened" - a scathing (and somewhat unfair) review. It went viral. Now your rating has dropped from 4.5 to 2.3 stars. Sales are in freefall.',
    choices: [
      { text: 'Launch review generation campaign with happy customers ($15k)', cost: 15000, brandEquity: 0, revMult: 0.9, ceoPat: 5, outcome: 'Real reviews from real customers slowly push the rating back up. It takes a month, but authenticity wins. Your rating recovers to 3.8. Marketing lesson: The best defense against fake outrage is real advocacy.' },
      { text: 'Respond personally to every negative review', cost: 0, brandEquity: 2, revMult: 0.85, ceoPat: 0, outcome: 'It takes you 60 hours, but people notice. Screenshots of your thoughtful responses go viral in a GOOD way. "This brand actually cares" becomes the new narrative. Marketing lesson: The unsexy work often has the highest ROI.' },
      { text: 'Hire a reputation management firm ($30k)', cost: 30000, brandEquity: -5, revMult: 0.95, ceoPat: 5, luck: [0.5, { brandEquity: 5, revMult: 1.05, ceoPat: 5, override: 'The firm works their magic. Bad reviews suppressed, positive content amplified. Ethically gray? Sure. Effective? Absolutely.' }], outcome: 'The firm\'s tactics get exposed by a journalist writing about "corporate astroturfing." Now you have TWO PR problems. Marketing lesson: Authenticity shortcuts usually cost more in the end.' },
      { text: 'Actually improve the product based on the feedback ($50k)', cost: 50000, brandEquity: 6, revMult: 0.75, ceoPat: -5, futureRevBonus: 0.15, outcome: 'Revenue takes a hit this month as you invest in product improvements. But the next version is genuinely better. The original reviewer posts an update: "They actually listened." Marketing lesson: Sometimes the best marketing is a better product.' }
    ]
  },
  {
    id: 'celebrity', type: 'positive', title: '🌟 Celebrity Sighting!',
    text: 'BREAKING: A-list celebrity was photographed using your {product} at Soho House! Paparazzi photos are everywhere. Your social mentions just 10x\'d. The phone is ringing off the hook.',
    choices: [
      { text: 'Reach out for a paid endorsement deal ($80k)', cost: 80000, brandEquity: 10, revMult: 1.3, ceoPat: 15, outcome: 'They sign! Your brand is now officially celebrity-endorsed. Revenue soars, brand equity skyrockets. The contract is expensive, but the halo effect is worth it. Marketing lesson: Strike while the iron is hot - authenticity has a short shelf life.' },
      { text: 'Amplify organically - repost, engage, ride the wave', cost: 0, brandEquity: 6, revMult: 1.15, ceoPat: 10, outcome: 'Free publicity! You repost, the comments section explodes, and your social team works overtime. The buzz lasts about 2 weeks. Marketing lesson: Organic moments are precious - and temporary.' },
      { text: 'Create an entire UGC campaign around it ($35k)', cost: 35000, brandEquity: 8, revMult: 1.2, ceoPat: 10, outcome: 'You launch a "Spotted In The Wild" campaign featuring real customers alongside the celeb sighting. It feels organic and aspirational. Marketing lesson: The best campaigns make customers feel like they\'re part of the story.' },
      { text: 'Play it cool - don\'t acknowledge it', cost: 0, brandEquity: -5, revMult: 1.05, ceoPat: -5, outcome: 'Mystery is underrated. By not acknowledging it, you seem too cool to care. Some brand enthusiasts love the subtlety. Others wonder why you\'re ignoring your biggest moment. Marketing lesson: Playing it cool works for luxury. Not great for mass market.' }
    ]
  },
  {
    id: 'tiktok_viral', type: 'positive', title: '📱 Viral Fame (For the Right Reasons)',
    text: 'A 19-year-old just posted a video using your {product} in a completely unexpected way. 8 million views. 500k likes. Comments are overwhelmingly positive. Your website traffic is up 300%.',
    choices: [
      { text: 'Collab on a follow-up video + offer them a micro-influencer deal ($5k)', cost: 5000, brandEquity: 7, revMult: 1.25, ceoPat: 15, outcome: 'They\'re thrilled! Your brand collab gets another 3 million views. Authentic, scrappy, and exactly what social media rewards. Marketing lesson: Micro-influencer authenticity beats macro-influencer reach.' },
      { text: 'Launch a viral challenge campaign ($20k)', cost: 20000, brandEquity: 8, revMult: 1.1, ceoPat: 10, luck: [0.6, { brandEquity: 12, revMult: 1.4, ceoPat: 20, override: 'The challenge EXPLODES. 50 million views across all participants. You\'re the #1 trending brand on social media. Your intern cries tears of joy. This is the moment.' }], outcome: 'The challenge gets moderate participation. It\'s fine, but it feels like a brand trying too hard to be cool. "How do you do, fellow kids?" energy. Marketing lesson: You can\'t manufacture virality.' },
      { text: 'Send free product + personal note, hope for more content', cost: 2000, brandEquity: 6, revMult: 1.1, ceoPat: 5, outcome: 'They post an unboxing! "OMG {product} actually sent me free stuff!" Another 2 million views. The gift that keeps on giving. Marketing lesson: Generosity can be a surprisingly effective form of marketing.' },
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
      { text: 'Joint "smarketing" workshop + shared dashboard ($5k)', cost: 5000, brandEquity: 3, revMult: 1.0, ceoPat: 5, outcome: 'You bring pizza and a shared analytics dashboard. It\'s awkward for 30 minutes, then actually productive. You discover Sales was ignoring follow-up emails. They discover your lead forms were broken on mobile. Marketing lesson: 80% of marketing-sales problems are communication problems.' },
      { text: 'Give Sales exactly what they want: gate everything, qualify harder', cost: 0, brandEquity: -3, revMult: 0.9, ceoPat: 5, outcome: 'Lead volume drops 60%. The leads are "better" but there are so few that Sales still can\'t hit quota. Now it\'s somehow still your fault. Marketing lesson: Giving people what they ask for and what they need are different things.' }
    ]
  },
  {
    id: 'algorithm_change', type: 'market', title: '🔄 Algorithm Apocalypse',
    text: 'Every major social platform changed their algorithms on the same week. Your organic reach dropped 75%. The content strategy you spent 3 months building? Worthless. Your social media manager is stress-eating in the break room.',
    choices: [
      { text: 'Pivot to short-form video ($15k production)', cost: 15000, brandEquity: 2, revMult: 0.9, ceoPat: 0, luck: [0.55, { brandEquity: 8, revMult: 1.1, ceoPat: 10, override: 'Your pivot to video pays off beautifully. The new video strategy actually gets MORE reach than the old approach. Turns out the algorithm change was a gift in disguise.' }], outcome: 'The pivot takes time. Your first batch of videos looks like a hostage video. Quality improves by week 3, but you\'ve lost momentum. Marketing lesson: Platform dependency is a strategic risk. Always have a Plan B.' },
      { text: 'Shift budget from organic to paid social', cost: 15000, brandEquity: -6, revMult: 1.0, ceoPat: 5, outcome: 'You\'re now paying for what you used to get free. The platforms win again. Your paid social works but it\'s essentially a tax on reach. Marketing lesson: The platforms always win. Always.' },
      { text: 'Invest in owned channels: email, SEO, community ($25k)', cost: 25000, brandEquity: 8, revMult: 0.85, ceoPat: -5, futureRevBonus: 0.10, outcome: 'Revenue dips this month but you\'re building on land you OWN. Email list grows. SEO starts climbing. Your online community has 5,000 members who actually care. Marketing lesson: Rented audiences are rented. Build on owned land.' },
      { text: 'Create engagement bait content to game the algorithm', cost: 0, brandEquity: -12, revMult: 1.05, ceoPat: 0, outcome: '"Tag someone who needs to see this!" "Save for later!" Your content becomes the marketing equivalent of clickbait. Reach recovers but your audience quality plummets. Marketing lesson: Gaming algorithms is a treadmill - you\'ll never stop running.' }
    ]
  },
  {
    id: 'copycat', type: 'market', title: '🐱 The Copycat Competitor',
    text: 'A VC-backed competitor just launched a nearly identical {product} at 20% less. They\'re running side-by-side comparison ads. Their tagline? "Like {name}, but better." They have $5M in funding. You have anxiety.',
    choices: [
      { text: 'Differentiate: double down on brand story ($30k)', cost: 30000, brandEquity: 7, revMult: 0.95, ceoPat: 5, outcome: 'You can\'t outspend them, so you outbrand them. Your "why" story resonates deeper than their "what" features. Customers who love your brand are immune to price competition. Marketing lesson: Brand storytelling is one of the strongest competitive moats you can build.' },
      { text: 'Match their price', cost: 0, brandEquity: -12, revMult: 0.85, ceoPat: 0, outcome: 'You can match their price but not their funding. They can keep bleeding; can you? Revenue drops as margins shrink. This is a war of attrition you can\'t win. Marketing lesson: Never compete on price unless you\'re the low-cost leader.' },
      { text: 'Sue for trademark/trade dress infringement ($50k)', cost: 50000, brandEquity: 0, revMult: 0.9, ceoPat: -5, luck: [0.3, { brandEquity: 6, revMult: 1.1, ceoPat: 15, override: 'You win the injunction! Competitor forced to rebrand. The press coverage frames you as the original innovator. Sometimes lawyers ARE the best marketing channel.', cost: -20000 }], outcome: 'Legal drags on for months. Meanwhile, they keep selling. The judge says it\'s not similar enough to warrant an injunction. You\'re out $50k with nothing to show for it. Marketing lesson: Litigation is not a marketing strategy.' },
      { text: 'Ignore them and focus on your core audience', cost: 0, brandEquity: 3, revMult: 0.9, ceoPat: -5, luck: [0.4, { brandEquity: 5, revMult: 1.05, ceoPat: 5, override: 'Your confidence pays off. They run out of funding in 6 months and pivot to crypto. Your audience respects that you didn\'t flinch.' }], outcome: 'Staying the course while a competitor eats your lunch requires nerves of steel. And a board that believes in you. Yours is getting nervous. Marketing lesson: Ignore the competition at your own risk — confidence without awareness is just hubris.' }
    ]
  },
  {
    id: 'data_breach', type: 'crisis', title: '🔐 Data Breach Scare',
    text: 'Your email service provider was hacked. Customer emails and purchase history may have been exposed. A security researcher just tweeted about it. Media is reaching out for comment. Legal is panicking.',
    choices: [
      { text: 'Full transparency: notify everyone, offer credit monitoring ($40k)', cost: 40000, brandEquity: 3, revMult: 0.85, ceoPat: -5, outcome: 'You take a revenue hit and the CEO is furious about the cost, but customers TRUST you now. Privacy-conscious consumers become loyal advocates. Marketing lesson: Transparency is expensive in the short term and invaluable in the long term.' },
      { text: 'Minimal disclosure: notify only confirmed affected users ($15k)', cost: 15000, brandEquity: -2, revMult: 0.92, ceoPat: 5, luck: [0.4, { brandEquity: -15, revMult: 0.7, ceoPat: -15, override: 'A journalist discovers you under-reported the breach. Now it\'s not just a data incident - it\'s a COVER-UP. Regulators are involved. This is a nightmare.' }], outcome: 'You thread the legal needle. Technically compliant, ethically questionable. Most customers never notice. Marketing lesson: Minimum compliance is a strategy - until it isn\'t.' },
      { text: 'Spin it: "We proactively identified a security concern" ($10k)', cost: 10000, brandEquity: -8, revMult: 0.95, ceoPat: 5, outcome: 'The spin works on boomers. Gen Z sees right through it and drags you on social media. "Proactively identified" becomes a meme. Marketing lesson: Corporate euphemisms are a language nobody trusts.' },
      { text: 'Say nothing. Hope it goes away.', cost: 0, brandEquity: -14, revMult: 0.9, ceoPat: 0, luck: [0.3, { brandEquity: 0, revMult: 1.0, ceoPat: 5, override: 'By some miracle, the story gets buried under bigger news. You got away with it this time. Start looking for a better email provider.' }], outcome: 'The journalist publishes without your comment. "Company refused to respond" is never a good look. The narrative is written without you. Marketing lesson: Silence is not a communications strategy.' }
    ]
  },
  {
    id: 'viral_fail', type: 'crisis', title: '😬 The Viral Fail',
    text: 'Your latest campaign went viral... for the wrong reasons. The ad intended to be empowering is being called tone-deaf. There are already 15 parody versions. Your brand name is trending with 🤡 emojis.',
    choices: [
      { text: 'Pull the campaign immediately', cost: 20000, brandEquity: -5, revMult: 0.9, ceoPat: -5, outcome: 'You eat the production cost and move on. The memes die in 48 hours. Your brand takes a small hit but recovers quickly. Marketing lesson: Kill your darlings fast. Sunk costs are sunk.' },
      { text: 'Lean into the memes - repost and laugh at yourself', cost: 0, brandEquity: 0, revMult: 0.95, ceoPat: -5, luck: [0.5, { brandEquity: 7, revMult: 1.1, ceoPat: 10, override: 'MASTERCLASS in self-awareness. You repost the best parodies, create your own, and the narrative flips from "tone-deaf brand" to "brand with actual personality." Marketing blogs write about your response.' }], outcome: 'Laughing at yourself while people are genuinely upset reads as dismissive. The memes continue, now with "they think this is funny" added to the criticism. Marketing lesson: Self-deprecation only works when you\'re not the villain.' },
      { text: 'Double down: "We stand by our creative vision"', cost: 0, brandEquity: -14, revMult: 0.85, ceoPat: -10, luck: [0.2, { brandEquity: 8, revMult: 1.1, ceoPat: 10, override: 'Somehow your defiance resonates. "At least they have conviction," people say. Contrarians rally to your defense. You just became a cult brand by accident.' }], outcome: 'The "we stand by it" statement becomes its own meme. You are now the brand that doesn\'t listen to customers. Bold strategy. Marketing lesson: Conviction is admirable. Stubbornness is not.' },
      { text: 'Quietly replace the ad and redirect the conversation ($5k)', cost: 5000, brandEquity: -1, revMult: 0.95, ceoPat: 0, outcome: 'You swap the creative, post something unrelated and upbeat, and slowly the conversation moves on. Not glamorous, but effective. Marketing lesson: Sometimes the best marketing is just showing up normal the next day.' }
    ]
  },
  {
    id: 'recession', type: 'market', title: '📉 Recession Vibes',
    text: 'The economy is shaking. Consumer confidence is down. Your category is seeing 15% declines across the board. The board wants to know: do you cut marketing or lean in while competitors retreat?',
    choices: [
      { text: 'Cut marketing spend 30% to preserve runway', cost: -30000, brandEquity: -8, revMult: 0.8, ceoPat: 10, outcome: 'You survive but shrink. Every marketing textbook says this is the wrong move, but the CFO\'s relief is palpable. You\'ll spend months rebuilding what you cut. Marketing lesson: Brands that cut during recessions lose market share they never recover.' },
      { text: 'Maintain spending - grab market share while competitors hide', cost: 0, brandEquity: 8, revMult: 0.9, ceoPat: -10, outcome: 'Revenue dips and the CFO is furious — you spent budget while the top line shrank. Your share of voice is up, but share of voice doesn\'t pay the bills today. If the recovery comes soon, this looks like genius. If it doesn\'t, it looks like recklessness. Marketing lesson: Spending through a downturn is a bet on the long term — short-term pain for potential long-term gain, but not everyone survives to see it.' },
      { text: 'Shift to value messaging and practical positioning ($10k)', cost: 10000, brandEquity: 3, revMult: 0.95, ceoPat: 5, outcome: 'Smart pivot. "Why {product} is worth it, even now" resonates with anxious consumers. You don\'t look out of touch, and you don\'t look desperate. Marketing lesson: Match your messaging to the moment.' },
      { text: 'Go AGGRESSIVE: "Buy when there\'s blood in the streets" ($50k extra)', cost: 50000, brandEquity: 5, revMult: 0.85, ceoPat: -15, luck: [0.4, { brandEquity: 9, revMult: 1.3, ceoPat: 15, override: 'LEGENDARY MOVE. You gobbled up cheap ad inventory, hired two people your competitor laid off, and when the market rebounds, you EXPLODE. Marketing case studies will be written about this.' }], outcome: 'You burn through cash during a downturn. The board is apoplectic. Revenue doesn\'t spike because consumer spending is DOWN regardless of your ad spend. Marketing lesson: You can\'t advertise your way out of a recession.' }
    ]
  },
  {
    id: 'press_feature', type: 'positive', title: '📰 Glowing Press Coverage',
    text: 'A major newspaper just published a feature: "How {product} Is Changing the {industry}." The article is overwhelmingly positive. Your PR team is popping champagne at 10am (acceptable in PR).',
    choices: [
      { text: 'Maximize it: social amplification + email blast + landing page ($8k)', cost: 8000, brandEquity: 9, revMult: 1.2, ceoPat: 15, outcome: 'You squeeze every drop of value from that feature. "As Featured In..." becomes your new email signature, website banner, and conversation starter. Marketing lesson: Earned media has a multiplier effect when properly amplified.' },
      { text: 'Use it to pitch more outlets - ride the press wave ($3k)', cost: 3000, brandEquity: 6, revMult: 1.1, ceoPat: 10, outcome: 'Other outlets pick up the story. Other outlets and three podcasts want to interview you. Press begets press. Marketing lesson: PR momentum compounds. One story can become ten.' },
      { text: 'Negotiate a sponsored content series with the paper ($60k)', cost: 60000, brandEquity: 8, revMult: 1.15, ceoPat: 5, outcome: 'The sponsored content is professional but everyone can tell it\'s an ad. It\'s fine, but lacks the magic of the original organic feature. Marketing lesson: You can\'t buy what earned media gives you for free.' },
      { text: 'Stay humble - just share it once and move on', cost: 0, brandEquity: 6, revMult: 1.05, ceoPat: 0, outcome: 'Understated. Some people respect the humility. Your CEO, however, is furious you\'re not making a bigger deal of it. Marketing lesson: In the attention economy, modesty is a luxury few brands can afford.' }
    ]
  },
  {
    id: 'community_love', type: 'positive', title: '💕 Organic Community Growth',
    text: 'Something beautiful is happening. Without any paid effort, a community of {product} fans has formed. They have forums (12k members), a community server (8k), and they\'re creating memes, fan art, and unboxing videos. This is the holy grail.',
    choices: [
      { text: 'Nurture it: dedicate resources to community management ($12k)', cost: 12000, brandEquity: 9, revMult: 1.15, ceoPat: 10, outcome: 'You hire a community manager who actually Gets It. They engage authentically, share insider content, and the community grows 3x in a month. These are your most loyal customers. Marketing lesson: Community is the most undervalued marketing channel.' },
      { text: 'Monetize it: launch an ambassador/referral program ($8k)', cost: 8000, brandEquity: 5, revMult: 1.2, ceoPat: 15, outcome: 'The referral program converts community love into revenue. Some purists grumble about "selling out," but most people appreciate the discount codes. Marketing lesson: There\'s a thin line between empowering a community and exploiting it.' },
      { text: 'Join it as the brand - post directly in the community', cost: 0, brandEquity: 8, revMult: 1.05, ceoPat: 5, luck: [0.5, { brandEquity: 7, revMult: 1.15, ceoPat: 10, override: 'Your brand\'s presence in the community is welcomed with open arms! They love that you\'re "one of them." Direct feedback improves your product AND your marketing.' }], outcome: 'The community has mixed feelings about the brand showing up in "their" space. Some welcome it, others feel like the cool indie thing just got corporate. Tread carefully. Marketing lesson: Brands entering organic communities should listen 10x more than they speak.' },
      { text: 'Leave it alone - organic is organic, don\'t ruin it', cost: 0, brandEquity: 5, revMult: 1.05, ceoPat: -5, outcome: 'The community continues to grow naturally. No intervention, no interference. It\'s authentic and pure. The CEO wanted you to monetize it, but some things are better left untouched. Marketing lesson: Sometimes doing nothing is the right decision.' }
    ]
  },
  {
    id: 'rebrand_tempt', type: 'pressure', title: '🎨 The Rebrand Temptation',
    text: 'Your agency (or your designer, if you didn\'t hire an agency) pitches a complete rebrand. New logo, new colors, new messaging, new everything. The mockups are stunning. But you\'re only {month} months in...',
    choices: [
      { text: 'Full rebrand! Out with the old! ($60k)', cost: 60000, brandEquity: -18, revMult: 0.85, ceoPat: -10, luck: [0.3, { brandEquity: 9, revMult: 1.1, ceoPat: 10, override: 'Against all odds, the rebrand is a SMASH. The new identity perfectly captures the zeitgeist. Customers love it. Design blogs feature it. You just pulled off the riskiest move in marketing.' }], outcome: 'You just reset 6 months of brand recognition to zero. Existing customers are confused. "Is this the same company?" Your SEO tanks as the brand name change destroys search equity. Marketing lesson: Rebranding mid-launch is like changing planes mid-flight.' },
      { text: 'Minor refresh - keep the core, update the edges ($15k)', cost: 15000, brandEquity: 3, revMult: 1.0, ceoPat: 5, outcome: 'A sensible evolution. New brand photography, tightened messaging, updated social templates. Familiar enough to keep recognition, fresh enough to feel current. Marketing lesson: Brand evolution > brand revolution.' },
      { text: 'Stick with what we have', cost: 0, brandEquity: 1, revMult: 1.0, ceoPat: 0, outcome: 'Consistency is an underrated superpower. Your brand may not be perfect, but people recognize it. In a world of constant change, staying the course IS a strategy. Marketing lesson: The best brands are boringly consistent.' },
      { text: 'Fire the agency for suggesting this', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: 0, outcome: 'Dramatic. The agency is stunned. (They also bill you for the pitch work: $8k.) But your message is clear: we\'re focused on execution, not decoration. Marketing lesson: Know when creativity serves strategy and when it derails it.' }
    ]
  },
  {
    id: 'supply_chain', type: 'crisis', title: '📦 Supply Chain Meltdown',
    text: 'Your manufacturer just called: production delays mean you\'ll have 60% less inventory for the next 6 weeks. Your best-selling SKU is already out of stock. Customer service is drowning in "where\'s my order" emails.',
    choices: [
      { text: 'Pause marketing completely until supply stabilizes', cost: 0, brandEquity: -6, revMult: 0.5, ceoPat: -10, outcome: 'Revenue craters but at least you\'re not advertising something people can\'t buy. The dark period feels like an eternity. Your team starts "exploring other opportunities." Marketing lesson: Going dark is rarely the right answer - you\'re ceding ground to competitors.' },
      { text: 'Pivot to waitlist / pre-order strategy ($10k)', cost: 10000, brandEquity: 4, revMult: 0.7, ceoPat: 5, outcome: 'Scarcity becomes a feature, not a bug. "Join the waitlist" creates FOMO. When products ship, the unboxing content is GRATEFUL, not entitled. Marketing lesson: Scarcity + transparency = desire.' },
      { text: 'Keep marketing but shift to brand storytelling', cost: 5000, brandEquity: 3, revMult: 0.6, ceoPat: 0, outcome: 'You use the downtime to invest in content: founder story, behind-the-scenes, production quality features. People fall in love with the brand even before they can buy. Marketing lesson: When you can\'t sell, tell stories.' },
      { text: 'Source from a backup manufacturer at 2x cost ($30k premium)', cost: 30000, brandEquity: -5, revMult: 0.9, ceoPat: 0, outcome: 'Product keeps flowing, but margins are razor-thin. The backup quality is slightly lower. Three 1-star reviews mention it. Marketing lesson: Quality consistency IS marketing.' }
    ]
  },
  {
    id: 'hockey_stick', type: 'pressure', title: '📈 The Hockey Stick',
    text: 'Revenue just popped 1,500% overnight. The CEO is popping champagne and asking what lever you pulled. But your attribution dashboard is empty and you have no idea what\'s driving the spike in sales. Do you take the credit or check the receipts?',
    choices: [
      { text: '"I optimized the funnel. It\'s paying off." (Claim Credit)', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: -50, gameOver: 0.3, luck: [0.25, { ceoPat: 100, override: 'It was real! A mega-influencer tweeted about {product} and sales exploded organically. You\'re a genius — or at least everyone thinks you are. The CEO gives you a standing ovation at the all-hands. Marketing lesson: Sometimes it\'s better to be lucky than good.' }], outcome: 'Finance walks in with a grim face. "Those orders? Credit card testing fraud from a bot farm in Eastern Europe." The refunds destroy your Q3 net revenue. The CEO stares at you. "You said this was YOUR strategy." Marketing lesson: Never claim credit for numbers you can\'t explain.' },
      { text: '"Let me verify the data source first." (Investigate)', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: -10, weakAnalyticsPenalty: true, luck: [0.8, { ceoPat: 20, cost: -50000, override: 'You find 10,000 fraudulent orders and block them before shipping. You just saved the company $50k in shipping costs. The CEO respects the diligence. "This is why we have you." Marketing lesson: It pays to do the unglamorous data work.' }], outcome: 'It was real sales. An organic forum thread drove genuine traffic. And you just told the CEO you "needed to verify" your own numbers. "Do you... not know what\'s happening in your own department?" Marketing lesson: Sometimes the data is real and hesitation costs you credibility.' },
      { text: '"Our AI-driven omnichannel synergy is kicking in." (Buzzword Bluff)', cost: 0, brandEquity: -5, revMult: 1.0, ceoPat: -40, luck: [0.5, { ceoPat: 10, brandEquity: 0, cost: 20000, override: 'The CEO nods blankly. "Good. Keep... synergizing." You survive the meeting. But Finance discovers the fraud next month — costing you $20k in chargebacks. Marketing lesson: Buzzwords buy time, not results.' }], outcome: 'The CEO perks up. "Excellent! Present the full attribution model to the Board tomorrow." You spend all night faking a slide deck. The Board asks three follow-up questions you can\'t answer. Your credibility craters. Marketing lesson: If you can\'t explain it simply, you don\'t understand it — and neither does your slide deck.' },
      { text: '"Gen Z found us. We must be trending on social media." (Hype Gamble)', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: -60, luck: [0.1, { ceoPat: 150, override: 'You check social media and... you actually ARE trending. A creator with 5M followers made a meme about {product}. The CEO promotes you to "Chief Hype Officer" on the spot. Marketing lesson: Even a blind squirrel finds a nut sometimes.' }], outcome: 'You check social media. You have 4 views — three of which are you. The sales are bots. The CEO asks if you actually know what "Skibidi" means. You do not. An uncomfortable silence fills the room. Marketing lesson: "We\'re viral" is not a strategy. It\'s a prayer.' }
    ]
  },
  {
    id: 'premium_typo', type: 'crisis', title: '🐨 Quality Control',
    condition: (g) => ['premium', 'lifestyle'].includes(g.positioning) && g.product !== 'software',
    text: 'The first 50,000 units of {product} just arrived from the factory. They look beautiful. Except the tagline reads: "World Class Koala Tea." Somebody in production thought it was intentional. You launch in 48 hours.',
    choices: [
      { text: '"It\'s not a typo. It\'s a Save the Wildlife campaign." (Lean In)', cost: 15000, brandEquity: 0, revMult: 1.0, ceoPat: -5, luck: [0.5, { brandEquity: 7, revMult: 1.15, ceoPat: 10, override: 'The "Koala Tea" limited edition becomes a collector\'s item! People are reselling them for 3x online. You donate 1% to a koala sanctuary. The internet loves it. Marketing lesson: Sometimes mistakes are the best marketing.' }], outcome: 'Premium customers don\'t want "quirky." They want flawless. Returns spike 20%. "Wait, do you sell {product} or tea?" Support tickets flood in asking for brewing instructions. Marketing lesson: Premium positioning means premium execution. Every. Single. Time.' },
      { text: '"Trash them. Reprint everything." (Nuclear Option)', cost: 35000, brandEquity: 2, revMult: 0.95, ceoPat: -15, outcome: 'You miss the launch date. The CEO\'s vein is visible from across the room. But the grammar is perfect and your brand integrity survives. Marketing lesson: The cost of fixing mistakes early is always less than the cost of explaining them later.' },
      { text: '"Sticker over it. Ship them to the discount channel." (Compromise)', cost: 20000, brandEquity: -2, revMult: 1.0, ceoPat: 5, outcome: 'You salvage the misprints through discount outlets and get clean inventory into premium channels. The team stays all night putting stickers on boxes. One employee quits to work at a literal zoo. Marketing lesson: Creative problem-solving beats perfectionism.' }
    ]
  },
  {
    id: 'visionary_ceo', type: 'pressure', title: '🎨 The "Creative" Director',
    text: 'It\'s 11 PM on a Friday. The CEO just messaged you a mocked-up ad they made in a free design tool. It uses Comic Sans, three different shades of neon green, and a meme format from 2014. They say: "I think this is the bold direction {product} has been missing."',
    choices: [
      { text: '"Love the energy! Let\'s test it." (Yes Man)', cost: 5000, brandEquity: -8, revMult: 0.95, ceoPat: 15, luck: [0.5, { brandEquity: 3, revMult: 1.05, ceoPat: 25, override: 'It performs terribly as an ad. But the CEO is THRILLED to see their vision realized. They become your biggest internal champion. "This is what happens when marketing LISTENS." Marketing lesson: Sometimes managing up IS the strategy.' }], outcome: 'You spend $5k producing the CEO\'s "vision." The result looks like a fever dream. Customers are confused. Your design team considers a group resignation. The CEO blames you for "executing it poorly." Marketing lesson: Saying yes to every executive idea is a fast track to brand incoherence.' },
      { text: '"Fascinating. Let me run a quick focus group." (Slow Roll)', cost: 2000, brandEquity: 0, revMult: 1.0, ceoPat: -5, outcome: 'The focus group buys you time. Results come back mixed (you made sure the questions were framed that way). "The data doesn\'t support a pivot right now." The CEO forgets about it by Monday. Marketing lesson: Data is the best shield against bad executive ideas.' },
      { text: '"With respect, please never open a design tool again." (Hard Truth)', cost: 0, brandEquity: 2, revMult: 1.0, ceoPat: -15, luck: [0.2, { ceoPat: 15, brandEquity: 5, override: 'The CEO stares at you for an uncomfortable 8 seconds. Then: "You know what? I respect that. Nobody else has the guts to push back." You just earned something money can\'t buy: executive trust. Marketing lesson: Respectful pushback is a leadership skill.' }], outcome: 'The CEO\'s face goes blank. "I see." The next three meetings are tense. Your budget review is suddenly "re-prioritized." You were right, but being right doesn\'t always win. Marketing lesson: HOW you deliver the truth matters as much as the truth itself.' }
    ]
  },
  {
    id: 'influencer_contract', type: 'crisis', title: '🤳 The Brand Ambassador',
    condition: (g) => g.product !== 'software' && g.launchTactics.includes('influencer'),
    text: 'You paid a Gen Z influencer to promote {product}. They just posted the video. They mispronounced the brand name, the logo is backward, and you can clearly see a competitor\'s product on their desk. The comments are brutal.',
    choices: [
      { text: '"Delete it. Refund our money. Now." (The Clawback)', cost: 0, brandEquity: -8, revMult: 0.95, ceoPat: 0, luck: [0.4, { brandEquity: 0, revMult: 1.0, ceoPat: 5, cost: -50000, override: 'They\'re scared of your legal team. You get the money back and they block you. Petty? Sure. But $50k is $50k. Marketing lesson: Contracts exist for a reason.' }], outcome: 'They post screenshots of your angry emails. The caption: "Imagine being this pressed over a product launch." You are now a "Cringe Brand." Marketing lesson: The internet always sides with the creator, not the corporation.' },
      { text: '"Reshoot it. Here\'s $10k rush fee." (The Edit)', cost: 10000, brandEquity: -2, revMult: 0.95, ceoPat: 0, luck: [0.3, { brandEquity: 5, revMult: 1.05, ceoPat: 5, override: 'The reshoot nails it. Raw, authentic, and the influencer actually seems to love {product} this time. Comments flip positive. Marketing lesson: Great influencer content requires great creative briefs.' }], outcome: 'The new video is polished, safe, and boring. It gets 4,000 views. Fans notice the re-upload. Comments flood in: "What are they hiding??" Conspiracy theories start spreading. Marketing lesson: You can\'t reshoot trust.' },
      { text: '"We love the competitor too, but ours is better" (The Comment)', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: 0, luck: [0.5, { brandEquity: 8, revMult: 1.05, ceoPat: 10, override: 'Your comment gets more likes than the video. Marketing press writes about your "Savvy Social Strategy." You just won the internet for a day. Marketing lesson: Self-awareness is the most disarming brand voice.' }], outcome: 'You used a slang term incorrectly. The replies are brutal: "Silence, Brand." Your Social Media Manager cries in the bathroom. Marketing lesson: One clever comment can\'t fix a bad campaign.' }
    ]
  },
  {
    id: 'ai_pivot', type: 'pressure', title: '🤖 The Board Meeting',
    text: 'Your stock is down 4%. A Board Member interrupts your {product} presentation: "Why aren\'t we using Generative AI to replace your entire copywriting team? I heard AI is free." The room goes quiet.',
    choices: [
      { text: '"AI is a tool, not a replacement." (The Defense)', cost: 0, brandEquity: 2, revMult: 1.0, ceoPat: -5, luck: [0.3, { ceoPat: 15, brandEquity: 5, override: 'The Board respects your commitment to quality. "Finally, someone who cares about the craft." You get approved for an AI integration budget ON your terms. Marketing lesson: Measured confidence wins in boardrooms.' }], outcome: 'They roll their eyes. The minutes read: "Marketing resistant to innovation." They cut your headcount budget by 10% anyway. Marketing lesson: Boards want transformation, not caution. Even when caution is correct.' },
      { text: '"Already on it. Let me fire the writers." (Malicious Compliance)', cost: 0, brandEquity: -6, revMult: 1.0, ceoPat: 10, luck: [0.8, { brandEquity: 3, revMult: 1.1, ceoPat: 20, cost: -15000, override: 'The AI copy is... actually fine? Content production triples. You save $15k/month. Your entire creative team hates you, but the Board thinks you\'re a visionary. Marketing lesson: Sometimes the expedient answer is the right answer.' }], outcome: 'The AI writes a press release announcing a {product} feature that doesn\'t exist. Legal has a panic attack. You rehire the writers at a 20% premium. Marketing lesson: AI-washing is the new greenwashing.' },
      { text: '"We\'re deploying LLM-driven semantic optimization layers." (Buzzword Salad)', cost: 0, brandEquity: 0, revMult: 1.0, ceoPat: -10, luck: [0.6, { ceoPat: 15, override: 'The Board nods blankly. Nobody wants to admit they don\'t know what "semantic optimization" means. Meeting adjourns early. You survived another quarter. Marketing lesson: Sometimes the meta-strategy is managing the room, not the work.' }], outcome: 'The CTO is in the room. She asks: "Which LLM are you fine-tuning and what\'s your inference latency?" You stutter. You sweat. You are exposed. Marketing lesson: If you can\'t explain it simply, someone in the room WILL call your bluff.' }
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
    { name: 'Influencer Gift Guide Push', cost: 50000, brandMult: 0.8, perfMult: 0.7, desc: 'Get into every "Gift Guide" and "Holiday Haul" video. Expensive but effective.', icon: '🎁' },
    { name: 'Charity Tie-In', cost: 5000, brandMult: 0.3, perfMult: 0.1, desc: 'Donate a portion of holiday sales to a cause. Low cost, good vibes, and a feel-good press angle.', icon: '❤️' }
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
    brandEquity: 5,
    ceoPat: 75,
    turn: 0,
    maxTurns: 12, // 12 months total including holiday
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
    rank: 1,
    title: 'Director of Marketing',
    brandMomentum: 0,
    promotionHistory: [],
    gameOver: false,
    gameOverReason: '',
    consecutiveBad: 0,
    lastConflictOutcome: null,
    bonusesReceived: 0,
    hasSave: false,
    midYearReviewDone: false,
    midYearAdjustments: {},
    allFiredPenalty: false,
    holidayTactics: [],
    consecutiveZeroSpend: 0,
    _helpOpen: null,
    _submittedToLeaderboard: false,
    _cheapVibesWorked: false,
    _valueThriftWorked: false
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
      // Migration for new fields
      if (G.rank === undefined) G.rank = 3; // old VP save = rank 3
      if (G.brandMomentum === undefined) G.brandMomentum = 0;
      if (G.promotionHistory === undefined) G.promotionHistory = [];
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

let _lastEffect = null;

function createFallingEmoji(emoji, count, duration) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = emoji;
      el.style.cssText = `position:fixed;top:-50px;left:${Math.random()*100}vw;font-size:${24+Math.random()*24}px;z-index:9999;pointer-events:none;animation:emojiFall ${2+Math.random()*2}s linear forwards`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, Math.random() * duration);
  }
}

function createRisingEmoji(emoji, count, duration) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = emoji;
      el.style.cssText = `position:fixed;bottom:-50px;left:${Math.random()*100}vw;font-size:${24+Math.random()*24}px;z-index:9999;pointer-events:none;animation:emojiRise ${2+Math.random()*2}s linear forwards`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, Math.random() * duration);
  }
}

function createFloatingImage(src, count, duration) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('img');
      el.src = src;
      el.style.cssText = `position:fixed;top:-80px;left:${Math.random()*90}vw;width:${50+Math.random()*30}px;height:auto;z-index:9999;pointer-events:none;animation:emojiFall ${2.5+Math.random()*2}s linear forwards;border-radius:8px`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }, Math.random() * duration);
  }
}

function runConfetti(type) {
  if (typeof confetti === 'undefined') return;

  // Avoid repeating the same effect twice in a row
  if (type === _lastEffect && type !== 'win') return;
  _lastEffect = type;

  const productImg = (G.product && G.positioning) ? getProductImage() : null;

  if (type === 'launch') {
    // Launch: confetti only, no emojis
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  } else if (type === 'productSelect') {
    // No animations for product select
  } else if (type === 'goodMonth') {
    // 30% chance to trigger, emojis only (no confetti)
    if (Math.random() > 0.7) {
      const goodEmojis = ['💰', '📈', '🚀', '💵'];
      const pick = goodEmojis[Math.floor(Math.random() * goodEmojis.length)];
      createRisingEmoji(pick, 5, 1000);
    }
  } else if (type === 'win') {
    // CMO win: both confetti AND emojis
    var duration = 3000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: rand(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: rand(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
    createRisingEmoji('🏆', 6, 2000);
    createRisingEmoji('👑', 5, 2000);
    createRisingEmoji('💰', 8, 2500);
    if (productImg) createFloatingImage(productImg, 4, 2500);
  } else if (type === 'promotion') {
    // No animations for promotion screen
  } else if (type === 'recordSmash') {
    // Record smash: confetti only
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#ff0000', '#ffd700', '#00ff41', '#ff6b35'] });
  } else if (type === 'badMonth') {
    // 40% chance to trigger
    if (Math.random() > 0.6) {
      createFallingEmoji('📉', 6, 1500);
      createFallingEmoji('😬', 4, 1500);
    }
  } else if (type === 'publicBacklash') {
    // 50% chance to trigger
    if (Math.random() > 0.5) {
      createFallingEmoji('😠', 6, 1500);
      createFallingEmoji('👎', 6, 1500);
    }
  }
}

// ===== UTILITY FUNCTIONS =====
function $(s) { return document.querySelector(s); }
function $$(s) { return document.querySelectorAll(s); }
function getPositionings() { return G.product === 'software' ? SOFTWARE_POSITIONINGS : POSITIONINGS; }
function getPositioning() { return getPositionings()[G.positioning]; }

// ===== PRODUCT IMAGES =====
const PRODUCT_IMAGES = {
  soda: { main: 'Media/Soda Main.png', premium: 'Media/Soda Premium.png', value: 'Media/Soda Value.png', disruptor: 'Media/Soda Disruptor.png', lifestyle: 'Media/Soda Lifestyle.png' },
  sneakers: { main: 'Media/Shoes Main.png', premium: 'Media/Shoes Premium.png', value: 'Media/Shoes Value.png', disruptor: 'Media/Shoes Disruptor.png', lifestyle: 'Media/Shoes Lifestyle.png' },
  skincare: { main: 'Media/Skin Value.png', premium: 'Media/Skin Premium.png', value: 'Media/Skin Value.png', disruptor: 'Media/Skin Disruptor.png', lifestyle: 'Media/Skin Lifestyle.png' },
  software: { main: 'Media/Software Main.png', enterprise: 'Media/Software Enterprise.png', government: 'Media/Software Government.png', consumer: 'Media/Software Consumer Smartphone.png', smb: 'Media/Software Startup Unicorn.png' }
};

// Preload all game images so they're cached before needed
function preloadImages() {
  const imgs = [
    'Media/Promo Senior Director.png', 'Media/Promo VP.png', 'Media/Promo EVP.png',
    'Media/Congratulations Youre CMO.png', 'Media/RIP Your Job.png', 'Media/Tombstone.png'
  ];
  // Add all product images
  Object.values(PRODUCT_IMAGES).forEach(p => {
    Object.values(p).forEach(src => { if (src && !imgs.includes(src)) imgs.push(src); });
  });
  imgs.forEach(src => { const i = new Image(); i.src = src; });
}
preloadImages();

function getProductImage() {
  const imgs = PRODUCT_IMAGES[G.product];
  return imgs && G.positioning ? (imgs[G.positioning] || imgs.main) : (imgs ? imgs.main : '');
}

function getProductMainImage(productKey) {
  const imgs = PRODUCT_IMAGES[productKey];
  return imgs ? imgs.main : '';
}

function getCompetitorImage() {
  const imgs = PRODUCT_IMAGES[G.product];
  if (!imgs) return '';
  if (G.product === 'software') {
    if (G.positioning === 'enterprise') return 'Media/Software Startup Unicorn.png';
    if (G.positioning === 'government') return 'Media/Software Consumer Smartphone.png';
    if (G.positioning === 'smb') return 'Media/Software Enterprise.png';
    if (G.positioning === 'consumer') return 'Media/Software Enterprise.png';
    return imgs.main;
  }
  const rivalMap = { premium: 'value', value: 'premium', disruptor: 'lifestyle', lifestyle: 'disruptor' };
  const rivalPos = rivalMap[G.positioning];
  return rivalPos ? imgs[rivalPos] : imgs.main;
}

const PLAYER_PRODUCT_CONFLICTS = ['celebrity', 'tiktok_viral', 'press_feature', 'community_love', 'supply_chain', 'premium_typo', 'review_bomb', 'rebrand_tempt', 'viral_fail'];
const COMPETITOR_CONFLICTS = ['copycat'];

function getConflictImage(conflictId) {
  if (PLAYER_PRODUCT_CONFLICTS.includes(conflictId)) return getProductImage();
  if (COMPETITOR_CONFLICTS.includes(conflictId)) return getCompetitorImage();
  return '';
}
function fmt(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'k';
  return '$' + n.toLocaleString();
}
function fmtFull(n) { return '$' + Math.round(n).toLocaleString(); }
function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function getRankTitle(rank) {
  return RANKS.find(r => r.rank === rank) || RANKS[0];
}

function getEventEfficacy() {
  return EVENT_EFFICACY[G.positioning] !== undefined ? EVENT_EFFICACY[G.positioning] : 1.0;
}

function getAssetQualityMod() {
  const pos = G.positioning;
  const isCheap = G.brandTier === 'diy' || G.siteTier === 'template';
  const isValue = pos === 'value';
  let mod = 1.0;
  if (['premium', 'enterprise', 'government'].includes(pos)) {
    if (isCheap) mod *= 0.6;
  } else if ((pos === 'lifestyle' || pos === 'disruptor') && isCheap) {
    mod *= G._cheapVibesWorked ? 1.05 : 0.6;
  } else if (isValue) {
    if (G.brandTier === 'worldClass') mod *= 0.95;
    if (G.brandTier === 'diy' && G._valueThriftWorked) mod *= 1.05;
    if (G.researchTier === 'basic') mod *= 1.05;
  }
  return mod;
}

function shuffleConflicts() {
  // Filter conflicts by conditions (e.g. premium-only, influencer-only)
  let pool = CONFLICTS.filter(c => !c.condition || c.condition(G));
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

  // Build 10 conflicts ensuring variety (turns 2-11)
  let selected = [];
  // At least 3 crises, 2 positive, 2 pressure, 2 market
  selected.push(...crises.slice(0, 3));
  selected.push(...positive.slice(0, 2));
  selected.push(...pressure.slice(0, 2));
  selected.push(...market.slice(0, 2));

  // Fill remaining 1 slot randomly
  let remaining = [...crises.slice(3), ...positive.slice(2), ...pressure.slice(2), ...market.slice(2)];
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }
  selected.push(...remaining.slice(0, 1));

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
  const adj = G.midYearAdjustments || {};
  ROLES.forEach(r => {
    const scale = adj[r.id] !== undefined ? adj[r.id] : 1.0;
    if (t[r.id] === 'ft') mult += 0.08 * scale;
    else if (t[r.id] === 'agency') mult += 0.06 * scale;
    // skip = 0
  });
  // Bonus for performance agency (they're specialists)
  const growthScale = adj.growth !== undefined ? adj.growth : 1.0;
  if (t.growth === 'agency') mult += 0.03 * growthScale;
  // Bonus for full-time brand strategist
  const brandScale = adj.brand !== undefined ? adj.brand : 1.0;
  if (t.brand === 'ft') mult += 0.02 * brandScale;
  return mult;
}

function calcTeamCost() {
  let cost = 0;
  const adj = G.midYearAdjustments || {};
  ROLES.forEach(r => {
    const scale = adj[r.id] !== undefined ? adj[r.id] : 1.0;
    if (G.team[r.id] === 'ft') cost += r.ftCost * scale;
    else if (G.team[r.id] === 'agency') cost += r.agCost * scale;
  });
  G.teamCostPerMonth = Math.round(cost);
}

function calcReviewTeamCost(adjustments) {
  let cost = 0;
  const hires = G._reviewHires || {};
  ROLES.forEach(r => {
    const scale = adjustments[r.id] !== undefined ? adjustments[r.id] : 1.0;
    if (G.team[r.id] === 'ft') cost += r.ftCost * scale;
    else if (G.team[r.id] === 'agency') cost += r.agCost * scale;
    else if (G.team[r.id] === 'skip' && hires[r.id] === 'ft') cost += r.ftCost;
    else if (G.team[r.id] === 'skip' && hires[r.id] === 'agency') cost += r.agCost;
  });
  return Math.round(cost);
}

function calcMonthlyRevenue(month, allocOverride) {
  const p = PRODUCTS[G.product];
  const pos = getPositioning();
  const alloc = allocOverride || G.allocation;

  // Scale base revenue 2x for new revenue targets ($10M-$50M range)
  let base = p.baseRevenue * 2;
  let growth = 1 + (month - 1) * p.growth;
  let teamMult = calcTeamMultiplier();
  let posMult = pos.revMult;
  let siteMult = 1 + G.siteRevBonus;
  let brandTierMult = 1 + G.prelaunchRevBonus;
  let futureMult = 1 + G.futureRevBonus;

  // Asset quality modifier (scam penalty for premium+DIY, diminishing returns for value+worldClass)
  let assetMod = getAssetQualityMod();

  // --- BRAND ENGINE: exponential, compounding via brandMomentum ---
  // brandMomentum scales with time: negligible months 1-3, dominant months 9-12
  let brandMultiplier = 1 + G.brandMomentum * clamp(month / 4, 0, 3);
  let brandAllocBoost = 1 + (alloc.brand / 30000) * 0.05;

  // --- PR boost ---
  let prBoost = 1 + (alloc.pr / 25000) * 0.1;

  // --- EVENTS boost: modified by channel efficacy ---
  let eventEfficacy = getEventEfficacy();
  let eventBoost = 1 + (alloc.events / 25000) * 0.08 * eventEfficacy;

  // Brand equity still provides a baseline boost (but smaller now that brandMomentum is the main engine)
  let equityBoost = 1 + (G.brandEquity / 100) * 0.3;

  // Base revenue from brand engine (everything except performance)
  let baseRev = base * growth * brandMultiplier * equityBoost * teamMult * posMult *
                siteMult * brandTierMult * futureMult * prBoost * eventBoost * brandAllocBoost * assetMod;

  // --- PERFORMANCE ENGINE: linear, additive, no compound ---
  // $1 in → ~$1.5 out this month only, doesn't multiply with brand
  let perfRevenue = alloc.performance * 1.5;

  // Total revenue = brand engine + performance engine
  let rev = baseRev + perfRevenue;

  // Randomness: +/- 25% (higher variance for "blowout quarters")
  rev *= rand(0.75, 1.25);

  return Math.round(rev);
}

function calcBrandEquityChange(alloc) {
  let change = 0;
  const t = G.team;

  // Team effects (reduced base)
  if (t.brand === 'ft') change += 1.0;
  else if (t.brand === 'agency') change += 0.5;
  else change -= 1.5;

  if (t.content === 'ft') change += 0.3;
  if (t.data === 'ft') change += 0.2;

  // Positioning bonus
  change += getPositioning().brandBonus * 0.15;

  // Allocation effects
  change += alloc.brand * ALLOC_CATEGORIES[0].equityPerDollar;
  change += alloc.performance * ALLOC_CATEGORIES[1].equityPerDollar; // slightly negative
  change += alloc.pr * ALLOC_CATEGORIES[2].equityPerDollar;
  change += alloc.events * ALLOC_CATEGORIES[3].equityPerDollar;

  // Compounding: gains scale up in later months (small early, big late)
  // Month 1-3: 0.5x-0.7x, Month 6: 1.0x, Month 9-12: 1.3x-1.6x
  const month = G.turn || 1;
  const compoundScale = 0.4 + (month / 12) * 1.2;
  if (change > 0) change *= compoundScale;

  // Premium + cheap assets: halve positive brand equity gains ("scam modifier")
  // Lifestyle/disruptor can dodge this if cheap vibes landed
  const isCheap = G.brandTier === 'diy' || G.siteTier === 'template';
  if (isCheap && ['premium', 'enterprise', 'government'].includes(G.positioning)) {
    if (change > 0) change *= 0.5;
  } else if (isCheap && (G.positioning === 'lifestyle' || G.positioning === 'disruptor') && !G._cheapVibesWorked) {
    if (change > 0) change *= 0.5;
  }

  return change;
}

function processMonth() {
  const alloc = G.allocation;
  const totalSpend = alloc.brand + alloc.performance + alloc.pr + alloc.events + G.teamCostPerMonth;

  // Update brand momentum (the compounding flywheel engine)
  G.brandMomentum += (alloc.brand / 30000) * 0.04;
  G.brandMomentum *= 1.12; // 12% compound growth per month
  G.brandMomentum = clamp(G.brandMomentum, 0, 5); // cap to prevent runaway

  // Deduct spend
  G.budget -= totalSpend;

  // Calculate revenue
  let rev = calcMonthlyRevenue(G.turn);
  // Apply one-time launch boost to first month
  if (G._launchRevBoost) {
    rev = Math.round(rev * (1 + G._launchRevBoost));
    G._launchRevBoost = 0;
  }
  // Apply fire-everyone penalty
  if (G.allFiredPenalty) {
    const penaltyMult = rand(0.6, 0.85);
    rev = Math.round(rev * penaltyMult);
  }
  G.monthlyRevenue.push(rev);
  G.totalRevenue += rev;

  // Max brand spend fixes scam penalty (upgrades cheap assets)
  if (alloc.brand >= 60000) {
    if (G.brandTier === 'diy') G.brandTier = 'boutique';
    if (G.siteTier === 'template') G.siteTier = 'custom';
  }

  // Update brand equity
  const beChange = calcBrandEquityChange(alloc);
  G.brandEquity = clamp(G.brandEquity + beChange, 0, 100);

  // CEO patience decay / growth based on revenue trend
  if (G.monthlyRevenue.length >= 2) {
    const prev = G.monthlyRevenue[G.monthlyRevenue.length - 2];
    if (rev > prev * 1.1) G.ceoPat = clamp(G.ceoPat + 5, 0, 100);
    else if (rev < prev * 0.85) G.ceoPat = clamp(G.ceoPat - 8, 0, 100);
  }

  // CEO vibes drain + soft cap based on revenue pacing (scaled to $50M ceiling)
  if (G.monthlyRevenue.length >= 2) {
    const annualized = (G.totalRevenue / G.monthlyRevenue.length) * 12;

    // Drain: stronger penalties the further behind target
    if (annualized < 15000000) G.ceoPat = clamp(G.ceoPat - 8, 0, 100);
    else if (annualized < 25000000) G.ceoPat = clamp(G.ceoPat - 5, 0, 100);
    else if (annualized < 40000000) G.ceoPat = clamp(G.ceoPat - 2, 0, 100);

    // Soft cap: revenue performance limits max CEO happiness
    // Good event choices alone can't keep the CEO happy if revenue isn't there
    let ceoMax = 100;
    if (annualized < 15000000) ceoMax = 50;
    else if (annualized < 25000000) ceoMax = 70;
    else if (annualized < 40000000) ceoMax = 85;
    G.ceoPat = Math.min(G.ceoPat, ceoMax);
  }

  // Fire-everyone extra CEO patience drain
  if (G.allFiredPenalty) {
    G.ceoPat = clamp(G.ceoPat - 3, 0, 100);
  }

  // Track consecutive months of zero marketing spend
  const marketingSpend = alloc.brand + alloc.performance + alloc.pr + alloc.events;
  if (marketingSpend === 0 && G.turn > 1) {
    G.consecutiveZeroSpend++;
    if (G.consecutiveZeroSpend >= 3) {
      G.gameOver = true;
      G.gameOverReason = 'Three months of zero marketing spend. The CEO called an emergency board meeting. "What exactly is our ' + G.title + ' doing?" Nobody had a good answer. Your desk has been reassigned.';
    }
  } else {
    G.consecutiveZeroSpend = 0;
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

function evaluateMonth1Congruency() {
  const findings = [];
  const pos = G.positioning;
  const team = G.team;
  const tactics = G.launchTactics;
  const totalTacticCost = tactics.reduce((sum, id) => sum + LAUNCH_TACTICS.find(t => t.id === id).cost, 0);

  // BAD: Skipped PR team but invested in press release or influencer seeding
  if (team.pr === 'skip' && (tactics.includes('press') || tactics.includes('influencer'))) {
    findings.push({
      type: 'bad',
      title: 'PR Fumble',
      text: tactics.includes('influencer')
        ? 'You sent product to influencers... with no PR team to manage the relationships. Half the packages went to the wrong addresses. The other half got unboxed on camera with zero talking points.'
        : 'You sent a press release with no PR team to field the calls. Journalists reached out. Nobody answered. The story died.',
      revMult: 0.85, ceoPat: -5, brandEquity: -2
    });
  }

  // BAD: DIY brand + premium positioning (always bad)
  if (G.brandTier === 'diy' && pos === 'premium') {
    findings.push({
      type: 'bad',
      title: 'Brand Identity Crisis',
      text: `A ${getPositioning().name.toLowerCase()} product with a DIY logo? Early customers think it's a scam. First reviews mention "sketchy branding" and "looks like a knockoff."`,
      revMult: 0.7, ceoPat: -8, brandEquity: -3
    });
  }

  // Lifestyle/disruptor + cheap assets: chance the scrappy vibe works
  if ((pos === 'lifestyle' || pos === 'disruptor') && (G.brandTier === 'diy' || G.siteTier === 'template')) {
    if (Math.random() < 0.3) {
      G._cheapVibesWorked = true;
      findings.push({
        type: 'good',
        title: pos === 'lifestyle' ? 'Ironic Aesthetic' : 'Scrappy Underdog Energy',
        text: pos === 'lifestyle'
          ? `The DIY look? Customers think it's intentional. "It's giving indie brand authenticity." Your lo-fi aesthetic becomes the aesthetic. Influencers are calling ${G.productName} "anti-corporate" and they mean it as a compliment.`
          : `Your rough-around-the-edges brand screams "we spent the money on the product, not the logo." Early adopters love the scrappy energy. ${G.productName} looks like a startup that ships fast and breaks things — exactly what disruptor customers want.`,
        revMult: 1.1, ceoPat: 5, brandEquity: 3
      });
    } else {
      findings.push({
        type: 'bad',
        title: 'Brand Identity Crisis',
        text: pos === 'lifestyle'
          ? `A ${getPositioning().name.toLowerCase()} product with ${G.brandTier === 'diy' ? 'a DIY logo' : 'a template website'}? Customers expected curated aesthetics and got clip art energy. First impressions are everything in lifestyle — and this one flopped.`
          : `A ${getPositioning().name.toLowerCase()} product with ${G.brandTier === 'diy' ? 'a DIY logo' : 'a template website'}? Early customers think it's a scam. First reviews mention "sketchy branding" and "looks like a knockoff."`,
        revMult: 0.7, ceoPat: -8, brandEquity: -3
      });
    }
  }

  // Value + DIY brand: chance the thrift signals product investment
  if (pos === 'value' && G.brandTier === 'diy') {
    if (Math.random() < 0.4) {
      G._valueThriftWorked = true;
      findings.push({
        type: 'good',
        title: 'Thrift Signals Quality',
        text: `Customers see the no-frills branding and think "they spent the money on the product, not some fancy agency." For a value brand, that's exactly the right message. Early reviews praise ${G.productName} for "substance over style."`,
        revMult: 1.08, ceoPat: 3, brandEquity: 2
      });
    }
  }

  // BAD: Template website + heavy tactic spending (lots of traffic expected)
  if (G.siteTier === 'template' && totalTacticCost > 200000) {
    findings.push({
      type: 'bad',
      title: 'Website Crash',
      text: 'Your template website buckled under launch-day traffic. 503 errors everywhere. Customers who clicked your expensive ads got an error page. Money, meet drain.',
      revMult: 0.6, ceoPat: -10, brandEquity: -4
    });
  }

  // BAD: Premium/lifestyle/disruptor + no research
  if (['premium', 'lifestyle', 'disruptor'].includes(pos) && G.researchTier === 'none') {
    findings.push({
      type: 'bad',
      title: 'Missed the Market',
      text: `You launched a ${getPositioning().name.toLowerCase()} product without any research. Your messaging is off, your pricing is wrong, and your target customer wants something completely different.`,
      revMult: 0.75, ceoPat: -5, brandEquity: -2
    });
  }

  // BAD: Government/enterprise + cheap brand and/or cheap website
  if ((pos === 'government' || pos === 'enterprise') && (G.brandTier === 'diy' || G.siteTier === 'template')) {
    const cheapParts = [];
    if (G.brandTier === 'diy') cheapParts.push('DIY brand identity');
    if (G.siteTier === 'template') cheapParts.push('template website');
    findings.push({
      type: 'bad',
      title: 'Immediate Distrust',
      text: `${pos === 'government' ? 'Government procurement teams' : 'Enterprise buyers'} took one look at your ${cheapParts.join(' and ')} and closed the tab. In ${pos === 'government' ? 'gov' : 'enterprise'}, credibility IS the product.`,
      revMult: 0.65, ceoPat: -10, brandEquity: -5
    });
  }

  // GOOD: Full research
  if (G.researchTier === 'full') {
    findings.push({
      type: 'good',
      title: 'Market Intelligence Pays Off',
      text: 'Your thorough research means you launched with the right message to the right audience. Conversion rates are strong from day one.',
      revMult: 1.1, ceoPat: 5, brandEquity: 2
    });
  }

  // GOOD: Strong brand + premium/lifestyle/enterprise
  if ((G.brandTier === 'topTier' || G.brandTier === 'worldClass') && ['premium', 'lifestyle', 'enterprise'].includes(pos)) {
    findings.push({
      type: 'good',
      title: 'Premium Brand Resonance',
      text: `Your ${BRAND_TIERS.find(t => t.id === G.brandTier).name.toLowerCase()} brand identity perfectly matches your ${getPositioning().name.toLowerCase()} positioning. Customers feel the quality before they even try the product.`,
      revMult: 1.15, ceoPat: 5, brandEquity: 3
    });
  }

  // GOOD: Full in-house team
  if (ROLES.every(r => team[r.id] === 'ft')) {
    findings.push({
      type: 'good',
      title: 'Dream Team Assembled',
      text: 'A full in-house team executing from day one. Fast decisions, tight coordination, zero agency onboarding lag.',
      revMult: 1.1, ceoPat: 3, brandEquity: 1
    });
  }

  // GOOD: Value + basic/full research + organic/press tactics (lean and smart)
  if (pos === 'value' && G.researchTier !== 'none' && totalTacticCost < 50000) {
    findings.push({
      type: 'good',
      title: 'Lean Launch',
      text: 'Low spend, smart positioning, solid research. Your value play is exactly what the market wants. Word of mouth is already spreading.',
      revMult: 1.1, ceoPat: 3, brandEquity: 2
    });
  }

  // Neutral fallback: if no findings at all
  if (findings.length === 0) {
    findings.push({
      type: 'neutral',
      title: 'Steady Launch',
      text: `${G.productName} hits the market without major surprises. A solid, unremarkable start. The real test comes next month.`,
      revMult: 1.0, ceoPat: 0, brandEquity: 0
    });
  }

  return findings;
}

function checkPromotion(quarter) {
  const rev = G.totalRevenue;
  let promoted = false;
  let skipped = false;
  let message = '';

  if (quarter === 1) { // Month 3 — Survival check
    if (rev >= 2500000) {
      if (G.rank < 4) { G.rank++; promoted = true; }
      message = 'Strong Q1 performance. The CEO noticed. "Keep this up."';
    } else {
      message = 'Q1 was below expectations. The board is watching. You need to pick it up.';
    }
  } else if (quarter === 2) { // Month 6 — Growth check
    if (rev >= 8000000 && G.rank < 4) {
      G.rank++;
      promoted = true;
      message = rev >= 10000000 ? 'Exceptional H1 numbers. The board is deeply impressed.' : 'H1 numbers are strong. The board is impressed. "You\'re on the right track."';
    } else {
      message = 'Growth is lagging behind targets. The board exchanged glances. Not a good sign.';
    }
  } else if (quarter === 3) { // Month 9 — Scale check
    if (rev >= 18000000 && G.rank < 4) {
      G.rank++;
      promoted = true;
      message = rev >= 25000000 ? 'Phenomenal trajectory. The CEO is telling the board about you.' : 'On track for a massive year. Keep pushing.';
    } else {
      message = 'You\'re behind pace. Q4 needs to be extraordinary to turn this around.';
    }
  }

  if (promoted) {
    const rankInfo = getRankTitle(G.rank);
    G.title = rankInfo.title;
    G.promotionHistory.push({ quarter, rank: G.rank, month: G.turn });
  }

  return { promoted, skipped, message, quarter, rank: G.rank, rankInfo: getRankTitle(G.rank) };
}

function processHoliday(tacticIndices) {
  const strats = tacticIndices.map(i => HOLIDAY_EVENT.strategies[i]);
  let totalCost = 0;
  let totalBrandMult = 0;
  let totalPerfMult = 0;

  strats.forEach(s => {
    totalCost += s.cost;
    totalBrandMult += s.brandMult;
    totalPerfMult += s.perfMult;
  });

  G.budget -= totalCost;

  // Holiday multiplier based on brand equity
  const baseHolidayMult = 1.3;
  const brandBonus = (G.brandEquity / 100) * 1.2;
  const holidayMult = baseHolidayMult + brandBonus;

  // Combined strategies affect how much of the multiplier you capture
  // Diminishing returns: each additional strategy adds less
  const avgBrand = strats.length > 0 ? totalBrandMult / strats.length : 0;
  const avgPerf = strats.length > 0 ? totalPerfMult / strats.length : 0;
  const countBonus = 1 + (strats.length - 1) * 0.15; // 15% bonus per extra strategy
  const effectiveMult = holidayMult * (0.5 + avgBrand * 0.3 + avgPerf * 0.2) * Math.min(countBonus, 1.6);

  const baseRev = calcMonthlyRevenue(12);
  const holidayRev = Math.round(baseRev * effectiveMult);

  G.monthlyRevenue.push(holidayRev);
  G.totalRevenue += holidayRev;
  G.turn = 12;

  const stratNames = strats.map(s => s.icon + ' ' + s.name);
  return { holidayRev, holidayMult: effectiveMult, strategies: strats, stratNames, totalCost };
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
    let [chance, luckyEffects] = choice.luck;
    // Weak analytics penalty: doubles negative outcome chance
    if (choice.weakAnalyticsPenalty && (G.researchTier === 'none' || G.brandTier === 'diy')) {
      chance = Math.max(0, 2 * chance - 1);
    }
    if (Math.random() < chance) {
      isLucky = true;
      outcome = luckyEffects.override || outcome;
      effects.brandEquity = luckyEffects.brandEquity ?? effects.brandEquity;
      effects.revMult = luckyEffects.revMult ?? effects.revMult;
      effects.ceoPat = luckyEffects.ceoPat ?? effects.ceoPat;
      if (luckyEffects.cost !== undefined) effects.cost = luckyEffects.cost;
    }
  }

  // Positioning-specific overrides
  if (conflict.id === 'premium_typo' && choiceIdx === 0 && G.positioning === 'lifestyle' && !isLucky) {
    outcome = 'Your lifestyle audience appreciates quirky... up to a point. "Koala Tea" becomes a meme, but not the flattering kind. Returns spike 15% as people can\'t tell if it\'s ironic or incompetent. "Wait, do you sell {product} or tea?" Marketing lesson: Lifestyle brands walk a fine line between playful and sloppy.';
  }
  if (conflict.id === 'copycat' && choiceIdx === 1 && G.positioning === 'value') {
    effects.brandEquity = 5;
    effects.revMult = 1.05;
    outcome = 'Price matching IS your strategy. You were built for this. Your supply chain absorbs the hit while the VC-backed competitor bleeds cash trying to undercut a value brand. They blink first. Marketing lesson: Price wars only hurt when you\'re not the low-cost leader.';
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
    G.gameOverReason = 'The CEO\'s vibes shifted. "We\'re going in a different direction," they said, which is corporate for "you\'re going in the direction of the exit."';
  } else if (G.consecutiveBad >= 4) {
    G.gameOver = true;
    G.gameOverReason = 'Four bad moves in a row. The board has lost confidence. Your "strategic leadership" is being "transitioned." You have 30 minutes to clean out your desk.';
  }

  // Store revenue multiplier for this month's processing
  G._tempRevMult = revEffect;

  return { outcome, effects, isLucky, conflict };
}

// ===== LEADERBOARD =====
let _cachedLeaderboard = [];
let _leaderboardLoaded = false;

function loadLeaderboard(callback) {
  if (!leaderboardRef) {
    if (callback) callback([]);
    return;
  }
  leaderboardRef.orderByChild('revenue').limitToLast(50).once('value', snapshot => {
    const entries = [];
    snapshot.forEach(child => {
      entries.push(child.val());
    });
    const titleRank = t => {
      if (t === 'CMO') return 5;
      if (t === 'EVP of Marketing') return 4;
      if (t === 'VP of Marketing') return 3;
      if (t === 'Senior Director of Marketing') return 2;
      if (t === 'Director of Marketing') return 1;
      return 0; // #OpenToWork
    };
    entries.sort((a, b) => titleRank(b.title) - titleRank(a.title) || b.revenue - a.revenue);
    _cachedLeaderboard = entries;
    _leaderboardLoaded = true;
    if (callback) callback(entries);
  }, error => {
    console.error('Leaderboard load error:', error);
    if (callback) callback([]);
  });
}

function getLeaderboard() {
  return _cachedLeaderboard;
}

function submitToLeaderboard(callback) {
  try {
    if (!leaderboardRef) {
      if (callback) callback(false);
      return;
    }
    const entry = {
      name: G.playerName || 'Anonymous',
      product: G.productName || 'Unknown',
      category: (PRODUCTS[G.product] && PRODUCTS[G.product].name) || 'Unknown',
      revenue: G.totalRevenue || 0,
      brandEquity: Math.round(G.brandEquity) || 0,
      title: G.title || 'Director of Marketing',
      date: new Date().toISOString(),
      turns: G.turn || 0
    };
    leaderboardRef.push(entry, (error) => {
      if (!error) {
        G._submittedToLeaderboard = true;
        loadLeaderboard(() => {
          if (callback) callback(true);
        });
      } else {
        console.error('Leaderboard submit error:', error);
        if (callback) callback(false);
      }
    });
  } catch (e) {
    console.error('Leaderboard submit exception:', e);
    if (callback) callback(false);
  }
}

function saveScore() {
  // Local save only (for resume functionality)
  return {
    name: G.playerName,
    product: G.productName,
    category: PRODUCTS[G.product].name,
    revenue: G.totalRevenue,
    brandEquity: Math.round(G.brandEquity),
    title: G.title,
    date: new Date().toLocaleDateString(),
    turns: G.turn
  };
}

function getShareText() {
  const grade = G.rank >= 5 ? ' 👑' : '';
  return `🎮 I just played The CMO Game!

👔 Final Title: ${G.title}${grade}
📦 Product: ${G.productName}
💰 Revenue: ${fmt(G.totalRevenue)}
🏗️ Brand Equity: ${Math.round(G.brandEquity)}/100
🗓️ Survived: ${G.turn}/12 months

Think you can do better? Play free at cmogame.com

#CMOGame`;
}

// ===== HELP OVERLAY CONTENT =====
function getTeamBuildingHelp() {
  const posAdvice = {
    premium: "Premium products need strong Brand & Creative to justify price points. PR can earn " + G.productName + " coverage in prestige media outlets.",
    lifestyle: "Lifestyle brands thrive on PR & Influencers, and a healthy mix of product positioning, brand image, and predictable growth.",
    value: "Value requires product fundamentals and predictable growth. Flashy creative might be a turnoff to bargain hunting customers.",
    disruptor: "Disruptors are a wildcard. A differentiated product, a unique brand, and bold PR stunts can all help " + G.productName + " stand out.",
    enterprise: "Enterprise software wins through events, relationships, and credibility. PR and Data & Analytics are key.",
    government: "Government contracts depend on trust and visibility. PR and Events are your strongest levers.",
    smb: "Startups require a balanced approach. Growth/Performance drives leads, but brand helps with trust.",
    consumer: "Consumer software lives and dies on virality. Growth/Performance and PR & Influencers are critical."
  };
  const tip = posAdvice[G.positioning] || '';
  return `<h4>Role Tradeoffs</h4>
<div class="help-role"><strong>In-House</strong> — Stronger compounding effects, higher cost.</div>
<div class="help-role"><strong>Agency</strong> — Moderate effects, half the cost.</div>
<div class="help-role"><strong>Skip</strong> — Free, but you'll feel the gap.</div>
${tip ? `<div class="help-tip"><strong>For your positioning:</strong> ${tip}</div>` : ''}`;
}

function getPreLaunchHelp() {
  const posAdvice = {
    premium: "Your positioning demands strong brand identity and website. Cheap assets will actively hurt you (scam penalty). Invest in top-tier branding.",
    lifestyle: "Your positioning demands strong brand identity and website. Cheap assets will actively hurt you (scam penalty). Invest in top-tier branding.",
    value: "You can save on brand identity — your customers care more about price than aesthetics. But don't skip research. Events are wasted on value positioning (0x efficacy).",
    enterprise: "Launch Events get a 1.5x efficacy boost for your positioning. PR Agency Launch is also highly effective. Invest in credibility signals.",
    government: "Launch Events get a 1.5x efficacy boost for your positioning. PR Agency Launch is also highly effective. Invest in credibility signals.",
    disruptor: "A balanced approach works. Don't overspend on brand — your disruption IS the brand. Focus research spend on understanding the market you're disrupting.",
    smb: "Events have reduced efficacy (0.75x) for your positioning. Focus on digital tactics: Social Media Blitz, Blog + Social, and Influencer Seeding.",
    consumer: "Events have reduced efficacy (0.75x) for your positioning. Focus on digital tactics: Social Media Blitz, Blog + Social, and Influencer Seeding."
  };
  const tip = posAdvice[G.positioning] || '';
  return `<h4>Investment Tradeoffs</h4>
<div class="help-role"><strong>Brand & Website:</strong> Cheap = revenue penalties. Premium = revenue bonuses. Going cheap on a premium brand triggers a scam penalty.</div>
<div class="help-role"><strong>Research:</strong> Skipping hurts revenue. Full research boosts revenue and luck.</div>
<div class="help-role"><strong>Launch Tactics:</strong> Events are strongest for premium/enterprise, weakest for value. Stack tactics for bigger impact.</div>
${tip ? `<div class="help-tip"><strong>For your positioning:</strong> ${tip}</div>` : ''}`;
}

function getConflictCallback(conflictId, isGood) {
  let lines = [];

  // PR-related conflicts
  if (['cancel_culture', 'influencer_rogue', 'viral_fail', 'press_feature'].includes(conflictId)) {
    if (G.team.pr === 'skip' && !isGood) lines.push("Skipping a PR team left you without a crisis playbook. Investing in PR & Communications helps navigate media crises.");
    if (G.team.pr === 'ft' && isGood) lines.push("Your in-house PR team's crisis expertise helped you navigate this well.");
    if (G.team.pr === 'agency' && isGood) lines.push("Your PR agency's media connections came through when it mattered.");
  }

  // Data-related conflicts
  if (['data_breach', 'hockey_stick'].includes(conflictId)) {
    if (G.team.data === 'skip') lines.push("Without a Data & Analytics team, you had no early warning system. Data visibility could have caught this sooner.");
    if (G.team.data === 'ft' && isGood) lines.push("Your in-house analytics team spotted the signals early — a direct payoff from that investment.");
  }

  // Performance/ad-related conflicts
  if (['ad_apocalypse', 'algorithm_change'].includes(conflictId)) {
    if (G.team.growth === 'skip') lines.push("With no Growth / Performance hire, you had no one to pivot your channel strategy when things broke.");
    if (G.allocation.performance > 40000) lines.push("Your heavy reliance on performance marketing made you especially vulnerable to platform changes.");
    if (G.allocation.brand > 30000 && isGood) lines.push("Your brand investments gave you a cushion — customers found you even without paid channels.");
  }

  // Brand-related conflicts
  if (['review_bomb', 'copycat', 'rebrand_tempt'].includes(conflictId)) {
    if (G.team.content === 'skip') lines.push("Without a Brand & Creative team, your brand couldn't absorb this hit.");
    if (G.brandTier === 'diy') lines.push("Your DIY brand identity didn't inspire enough loyalty to weather this challenge.");
    if (G.brandTier === 'worldClass' && isGood) lines.push("Your world-class brand identity gave you credibility that helped here.");
  }

  // Positioning-specific callbacks (overlaid on any conflict)
  if (G.positioning === 'premium' && G.brandEquity < 30) {
    lines.push("As a premium brand, underinvesting in brand equity leaves you especially exposed.");
  }
  if (G.positioning === 'lifestyle' && G.brandEquity < 30) {
    lines.push("As a lifestyle brand, underinvesting in brand equity leaves you especially exposed.");
  }
  if (G.positioning === 'value' && G.allocation.events > 0) {
    lines.push("Your value positioning means events spending has little impact — performance marketing would serve you better.");
  }
  if (G.positioning === 'lifestyle' && G.team.pr === 'skip') {
    lines.push("Lifestyle brands live and die by PR & influencer perception. Skipping PR was a risky call.");
  }
  if (['enterprise', 'government'].includes(G.positioning) && G.allocation.events === 0) {
    lines.push("Enterprise and government audiences expect event presence. Skipping that channel hurts your credibility.");
  }

  return lines.length > 0 ? lines[0] : '';
}

// ===== RENDERING =====
function render() {
  if (G.screen !== G._lastScreen) window.scrollTo(0, 0);
  G._lastScreen = G.screen;
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
    case 'promotionReview': app.innerHTML = renderPromotionReview(); break;
    case 'holiday': app.innerHTML = renderHoliday(); break;
    case 'holidayAllocation': app.innerHTML = renderHolidayAllocation(); break;
    case 'holidayResults': app.innerHTML = renderHolidayResults(); break;
    case 'finalResults': app.innerHTML = renderFinalResults(); break;
    case 'gameOver': app.innerHTML = renderGameOver(); break;
    case 'leaderboard': app.innerHTML = renderLeaderboard(); break;
  }

  // Post-render effects (script tags don't execute via innerHTML)
  if (G._pendingConfetti) {
    const type = G._pendingConfetti;
    G._pendingConfetti = null;
    setTimeout(() => runConfetti(type), 300);
  }
  if (G._pendingChart) {
    const chartData = G._pendingChart;
    G._pendingChart = null;
    setTimeout(() => {
      const el = document.getElementById('revenueChart');
      if (el) new Chart(el, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Revenue',
            data: chartData.data,
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
    }, 100);
  }
}

function renderStatsBar() {
  const equityColor = G.brandEquity >= 60 ? 'green' : G.brandEquity >= 30 ? 'amber' : 'red';
  const ceoColor = G.ceoPat >= 60 ? 'green' : G.ceoPat >= 30 ? 'amber' : 'red';

  // Run rate calculation
  const alloc = G.allocation;
  const monthlyBurn = alloc.brand + alloc.performance + alloc.pr + alloc.events + G.teamCostPerMonth;
  const monthsLeft = Math.max(1, 12 - G.turn + 1);
  const runwayMonths = monthlyBurn > 0 ? Math.floor(G.budget / monthlyBurn) : 99;
  const runRateWarning = runwayMonths < monthsLeft;

  // Revenue pacing color: annualize based on months played (scaled to $50M target)
  let revColor = 'money';
  if (G.turn >= 1 && G.monthlyRevenue.length > 0) {
    const annualized = (G.totalRevenue / G.monthlyRevenue.length) * 12;
    if (annualized >= 50000000) revColor = 'equity'; // green
    else if (annualized >= 20000000) revColor = 'money'; // amber
    else revColor = 'danger'; // red
  }

  const rankInfo = getRankTitle(G.rank);

  return `<div class="stats-bar">
    <div class="stat"><div class="label">Title</div><div class="value" style="font-size:.7rem">${rankInfo.icon} ${rankInfo.short}</div></div>
    <div class="stat"><div class="label">Budget</div><div class="value money">${fmtFull(G.budget)}</div>
      ${G.turn >= 1 ? `<div style="font-size:.6rem;margin-top:3px;color:${runRateWarning ? 'var(--red)' : 'var(--muted)'}">~${runwayMonths}mo runway${runRateWarning ? ' ⚠️' : ''}</div>` : ''}</div>
    <div class="stat"><div class="label">Revenue</div><div class="value ${revColor}">${fmtFull(G.totalRevenue)}</div></div>
    <div class="stat"><div class="label">Brand Equity</div><div class="value equity">${Math.round(G.brandEquity)}/100</div>
      <div class="progress-bar"><div class="fill ${equityColor}" style="width:${G.brandEquity}%"></div></div></div>
    <div class="stat"><div class="label">CEO Vibes</div><div class="value ${ceoColor === 'red' ? 'danger' : ''}">${Math.round(G.ceoPat)}/100</div>
      <div class="progress-bar"><div class="fill ${ceoColor}" style="width:${G.ceoPat}%"></div></div></div>
  </div>
  <div class="journey-bar">${Array.from({ length: 12 }, (_, i) => {
    const cls = i < G.turn ? 'done' : i === G.turn ? 'current' : 'future';
    return `<div class="journey-dot ${cls}" title="Month ${i + 1}"></div>`;
  }).join('')}</div>`;
}

function renderTitle() {
  return `<div class="screen title-screen">
    <video class="title-video" autoplay muted playsinline>
      <source src="Media/Opening Video.webm" type="video/webm">
    </video>
    <div class="subtitle pixel">MARKETING SIMULATOR</div>
    <div class="tagline">12 months to climb from Director to CMO... or end up #OpenToWork.</div>
    <div class="card" style="max-width:500px;margin:20px auto;text-align:center">
      <input type="text" id="playerName" placeholder="Enter Your Name" maxlength="20" style="display:block;margin:0 auto" autofocus>
    </div>
    <div class="btn-group">
      <button class="btn primary" data-action="startGame">Start New Campaign</button>
      ${G.hasSave ? '<button class="btn gold" data-action="continueGame">📂 Resume Campaign</button>' : ''}
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
      <div style="display:flex;align-items:center;gap:12px">
        <img src="${getProductMainImage(key)}" alt="${p.name}" class="product-icon product-icon-sm" style="margin:0;flex-shrink:0">
        <div>
          <div class="choice-title">${p.name}</div>
          <div class="choice-desc">${p.desc}</div>
        </div>
      </div>
    </div>`
  ).join('');
  return `<div class="screen">
    <div class="section-title">What Are You Marketing?</div>
    <div class="section-sub">Choose your product category. Each has different growth curves and challenges.</div>
    <div class="choice-grid">${cards}</div>
    <div class="btn-group"><button class="btn" data-action="backToTitle">← Back</button></div>
  </div>`;
}

function renderNaming() {
  const p = PRODUCTS[G.product];
  const examples = p.namingExamples.join(', ');
  return `<div class="screen text-center">
    <div class="section-title">Name your ${p.namingLabel}</div>
    <div class="section-sub">Make your brand memorable and SEO-optimized. Don't use a pun. (Okay, you can use a pun.)</div>
    <div class="card" style="max-width:500px;margin:20px auto">
      <img src="${getProductImage()}" alt="${p.name}" class="product-icon product-icon-md" style="margin:0 auto 15px">
      <input type="text" id="productName" placeholder="Brand Name" maxlength="25" autofocus>
      <div style="margin-top:10px;font-size:.75rem;color:var(--muted)">Examples: ${examples}</div>
    </div>
    <div class="btn-group">
      <button class="btn primary" data-action="confirmName">Lock It In</button>
      <button class="btn" data-action="backToPositioning">← Back</button>
    </div>
  </div>`;
}

function renderPositioning() {
  const p = PRODUCTS[G.product];
  const isSoftware = G.product === 'software';
  const positionings = getPositionings();
  const rows = Object.entries(positionings).map(([id, pos]) => {
    const active = G.positioning === id;
    const posImg = PRODUCT_IMAGES[G.product] ? (PRODUCT_IMAGES[G.product][id] || PRODUCT_IMAGES[G.product].main) : '';
    return `<div class="card clickable ${active ? 'active' : ''}" data-action="setPositioning" data-id="${id}">
      <div style="display:flex;align-items:center;gap:12px">
        ${posImg ? `<img src="${posImg}" alt="${pos.name}" class="product-icon product-icon-sm" style="margin:0;flex-shrink:0">` : ''}
        <div>
          <div style="font-weight:700">${pos.name}</div>
          <div style="font-size:.8rem;color:var(--muted);margin-top:5px">${pos.desc}</div>
        </div>
      </div>
    </div>`;
  }).join('');

  const title = isSoftware ? 'Target Market' : 'Market Positioning';
  const subtitle = isSoftware
    ? 'Who are you selling to? Each customer type has a different burn rate and headache.'
    : `How will your ${p.name.toLowerCase()} compete in the market?`;

  return `<div class="screen">
    <div class="section-title">${title}</div>
    <div class="section-sub">${subtitle}</div>
    ${rows}
    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="goToNaming" ${G.positioning ? '' : 'disabled'}>Confirm ${isSoftware ? 'Target Market' : 'Positioning'}</button>
      <button class="btn" data-action="backToProductSelect">← Back</button>
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
  } else if (allSet && totalCost < 75000) {
    bottomMessage = '<div style="text-align:center;color:var(--red);margin-bottom:15px">This definitely won\'t backfire...</div>';
  }

  const budgetPct = Math.min(100, (totalSpend / 5000000) * 100);
  const budgetColor = budgetPct > 60 ? 'red' : budgetPct > 35 ? 'amber' : 'green';

  const helpActive = G._helpOpen === 'teamBuilding';

  return `<div class="screen">
    <div style="display:flex;align-items:center;justify-content:center;gap:10px">
      <div class="section-title">Build Your Team</div>
      <button class="help-btn ${helpActive ? 'active' : ''}" data-action="toggleHelp" data-value="teamBuilding">?</button>
    </div>
    ${helpActive ? `<div class="help-overlay">${getTeamBuildingHelp()}</div>` : ''}
    <div class="section-sub">Hire in-house, outsource to an agency, or skip. Monthly team burn: <strong class="text-amber">${fmt(totalCost)}/mo</strong> (${fmt(totalSpend)}/year)</div>
    <div class="card" style="padding:12px;margin-bottom:15px">
      <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:6px">
        <span class="text-muted">Team commitment vs $5M budget</span>
        <span class="text-${budgetColor}">${fmtFull(totalSpend)} / $5,000,000 (${budgetPct.toFixed(0)}%)</span>
      </div>
      <div class="progress-bar"><div class="fill ${budgetColor}" style="width:${budgetPct}%"></div></div>
    </div>
    ${rows}
    ${bottomMessage}
    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="confirmTeam" ${allSet ? '' : 'disabled'}>Lock In Team${allSet ? '' : ' (select all roles)'}</button>
      <button class="btn" data-action="backToNaming">← Back</button>
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

  // Calculate total commitment: pre-launch + team burn for 12 months
  const teamYearlyCost = G.teamCostPerMonth * 12;
  const totalCommitment = total + teamYearlyCost;
  const commitPct = Math.min(100, (totalCommitment / 5000000) * 100);
  const commitColor = commitPct > 80 ? 'red' : commitPct > 50 ? 'amber' : 'green';

  const helpActive = G._helpOpen === 'preLaunch';

  return `<div class="screen">
    <div style="display:flex;align-items:center;justify-content:center;gap:10px">
      <div class="section-title">Pre-Launch Investments</div>
      <button class="help-btn ${helpActive ? 'active' : ''}" data-action="toggleHelp" data-value="preLaunch">?</button>
    </div>
    ${helpActive ? `<div class="help-overlay">${getPreLaunchHelp()}</div>` : ''}
    <div class="section-sub">Build your marketing engine before you hit the gas.</div>

    <h3 style="margin-top:20px;margin-bottom:8px">🎨 Brand Identity</h3>
    <div class="tier-group">${brandCards}</div>

    <h3 style="margin-top:20px;margin-bottom:8px">🌐 Website & E-Commerce</h3>
    <div class="tier-group">${siteCards}</div>

    <h3 style="margin-top:20px;margin-bottom:8px">🔬 Positioning Research</h3>
    <div class="tier-group">${researchCards}</div>

    <h3 style="margin-top:20px;margin-bottom:8px">🚀 Launch Tactics <span style="font-weight:400;font-size:.8rem;color:var(--muted)">(select any combination)</span></h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px" class="launch-grid">${launchCards}</div>

    <div class="card" style="margin-top:20px">
      <h3>💰 Spend Commitment Summary</h3>
      <div style="display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:10px;font-size:.85rem">
        <div><span class="text-muted">Pre-launch spend:</span></div><div class="text-amber" style="text-align:right">${fmtFull(total)}</div>
        <div><span class="text-muted">Team burn:</span></div><div class="text-amber" style="text-align:right">${fmt(G.teamCostPerMonth)}/mo | ${fmt(teamYearlyCost)}/yr</div>
        <div style="border-top:1px solid var(--border);padding-top:8px"><strong>Total commitment:</strong></div><div style="border-top:1px solid var(--border);padding-top:8px;text-align:right"><strong class="text-${commitColor}">${fmtFull(totalCommitment)}</strong> <span class="text-muted">/ $5,000,000</span></div>
      </div>
      <div class="progress-bar" style="margin-top:10px"><div class="fill ${commitColor}" style="width:${commitPct}%"></div></div>
      <div style="margin-top:10px;font-size:.85rem;color:var(--muted);text-align:center">You'll have <strong class="text-amber">${fmt(5000000 - totalCommitment)}</strong> remaining to spend over the next 12 months.</div>
      ${totalCommitment > 5000000 ? '<div style="margin-top:10px;font-size:.85rem;color:var(--red);text-align:center;font-weight:600">⚠️ You are projected to go over budget this year.</div>' : ''}
    </div>

    <div class="btn-group" style="margin-top:25px">
      <button class="btn primary" data-action="confirmPreLaunch" ${canProceed ? '' : 'disabled'}>
        Launch ${G.productName}!
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

  G._pendingConfetti = 'launch';
  return `<div class="screen">
    <div class="narrative">
      <div class="event-title">🚀 ${G.productName} is ready to launch!</div>
      <img src="${getProductImage()}" alt="${G.productName}" class="product-icon product-icon-md" style="margin:10px auto">
      <p><strong>${G.playerName}</strong>, ${G.title}, launching <strong>${G.productName}</strong> — a ${getPositioning().name.toLowerCase()} ${p.name.toLowerCase()} play.</p>
      <p style="margin-top:10px"><strong>The game:</strong> 12 rounds. Each round: a crisis or opportunity hits, you choose how to respond, then set your monthly budget. Grow revenue, protect brand equity, and keep the CEO happy — or get replaced. Earn promotions along the way. Make CMO by year's end to win.</p>
    </div>

    <div class="card">
      <h3>📋 Launch Summary</h3>
      <p><strong>Product:</strong> ${p.icon} ${G.productName} (${p.name})<br>
      <strong>Positioning:</strong> ${getPositioning().icon} ${getPositioning().name}<br>
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
      <button class="btn primary" data-action="beginJourney">🚀 Launch Campaign</button>
      <button class="btn" data-action="backToPreLaunch">← Back</button>
    </div>
  </div>`;
}


function renderConflict() {
  const conflictIdx = G.turn - 2; // turns 2-11 map to conflicts 0-9
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

  const conflictImg = getConflictImage(conflict.id);
  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">Month ${G.turn} of 12</div>
    <div class="narrative">
      <div class="event-title">${conflict.title}</div>
      ${conflictImg ? `<img src="${conflictImg}" alt="" class="product-icon product-icon-md" style="float:right;margin:0 0 10px 15px">` : ''}
      <p>${text}</p>
    </div>
    <div class="section-sub" style="margin-top:15px">What do you do?</div>
    <div class="choice-grid">${choices}</div>
  </div>`;
}

function renderConflictResult() {
  const r = G.lastConflictOutcome;
  const isGood = r.effects.brandEquity >= 0 && r.effects.revMult >= 1 && r.effects.ceoPat >= 0;
  const isBad = (r.effects.brandEquity + r.effects.ceoPat) < -5;
  const cls = r.isLucky ? 'good' : isGood ? 'good' : isBad ? 'bad' : 'neutral';
  const callbackLine = getConflictCallback(r.conflict.id, isGood || r.isLucky);

  // Trigger effects for conflict outcomes
  if (r.effects.brandEquity <= -8) {
    G._pendingConfetti = 'publicBacklash';
  } else if (r.isLucky || (r.effects.brandEquity >= 5 && r.effects.revMult >= 1.1)) {
    G._pendingConfetti = 'goodMonth';
  }

  let effectsText = [];
  if (r.effects.cost > 0) effectsText.push(`💸 Spent ${fmtFull(r.effects.cost)}`);
  if (r.effects.cost < 0) effectsText.push(`💰 Returned ${fmtFull(Math.abs(r.effects.cost))}`);
  if (r.effects.brandEquity > 0) effectsText.push(`📈 Brand Equity +${r.effects.brandEquity}`);
  if (r.effects.brandEquity < 0) effectsText.push(`📉 Brand Equity ${r.effects.brandEquity}`);
  if (r.effects.ceoPat > 0) effectsText.push(`😊 CEO Vibes +${r.effects.ceoPat}`);
  if (r.effects.ceoPat < 0) effectsText.push(`😤 CEO Vibes ${r.effects.ceoPat}`);

  const conflictResultImg = getConflictImage(r.conflict.id);
  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">Month ${G.turn} — Outcome</div>
    <div class="outcome-box ${cls}">
      ${r.isLucky ? '<div style="font-size:1.1rem;font-weight:700;margin-bottom:8px">🍀 Lucky Break!</div>' : ''}
      ${conflictResultImg ? `<img src="${conflictResultImg}" alt="" class="product-icon product-icon-sm" style="float:right;margin:0 0 8px 12px">` : ''}
      <p>${r.outcome.replace(/\{product\}/g, G.productName).replace(/\{name\}/g, G.productName).replace(/\{industry\}/g, PRODUCTS[G.product].flavor).replace(/\{month\}/g, G.turn)}</p>
      ${callbackLine ? `<div class="conflict-callback">${callbackLine}</div>` : ''}
      <div style="margin-top:12px;font-size:.85rem">${effectsText.join(' &nbsp;|&nbsp; ')}</div>
      ${r.outcome.includes('Marketing lesson: ') ? `<div class="lesson">💡 ${r.outcome.replace(/\{product\}/g, G.productName).split('Marketing lesson: ')[1]}</div>` : ''}
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
  const monthsLeft = 12 - G.turn + 1;
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
  const totalRevenue = G.monthlyRevenue.reduce((sum, r) => sum + r, 0);
  const avgMonthlyRev = totalRevenue / G.monthlyRevenue.length;
  const spent = G.startingBudget - G.budget;
  const roi = spent > 0 ? ((totalRevenue - spent) / spent * 100).toFixed(0) : 0;

  let ceoCommentary = '';
  if (totalRevenue >= 10000000) {
    ceoCommentary = 'The CEO is ecstatic! "This is exceeding all expectations. Keep up the incredible work!"';
  } else if (totalRevenue >= 5000000) {
    ceoCommentary = 'The CEO is pleased. "Solid performance. We\'re on track, but there\'s always room to grow."';
  } else if (totalRevenue >= 2000000) {
    ceoCommentary = 'The CEO is concerned. "We need to see more traction. What\'s the plan to accelerate growth?"';
  } else {
    ceoCommentary = 'The CEO is furious. "These numbers are unacceptable. We need a drastic change, or heads will roll!"';
  }

  // Initialize adjustments from current state if not set
  const adj = G._reviewAdjustments || {};
  ROLES.forEach(r => {
    if (adj[r.id] === undefined) adj[r.id] = G.team[r.id] === 'skip' ? 0 : 1.0;
  });
  G._reviewAdjustments = adj;

  // Initialize hire options for skipped roles
  if (!G._reviewHires) {
    G._reviewHires = {};
    ROLES.forEach(r => {
      if (G.team[r.id] === 'skip') G._reviewHires[r.id] = 'skip';
    });
  }
  const hires = G._reviewHires;

  const stepLabels = ['Cut team', 'Reduce', 'Keep same', 'Increase', 'Double'];
  const stepValues = [0, 0.5, 1.0, 1.5, 2.0];

  const reviewCost = calcReviewTeamCost(adj);

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
      <h3>👥 Team Adjustments</h3>
      <p style="font-size:0.85rem;color:var(--muted);margin-bottom:10px">Use the sliders to scale each role's investment for the remainder of the year.</p>
      ${ROLES.map(r => {
    const sel = G.team[r.id];
    const isSkipped = sel === 'skip';
    const hireChoice = isSkipped ? (hires[r.id] || 'skip') : null;

    let baseCost, adjCost, currentVal, sliderIdx, labelText, pctLabel, statusLabel;

    if (isSkipped) {
      if (hireChoice === 'ft') {
        baseCost = r.ftCost; adjCost = r.ftCost; statusLabel = '→ In-House';
      } else if (hireChoice === 'agency') {
        baseCost = r.agCost; adjCost = r.agCost; statusLabel = '→ Agency';
      } else {
        baseCost = 0; adjCost = 0; statusLabel = 'Skipped';
      }
    } else {
      currentVal = adj[r.id] !== undefined ? adj[r.id] : 1.0;
      sliderIdx = stepValues.indexOf(currentVal) >= 0 ? stepValues.indexOf(currentVal) : 2;
      labelText = stepLabels[sliderIdx];
      baseCost = sel === 'ft' ? r.ftCost : r.agCost;
      adjCost = Math.round(baseCost * currentVal);
      pctLabel = Math.round(currentVal * 100);
      statusLabel = sel === 'ft' ? 'In-House' : 'Agency';
    }

    return `<div class="card" style="padding:14px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div>
              <span style="font-weight:600">${r.icon} ${r.name}</span>
              <span class="text-muted" style="font-size:.8rem;margin-left:8px">${statusLabel}</span>
            </div>
            <div>
              ${isSkipped && hireChoice === 'skip' ? '' : isSkipped ? `<span style="font-size:.8rem;font-weight:600;color:var(--green)">New hire</span>` : `<span id="review-label-${r.id}" style="font-size:.8rem;font-weight:600;color:${currentVal === 0 ? 'var(--red)' : currentVal < 1 ? 'var(--amber)' : currentVal === 1 ? 'var(--text)' : 'var(--green)'}">${labelText} (${pctLabel}%)</span>`}
              <span id="review-cost-${r.id}" class="text-amber" style="font-size:.8rem;margin-left:8px">${fmt(adjCost)}/mo</span>
            </div>
          </div>
          ${isSkipped ? `
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="radio-btn skip ${hireChoice === 'skip' ? 'active' : ''}" data-action="reviewHire" data-role="${r.id}" data-type="skip" style="font-size:.75rem;padding:6px 12px">Keep Skipped</button>
            <button class="radio-btn agency ${hireChoice === 'agency' ? 'active' : ''}" data-action="reviewHire" data-role="${r.id}" data-type="agency" style="font-size:.75rem;padding:6px 12px">Hire Agency ${fmt(r.agCost)}/mo</button>
            <button class="radio-btn ${hireChoice === 'ft' ? 'active' : ''}" data-action="reviewHire" data-role="${r.id}" data-type="ft" style="font-size:.75rem;padding:6px 12px">Hire In-House ${fmt(r.ftCost)}/mo</button>
          </div>` : `
          <input type="range" class="review-slider" min="0" max="4" step="1" value="${sliderIdx}" data-action="reviewSlider" data-role="${r.id}">
          <div class="review-slider-labels">
            <span>Cut team</span><span>Reduce</span><span>Keep same</span><span>Increase</span><span>Double</span>
          </div>`}
        </div>`;
  }).join('')}
    </div>

    <div class="review-cost-summary" id="review-cost-summary">
      <div style="font-size:.85rem;color:var(--muted);margin-bottom:5px">New Monthly Team Cost</div>
      <div style="font-size:1.5rem;font-weight:700;color:var(--amber)">${fmtFull(reviewCost)}/mo</div>
      <div style="font-size:.75rem;color:var(--muted);margin-top:4px">Previously: ${fmtFull(G.teamCostPerMonth)}/mo</div>
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
  const isLaunchMonth = G.turn === 1;

  // Month 6 Special Review
  if (G.turn === 6 && !G.midYearReviewDone) {
    return renderMidYearReview();
  }

  // Show crisis narrative after firing everyone
  if (G._allFiredCrisis) {
    G._allFiredCrisis = false;
    return `<div class="screen">
      ${renderStatsBar()}
      <div class="section-title">🔥 PR Crisis: Mass Layoffs</div>
      <div class="narrative">
        <div class="event-title">🚨 "CMO Fires Entire Marketing Team"</div>
        <p>News of the mass layoffs has leaked. A former employee posted a thread that's going viral: "The CMO of ${G.productName} just gutted the entire marketing department mid-year. No plan, no transition, just cuts."</p>
        <p style="margin-top:10px">The CEO is livid. Investors are calling. Your brand reputation has taken a serious hit. The remaining months will be significantly harder without any team support.</p>
      </div>
      <div class="outcome-box bad">
        <div style="font-size:.9rem;font-weight:700;margin-bottom:6px">💥 Consequences:</div>
        <p>📉 CEO Vibes: -15<br>📉 Brand Equity: -10<br>⚠️ Revenue penalty for remaining months (0.6x-0.85x)<br>⚠️ Extra CEO vibes drain (-3/month)</p>
        <div class="lesson">💡 Marketing lesson: You can cut costs, but you can't cut your way to growth. A team IS the strategy.</div>
      </div>
      <div class="btn-group">
        <button class="btn primary" data-action="dismissCrisisNarrative">Continue →</button>
      </div>
    </div>`;
  }

  // Month 1 congruency findings
  let congruencySection = '';
  if (isLaunchMonth && G._month1Findings) {
    congruencySection = G._month1Findings.map(f => {
      const cls = f.type === 'good' ? 'good' : f.type === 'bad' ? 'bad' : 'neutral';
      const icon = f.type === 'good' ? '✅' : f.type === 'bad' ? '❌' : '📋';
      return `<div class="outcome-box ${cls}" style="margin:8px 0">
        <div style="font-size:.9rem;font-weight:700;margin-bottom:6px">${icon} ${f.title}</div>
        <p>${f.text}</p>
      </div>`;
    }).join('');
  }

  let commentary = '';
  if (isLaunchMonth) {
    if (rev > 1000000) commentary = 'Your launch is making waves. The CEO is cautiously optimistic.';
    else if (rev > 500000) commentary = 'A respectable debut. The real test starts now.';
    else if (rev > 200000) commentary = 'A quiet launch. The marketing machine needs time to warm up.';
    else commentary = 'Rough start. But hey, it\'s only month one.';
  } else if (rev > 3000000) commentary = pick(['🔥 The numbers are on fire. The CEO is practically glowing.', '📈 The CEO just forwarded your dashboard to the board. They want to "replicate this across all divisions."', '💰 Revenue printer goes brrr. The CFO just smiled — a rare sighting.']);
  else if (rev > 1000000) commentary = pick(['Not bad. The CEO stopped sending passive-aggressive DMs.', 'Solid month. Recruiter messages have decreased. Good sign.', 'Your brand is finding its groove. The momentum is building.']);
  else if (rev > 500000) commentary = pick(['Decent numbers. Not headline-worthy, but not embarrassing either.', 'The trajectory is okay. The board wants more, but when don\'t they?', 'Growth is there. Just not at the pace the CEO\'s investor deck promised.']);
  else commentary = pick(['Rough month. Rome wasn\'t built in a day. But they also had more than $5M.', 'The CEO sent you an article titled "10 Signs Your Marketing Is Failing."', 'Your mom says she\'s proud of you, which is nice but not a KPI.']);

  let bonusText = '';
  if (r.bonus > 0) {
    bonusText = `<div class="outcome-box good"><strong>🎉 Bonus!</strong> The CEO was impressed with your performance. "+${fmtFull(r.bonus)} added to your budget."(They phrased it as "investing in what's working." Don't get used to it.)</div>`;
  }

  const isLastMonth = G.turn >= 11;
  const isQuarterEnd = [3, 6, 9].includes(G.turn);
  // Only show promotion review if we haven't already done it this quarter
  const promotionDone = G._promotionResult && G._promotionResult.quarter === Math.floor(G.turn / 3);

  // Determine continue button action
  let continueAction, continueLabel;
  if (isLastMonth) {
    continueAction = 'goToHoliday';
    continueLabel = '🎄 Month 12: Holiday Season →';
  } else if (isQuarterEnd && !promotionDone) {
    continueAction = 'goToPromotionReview';
    continueLabel = '📋 Quarterly Review →';
  } else {
    continueAction = 'nextMonth';
    continueLabel = 'Continue to Month ' + (G.turn + 1) + ' →';
  }

  // Scam modifier warning for premium + cheap assets (skip if lifestyle/disruptor vibes worked)
  let scamWarning = '';
  const isCheapAssets = G.brandTier === 'diy' || G.siteTier === 'template';
  const scamPenaltyActive = isCheapAssets && (
    ['premium', 'enterprise', 'government'].includes(G.positioning) ||
    ((G.positioning === 'lifestyle' || G.positioning === 'disruptor') && !G._cheapVibesWorked)
  );
  if (scamPenaltyActive) {
    scamWarning = `<div class="outcome-box bad" style="margin:10px 0">⚠️ Your ${getPositioning().name.toLowerCase()} ${G.productName} is being sold with ${G.siteTier === 'template' ? 'a template website' : 'a DIY brand identity'}. Customers think it's a scam. Revenue and brand growth are taking a massive hit. <em style="color:var(--muted)">Max out Brand Building spend to fix this.</em></div>`;
  }
  // Value + events waste warning
  let eventsWarning = '';
  if (G.positioning === 'value' && G.allocation.events > 0) {
    eventsWarning = '<div class="outcome-box neutral" style="margin:10px 0">💸 Events spend on a value product? Your customers want a coupon, not a pop-up shop. That budget is essentially wasted.</div>';
  }

  // Milestone detection
  let milestoneText = '';
  const prevTotal = G.totalRevenue - rev;
  if (G.totalRevenue >= 50000000 && prevTotal < 50000000) {
    milestoneText = '<div class="milestone-flash">🚀 MILESTONE: $50M Total Revenue!</div>';
  } else if (G.totalRevenue >= 25000000 && prevTotal < 25000000) {
    milestoneText = '<div class="milestone-flash">🔥 MILESTONE: $25M Total Revenue!</div>';
  } else if (G.totalRevenue >= 10000000 && prevTotal < 10000000) {
    milestoneText = '<div class="milestone-flash">🎯 MILESTONE: $10M Total Revenue!</div>';
  }

  // Don't set badMonth effect if this is a quarter-end (promotion screen will follow)
  const isQuarterEndMonth = [3, 6, 9].includes(G.turn);
  const shouldShowBadMonth = rev < lastRev * 0.85 && !isLaunchMonth && !isQuarterEndMonth;
  G._pendingConfetti = growth > 50 ? 'recordSmash' : rev > lastRev ? 'goodMonth' : shouldShowBadMonth ? 'badMonth' : null;

  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">${isLaunchMonth ? '🚀 Launch Results — Month 1' : `📊 Month ${G.turn} Results`}</div>
    ${congruencySection}
    ${milestoneText}
    ${!isLaunchMonth && growth > 50 ? '<div class="milestone-flash">💥 RECORD SMASHED!</div>' : ''}
    <div class="card">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:15px;text-align:center">
        <div>
          <div style="font-size:.75rem;color:var(--muted)">Monthly Revenue</div>
          <div class="rev-big" style="font-weight:700;color:var(--amber)">${fmtFull(rev)}</div>
          ${isLaunchMonth ? '<div class="text-amber" style="font-size:.85rem">🚀 Launch Month</div>' : `<div class="${growthColor}" style="font-size:.85rem">${rev >= lastRev ? '▲' : '▼'} ${growth}% vs last month</div>`}
        </div>
        <div>
          <div style="font-size:.75rem;color:var(--muted)">Total Revenue</div>
          <div class="rev-big" style="font-weight:700;color:var(--amber)">${fmtFull(G.totalRevenue)}</div>
          <div style="font-size:.85rem;color:var(--muted)">across ${G.monthlyRevenue.length} months</div>
        </div>
      </div>
      <div style="margin-top:15px;padding-top:12px;border-top:1px solid var(--border);display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;text-align:center;font-size:.85rem">
        <div><span class="text-muted">Month Spend:</span> <span class="text-red">${fmtFull(r.totalSpend)}</span></div>
        <div><span class="text-muted">Brand Δ:</span> <span class="${r.beChange >= 0 ? 'text-green' : 'text-red'}">${r.beChange >= 0 ? '+' : ''}${r.beChange.toFixed(1)}</span></div>
        <div><span class="text-muted">Budget left:</span> <span class="text-amber">${fmtFull(G.budget)}</span></div>
      </div>
    </div>
    ${scamWarning}${eventsWarning}
    ${bonusText}
    <div style="text-align:center;color:var(--muted);font-style:italic;margin:15px 0">${commentary}</div>
    <div class="btn-group">
      <button class="btn primary" data-action="${continueAction}">${continueLabel}</button>
    </div>
  </div>`;
}

function getPromoImage(rank) {
  const images = {
    2: 'Media/Promo Senior Director.png',
    3: 'Media/Promo VP.png',
    4: 'Media/Promo EVP.png'
  };
  return images[rank] || null;
}

function renderPromotionReview() {
  const result = G._promotionResult;
  const rankInfo = getRankTitle(G.rank);
  const isPromoted = result.promoted;
  const promoImg = isPromoted ? getPromoImage(G.rank) : null;

  let nextAction = 'continueAfterPromotion';
  let nextLabel = 'Continue →';

  // Clear any previous negative effect and set promotion if earned
  _lastEffect = null; // Reset so promotion always shows
  G._pendingConfetti = isPromoted ? 'promotion' : null;

  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">📋 Quarterly Performance Review — Q${result.quarter}</div>
    ${isPromoted ? `<div class="promotion-card">
      ${promoImg ? `<img src="${promoImg}" alt="Promoted to ${rankInfo.title}" style="max-width:400px;margin:0 auto 15px;display:block;border-radius:12px">` : `<div class="rank-badge">${rankInfo.icon}</div>`}
      <div class="pixel" style="font-size:.85rem;color:var(--green);margin-bottom:10px">PROMOTED</div>
      <div style="font-size:1.1rem;font-weight:600">${rankInfo.title}</div>
      <p style="margin-top:12px;color:var(--muted)">${result.message}</p>
      ${result.skipped ? '<p style="margin-top:8px;color:var(--amber);font-weight:600">⚡ You skipped a rank due to exceptional performance!</p>' : ''}
    </div>` : `<div class="narrative">
      <div class="event-title">📊 No Promotion</div>
      <p>${result.message}</p>
      <p style="margin-top:10px;color:var(--muted)">Current title: <strong>${rankInfo.icon} ${rankInfo.title}</strong></p>
    </div>`}
    <div class="card" style="margin-top:15px">
      <h3>📈 Career Ladder</h3>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center">
        ${RANKS.map(r => `<div style="padding:8px 12px;border-radius:8px;font-size:.8rem;border:1px solid ${r.rank === G.rank ? 'var(--green)' : r.rank < G.rank ? 'var(--border)' : 'var(--border)'};background:${r.rank === G.rank ? 'rgba(0,255,65,.15)' : r.rank < G.rank ? 'rgba(255,255,255,.05)' : 'transparent'};color:${r.rank === G.rank ? 'var(--green)' : r.rank < G.rank ? 'var(--muted)' : 'var(--border)'}">${r.icon} ${r.short}${r.rank < G.rank ? ' ✓' : ''}</div>`).join('')}
      </div>
    </div>
    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="${nextAction}">${nextLabel}</button>
    </div>
  </div>`;
}

function renderHoliday() {
  const brandMult = (1.3 + (G.brandEquity / 100) * 1.2).toFixed(1);

  let holidayTotal = 0;
  G.holidayTactics.forEach(i => { holidayTotal += HOLIDAY_EVENT.strategies[i].cost; });
  const canAfford = (idx) => G.holidayTactics.includes(idx) || (G.budget - holidayTotal) >= HOLIDAY_EVENT.strategies[idx].cost;

  const choices = HOLIDAY_EVENT.strategies.map((s, i) => {
    const selected = G.holidayTactics.includes(i);
    const affordable = canAfford(i);
    return `<div class="launch-option ${selected ? 'checked' : ''} ${!affordable && !selected ? 'disabled' : ''}" data-action="toggleHoliday" data-value="${i}" ${!affordable && !selected ? 'style="opacity:.4;pointer-events:none"' : ''}>
      <div class="checkbox">${selected ? '✓' : ''}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.9rem">${s.icon} ${s.name} <span class="text-amber">${fmtFull(s.cost)}</span></div>
        <div style="font-size:.75rem;color:var(--muted)">${s.desc}</div>
      </div>
    </div>`;
  }).join('');

  const budgetAfter = G.budget - holidayTotal;

  return `<div class="screen">
    ${renderStatsBar()}
    <div class="narrative">
      <div class="event-title">${HOLIDAY_EVENT.title}</div>
      <img src="${getProductImage()}" alt="${G.productName}" class="product-icon product-icon-md" style="float:right;margin:0 0 10px 15px">
      <p>${HOLIDAY_EVENT.text}</p>
      <p style="margin-top:10px">Your brand equity of <strong class="text-green">${Math.round(G.brandEquity)}</strong> gives you a holiday multiplier of <strong class="text-amber">${brandMult}x</strong>. ${G.brandEquity >= 60 ? 'All those brand investments are about to pay off BIG.' : G.brandEquity >= 30 ? 'A decent multiplier. Those brand investments helped.' : 'Ouch. Low brand equity means a weak holiday showing. Should\'ve invested in brand earlier.'}</p>
    </div>
    <div class="section-sub">Select your holiday tactics <span style="color:var(--muted)">(select multiple, or skip them all)</span>:</div>
    ${choices}
    <div class="card" style="margin-top:15px;text-align:center">
      <div style="font-size:.85rem;color:var(--muted)">Holiday spend: <strong class="text-amber">${fmtFull(holidayTotal)}</strong> | Budget after: <strong class="${budgetAfter < 0 ? 'text-red' : 'text-amber'}">${fmtFull(budgetAfter)}</strong></div>
    </div>
    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="confirmHoliday">🎄 Launch Holiday Push</button>
    </div>
  </div>`;
}

function renderHolidayAllocation() {
  const a = G.allocation;
  const allocTotal = a.brand + a.performance + a.pr + a.events;
  const remaining = G.budget;
  const suggested = Math.round(remaining / 1); // last month

  const presetBtns = Object.entries(PRESETS).map(([key, p]) =>
    `<button class="btn" data-action="applyPreset" data-value="${key}" style="font-size:.75rem;padding:8px 12px">${p.name}</button>`
  ).join('');

  const allocRows = ALLOC_CATEGORIES.map(cat => {
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

  // Holiday multiplier display
  const brandMult = (1.3 + (G.brandEquity / 100) * 1.2).toFixed(1);

  // Holiday tactics
  let holidayTotal = 0;
  G.holidayTactics.forEach(i => { holidayTotal += HOLIDAY_EVENT.strategies[i].cost; });
  const totalWithTeamAndHoliday = allocTotal + G.teamCostPerMonth + holidayTotal;
  const budgetAfter = G.budget - totalWithTeamAndHoliday;
  const canAfford = (idx) => G.holidayTactics.includes(idx) || (G.budget - allocTotal - G.teamCostPerMonth - holidayTotal) >= HOLIDAY_EVENT.strategies[idx].cost;

  const choices = HOLIDAY_EVENT.strategies.map((s, i) => {
    const selected = G.holidayTactics.includes(i);
    const affordable = canAfford(i);
    return `<div class="launch-option ${selected ? 'checked' : ''} ${!affordable && !selected ? 'disabled' : ''}" data-action="toggleHoliday" data-value="${i}" ${!affordable && !selected ? 'style="opacity:.4;pointer-events:none"' : ''}>
      <div class="checkbox">${selected ? '✓' : ''}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.9rem">${s.icon} ${s.name} <span class="text-amber">${fmtFull(s.cost)}</span></div>
        <div style="font-size:.75rem;color:var(--muted)">${s.desc}</div>
      </div>
    </div>`;
  }).join('');

  return `<div class="screen">
    ${renderStatsBar()}
    <div class="section-title">Month 12 — Holiday Season: The Final Push</div>
    <div class="narrative">
      <div class="event-title">${HOLIDAY_EVENT.title}</div>
      <img src="${getProductImage()}" alt="${G.productName}" class="product-icon product-icon-md" style="float:right;margin:0 0 10px 15px">
      <p>${HOLIDAY_EVENT.text}</p>
      <p style="margin-top:10px">Your brand equity of <strong class="text-green">${Math.round(G.brandEquity)}</strong> gives you a holiday multiplier of <strong class="text-amber">${brandMult}x</strong>. ${G.brandEquity >= 60 ? 'All those brand investments are about to pay off BIG.' : G.brandEquity >= 30 ? 'A decent multiplier. Those brand investments helped.' : 'Ouch. Low brand equity means a weak holiday showing. Should\'ve invested in brand earlier.'}</p>
    </div>

    <h3 style="margin-top:20px;margin-bottom:8px">📊 Monthly Budget Allocation</h3>
    <div class="section-sub" style="margin-top:0">
      Team cost: ${fmt(G.teamCostPerMonth)}/mo (fixed) | Marketing spend: <strong id="holiday-marketing-spend" class="text-amber">${fmt(allocTotal)}</strong>
    </div>
    <div class="btn-group" style="justify-content:flex-start;margin:10px 0">${presetBtns}</div>
    ${allocRows}

    <h3 style="margin-top:25px;margin-bottom:8px">🎄 Holiday Tactics <span style="font-weight:400;font-size:.8rem;color:var(--muted)">(select multiple, or skip them all)</span></h3>
    ${choices}

    <div class="card" style="margin-top:20px;text-align:center">
      <h3>💰 Total Month 12 Spend</h3>
      <div style="display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:10px;font-size:.85rem;text-align:left">
        <div><span class="text-muted">Marketing allocation:</span></div><div id="holiday-alloc-total" class="text-amber" style="text-align:right">${fmtFull(allocTotal)}</div>
        <div><span class="text-muted">Team cost:</span></div><div class="text-amber" style="text-align:right">${fmtFull(G.teamCostPerMonth)}</div>
        <div><span class="text-muted">Holiday tactics:</span></div><div id="holiday-tactic-total" class="text-amber" style="text-align:right">${fmtFull(holidayTotal)}</div>
        <div style="border-top:1px solid var(--border);padding-top:8px"><strong>Total:</strong></div><div id="holiday-grand-total" style="border-top:1px solid var(--border);padding-top:8px;text-align:right"><strong class="${budgetAfter < 0 ? 'text-red' : 'text-amber'}">${fmtFull(totalWithTeamAndHoliday)}</strong></div>
      </div>
      <div id="holiday-budget-after" style="margin-top:10px;font-size:.85rem;color:var(--muted)">Budget after: <strong class="${budgetAfter < 0 ? 'text-red' : 'text-amber'}">${fmtFull(budgetAfter)}</strong></div>
    </div>

    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="confirmHolidayAllocation">🎄 Lock In & Launch Holiday Push</button>
    </div>
  </div>`;
}

function processMonth12Combined(tacticIndices) {
  const alloc = G.allocation;
  const totalAllocSpend = alloc.brand + alloc.performance + alloc.pr + alloc.events + G.teamCostPerMonth;

  // 1. Apply allocation effects (brand momentum)
  G.brandMomentum += (alloc.brand / 30000) * 0.04;
  G.brandMomentum *= 1.12;
  G.brandMomentum = clamp(G.brandMomentum, 0, 5);

  // 2. Deduct allocation + team cost
  G.budget -= totalAllocSpend;

  // 3. Update brand equity from allocation
  const beChange = calcBrandEquityChange(alloc);
  G.brandEquity = clamp(G.brandEquity + beChange, 0, 100);

  // 4. CEO patience updates (drain + soft cap based on revenue pacing)
  if (G.monthlyRevenue.length >= 1) {
    const annualized = (G.totalRevenue / G.monthlyRevenue.length) * 12;
    if (annualized < 15000000) G.ceoPat = clamp(G.ceoPat - 8, 0, 100);
    else if (annualized < 25000000) G.ceoPat = clamp(G.ceoPat - 5, 0, 100);
    else if (annualized < 40000000) G.ceoPat = clamp(G.ceoPat - 2, 0, 100);

    let ceoMax = 100;
    if (annualized < 15000000) ceoMax = 50;
    else if (annualized < 25000000) ceoMax = 70;
    else if (annualized < 40000000) ceoMax = 85;
    G.ceoPat = Math.min(G.ceoPat, ceoMax);
  }
  if (G.allFiredPenalty) {
    G.ceoPat = clamp(G.ceoPat - 3, 0, 100);
  }

  // 5. Holiday tactics: deduct costs
  const strats = tacticIndices.map(i => HOLIDAY_EVENT.strategies[i]);
  let totalTacticCost = 0;
  let totalBrandMult = 0;
  let totalPerfMult = 0;
  strats.forEach(s => {
    totalTacticCost += s.cost;
    totalBrandMult += s.brandMult;
    totalPerfMult += s.perfMult;
  });
  G.budget -= totalTacticCost;

  // 6. Calculate base revenue via calcMonthlyRevenue(12)
  let baseRev = calcMonthlyRevenue(12);
  if (G.allFiredPenalty) {
    baseRev = Math.round(baseRev * rand(0.6, 0.85));
  }

  // 7. Apply holiday multiplier
  const baseHolidayMult = 1.3;
  const brandBonus = (G.brandEquity / 100) * 1.2;
  const holidayMult = baseHolidayMult + brandBonus;

  const avgBrand = strats.length > 0 ? totalBrandMult / strats.length : 0;
  const avgPerf = strats.length > 0 ? totalPerfMult / strats.length : 0;
  const countBonus = 1 + (strats.length - 1) * 0.15;
  const effectiveMult = holidayMult * (0.5 + avgBrand * 0.3 + avgPerf * 0.2) * Math.min(countBonus, 1.6);

  const holidayRev = Math.round(baseRev * effectiveMult);

  // 8. Push combined revenue
  G.monthlyRevenue.push(holidayRev);
  G.totalRevenue += holidayRev;

  // CEO patience from revenue trend
  if (G.monthlyRevenue.length >= 2) {
    const prev = G.monthlyRevenue[G.monthlyRevenue.length - 2];
    if (holidayRev > prev * 1.1) G.ceoPat = clamp(G.ceoPat + 5, 0, 100);
    else if (holidayRev < prev * 0.85) G.ceoPat = clamp(G.ceoPat - 8, 0, 100);
  }

  // 9. Check game over conditions
  if (G.budget < 0) {
    G.gameOver = true;
    G.gameOverReason = 'You ran out of money during the holiday push! The CFO cut up your corporate card in front of the whole team.';
  } else if (G.ceoPat <= 0) {
    G.gameOver = true;
    G.gameOverReason = 'The CEO\'s vibes hit zero during the holiday season. "I\'ve seen better ROI from a lemonade stand," were their last words.';
  }

  const stratNames = strats.map(s => s.icon + ' ' + s.name);
  const totalCost = totalAllocSpend + totalTacticCost;

  saveGame();

  return { holidayRev, holidayMult: effectiveMult, strategies: strats, stratNames, totalCost };
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
      <div style="font-size:.85rem;color:var(--muted);margin-top:5px">Tactics: ${r.stratNames.length > 0 ? r.stratNames.join(' + ') : 'None'}</div>
      <div style="font-size:.8rem;color:var(--muted);margin-top:3px">Spent: ${fmtFull(r.totalCost)}</div>
    </div>
    <div class="narrative" style="text-align:center">
      ${r.holidayRev > 5000000 ? '🎉 MASSIVE holiday season! Your brand equity paid off in spades. The CFO is buying YOU a gift this year.' :
      r.holidayRev > 2000000 ? '🎄 Solid holiday performance. Not record-breaking, but your year-end bonus is looking healthy.' :
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

  // Q4 Final Determination — 5-tier rank-based endings
  let result, resultEmoji, resultText;

  if (totalRev >= 65000000) {
    // Moonshot: any rank → CMO with god-tier revenue
    G.rank = 5;
    G.title = 'CMO';
    result = 'MOONSHOT TO CMO';
    resultEmoji = '🚀';
    resultText = 'The CEO had no choice but to elevate you to the C-Suite. ' + G.productName + ' is a juggernaut.';
  } else if (G.rank >= 4 && totalRev >= 55000000 && brandEq >= 55) {
    // Safe Climb: EVP + $55M + strong brand = CMO
    G.rank = 5;
    G.title = 'CMO';
    result = 'PROMOTED TO CMO';
    resultEmoji = '👑';
    resultText = 'You climbed the ladder, built the brand, and delivered the numbers. The corner office is yours. ' + G.productName + ' is a case study in marketing excellence.';
  } else if (G.rank >= 4) {
    // EVP but didn't hit CMO threshold
    G.title = getRankTitle(G.rank).title;
    result = 'EVP OF MARKETING';
    resultEmoji = '🏆';
    resultText = 'So close to the top. You\'re a powerhouse executive and ' + G.productName + ' had a strong year. But the CMO chair needs $55M and a world-class brand to unlock.';
  } else if (G.rank >= 3) {
    G.title = getRankTitle(G.rank).title;
    result = 'VP OF MARKETING';
    resultEmoji = '⭐';
    resultText = 'You earned your VP stripes. ' + G.productName + ' showed growth, but the board expected more. The C-Suite remains a dream.';
  } else if (G.rank >= 2) {
    G.title = getRankTitle(G.rank).title;
    result = 'SENIOR DIRECTOR';
    resultEmoji = '📊';
    resultText = 'You showed promise but couldn\'t break through. Middle management purgatory awaits. ' + G.productName + ' needed a stronger strategy.';
  } else if (totalRev >= 25000000) {
    G.rank = 2;
    G.title = getRankTitle(G.rank).title;
    result = 'SENIOR DIRECTOR';
    resultEmoji = '📊';
    resultText = '$' + (totalRev / 1000000).toFixed(0) + 'M in revenue spoke just loudly enough. The board promoted you to Senior Director — but don\'t pop the champagne. You\'re in middle management purgatory now. Close enough to see the C-Suite, far enough to never reach it. ' + G.productName + ' needed a stronger year to break through.';
  } else if (totalRev >= 20000000) {
    G.title = getRankTitle(1).title;
    result = 'SURVIVED';
    resultEmoji = '😐';
    resultText = 'You survived, but you didn\'t thrive. ' + G.productName + ' hit $' + (totalRev / 1000000).toFixed(0) + 'M — enough to keep your job, not enough to impress anyone. No promotion, no fanfare. Just another year in the same chair. The board isn\'t angry. They\'re just... not excited.';
  } else {
    G.title = '#OpenToWork';
    result = '#OPENTOWORK';
    resultEmoji = '💀';
    resultText = 'Under $20M in revenue and no promotions. The board lost confidence. ' + G.productName + ' underperformed and so did you. HR has the box ready for your desk.';
  }

  const entry = saveScore();

  G._pendingChart = {
    labels: Array.from({length: G.monthlyRevenue.length}, (_, i) => 'Month ' + (i + 1)),
    data: [...G.monthlyRevenue]
  };
  G._pendingConfetti = G.rank >= 3 ? 'win' : null;

  return `<div class="screen">
    <div class="final-score">
      ${G.rank >= 5 ? '<img class="end-screen-img" src="Media/Congratulations Youre CMO.png" alt="Congratulations, You\'re CMO!">' : ''}
      ${result === '#OPENTOWORK' ? '<img class="end-screen-img" src="Media/RIP Your Job.png" alt="RIP Your Job">' : ''}
      <div style="font-size:4rem">${resultEmoji}</div>
      <div class="pixel" style="color:${G.rank >= 5 ? 'var(--green)' : G.rank >= 3 ? 'var(--amber)' : result === '#OPENTOWORK' ? 'var(--red)' : 'var(--amber)'};font-size:1.2rem;margin:10px 0">${result}</div>
      <div class="result-text">${resultText}</div>
      <div class="revenue-row">
        <img src="${getProductImage()}" alt="${G.productName}" class="product-icon product-icon-md" style="margin:0">
        <div>
          <div class="big-number">${fmtFull(totalRev)}</div>
          <div class="revenue-label">Total Revenue in 12 Months</div>
        </div>
      </div>
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
    <div class="social-cta">
      📸 Screenshot your results and share on social media!<br>
      <span style="color:var(--green);font-weight:600">#CMOGame</span>
    </div>

    ${!G._submittedToLeaderboard ? `<div class="card" style="text-align:center;margin:15px 0">
      <p style="margin-bottom:10px">Submit your score to the global leaderboard?</p>
      <p style="font-size:.75rem;color:var(--muted);margin-bottom:12px">Your name and score will be publicly visible.</p>
      <button class="btn gold" data-action="submitLeaderboard" id="submitBtn">🏆 Submit to Hall of Fame</button>
    </div>` : `<div class="card" style="text-align:center;margin:15px 0;border-color:var(--green)">
      <p style="color:var(--green)">✓ Score submitted to leaderboard!</p>
    </div>`}

    <div class="btn-group">
      <button class="btn primary" data-action="copyShare">📋 Copy Score</button>
      <button class="btn" data-action="showLeaderboard">🏆 Leaderboard</button>
      <button class="btn" data-action="playAgain">🔄 Play Again</button>
    </div>
  </div>`;
}

function renderGameOver() {
  G.title = '#OpenToWork';
  logEvent('game_over', { month: G.turn, revenue: G.totalRevenue, product: G.product });
  saveScore();
  return `<div class="screen game-over">
    <img class="end-screen-img" src="Media/RIP Your Job.png" alt="RIP Your Job">
    <img src="${getProductImage()}" alt="${G.productName}" class="product-icon product-icon-md" style="margin:10px auto">
    <h1 class="pixel" style="color:var(--red)">#OPENTOWORK</h1>
    <div style="font-size:1.5rem;margin:15px 0">Your marketing career has hit a speed bump.</div>
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
    <div class="social-cta" style="max-width:500px;margin:10px auto">
      📸 Screenshot your results and share on social media!<br>
      <span style="color:var(--green);font-weight:600">#CMOGame</span>
    </div>
    ${!G._submittedToLeaderboard ? `<div class="card" style="text-align:center;max-width:500px;margin:15px auto">
      <p style="margin-bottom:10px">Submit your score to the global leaderboard?</p>
      <p style="font-size:.75rem;color:var(--muted);margin-bottom:12px">Your name and score will be publicly visible.</p>
      <button class="btn gold" data-action="submitLeaderboard" id="submitBtn">🏆 Submit to Hall of Fame</button>
    </div>` : `<div class="card" style="text-align:center;max-width:500px;margin:15px auto;border-color:var(--green)">
      <p style="color:var(--green)">✓ Score submitted to leaderboard!</p>
    </div>`}
    <div class="btn-group">
      <button class="btn primary" data-action="copyShare">📋 Copy Score</button>
      <button class="btn" data-action="showLeaderboard">🏆 Leaderboard</button>
      <button class="btn" data-action="playAgain">🔄 Try Again</button>
    </div>
  </div>`;
}

function renderLeaderboard() {
  const lb = getLeaderboard();
  const rows = lb.length > 0 ? lb.map((e, i) => {
    const dateStr = e.date ? new Date(e.date).toLocaleDateString() : '';
    return `<tr>
      <td>${i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
      <td>${e.name}</td>
      <td>${e.product}</td>
      <td class="text-amber">${fmtFull(e.revenue)}</td>
      <td>${e.brandEquity}/100</td>
      <td>${e.title}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--muted)">No scores yet. Be the first!</td></tr>';

  return `<div class="screen">
    <div class="section-title">🏆 Hall of Fame</div>
    <div class="section-sub">Global leaderboard of marketing legends.</div>
    <div class="leaderboard-scroll">
      <table class="leaderboard-table">
        <thead><tr><th>#</th><th>Name</th><th>Product</th><th>Revenue</th><th>Brand</th><th>Title</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="btn-group" style="margin-top:20px">
      <button class="btn primary" data-action="playAgain">🔄 Play ${G.gameOver || G.turn >= 12 ? 'Again' : ''}</button>
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
      if (containsProfanity(name)) { document.getElementById('playerName').value = ''; document.getElementById('playerName').placeholder = getProfanityResponse(); document.getElementById('playerName').style.borderColor = 'var(--red)'; return; }
      G.playerName = name;
      G.screen = 'productSelect';
      break;
    }
    case 'selectProduct':
      G.product = value;
      G.positioning = null; // reset positioning when changing product
      G.screen = 'positioning';
      break;
    case 'confirmName': {
      const name = document.getElementById('productName')?.value.trim();
      if (!name) { document.getElementById('productName').style.borderColor = 'var(--red)'; return; }
      if (containsProfanity(name)) { document.getElementById('productName').value = ''; document.getElementById('productName').placeholder = getProfanityResponse(); document.getElementById('productName').style.borderColor = 'var(--red)'; return; }
      G.productName = name;
      G.screen = 'teamBuilding';
      break;
    }
    case 'setPositioning':
      G.positioning = el.dataset.id;
      G.screen = 'positioning';
      break;
    case 'goToNaming':
      if (!G.positioning) return;
      G._pendingConfetti = 'productSelect';
      G.screen = 'naming';
      break;
    case 'backToPositioning':
      G.screen = 'positioning';
      break;
    case 'backToProductSelect':
      G.positioning = null;
      G.screen = 'productSelect';
      break;
    case 'backToTitle':
      G.product = null;
      G.positioning = null;
      G.screen = 'title';
      break;
    case 'backToNaming':
      G.screen = 'naming';
      break;
    case 'backToPreLaunch':
      // Restore budget and brand equity from before confirmPreLaunch
      if (G._preConfirmBudget !== undefined) {
        G.budget = G._preConfirmBudget;
        G.brandEquity = G._preConfirmBrandEquity;
      }
      G._launchRevBoost = 0;
      G.screen = 'preLaunch';
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
    case 'toggleHelp':
      G._helpOpen = G._helpOpen === value ? null : value;
      render();
      return;
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
    case 'reviewHire': {
      if (!G._reviewHires) G._reviewHires = {};
      G._reviewHires[el.dataset.role] = el.dataset.type;
      render();
      return;
    }
    case 'continueAfterMidYearReview': {
      G.midYearReviewDone = true;
      // Apply review adjustments
      if (G._reviewAdjustments) {
        G.midYearAdjustments = { ...G._reviewAdjustments };
        delete G._reviewAdjustments;
      }
      // Apply new hires for previously skipped roles
      if (G._reviewHires) {
        ROLES.forEach(r => {
          if (G._reviewHires[r.id] && G._reviewHires[r.id] !== 'skip') {
            G.team[r.id] = G._reviewHires[r.id];
            if (G.midYearAdjustments) G.midYearAdjustments[r.id] = 1.0;
          }
        });
        delete G._reviewHires;
      }
      calcTeamCost();

      // Check if all roles are cut or were skipped (fire-everyone penalty)
      const allCutOrSkipped = ROLES.every(r => {
        if (G.team[r.id] === 'skip') return true;
        return (G.midYearAdjustments[r.id] || 0) === 0;
      });

      if (allCutOrSkipped) {
        G.allFiredPenalty = true;
        G.ceoPat = clamp(G.ceoPat - 15, 0, 100);
        G.brandEquity = clamp(G.brandEquity - 10, 0, 100);
        // Show crisis narrative
        G._allFiredCrisis = true;
      }

      render();
      break;
    }
    case 'dismissCrisisNarrative':
      // Just re-render the normal month results
      render();
      return;
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
      // Store snapshot for back-button support
      G._preConfirmBudget = G.budget;
      G._preConfirmBrandEquity = G.brandEquity;
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
      // Launch boost (event efficacy modifies launch event tactic)
      let launchRevBoost = 0;
      let launchBrandBoost = 0;
      const launchEventEfficacy = getEventEfficacy();
      G.launchTactics.forEach(id => {
        const t = LAUNCH_TACTICS.find(t => t.id === id);
        let rb = t.revBoost;
        let bb = t.brandBoost;
        if (id === 'event') { rb *= launchEventEfficacy; bb *= launchEventEfficacy; }
        launchRevBoost += rb;
        launchBrandBoost += bb;
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
    case 'beginJourney': {
      logEvent('game_start', { product: G.product, positioning: G.positioning });
      G.turn = 1;
      // Launch tactics ARE month 1 allocations — skip the allocation screen
      G.allocation = { brand: 0, performance: 0, pr: 0, events: 0 };
      const monthResult = processMonth();
      // Include pre-launch investment in month 1 spend so budget math adds up
      const preLaunchCost = BRAND_TIERS.find(t => t.id === G.brandTier).cost
        + SITE_TIERS.find(t => t.id === G.siteTier).cost
        + RESEARCH_TIERS.find(t => t.id === G.researchTier).cost
        + G.launchTactics.reduce((sum, id) => sum + LAUNCH_TACTICS.find(t => t.id === id).cost, 0);
      monthResult.totalSpend += preLaunchCost;
      // Evaluate strategic congruency
      const findings = evaluateMonth1Congruency();
      let totalRevMult = 1.0, totalCeoPat = 0, totalBE = 0;
      findings.forEach(f => { totalRevMult *= f.revMult; totalCeoPat += f.ceoPat; totalBE += f.brandEquity; });
      // Adjust month 1 results for congruency
      const oldRev = G.monthlyRevenue[0];
      const newRev = Math.round(oldRev * totalRevMult);
      G.monthlyRevenue[0] = newRev;
      G.totalRevenue += (newRev - oldRev);
      monthResult.rev = newRev;
      monthResult.beChange += totalBE;
      G.ceoPat = clamp(G.ceoPat + totalCeoPat, 0, 100);
      G.brandEquity = clamp(G.brandEquity + totalBE, 0, 100);
      G._monthResult = monthResult;
      G._month1Findings = findings;
      if (G.budget < 0) {
        G.gameOver = true;
        G.gameOverReason = 'You ran out of money before month one ended. The CFO is speechless.';
        G.screen = 'gameOver';
      } else if (G.ceoPat <= 0) {
        G.gameOver = true;
        G.gameOverReason = 'The CEO lost all confidence on launch day. That\'s a new record.';
        G.screen = 'gameOver';
      } else {
        G.screen = 'monthResults';
      }
      break;
    }
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
      // Preserve current screen (works for both 'allocation' and 'holidayAllocation')
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
        G.gameOverReason = 'The CEO\'s vibes hit zero. "I\'ve seen better ROI from a lemonade stand," were their last words to you before HR stepped in.';
        G.screen = 'gameOver';
      } else if (G.gameOver) {
        // Caught by processMonth (e.g. zero spend streak)
        G.screen = 'gameOver';
      } else {
        G.screen = 'monthResults';
      }
      break;
    }
    case 'goToPromotionReview': {
      const quarter = Math.floor(G.turn / 3);
      const promoResult = checkPromotion(quarter);
      G._promotionResult = promoResult;
      G.screen = 'promotionReview';
      saveGame();
      break;
    }
    case 'continueAfterPromotion':
      if (G.turn === 6 && !G.midYearReviewDone) {
        // After month 6 promotion, go to mid-year team review
        G.screen = 'monthResults'; // triggers renderMidYearReview inside renderMonthResults
      } else {
        // Continue to next month
        G.turn++;
        G.screen = 'conflict';
      }
      break;
    case 'nextMonth':
      G.turn++;
      G._promotionResult = null;
      G.screen = 'conflict';
      break;
    case 'goToHoliday':
      G.turn = 12;
      G.holidayTactics = [];
      G.screen = 'holidayAllocation';
      break;
    case 'toggleHoliday': {
      const idx = parseInt(value);
      const pos = G.holidayTactics.indexOf(idx);
      if (pos >= 0) G.holidayTactics.splice(pos, 1);
      else G.holidayTactics.push(idx);
      // Preserve current screen (works for both 'holiday' and 'holidayAllocation')
      break;
    }
    case 'confirmHoliday': {
      const result = processHoliday(G.holidayTactics);
      G._holidayResult = result;
      G.screen = 'holidayResults';
      break;
    }
    case 'confirmHolidayAllocation': {
      const result = processMonth12Combined(G.holidayTactics);
      G._holidayResult = result;
      if (G.gameOver) {
        G.screen = 'gameOver';
      } else {
        G.screen = 'holidayResults';
      }
      break;
    }
    case 'showFinalResults':
      logEvent('game_complete', { title: G.title, rank: G.rank, revenue: G.totalRevenue, product: G.product });
      G.screen = 'finalResults';
      break;
    case 'showLeaderboard':
      loadLeaderboard(() => {
        G.screen = 'leaderboard';
        render();
      });
      return;
    case 'submitLeaderboard': {
      const btn = document.getElementById('submitBtn');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Submitting...';
      }
      submitToLeaderboard((success) => {
        if (success) {
          render();
        } else {
          if (btn) {
            btn.disabled = false;
            btn.textContent = '❌ Error - Try Again';
          }
        }
      });
      return;
    }
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

    // Update holiday allocation summary if on that screen
    const allocTotalEl = document.getElementById('holiday-alloc-total');
    if (allocTotalEl) {
      const a = G.allocation;
      const allocTotal = a.brand + a.performance + a.pr + a.events;
      let holidayTotal = 0;
      G.holidayTactics.forEach(i => { holidayTotal += HOLIDAY_EVENT.strategies[i].cost; });
      const totalSpend = allocTotal + G.teamCostPerMonth + holidayTotal;
      const budgetAfter = G.budget - totalSpend;
      const color = budgetAfter < 0 ? 'text-red' : 'text-amber';

      allocTotalEl.textContent = fmtFull(allocTotal);
      const spendEl = document.getElementById('holiday-marketing-spend');
      if (spendEl) spendEl.textContent = fmt(allocTotal);
      const grandEl = document.getElementById('holiday-grand-total');
      if (grandEl) grandEl.innerHTML = `<strong class="${color}">${fmtFull(totalSpend)}</strong>`;
      const afterEl = document.getElementById('holiday-budget-after');
      if (afterEl) afterEl.innerHTML = `Budget after: <strong class="${color}">${fmtFull(budgetAfter)}</strong>`;

      // Re-evaluate holiday tactic affordability after slider change
      const tacticEls = document.querySelectorAll('[data-action="toggleHoliday"]');
      tacticEls.forEach(el => {
        const idx = parseInt(el.dataset.value);
        const selected = G.holidayTactics.includes(idx);
        const affordable = selected || (G.budget - allocTotal - G.teamCostPerMonth - holidayTotal) >= HOLIDAY_EVENT.strategies[idx].cost;
        if (!affordable && !selected) {
          el.classList.add('disabled');
          el.style.opacity = '.4';
          el.style.pointerEvents = 'none';
        } else {
          el.classList.remove('disabled');
          el.style.opacity = '';
          el.style.pointerEvents = '';
        }
      });
    }
  }

  if (e.target.dataset.action === 'reviewSlider') {
    const role = e.target.dataset.role;
    const stepValues = [0, 0.5, 1.0, 1.5, 2.0];
    const stepLabels = ['Cut team', 'Reduce', 'Keep same', 'Increase', 'Double'];
    const idx = parseInt(e.target.value);
    const scale = stepValues[idx];

    if (!G._reviewAdjustments) G._reviewAdjustments = {};
    G._reviewAdjustments[role] = scale;

    // Update label
    const labelEl = document.getElementById('review-label-' + role);
    if (labelEl) {
      const pct = Math.round(scale * 100);
      labelEl.textContent = stepLabels[idx] + ' (' + pct + '%)';
      labelEl.style.color = scale === 0 ? 'var(--red)' : scale < 1 ? 'var(--amber)' : scale === 1 ? 'var(--text)' : 'var(--green)';
    }

    // Update per-role cost
    const r = ROLES.find(r => r.id === role);
    if (r) {
      const baseCost = G.team[r.id] === 'ft' ? r.ftCost : G.team[r.id] === 'agency' ? r.agCost : 0;
      const adjCost = Math.round(baseCost * scale);
      const costEl = document.getElementById('review-cost-' + role);
      if (costEl) costEl.textContent = fmt(adjCost) + '/mo';
    }

    // Update total cost summary
    const totalCost = calcReviewTeamCost(G._reviewAdjustments);
    const summaryEl = document.getElementById('review-cost-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `<div style="font-size:.85rem;color:var(--muted);margin-bottom:5px">New Monthly Team Cost</div>
        <div style="font-size:1.5rem;font-weight:700;color:var(--amber)">${fmtFull(totalCost)}/mo</div>
        <div style="font-size:.75rem;color:var(--muted);margin-top:4px">Previously: ${fmtFull(G.teamCostPerMonth)}/mo</div>`;
    }
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

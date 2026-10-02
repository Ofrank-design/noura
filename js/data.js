/* ==========================================================================
   NOURA: practice content
   Team, services, programs, journal articles, client stories and FAQs.
   Images are referenced by key in js/imageRegistry.js.
   ========================================================================== */

const PRACTICE = {
  name: "NOURA",
  tagline: "Nutrition, made personal.",
  email: "hello@noura.example",
  phone: "+1 310 555 0148",
  address: "14 Cypress Lane, Suite 2",
  city: "Santa Monica, California",
  hours: "Monday to Friday, 8:00 AM to 6:00 PM",
};

const TEAM = [
  {
    id: "amara", practitioner: true,
    name: "Dr. Amara Vale, RD", short: "Dr. Amara Vale",
    role: "Founder and Lead Dietitian",
    title: "Registered Dietitian and Nutrition Specialist",
    media: "dietitian.portrait",
    focus: ["Women's nutrition", "Metabolic health", "Digestive health", "Sustainable weight management", "Performance nutrition", "Behavioral nutrition"],
    bio: "Amara trained in clinical nutrition and spent the first part of her career in hospital and outpatient settings. She noticed that people rarely struggled to know what a balanced meal looks like. They struggled with Tuesday at 6:30 PM, a hotel breakfast, or a family dinner with three different preferences. NOURA is built around that gap.",
  },
  {
    id: "leila", practitioner: true,
    name: "Leila Haddad, RD", short: "Leila Haddad",
    role: "Dietitian",
    title: "Registered Dietitian",
    media: "dietitian.leila",
    focus: ["Digestive health", "Women's nutrition", "Family nutrition"],
    bio: "Leila works with clients who have digestive concerns and with women through life stages from pregnancy planning to menopause. She is known for practical, unhurried conversations that leave people feeling capable rather than restricted.",
  },
  {
    id: "daniel", practitioner: true,
    name: "Daniel Okafor, RD", short: "Daniel Okafor",
    role: "Dietitian",
    title: "Registered Dietitian",
    media: "dietitian.daniel",
    focus: ["Performance nutrition", "Metabolic health", "Sustainable weight management"],
    bio: "Daniel supports recreational and competitive athletes as well as busy professionals who want steadier energy. He has a particular interest in how training, sleep and meal timing work together across a full week.",
  },
  {
    id: "sofia", practitioner: false,
    name: "Sofia Marin", short: "Sofia Marin",
    role: "Client Care Director",
    title: "Client Care Director",
    media: "dietitian.sofia",
    focus: ["Scheduling", "Onboarding", "Client support"],
    bio: "Sofia looks after the client experience from the first enquiry to the final review. She keeps appointments, documents and reminders in order so that clients and dietitians can concentrate on the nutrition.",
  },
];

const SERVICES = [
  {
    id: "initial", name: "Initial Nutrition Consultation", minutes: 60, price: 220, kind: "session",
    blurb: "A full conversation about your health history, eating patterns, goals and daily life. You leave with clear priorities and a first set of practical steps.",
    includes: ["Review of your assessment and health history", "Discussion of goals, routines and preferences", "Three priorities to start with", "Written summary within two working days"],
  },
  {
    id: "followup", name: "Follow Up Consultation", minutes: 45, price: 140, kind: "session",
    blurb: "A focused session to review how things are going, adjust your plan and work through whatever has been difficult.",
    includes: ["Review of your food log and weekly check ins", "Plan adjustments and new recipes", "Practical solutions for the barriers you are facing", "Updated plan in your client portal"],
  },
  {
    id: "comprehensive", name: "Comprehensive Nutrition Assessment", minutes: 75, price: 320, kind: "session",
    blurb: "A deeper review for people with complex goals or several health considerations. It includes a detailed diet history and a written plan you can take away.",
    includes: ["Detailed diet and lifestyle history", "Review of any recent lab results you choose to share", "Coordination with your physician where helpful", "Written nutrition plan and resource pack"],
  },
  {
    id: "private", name: "Private Nutrition Program", minutes: 0, price: 0, kind: "application",
    blurb: "Close one on one dietetic care over 12 to 24 weeks, with frequent check ins and direct access to your dietitian. Places are limited and begin with an application.",
    includes: ["Personalized nutrition strategy", "Frequent consultations and weekly reviews", "Direct messaging with your dietitian", "Priority scheduling and a dedicated plan"],
  },
];

const PROGRAMS = [
  {
    slug: "reset", name: "Reset", weeks: "4 weeks", duration: 4, price: 690, media: "programs.reset",
    tagline: "A calm restart for the basics.",
    focus: ["Nutrition foundations", "Meal structure", "Hydration", "Food awareness"],
    overview: "Reset is for anyone who wants to settle the basics before anything more ambitious. Over four weeks you build a steady rhythm of meals, learn what a satisfying plate looks like for you, and notice how food, sleep and energy connect.",
    whoFor: "People starting out with a dietitian, returning after a break, or wanting a structured fresh start without a long commitment.",
    included: ["Initial consultation of 60 minutes", "One follow up consultation in week three", "Personalized nutrition profile and meal framework", "Client portal with food log and weekly check ins", "Recipe library and shopping lists", "Messaging with your dietitian on weekdays"],
    timeline: [
      { w: "Week 1", t: "Understand", d: "Your consultation, your profile and a first look at your current patterns." },
      { w: "Week 2", t: "Structure", d: "A simple meal rhythm that fits your day, with breakfast and lunch anchored first." },
      { w: "Week 3", t: "Adjust", d: "Follow up session to refine what is working and solve what is not." },
      { w: "Week 4", t: "Carry on", d: "A plan for the weeks ahead and a clear view of the next step, if you want one." },
    ],
    outcomes: ["A steadier daily meal rhythm", "Clearer sense of portions and balance", "Better hydration habits", "A short list of habits to keep"],
  },
  {
    slug: "balance", name: "Balance", weeks: "8 weeks", duration: 8, price: 1290, media: "programs.balance",
    tagline: "Sustainable change, at a livable pace.",
    focus: ["Sustainable weight management", "Meal planning", "Behavior change", "Progress tracking"],
    overview: "Balance is our most popular program. It combines a personalized meal plan with practical behavior change work, so the results come from habits that still make sense after the program ends.",
    whoFor: "People who want to manage their weight or improve their eating patterns without rigid rules, and who value regular support.",
    included: ["Initial consultation of 60 minutes", "Three follow up consultations", "Personalized meal plan with weekly updates", "Shopping lists and recipe library access", "Progress dashboard and weekly check ins", "Messaging with your dietitian on weekdays"],
    timeline: [
      { w: "Weeks 1 and 2", t: "Foundations", d: "Consultation, profile and a first meal plan built around your routine." },
      { w: "Weeks 3 and 4", t: "Rhythm", d: "Follow up session, plan refinements and work on your hardest time of day." },
      { w: "Weeks 5 and 6", t: "Flexibility", d: "Eating out, travel and social occasions, with strategies you can rely on." },
      { w: "Weeks 7 and 8", t: "Independence", d: "A final review and a maintenance plan you can follow on your own." },
    ],
    outcomes: ["A meal plan you can follow without a spreadsheet", "Confidence eating out and travelling", "Habits that support steady, sustainable progress", "A maintenance plan for afterward"],
  },
  {
    slug: "metabolic", name: "Metabolic", weeks: "12 weeks", duration: 12, price: 1890, media: "programs.metabolic",
    tagline: "Personalized nutrition with a longer horizon.",
    focus: ["Personalized nutrition", "Lifestyle structure", "Progress monitoring", "Long term habits"],
    overview: "Metabolic is designed for people with health considerations such as blood sugar, cholesterol or energy concerns, who want a thorough and carefully monitored approach. It works alongside your physician and any results you choose to share.",
    whoFor: "Adults managing or wanting to support metabolic health, who would benefit from a longer program with closer monitoring.",
    included: ["Comprehensive nutrition assessment of 75 minutes", "Four follow up consultations", "Personalized nutrition plan with monitoring", "Review of lab results you choose to share", "Coordination with your physician where helpful", "Progress dashboard, weekly check ins and messaging"],
    timeline: [
      { w: "Weeks 1 to 3", t: "Assess", d: "A deep review of your history, patterns, results and goals." },
      { w: "Weeks 4 to 6", t: "Build", d: "A structured plan, with meal timing, composition and daily movement." },
      { w: "Weeks 7 to 9", t: "Monitor", d: "Close review of your logs and check ins, with adjustments as needed." },
      { w: "Weeks 10 to 12", t: "Sustain", d: "Long term habits, a maintenance plan and a follow up schedule." },
    ],
    outcomes: ["A nutrition plan shaped around your health picture", "A clear routine for meals, movement and sleep", "Regular review of the measures that matter to you", "A plan to share with your physician"],
  },
  {
    slug: "private", name: "Private", weeks: "12 to 24 weeks", duration: 24, price: 4800, media: "programs.private", application: true,
    tagline: "Close, one on one dietetic care.",
    focus: ["Close one on one dietetic care", "Personalized nutrition strategy", "Frequent check ins", "Direct practitioner support"],
    overview: "Private is a personal relationship with a dedicated dietitian. There is no template. Your strategy is built around your health, schedule, preferences and goals, and adjusted as life changes.",
    whoFor: "People with complex needs, demanding schedules or several goals at once, who want close support and quick access to their dietitian.",
    included: ["Comprehensive assessment and a written strategy", "Frequent consultations, scheduled around your calendar", "Weekly reviews of your logs and check ins", "Direct messaging with your dietitian", "Travel and event planning support", "Priority scheduling and personal resources"],
    timeline: [
      { w: "Weeks 1 to 2", t: "Discover", d: "A thorough assessment and a written strategy built around you." },
      { w: "Weeks 3 to 12", t: "Refine", d: "Frequent contact, weekly reviews and plan changes as your life moves." },
      { w: "Weeks 13 to 24", t: "Extend", d: "Optional extension for deeper work, with a steady review cycle." },
    ],
    outcomes: ["A strategy that fits your real schedule", "Direct, quick support when plans change", "Steady progress against your priorities", "Habits you can keep long after the program"],
  },
];

const JOURNAL = [
  {
    slug: "mindful-eating-without-the-pressure", category: "Behavior", date: "September 28, 2026", read: "4 min read",
    media: "journal.mindfulEating",
    title: "Mindful Eating Without the Pressure",
    excerpt: "Eating with attention can make meals more satisfying. It does not need candles, silence or a rule about chewing thirty times.",
    body: [
      "Mindful eating has a reputation for being precious: silent meals, a single raisin, a rule about chewing every mouthful thirty times. The idea underneath is much simpler. It means noticing what you are eating while you are eating it, and it tends to make meals more satisfying.",
      "Most of us eat with something else competing for our attention, such as a screen, an inbox or a conversation in the next room. When attention is elsewhere, it is easy to finish a plate without really tasting it, and then to feel oddly unsatisfied. Some small studies suggest that people who eat without distraction feel fuller after the meal and snack less later, though the effects are modest and vary a great deal from person to person.",
      "A practical way to begin is to choose one meal a day and make it a little quieter. Put the phone in another room, sit down, and take the first three bites slowly. Notice the temperature, the texture and the flavors. Then eat the rest however you like. Pause halfway and ask how hungry you still are, as a gentle question and never as a test.",
      "None of this needs to be perfect, and there is nothing mindful about feeling guilty when lunch happens at your desk. If food already feels stressful or controlling, speak with a dietitian before adding new techniques. The aim is to enjoy your meals, and a little attention is often enough.",
    ],
  },
  {
    slug: "the-difference-between-eating-less-and-eating-better", category: "Nutrition", date: "September 14, 2026", read: "4 min read",
    media: "journal.weightMyths",
    title: "The Difference Between Eating Less and Eating Better",
    excerpt: "Eating less can produce quick results. It also tends to produce tired, preoccupied people who are hungry by mid afternoon.",
    body: [
      "When people decide to change how they eat, the first instinct is usually subtraction: smaller portions, fewer carbohydrates, no snacks. Eating less can produce quick results, and it often produces tired, preoccupied people who are hungry by mid afternoon and thinking about food all evening.",
      "Eating better starts with a different question. Instead of asking what to remove, it asks what each meal needs to do. A breakfast might need to hold you until lunch. A lunch might need to keep your afternoon steady. A dinner might need to be satisfying enough that you are not back in the kitchen at 10 PM.",
      "When meals do their job, appetite tends to settle and portions often adjust without much effort. That usually means enough protein, plenty of fiber, meals spaced sensibly and enough food overall. For many clients the first change is adding something, often a proper lunch, instead of taking something away.",
      "If weight loss is your goal, the approach still matters. A plan built on satisfaction is one you can keep following long after the early motivation has faded, and that is where most results are won or lost.",
    ],
  },  {
    slug: "protein-at-breakfast-what-research-says", category: "Research", date: "August 31, 2026", read: "5 min read",
    media: "journal.proteinPower",
    title: "Protein at Breakfast: What the Research Says and What It Doesn't",
    excerpt: "The claims around protein at breakfast can run ahead of the evidence. Here is a measured summary of what we know.",
    body: [
      "Protein at breakfast has become a wellness talking point, and the claims sometimes run ahead of the evidence. Here is a measured summary.",
      "Several studies suggest that a breakfast with a moderate amount of protein can leave people feeling fuller through the morning than a very low protein, refined carbohydrate breakfast. Findings on whether this changes total daily intake or body weight over months are less consistent, and many of the trials are small or short.",
      "Protein is also worth spreading across the day to help maintain muscle, which matters more as we age. For many adults, distributing protein across meals is a sensible approach, and breakfast is the meal where it is most often missing.",
      "What the research does not support is a single magic number, or a rule that breakfast must be eaten at all. Some people do well with an early meal and others prefer to start later. The practical takeaway is modest: if you are hungry by ten, your breakfast may need more protein and fiber, and it is worth experimenting for a week or two.",
    ],
  },  {
    slug: "bloating-after-meals-questions-to-ask", category: "Digestive Health", date: "August 17, 2026", read: "5 min read",
    media: "journal.gutHealth",
    title: "Bloating After Meals: Questions Worth Asking Before You Cut Foods Out",
    excerpt: "The urge to eliminate foods quickly is understandable. It often makes eating more stressful without finding the cause.",
    body: [
      "Bloating is common and usually uncomfortable, and it has many possible causes. The urge to eliminate foods quickly is understandable, but it often makes eating more stressful without finding the cause.",
      "A better first step is to notice patterns. When does it happen? After certain meals, when eating quickly, under stress, at particular points in the menstrual cycle, or after a change in fiber intake? A simple record of what you ate, how fast you ate it and how you felt often reveals more than a long list of banned foods.",
      "Some people do benefit from a structured, time limited approach to identifying trigger foods, but it works best with guidance, because unnecessary restriction can reduce the variety of your diet. Persistent bloating, pain, blood in the stool, unexplained weight loss or changes in bowel habits are reasons to speak with your physician before changing your diet.",
      "A dietitian can help you work through these questions in an orderly way, and coordinate with your medical team when that is useful.",
    ],
  },  {
    slug: "does-meal-timing-matter", category: "Research", date: "August 3, 2026", read: "5 min read",
    media: "journal.mealTiming",
    title: "Does Meal Timing Matter? What We Know About Fasting Windows",
    excerpt: "Fasting windows are popular and heavily promoted. The research is more mixed than the headlines suggest.",
    body: [
      "Eating within a limited window, often called time restricted eating or intermittent fasting, has become one of the most talked about ideas in nutrition. The claims can be dramatic. The research is more mixed than the headlines suggest.",
      "Trials comparing fasting windows with ordinary eating at the same calorie level generally find small differences in weight and blood sugar, and many of the studies are short or small. Where people do lose weight, much of the effect seems to come from eating less overall, and little of it from the clock itself. Some people find that a structured window helps them stop evening grazing, which is a perfectly good reason to try one.",
      "Timing can matter in other ways. Long gaps between meals leave some people tired, irritable and prone to overeating later. Regular meals suit many people who train, who manage blood sugar, or who simply feel better with a steady rhythm. Fasting is not appropriate for everyone, including people who are pregnant, who take certain medications, or who have a history of disordered eating.",
      "The most useful question is which pattern you can follow comfortably for months. Which window is best matters far less. If you are curious about trying one, talk it through with a dietitian first, especially if you have a health condition.",
    ],
  },
  {
    slug: "sugar-and-the-afternoon-slump", category: "Metabolic Health", date: "July 20, 2026", read: "4 min read",
    media: "journal.sugarTruths",
    title: "Sugar, Cravings and the Afternoon Slump",
    excerpt: "A sweet snack can feel like the answer to a slump. Often it is part of the pattern that creates the next one.",
    body: [
      "Late in the afternoon, many people reach for something sweet. It works for a little while, and then the slump often returns. Understanding why can make the pattern easier to change.",
      "Sugar is a normal part of food, and a sweet treat can sit comfortably in a balanced day. The trouble comes when quickly digested carbohydrates make up most of a meal or snack, with little protein, fiber or fat to slow things down. Blood sugar then tends to rise and fall more quickly, and appetite can follow.",
      "A few changes help most people. Make lunch substantial enough to carry you through the afternoon, with protein and plenty of fiber. Have a planned snack that combines protein with fruit, such as yogurt and berries, so you are not deciding while hungry. Keep the sweet foods you love in your day, ideally after a meal, where they tend to sit more comfortably.",
      "Sleep, stress and long gaps between meals all feed cravings too, so it rarely comes down to willpower. If you notice extreme thirst, unusual fatigue or other changes alongside your cravings, mention them to your physician.",
    ],
  },
  {
    slug: "nutrition-through-the-menopause-transition", category: "Women's Health", date: "July 6, 2026", read: "6 min read",
    media: "journal.sleepNutrition",
    title: "Nutrition Through the Menopause Transition",
    excerpt: "Food can support how you feel through this transition. It cannot reverse it, and anyone promising otherwise is overselling.",
    body: [
      "The menopause transition brings changes in sleep, energy, body composition and appetite, and nutrition can support how you feel through it. It cannot reverse the transition, and anyone promising otherwise is overselling.",
      "Three areas deserve attention. Protein and strength training help maintain muscle, which tends to decline with age and with falling estrogen. Calcium, vitamin D and overall diet quality support bone health, which becomes a bigger priority after menopause. And steady meals can help with the energy dips and cravings many women notice.",
      "Many women also ask about hot flashes, sleep and mood. Alcohol, caffeine and large late meals are triggers for some people, though not for everyone. Keeping a brief record for a few weeks can show whether any of these matter for you.",
      "Because symptoms are individual and medical options exist, it is worth discussing the full picture with your physician. A dietitian works alongside that care, building an eating pattern that fits your symptoms, preferences and health history.",
    ],
  },  {
    slug: "how-much-water-do-you-need", category: "Nutrition", date: "June 22, 2026", read: "4 min read",
    media: "journal.hydration",
    title: "How Much Water Do You Really Need?",
    excerpt: "The familiar eight glasses rule is a rough guide at best. Your needs depend on your body, your climate and your day.",
    body: [
      "Eight glasses a day is a familiar rule with no firm scientific origin. It makes a handy reminder, though your own needs depend on your size, your activity, the weather and what else you eat and drink.",
      "Most healthy adults stay well hydrated by drinking when they are thirsty and by taking fluids with meals. Tea, coffee, milk, soup and water rich foods such as cucumber, oranges and yogurt all contribute. Needs rise in hot weather, with exercise, during illness with fever, vomiting or diarrhea, and in pregnancy and breastfeeding.",
      "A simple everyday check is the color of your urine. Pale straw suggests you are doing well, while dark amber usually means it is time for a drink. Headaches, tiredness and difficulty concentrating can follow even mild dehydration, so a glass of water is a reasonable first step when they appear.",
      "Some people need to be more careful, including those with kidney or heart conditions, or who take medicines that affect fluid balance. If that applies to you, follow your physician's guidance. Otherwise, keep a bottle within reach and add lemon, mint or cucumber if plain water feels dull.",
    ],
  },
];

const STORIES = [
  {
    id: "priya", name: "Priya", detail: "41, operations director", program: "Balance", media: "testimonials.client2",
    quote: "I stopped trying to eat perfectly and finally learned how to eat consistently.",
    before: "Skipped breakfast and lunch, then ate a large dinner late in the evening.",
    challenge: "Travel three weeks a month and almost no time to plan or shop.",
    intervention: "The Balance program with a travel framework, protein anchored breakfasts and two default lunches.",
    experience: "Her weekly check ins flagged airport days early, so her dietitian adjusted the plan before they became a problem.",
    outcome: "Regular meals on most days, steadier afternoon energy and a flexible plan she still uses.",
  },
  {
    id: "anthony", name: "Anthony", detail: "46, architect", program: "Metabolic", media: "testimonials.client1",
    quote: "I finally understood my numbers, and what I could do about them on an ordinary Tuesday.",
    before: "Recent lab results from his physician and a long list of advice he did not know how to apply.",
    challenge: "Long working days, business dinners and a lot of conflicting information.",
    intervention: "The Metabolic program, with meal structure, an evening walk and close coordination with his physician.",
    experience: "He shared his results with his dietitian, and they reviewed them together at each follow up.",
    outcome: "A clear routine he can follow, and follow up results his physician was encouraged by.",
  },
  {
    id: "margaret", name: "Margaret", detail: "72, retired teacher", program: "Balance", media: "testimonials.client3",
    quote: "I thought my appetite had simply gone. It turned out I needed a different way of eating.",
    before: "Small, irregular meals, tiredness by mid afternoon and a worry about losing strength.",
    challenge: "Cooking for one, a smaller appetite and little interest in elaborate recipes.",
    intervention: "The Balance program, with protein at every meal, smaller and more frequent meals, and simple recipes for one.",
    experience: "Weekly check ins let her dietitian adjust portions quickly, and her shopping list kept the week simple.",
    outcome: "Steadier energy, more confidence on her daily walks and meals she looks forward to.",
  },
];

const FAQS = [
  { q: "Do I need a referral to see a dietitian?", a: "No referral is needed to book a consultation. If you have a medical condition, we recommend letting your physician know you are working with us, and we are happy to coordinate with them." },
  { q: "What happens in the first consultation?", a: "We talk through your health history, your eating patterns, your schedule and what you would like to change. You leave with three clear priorities and a summary in your client portal within two working days." },
  { q: "Is telehealth available?", a: "Yes. Consultations can take place in our Santa Monica studio or by secure video. Before your first video session you can test your camera and microphone from your portal." },
  { q: "Will I have to count calories?", a: "Only if it is useful to you. Most clients never count calories. We focus on meal structure, food quality and habits, and use numbers only when they answer a specific question." },
  { q: "How does NOURA Intelligence fit in?", a: "It helps with practical questions between sessions, such as swapping an ingredient or planning a restaurant meal. Your dietitian reviews and approves any clinical recommendation, and you can always ask them directly." },
  { q: "Can I change programs or pause?", a: "Yes. Life changes, and your plan should too. Speak with your dietitian and we will adjust the pace, extend the program or pause it where that makes sense." },
  { q: "How is my health information protected?", a: "Your information is used only to provide your care. We describe our privacy practices in our policy, and you can request an export or deletion of your data at any time." },
];

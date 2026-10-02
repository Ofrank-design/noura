/* ==========================================================================
   NOURA Intelligence
   A practical assistant for the moments between consultations. It organizes,
   suggests and personalizes. It does not diagnose, and clinical changes stay
   with the dietitian for review.

   This demonstration uses written responses matched to intent. In production
   the same interface calls /api/ai (nutritionAssistant), with the client's
   plan, preferences and restrictions supplied as context and every clinical
   suggestion queued for dietitian review.
   ========================================================================== */

const AI_SUGGESTIONS = [
  "I'm traveling for four days. How can I stay close to my plan?",
  "I only have 15 minutes to make dinner.",
  "I don't eat meat anymore.",
  "What can I substitute for this ingredient?",
  "I missed lunch. What should I do?",
  "I have a restaurant dinner tonight.",
];

const AI_ACTIONS = {
  adjust: "Adjust Plan", alternatives: "Find Alternatives", ask: "Ask My Dietitian", log: "Log Meal",
};

const AI_INTENTS = [
  { id: "emergency", words: ["chest pain", "can't breathe", "cannot breathe", "allergic reaction", "anaphylaxis", "swelling of my", "fainted", "severe pain"],
    html: `<p><strong>This may need urgent medical attention.</strong> Please call your local emergency number or go to the nearest emergency department now. I can help with nutrition questions afterward.</p>`, actions: [] },
  { id: "clinical", words: ["medication", "insulin", "diabetes", "pregnant", "pregnancy", "eating disorder", "binge", "purge", "anorexia", "bulimia", "blood pressure", "kidney", "chemo", "dose", "supplement dose"],
    html: `<p>That is an important question, and it deserves a proper answer from a person who knows your history. It depends on your health, your medication and your results, so I do not want to guess.</p><p>I have flagged it for your dietitian. If you are worried about anything right now, please contact your physician or care team.</p>`, actions: ["ask"] },
  { id: "travel", words: ["travel", "trip", "flight", "airport", "hotel", "away for", "vacation", "holiday", "conference"],
    html: `<p>Four days away is very manageable, and you do not need to eat perfectly to stay close to your plan.</p><ul><li>Start each morning with protein. Eggs, yogurt or a protein rich hotel breakfast all work.</li><li>Pack two easy snacks, such as nuts and a piece of fruit, so you never go more than four hours without food.</li><li>Choose one meal each day to keep close to your plan and let the others be flexible.</li><li>Carry a water bottle and aim for your usual intake.</li></ul><p>If you tell me where you are going and what meals you will have, I can get more specific.</p>`, actions: ["adjust", "alternatives", "ask"] },
  { id: "quick", words: ["15 minutes", "fifteen minutes", "quick dinner", "no time", "don't have time", "short on time", "fast dinner", "in a hurry"],
    html: `<p>Fifteen minutes is enough for a proper dinner. A few ideas, each in your recipe library or easy to improvise:</p><ul><li><a href="recipe.html?id=veggieStirFry"><u>Rainbow vegetable stir fry with ginger</u></a>, about fifteen minutes from start to finish.</li><li>Eggs over microwave rice with frozen peas and soy sauce, which takes ten.</li><li><a href="recipe.html?id=tomatoSoup"><u>Roasted tomato soup</u></a> from a batch in the freezer, with toast and a handful of greens.</li></ul><p>For the nights when even that is too much, Greek yogurt with berries, granola and a handful of nuts still gives you protein.</p>`, actions: ["log", "alternatives"] },
  { id: "vegetarian", words: ["don't eat meat", "no meat", "vegetarian", "vegan", "stopped eating meat", "plant based", "cutting out meat"],
    html: `<p>That is a common change, and it is easy to do well. A few nutrients are worth keeping an eye on when you eat less or no meat: protein, iron, vitamin B12 and omega 3 fats.</p><ul><li>Build meals around tofu, lentils, beans, eggs or Greek yogurt.</li><li>Pair iron rich plant foods, such as lentils and spinach, with vitamin C from lemon, peppers or tomatoes.</li><li>B12 is worth discussing with your dietitian, since people who eat little or no animal food often need a reliable source.</li></ul><p>I can send this to your dietitian so your meal plan is updated. Any changes are reviewed before they reach your plan.</p>`, actions: ["adjust", "alternatives", "ask"] },
  { id: "swap", words: ["substitute", "swap", "instead of", "alternative", "replace", "don't have", "out of", "allergic to"],
    html: `<p>Tell me the ingredient and I will suggest options, always checked against your allergies and preferences. A few common ones:</p><ul><li>Greek yogurt: soy yogurt or cottage cheese.</li><li>Chicken thighs: firm tofu, chickpeas or turkey.</li><li>Brown rice: quinoa, baby potatoes or whole wheat couscous.</li><li>Salmon: trout, arctic char or firm white fish.</li><li>Feta: a sprinkle of nutritional yeast, or leave it out.</li></ul>`, actions: ["alternatives", "adjust"] },
  { id: "missed", words: ["missed lunch", "skipped lunch", "missed breakfast", "skipped breakfast", "missed a meal", "forgot to eat", "didn't eat"],
    html: `<p>It happens to everyone, and one missed meal will not undo your progress. Eat something with protein and fiber as soon as you can instead of waiting for the perfect meal.</p><ul><li>Yogurt with fruit and a handful of nuts.</li><li>A wrap or sandwich with a protein filling.</li><li>Eggs on toast, if you have ten minutes.</li></ul><p>Keep dinner simple and on time. There is no need to make up for it with a huge portion. It is worth noticing what got in the way today so we can plan around it tomorrow.</p>`, actions: ["log", "adjust"] },
  { id: "restaurant", words: ["restaurant", "eating out", "dinner out", "dining out", "takeout", "take out", "menu", "wedding", "party", "business dinner"],
    html: `<p>A restaurant dinner fits into your plan easily with a little preparation.</p><ul><li>Look at the menu beforehand, so you are choosing calmly instead of in a hurry.</li><li>Start with protein and a vegetable, then choose the carbohydrate you really want rather than the bread you will eat from habit.</li><li>Drink water alongside anything else you are having.</li><li>Eat until you are comfortably satisfied. You do not need to finish the plate.</li></ul><p>Then enjoy it. One meal out is part of a normal, well lived week.</p>`, actions: ["log", "ask"] },
  { id: "afternoon", words: ["afternoon", "slump", "craving", "cravings", "snack", "hungry at", "sugar"],
    html: `<p>Late afternoon hunger is usually a sign that lunch was light, or came late. Two things tend to help: bring lunch forward or add protein and fiber to it, and plan a snack for around 3:30 so you are not relying on willpower.</p><ul><li>Apple with almond butter and cottage cheese.</li><li>Greek yogurt with berries.</li><li>A small handful of nuts with a piece of fruit.</li></ul><p>If it keeps happening, it is worth raising with your dietitian at your next consultation.</p>`, actions: ["log", "ask"] },
  { id: "water", words: ["water", "hydration", "hydrated", "thirsty"],
    html: `<p>Needs vary with body size, climate and activity, so there is no single number that suits everyone. A practical approach is to drink steadily through the day and check that your urine is a pale straw color.</p><ul><li>Keep a bottle where you work.</li><li>Have a glass with each meal.</li><li>Count tea, soup and water rich fruit as part of your intake.</li></ul>`, actions: ["log"] },
  { id: "breakfast", words: ["breakfast", "morning meal", "what should i eat in the morning"],
    html: `<p>Breakfast works best when it includes protein and fiber. A few ideas from your library:</p><ul><li><a href="recipe.html?id=yogurtBowl"><u>Greek yogurt bowl with mixed berries and granola</u></a></li><li><a href="recipe.html?id=eggMuffins"><u>Cheesy spinach egg muffins</u></a>, made in advance</li><li><a href="recipe.html?id=overnightOats"><u>Overnight oats with chia and berries</u></a>, ready when you wake up</li></ul>`, actions: ["log", "alternatives"] },
];

const AI_FALLBACK = {
  html: `<p>I want to give you a helpful answer, so I would rather not guess here. I can pass your question to your dietitian, who can reply with advice that fits your plan and history.</p><p>In the meantime, you can ask me about travel, quick meals, swaps, restaurants or what to do after a missed meal.</p>`,
  actions: ["ask", "alternatives"],
};

function aiRespond(text) {
  const t = (" " + text.toLowerCase() + " ").replace(/[’]/g, "'");
  let best = null, bestScore = 0;
  AI_INTENTS.forEach((it) => {
    const score = it.words.reduce((n, w) => n + (t.includes(w) ? w.split(" ").length + 1 : 0), 0);
    if (score > bestScore) { best = it; bestScore = score; }
  });
  const hit = best || AI_FALLBACK;
  return { html: hit.html, actions: hit.actions, id: best ? best.id : "fallback" };
}

/* ---- Actions shared by the chat page and the client portal ---- */
const NouraActions = {
  adjust() {
    openModal(`<h3>Adjust your plan</h3><p class="small" style="margin-bottom:22px;">Tell us what is changing. Your dietitian reviews every request, and your current plan stays in place until she approves an update.</p>
      <form id="adjForm"><div class="q"><span class="label">What is happening?</span><div class="chips">${["I am traveling", "I am short on time", "My appetite has changed", "I am eating out more", "I want more variety", "Something is not working"].map((o) => `<label class="chip"><input type="checkbox" name="why" value="${o}"><span>${o}</span></label>`).join("")}</div></div>
      <div class="field"><label for="adjNote">Anything else?</label><textarea id="adjNote" placeholder="Dates, foods or details that would help"></textarea></div>
      <button class="btn btn-primary btn-block" type="submit">Send for review</button></form>`, (m, close) => {
      m.querySelector("#adjForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const why = [...m.querySelectorAll("input[name=why]:checked")].map((x) => x.value);
        if (!why.length && !m.querySelector("#adjNote").value.trim()) { toast("Choose an option or add a note."); return; }
        Store.push("planRequests", { why, note: m.querySelector("#adjNote").value.trim(), at: Date.now(), status: "Needs review" });
        close(); toast("Sent to Dr. Vale for review.");
      });
    });
  },
  alternatives() {
    const opts = [
      ["Lemon chicken skillet", "Firm tofu with lemon and asparagus", "White beans simmered with lemon and garlic"],
      ["Greek yogurt bowl", "Soy yogurt bowl with the same toppings", "Cottage cheese with fruit and oats"],
      ["Grilled salmon", "Trout or arctic char with the same vegetables", "Halloumi or tofu with the same vegetables"],
    ];
    openModal(`<h3>Find alternatives</h3><p class="small" style="margin-bottom:22px;">Suggestions are matched to your allergies and preferences. Choose one to send it to your dietitian for approval.</p>
      ${opts.map(([from, a, b]) => `<div class="card" style="padding:20px 22px;margin-bottom:12px;"><div class="fine" style="letter-spacing:.14em;text-transform:uppercase;font-weight:700;">Instead of ${esc(from)}</div>${[a, b].map((x) => `<button class="btn btn-outline btn-sm btn-block" style="margin-top:10px;justify-content:flex-start;text-transform:none;letter-spacing:0;font-weight:500;font-size:14px;white-space:normal;text-align:left;" data-swap="${esc(from)}|${esc(x)}">${esc(x)}</button>`).join("")}</div>`).join("")}`, (m, close) => {
      m.querySelectorAll("[data-swap]").forEach((b) => b.addEventListener("click", () => {
        const [from, to] = b.dataset.swap.split("|");
        Store.push("swaps", { from, to, at: Date.now(), status: "Needs review", client: "Maya Johnson" });
        close(); toast("Swap sent to your dietitian for approval.");
      }));
    });
  },
  ask(prefill = "") {
    openModal(`<h3>Ask your dietitian</h3><p class="small" style="margin-bottom:22px;">Messages are read on working days, usually within one business day. For anything urgent, contact your physician or local emergency services.</p>
      <form id="askForm"><div class="field"><label for="askText">Your message</label><textarea id="askText" required>${esc(prefill)}</textarea></div><button class="btn btn-primary btn-block" type="submit">Send message</button></form>`, (m, close) => {
      m.querySelector("#askForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const text = m.querySelector("#askText").value.trim();
        if (!text) return;
        Store.push("messages", { from: "client", name: "Maya Johnson", text, at: Date.now() });
        close(); toast("Message sent to Dr. Vale.");
      });
    });
  },
  log() {
    openModal(`<h3>Log a meal</h3><p class="small" style="margin-bottom:22px;">A quick note is enough. You can add detail later.</p>
      <form id="logForm"><div class="field"><label for="logMeal">Meal</label><select id="logMeal"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></div>
      <div class="field"><label for="logText">What did you have?</label><input type="text" id="logText" placeholder="Eggs on toast with spinach" required></div>
      <button class="btn btn-primary btn-block" type="submit">Save to my food log</button></form>`, (m, close) => {
      m.querySelector("#logForm").addEventListener("submit", (e) => {
        e.preventDefault();
        Store.push("foodLog", { meal: m.querySelector("#logMeal").value, text: m.querySelector("#logText").value.trim(), at: Date.now() });
        close(); toast("Saved to your food log.");
      });
    });
  },
};

/* ---- Chat mount ---- */
function mountChat(opts) {
  const log = document.getElementById(opts.log);
  const form = document.getElementById(opts.form);
  const input = document.getElementById(opts.input);
  const sug = document.getElementById(opts.suggest);
  if (!log || !form) return;

  const add = (html, cls) => {
    const b = document.createElement("div"); b.className = "bubble " + cls; b.innerHTML = html; log.appendChild(b);
    log.scrollTop = log.scrollHeight; return b;
  };
  const greet = () => add(`<span class="who">NOURA Intelligence</span><p>Hello${opts.name ? ", " + esc(opts.name) : ""}. I can help with practical questions between consultations, like swaps, quick meals, travel and eating out. Your dietitian reviews any change to your plan.</p>`, "ai");

  function send(text) {
    text = text.trim(); if (!text) return;
    add(`<p>${esc(text)}</p>`, "user");
    const th = add("<i></i><i></i><i></i>", "ai thinking"); th.setAttribute("aria-label", "NOURA Intelligence is writing");
    const res = aiRespond(text);
    setTimeout(() => {
      th.remove();
      const b = add(`<span class="who">NOURA Intelligence</span>${res.html}${res.actions.length ? `<div class="msg-actions">${res.actions.map((a) => `<button type="button" data-act="${a}">${AI_ACTIONS[a]}</button>`).join("")}</div>` : ""}<p class="fine" style="margin-top:12px;">General guidance, not medical advice. Your dietitian reviews any clinical recommendation.</p>`, "ai");
      b.querySelectorAll("[data-act]").forEach((btn) => btn.addEventListener("click", () => NouraActions[btn.dataset.act](btn.dataset.act === "ask" ? text : undefined)));
      log.setAttribute("aria-live", "polite");
    }, 950);
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); send(input.value); input.value = ""; input.focus(); });
  if (sug) {
    sug.innerHTML = AI_SUGGESTIONS.map((s) => `<button type="button">${esc(s)}</button>`).join("");
    sug.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => send(b.textContent)));
  }
  greet();
}

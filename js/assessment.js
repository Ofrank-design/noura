/* ==========================================================================
   NOURA: Nutrition Assessment
   Nine short steps collect the information listed in the brief, then a rule
   based engine drafts a preliminary Nutrition Profile. The profile is
   guidance for personalization, not a diagnosis, and a dietitian reviews it.
   In production the answers post to /api/assessments and the profile is
   produced by the assessmentAnalyzer service.
   ========================================================================== */

const A_STEPS = [
  { id: "about", label: "About you", title: "A little about you.", sub: "It takes about five minutes. Your answers help us tailor everything that follows.",
    qs: [
      { id: "age", type: "chips", label: "Age range", required: true, options: ["Under 25", "25 to 34", "35 to 44", "45 to 54", "55 to 64", "65 and over"] },
      { id: "goal", type: "options", label: "What would you most like help with?", required: true, options: [
        ["Steadier energy", "Feeling good through the whole day"],
        ["Sustainable weight management", "Changes you can keep, without rigid rules"],
        ["Digestive comfort", "Understanding and easing symptoms"],
        ["Metabolic health", "Blood sugar, cholesterol or related goals"],
        ["Performance and recovery", "Fueling training and feeling strong"],
        ["Women's health and life stages", "Pregnancy planning, postpartum, perimenopause and beyond"],
        ["Better everyday habits", "A calmer, more consistent way of eating"],
      ] },
    ] },
  { id: "food", label: "Food preferences", title: "What do you eat, and what do you avoid?", sub: "Choose everything that applies.",
    qs: [
      { id: "diet", type: "multi", label: "Dietary preferences", required: true, options: ["No specific pattern", "Vegetarian", "Vegan", "Pescatarian", "Gluten free", "Dairy free", "Halal", "Kosher"], exclusive: "No specific pattern" },
      { id: "allergies", type: "multi", label: "Allergies", required: true, options: ["None", "Peanuts", "Tree nuts", "Shellfish", "Fish", "Egg", "Milk", "Soy", "Wheat", "Sesame"], exclusive: "None" },
      { id: "intolerances", type: "multi", label: "Intolerances or foods that do not agree with you", required: true, options: ["None", "Lactose", "Gluten", "High FODMAP foods", "Caffeine", "Spicy food", "Not sure"], exclusive: "None" },
    ] },
  { id: "patterns", label: "Eating patterns", title: "How do you eat on a typical day?", sub: "There are no right answers. We just want to see what a normal day looks like.",
    qs: [
      { id: "pattern", type: "options", label: "Which describes you best?", required: true, options: [
        ["Regular, structured meals", "Most days follow a predictable rhythm"],
        ["Irregular, with skipped meals", "Breakfast or lunch often gets missed"],
        ["Frequent grazing", "Small amounts throughout the day"],
        ["A large evening meal", "Light during the day, most food at night"],
        ["Restrictive or rigid", "Strict rules, lists of foods to avoid"],
      ] },
      { id: "meals", type: "range", label: "Meals and snacks on a typical day", min: 1, max: 7, def: 3, scale: ["1", "7 or more"], suffix: "" },
    ] },
  { id: "rhythm", label: "Daily rhythm", title: "How does your day feel?", sub: "Sleep, movement, water and stress all shape what your body needs.",
    qs: [
      { id: "hydration", type: "chips", label: "Glasses of water on a typical day", required: true, options: ["1 to 3", "4 to 5", "6 to 8", "9 or more"] },
      { id: "sleep", type: "chips", label: "Sleep on most nights", required: true, options: ["Under 6 hours", "6 to 7 hours", "7 to 8 hours", "8 hours or more"] },
      { id: "activity", type: "options", label: "Physical activity", required: true, options: [
        ["Mostly seated", "Little planned exercise"],
        ["Light", "Regular walks or gentle movement"],
        ["Moderate", "Three to four sessions a week"],
        ["Very active", "Training most days of the week"],
      ] },
      { id: "stress", type: "range", label: "Typical stress level", min: 1, max: 5, def: 3, scale: ["Calm", "Very high"], suffix: " of 5" },
    ] },
  { id: "work", label: "Work and travel", title: "Work and travel.", sub: "Your schedule decides what is realistic, so we start there.",
    qs: [
      { id: "schedule", type: "options", label: "Your working pattern", required: true, options: [
        ["Regular office hours", "Predictable days"],
        ["Hybrid", "A mix of home and office"],
        ["Long or irregular hours", "Early starts, late finishes or unpredictable days"],
        ["Shift work", "Changing or overnight schedules"],
        ["Home or caregiving", "Looking after family or working at home"],
      ] },
      { id: "travel", type: "chips", label: "How often do you travel?", required: true, options: ["Rarely", "A few times a year", "Monthly", "Most weeks"] },
    ] },
  { id: "kitchen", label: "Your kitchen", title: "Your kitchen.", sub: "Plans work best when they match how you actually cook.",
    qs: [
      { id: "cooking", type: "options", label: "Cooking habits", required: true, options: [
        ["I cook most meals", "Confident and regular"],
        ["I cook a few times a week", "Mixed with easy meals"],
        ["I prepare meals in advance", "Batch cooking on the weekend"],
        ["Mostly takeout or restaurants", "Cooking is rare"],
      ] },
      { id: "budget", type: "chips", label: "Food budget", required: true, options: ["Flexible", "Moderate", "Needs to be careful"] },
    ] },
  { id: "health", label: "Health picture", title: "Your health picture.", sub: "Share only what you are comfortable with. This is not a diagnosis, and a dietitian will review it with you.",
    qs: [
      { id: "concerns", type: "multi", label: "Health concerns you would like us to know about", required: true, options: ["None of these", "Blood sugar or insulin", "Cholesterol or blood pressure", "Digestive symptoms", "Hormonal or menopause related", "Low energy or fatigue", "Iron or other nutrient levels", "Food allergies or intolerances"], exclusive: "None of these" },
      { id: "previous", type: "chips", label: "Previous nutrition support", required: true, options: ["This is my first time", "I have tried things on my own", "I have worked with a professional", "I have tried many programs"] },
    ] },
  { id: "support", label: "Support", title: "How can we help most?", sub: "Two last questions about what you need from us.",
    qs: [
      { id: "challenge", type: "options", label: "Your biggest challenge", required: true, options: [
        ["Finding the time", "Planning, shopping and cooking"],
        ["Staying consistent", "Good weeks followed by difficult ones"],
        ["Knowing what to eat", "Too much conflicting advice"],
        ["Cravings and appetite", "Hunger or eating for comfort"],
        ["Eating out and social occasions", "Restaurants, events and travel"],
        ["Motivation", "Starting and keeping going"],
      ] },
      { id: "style", type: "options", label: "Preferred support style", required: true, options: [
        ["A clear structured plan", "Tell me what to eat and when"],
        ["Flexible guidance", "Principles I can apply myself"],
        ["Regular accountability", "Check ins that keep me on track"],
        ["Education", "I want to understand the why"],
        ["A mix of everything", "It depends on the week"],
      ] },
    ] },
  { id: "contact", label: "Your profile", title: "Almost there.", sub: "Add your name and email if you would like your profile saved. You can also skip this and see your results straight away.",
    qs: [
      { id: "name", type: "text", label: "First name", placeholder: "Maya", required: false, autocomplete: "given-name" },
      { id: "email", type: "email", label: "Email", placeholder: "you@example.com", required: false, autocomplete: "email" },
    ] },
];

const A_ARCHETYPES = {
  metabolicPlanner: { name: "The Metabolic Planner", objective: "Support metabolic health with a routine you can keep", focus: "Meal composition and timing, daily movement and steady habits", program: "metabolic", service: "comprehensive" },
  comfortSeeker: { name: "The Comfort Seeker", objective: "Digestive comfort and confident eating", focus: "Finding patterns before restricting foods, with gentle structure", program: "balance", service: "comprehensive" },
  lifeStage: { name: "The Life Stage Navigator", objective: "Energy, strength and steady routines through change", focus: "Protein, bone supporting nutrients and a dependable meal rhythm", program: "balance", service: "initial" },
  performer: { name: "The Active Performer", objective: "Fuel for training and recovery", focus: "Meal timing, protein distribution and recovery nutrition", program: "balance", service: "initial" },
  freshStarter: { name: "The Fresh Starter", objective: "A calmer, more flexible relationship with food", focus: "Meal structure without rigid rules", program: "reset", service: "initial" },
  busy: { name: "The Busy Professional", objective: "Sustainable nutrition and energy", focus: "Structured meals with flexible planning", program: "balance", service: "initial" },
  steady: { name: "The Steady Builder", objective: "Consistent everyday habits", focus: "Regular meals and small, repeatable improvements", program: "reset", service: "initial" },
};

function buildProfile(a) {
  const has = (list, v) => Array.isArray(list) && list.includes(v);
  const concerns = (a.concerns || []).filter((c) => c !== "None of these");
  const allergies = (a.allergies || []).filter((c) => c !== "None");
  let key = "steady";
  if (has(a.concerns, "Blood sugar or insulin") || has(a.concerns, "Cholesterol or blood pressure") || a.goal === "Metabolic health") key = "metabolicPlanner";
  else if (has(a.concerns, "Digestive symptoms") || a.goal === "Digestive comfort") key = "comfortSeeker";
  else if (a.goal === "Women's health and life stages" || has(a.concerns, "Hormonal or menopause related")) key = "lifeStage";
  else if (a.goal === "Performance and recovery" || a.activity === "Very active") key = "performer";
  else if (a.pattern === "Restrictive or rigid" || a.previous === "I have tried many programs") key = "freshStarter";
  else if (["Long or irregular hours", "Shift work"].includes(a.schedule) || a.travel === "Most weeks" || a.challenge === "Finding the time") key = "busy";
  const base = A_ARCHETYPES[key];

  const strengths = [], improve = [];
  if (a.pattern === "Regular, structured meals") strengths.push("A dependable daily meal rhythm");
  if (["6 to 8", "9 or more"].includes(a.hydration)) strengths.push("Good hydration");
  if (["7 to 8 hours", "8 hours or more"].includes(a.sleep)) strengths.push("Consistent, restful sleep");
  if (["Moderate", "Very active"].includes(a.activity)) strengths.push("Regular physical activity");
  if (["I cook most meals", "I prepare meals in advance"].includes(a.cooking)) strengths.push("Confidence in the kitchen");
  if (a.previous && a.previous !== "This is my first time") strengths.push("Experience with what has and has not worked");
  if (!strengths.length) strengths.push("A clear motivation to begin");
  if (strengths.length < 2) strengths.push("Willingness to look at your habits honestly");

  if (["Irregular, with skipped meals", "A large evening meal"].includes(a.pattern)) improve.push(a.pattern === "A large evening meal" ? "Food spread toward the end of the day" : "Irregular meal timing, especially lunch");
  if (a.pattern === "Frequent grazing") improve.push("Grazing without a clear meal structure");
  if (a.cooking === "Mostly takeout or restaurants") improve.push("Frequent restaurant and takeout meals");
  if (a.cooking === "I cook a few times a week") improve.push("Inconsistent meal preparation");
  if (["1 to 3", "4 to 5"].includes(a.hydration)) improve.push("Water intake through the day");
  if (["Under 6 hours", "6 to 7 hours"].includes(a.sleep)) improve.push("Sleep duration, which affects appetite and energy");
  if (Number(a.stress) >= 4) improve.push("A high stress load that can affect appetite and energy");
  if (a.travel === "Most weeks" || a.travel === "Monthly") improve.push("Eating well while travelling");
  if (a.activity === "Mostly seated") improve.push("Everyday movement");
  if (!improve.length) improve.push("Fine tuning portions, variety and timing");

  const notes = [];
  if (allergies.length || concerns.length) notes.push({ tone: "sage", text: "You mentioned health concerns or allergies. Your dietitian will review these carefully with you before making any recommendation." });
  if (a.pattern === "Restrictive or rigid") notes.push({ tone: "warm", text: "If food feels stressful or controlling, please tell us. Our dietitians support a healthy relationship with food, and there is no judgment here." });

  const program = PROGRAMS.find((p) => p.slug === base.program);
  const supportLabel = { reset: "4 week Reset program", balance: "8 week personalized Balance program", metabolic: "12 week Metabolic program" }[base.program];
  return { key, name: base.name, objective: base.objective, focus: base.focus, strengths: strengths.slice(0, 3), improve: improve.slice(0, 3), program: program.slug, programName: program.name, support: supportLabel, service: base.service, notes };
}

(function initAssessment() {
  const root = document.getElementById("wizard");
  if (!root) return;
  let i = 0;
  const answers = Store.get("assessmentDraft", {});

  function qHTML(q) {
    const v = answers[q.id];
    const req = q.required ? "" : "";
    if (q.type === "chips") {
      return `<fieldset class="q" data-q="${q.id}"><legend class="label">${q.label}</legend><div class="chips">${q.options.map((o) => `<label class="chip"><input type="radio" name="${q.id}" value="${esc(o)}" ${v === o ? "checked" : ""}><span>${esc(o)}</span></label>`).join("")}</div><p class="error-msg" role="alert">Please choose one option.</p></fieldset>`;
    }
    if (q.type === "multi") {
      return `<fieldset class="q" data-q="${q.id}" data-exclusive="${q.exclusive || ""}"><legend class="label">${q.label}</legend><div class="chips">${q.options.map((o) => `<label class="chip"><input type="checkbox" name="${q.id}" value="${esc(o)}" ${Array.isArray(v) && v.includes(o) ? "checked" : ""}><span>${esc(o)}</span></label>`).join("")}</div><p class="error-msg" role="alert">Please choose at least one, or select the first option if none apply.</p></fieldset>`;
    }
    if (q.type === "options") {
      return `<fieldset class="q" data-q="${q.id}"><legend class="label">${q.label}</legend><div class="option-list">${q.options.map(([t, d]) => `<label class="option"><input type="radio" name="${q.id}" value="${esc(t)}" ${v === t ? "checked" : ""}><span><span><strong>${esc(t)}</strong><small>${esc(d)}</small></span></span></label>`).join("")}</div><p class="error-msg" role="alert">Please choose one option.</p></fieldset>`;
    }
    if (q.type === "range") {
      const val = v || q.def;
      return `<div class="q range-row" data-q="${q.id}"><label class="label" for="r_${q.id}">${q.label}</label><div class="range-value" id="rv_${q.id}" aria-live="polite">${val}${q.suffix}</div><input type="range" id="r_${q.id}" name="${q.id}" min="${q.min}" max="${q.max}" value="${val}" step="1"><div class="range-scale"><span>${q.scale[0]}</span><span>${q.scale[1]}</span></div></div>`;
    }
    return `<div class="field"><label for="f_${q.id}">${q.label}</label><input id="f_${q.id}" type="${q.type}" name="${q.id}" placeholder="${q.placeholder || ""}" autocomplete="${q.autocomplete || "off"}" value="${esc(v || "")}"></div>`;
  }

  function render() {
    const s = A_STEPS[i];
    const bars = A_STEPS.map((_, n) => `<i class="${n < i ? "done" : n === i ? "now" : ""}"></i>`).join("");
    const last = i === A_STEPS.length - 1;
    root.innerHTML = `<div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="${A_STEPS.length}" aria-valuenow="${i + 1}" aria-label="Assessment progress">${bars}</div>
      <span class="step-label">Step ${i + 1} of ${A_STEPS.length} &middot; ${s.label}</span>
      <h2 id="stepTitle" tabindex="-1">${s.title}</h2>
      <p class="sub">${s.sub}</p>
      <form id="stepForm" novalidate>${s.qs.map(qHTML).join("")}
        <div class="wizard-nav">
          ${i > 0 ? '<button type="button" class="back-btn" id="back">Back</button>' : "<span></span>"}
          <button type="submit" class="btn btn-primary">${last ? "Create my profile" : "Continue"}</button>
        </div>
      </form>`;
    const form = root.querySelector("#stepForm");
    form.addEventListener("submit", (e) => { e.preventDefault(); next(form); });
    const back = root.querySelector("#back");
    if (back) back.addEventListener("click", () => { collect(form, false); i--; render(); focusTitle(); });
    form.querySelectorAll('input[type="range"]').forEach((r) => r.addEventListener("input", () => {
      const q = s.qs.find((x) => x.id === r.name);
      document.getElementById("rv_" + r.name).textContent = r.value + q.suffix;
    }));
    form.querySelectorAll("fieldset[data-exclusive]").forEach((fs) => {
      const ex = fs.dataset.exclusive;
      fs.addEventListener("change", (e) => {
        if (!ex) return;
        const boxes = [...fs.querySelectorAll("input")];
        if (e.target.value === ex && e.target.checked) boxes.forEach((b) => { if (b !== e.target) b.checked = false; });
        else if (e.target.checked) boxes.forEach((b) => { if (b.value === ex) b.checked = false; });
      });
    });
  }

  function focusTitle() { const t = document.getElementById("stepTitle"); if (t) { t.focus({ preventScroll: true }); window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" }); } }

  function collect(form) {
    A_STEPS[i].qs.forEach((q) => {
      if (q.type === "multi") answers[q.id] = [...form.querySelectorAll(`input[name="${q.id}"]:checked`)].map((x) => x.value);
      else if (q.type === "range") answers[q.id] = Number(form.querySelector(`input[name="${q.id}"]`).value);
      else if (q.type === "text" || q.type === "email") answers[q.id] = form.querySelector(`input[name="${q.id}"]`).value.trim();
      else { const c = form.querySelector(`input[name="${q.id}"]:checked`); answers[q.id] = c ? c.value : undefined; }
    });
    Store.set("assessmentDraft", answers);
  }

  function valid(form) {
    let ok = true, firstBad = null;
    A_STEPS[i].qs.forEach((q) => {
      const box = form.querySelector(`[data-q="${q.id}"]`);
      let good = true;
      if (q.required) good = q.type === "multi" ? (answers[q.id] || []).length > 0 : answers[q.id] !== undefined && answers[q.id] !== "";
      if (q.type === "email" && answers.email && !/^\S+@\S+\.\S+$/.test(answers.email)) { good = false; }
      const wrap = box || form.querySelector(`[name="${q.id}"]`).closest(".field");
      if (wrap) {
        wrap.classList.toggle("invalid", !good);
        const err = wrap.querySelector(".error-msg");
        if (!good && err) err.style.display = "block"; else if (err) err.style.display = "";
      }
      if (!good) { ok = false; if (!firstBad) firstBad = wrap; }
    });
    if (firstBad) firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
    return ok;
  }

  function next(form) {
    collect(form);
    if (!valid(form)) return;
    if (i < A_STEPS.length - 1) { i++; render(); focusTitle(); return; }
    analyze();
  }

  function analyze() {
    const lines = ["Reading your answers", "Looking at your daily patterns", "Shaping your profile"];
    root.innerHTML = `<div class="analyzing" role="status"><div class="ring"></div><h2>${lines[0]}</h2><p>One moment while we put this together.</p></div>`;
    const h = root.querySelector("h2"); let n = 0;
    const t = setInterval(() => { n++; if (lines[n]) h.textContent = lines[n]; }, 900);
    setTimeout(() => { clearInterval(t); showResult(); }, 2700);
  }

  function showResult() {
    const p = buildProfile(answers);
    const record = { answers: { ...answers }, profile: p, at: Date.now() };
    Store.set("assessment", record);
    Store.push("leads", { name: answers.name || "Anonymous visitor", email: answers.email || "", goal: answers.goal, archetype: p.name, program: p.programName, at: Date.now(), stage: "Assessment Completed", source: "Website assessment" });
    const service = SERVICES.find((s) => s.id === p.service);
    root.innerHTML = `<div class="result-grid">
      <div class="result-main">
        <span class="step-label">${answers.name ? esc(answers.name) + ", your" : "Your"} preliminary Nutrition Profile</span>
        <h3 class="big">${esc(p.name)}</h3>
        <p class="lead" style="font-family:var(--serif);font-style:italic;font-size:26px;line-height:1.3;">${esc(p.objective)}</p>
        <dl class="kv">
          <div><dt>Current strengths</dt><dd><ul>${p.strengths.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></dd></div>
          <div><dt>Areas to improve</dt><dd><ul>${p.improve.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></dd></div>
          <div><dt>Recommended focus</dt><dd>${esc(p.focus)}</dd></div>
          <div><dt>Suggested support</dt><dd>${esc(p.support)}. We would usually begin with a ${esc(service.name.toLowerCase())}.</dd></div>
        </dl>
        <div class="actions" style="margin-top:34px;">
          <a class="btn btn-primary" href="book.html?from=assessment">Discuss your results</a>
          <a class="btn btn-outline" href="program.html?slug=${p.program}">About the ${esc(p.programName)} program</a>
        </div>
      </div>
      <div class="stack">
        ${p.notes.map((n) => `<div class="note ${n.tone === "warm" ? "warm" : ""}">${esc(n.text)}</div>`).join("")}
        <div class="note">This profile is guidance to help us personalize your care. It is not a diagnosis, and a registered dietitian reviews everything before it becomes advice.</div>
        <button class="back-btn" id="retake" type="button">Start the assessment again</button>
      </div>
    </div>`;
    root.querySelector("#retake").addEventListener("click", () => { Store.set("assessmentDraft", {}); Object.keys(answers).forEach((k) => delete answers[k]); i = 0; render(); focusTitle(); });
    root.setAttribute("tabindex", "-1"); root.focus({ preventScroll: true });
    window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  }

  render();
})();

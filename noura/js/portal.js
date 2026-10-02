/* ==========================================================================
   NOURA: client portal (demonstration)
   Signed in as Maya Johnson, week five of the Metabolic program.
   State lives in localStorage so the dietitian dashboard can read it. In
   production every action here is an authenticated API call.
   ========================================================================== */

const ME = { name: "Maya Johnson", first: "Maya", program: "Metabolic", week: 5, of: 12, pro: "Dr. Amara Vale" };
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const NOW = Date.now(), DAY = 86400000;

const P = {
  state() { return Object.assign({ done: {}, water: {} }, Store.get("portal", {})); },
  save(s) { Store.set("portal", s); },
  plan() { return Store.get("planOverride") || SAMPLE_WEEK; },
  todayIdx() { return (new Date().getDay() + 6) % 7; },
  messages() {
    const seed = [
      { from: "them", text: "Hi Maya, your week five plan is ready. I moved Thursday's lunch to a recipe that travels better for your trip.", at: NOW - 2 * DAY - 3600000 },
      { from: "me", text: "Thank you! The lentil salad worked really well at the office last week.", at: NOW - 2 * DAY + 1800000 },
      { from: "them", text: "Wonderful to hear. How did you find the 3:30 snack? Let me know if you want it swapped.", at: NOW - DAY - 7200000 },
    ];
    const mine = Store.get("messages", []).filter((m) => m.from === "client").map((m) => ({ from: "me", text: m.text, at: m.at }));
    return seed.concat(mine.reverse()).sort((a, b) => a.at - b.at);
  },
  logs() {
    const seed = [
      { meal: "Breakfast", text: "Greek yogurt bowl with plums and oats", at: NOW - DAY - 3600000 * 3 },
      { meal: "Lunch", text: "Lentil and roasted carrot salad", at: NOW - DAY - 3600000 * 6 },
      { meal: "Dinner", text: "Salmon sheet pan with broccoli and potatoes", at: NOW - DAY - 3600000 * 14 },
    ];
    return Store.get("foodLog", []).concat(seed);
  },
  checkins() {
    const seed = [{ at: NOW - 7 * DAY, ratings: { Energy: 4, Hunger: 3, Sleep: 3, Mood: 4, Stress: 3, Digestion: 4 }, felt: "A steadier week overall. Tuesday was the hardest, with back to back meetings.", seed: true }];
    return Store.get("checkins", []).concat(seed);
  },
};

const NOTE = "A protein rich lunch before 2 PM.";

function mealCard(slotLabel, recipe, state, key, opts = {}) {
  const done = !!state.done[key];
  return `<div class="meal ${done ? "done" : ""}">
    <a href="recipe.html?id=${recipe.id}" aria-hidden="true" tabindex="-1">${mediaFrame(recipe.media, "")}</a>
    <div><div class="slot">${slotLabel}</div><h4><a href="recipe.html?id=${recipe.id}">${esc(recipe.title)}</a></h4><div class="facts">${recipe.nutrition.cal} cal &middot; ${recipe.nutrition.protein} g protein &middot; ${recipe.prep + recipe.cook} min</div></div>
    <div class="acts">
      <button class="check" type="button" data-done="${key}" aria-pressed="${done}" aria-label="Mark ${esc(recipe.title)} as eaten">${icon("tick")}</button>
      ${opts.swap ? `<button class="btn btn-outline btn-sm" type="button" data-swap="${esc(recipe.title)}">Swap</button>` : ""}
    </div>
  </div>`;
}

function bindMeals(root, rerender) {
  root.querySelectorAll("[data-done]").forEach((b) => b.addEventListener("click", () => {
    const s = P.state(); const k = b.dataset.done; s.done[k] = !s.done[k]; P.save(s);
    if (s.done[k]) Store.push("activity", { who: ME.name, what: "logged a meal", at: Date.now() });
    rerender();
  }));
  root.querySelectorAll("[data-swap]").forEach((b) => b.addEventListener("click", () => {
    const from = b.dataset.swap;
    openModal(`<h3>Swap this meal</h3><p class="small" style="margin-bottom:20px;">Tell us what would suit you better. Your dietitian approves swaps before they change your plan.</p><form id="swForm"><div class="q"><span class="label">${esc(from)}, instead:</span><div class="chips">${["Faster to make", "Vegetarian", "Lighter", "More filling", "Travels well", "Something different"].map((o) => `<label class="chip"><input type="radio" name="why" value="${o}"><span>${o}</span></label>`).join("")}</div></div><button class="btn btn-primary btn-block" type="submit">Send swap request</button></form>`, (m, close) => {
      m.querySelector("#swForm").addEventListener("submit", (e) => {
        e.preventDefault(); const c = m.querySelector("input[name=why]:checked");
        if (!c) { toast("Please choose a reason."); return; }
        Store.push("swaps", { from, to: c.value, at: Date.now(), status: "Needs review", client: ME.name });
        close(); toast("Swap request sent to " + ME.pro + ".");
      });
    });
  }));
}

/* ---- Views ---- */
const ROUTES = {
  today: { nav: "Today", tab: "Today", title: "Today", icon: "home",
    sub: () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    render(el) {
      const h = new Date().getHours(), greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
      const draw = () => {
        const s = P.state(), idx = P.todayIdx(), day = P.plan()[idx], key = dayKey(), water = s.water[key] ?? 6;
        const todayDone = MEAL_SLOTS.filter(([sl]) => s.done[key + ":" + sl]).length;
        const planned = (idx + 1) * 4, done = idx * 3 + todayDone;
        const next = (Store.get("bookings", [])[0]);
        el.innerHTML = `
          <h2 style="font-size:clamp(40px,4.4vw,64px);margin-bottom:28px;">${greet}, ${ME.first}.</h2>
          <div class="cols c21">
            <div class="stack">
              <div class="panel olive"><div class="label-sm">Today's focus</div><h3 style="font-size:clamp(28px,3vw,40px);margin:10px 0 8px;line-height:1.1;">${NOTE}</h3><p>A note from ${ME.pro}. On days with back to back meetings, a real lunch is the meal that protects your afternoon.</p></div>
              <div class="panel"><div class="panel-head"><h3>Today's meals</h3><button class="btn btn-outline btn-sm" data-route="plan" type="button">Full plan</button></div>${MEAL_SLOTS.map(([sl, label]) => mealCard(label, getRecipe(day[sl]), s, key + ":" + sl)).join("")}</div>
            </div>
            <div class="stack">
              <div class="panel"><div class="panel-head" style="margin-bottom:12px;"><h3>Hydration</h3><span class="badge">${water} of 8</span></div><div class="glasses" role="group" aria-label="Glasses of water today">${Array.from({ length: 8 }, (_, i) => `<button class="glass" type="button" data-water="${i + 1}" aria-pressed="${i < water}" aria-label="${i + 1} glasses"></button>`).join("")}</div><p class="small" style="margin-top:14px;">Tap a glass to set today's total.</p></div>
              <div class="panel"><div class="panel-head" style="margin-bottom:6px;"><h3>This week</h3></div><div class="ring-set">${ringChart(82, "Consistency")}${ringChart(Math.min(100, Math.round((done / Math.max(planned, 1)) * 100)), "Meals logged", "var(--terracotta)")}</div></div>
              <div class="panel cream"><div class="label-sm">Next session</div><h4 style="margin:8px 0 4px;">${next ? esc(next.service) : "Metabolic follow up"}</h4><p class="small">${next ? `${esc(next.pro)}, ${new Date(next.date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })} at ${esc(next.time)}` : "Dr. Amara Vale, Monday, October 5 at 9:00 AM, by secure video"}</p><div class="btn-row" style="margin-top:16px;"><button class="btn btn-outline btn-sm" data-route="appointments" type="button">Details</button></div></div>
            </div>
          </div>
          <div class="cols c3 mt">
            <button class="panel" type="button" data-act="log" style="text-align:left;cursor:pointer;"><div class="label-sm">Quick action</div><h4 style="margin-top:8px;">Log a meal</h4><p class="small">A short note is plenty.</p></button>
            <button class="panel" type="button" data-route="ask" style="text-align:left;cursor:pointer;"><div class="label-sm">Quick action</div><h4 style="margin-top:8px;">Ask NOURA</h4><p class="small">Swaps, travel, eating out.</p></button>
            <button class="panel" type="button" data-act="ask" style="text-align:left;cursor:pointer;"><div class="label-sm">Quick action</div><h4 style="margin-top:8px;">Message ${ME.pro.split(" ").slice(0, 2).join(" ")}</h4><p class="small">Replies within one business day.</p></button>
          </div>`;
        bindMeals(el, draw);
        el.querySelectorAll("[data-water]").forEach((b) => b.addEventListener("click", () => { const st = P.state(); const n = Number(b.dataset.water); st.water[key] = st.water[key] === n ? n - 1 : n; P.save(st); draw(); }));
        el.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => NouraActions[b.dataset.act]()));
      };
      draw();
    } },

  plan: { nav: "Meal Plan", tab: "Plan", title: "Meal plan", icon: "plan", sub: "Week five of twelve, prepared by " + ME.pro,
    render(el, actions) {
      actions.innerHTML = `<button class="btn btn-outline btn-sm" id="dlPlan" type="button">Download plan</button><button class="btn btn-outline btn-sm" id="reqChange" type="button">Request a change</button>`;
      let sel = P.todayIdx(); const dates = weekDates();
      const draw = () => {
        const s = P.state(), day = P.plan()[sel], key = dayKey(dates[sel]);
        const tot = MEAL_SLOTS.reduce((a, [sl]) => { const n = getRecipe(day[sl]).nutrition; a.cal += n.cal; a.p += n.protein; a.c += n.carbs; a.f += n.fat; return a; }, { cal: 0, p: 0, c: 0, f: 0 });
        el.innerHTML = `<div class="day-tabs" role="tablist" aria-label="Days of the week">${dates.map((d, i) => `<button type="button" role="tab" data-day="${i}" aria-selected="${i === sel}">${DAYS[i]}<b>${d.getDate()}</b></button>`).join("")}</div>
          <div class="cols c21"><div class="panel">${MEAL_SLOTS.map(([sl, label]) => mealCard(label, getRecipe(day[sl]), s, key + ":" + sl, { swap: true })).join("")}</div>
          <div class="stack"><div class="panel"><div class="panel-head" style="margin-bottom:14px;"><h3>Day totals</h3></div><div class="macros"><div><b>${tot.cal}</b><small>Calories</small></div><div><b>${tot.p} g</b><small>Protein</small></div><div><b>${tot.c} g</b><small>Carbs</small></div><div><b>${tot.f} g</b><small>Fat</small></div></div><p class="fine" style="margin-top:14px;">Estimates for orientation. Your dietitian focuses on patterns, not perfect numbers.</p></div>
          <div class="panel cream"><div class="label-sm">A note from ${ME.pro.split(" ").slice(0, 2).join(" ")}</div><p style="margin-top:8px;color:var(--charcoal);">Keep breakfast and lunch steady this week, and have the 3:30 snack ready before the afternoon slump. If a day goes sideways, a simple protein and vegetable meal is always a good reset.</p></div></div></div>`;
        el.querySelectorAll("[data-day]").forEach((b) => b.addEventListener("click", () => { sel = Number(b.dataset.day); draw(); }));
        bindMeals(el, draw); hydrateMedia(el);
      };
      draw();
      document.getElementById("reqChange").addEventListener("click", () => NouraActions.adjust());
      document.getElementById("dlPlan").addEventListener("click", () => {
        const plan = P.plan(); const txt = ["NOURA meal plan, week five", ""].concat(plan.flatMap((d, i) => [DAYS[i] + " " + dates[i].getDate()].concat(MEAL_SLOTS.map(([sl, l]) => `  ${l}: ${getRecipe(d[sl]).title}`)).concat([""]))).join("\n");
        downloadText("noura-meal-plan.txt", txt); toast("Meal plan downloaded.");
      });
    } },

  shopping: { nav: "Shopping List", tab: "Shop", title: "Shopping list", icon: "cart", sub: "Built from your meal plan and any recipes you have added",
    render(el, actions) {
      actions.innerHTML = `<button class="btn btn-outline btn-sm" id="cp" type="button">Copy</button><button class="btn btn-outline btn-sm" id="dl" type="button">Download</button><button class="btn btn-outline btn-sm" id="pr" type="button">Print</button><button class="btn btn-outline btn-sm" id="sh" type="button">Share</button>`;
      const uses = [];
      P.plan().forEach((d) => MEAL_SLOTS.forEach(([sl]) => uses.push({ id: d[sl], servings: 1 })));
      Store.get("shoppingExtras", []).forEach((x) => uses.push({ id: x.id, servings: x.servings }));
      Store.get("extraPlan", []).forEach((x) => uses.push({ id: x.id, servings: x.servings }));
      const groups = buildShoppingList(uses);
      const custom = Store.get("shopCustom", []);
      const checked = Store.get("shopChecked", {});
      const draw = () => {
        el.innerHTML = `<div class="reveal in" style="margin-bottom:22px;">${mediaFrame("ingredients.produce", "ratio-21x9")}</div><div class="panel">${groups.map((g) => `<div class="shop-cat"><h4>${g.cat}</h4>${g.items.map((i) => { const k = i.item + "|" + i.u; return `<label class="shop-item ${checked[k] ? "got" : ""}"><input type="checkbox" data-k="${esc(k)}" ${checked[k] ? "checked" : ""}><b>${esc(i.label)}</b><span>${esc(i.item)}</span></label>`; }).join("")}</div>`).join("")}
          ${custom.length ? `<div class="shop-cat"><h4>Added by you</h4>${custom.map((c, n) => `<label class="shop-item ${checked["c" + n] ? "got" : ""}"><input type="checkbox" data-k="c${n}" ${checked["c" + n] ? "checked" : ""}><span>${esc(c)}</span></label>`).join("")}</div>` : ""}
          <form id="addForm" class="two-fields" style="grid-template-columns:1fr auto;margin-top:10px;"><div class="field" style="margin:0;"><label class="sr-only" for="addItem">Add an item</label><input id="addItem" type="text" placeholder="Add an item, such as olive oil"></div><button class="btn btn-outline" type="submit">Add</button></form></div>`;
        el.querySelectorAll("input[data-k]").forEach((c) => c.addEventListener("change", () => { checked[c.dataset.k] = c.checked; Store.set("shopChecked", checked); c.closest(".shop-item").classList.toggle("got", c.checked); }));
        el.querySelector("#addForm").addEventListener("submit", (e) => { e.preventDefault(); const v = el.querySelector("#addItem").value.trim(); if (!v) return; custom.push(v); Store.set("shopCustom", custom); draw(); });
      };
      draw();
      const text = () => shoppingListToText(groups, "NOURA shopping list") + (custom.length ? "\nADDED BY YOU\n" + custom.map((c) => "  " + c).join("\n") : "");
      document.getElementById("cp").addEventListener("click", async () => { try { await navigator.clipboard.writeText(text()); toast("Shopping list copied."); } catch (e) { toast("Copy is not available in this browser."); } });
      document.getElementById("dl").addEventListener("click", () => { downloadText("noura-shopping-list.txt", text()); toast("Shopping list downloaded."); });
      document.getElementById("pr").addEventListener("click", () => window.print());
      document.getElementById("sh").addEventListener("click", async () => { if (navigator.share) { try { await navigator.share({ title: "NOURA shopping list", text: text() }); } catch (e) { /* cancelled */ } } else { try { await navigator.clipboard.writeText(text()); toast("Sharing is not available here, so the list was copied instead."); } catch (e) { toast("Sharing is not available in this browser."); } } });
    } },

  log: { nav: "Food Log", tab: "Log", title: "Food log", icon: "log", sub: "Notes, photos and how you felt",
    render(el) {
      let estimate = null;
      const draw = () => {
        const logs = P.logs();
        el.innerHTML = `<div class="cols c2">
          <div class="panel"><div class="panel-head"><h3>Add an entry</h3></div>
            <form id="logF"><div class="two-fields"><div class="field"><label for="m">Meal</label><select id="m"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></div><div class="field"><label for="t">What did you have?</label><input id="t" type="text" placeholder="Eggs on toast with spinach" required></div></div>
            <div class="rate-row"><label for="hg">Hunger before</label><input id="hg" type="range" min="1" max="5" value="3"><output id="hgv">3</output></div>
            <div class="rate-row"><label for="en">Energy after</label><input id="en" type="range" min="1" max="5" value="3"><output id="env">3</output></div>
            <div class="rate-row"><label for="md">Mood</label><input id="md" type="range" min="1" max="5" value="3"><output id="mdv">3</output></div>
            <div class="field" style="margin-top:18px;"><span class="label">Symptoms</span><div class="chips">${["None", "Bloating", "Heartburn", "Fatigue", "Headache", "Cravings"].map((o) => `<label class="chip"><input type="checkbox" name="sym" value="${o}"><span>${o}</span></label>`).join("")}</div></div>
            <div class="field"><label for="sup">Supplements taken <span class="hint">(optional)</span></label><input id="sup" type="text" placeholder="Vitamin D, magnesium"></div>
            <button class="btn btn-primary" type="submit">Save entry</button></form></div>
          <div class="stack">
            <div class="panel"><div class="panel-head"><h3>Photo log</h3></div>
              <label class="drop" for="photo" style="display:block;position:relative;"><input id="photo" type="file" accept="image/*"><strong style="display:block;color:var(--olive-deep);">Add a photo of your meal</strong><span class="small">Photos stay on your device in this demonstration.</span></label><div class="btn-row" style="margin-top:12px;"><button class="btn btn-outline btn-sm" id="samplePhoto" type="button">Try a sample photo</button></div>
              <div id="photoOut" class="mt">${estimate ? estimate : ""}</div></div>
            <div class="panel"><div class="panel-head"><h3>Recent entries</h3><span class="badge stone">${logs.length}</span></div>
              ${logs.slice(0, 8).map((l) => `<div class="list-row"><div class="grow"><strong>${esc(l.meal)}</strong><small>${esc(l.text)}</small></div><small>${ago(l.at)}</small></div>`).join("")}</div>
          </div></div>`;
        [["hg", "hgv"], ["en", "env"], ["md", "mdv"]].forEach(([a, b]) => el.querySelector("#" + a).addEventListener("input", (e) => { el.querySelector("#" + b).textContent = e.target.value; }));
        el.querySelector("#logF").addEventListener("submit", (e) => {
          e.preventDefault(); const f = e.target;
          Store.push("foodLog", { meal: f.m.value, text: f.t.value.trim(), hunger: Number(f.hg.value), energy: Number(f.en.value), mood: Number(f.md.value), symptoms: [...f.querySelectorAll("input[name=sym]:checked")].map((x) => x.value), supplements: f.sup.value.trim(), at: Date.now() });
          Store.push("activity", { who: ME.name, what: "added a food log entry", at: Date.now() });
          toast("Entry saved."); estimate = null; draw();
        });
        const showEstimate = (url, label) => {
          estimate = `<img src="${url}" alt="${label}" style="border-radius:16px;margin-bottom:16px;max-height:260px;width:100%;object-fit:cover;"><div class="estimate"><div class="label-sm">Estimate for review</div><p style="color:var(--charcoal);margin-top:6px;">This looks like a meal with a protein, a grain and vegetables. Please review the details and correct anything that is off.</p><ul><li>Protein: chicken or fish, about one palm</li><li>Grain: rice or similar, about one cupped hand</li><li>Vegetables: two or three colors</li></ul><p class="fine" style="margin-top:10px;">Photo estimates are approximate. Your dietitian reviews logs with you, and no one expects exact numbers.</p><div class="btn-row" style="margin-top:14px;"><button class="btn btn-primary btn-sm" id="confirmPhoto" type="button">Confirm and save</button></div></div>`;
          el.querySelector("#photoOut").innerHTML = estimate;
          el.querySelector("#confirmPhoto").addEventListener("click", () => { Store.push("foodLog", { meal: "Photo entry", text: "Meal photo, estimate confirmed", at: Date.now() }); toast("Saved to your food log."); estimate = null; draw(); });
        };
        el.querySelector("#photo").addEventListener("change", (e) => { const file = e.target.files[0]; if (file) showEstimate(URL.createObjectURL(file), "Your meal photo"); });
        el.querySelector("#samplePhoto").addEventListener("click", () => showEstimate(MEDIA["food.photoAnalysis"].src, MEDIA["food.photoAnalysis"].alt));
      };
      draw();
    } },

  checkin: { nav: "Weekly Check In", tab: "Check in", title: "Weekly check in", icon: "check", sub: "A few minutes each week helps your dietitian tailor your plan",
    render(el) {
      const FIELDS = [["Energy", "Low", "High"], ["Hunger", "Constant", "Settled"], ["Sleep", "Poor", "Restful"], ["Mood", "Low", "Bright"], ["Stress", "Calm", "Very high"], ["Digestion", "Uncomfortable", "Comfortable"]];
      const draw = () => {
        const past = P.checkins();
        el.innerHTML = `<div class="cols c21"><div class="panel"><div class="panel-head"><h3>How did this week feel?</h3></div>
          <form id="ck">${FIELDS.map(([k, a, b]) => `<div class="rate-row"><label for="r${k}">${k}<br><span class="fine" style="font-weight:400;letter-spacing:0;">${a} to ${b}</span></label><input id="r${k}" name="${k}" type="range" min="1" max="5" value="3"><output>3</output></div>`).join("")}
          <div class="field" style="margin-top:22px;"><label for="felt">In your own words</label><textarea id="felt" placeholder="What went well, and what was harder than expected?"></textarea></div>
          <div class="field"><label for="ask">Anything you would like to ask?</label><textarea id="ask" style="min-height:90px;" placeholder="Optional"></textarea></div>
          <button class="btn btn-primary" type="submit">Submit check in</button></form></div>
          <div class="panel"><div class="panel-head"><h3>Previous check ins</h3></div>${past.slice(0, 5).map((c) => `<div class="list-row" style="align-items:flex-start;"><div class="grow"><strong>${fmtDay(c.at)}</strong><small>${esc(c.felt || "No notes added.")}</small><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">${Object.entries(c.ratings).map(([k, v]) => `<span class="badge stone">${k} ${v}</span>`).join("")}</div></div></div>`).join("")}</div></div>`;
        el.querySelectorAll("#ck input[type=range]").forEach((r) => r.addEventListener("input", () => { r.nextElementSibling.textContent = r.value; }));
        el.querySelector("#ck").addEventListener("submit", (e) => {
          e.preventDefault(); const f = e.target; const ratings = {}; FIELDS.forEach(([k]) => { ratings[k] = Number(f[k].value); });
          Store.push("checkins", { at: Date.now(), ratings, felt: f.felt.value.trim(), ask: f.ask.value.trim(), client: ME.name });
          Store.push("activity", { who: ME.name, what: "submitted a weekly check in", at: Date.now() });
          toast("Check in sent. Thank you, " + ME.first + "."); draw();
        });
      };
      draw();
    } },

  progress: { nav: "Progress", tab: "Progress", title: "Progress", icon: "progress", sub: "Week five of twelve. Trends matter more than any single day.",
    render(el) {
      const labels = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5"];
      el.innerHTML = `<div class="cols c4"><div class="panel stat"><div class="k">Consistency</div><div class="v">82%</div><div class="d"><b>Up 3 points</b> on last week</div></div><div class="panel stat"><div class="k">Meals logged</div><div class="v">5/7</div><div class="d">days this week</div></div><div class="panel stat"><div class="k">Hydration</div><div class="v">91%</div><div class="d"><b>Up 6 points</b> on last week</div></div><div class="panel stat"><div class="k">Average sleep</div><div class="v">7.1 h</div><div class="d"><b>Up 0.9 h</b> since week one</div></div></div>
        <div class="cols c2 mt"><div class="panel"><div class="panel-head"><h3>Consistency</h3></div>${chartLine({ labels, series: [{ name: "Consistency", data: [58, 66, 72, 79, 82], color: "#3A4330" }], min: 40, max: 100, fmt: (v) => v + "%" })}</div>
        <div class="panel"><div class="panel-head"><h3>Energy and sleep</h3></div>${chartLine({ labels, series: [{ name: "Energy rating (of 5)", data: [2.6, 3.0, 3.3, 3.6, 3.9], color: "#B5654A" }, { name: "Sleep (hours, scaled)", data: [3.1, 3.2, 3.35, 3.45, 3.55], color: "#6E7D60" }], min: 2, max: 5 })}<p class="fine" style="margin-top:8px;">Sleep is drawn on the same scale as energy, so read it as a direction, not a value.</p></div></div>
        <div class="cols c2 mt"><div class="panel"><div class="panel-head"><h3>Habits this week</h3></div>${barRows([["Protein at breakfast", 6], ["Lunch before 2 PM", 5], ["Afternoon snack", 5], ["Evening walk", 4], ["Water goal met", 6]], " of 7")}</div>
        <div class="panel"><div class="panel-head"><h3>Milestones</h3></div><div class="timeline">${[["Week 5", "Lunch before 2 PM on five days out of seven"], ["Week 4", "First full week of logging every meal"], ["Week 3", "Afternoon energy rated four or higher for the first time"], ["Week 1", "Consultation and baseline completed"]].map(([w, t]) => `<div class="tl-item"><small>${w}</small><strong>${t}</strong></div>`).join("")}</div></div></div>`;
    } },

  ask: { nav: "Ask NOURA", tab: "Ask", title: "Ask NOURA", icon: "spark", sub: "Practical help between sessions. Your dietitian reviews anything clinical.",
    render(el) {
      el.innerHTML = `<div class="chat-shell" style="height:min(680px,76vh);"><div class="chat-top"><strong>NOURA Intelligence</strong><span class="status">With your plan</span></div><div class="chat-log" id="log" role="log"></div><div class="chat-foot"><div class="suggest" id="sug"></div><form class="composer" id="cform"><label class="sr-only" for="cin">Ask a nutrition question</label><input id="cin" type="text" placeholder="Ask about a swap, a trip, a menu" autocomplete="off"><button class="btn btn-primary" type="submit">Send</button></form></div></div>`;
      mountChat({ log: "log", form: "cform", input: "cin", suggest: "sug", name: ME.first });
    } },

  messages: { nav: "Messages", title: "Messages", icon: "mail", sub: "Secure messages with " + ME.pro,
    render(el) {
      const draw = () => {
        el.innerHTML = `<div class="panel"><div class="thread" id="th" tabindex="0" aria-label="Message thread">${P.messages().map((m) => `<div class="msg ${m.from}">${esc(m.text)}<small>${m.from === "me" ? "You" : ME.pro.split(" ").slice(0, 2).join(" ")} &middot; ${fmtDay(m.at)}, ${fmtTime(m.at)}</small></div>`).join("")}</div>
          <form id="mf" class="mt" style="display:flex;gap:10px;"><label class="sr-only" for="mt">Write a message</label><input id="mt" type="text" placeholder="Write a message" autocomplete="off" required><button class="btn btn-primary" type="submit">Send</button></form>
          <p class="fine mt">Messages are read on working days, usually within one business day. For anything urgent, contact your physician or local emergency services.</p></div>`;
        const th = el.querySelector("#th"); th.scrollTop = th.scrollHeight;
        el.querySelector("#mf").addEventListener("submit", (e) => { e.preventDefault(); const v = el.querySelector("#mt").value.trim(); if (!v) return; Store.push("messages", { from: "client", name: ME.name, text: v, at: Date.now() }); toast("Message sent."); draw(); });
      };
      draw();
    } },

  appointments: { nav: "Appointments", title: "Appointments", icon: "calendar", sub: "Upcoming and past sessions",
    render(el, actions) {
      actions.innerHTML = `<a class="btn btn-primary btn-sm" href="book.html">Book a session</a>`;
      const booked = Store.get("bookings", []).map((b) => ({ title: b.service, who: b.pro, when: new Date(b.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + " at " + b.time, fmt: b.format, ref: b.ref }));
      const upcoming = booked.concat([{ title: "Metabolic follow up", who: "Dr. Amara Vale", when: "Monday, October 5 at 9:00 AM", fmt: "Video", ref: "NOUA1B7" }]);
      el.innerHTML = `<div class="cols c21"><div class="stack"><div class="panel"><div class="panel-head"><h3>Upcoming</h3></div>${upcoming.map((a) => `<div class="list-row"><div class="grow"><strong>${esc(a.title)}</strong><small>${esc(a.who)} &middot; ${esc(a.when)} &middot; ${a.fmt === "Video" ? "Secure video" : "At the studio"}</small></div><span class="badge">Confirmed</span></div>`).join("")}</div>
        <div class="panel"><div class="panel-head"><h3>Past sessions</h3></div>${[["Metabolic follow up", "September 21"], ["Metabolic follow up", "September 7"], ["Comprehensive Nutrition Assessment", "August 24"]].map(([t, d]) => `<div class="list-row"><div class="grow"><strong>${t}</strong><small>Dr. Amara Vale &middot; ${d}</small></div><button class="btn btn-outline btn-sm" data-sum="${t}" type="button">Summary</button></div>`).join("")}</div></div>
        <div class="panel cream"><div class="label-sm">Before a video session</div><h4 style="margin:8px 0 10px;">Test your camera and sound</h4><p class="small" style="margin-bottom:18px;">A quick check now avoids surprises later. Nothing is recorded or sent.</p><button class="btn btn-primary btn-sm" id="cam" type="button">Run the test</button></div></div>`;
      el.querySelectorAll("[data-sum]").forEach((b) => b.addEventListener("click", () => openModal(`<h3>Session summary</h3><p class="label-sm" style="margin-bottom:14px;">${esc(b.dataset.sum)}</p><p class="small" style="color:var(--charcoal);margin-bottom:12px;">Your dietitian shares a written summary within two working days of each session. This is a sample.</p><ul class="ticks"><li>Protein at breakfast on most days is working well</li><li>Aim for lunch before 2 PM on meeting heavy days</li><li>Keep the 3:30 snack ready before the afternoon slump</li></ul>`)));
      el.querySelector("#cam").addEventListener("click", () => {
        openModal(`<h3>Camera and microphone check</h3><video id="v" autoplay muted playsinline style="width:100%;border-radius:16px;background:#2C2926;aspect-ratio:4/3;margin:14px 0;"></video><p class="small" id="vm">Press start and allow access when your browser asks.</p><div class="btn-row" style="margin-top:14px;"><button class="btn btn-primary btn-sm" id="vs" type="button">Start test</button></div>`, (m) => {
          let stream; const stop = () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
          const obs = new MutationObserver(() => { if (!document.body.contains(m)) { stop(); obs.disconnect(); } }); obs.observe(document.body, { childList: true });
          m.querySelector("#vs").addEventListener("click", async () => {
            const msg = m.querySelector("#vm");
            try { stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); m.querySelector("#v").srcObject = stream; msg.textContent = "Your camera and microphone are working. You are ready for your session."; }
            catch (err) { msg.textContent = "We could not access your camera or microphone. Please check your browser permissions and try again."; }
          });
        });
      });
    } },

  documents: { nav: "Documents", title: "Documents", icon: "doc", sub: "Plans, guides and forms shared with you",
    render(el) {
      const DOCS = [
        ["Your nutrition profile", "Preliminary profile from your assessment", () => { const a = Store.get("assessment"); return a ? `NOURA nutrition profile\n\n${a.profile.name}\n${a.profile.objective}\n\nStrengths:\n- ${a.profile.strengths.join("\n- ")}\n\nAreas to improve:\n- ${a.profile.improve.join("\n- ")}\n\nFocus: ${a.profile.focus}\n` : "NOURA nutrition profile\n\nThe Busy Professional\nSustainable nutrition and energy\n\nThis is a sample. Complete the assessment on the public site to see your own profile.\n"; }],
        ["Week five meal plan", "Prepared by Dr. Amara Vale", () => ["NOURA meal plan, week five", ""].concat(P.plan().flatMap((d, i) => [DAYS[i]].concat(MEAL_SLOTS.map(([sl, l]) => `  ${l}: ${getRecipe(d[sl]).title}`)).concat([""]))).join("\n")],
        ["Eating well when you travel", "A one page guide", () => "Eating well when you travel\n\n1. Start each morning with protein.\n2. Pack two easy snacks.\n3. Keep one meal a day close to your plan.\n4. Carry a water bottle.\n5. Enjoy the food. One flexible day is part of a balanced week.\n"],
        ["Hydration guide", "Practical tips for steady intake", () => "Hydration guide\n\nDrink steadily through the day. Keep a bottle where you work. Have a glass with each meal. Count tea, soup and water rich fruit. Pale straw colored urine is a handy guide.\n"],
        ["Consent and privacy summary", "What you agreed to and how your data is used", () => "Consent and privacy summary\n\nYour information is used to provide your care. You can request an export or deletion at any time by writing to hello@noura.example.\n"],
      ];
      el.innerHTML = `<div class="panel">${DOCS.map(([t, d], i) => `<div class="list-row"><div class="grow"><strong>${t}</strong><small>${d}</small></div><button class="btn btn-outline btn-sm" data-doc="${i}" type="button">Download</button></div>`).join("")}</div>`;
      el.querySelectorAll("[data-doc]").forEach((b) => b.addEventListener("click", () => { const d = DOCS[b.dataset.doc]; downloadText(d[0].toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".txt", d[2]()); toast("Downloaded."); }));
    } },

  profile: { nav: "Profile", tab: "Me", title: "Profile and privacy", icon: "user", sub: "Your preferences and your data",
    render(el) {
      const prefs = Store.get("prefs", { remind: true, weekly: true, news: false });
      const a = Store.get("assessment");
      el.innerHTML = `<div class="cols c2"><div class="stack">
        <div class="panel"><div class="who">${avatarHTML("clients.maya", "M", "lg")}<div><h3 style="font-size:30px;">${ME.name}</h3><p class="small">${ME.program} program &middot; Week ${ME.week} of ${ME.of}</p></div></div>
          <div class="mt"><div class="list-row"><div class="grow"><strong>Dietary preferences</strong><small>${a ? esc((a.answers.diet || []).join(", ")) : "No specific pattern, no pork"}</small></div></div><div class="list-row"><div class="grow"><strong>Allergies</strong><small>${a ? esc((a.answers.allergies || []).join(", ")) : "None recorded"}</small></div></div><div class="list-row"><div class="grow"><strong>Your dietitian</strong><small>${ME.pro}</small></div></div></div></div>
        <div class="panel"><div class="panel-head"><h3>Notifications</h3></div>${[["remind", "Appointment reminders", "Email and text, 24 hours before"], ["weekly", "Weekly check in reminder", "A gentle nudge each Sunday evening"], ["news", "The Notebook newsletter", "Occasional articles and recipes"]].map(([k, t, d]) => `<div class="list-row"><div class="grow"><strong>${t}</strong><small>${d}</small></div><label class="switch"><input type="checkbox" data-pref="${k}" ${prefs[k] ? "checked" : ""} aria-label="${t}"><span></span></label></div>`).join("")}</div></div>
        <div class="panel"><div class="panel-head"><h3>Your data</h3></div><p class="small" style="margin-bottom:18px;">You are in control of your information. You can download everything stored in this demonstration, or clear it.</p><div class="btn-row"><button class="btn btn-outline btn-sm" id="exp" type="button">Export my data</button><button class="btn btn-outline btn-sm" id="del" type="button">Delete my data</button></div>
          <hr class="rule mt"><div class="mt"><strong style="color:var(--olive-deep);">Consent</strong><p class="small mt" style="margin-top:6px;">You agreed to dietetic care and to the privacy notice on your booking. You can withdraw optional consents at any time by writing to hello@noura.example.</p></div></div></div>`;
      el.querySelectorAll("[data-pref]").forEach((c) => c.addEventListener("change", () => { prefs[c.dataset.pref] = c.checked; Store.set("prefs", prefs); toast("Preference saved."); }));
      el.querySelector("#exp").addEventListener("click", () => { const all = {}; Object.keys(localStorage).filter((k) => k.startsWith("noura:")).forEach((k) => { try { all[k.slice(6)] = JSON.parse(localStorage[k]); } catch (e) { all[k.slice(6)] = localStorage[k]; } }); downloadText("noura-my-data.json", JSON.stringify(all, null, 2), "application/json"); toast("Your data was downloaded."); });
      el.querySelector("#del").addEventListener("click", () => openModal(`<h3>Delete your data?</h3><p class="small" style="margin-bottom:22px;">This clears everything this demonstration has stored in your browser, including bookings, logs and messages. It cannot be undone.</p><div class="btn-row"><button class="btn btn-terracotta btn-sm" id="yes" type="button">Delete everything</button><button class="btn btn-outline btn-sm" id="no" type="button">Keep my data</button></div>`, (m, close) => { m.querySelector("#no").addEventListener("click", close); m.querySelector("#yes").addEventListener("click", () => { Object.keys(localStorage).filter((k) => k.startsWith("noura:")).forEach((k) => localStorage.removeItem(k)); close(); toast("Your demonstration data was cleared."); setTimeout(() => location.reload(), 900); }); }));
    } },
};

document.addEventListener("DOMContentLoaded", () => {
  const pending = Store.get("swaps", []).length;
  mountApp({
    routes: ROUTES, defaultRoute: "today", brand: "Client Portal",
    groups: [{ label: "My plan", items: ["today", "plan", "shopping", "log"] }, { label: "My progress", items: ["checkin", "progress", "ask"] }, { label: "My care", items: ["messages", "appointments", "documents", "profile"] }],
    tabbar: ["today", "plan", "log", "progress", "more"],
  });
});

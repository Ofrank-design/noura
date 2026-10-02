/* ==========================================================================
   NOURA: dietitian dashboard (demonstration)
   Signed in as Dr. Amara Vale. Sample data is generated here. Actions taken
   in the public site and the client portal (assessments, bookings, check ins,
   messages, swap requests) appear here through shared local storage.
   In production each view reads from authenticated, role checked APIs.
   ========================================================================== */

const NOW = Date.now(), DAY = 86400000, DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const D = { pro: "Dr. Amara Vale" };

const CLIENTS = [
  { id: "maya", name: "Maya Johnson", age: 38, program: "Metabolic", week: 5, of: 12, status: "Active", adh: 82, last: 0, next: "Oct 5, 9:00 AM", pro: "Dr. Vale", goal: "Steadier energy and metabolic health", archetype: "The Metabolic Planner", trend: [58, 66, 72, 79, 82] },
  { id: "priya", name: "Priya Raman", age: 41, program: "Balance", week: 6, of: 8, status: "Active", adh: 88, last: 1, next: "Oct 2, 11:00 AM", pro: "Dr. Vale", goal: "Sustainable weight management", archetype: "The Busy Professional", trend: [60, 70, 76, 84, 86, 88] },
  { id: "daniel", name: "Daniel Brooks", age: 54, program: "Metabolic", week: 9, of: 12, status: "Active", adh: 91, last: 0, next: "Oct 6, 2:00 PM", pro: "Dr. Vale", goal: "Cholesterol and blood sugar", archetype: "The Metabolic Planner", trend: [70, 76, 82, 86, 88, 90, 90, 91, 91] },
  { id: "elena", name: "Elena Ruiz", age: 47, program: "Private", week: 14, of: 24, status: "Active", adh: 94, last: 0, next: "Oct 1, 8:00 AM", pro: "Dr. Vale", goal: "Perimenopause nutrition", archetype: "The Life Stage Navigator", trend: [74, 80, 85, 88, 90, 92, 93, 94] },
  { id: "tom", name: "Tom Whitfield", age: 45, program: "Balance", week: 2, of: 8, status: "At Risk", adh: 46, last: 6, next: "Oct 3, 4:00 PM", pro: "Daniel Okafor", goal: "Weight management", archetype: "The Busy Professional", trend: [70, 46] },
  { id: "hannah", name: "Hannah Cole", age: 29, program: "Reset", week: 3, of: 4, status: "Active", adh: 79, last: 1, next: "Oct 2, 3:00 PM", pro: "Leila Haddad", goal: "Nutrition foundations", archetype: "The Fresh Starter", trend: [62, 72, 79] },
  { id: "marcus", name: "Marcus Lee", age: 36, program: "Balance", week: 8, of: 8, status: "Completed", adh: 90, last: 3, next: "Maintenance review Oct 14", pro: "Daniel Okafor", goal: "Performance nutrition", archetype: "The Active Performer", trend: [64, 72, 80, 84, 86, 88, 89, 90] },
  { id: "sara", name: "Sara Nilsson", age: 52, program: "Metabolic", week: 3, of: 12, status: "At Risk", adh: 52, last: 8, next: "Oct 2, 10:00 AM", pro: "Leila Haddad", goal: "Blood sugar management", archetype: "The Metabolic Planner", trend: [68, 60, 52] },
  { id: "chloe", name: "Chloe Park", age: 33, program: "Reset", week: 1, of: 4, status: "Onboarding", adh: 70, last: 0, next: "Oct 4, 9:00 AM", pro: "Leila Haddad", goal: "Digestive comfort", archetype: "The Comfort Seeker", trend: [70] },
  { id: "james", name: "James Okoye", age: 49, program: "Private", week: 6, of: 24, status: "Active", adh: 87, last: 1, next: "Oct 2, 5:00 PM", pro: "Dr. Vale", goal: "Executive performance and sleep", archetype: "The Busy Professional", trend: [66, 72, 78, 83, 86, 87] },
  { id: "nadia", name: "Nadia Haddad", age: 40, program: "Balance", week: 4, of: 8, status: "Active", adh: 76, last: 2, next: "Oct 5, 1:00 PM", pro: "Leila Haddad", goal: "Postpartum nutrition", archetype: "The Life Stage Navigator", trend: [60, 68, 74, 76] },
  { id: "ben", name: "Ben Carter", age: 31, program: "Reset", week: 4, of: 4, status: "Inactive", adh: 28, last: 21, next: "None booked", pro: "Daniel Okafor", goal: "Better habits", archetype: "The Steady Builder", trend: [64, 52, 40, 28] },
  { id: "olivia", name: "Olivia Grant", age: 58, program: "Metabolic", week: 11, of: 12, status: "Active", adh: 89, last: 2, next: "Oct 7, 11:00 AM", pro: "Dr. Vale", goal: "Cholesterol management", archetype: "The Metabolic Planner", trend: [66, 72, 78, 82, 85, 86, 87, 88, 88, 89, 89] },
];
const STAGES = ["New Lead", "Assessment Completed", "Consultation Requested", "Consultation Booked"];
const LIFE = ["Onboarding", "Active", "At Risk", "Completed", "Inactive"];
const LEADS_SEED = [
  { name: "Omar Farouk", goal: "Steadier energy", archetype: "The Busy Professional", program: "Balance", stage: "New Lead", source: "Search", at: NOW - 2 * 3600000 },
  { name: "Anna Lind", goal: "Digestive comfort", archetype: "The Comfort Seeker", program: "Balance", stage: "New Lead", source: "Referral", at: NOW - 20 * 3600000 },
  { name: "Rachel Kim", goal: "Metabolic health", archetype: "The Metabolic Planner", program: "Metabolic", stage: "Assessment Completed", source: "Website assessment", at: NOW - DAY },
  { name: "Kofi Mensah", goal: "Performance and recovery", archetype: "The Active Performer", program: "Balance", stage: "Assessment Completed", source: "Social", at: NOW - 2 * DAY },
  { name: "Julia Brandt", goal: "Women's health", archetype: "The Life Stage Navigator", program: "Balance", stage: "Consultation Requested", source: "Referral", at: NOW - 2 * DAY },
  { name: "Victor Alvarez", goal: "Weight management", archetype: "The Fresh Starter", program: "Reset", stage: "Consultation Booked", source: "Website booking", at: NOW - 3 * DAY },
];
const SEED_MSGS = [
  { name: "Priya Raman", text: "Could we move Thursday's session to the afternoon? I have a flight in the morning.", at: NOW - 3 * 3600000, unread: true },
  { name: "Tom Whitfield", text: "Sorry I have been quiet. Work has been hectic. Is it too late to catch up?", at: NOW - 5 * 3600000, unread: true },
  { name: "Daniel Brooks", text: "My labs came back and I would love to go through them at our next session.", at: NOW - DAY, unread: false },
  { name: "Nadia Haddad", text: "The salmon tray bake was a hit with the whole family. Thank you!", at: NOW - 2 * DAY, unread: false },
];
const INVOICES = [
  { id: "INV 2041", client: "Maya Johnson", item: "Metabolic program, installment 2 of 3", amt: 630, status: "Paid", at: NOW - 2 * DAY },
  { id: "INV 2040", client: "Priya Raman", item: "Balance program, final installment", amt: 430, status: "Paid", at: NOW - 3 * DAY },
  { id: "INV 2039", client: "Elena Ruiz", item: "Private program, month 4", amt: 1200, status: "Paid", at: NOW - 5 * DAY },
  { id: "INV 2038", client: "Tom Whitfield", item: "Balance program, installment 1 of 3", amt: 430, status: "Failed", at: NOW - 6 * DAY },
  { id: "INV 2037", client: "Hannah Cole", item: "Follow up consultation", amt: 140, status: "Paid", at: NOW - 7 * DAY },
  { id: "INV 2036", client: "Sara Nilsson", item: "Metabolic program, installment 1 of 3", amt: 630, status: "Outstanding", at: NOW - 8 * DAY },
  { id: "INV 2035", client: "Ben Carter", item: "Reset program", amt: 690, status: "Failed", at: NOW - 12 * DAY },
  { id: "INV 2034", client: "James Okoye", item: "Private program, month 2", amt: 1200, status: "Paid", at: NOW - 14 * DAY },
];

const byId = (id) => CLIENTS.find((c) => c.id === id) || CLIENTS[0];
const initials = (n) => n.split(" ").map((x) => x[0]).slice(0, 2).join("");
const statusBadge = (s) => `<span class="badge ${s === "At Risk" || s === "Failed" ? "warn" : s === "Inactive" || s === "Outstanding" ? "stone" : s === "Completed" ? "dark" : ""}">${s}</span>`;
const av = (c, size = "sm") => c.id === "maya" ? avatarHTML("clients.maya", initials(c.name), size) : `<span class="avatar ${size}">${initials(c.name)}</span>`;
const person = (c) => `<div class="who">${av(c)}<div><span class="name">${esc(c.name)}</span><small>${esc(c.program)} &middot; week ${c.week}</small></div></div>`;

function allLeads() { return Store.get("leads", []).concat(LEADS_SEED); }
function allMessages() {
  const live = Store.get("messages", []).filter((m) => m.from === "client").map((m) => ({ name: m.name || "Maya Johnson", text: m.text, at: m.at, unread: true }));
  return live.concat(SEED_MSGS);
}
function needsAttention() {
  const items = [];
  Store.get("checkins", []).slice(0, 2).forEach((c) => items.push({ t: "New weekly check in from " + (c.client || "Maya Johnson"), s: ago(c.at), r: "client/maya", tone: "ok" }));
  Store.get("swaps", []).filter((x) => x.status === "Needs review").slice(0, 3).forEach((x) => items.push({ t: `Swap request: ${x.from}`, s: `${x.to} &middot; ${ago(x.at)}`, r: "plans", tone: "warn" }));
  Store.get("planRequests", []).filter((x) => x.status === "Needs review").slice(0, 2).forEach((x) => items.push({ t: "Plan change requested", s: esc((x.why || []).join(", ") || x.note || "See details") + " &middot; " + ago(x.at), r: "plans", tone: "warn" }));
  allLeads().filter((l) => l.stage === "Consultation Requested").slice(0, 1).forEach((l) => items.push({ t: `Application to review: ${l.name}`, s: ago(l.at), r: "clients", tone: "warn" }));
  items.push({ t: "Tom Whitfield has not logged for six days", s: "Balance, week 2", r: "client/tom", tone: "warn" });
  items.push({ t: "Sara Nilsson missed her last check in", s: "Metabolic, week 3", r: "client/sara", tone: "warn" });
  items.push({ t: "Daniel Brooks shared new lab results", s: "Review before Oct 6", r: "client/daniel", tone: "ok" });
  return items;
}

function sec(title, inner, extra = "") { return `<div class="panel ${extra}"><div class="panel-head"><h3>${title}</h3></div>${inner}</div>`; }
function tableOf(head, rows, cls = "") { return `<div class="tbl-wrap"><table class="tbl ${cls}"><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>`; }

const ROUTES = {
  overview: { nav: "Overview", title: "Good morning, Dr. Vale", icon: "grid", sub: () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + ". Here is the practice at a glance.",
    render(el) {
      const att = needsAttention();
      const sched = [["8:00 AM", "Elena Ruiz", "Private program review", "Video"], ["10:00 AM", "Sara Nilsson", "Metabolic follow up", "Studio"], ["1:30 PM", "New client: Victor Alvarez", "Initial consultation", "Video"]];
      el.innerHTML = `
        <div class="cols c3">
          ${[["Active clients", "48", "<b>Up 6</b> this month"], ["Consultations", "34", "this month"], ["Monthly revenue", "$42,600", "<b>Up 8%</b> on August"], ["Client retention", "91%", "<b>Up 2 points</b>"], ["Program completion", "84%", "last 90 days"], ["New clients", "6", "this month"]].map(([k, v, d]) => `<div class="panel stat"><div class="k">${k}</div><div class="v">${v}</div><div class="d">${d}</div></div>`).join("")}
        </div>
        <div class="cols c21 mt">
          ${sec("Revenue", chartLine({ labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"], series: [{ name: "Revenue", data: [28400, 31200, 34800, 36100, 39400, 42600], color: "#3A4330" }], min: 20000, max: 46000, fmt: (v) => "$" + (v / 1000).toFixed(0) + "k" }))}
          <div class="panel olive"><div class="label-sm">NOURA Intelligence</div><h3 style="margin:10px 0 14px;font-size:28px;">Insights for this week</h3>
            <div class="insight" style="border-color:rgba(247,242,233,.16);"><span class="dot"></span><p>Client engagement dropped 22% this week. Three clients may be at risk of disengaging.</p></div>
            <div class="insight" style="border-color:rgba(247,242,233,.16);"><span class="dot ok"></span><p>Clients who log breakfast are 34% more likely to complete their program.</p></div>
            <div class="insight" style="border-color:transparent;"><span class="dot"></span><p>Assessment completions rose 18% after the new reminder email went live.</p></div>
            <button class="btn btn-light btn-sm" data-route="intelligence" type="button" style="margin-top:14px;">Open insights</button></div>
        </div>
        <div class="cols c2 mt">
          ${sec("Needs your attention", att.slice(0, 6).map((a) => `<div class="list-row"><span class="insight" style="padding:0;border:0;"><span class="dot ${a.tone}"></span></span><div class="grow"><strong>${a.t}</strong><small>${a.s}</small></div><button class="btn btn-outline btn-sm" data-route="${a.r}" type="button">Open</button></div>`).join(""))}
          ${sec("Today's schedule", sched.map(([t, n, k, f]) => `<div class="list-row"><div style="min-width:78px;font-family:var(--serif);font-size:22px;color:var(--olive-deep);">${t}</div><div class="grow"><strong>${n}</strong><small>${k}</small></div><span class="badge stone">${f}</span></div>`).join("") + `<div class="mt"><button class="btn btn-outline btn-sm" data-route="appointments" type="button">Full schedule</button></div>`)}
        </div>
        <div class="cols c3 mt">
          ${sec("Engagement", barRows([["Portal usage", 91], ["Weekly check ins", 83], ["Meal logging", 78], ["Plan activity", 74]], "%"))}
          ${sec("Website funnel", barRows([["Assessment starts", 420], ["Completed", 312], ["Consultations booked", 58]]) + `<p class="fine" style="margin-top:10px;">Completion rate 74%. Booking rate 19% of completions.</p>`)}
          ${sec("Program mix", barRows([["Balance", 17], ["Metabolic", 14], ["Reset", 11], ["Private", 6]], " clients"))}
        </div>`;
    } },

  clients: { nav: "Clients and CRM", title: "Clients and CRM", icon: "users", sub: "Every lead and client in one pipeline", badge: true,
    render(el, actions) {
      actions.innerHTML = `<button class="btn btn-outline btn-sm" id="exp" type="button">Export CSV</button>`;
      let q = "", st = "All";
      const draw = () => {
        const list = CLIENTS.filter((c) => (st === "All" || c.status === st) && (!q || (c.name + c.program + c.goal).toLowerCase().includes(q)));
        const leads = allLeads();
        el.innerHTML = `
          <div class="panel"><div class="filters"><div class="field"><label class="sr-only" for="sq">Search clients</label><input id="sq" type="search" placeholder="Search by name, program or goal" value="${esc(q)}"></div><label class="sr-only" for="ss">Status</label><select id="ss" class="sel-inline">${["All"].concat(LIFE).map((o) => `<option ${o === st ? "selected" : ""}>${o}</option>`).join("")}</select><span class="count" style="margin-left:auto;">${list.length} clients</span></div>
          ${tableOf(["Client", "Program", "Status", "Adherence", "Trend", "Last active", "Next session"], list.map((c) => `<tr class="click" tabindex="0" data-open="${c.id}"><td>${person(c)}</td><td>${c.program}<small>${c.week} of ${c.of} weeks</small></td><td>${statusBadge(c.status)}</td><td class="num"><b>${c.adh}%</b></td><td>${spark(c.trend, c.adh < 60 ? "#B5654A" : "#3A4330")}</td><td>${c.last === 0 ? "Today" : c.last + (c.last === 1 ? " day ago" : " days ago")}</td><td>${esc(c.next)}</td></tr>`).join(""))}</div>
          <h2 style="font-size:32px;margin:40px 0 16px;">Lead pipeline</h2>
          <div class="kanban">${STAGES.map((s) => { const ls = leads.filter((l) => l.stage === s); return `<div class="kcol"><h5>${s}<span>${ls.length}</span></h5>${ls.slice(0, 6).map((l) => `<div class="kcard"><b>${esc(l.name)}</b><small>${esc(l.goal || "")}${l.archetype ? " &middot; " + esc(l.archetype) : ""}</small><br><small>${esc(l.source || "")} &middot; ${ago(l.at)}</small></div>`).join("") || '<div class="fine">No leads here.</div>'}</div>`; }).join("")}</div>
          <h2 style="font-size:32px;margin:40px 0 16px;">Client lifecycle</h2>
          <div class="kanban">${LIFE.map((s) => { const cs = CLIENTS.filter((c) => c.status === s); return `<div class="kcol"><h5>${s}<span>${cs.length}</span></h5>${cs.map((c) => `<div class="kcard" style="cursor:pointer;" data-open="${c.id}"><b>${esc(c.name)}</b><small>${c.program}, week ${c.week} &middot; ${c.adh}%</small></div>`).join("") || '<div class="fine">Nobody here.</div>'}</div>`; }).join("")}</div>`;
        el.querySelector("#sq").addEventListener("input", (e) => { q = e.target.value.toLowerCase(); const pos = e.target.selectionStart; draw(); const n = el.querySelector("#sq"); n.focus(); n.setSelectionRange(pos, pos); });
        el.querySelector("#ss").addEventListener("change", (e) => { st = e.target.value; draw(); });
        el.querySelectorAll("[data-open]").forEach((r) => { r.addEventListener("click", () => { location.hash = "client/" + r.dataset.open; }); r.addEventListener("keydown", (e) => { if (e.key === "Enter") location.hash = "client/" + r.dataset.open; }); });
      };
      draw();
      document.getElementById("exp").addEventListener("click", () => { const rows = [["Name", "Program", "Week", "Status", "Adherence", "Next session"]].concat(CLIENTS.map((c) => [c.name, c.program, c.week, c.status, c.adh + "%", c.next])); downloadText("noura-clients.csv", rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n"), "text/csv"); toast("Client list exported."); });
    } },

  client: { nav: "Client", title: "Client", icon: "user", hidden: true,
    render(el, actions) {
      const id = location.hash.split("/")[1] || "maya", c = byId(id);
      document.getElementById("viewTitle").textContent = c.name;
      actions.innerHTML = `<button class="btn btn-outline btn-sm" data-route="clients" type="button">All clients</button><button class="btn btn-primary btn-sm" id="msgBtn" type="button">Message</button>`;
      const TABS = ["Overview", "Clinical notes", "Assessment", "Nutrition plan", "Food log", "Progress", "Messages", "Billing", "AI insights"];
      let tab = 0;
      const checkins = Store.get("checkins", []).concat([{ at: NOW - 7 * DAY, ratings: { Energy: 4, Hunger: 3, Sleep: 3, Mood: 4, Stress: 3, Digestion: 4 }, felt: "A steadier week overall. Tuesday was the hardest, with back to back meetings.", seed: true }]);
      const draw = () => {
        el.innerHTML = `<div class="panel" style="margin-bottom:22px;"><div class="who" style="gap:18px;flex-wrap:wrap;">${av(c, "lg")}<div style="flex:1;min-width:220px;"><h3 style="font-size:30px;">${esc(c.name)}, ${c.age}</h3><p class="small">${esc(c.goal)}</p></div><div style="display:flex;gap:26px;flex-wrap:wrap;"><div><div class="label-sm">Program</div><strong>${c.program}</strong></div><div><div class="label-sm">Progress</div><strong>Week ${c.week} of ${c.of}</strong></div><div><div class="label-sm">Next session</div><strong>${esc(c.next)}</strong></div><div><div class="label-sm">Status</div>${statusBadge(c.status)}</div></div></div></div>
          <div class="tabs" role="tablist">${TABS.map((t, i) => `<button type="button" role="tab" data-t="${i}" aria-selected="${i === tab}">${t}</button>`).join("")}</div><div id="tabBody"></div>`;
        el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => { tab = Number(b.dataset.t); draw(); }));
        body(el.querySelector("#tabBody"));
      };
      function body(t) {
        if (tab === 0) {
          const last = checkins[0];
          t.innerHTML = `<div class="cols c21"><div class="stack">${sec("Latest weekly check in", `<p class="small" style="margin-bottom:12px;">${ago(last.at)}${last.seed ? "" : " &middot; new"}</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">${Object.entries(last.ratings).map(([k, v]) => `<span class="badge ${v <= 2 && k !== "Stress" ? "warn" : ""}">${k} ${v} of 5</span>`).join("")}</div><p style="color:var(--charcoal);">&ldquo;${esc(last.felt || "No notes added.")}&rdquo;</p>${last.ask ? `<p class="small mt"><strong>Question:</strong> ${esc(last.ask)}</p>` : ""}`)}
            ${sec("Activity", `<div class="timeline">${Store.get("activity", []).slice(0, 4).map((a) => `<div class="tl-item"><small>${ago(a.at)}</small><strong>${esc(a.who)} ${esc(a.what)}</strong></div>`).join("")}${[["Yesterday", "Logged breakfast and lunch"], ["2 days ago", "Completed the hydration goal"], ["5 days ago", "Viewed the week five meal plan"], ["7 days ago", "Submitted a weekly check in"]].map(([w, x]) => `<div class="tl-item"><small>${w}</small><strong>${x}</strong></div>`).join("")}</div>`)}</div>
            <div class="stack"><div class="panel"><div class="ring-set">${ringChart(c.adh, "Adherence", c.adh < 60 ? "var(--terracotta)" : "var(--olive)")}${ringChart(Math.min(100, c.adh + 6), "Hydration", "var(--sage-deep)")}</div></div>
            <div class="panel cream"><div class="label-sm">Archetype</div><h4 style="margin:8px 0;">${esc(c.archetype)}</h4><p class="small">From the website assessment. Review it together at the next session.</p></div></div></div>`;
        } else if (tab === 1) {
          const key = "notes:" + c.id, n = Store.get(key, { S: "Reports steadier afternoons since moving lunch earlier. Travel next week is a concern.", O: "Weight stable. Fasting glucose 96 mg/dL on the most recent panel shared. Averaging 5 of 7 days logged.", A: "Good progress on meal rhythm. Lunch timing on meeting heavy days remains the main barrier.", P: "Maintain protein anchored breakfast. Add a travel snack kit. Review the plan after the trip." });
          t.innerHTML = `<div class="panel"><div class="panel-head"><h3>Consultation notes</h3><div class="btn-row"><button class="btn btn-outline btn-sm" id="draft" type="button">Draft from check in</button><button class="btn btn-primary btn-sm" id="saveN" type="button">Save notes</button></div></div>${[["S", "Subjective"], ["O", "Objective"], ["A", "Assessment"], ["P", "Plan"]].map(([k, l]) => `<div class="field"><label for="n${k}">${l}</label><textarea id="n${k}" style="min-height:96px;">${esc(n[k])}</textarea></div>`).join("")}<p class="fine">Notes are private to the care team. In production every change is versioned and recorded in the audit log.</p></div>`;
          t.querySelector("#saveN").addEventListener("click", () => { const o = {}; ["S", "O", "A", "P"].forEach((k) => { o[k] = t.querySelector("#n" + k).value; }); Store.set(key, o); toast("Notes saved."); });
          t.querySelector("#draft").addEventListener("click", () => { const l = checkins[0]; t.querySelector("#nS").value = `Client reports: "${l.felt || "no notes"}". Ratings this week: ` + Object.entries(l.ratings).map(([k, v]) => `${k.toLowerCase()} ${v}/5`).join(", ") + "."; toast("Draft added for your review. Edit before saving."); });
        } else if (tab === 2) {
          const A = [["Primary goal", c.goal], ["Dietary preferences", "No specific pattern"], ["Allergies", "None recorded"], ["Eating pattern", "Irregular, with skipped meals"], ["Hydration", "4 to 5 glasses a day at baseline"], ["Sleep", "6 to 7 hours"], ["Activity", "Moderate, three sessions a week"], ["Stress", "4 of 5"], ["Work and travel", "Hybrid, travels monthly"], ["Cooking", "Cooks a few times a week"], ["Health concerns", "Blood sugar or insulin; low energy"], ["Biggest challenge", "Staying consistent"]];
          t.innerHTML = sec("Assessment answers", `<dl class="kv">${A.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`);
        } else if (tab === 3) {
          const plan = Store.get("planOverride") || SAMPLE_WEEK;
          t.innerHTML = sec("Current week", `<div class="tbl-wrap">${tableOf(["Day", "Breakfast", "Lunch", "Snack", "Dinner"], plan.map((d, i) => `<tr><td><b>${DAYS[i]}</b></td>${MEAL_SLOTS.map(([sl]) => `<td>${esc(getRecipe(d[sl]).title)}</td>`).join("")}</tr>`).join(""))}</div><div class="btn-row mt"><button class="btn btn-primary btn-sm" data-route="plans" type="button">Open plan builder</button></div>`);
        } else if (tab === 4) {
          const logs = Store.get("foodLog", []).concat([{ meal: "Breakfast", text: "Greek yogurt bowl with plums and oats", at: NOW - DAY - 3 * 3600000 }, { meal: "Lunch", text: "Lentil and roasted carrot salad", at: NOW - DAY - 6 * 3600000 }, { meal: "Dinner", text: "Salmon sheet pan with broccoli and potatoes", at: NOW - DAY - 14 * 3600000 }, { meal: "Snack", text: "Apple, almond butter and cottage cheese", at: NOW - 2 * DAY }]);
          t.innerHTML = sec("Recent entries", logs.slice(0, 10).map((l) => `<div class="list-row"><div class="grow"><strong>${esc(l.meal)}</strong><small>${esc(l.text)}${l.symptoms && l.symptoms.length ? " &middot; Symptoms: " + esc(l.symptoms.join(", ")) : ""}${l.energy ? " &middot; Energy " + l.energy + " of 5" : ""}</small></div><small>${ago(l.at)}</small></div>`).join(""));
        } else if (tab === 5) {
          t.innerHTML = `<div class="cols c2">${sec("Adherence", chartLine({ labels: c.trend.map((_, i) => "Wk " + (i + 1)), series: [{ name: "Adherence", data: c.trend, color: "#3A4330" }], min: 20, max: 100, fmt: (v) => v + "%" }))}${sec("Weekly ratings", chartLine({ labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5"], series: [{ name: "Energy", data: [2.6, 3.0, 3.3, 3.6, 3.9], color: "#B5654A" }, { name: "Hunger settled", data: [2.4, 2.8, 3.0, 3.3, 3.5], color: "#6E7D60" }], min: 1, max: 5 }))}</div>`;
        } else if (tab === 6) {
          const thread = Store.get("messages", []).slice().reverse().map((m) => ({ f: m.from === "client" ? "them" : "me", text: m.text, at: m.at }));
          const base = [{ f: "me", text: "Hi Maya, your week five plan is ready. I moved Thursday's lunch to a recipe that travels better.", at: NOW - 2 * DAY - 3600000 }, { f: "them", text: "Thank you! The lentil salad worked really well at the office last week.", at: NOW - 2 * DAY + 1800000 }];
          const all = base.concat(thread).sort((a, b) => a.at - b.at);
          t.innerHTML = `<div class="panel"><div class="thread">${all.map((m) => `<div class="msg ${m.f === "me" ? "me" : "them"}">${esc(m.text)}<small>${fmtDay(m.at)}, ${fmtTime(m.at)}</small></div>`).join("")}</div><form id="rf" class="mt" style="display:flex;gap:10px;"><label class="sr-only" for="rt">Reply</label><input id="rt" type="text" placeholder="Write a reply" required><button class="btn btn-primary" type="submit">Send</button></form></div>`;
          t.querySelector("#rf").addEventListener("submit", (e) => { e.preventDefault(); const v = t.querySelector("#rt").value.trim(); if (!v) return; Store.push("messages", { from: "dietitian", text: v, at: Date.now() }); toast("Reply sent."); draw(); });
        } else if (tab === 7) {
          const inv = INVOICES.filter((i) => i.client === c.name);
          t.innerHTML = sec("Invoices and payments", inv.length ? tableOf(["Invoice", "Item", "Amount", "Status", "Date"], inv.map((i) => `<tr><td>${i.id}</td><td>${esc(i.item)}</td><td class="num">${money(i.amt)}</td><td>${statusBadge(i.status)}</td><td>${fmtDay(i.at)}</td></tr>`).join("")) : `<div class="empty-note">No invoices for this client in the sample data.</div>`);
        } else {
          t.innerHTML = sec("Suggestions for your review", [["Lunch timing is the strongest lever.", `${c.name.split(" ")[0]} reports the best afternoons on days with lunch before 2 PM. Consider anchoring the plan around that.`], ["Travel is coming up.", "A trip is mentioned in the last check in. A travel snack kit and a flexible plan for two days could help."], ["Hydration is improving.", "Water intake is up six points on last week. A brief note of encouragement may reinforce it."]].map(([h, d]) => `<div class="insight"><span class="dot"></span><div><strong style="color:var(--olive-deep);">${h}</strong><p class="small">${d}</p></div></div>`).join("") + `<p class="fine mt">Suggestions are drafts to support your judgment. They are never sent to clients or added to a plan without approval.</p>`);
        }
      }
      draw();
      document.getElementById("msgBtn").addEventListener("click", () => { tab = 6; draw(); });
    } },

  appointments: { nav: "Appointments", title: "Appointments", icon: "calendar", sub: "Today and the days ahead",
    render(el) {
      const live = Store.get("bookings", []).map((b) => ({ when: new Date(b.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + ", " + b.time, who: b.name, kind: b.service, fmt: b.format, pro: b.pro, ref: b.ref, fresh: true }));
      const base = [["Thu, Oct 1, 8:00 AM", "Elena Ruiz", "Private program review", "Video", "Dr. Vale"], ["Thu, Oct 1, 10:00 AM", "Sara Nilsson", "Metabolic follow up", "Studio", "Leila Haddad"], ["Thu, Oct 1, 1:30 PM", "Victor Alvarez", "Initial consultation", "Video", "Dr. Vale"], ["Fri, Oct 2, 10:00 AM", "Sara Nilsson", "Metabolic follow up", "Studio", "Leila Haddad"], ["Fri, Oct 2, 11:00 AM", "Priya Raman", "Balance follow up", "Video", "Dr. Vale"], ["Fri, Oct 2, 3:00 PM", "Hannah Cole", "Reset follow up", "Video", "Leila Haddad"], ["Mon, Oct 5, 9:00 AM", "Maya Johnson", "Metabolic follow up", "Video", "Dr. Vale"]].map(([when, who, kind, fmt, pro]) => ({ when, who, kind, fmt, pro }));
      el.innerHTML = `<div class="cols c21">${sec("Upcoming", tableOf(["When", "Client", "Session", "Format", "With"], live.concat(base).map((a) => `<tr><td><b>${a.when}</b></td><td>${esc(a.who)}${a.fresh ? ' <span class="badge">New booking</span>' : ""}</td><td>${esc(a.kind)}</td><td>${a.fmt === "Video" ? "Video" : "Studio"}</td><td>${esc(a.pro)}</td></tr>`).join("")))}
        <div class="stack">${sec("Before each video session", `<ul class="ticks"><li>Intake and consent forms complete</li><li>Camera and sound test passed</li><li>Latest check in reviewed</li><li>Notes template opened</li></ul>`)}${sec("Availability", `<p class="small" style="margin-bottom:14px;">Weekdays, 8:00 AM to 6:00 PM Pacific. Bookings from the website appear here instantly.</p>${barRows([["Dr. Vale", 78], ["Leila Haddad", 64], ["Daniel Okafor", 59]], "% booked")}`)}</div></div>`;
    } },

  messages: { nav: "Messages", title: "Messages", icon: "inbox", badge: true, sub: "Client conversations",
    render(el) {
      const ms = allMessages();
      el.innerHTML = sec("Inbox", ms.map((m) => `<div class="list-row" style="align-items:flex-start;"><span class="avatar">${initials(m.name)}</span><div class="grow"><strong>${esc(m.name)} ${m.unread ? '<span class="badge warn">New</span>' : ""}</strong><small>${esc(m.text)}</small></div><div style="text-align:right;"><small>${ago(m.at)}</small><br><button class="btn btn-outline btn-sm" data-reply="${esc(m.name)}" type="button" style="margin-top:6px;">Reply</button></div></div>`).join(""));
      el.querySelectorAll("[data-reply]").forEach((b) => b.addEventListener("click", () => openModal(`<h3>Reply to ${esc(b.dataset.reply)}</h3><form id="rp"><div class="field mt"><label for="rx">Message</label><textarea id="rx" required></textarea></div><button class="btn btn-primary btn-block" type="submit">Send reply</button></form>`, (m, close) => { m.querySelector("#rp").addEventListener("submit", (e) => { e.preventDefault(); Store.push("messages", { from: "dietitian", text: m.querySelector("#rx").value.trim(), at: Date.now() }); close(); toast("Reply sent."); }); })));
    } },
};

Object.assign(ROUTES, {
  assessments: { nav: "Assessments", title: "Assessments", icon: "clip", sub: "Nutrition profiles from the website, ready to review",
    render(el) {
      const live = Store.get("assessment"); const reviewed = Store.get("reviewedAssessments", {});
      const rows = [];
      if (live) rows.push({ id: "live", name: (live.answers.name || "Website visitor"), goal: live.answers.goal, arch: live.profile.name, prog: live.profile.programName, at: live.at, fresh: true, answers: live.answers, profile: live.profile });
      [["Rachel Kim", "Metabolic health", "The Metabolic Planner", "Metabolic", DAY], ["Kofi Mensah", "Performance and recovery", "The Active Performer", "Balance", 2 * DAY], ["Julia Brandt", "Women's health and life stages", "The Life Stage Navigator", "Balance", 2 * DAY], ["Victor Alvarez", "Sustainable weight management", "The Fresh Starter", "Reset", 3 * DAY], ["Chloe Park", "Digestive comfort", "The Comfort Seeker", "Reset", 5 * DAY]].forEach(([name, goal, arch, prog, ago_]) => rows.push({ id: name, name, goal, arch, prog, at: NOW - ago_ }));
      el.innerHTML = sec("Completed assessments", tableOf(["Person", "Goal", "Profile", "Suggested program", "Completed", "Review"], rows.map((r) => `<tr class="click" tabindex="0" data-a="${esc(r.id)}"><td><b>${esc(r.name)}</b>${r.fresh ? ' <span class="badge">From this browser</span>' : ""}</td><td>${esc(r.goal || "")}</td><td>${esc(r.arch)}</td><td>${esc(r.prog)}</td><td>${ago(r.at)}</td><td>${reviewed[r.id] ? '<span class="badge dark">Reviewed</span>' : '<span class="badge warn">To review</span>'}</td></tr>`).join("")));
      el.querySelectorAll("[data-a]").forEach((tr) => tr.addEventListener("click", () => {
        const r = rows.find((x) => x.id === tr.dataset.a);
        const detail = r.answers ? Object.entries(r.answers).filter(([k, v]) => v && (!Array.isArray(v) || v.length) && !["name", "email"].includes(k)).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(Array.isArray(v) ? v.join(", ") : v)}</dd></div>`).join("") : `<div><dt>Note</dt><dd>Sample record. Complete the assessment on the public site to see full answers here.</dd></div>`;
        openModal(`<h3>${esc(r.name)}</h3><p class="label-sm" style="margin-bottom:14px;">${esc(r.arch)}</p><dl class="kv" style="max-height:46vh;overflow:auto;">${detail}</dl><div class="btn-row mt"><button class="btn btn-primary btn-sm" id="rv" type="button">Mark as reviewed</button><button class="btn btn-outline btn-sm" id="bk" type="button">Offer a consultation</button></div>`, (m, close) => {
          m.querySelector("#rv").addEventListener("click", () => { reviewed[r.id] = true; Store.set("reviewedAssessments", reviewed); close(); toast("Marked as reviewed."); ROUTES.assessments.render(el); });
          m.querySelector("#bk").addEventListener("click", () => { close(); toast("Consultation invitation drafted. Sofia will send it."); });
        });
      }));
    } },

  plans: { nav: "Nutrition Plans", title: "Nutrition plan builder", icon: "plan", sub: "Maya Johnson, Metabolic program, week five",
    render(el, actions) {
      actions.innerHTML = `<button class="btn btn-outline btn-sm" id="reset" type="button">Reset to default</button><button class="btn btn-primary btn-sm" id="save" type="button">Save and notify client</button>`;
      let plan = JSON.parse(JSON.stringify(Store.get("planOverride") || SAMPLE_WEEK)); let sel = (new Date().getDay() + 6) % 7;
      const swaps = () => Store.get("swaps", []).concat(Store.get("planRequests", []).map((p) => ({ from: "Plan change request", to: (p.why || []).join(", ") || p.note, at: p.at, status: p.status, client: "Maya Johnson", pr: true })));
      const draw = () => {
        const day = plan[sel]; const tot = MEAL_SLOTS.reduce((a, [sl]) => { const n = getRecipe(day[sl]).nutrition; a.cal += n.cal; a.p += n.protein; a.c += n.carbs; a.f += n.fat; a.fi += n.fiber; return a; }, { cal: 0, p: 0, c: 0, f: 0, fi: 0 });
        const q = swaps().filter((s) => s.status === "Needs review");
        el.innerHTML = `<div class="cols c21"><div class="stack"><div class="day-tabs" role="tablist" aria-label="Days">${DAYS.map((d, i) => `<button type="button" role="tab" data-d="${i}" aria-selected="${i === sel}">${d}<b>${i + 1}</b></button>`).join("")}</div>
          <div class="panel">${MEAL_SLOTS.map(([sl, label]) => `<div class="list-row"><div style="min-width:86px;"><span class="label-sm">${label}</span></div><div class="grow"><label class="sr-only" for="s_${sl}">${label} recipe</label><select id="s_${sl}" data-slot="${sl}">${RECIPES.map((r) => `<option value="${r.id}" ${day[sl] === r.id ? "selected" : ""}>${esc(r.title)}</option>`).join("")}</select></div><div class="num" style="min-width:120px;text-align:right;"><b>${getRecipe(day[sl]).nutrition.cal}</b> cal<small>${getRecipe(day[sl]).nutrition.protein} g protein</small></div></div>`).join("")}</div></div>
          <div class="stack"><div class="panel"><div class="panel-head" style="margin-bottom:14px;"><h3>Day totals</h3></div><div class="macros"><div><b>${tot.cal}</b><small>Calories</small></div><div><b>${tot.p} g</b><small>Protein</small></div><div><b>${tot.c} g</b><small>Carbs</small></div><div><b>${tot.f} g</b><small>Fat</small></div></div><p class="fine" style="margin-top:12px;">Fiber ${Math.round(tot.fi)} g. Allergens on this day: ${[...new Set(MEAL_SLOTS.flatMap(([sl]) => getRecipe(day[sl]).allergens))].join(", ") || "none"}.</p></div>
          <div class="panel"><div class="panel-head"><h3>Review queue</h3><span class="badge ${q.length ? "warn" : ""}">${q.length}</span></div>${q.length ? q.map((s, i) => `<div class="list-row" style="align-items:flex-start;"><div class="grow"><strong>${esc(s.from)}</strong><small>${esc(s.to)} &middot; ${esc(s.client || "")} &middot; ${ago(s.at)}</small></div><div class="btn-row"><button class="btn btn-primary btn-sm" data-ok="${s.at}" type="button">Approve</button><button class="btn btn-outline btn-sm" data-no="${s.at}" type="button">Decline</button></div></div>`).join("") : '<div class="empty-note">Nothing waiting. Requests from clients appear here.</div>'}</div></div></div>`;
        el.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { sel = Number(b.dataset.d); draw(); }));
        el.querySelectorAll("[data-slot]").forEach((s) => s.addEventListener("change", () => { plan[sel][s.dataset.slot] = s.value; draw(); }));
        const setStatus = (at, status) => { ["swaps", "planRequests"].forEach((k) => { const l = Store.get(k, []); l.forEach((x) => { if (String(x.at) === String(at)) x.status = status; }); Store.set(k, l); }); toast(status === "Approved" ? "Approved. The client is notified." : "Declined. The client is notified."); draw(); };
        el.querySelectorAll("[data-ok]").forEach((b) => b.addEventListener("click", () => setStatus(b.dataset.ok, "Approved")));
        el.querySelectorAll("[data-no]").forEach((b) => b.addEventListener("click", () => setStatus(b.dataset.no, "Declined")));
      };
      draw();
      document.getElementById("save").addEventListener("click", () => { Store.set("planOverride", plan); Store.push("activity", { who: "Dr. Vale", what: "updated the meal plan", at: Date.now() }); toast("Plan saved. Maya's portal now shows this version."); });
      document.getElementById("reset").addEventListener("click", () => { Store.set("planOverride", null); plan = JSON.parse(JSON.stringify(SAMPLE_WEEK)); toast("Plan reset to the default week."); draw(); });
    } },

  foodlogs: { nav: "Food Logs", title: "Food logs", icon: "log", sub: "What clients are logging, and where the gaps are",
    render(el) {
      const live = Store.get("foodLog", []).map((l) => ({ c: "Maya Johnson", ...l }));
      const base = [["Priya Raman", "Breakfast", "Protein oats with berries", 3], ["Daniel Brooks", "Lunch", "Chicken grain bowl", 4], ["Elena Ruiz", "Dinner", "Salmon with roasted vegetables", 6], ["Hannah Cole", "Snack", "Apple and almond butter", 9], ["Nadia Haddad", "Dinner", "Turkey chili", 12], ["Maya Johnson", "Lunch", "Lentil and roasted carrot salad", 22]].map(([c, meal, text, h]) => ({ c, meal, text, at: NOW - h * 3600000 }));
      el.innerHTML = `<div class="cols c21">${sec("Latest entries", live.concat(base).slice(0, 12).map((l) => `<div class="list-row"><span class="avatar sm">${initials(l.c)}</span><div class="grow"><strong>${esc(l.c)}, ${esc(l.meal)}</strong><small>${esc(l.text)}${l.symptoms && l.symptoms.length ? " &middot; " + esc(l.symptoms.join(", ")) : ""}</small></div><small>${ago(l.at)}</small></div>`).join(""))}
        <div class="stack">${sec("Patterns to follow up", `<div class="insight"><span class="dot"></span><div><strong>Tom Whitfield</strong><p class="small">No entries for six days.</p></div></div><div class="insight"><span class="dot"></span><div><strong>Sara Nilsson</strong><p class="small">Lunch skipped on four of the last seven days.</p></div></div><div class="insight"><span class="dot ok"></span><div><strong>Priya Raman</strong><p class="small">Breakfast logged every day for three weeks.</p></div></div>`)}${sec("Logging rate", barRows([["This week", 78], ["Last week", 72], ["Four week average", 70]], "%"))}</div></div>`;
    } },

  library: { nav: "Recipe Library", title: "Recipe library", icon: "book", sub: "Recipes available to plans and the public site",
    render(el) {
      el.innerHTML = sec("All recipes", tableOf(["Recipe", "Categories", "Calories", "Protein", "Allergens", "Published"], RECIPES.map((r) => `<tr><td><a class="name" href="recipe.html?id=${r.id}">${esc(r.title)}</a></td><td>${esc(r.cats.slice(0, 3).join(", "))}</td><td class="num">${r.nutrition.cal}</td><td class="num">${r.nutrition.protein} g</td><td>${r.allergens.length ? esc(r.allergens.join(", ")) : "None"}</td><td><label class="switch"><input type="checkbox" checked aria-label="Published: ${esc(r.title)}"><span></span></label></td></tr>`).join(""))) + `<p class="fine mt">Recipes live in js/recipes.js in this build. In production they are managed here and stored with their nutrition data, allergens and photographs.</p>`;
    } },

  programs: { nav: "Programs", title: "Programs", icon: "flow", sub: "Enrollment and completion across the four programs",
    render(el) {
      const E = { reset: [11, 90, "$7,590"], balance: [17, 86, "$21,930"], metabolic: [14, 81, "$26,460"], private: [6, 92, "$28,800"] };
      el.innerHTML = `<div class="cols c2">${PROGRAMS.map((p) => `<div class="panel"><div class="panel-head"><h3 style="text-transform:uppercase;letter-spacing:.06em;">${p.name}</h3><span class="badge stone">${p.weeks}</span></div><p class="small" style="margin-bottom:18px;">${esc(p.tagline)}</p><div class="cols c3"><div><div class="label-sm">Enrolled</div><div style="font-family:var(--serif);font-size:36px;color:var(--olive-deep);">${E[p.slug][0]}</div></div><div><div class="label-sm">Completion</div><div style="font-family:var(--serif);font-size:36px;color:var(--olive-deep);">${E[p.slug][1]}%</div></div><div><div class="label-sm">Billed</div><div style="font-family:var(--serif);font-size:36px;color:var(--olive-deep);">${E[p.slug][2]}</div></div></div><div class="btn-row mt"><a class="btn btn-outline btn-sm" href="program.html?slug=${p.slug}">View public page</a></div></div>`).join("")}</div>`;
    } },

  intelligence: { nav: "NOURA Intelligence", title: "NOURA Intelligence", icon: "spark", sub: "Drafts and insights to support your judgment. Nothing is sent without approval.",
    render(el) {
      el.innerHTML = `<div class="cols c2"><div class="stack">${sec("Insights", [["Engagement is down 22% this week.", "Three clients may be at risk: Tom Whitfield, Sara Nilsson and Ben Carter.", "dot"], ["Breakfast logging predicts completion.", "Clients who log breakfast are 34% more likely to finish their program.", "dot ok"], ["The reminder email is working.", "Assessment completions rose 18% after the day two reminder went live.", "dot ok"], ["Travel questions are rising.", "Nine messages this month mention travel. A short guide could help.", "dot"]].map(([h, d, c]) => `<div class="insight"><span class="${c}"></span><div><strong style="color:var(--olive-deep);">${h}</strong><p class="small">${d}</p></div></div>`).join(""))}
          ${sec("Lead analysis", `<div class="field"><label for="ld">Choose a lead</label><select id="ld">${allLeads().map((l, i) => `<option value="${i}">${esc(l.name)}, ${esc(l.stage)}</option>`).join("")}</select></div><div id="ldOut" class="estimate"></div>`)}</div>
        ${sec("Session summary draft", `<p class="small" style="margin-bottom:14px;">Paste your rough notes and get a clear summary for the client portal. Edit it before sharing.</p><div class="field"><label for="raw">Your notes</label><textarea id="raw" style="min-height:150px;">energy better since lunch moved earlier
travel next week, 4 days
wants snack ideas for flights
labs next month</textarea></div><button class="btn btn-primary btn-sm" id="gen" type="button">Draft summary</button><div class="field mt"><label for="out">Draft for your review</label><textarea id="out" style="min-height:230px;" placeholder="Your draft appears here"></textarea></div><div class="btn-row"><button class="btn btn-outline btn-sm" id="cpy" type="button">Copy</button><button class="btn btn-primary btn-sm" id="shr" type="button">Approve and share with client</button></div>`)}</div>`;
      const lead = () => { const l = allLeads()[Number(el.querySelector("#ld").value)]; const hot = ["Consultation Requested", "Consultation Booked"].includes(l.stage);
        el.querySelector("#ldOut").innerHTML = `<div class="label-sm">Suggested approach</div><ul style="margin-top:8px;"><li>${esc(l.archetype || "Not yet assessed")}${l.program ? ", likely fit: " + esc(l.program) : ""}</li><li>${hot ? "Warm lead. Confirm the time and send the preparation checklist." : l.stage === "Assessment Completed" ? "Send the profile summary with an invitation to book." : "Send the welcome note and the assessment link."}</li><li>Source: ${esc(l.source || "Unknown")}. First contact within one business day works best.</li></ul>`; };
      el.querySelector("#ld").addEventListener("change", lead); lead();
      el.querySelector("#gen").addEventListener("click", () => {
        const pts = el.querySelector("#raw").value.split("\n").map((s) => s.trim()).filter(Boolean).map((s) => s.charAt(0).toUpperCase() + s.slice(1));
        el.querySelector("#out").value = `Session summary\n\nWhat we reviewed\n${pts.map((p) => "  " + p + ".").join("\n")}\n\nWhat we agreed\n  Keep lunch before 2 PM on meeting heavy days.\n  Use the travel snack kit while you are away.\n\nNext steps\n  Submit your weekly check in on Sunday.\n  Message me if the trip changes your plans.\n\nWarmly,\nDr. Amara Vale, RD`;
        toast("Draft ready. Please review and edit it.");
      });
      el.querySelector("#cpy").addEventListener("click", async () => { try { await navigator.clipboard.writeText(el.querySelector("#out").value); toast("Copied."); } catch (e) { toast("Copy is not available in this browser."); } });
      el.querySelector("#shr").addEventListener("click", () => { if (!el.querySelector("#out").value.trim()) { toast("Draft a summary first."); return; } Store.push("activity", { who: "Dr. Vale", what: "shared a session summary", at: Date.now() }); toast("Summary shared to the client portal."); });
    } },

  automations: { nav: "Automations", title: "Automations", icon: "bolt", sub: "Reminders and follow ups that run on their own, with a person in charge",
    render(el) {
      const SEQ = [["New lead", true, ["Instant welcome email", "Day 2: assessment reminder", "Day 5: educational email", "Day 10: consultation invitation"]], ["New client", true, ["Welcome message", "Intake forms and consent", "Portal setup guide", "Day 1: first plan delivered", "Week 1: first check in"]], ["Active client", true, ["Weekly check in reminder", "Appointment reminders", "Progress prompts", "Resource drops", "Monthly review invitation"]], ["Inactive client", false, ["Day 14: gentle nudge", "Day 30: check in from your dietitian", "Day 60: re engagement offer", "Day 90: win back message"]]];
      const on = Store.get("automationOn", Object.fromEntries(SEQ.map(([n, v]) => [n, v])));
      const runs = Store.get("automationRuns", []);
      const flow = Store.get("flow", { trigger: "A new client books a consultation", cond: "The assessment is incomplete", delay: 2, act1: "Send a reminder email", cond2: "It is still incomplete", act2: "Notify the client care team" });
      el.innerHTML = `<div class="cols c2"><div class="panel"><div class="panel-head"><h3>Workflow builder</h3><button class="btn btn-primary btn-sm" id="run" type="button">Run simulation</button></div>
        <div class="flow" id="flow">
          <div class="node trigger"><div class="kind">When</div><label class="sr-only" for="f1">Trigger</label><select id="f1">${["A new client books a consultation", "A new lead completes the assessment", "A client misses a weekly check in", "A client has not logged for five days"].map((o) => `<option ${flow.trigger === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
          <div class="node"><div class="kind">If</div><label class="sr-only" for="f2">Condition</label><select id="f2">${["The assessment is incomplete", "The intake form is missing", "No reply within the window"].map((o) => `<option ${flow.cond === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
          <div class="node"><div class="kind">Then</div><label class="sr-only" for="f3">Action</label><select id="f3">${["Send a reminder email", "Send a reminder text", "Send an encouraging message"].map((o) => `<option ${flow.act1 === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
          <div class="node"><div class="kind">Wait</div><div class="row"><label class="sr-only" for="f4">Days to wait</label><input id="f4" type="number" min="1" max="30" value="${flow.delay}"><span>days</span></div></div>
          <div class="node"><div class="kind">If</div><label class="sr-only" for="f5">Second condition</label><select id="f5">${["It is still incomplete", "There has been no reply"].map((o) => `<option ${flow.cond2 === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
          <div class="node"><div class="kind">Then</div><label class="sr-only" for="f6">Second action</label><select id="f6">${["Notify the client care team", "Notify the dietitian", "Offer a call with the client care team"].map((o) => `<option ${flow.act2 === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
        </div><p class="fine mt">Automations send routine messages only. Anything clinical stays with a dietitian.</p></div>
        <div class="stack">${sec("Sequences", SEQ.map(([n, , steps]) => `<details class="list-row" style="display:block;"><summary style="display:flex;align-items:center;gap:14px;cursor:pointer;list-style:none;"><span class="grow"><strong>${n}</strong><small>${steps.length} steps</small></span><label class="switch" onclick="event.stopPropagation()"><input type="checkbox" data-seq="${n}" ${on[n] ? "checked" : ""} aria-label="${n} sequence"><span></span></label></summary><ul class="ticks plain" style="margin-top:14px;">${steps.map((s) => `<li>${s}</li>`).join("")}</ul></details>`).join(""))}
        ${sec("Recent runs", `<div id="runs">${runs.length ? runs.slice(0, 6).map((r) => `<div class="list-row"><div class="grow"><strong>${esc(r.name)}</strong><small>${esc(r.detail)}</small></div><small>${ago(r.at)}</small></div>`).join("") : '<div class="empty-note">No runs yet. Try the simulation.</div>'}</div>`)}</div></div>`;
      const keep = () => { Store.set("flow", { trigger: el.querySelector("#f1").value, cond: el.querySelector("#f2").value, act1: el.querySelector("#f3").value, delay: Number(el.querySelector("#f4").value) || 1, cond2: el.querySelector("#f5").value, act2: el.querySelector("#f6").value }); };
      el.querySelectorAll("#flow select, #flow input").forEach((x) => x.addEventListener("change", keep));
      el.querySelectorAll("[data-seq]").forEach((c) => c.addEventListener("change", () => { on[c.dataset.seq] = c.checked; Store.set("automationOn", on); toast(c.dataset.seq + " sequence " + (c.checked ? "switched on." : "paused.")); }));
      el.querySelector("#run").addEventListener("click", async (e) => {
        const btn = e.currentTarget; btn.disabled = true; keep(); const f = Store.get("flow");
        const nodes = [...el.querySelectorAll("#flow .node")], texts = [f.trigger, f.cond, f.act1, "Wait " + f.delay + " days", f.cond2, f.act2];
        for (let i = 0; i < nodes.length; i++) { nodes[i].classList.add("run"); await new Promise((r) => setTimeout(r, 650)); nodes[i].classList.remove("run"); }
        Store.push("automationRuns", { name: f.trigger, detail: `Simulated: ${f.act1.toLowerCase()}, wait ${f.delay} days, then ${f.act2.toLowerCase()}`, at: Date.now() });
        toast("Simulation complete. Nothing was sent."); btn.disabled = false; ROUTES.automations.render(el, document.getElementById("topActions"));
      });
    } },

  content: { nav: "Content and Media", title: "Content and media", icon: "image", sub: "Articles, client stories and the photography library",
    render(el) {
      const TABS = ["Journal", "Client stories", "Media manager"]; let tab = 2;
      const draw = () => {
        el.innerHTML = `<div class="tabs" role="tablist">${TABS.map((t, i) => `<button type="button" role="tab" data-t="${i}" aria-selected="${i === tab}">${t}</button>`).join("")}</div><div id="cb"></div>`;
        el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => { tab = Number(b.dataset.t); draw(); }));
        const cb = el.querySelector("#cb");
        if (tab === 0) cb.innerHTML = sec("Articles", JOURNAL.map((a) => `<div class="list-row"><div class="grow"><strong>${esc(a.title)}</strong><small>${esc(a.category)} &middot; ${esc(a.date)}</small></div><label class="switch"><input type="checkbox" checked aria-label="Published: ${esc(a.title)}"><span></span></label></div>`).join(""));
        else if (tab === 1) cb.innerHTML = sec("Client stories", STORIES.map((s) => `<div class="list-row"><div class="grow"><strong>${esc(s.name)}, ${esc(s.detail)}</strong><small>${esc(s.program)} program</small></div><span class="badge">Permission on file</span><label class="switch"><input type="checkbox" checked aria-label="Published: ${esc(s.name)}"><span></span></label></div>`).join("") + `<p class="fine mt">Stories are published only with written permission, and details are changed to protect privacy.</p>`);
        else mediaTab(cb);
      };
      draw();
    } },

  analytics: { nav: "Analytics", title: "Analytics", icon: "chart", sub: "Acquisition, retention and revenue",
    render(el) {
      el.innerHTML = `<div class="cols c2">${sec("Acquisition funnel", chartBars({ labels: ["Visitors", "Starts", "Completed", "Booked", "Clients"], data: [6420, 420, 312, 58, 41], fmt: (v) => v >= 1000 ? (v / 1000).toFixed(1) + "k" : v }))}${sec("Retention", chartLine({ labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"], series: [{ name: "Client retention", data: [86, 87, 89, 88, 90, 91], color: "#3A4330" }], min: 80, max: 95, fmt: (v) => v + "%" }))}</div>
        <div class="cols c3 mt">${sec("Lead sources", barRows([["Search", 38], ["Referral", 29], ["Social", 17], ["Direct", 12], ["Newsletter", 9]], "%"))}${sec("Revenue by program", barRows([["Private", 28800], ["Metabolic", 26460], ["Balance", 21930], ["Reset", 7590]]))}${sec("Churn reasons", barRows([["Schedule changes", 6], ["Goals reached", 5], ["Cost", 3], ["Moved away", 2]]) + `<p class="fine mt">Last twelve months, all programs.</p>`)}</div>`;
    } },

  billing: { nav: "Billing", title: "Billing", icon: "dollar", sub: "Invoices, subscriptions and payments",
    render(el) {
      const refunded = Store.get("refunds", {});
      const draw = () => {
        el.innerHTML = `<div class="cols c4">${[["Revenue this month", "$42,600"], ["Recurring revenue", "$18,200"], ["Outstanding", "$630"], ["Failed payments", "2"]].map(([k, v]) => `<div class="panel stat"><div class="k">${k}</div><div class="v">${v}</div></div>`).join("")}</div>
          <div class="mt">${sec("Invoices", tableOf(["Invoice", "Client", "Item", "Amount", "Status", "Date", ""], INVOICES.map((i) => { const st = refunded[i.id] ? "Refunded" : i.status; return `<tr><td>${i.id}</td><td><b>${esc(i.client)}</b></td><td>${esc(i.item)}</td><td class="num">${money(i.amt)}</td><td>${statusBadge(st)}</td><td>${fmtDay(i.at)}</td><td>${st === "Paid" ? `<button class="btn btn-outline btn-sm" data-rf="${i.id}" type="button">Refund</button>` : st === "Failed" || st === "Outstanding" ? `<button class="btn btn-outline btn-sm" data-rs="${i.id}" type="button">Send reminder</button>` : ""}</td></tr>`; }).join("")))}</div><p class="fine mt">Card payments are processed by a payment provider using hosted fields, so card details never reach NOURA's systems.</p>`;
        el.querySelectorAll("[data-rf]").forEach((b) => b.addEventListener("click", () => openModal(`<h3>Refund ${b.dataset.rf}?</h3><p class="small" style="margin-bottom:20px;">The client is notified by email. This demonstration only marks the invoice as refunded.</p><div class="btn-row"><button class="btn btn-terracotta btn-sm" id="y" type="button">Confirm refund</button><button class="btn btn-outline btn-sm" id="n" type="button">Cancel</button></div>`, (m, close) => { m.querySelector("#n").addEventListener("click", close); m.querySelector("#y").addEventListener("click", () => { refunded[b.dataset.rf] = true; Store.set("refunds", refunded); close(); toast("Refund recorded."); draw(); }); })));
        el.querySelectorAll("[data-rs]").forEach((b) => b.addEventListener("click", () => toast("Reminder sent for " + b.dataset.rs + ".")));
      };
      draw();
    } },

  settings: { nav: "Settings", title: "Settings", icon: "settings", sub: "Roles, security and the audit trail",
    render(el) {
      const ROLES = ["Super admin", "Practice owner", "Dietitian", "Client care", "Marketing", "Client"];
      const PERMS = [["Client records", [0, 1, 1, 1, 0, 1]], ["Clinical notes", [0, 1, 1, 0, 0, 0]], ["Nutrition plans", [0, 1, 1, 0, 0, 1]], ["Billing", [1, 1, 0, 1, 0, 1]], ["Website content", [1, 1, 0, 0, 1, 0]], ["Automations", [1, 1, 0, 1, 1, 0]], ["Audit log", [1, 1, 0, 0, 0, 0]]];
      const activity = Store.get("activity", []).map((a) => ({ who: a.who, what: a.what, at: a.at }));
      const audit = activity.concat([{ who: "Dr. Vale", what: "viewed the client record for Maya Johnson", at: NOW - 3600000 }, { who: "Sofia Marin", what: "rescheduled an appointment for Priya Raman", at: NOW - 6 * 3600000 }, { who: "Dr. Vale", what: "exported the client list", at: NOW - DAY }, { who: "Leila Haddad", what: "updated clinical notes for Sara Nilsson", at: NOW - 2 * DAY }]);
      const cons = Store.get("policy", { marketing: true, share: false, retain: true });
      el.innerHTML = `<div class="cols c2"><div class="stack">${sec("Roles and permissions", `<div class="tbl-wrap"><table class="tbl perm"><thead><tr><th>Area</th>${ROLES.map((r) => `<th>${r}</th>`).join("")}</tr></thead><tbody>${PERMS.map(([k, v]) => `<tr><td><b>${k}</b></td>${v.map((x) => `<td><span class="${x ? "dot-yes" : "dot-no"}" title="${x ? "Allowed" : "Not allowed"}"></span><span class="sr-only">${x ? "Allowed" : "Not allowed"}</span></td>`).join("")}</tr>`).join("")}</tbody></table></div>`)}
        ${sec("Practice policies", [["marketing", "Send marketing email only with consent"], ["share", "Share records with other clinicians only with written permission"], ["retain", "Retain records for the legally required period"]].map(([k, t]) => `<div class="list-row"><div class="grow"><strong>${t}</strong></div><label class="switch"><input type="checkbox" data-p="${k}" ${cons[k] ? "checked" : ""} aria-label="${t}"><span></span></label></div>`).join(""))}</div>
        <div class="stack">${sec("Production security checklist", [["Two step verification for every team member", "Required"], ["Encryption in transit and at rest", "Required"], ["Role based access to every record", "Designed"], ["Audit trail of access and changes", "Designed"], ["Backups and recovery drills", "Required"], ["Data export and deletion requests", "Designed"], ["Legal review of privacy and consent text", "Required"]].map(([t, s]) => `<div class="list-row"><div class="grow"><strong>${t}</strong></div><span class="badge ${s === "Required" ? "warn" : ""}">${s}</span></div>`).join("") + `<p class="fine mt">This demonstration shows the design. A live practice must complete and verify these before handling real health information.</p>`)}
        ${sec("Audit log", audit.slice(0, 8).map((a) => `<div class="list-row"><div class="grow"><strong>${esc(a.who)}</strong><small>${esc(a.what)}</small></div><small>${ago(a.at)}</small></div>`).join(""))}</div></div>`;
      el.querySelectorAll("[data-p]").forEach((c) => c.addEventListener("change", () => { cons[c.dataset.p] = c.checked; Store.set("policy", cons); toast("Policy updated."); }));
    } },
});

function mediaTab(cb) {
  const keys = Object.keys(MEDIA); const status = {}; let q = "", f = "All";
  const folders = ["All"].concat([...new Set(keys.map((k) => MEDIA[k].folder))]);
  const paint = () => {
    const live = Object.values(status).filter(Boolean).length;
    const list = keys.filter((k) => (f === "All" || MEDIA[k].folder === f) && (!q || (k + MEDIA[k].alt + MEDIA[k].usage).toLowerCase().includes(q)));
    cb.innerHTML = `<div class="panel"><div class="panel-head"><h3>Media library</h3><span class="badge ${live === keys.length ? "" : "stone"}">${live} of ${keys.length} images in place</span></div>
      <div class="filters"><div class="field"><label class="sr-only" for="mq">Search media</label><input id="mq" type="search" placeholder="Search by key, description or usage" value="${esc(q)}"></div><label class="sr-only" for="mf">Folder</label><select id="mf" class="sel-inline">${folders.map((o) => `<option ${o === f ? "selected" : ""}>${o}</option>`).join("")}</select></div>
      ${tableOf(["Preview", "Key", "File", "Alt text", "Used on", "Source", "Status"], list.map((k) => { const m = MEDIA[k]; return `<tr><td><div class="media tone-${m.tone}" style="width:72px;height:54px;border-radius:10px;">${status[k] ? `<img src="${m.src}" alt="" style="object-position:${m.position}">` : '<div class="ph" style="padding:0;"></div>'}</div></td><td><b>${k}</b></td><td><small>${m.src}</small></td><td style="max-width:260px;"><small>${esc(m.alt)}</small></td><td><small>${esc(m.usage)}</small></td><td>${m.flags.includes("preview") ? `<span class="badge warn">${esc(m.source)}</span>` : `<small>${esc(m.source)}</small>`}</td><td>${status[k] === undefined ? '<span class="badge stone">Checking</span>' : status[k] ? '<span class="badge">In place</span>' : '<span class="badge warn">Placeholder</span>'}</td></tr>`; }).join(""))}
      <p class="fine mt">${keys.filter((k) => MEDIA[k].flags.includes("preview")).length} images are watermarked stock previews and need licensed copies before launch. To add or replace a photograph, save it at the file path shown, then reload. Upload, cropping and alt text editing connect to storage in production. The registry in js/imageRegistry.js is the single source for every path.</p></div>`;
    cb.querySelector("#mq").addEventListener("input", (e) => { q = e.target.value.toLowerCase(); const p = e.target.selectionStart; paint(); const n = cb.querySelector("#mq"); n.focus(); n.setSelectionRange(p, p); });
    cb.querySelector("#mf").addEventListener("change", (e) => { f = e.target.value; paint(); });
  };
  keys.forEach((k) => { const i = new Image(); i.onload = () => { status[k] = true; schedule(); }; i.onerror = () => { status[k] = false; schedule(); }; i.src = MEDIA[k].src; });
  let t; const schedule = () => { clearTimeout(t); t = setTimeout(() => { if (cb.isConnected) paint(); }, 120); };
  paint();
}

document.addEventListener("DOMContentLoaded", () => {
  const app = mountApp({
    routes: ROUTES, defaultRoute: "overview", brand: "Practice Dashboard",
    groups: [
      { label: "Practice", items: ["overview", "clients", "appointments", "messages"] },
      { label: "Care", items: ["assessments", "plans", "foodlogs", "library"] },
      { label: "Grow", items: ["programs", "automations", "intelligence", "content", "analytics"] },
      { label: "Admin", items: ["billing", "settings"] },
    ],
  });
  const unread = allMessages().filter((m) => m.unread).length;
  const b = document.getElementById("badge-messages"); if (b) b.textContent = unread;
  const leads = Store.get("leads", []).length + LEADS_SEED.filter((l) => l.stage === "New Lead").length;
  const bc = document.getElementById("badge-clients"); if (bc) bc.textContent = leads;
});

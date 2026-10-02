/* ==========================================================================
   NOURA: booking
   Service, practitioner, date and time, details, payment, confirmation.
   The Private program uses a short application instead of a slot.

   Availability is generated here for demonstration. In production the slots
   come from the practitioner calendar, and payment is taken by the payment
   provider's hosted fields so card details never touch NOURA's servers.
   ========================================================================== */

(function initBooking() {
  const root = document.getElementById("booking");
  if (!root) return;

  const practitioners = TEAM.filter((t) => t.practitioner);
  const state = { step: 0, service: null, pro: "any", date: null, time: null, format: "Video", details: {}, ref: null };
  const pre = qs("service");
  if (pre && SERVICES.find((s) => s.id === pre)) state.service = pre;

  const saved = Store.get("assessment");
  if (saved && saved.answers) { state.details.first = saved.answers.name || ""; state.details.email = saved.answers.email || ""; }

  const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); };
  const two = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
  const svc = () => SERVICES.find((s) => s.id === state.service);
  const proObj = () => practitioners.find((p) => p.id === state.pro);
  const isApp = () => svc() && svc().kind === "application";

  function upcomingDays() {
    const out = []; const d = new Date(); d.setDate(d.getDate() + 1);
    while (out.length < 14) { if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d)); d.setDate(d.getDate() + 1); }
    return out;
  }
  const SLOT_TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
  function isOpen(dateIso, time) {
    const who = state.pro === "any" ? "any" : state.pro;
    return hash(dateIso + who + time + "noura") % 100 > 32;
  }
  function anyOpen(dateIso) { return SLOT_TIMES.some((t) => isOpen(dateIso, t)); }
  const fmtDate = (s) => new Date(s + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const STEPS = () => isApp() ? ["Service", "Application", "Submitted"] : ["Service", "Practitioner", "Date and time", "Your details", "Payment", "Confirmation"];

  function summary() {
    const s = svc(); const rows = [];
    rows.push(["Service", s ? s.name : "Not chosen yet"]);
    if (!isApp()) {
      rows.push(["With", state.pro === "any" ? "First available" : proObj().short]);
      rows.push(["When", state.date && state.time ? `${new Date(state.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${state.time}` : "Not chosen yet"]);
      rows.push(["Format", state.format]);
    }
    const total = s ? (s.kind === "application" ? "By application" : money(s.price)) : "";
    return `<aside class="summary-card" aria-label="Booking summary"><h3>Your booking</h3><dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}${s ? `<div class="total"><dt>Total</dt><dd>${total}</dd></div>` : ""}</dl><p class="fine" style="margin-top:18px;">Free rescheduling up to 24 hours before your appointment. Receipts are emailed after every session.</p></aside>`;
  }

  function bars() {
    const st = STEPS();
    return `<div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="${st.length}" aria-valuenow="${state.step + 1}" aria-label="Booking progress">${st.map((_, n) => `<i class="${n < state.step ? "done" : n === state.step ? "now" : ""}"></i>`).join("")}</div><span class="step-label">Step ${state.step + 1} of ${st.length} &middot; ${st[state.step]}</span>`;
  }

  function shell(inner) {
    root.innerHTML = `<div class="book-layout"><div class="wizard">${bars()}${inner}</div>${state.step < STEPS().length - 1 ? summary() : ""}</div>`;
    const t = root.querySelector("h2"); if (t) { t.setAttribute("tabindex", "-1"); }
  }
  function go(n) { state.step = n; render(); const t = root.querySelector("h2"); if (t) t.focus({ preventScroll: true }); window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - 130, behavior: "smooth" }); }

  /* ---- Steps ---- */
  function stepService() {
    shell(`<h2>Choose your service.</h2><p class="sub">Not sure which one fits? Start with the initial consultation. Your dietitian will guide you from there.</p>
      <form id="f"><div class="pick-grid">${SERVICES.map((s) => `<label class="pick"><input type="radio" name="service" value="${s.id}" ${state.service === s.id ? "checked" : ""}><span><strong>${esc(s.name)}</strong><small>${esc(s.blurb)}</small><div class="meta"><span>${s.kind === "application" ? "Application" : s.minutes + " minutes"}</span><span>${s.kind === "application" ? "By invitation" : money(s.price)}</span></div></span></label>`).join("")}</div>
      <p class="error-msg" id="err" role="alert">Please choose a service to continue.</p>
      <div class="wizard-nav"><span></span><button class="btn btn-primary" type="submit">Continue</button></div></form>`);
    root.querySelector("#f").addEventListener("submit", (e) => {
      e.preventDefault();
      const c = root.querySelector("input[name=service]:checked");
      if (!c) { root.querySelector("#err").style.display = "block"; return; }
      state.service = c.value; go(1);
    });
    root.querySelectorAll("input[name=service]").forEach((r) => r.addEventListener("change", () => { state.service = r.value; root.querySelector(".summary-card").outerHTML = summary(); }));
  }

  function stepPro() {
    const opts = [{ id: "any", short: "First available", role: "We will match you with the dietitian who can see you soonest", media: null }].concat(practitioners);
    shell(`<h2>Who would you like to see?</h2><p class="sub">Every NOURA dietitian is a registered practitioner. Choose the one whose focus fits you best, or let us find the earliest time.</p>
      <form id="f"><div class="option-list">${opts.map((p) => `<label class="option"><input type="radio" name="pro" value="${p.id}" ${state.pro === p.id ? "checked" : ""}><span><span class="pro-pick">${p.media ? `<span class="avatar">${mediaFrame(p.media, "")}</span>` : `<span class="avatar" style="background:var(--sage-soft);display:grid;place-items:center;font-family:var(--serif);font-size:28px;color:var(--olive);">N</span>`}<span><strong>${esc(p.short)}</strong><small>${esc(p.id === "any" ? p.role : p.focus.slice(0, 3).join(", "))}</small></span></span></span></label>`).join("")}</div>
      <div class="field" style="margin-top:26px;"><span class="label">Appointment format</span><div class="chips">${["Video", "In person"].map((f) => `<label class="chip"><input type="radio" name="format" value="${f}" ${state.format === f ? "checked" : ""}><span>${f === "Video" ? "Secure video" : "At our studio"}</span></label>`).join("")}</div></div>
      <div class="wizard-nav"><button class="back-btn" type="button" id="back">Back</button><button class="btn btn-primary" type="submit">Continue</button></div></form>`);
    hydrateMedia(root);
    root.querySelector("#back").addEventListener("click", () => go(0));
    root.querySelector("#f").addEventListener("submit", (e) => { e.preventDefault(); state.pro = root.querySelector("input[name=pro]:checked").value; state.format = root.querySelector("input[name=format]:checked").value; state.time = null; go(2); });
  }

  function stepTime() {
    const days = upcomingDays();
    if (!state.date) state.date = iso(days.find((d) => anyOpen(iso(d))) || days[0]);
    const draw = () => {
      const slots = SLOT_TIMES.map((t) => `<label class="slot"><input type="radio" name="time" value="${t}" ${state.time === t ? "checked" : ""} ${isOpen(state.date, t) ? "" : "disabled"}><span>${t}</span></label>`).join("");
      root.querySelector("#slots").innerHTML = slots;
      root.querySelectorAll("input[name=time]").forEach((r) => r.addEventListener("change", () => { state.time = r.value; root.querySelector(".summary-card").outerHTML = summary(); root.querySelector("#err").style.display = "none"; }));
    };
    shell(`<h2>Choose a date and time.</h2><p class="sub">Times are shown in Pacific Time. Sessions last ${svc().minutes} minutes.</p>
      <form id="f"><div class="field"><span class="label">Date</span><div class="date-strip">${days.map((d) => { const k = iso(d); return `<label class="day"><input type="radio" name="date" value="${k}" ${state.date === k ? "checked" : ""} ${anyOpen(k) ? "" : "disabled"}><span><small>${d.toLocaleDateString("en-US", { weekday: "short" })}</small><b>${d.getDate()}</b><em>${d.toLocaleDateString("en-US", { month: "short" })}</em></span></label>`; }).join("")}</div></div>
      <div class="field" style="margin-top:28px;"><span class="label">Time</span><div class="slot-grid" id="slots"></div></div>
      <p class="error-msg" id="err" role="alert">Please choose a time to continue.</p>
      <div class="wizard-nav"><button class="back-btn" type="button" id="back">Back</button><button class="btn btn-primary" type="submit">Continue</button></div></form>`);
    draw();
    root.querySelector("#back").addEventListener("click", () => go(1));
    root.querySelectorAll("input[name=date]").forEach((r) => r.addEventListener("change", () => { state.date = r.value; state.time = null; draw(); root.querySelector(".summary-card").outerHTML = summary(); }));
    root.querySelector("#f").addEventListener("submit", (e) => { e.preventDefault(); if (!state.time) { root.querySelector("#err").style.display = "block"; return; } go(3); });
  }

  function detailsFields(app) {
    const d = state.details;
    return `<div class="two-fields"><div class="field"><label for="first">First name</label><input id="first" type="text" autocomplete="given-name" value="${esc(d.first || "")}" required><span class="error-msg">Please enter your first name.</span></div>
      <div class="field"><label for="last">Last name</label><input id="last" type="text" autocomplete="family-name" value="${esc(d.last || "")}" required><span class="error-msg">Please enter your last name.</span></div></div>
      <div class="two-fields"><div class="field"><label for="email">Email</label><input id="email" type="email" autocomplete="email" value="${esc(d.email || "")}" required><span class="error-msg">Please enter a valid email address.</span></div>
      <div class="field"><label for="phone">Phone <span class="hint">(optional)</span></label><input id="phone" type="tel" autocomplete="tel" value="${esc(d.phone || "")}"></div></div>`;
  }
  function readDetails(form) {
    const get = (id) => form.querySelector("#" + id).value.trim();
    Object.assign(state.details, { first: get("first"), last: get("last"), email: get("email"), phone: get("phone") });
    const extra = form.querySelector("#reason"); if (extra) state.details.reason = extra.value;
    const notes = form.querySelector("#notes"); if (notes) state.details.notes = notes.value.trim();
    const goals = form.querySelector("#goals"); if (goals) state.details.goals = goals.value.trim();
  }
  function validateDetails(form, extraRequired = []) {
    let ok = true;
    ["first", "last", "email"].concat(extraRequired).forEach((id) => {
      const el = form.querySelector("#" + id); const f = el.closest(".field");
      let good = el.value.trim() !== "";
      if (id === "email") good = /^\S+@\S+\.\S+$/.test(el.value.trim());
      if (el.type === "checkbox") good = el.checked;
      f.classList.toggle("invalid", !good); if (!good) ok = false;
    });
    if (!ok) { const b = form.querySelector(".invalid"); if (b) b.scrollIntoView({ behavior: "smooth", block: "center" }); }
    return ok;
  }

  function stepDetails() {
    const d = state.details;
    shell(`<h2>Your details.</h2><p class="sub">We use this to confirm your appointment and prepare for your session.</p>
      <form id="f" novalidate>${detailsFields()}
      <div class="field"><label for="reason">What would you like help with?</label><select id="reason">${["Steadier energy", "Sustainable weight management", "Digestive comfort", "Metabolic health", "Performance and recovery", "Women's health and life stages", "Something else"].map((o) => `<option ${d.reason === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
      <div class="field"><label for="notes">Anything we should know beforehand? <span class="hint">(optional)</span></label><textarea id="notes" placeholder="Allergies, recent results, questions for your dietitian">${esc(d.notes || "")}</textarea></div>
      <div class="field"><label class="chip" style="display:block;"><span style="display:flex;gap:14px;align-items:flex-start;border-radius:16px;padding:16px 20px;font-weight:400;font-size:14px;"><input type="checkbox" id="consent" style="position:static;opacity:1;width:18px;height:18px;margin-top:3px;flex:none;" ${d.consent ? "checked" : ""}>I agree that NOURA may use my information to provide dietetic care, and I have read the privacy notice. I understand that telehealth sessions take place over secure video.</span></label><span class="error-msg">Please confirm consent to continue.</span></div>
      <div class="wizard-nav"><button class="back-btn" type="button" id="back">Back</button><button class="btn btn-primary" type="submit">Continue to payment</button></div></form>`);
    root.querySelector("#back").addEventListener("click", () => go(2));
    root.querySelector("#f").addEventListener("submit", (e) => {
      e.preventDefault(); const f = e.target;
      if (!validateDetails(f, ["consent"])) return;
      readDetails(f); state.details.consent = true; go(4);
    });
  }

  function stepPayment() {
    const s = svc();
    shell(`<h2>Payment.</h2><p class="sub">Your card is charged when you confirm. You can reschedule free of charge up to 24 hours beforehand.</p>
      <div class="note warm" style="margin-bottom:28px;">Demonstration only. No payment is taken, and card details are never stored or sent anywhere. Use any sample number, such as 4242 4242 4242 4242.</div>
      <form id="f" novalidate>
      <div class="field"><label for="cname">Name on card</label><input id="cname" type="text" autocomplete="cc-name" required><span class="error-msg">Please enter the name on your card.</span></div>
      <div class="field"><label for="cnum">Card number</label><input id="cnum" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242" maxlength="23" required><span class="error-msg">Please enter a valid card number.</span></div>
      <div class="two-fields"><div class="field"><label for="cexp">Expiry</label><input id="cexp" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5" required><span class="error-msg">Enter a future date as MM/YY.</span></div>
      <div class="field"><label for="ccvc">CVC</label><input id="ccvc" type="text" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4" required><span class="error-msg">Enter the 3 or 4 digit code.</span></div></div>
      <div class="wizard-nav"><button class="back-btn" type="button" id="back">Back</button><button class="btn btn-primary" type="submit">Pay ${money(s.price)} and confirm</button></div></form>`);
    const num = root.querySelector("#cnum"), exp = root.querySelector("#cexp");
    num.addEventListener("input", () => { num.value = num.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim(); });
    exp.addEventListener("input", () => { let v = exp.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); exp.value = v; });
    root.querySelector("#back").addEventListener("click", () => go(3));
    root.querySelector("#f").addEventListener("submit", (e) => {
      e.preventDefault(); const f = e.target; let ok = true;
      const mark = (id, good) => { f.querySelector("#" + id).closest(".field").classList.toggle("invalid", !good); if (!good) ok = false; };
      mark("cname", f.querySelector("#cname").value.trim().length > 1);
      mark("cnum", f.querySelector("#cnum").value.replace(/\s/g, "").length >= 13);
      const m = /^(\d{2})\/(\d{2})$/.exec(f.querySelector("#cexp").value);
      const now = new Date(); const yr = m ? 2000 + Number(m[2]) : 0; const mo = m ? Number(m[1]) : 0;
      mark("cexp", !!m && mo >= 1 && mo <= 12 && (yr > now.getFullYear() || (yr === now.getFullYear() && mo >= now.getMonth() + 1)));
      mark("ccvc", /^\d{3,4}$/.test(f.querySelector("#ccvc").value));
      if (!ok) return;
      const btn = f.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Confirming";
      setTimeout(() => confirmBooking(), 900);
    });
  }

  function refCode() { return "NOU" + Math.random().toString(36).slice(2, 8).toUpperCase(); }

  function confirmBooking() {
    const s = svc(); const p = state.pro === "any" ? (practitioners.find((x) => x.id === "amara")) : proObj();
    state.ref = refCode();
    const record = { ref: state.ref, service: s.name, minutes: s.minutes, price: s.price, pro: p.short, proId: p.id, date: state.date, time: state.time, format: state.format, name: `${state.details.first} ${state.details.last}`, email: state.details.email, reason: state.details.reason, status: "Confirmed", at: Date.now() };
    Store.push("bookings", record);
    Store.push("leads", { name: record.name, email: record.email, goal: record.reason, archetype: (Store.get("assessment") || {}).profile ? Store.get("assessment").profile.name : "Not assessed", program: "Consultation", at: Date.now(), stage: "Consultation Booked", source: "Website booking" });
    state.booking = record; go(5);
  }

  function stepConfirm() {
    const b = state.booking;
    shell(`<div class="confirm"><div class="seal"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 6L9 17l-5-5"/></svg></div>
      <h2 tabindex="-1">You are booked, ${esc(state.details.first)}.</h2>
      <p class="lead" style="margin:14px auto 0;text-align:center;">${esc(b.service)} with ${esc(b.pro)} on <strong>${fmtDate(b.date)} at ${esc(b.time)}</strong> (Pacific Time). Your reference is <strong>${b.ref}</strong>.</p>
      <div class="email-preview"><div class="hd">Confirmation email preview</div><p><strong>Subject:</strong> Your NOURA appointment is confirmed</p><p>Hello ${esc(state.details.first)}, we look forward to seeing you. ${b.format === "Video" ? "Your secure video link will arrive 30 minutes before the session, and you can test your camera and microphone from your portal." : "We are at 14 Cypress Lane, Suite 2, Santa Monica. Please arrive five minutes early."}</p><p>Before your session, please complete the nutrition assessment if you have not already, and bring any recent lab results you would like to share.</p></div>
      <div class="actions" style="justify-content:center;"><button class="btn btn-primary" id="ics" type="button">Add to calendar</button><a class="btn btn-outline" href="assessment.html">Complete your assessment</a><a class="btn btn-outline" href="portal.html">Preview your client portal</a></div></div>`);
    root.querySelector("#ics").addEventListener("click", () => downloadICS(b));
    const t = root.querySelector("h2"); if (t) t.focus({ preventScroll: true });
  }

  function downloadICS(b) {
    const [h, rest] = b.time.split(":"); const pm = /PM/.test(b.time); let hh = Number(h); if (pm && hh !== 12) hh += 12; if (!pm && hh === 12) hh = 0;
    const d = b.date.replace(/-/g, ""); const start = `${d}T${two(hh)}${rest.slice(0, 2)}00`;
    const endH = hh + Math.floor((b.minutes + Number(rest.slice(0, 2))) / 60); const endM = (b.minutes + Number(rest.slice(0, 2))) % 60;
    const end = `${d}T${two(endH)}${two(endM)}00`;
    const loc = b.format === "Video" ? "Secure video (link sent by email)" : "NOURA, 14 Cypress Lane, Suite 2, Santa Monica, California";
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//NOURA//Booking//EN", "BEGIN:VEVENT", `UID:${b.ref}@noura.example`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`, `DTSTART;TZID=America/Los_Angeles:${start}`, `DTEND;TZID=America/Los_Angeles:${end}`, `SUMMARY:${b.service} with ${b.pro}`, `LOCATION:${loc}`, `DESCRIPTION:NOURA appointment. Reference ${b.ref}.`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = `noura-${b.ref}.ics`; document.body.appendChild(a); a.click(); a.remove();
    toast("Calendar file downloaded.");
  }

  /* ---- Private program application ---- */
  function stepApplication() {
    const d = state.details;
    shell(`<h2>Apply for the Private program.</h2><p class="sub">Places are limited, and we review every application personally. There is no payment at this stage.</p>
      <form id="f" novalidate>${detailsFields()}
      <div class="field"><label for="goals">What would you like to achieve?</label><textarea id="goals" required placeholder="Your main goals and what has made them difficult so far">${esc(d.goals || "")}</textarea><span class="error-msg">Please tell us a little about your goals.</span></div>
      <div class="field"><label for="reason">Preferred start</label><select id="reason">${["As soon as possible", "Within a month", "In two to three months", "Just exploring"].map((o) => `<option ${d.reason === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
      <div class="field"><label class="chip" style="display:block;"><span style="display:flex;gap:14px;align-items:flex-start;border-radius:16px;padding:16px 20px;font-weight:400;font-size:14px;"><input type="checkbox" id="consent" style="position:static;opacity:1;width:18px;height:18px;margin-top:3px;flex:none;">I agree that NOURA may use my information to review this application, and I have read the privacy notice.</span></label><span class="error-msg">Please confirm consent to continue.</span></div>
      <div class="wizard-nav"><button class="back-btn" type="button" id="back">Back</button><button class="btn btn-primary" type="submit">Submit application</button></div></form>`);
    root.querySelector("#back").addEventListener("click", () => go(0));
    root.querySelector("#f").addEventListener("submit", (e) => {
      e.preventDefault(); const f = e.target;
      if (!validateDetails(f, ["goals", "consent"])) return;
      readDetails(f);
      const rec = { ref: refCode(), name: `${state.details.first} ${state.details.last}`, email: state.details.email, goals: state.details.goals, start: state.details.reason, at: Date.now() };
      Store.push("applications", rec);
      Store.push("leads", { name: rec.name, email: rec.email, goal: rec.goals.slice(0, 60), archetype: "Private application", program: "Private", at: Date.now(), stage: "Consultation Requested", source: "Private application" });
      state.booking = rec; go(2);
    });
  }
  function stepSubmitted() {
    const b = state.booking;
    shell(`<div class="confirm"><div class="seal"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 6L9 17l-5-5"/></svg></div>
      <h2 tabindex="-1">Thank you, ${esc(state.details.first)}.</h2>
      <p class="lead" style="margin:14px auto 0;text-align:center;">Your application (reference <strong>${b.ref}</strong>) has been received. Sofia Marin, our Client Care Director, will reply within two business days to arrange a conversation with a dietitian.</p>
      <div class="actions" style="justify-content:center;margin-top:36px;"><a class="btn btn-primary" href="programs.html">Explore the programs</a><a class="btn btn-outline" href="assessment.html">Take the nutrition assessment</a></div></div>`);
  }

  function render() {
    if (isApp()) { [stepService, stepApplication, stepSubmitted][state.step](); }
    else { [stepService, stepPro, stepTime, stepDetails, stepPayment, stepConfirm][state.step](); }
  }
  render();
})();

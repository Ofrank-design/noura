/* NOURA: shared helpers for the client portal and dietitian dashboard. */

const ICONS = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  plan: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  cart: '<path d="M3 4h2l2.5 11h10l2-8H6"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
  log: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
  progress: '<path d="M3 20h18M6 16v-5M11 16V8M16 16v-8M21 16V5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M8 14h2M14 14h2"/>',
  doc: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c.8-3.5 3.5-5.5 7-5.5s6.2 2 7 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2 .6 3.4 2.2 4 5"/>',
  chart: '<path d="M4 4v16h16"/><path d="M8 15l4-4 3 3 5-6"/>',
  bolt: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
  dollar: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.4-1-1.4-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2 0 3 5 1.6 5 4.3 0 1.2-1.1 2-2.5 2-1.2 0-2.2-.6-2.6-1.6M12 6v1.7M12 16.3V18"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  book: '<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-6"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/>',
  clip: '<path d="M9 3h6l1 2h3v16H5V5h3z"/><path d="M9 11h6M9 15h4"/>',
  inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  more: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  tick: '<path d="M20 6L9 17l-5-5"/>',
  cal2: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  flow: '<rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="16" width="7" height="5" rx="1"/><path d="M6.5 8v4h11v4"/>',
};
function icon(name) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`; }

/* Hash router: routes[key] = { title, sub, render(el), actions } */
function mountApp({ routes, groups, tabbar, defaultRoute, brand }) {
  const side = document.getElementById("sidebar"), main = document.getElementById("view"), scrim = document.getElementById("scrim");
  side.innerHTML = `<a class="logo" href="index.html" aria-label="NOURA public site">NOURA<small>${brand}</small></a>` +
    groups.map((g) => `<div class="side-group" role="group" aria-label="${g.label}"><h5>${g.label}</h5>${g.items.map((k) => `<button class="side-link" data-route="${k}" type="button">${icon(routes[k].icon)}<span>${routes[k].nav}</span>${routes[k].badge ? `<span class="count" id="badge-${k}"></span>` : ""}</button>`).join("")}</div>`).join("") +
    `<div class="side-foot">Demonstration environment with sample data.<br><a href="signin.html">Switch view</a> &middot; <a href="index.html">Public site</a></div>`;
  if (tabbar) {
    const tb = document.getElementById("tabbar");
    tb.innerHTML = tabbar.map((k) => k === "more" ? `<button type="button" data-more>${icon("more")}More</button>` : `<button type="button" data-route="${k}">${icon(routes[k].icon)}${routes[k].tab || routes[k].nav}</button>`).join("");
  }
  const setSide = (open) => { side.classList.toggle("open", open); scrim.classList.toggle("show", open); };
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-menu]")) setSide(!side.classList.contains("open"));
    else if (e.target.closest("[data-more]")) setSide(true);
  });
  scrim.addEventListener("click", () => setSide(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setSide(false); });
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-route]"); if (b) { location.hash = b.dataset.route; setSide(false); } });

  function render() {
    let key = location.hash.replace("#", "").split("/")[0] || defaultRoute;
    if (!routes[key]) key = defaultRoute;
    const r = routes[key];
    document.querySelectorAll("[data-route]").forEach((b) => { if (b.dataset.route === key) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
    document.title = `${r.title} | NOURA ${brand}`;
    main.innerHTML = `<div class="topbar"><div style="display:flex;gap:16px;align-items:flex-start;"><button class="menu-btn" data-menu type="button" aria-label="Open menu">${icon("menu")}</button><div><h1 id="viewTitle" tabindex="-1">${r.title}</h1>${r.sub ? `<p class="sub">${typeof r.sub === "function" ? r.sub() : r.sub}</p>` : ""}</div></div><div class="btn-row" id="topActions"></div></div><div id="viewBody"></div>`;
    r.render(document.getElementById("viewBody"), document.getElementById("topActions"));
    hydrateMedia(main);
    window.scrollTo({ top: 0 });
    if (mountApp.first) { const t = document.getElementById("viewTitle"); if (t) t.focus({ preventScroll: true }); } else mountApp.first = true;
  }
  window.addEventListener("hashchange", render);
  render();
  return { render };
}

function downloadText(name, text, type = "text/plain") {
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function fmtDay(ts) { return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function fmtTime(ts) { return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }
function ago(ts) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return "just now"; if (m < 60) return m + " min ago";
  const h = Math.round(m / 60); if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
  const d = Math.round(h / 24); return d + (d === 1 ? " day ago" : " days ago");
}
function dayKey(d = new Date()) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function weekDates() {
  const now = new Date(); const mon = new Date(now); mon.setHours(12, 0, 0, 0); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d; });
}

function avatarHTML(key, letters, size = "") {
  const m = typeof MEDIA !== "undefined" ? MEDIA[key] : null;
  return `<span class="avatar ${size}">${letters}${m ? `<img src="${m.src}" alt="" style="object-position:${m.position}" onerror="this.remove()">` : ""}</span>`;
}

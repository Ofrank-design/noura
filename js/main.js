/* NOURA: shared behaviors for the public site and the app shells. */

/* ---- Local store (demonstration persistence) ----
   In production these keys map to database tables behind authenticated APIs.
   Here they let the public site, client portal and dietitian dashboard share
   state so the full journey can be followed in one browser. */
const Store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem("noura:" + key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("noura:" + key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    return value;
  },
  push(key, item, max = 200) {
    const list = Store.get(key, []); list.unshift(item);
    return Store.set(key, list.slice(0, max));
  },
};

/* ---- Toast ---- */
function toast(message) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite"); document.body.appendChild(el); }
  el.textContent = message; el.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove("show"), 3200);
}

/* ---- Modal ---- */
function openModal(html, onOpen) {
  closeModal();
  const back = document.createElement("div");
  back.className = "modal-backdrop open"; back.id = "modalBack";
  back.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><button class="close" aria-label="Close dialog">&times;</button>${html}</div>`;
  document.body.appendChild(back);
  const prev = document.activeElement;
  const close = () => { back.remove(); document.body.style.overflow = ""; if (prev && prev.focus) prev.focus(); document.removeEventListener("keydown", esc); };
  const esc = (e) => { if (e.key === "Escape") close(); };
  back.querySelector(".close").addEventListener("click", close);
  back.addEventListener("click", (e) => { if (e.target === back) close(); });
  document.addEventListener("keydown", esc);
  document.body.style.overflow = "hidden";
  const first = back.querySelector("input,select,textarea,button:not(.close)") || back.querySelector(".close");
  if (first) first.focus();
  back._close = close;
  if (onOpen) onOpen(back, close);
  return back;
}
function closeModal() { const b = document.getElementById("modalBack"); if (b && b._close) b._close(); }

/* ---- Helpers ---- */
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function qs(name) { return new URLSearchParams(location.search).get(name); }
function money(n) { return "$" + Number(n).toLocaleString("en-US"); }

/* ---- Header, drawer, navigation state ---- */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  const toggle = document.querySelector(".menu-toggle");
  const drawer = document.querySelector(".drawer");
  if (toggle && drawer) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      drawer.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  const page = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav a[href], .drawer a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    const related = { "recipe.html": "recipes.html", "article.html": "journal.html", "program.html": "programs.html" }[page];
    if (href === page || href === related) a.setAttribute("aria-current", "page");
  });

  /* Reveal on scroll */
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
  } else { items.forEach((el) => el.classList.add("in")); }

  /* Newsletter forms */
  document.querySelectorAll("form.newsletter").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = f.querySelector("input[type=email]");
    if (!input.value || !input.checkValidity()) { input.focus(); toast("Please enter a valid email address."); return; }
    Store.push("subscribers", { email: input.value, at: Date.now() });
    f.reset(); toast("Thank you. You are on the list for The Notebook.");
  }));
});

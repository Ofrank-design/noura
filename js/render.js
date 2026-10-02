/* NOURA: renderers shared by public pages. */

function programCard(p) {
  return `<article class="program-card reveal">
    <a href="program.html?slug=${p.slug}" tabindex="-1" aria-hidden="true">${mediaFrame(p.media, "ratio-16x10 no-round")}</a>
    <div class="body">
      <div class="weeks">${esc(p.weeks)}</div>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.tagline)}</p>
      <div class="chips-static">${p.focus.slice(0, 3).map((f) => `<span class="chip-static">${esc(f)}</span>`).join("")}</div>
      <a class="link-arrow" href="program.html?slug=${p.slug}">View program<span aria-hidden="true">→</span></a>
    </div>
  </article>`;
}

function recipeCard(r) {
  return `<article class="recipe-card reveal">
    <a href="recipe.html?id=${r.id}" aria-hidden="true" tabindex="-1">${mediaFrame(r.media, "ratio-4x5")}</a>
    <div>
      <div class="meta"><span>${r.prep + r.cook} min</span><span>${r.nutrition.protein} g protein</span></div>
      <h3><a href="recipe.html?id=${r.id}">${esc(r.title)}</a></h3>
    </div>
  </article>`;
}

function journalCard(a) {
  return `<article class="journal-card reveal">
    <a href="article.html?slug=${a.slug}" aria-hidden="true" tabindex="-1">${mediaFrame(a.media, "ratio-3x2")}</a>
    <div class="meta"><span>${esc(a.category)}</span><span class="date">${esc(a.date)}</span></div>
    <h3><a href="article.html?slug=${a.slug}">${esc(a.title)}</a></h3>
    <p>${esc(a.excerpt)}</p>
  </article>`;
}

function personCard(m) {
  return `<article class="person reveal">
    ${mediaFrame(m.media, "ratio-4x5")}
    <div>
      <div class="role">${esc(m.role)}</div>
      <h3>${esc(m.name)}</h3>
    </div>
    <p>${esc(m.bio)}</p>
  </article>`;
}

function storyBlock(s) {
  return `<article class="story">
    <div>
      ${mediaFrame(s.media, "ratio-4x5 arch-soft")}
    </div>
    <div>
      <blockquote>&ldquo;${esc(s.quote)}&rdquo;</blockquote>
      <p class="who">${esc(s.name)}, ${esc(s.detail)}. ${esc(s.program)} program.</p>
      <dl>
        <dt>Before</dt><dd>${esc(s.before)}</dd>
        <dt>Challenge</dt><dd>${esc(s.challenge)}</dd>
        <dt>Intervention</dt><dd>${esc(s.intervention)}</dd>
        <dt>Experience</dt><dd>${esc(s.experience)}</dd>
        <dt>Outcome</dt><dd>${esc(s.outcome)}</dd>
      </dl>
    </div>
  </article>`;
}

function faqBlock(list) {
  return list.map((f) => `<details><summary>${esc(f.q)}</summary><div class="answer"><p>${esc(f.a)}</p></div></details>`).join("");
}

function fillGrid(id, html) { const el = document.getElementById(id); if (el) { el.innerHTML = html; hydrateMedia(el); } }

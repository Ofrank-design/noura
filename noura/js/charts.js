/* NOURA: small dependency free SVG charts. */

function chartLine({ labels, series, height = 240, min = null, max = null, fmt = (v) => v, ticks = 4 }) {
  const W = 720, H = height, pl = 44, pr = 16, pt = 16, pb = 34;
  const all = series.flatMap((s) => s.data);
  const lo = min !== null ? min : Math.floor(Math.min(...all) * 0.9);
  const hi = max !== null ? max : Math.ceil(Math.max(...all) * 1.08);
  const x = (i) => pl + (i * (W - pl - pr)) / Math.max(1, labels.length - 1);
  const y = (v) => pt + (1 - (v - lo) / (hi - lo || 1)) * (H - pt - pb);
  let g = "";
  for (let t = 0; t <= ticks; t++) {
    const v = lo + ((hi - lo) * t) / ticks, yy = y(v);
    g += `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${yy}" y2="${yy}"/><text x="${pl - 10}" y="${yy + 4}" text-anchor="end">${fmt(Math.round(v * 10) / 10)}</text>`;
  }
  const xl = labels.map((l, i) => `<text x="${x(i)}" y="${H - 10}" text-anchor="middle">${l}</text>`).join("");
  const lines = series.map((s, si) => {
    const pts = s.data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const area = si === 0 && series.length === 1 ? `<polygon points="${x(0)},${H - pb} ${pts} ${x(s.data.length - 1)},${H - pb}" fill="${s.color}" opacity=".10"/>` : "";
    const dots = s.data.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="var(--paper)" stroke="${s.color}" stroke-width="2"><title>${labels[i]}: ${fmt(v)}</title></circle>`).join("");
    return `${area}<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>${dots}`;
  }).join("");
  const desc = series.map((s) => `${s.name}: ${s.data.map((v, i) => labels[i] + " " + fmt(v)).join(", ")}`).join(". ");
  const legend = series.length > 1 ? `<div class="legend">${series.map((s) => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join("")}</div>` : "";
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(desc)}">${g}${xl}${lines}</svg>${legend}`;
}

function chartBars({ labels, data, height = 220, color = "var(--olive)", fmt = (v) => v }) {
  const W = 720, H = height, pl = 44, pr = 12, pt = 16, pb = 34;
  const hi = Math.max(...data) * 1.15, bw = (W - pl - pr) / data.length;
  let g = "";
  for (let t = 0; t <= 4; t++) { const v = (hi * t) / 4, yy = pt + (1 - v / hi) * (H - pt - pb); g += `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${yy}" y2="${yy}"/><text x="${pl - 10}" y="${yy + 4}" text-anchor="end">${fmt(Math.round(v))}</text>`; }
  const bars = data.map((v, i) => { const h = (v / hi) * (H - pt - pb); const bx = pl + i * bw + bw * 0.22; return `<rect x="${bx}" y="${H - pb - h}" width="${bw * 0.56}" height="${h}" rx="6" fill="${color}"><title>${labels[i]}: ${fmt(v)}</title></rect><text x="${bx + bw * 0.28}" y="${H - 10}" text-anchor="middle">${labels[i]}</text>`; }).join("");
  const desc = data.map((v, i) => `${labels[i]} ${fmt(v)}`).join(", ");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(desc)}">${g}${bars}</svg>`;
}

function ringChart(pct, label, color = "var(--olive)") {
  const r = 46, c = 2 * Math.PI * r, off = c * (1 - Math.min(100, pct) / 100);
  return `<div class="ring-item"><div class="ring" role="img" aria-label="${esc(label)} ${pct} percent"><svg width="110" height="110" viewBox="0 0 110 110"><circle cx="55" cy="55" r="${r}" fill="none" stroke="var(--stone-soft)" stroke-width="9"/><circle cx="55" cy="55" r="${r}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}"/></svg><div class="val">${pct}%</div></div>${esc(label)}</div>`;
}

function spark(data, color = "var(--olive)") {
  const W = 90, H = 28, lo = Math.min(...data), hi = Math.max(...data);
  const pts = data.map((v, i) => `${data.length > 1 ? (i * W) / (data.length - 1) : W / 2},${H - 3 - ((v - lo) / (hi - lo || 1)) * (H - 6)}`).join(" ");
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function barRows(rows, suffix = "") {
  const hi = Math.max(...rows.map((r) => r[1]));
  return rows.map(([k, v]) => `<div class="bar-row"><span>${esc(k)}</span><div class="track"><div class="fill" style="width:${(v / hi) * 100}%"></div></div><b>${v}${suffix}</b></div>`).join("");
}

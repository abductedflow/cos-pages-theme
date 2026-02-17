(function () {
  function esc(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function linkHtml(link) {
    const href = esc(link.href || "#");
    const label = esc(link.label || href);
    const ext = link.external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${href}"${ext}>${label}</a>`;
  }

  function faviconLetter(cfg) {
    const source = String(cfg.wordmark || cfg.metaTitle || "S");
    const first = source.trim().charAt(0) || "S";
    return first.toUpperCase();
  }

  function setFavicon(letter) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">\n  <rect width="64" height="64" rx="12" fill="#6F00FF"/>\n  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-size="40" font-family="Arial, Helvetica, sans-serif" font-weight="700">${letter}</text>\n</svg>`;
    const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;

    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "icon");
      document.head.appendChild(link);
    }
    link.setAttribute("type", "image/svg+xml");
    link.setAttribute("href", href);
  }

  async function loadConfig() {
    const res = await fetch("config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Unable to load config.json");
    return res.json();
  }

  function render(cfg) {
    document.title = cfg.metaTitle || "Site";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", cfg.metaDescription || "");
    setFavicon(faviconLetter(cfg));

    const nav = (cfg.nav || []).map(linkHtml).join("");
    const cards = (cfg.sections || []).map((s) => {
      const links = (s.links || []).map(linkHtml).join(" · ");
      return `<article class="card">
        <div class="kicker">${esc(s.kicker)}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.body)}</p>
        <div>${links}</div>
      </article>`;
    }).join("");

    document.getElementById("app").innerHTML = `
      <header>
        <h1 class="wordmark">${esc(cfg.wordmark || "SITE")}</h1>
        <p class="tagline">${esc(cfg.tagline || "")}</p>
        <nav>${nav}</nav>
      </header>
      <section class="hero">
        <h2>${esc(cfg.heroLine || "")}</h2>
        <p>${esc(cfg.heroSub || "")}</p>
      </section>
      <section class="grid">${cards}</section>
      <footer>
        <span>${esc(cfg.footerLeft || "")}</span>
        <span>${esc(cfg.footerRight || "")}</span>
      </footer>
    `;
  }

  loadConfig().then(render).catch((err) => {
    const app = document.getElementById("app");
    if (app) app.innerHTML = `<pre>${esc(err.message)}</pre>`;
  });
})();

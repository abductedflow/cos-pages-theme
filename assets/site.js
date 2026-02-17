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

  async function loadConfig() {
    const res = await fetch("config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Unable to load config.json");
    return res.json();
  }

  function render(cfg) {
    document.title = cfg.metaTitle || "Site";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", cfg.metaDescription || "");

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

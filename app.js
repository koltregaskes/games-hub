/* GameTrackDaily Arcade app
   Vanilla JS renderer for the static GitHub Pages site.
   Public data stays in data/*.json; provisional design rows stay clearly marked.
*/

(() => {
  "use strict";

  const BASE_URL = "https://koltregaskes.github.io/gametrackdaily/";
  const NOW = () => Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const PLATFORMS = {
    pc: { id: "pc", label: "PC", long: "Windows PC", css: "var(--pc)", schema: "Windows PC" },
    xbox: { id: "xbox", label: "Xbox", long: "Xbox Series X|S", css: "var(--xbox)", schema: "Xbox Series X|S" },
    ps: { id: "ps", label: "PS5", long: "PlayStation 5", css: "var(--ps)", schema: "PlayStation 5" },
    browser: { id: "browser", label: "Web", long: "Browser", css: "var(--browser)", schema: "Web browser" },
  };

  const RAILS = [
    {
      id: "dev",
      feedIds: ["dev", "game-dev", "development"],
      title: "Game Dev",
      colour: "var(--pc)",
      route: "news-development.html",
      desc: "Engine releases, tooling, middleware, store policy, production craft, and the business of making games.",
      sources: ["Game Developer", "GDC", "Godot", "Unity", "Unreal Engine", "Steamworks", "How To Market A Game"],
    },
    {
      id: "gaming",
      feedIds: ["gaming"],
      title: "Gaming",
      colour: "var(--brand)",
      route: "news-gaming.html",
      desc: "Platform moves, releases, notable studio stories, and the wider games industry.",
      sources: ["IGN", "Eurogamer", "GamesIndustry.biz", "Polygon", "Rock Paper Shotgun", "Steam", "PlayStation Blog", "Xbox Wire"],
    },
    {
      id: "review",
      feedIds: ["review", "reviews"],
      title: "Reviews",
      colour: "var(--xbox)",
      route: "news-reviews.html",
      desc: "Final verdicts and scored criticism from major games outlets.",
      sources: ["IGN", "GameSpot", "Eurogamer", "PC Gamer", "GamesRadar+", "Rock Paper Shotgun"],
    },
    {
      id: "preview",
      feedIds: ["preview", "previews"],
      title: "Previews",
      colour: "var(--ps)",
      route: "news-previews.html",
      desc: "Hands-on impressions, showcase reactions, and unscored first looks.",
      sources: ["IGN", "GameSpot", "Eurogamer", "PC Gamer", "GamesRadar+", "PlayStation Blog", "Xbox Wire"],
    },
  ];

  const PROVISIONAL_RELEASES = [
    { id: "crimson-skylines", title: "Crimson Skylines", date: "2026-05-19", platforms: ["pc", "xbox"], launcher: ["Steam", "Game Pass"], hype: "high", genre: "Strategy", _example: true },
    { id: "garrison-final-mile", title: "Garrison: Final Mile", date: "2026-05-22", platforms: ["pc", "ps"], launcher: ["Steam", "PS Store"], hype: "med", genre: "Tactical shooter", _example: true },
    { id: "driftcourt", title: "Driftcourt", date: "2026-05-26", platforms: ["pc"], launcher: ["Steam"], hype: "low", genre: "Racing", _example: true },
    { id: "vector-trials-2", title: "Vector Trials 2", date: "2026-05-27", platforms: ["pc"], launcher: ["Steam", "GOG"], hype: "med", genre: "Arcade", _example: true },
    { id: "slow-light-engine", title: "Slow Light Engine", date: "2026-06-03", platforms: ["ps"], launcher: ["PS Store"], hype: "high", genre: "Adventure", _example: true },
    { id: "mandate-2029-demo", title: "Mandate 2029 demo", date: "2026-06-06", platforms: ["browser"], launcher: ["Web"], hype: "ours", ours: true, genre: "Political strategy", _example: true },
    { id: "holdback-republic", title: "Holdback Republic", date: "2026-06-12", platforms: ["pc", "xbox"], launcher: ["Steam", "Xbox Store", "Game Pass"], hype: "med", genre: "RPG", _example: true },
    { id: "civicrise-beta", title: "Civicrise beta", date: "2026-06-18", platforms: ["browser"], launcher: ["Web"], hype: "ours", ours: true, genre: "City builder", _example: true },
    { id: "azure-flag", title: "Azure Flag", date: "2026-06-25", platforms: ["pc", "xbox", "ps"], launcher: ["Steam", "Xbox Store", "PS Store"], hype: "high", genre: "Open world", _example: true },
    { id: "swarmbreaker-public", title: "Swarmbreaker public build", date: "2026-07-02", platforms: ["pc"], launcher: ["itch.io"], hype: "ours", ours: true, genre: "Arcade", _example: true },
  ];

  const PROVISIONAL_NEWS = [
    { feed: "dev", t: "Godot 5 hits stable with a redesigned visual scripting layer", src: "Game Developer", h: "example", tag: "engine", _example: true },
    { feed: "dev", t: "Steamworks adds long-form Direct review notes for unreleased titles", src: "Steamworks", h: "example", tag: "platform", _example: true },
    { feed: "dev", t: "Unity 7's render pipelines unify under one configurable graph", src: "Unity", h: "example", tag: "engine", _example: true },
    { feed: "gaming", t: "PlayStation reorganises first-party output around longer windows", src: "Eurogamer", h: "example", tag: "platform", platforms: ["ps"], _example: true },
    { feed: "gaming", t: "Xbox confirms Game Pass day-one slate for the summer showcase", src: "Xbox Wire", h: "example", tag: "platform", platforms: ["xbox"], _example: true },
    { feed: "gaming", t: "Valve quietly tightens refund rules for early-access leavers", src: "PC Gamer", h: "example", tag: "platform", platforms: ["pc"], _example: true },
    { feed: "review", t: "Crimson Skylines: a tense, restrained 8/10", src: "Rock Paper Shotgun", h: "example", tag: "review", score: 8, platforms: ["pc", "xbox"], _example: true },
    { feed: "review", t: "Garrison: Final Mile: a difficult, durable shooter", src: "PC Gamer", h: "example", tag: "review", score: 82, platforms: ["pc", "ps"], _example: true },
    { feed: "review", t: "Vector Trials 2: sequel finds its rhythm late", src: "Eurogamer", h: "example", tag: "review", score: 7, platforms: ["pc"], _example: true },
    { feed: "preview", t: "Hands-on: Slow Light Engine's traversal loop", src: "Edge", h: "example", tag: "preview", platforms: ["ps"], _example: true },
    { feed: "preview", t: "Holdback Republic preview: politics meets party RPG", src: "Eurogamer", h: "example", tag: "preview", platforms: ["pc", "xbox"], _example: true },
    { feed: "preview", t: "Dune: Awakening preview: survival with politics layered in", src: "PC Gamer", h: "example", tag: "preview", platforms: ["pc"], _example: true },
  ];

  const fallbackLiteracy = [
    { id: "write", title: "How To Write A Game Review", summary: "Structure, criticism, disclosure, and the difference between a useful review and a vague opinion dump.", path: "shared/game-reviews/how-to-write-a-game-review.md" },
    { id: "score", title: "How To Score A Game", summary: "How major outlets use scales, when not to score at all, and how to avoid fake precision.", path: "shared/game-reviews/how-to-score-a-game.md" },
    { id: "process", title: "Review Process And Disclosure", summary: "Assignment, play time, disclosure, review-in-progress logic, and updated-review rules.", path: "shared/game-reviews/review-process-previews-and-ethics.md" },
    { id: "previews", title: "Previews Vs Reviews", summary: "Handling limited-access builds honestly. Previews inform; they should not pretend to be verdicts.", path: "shared/game-reviews/previews-vs-reviews.md" },
    { id: "studio", title: "Studio Feedback Loops", summary: "How small teams use a standing reviewer session to feed criticism back into development.", path: "shared/game-reviews/internal-review-loops-for-studios.md" },
  ];

  let state = {
    data: null,
    countdownTimer: null,
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function attrs(obj) {
    return Object.entries(obj)
      .filter(([, v]) => v !== undefined && v !== null && v !== false)
      .map(([k, v]) => `${k}="${esc(v)}"`)
      .join(" ");
  }

  async function readJson(path, fallback) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(`${path}: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn(`GameTrackDaily: using fallback for ${path}`, error);
      return fallback;
    }
  }

  function platformId(value) {
    const v = String(value || "").toLowerCase();
    if (v.includes("playstation") || v === "ps" || v === "ps5" || v.includes("ps vr")) return "ps";
    if (v.includes("xbox")) return "xbox";
    if (v.includes("windows") || v.includes("pc") || v.includes("steam") || v.includes("gog") || v.includes("epic")) return "pc";
    if (v.includes("browser") || v.includes("web")) return "browser";
    return null;
  }

  function normalisePlatforms(list) {
    return [...new Set((list || []).map(platformId).filter(Boolean))];
  }

  function gameArtPath(game) {
    return `assets/games/${game.id}.svg`;
  }

  function normaliseGames(manifest) {
    return (manifest.games || []).map((game) => ({
      id: game.id,
      title: game.title,
      tagline: game.tagline,
      cat: game.category || game.cat || "Game",
      stage: game.stage || "Emerging",
      status: game.status || game.publicStatus || "In development",
      platforms: normalisePlatforms(game.platforms),
      art: gameArtPath(game),
      play: game.playUrl,
      repo: game.repoUrl,
      summary: game.summary,
      highlights: game.highlights || [],
    }));
  }

  function normaliseRelease(item) {
    const platforms = normalisePlatforms(item.platforms || item.platformFocus);
    return {
      id: item.id,
      title: item.title,
      date: item.date,
      platforms: platforms.length ? platforms : ["pc"],
      launcher: item.launcher || item.launchers || inferLaunchers(item.platforms),
      hype: item.hype || (item.ours ? "ours" : "tracked"),
      genre: item.genre || item.category || item.trackingState || "Tracked",
      ours: Boolean(item.ours),
      source: item.source || "Public manifest",
      officialUrl: item.officialUrl || item.url,
      _example: Boolean(item._example),
    };
  }

  function inferLaunchers(platforms = []) {
    const ids = normalisePlatforms(platforms);
    const labels = [];
    if (ids.includes("pc")) labels.push("Steam / PC");
    if (ids.includes("xbox")) labels.push("Xbox Store");
    if (ids.includes("ps")) labels.push("PS Store");
    if (ids.includes("browser")) labels.push("Web");
    return labels.length ? labels : ["Tracked"];
  }

  function normaliseEvents(calendar) {
    return (calendar.events || []).map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      endDate: event.endDate,
      startAtUTC: event.startAt || event.startAtUTC || `${event.date}T18:00:00Z`,
      kind: event.kind || "event",
      platforms: normalisePlatforms(event.platformFocus || event.platforms),
      where: [event.venue, event.city].filter(Boolean).join(" · ") || event.where || "Online",
      note: event.notes || event.note || "",
      watch: event.watchUrl || event.officialUrl || "#",
      watchLabel: event.watchLabel || "Watch event",
      source: event.source || "Official event page",
      status: event.status || "tracked",
    })).sort((a, b) => new Date(a.startAtUTC) - new Date(b.startAtUTC));
  }

  function normaliseNews(newsManifest) {
    const fromManifest = [];
    (newsManifest.feeds || []).forEach((feed) => {
      const rail = railForFeed(feed.id);
      (feed.items || []).forEach((item) => {
        fromManifest.push({
          feed: rail.id,
          t: item.title || item.t,
          src: item.source || item.src || feed.title,
          h: item.age || item.h || readableAge(item.publishedAt || feed.generatedAt),
          tag: item.tag || item.category || rail.title,
          platforms: normalisePlatforms(item.platforms || item.platformFocus),
          score: item.score,
          url: item.url,
          _example: Boolean(item._example),
        });
      });
    });
    return fromManifest.length ? fromManifest : PROVISIONAL_NEWS;
  }

  function railForFeed(feedId) {
    return RAILS.find((rail) => rail.feedIds.includes(feedId)) || RAILS[0];
  }

  function readableAge(value) {
    if (!value) return "undated";
    const then = new Date(value).getTime();
    if (!Number.isFinite(then)) return "undated";
    const hours = Math.max(1, Math.round((NOW() - then) / (60 * 60 * 1000)));
    return hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`;
  }

  function normaliseLiteracy(manifest) {
    return (manifest.sections || fallbackLiteracy).map((section) => ({
      id: section.id,
      title: section.title,
      summary: section.summary,
      path: section.path,
      lastReviewed: section.lastReviewed,
    }));
  }

  async function loadData() {
    const [gamesManifest, releaseCalendar, gamesNews, reviewsManifest] = await Promise.all([
      readJson("data/games-manifest.json", { games: [] }),
      readJson("data/release-calendar.json", { releases: [], undated: [], events: [] }),
      readJson("data/games-news.json", { feeds: [] }),
      readJson("data/reviews-manifest.json", { sections: fallbackLiteracy }),
    ]);

    const datedFutureReleases = (releaseCalendar.releases || [])
      .filter((release) => release.date && new Date(`${release.date}T23:59:59Z`).getTime() >= NOW())
      .map(normaliseRelease);
    const usingProvisionalReleases = datedFutureReleases.length === 0;

    const undated = (releaseCalendar.undated || []).map(normaliseRelease);
    const releases = (usingProvisionalReleases ? PROVISIONAL_RELEASES : datedFutureReleases).map(normaliseRelease);
    const news = normaliseNews(gamesNews);

    return {
      games: normaliseGames(gamesManifest),
      releases,
      undated,
      events: normaliseEvents(releaseCalendar),
      news,
      literacy: normaliseLiteracy(reviewsManifest),
      meta: {
        gamesUpdated: gamesManifest.updatedAt,
        releaseUpdated: releaseCalendar.updatedAt,
        newsUpdated: gamesNews.updatedAt,
        reviewsUpdated: reviewsManifest.updatedAt,
        releaseNotice: releaseCalendar.notice,
        newsNotice: gamesNews.notice,
        usingProvisionalReleases,
        usingProvisionalNews: news.every((item) => item._example),
      },
    };
  }

  function fmtDate(iso) {
    const date = new Date(`${iso}${String(iso).length === 10 ? "T00:00:00Z" : ""}`);
    if (!Number.isFinite(date.getTime())) return { day: "--", month: "---", dow: "---", long: "Date pending" };
    return {
      day: String(date.getUTCDate()).padStart(2, "0"),
      month: date.toLocaleString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase(),
      dow: date.toLocaleString("en-GB", { weekday: "short", timeZone: "UTC" }).toUpperCase(),
      long: date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
    };
  }

  function monthKey(iso) {
    return new Date(`${iso}T00:00:00Z`).toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  }

  function platformColour(platform) {
    return PLATFORMS[platform]?.css || "var(--ink)";
  }

  function platformPills(platforms = [], boxed = true) {
    if (!platforms.length) return "";
    return `<span class="pill-row">${platforms.map((id) => {
      const p = PLATFORMS[id] || PLATFORMS.pc;
      return `<span class="pf pf--${esc(p.id)} ${boxed ? "boxed" : ""}"><span class="pf-dot"></span>${esc(p.label)}</span>`;
    }).join("")}</span>`;
  }

  function launcherList(launchers = []) {
    return `<span class="launcher">${(launchers || []).map(esc).join("<span aria-hidden=\"true\">·</span>")}</span>`;
  }

  function dateBlock(iso, accent) {
    const d = fmtDate(iso);
    return `
      <div class="date-block" style="--platform:${accent}">
        <span class="bignum date-block__day">${d.day}</span>
        <span class="date-block__month">${d.month}</span>
      </div>
    `;
  }

  function gameArt(src, label = "", height = 200, accent = "var(--brand)") {
    return `
      <div class="game-art" style="--art-height:${height}px;--platform:${accent}">
        ${src ? `<img src="${esc(src)}" alt="" loading="lazy" decoding="async">` : ""}
        ${label ? `<span class="game-art__label">${esc(label)}</span>` : ""}
      </div>
    `;
  }

  function sectionHead(no, title, meta = "") {
    return `
      <div class="section-head">
        <span class="section-head__no">${esc(no)}</span>
        <h2 class="section-head__title">${title}</h2>
        ${meta ? `<div class="section-head__meta">${meta}</div>` : ""}
      </div>
    `;
  }

  function marquee(items, kind = "") {
    const doubled = [...items, ...items];
    return `
      <div class="marquee ${kind === "brand" ? "marquee--brand" : ""}">
        <div class="marquee__track" aria-hidden="true">
          ${doubled.map((item) => `<span>${esc(item)}</span><span class="dot">★</span>`).join("")}
        </div>
      </div>
    `;
  }

  function nav(active) {
    const links = [
      ["home", "Home", "index.html"],
      ["releases", "Releases", "releases.html"],
      ["events", "Events", "events.html"],
      ["news", "News", "news.html"],
      ["reviews", "Reviews", "reviews.html"],
    ];
    return `
      <header class="nav">
        <a class="nav__brand" href="index.html">GAME<span class="slash">/</span>TRACK<span class="slash">/</span>DAILY</a>
        <nav class="nav__links" aria-label="Primary">
          ${links.slice(1).map(([id, label, href]) => `
            <a class="nav__link" href="${href}" ${active === id ? 'aria-current="page"' : ""}>${label}</a>
          `).join("")}
        </nav>
        <div class="nav__right">
          <button class="nav__utility" type="button" data-scanline-toggle aria-pressed="false">CRT off</button>
          <span class="nav__live" data-clock>Local time</span>
        </div>
      </header>
    `;
  }

  function footer() {
    return `
      <footer class="footer">
        <p>GameTrackDaily - a curated games tracking site for Windows PC, Xbox, PlayStation, and E-lusion Studios browser demos.</p>
        <p style="text-align:right">© 2026 Kol Tregaskes</p>
      </footer>
    `;
  }

  function pageFrame(page, content, bottom = "") {
    const topItems = [
      "GameTrackDaily editorial watch desk",
      "Windows PC · Xbox · PlayStation",
      "Studio slate highlighted in brand red",
      "Provisional data is labelled",
      "Events use official watch destinations",
    ];
    return `
      <div class="scanline-layer" aria-hidden="true"></div>
      <div class="page-shell">
        ${marquee(topItems)}
        ${nav(page === "calendar" ? "releases" : page)}
        <main id="main-content" class="rise">${content}</main>
        ${footer()}
        ${bottom}
      </div>
    `;
  }

  function nextRelease(data) {
    return data.releases
      .filter((release) => release.date)
      .map((release) => ({ ...release, t: new Date(`${release.date}T22:00:00Z`).getTime() }))
      .filter((release) => release.t >= NOW() - DAY)
      .sort((a, b) => a.t - b.t)[0];
  }

  function nextEvent(data) {
    return data.events
      .map((event) => ({ ...event, t: new Date(event.startAtUTC).getTime() }))
      .filter((event) => event.t >= NOW() - DAY)
      .sort((a, b) => a.t - b.t)[0];
  }

  function renderHome(data) {
    const release = nextRelease(data);
    const event = nextEvent(data);
    const heroTarget = release || event;
    const targetIso = release ? `${release.date}T22:00:00Z` : event?.startAtUTC;
    const title = release ? release.title : event?.title || "Schedule pending";
    const heroType = release ? "Next tracked drop" : "Next confirmed event";
    const platforms = release ? release.platforms : event?.platforms || ["pc"];
    const launchers = release ? release.launcher : [event?.watchLabel || "Official page"];
    const genre = release ? release.genre : event?.kind || "Event";
    const heroArtSrc = data.games.find((game) => game.id === "civicrise")?.art || data.games[0]?.art;
    const thisWeek = data.releases.filter((item) => {
      const t = new Date(`${item.date}T22:00:00Z`).getTime();
      return t >= NOW() - DAY && t < NOW() + 7 * DAY;
    });
    const next2 = data.releases.filter((item) => {
      const t = new Date(`${item.date}T22:00:00Z`).getTime();
      return t >= NOW() + 7 * DAY && t < NOW() + 21 * DAY;
    }).slice(0, 4);

    const metrics = [
      ["Tracked titles", String(data.releases.length + data.undated.length).padStart(2, "0"), "var(--ink)"],
      ["This week", String(thisWeek.length).padStart(2, "0"), "var(--brand)"],
      ["Events queued", String(data.events.filter((e) => new Date(e.startAtUTC).getTime() >= NOW() - DAY).length).padStart(2, "0"), "var(--pc)"],
      ["Our slate", String(data.games.length).padStart(2, "0"), "var(--xbox)"],
    ];

    return pageFrame("home", `
      <section class="hero shell">
        <div class="hero-grid">
          <div class="hero__stack">
            <div>
              <div class="eyebrow"><span class="acc">●</span> ${esc(heroType)} · T-minus</div>
              ${targetIso ? `<div class="countdown" data-countdown="${esc(targetIso)}" data-countdown-style="big"></div>` : ""}
              <div style="margin-top:22px;display:flex;align-items:baseline;gap:14px;flex-wrap:wrap">
                <h1 class="display glitch" style="font-size:clamp(2.4rem,5.5vw,4.4rem);margin:0">${esc(title)}</h1>
                ${release?.ours ? '<span class="tag brand">OURS</span>' : ""}
              </div>
              <div style="margin-top:14px;display:flex;gap:18px;align-items:center;flex-wrap:wrap">
                ${platformPills(platforms)}
                ${launcherList(launchers)}
                <span class="eyebrow">${esc(genre)}</span>
              </div>
              ${data.meta.usingProvisionalReleases ? `<div class="notice"><span class="acc">◇ PROVISIONAL</span><span>The public release manifest currently has no future dated releases. These release rows come from the design handoff and are labelled as examples until the release pipeline is refreshed.</span></div>` : ""}
            </div>
            <div class="action-row">
              <a class="btn btn--brand" href="releases.html">See the release schedule <span class="arrow">-></span></a>
              <a class="btn btn--ghost" href="events.html">Tonight's events</a>
            </div>
          </div>
          <article class="card" style="overflow:hidden">
            <div style="position:absolute;top:14px;left:14px;z-index:3"><span class="tag live">TRACKED</span></div>
            ${gameArt(heroArtSrc, "MAIN EVENT", 460)}
            <div style="padding:18px;border-top:2px solid var(--ink)">
              <div class="eyebrow">// ${release ? `Launch window · ${fmtDate(release.date).month} ${fmtDate(release.date).day}` : "Event window"}</div>
              <div class="display" style="font-size:34px;margin-top:6px">${release ? "Target time <span class='acc'>22:00 BST</span>" : "Official page <span class='acc'>linked</span>"}</div>
              <p class="copy" style="margin:10px 0 0;font-size:14px">Curated tracking for launches, showcases, and studio demos. Seeded values stay marked until a public pipeline proves them.</p>
            </div>
          </article>
        </div>
      </section>

      <section class="shell">
        <div class="cols-4 rise-stagger" style="margin-top:20px">
          ${metrics.map(([k, v, c]) => `<div class="metric"><div class="eyebrow">${esc(k)}</div><div class="bignum metric__value" style="color:${c}">${esc(v)}</div></div>`).join("")}
        </div>
      </section>

      <section class="shell" style="margin-top:40px">
        ${sectionHead("ROUND 01", "This week's card", `<span class="tag">${thisWeek.length} bouts</span><a class="btn btn--ghost btn--small" href="releases.html">Full card <span class="arrow">-></span></a>`)}
        <div class="row-grid">
          ${thisWeek.length ? thisWeek.map(releaseRow).join("") : `<div style="padding:32px 22px;color:var(--ink-3);font-family:var(--mono);font-size:12px;letter-spacing:.18em;text-transform:uppercase">No dated releases inside this exact window. Open the release schedule for provisional and undated tracked items.</div>`}
        </div>
      </section>

      <section class="shell" style="margin-top:36px">
        ${sectionHead("ROUND 02", "The two-week horizon", `<span class="tag">${next2.length} bouts · mixed platforms</span>`)}
        <div class="cols-2">
          ${next2.length ? next2.map((r, i) => vsCell(r, i % 2 ? "R" : "L")).join("") : data.undated.slice(0, 4).map((r, i) => vsCell({ ...r, date: "" }, i % 2 ? "R" : "L")).join("")}
        </div>
      </section>

      <section class="shell" style="margin-top:44px">
        ${sectionHead("ROSTER", `Our slate <span class="acc">-</span> seven in motion`, `<span class="pf pf--browser boxed"><span class="pf-dot"></span>Browser</span><span class="pf pf--pc boxed"><span class="pf-dot"></span>PC</span>`)}
        <div class="cols-4 rise-stagger">
          ${data.games.slice(0, 4).map((game, i) => rosterCard(game, i + 1)).join("")}
        </div>
        <div class="cols-3 rise-stagger" style="margin-top:-2px">
          ${data.games.slice(4, 7).map((game, i) => rosterCard(game, i + 5)).join("")}
        </div>
      </section>

      <section class="shell" style="margin-top:44px">
        ${sectionHead("WIRE", "Tonight's signal", `<span class="tag">${data.news.length} items</span><a class="btn btn--ghost btn--small" href="news.html">Open wire <span class="arrow">-></span></a>`)}
        <div class="cols-4">
          ${RAILS.map((rail) => {
            const items = data.news.filter((item) => item.feed === rail.id).slice(0, 2);
            return `<article class="rail-card" style="--rail:${rail.colour}">
              <span class="tag brand-ghost">${esc(rail.title)}</span>
              <div style="margin-top:14px">${items.map((item, i) => `
                <div style="padding:12px 0;border-top:${i ? "1px dashed var(--line)" : "0"}">
                  <div style="font-weight:600;line-height:1.25">${esc(item.t)}</div>
                  <div class="eyebrow" style="margin-top:8px;font-size:9px">${esc(item.src)} · ${esc(item.h)}${item.score ? ` · <span class="acc">${scoreOutOfTen(item.score)}/10</span>` : ""}</div>
                </div>`).join("")}</div>
            </article>`;
          }).join("")}
        </div>
      </section>
    `, `<div style="margin-top:56px">${marquee(["Insert coin", "1986 -> 2026", "GameTrackDaily - built for players who watch the card", "Windows PC · Xbox · PlayStation", "Studio slate in brand red"], "brand")}</div>`);
  }

  function releaseRow(release, index = 1) {
    const primary = release.platforms[0] || "pc";
    const colour = platformColour(primary);
    const d = release.date ? dateBlock(release.date, colour) : `<div class="date-block" style="--platform:${colour}"><span class="bignum date-block__day">TBD</span><span class="date-block__month">DATE</span></div>`;
    return `
      <article class="release-row ${release.ours ? "is-ours" : ""}" data-platforms="${esc(release.platforms.join(" "))}" data-ours="${release.ours ? "true" : "false"}" data-release-card style="--platform:${colour}">
        <div class="stripe-cell" style="background:${colour}">${String(index).padStart(2, "0")}</div>
        <div class="cell" style="padding:0">${d}</div>
        <div class="cell">
          <h3 class="display glitch row-title">${esc(release.title)}${release.ours ? " <span class='acc'>★</span>" : ""}</h3>
          <div class="eyebrow" style="margin-top:6px;font-size:10px">${esc(release.genre)}${release.hype === "high" ? " · <span class='acc'>High signal</span>" : ""}${release._example ? " · example" : ""}</div>
        </div>
        <div class="cell">${launcherList(release.launcher)}</div>
        <div class="cell">${platformPills(release.platforms)}</div>
        <div class="row-arrow">-></div>
      </article>
    `;
  }

  function releaseCard(release) {
    const primary = release.platforms[0] || "pc";
    const colour = platformColour(primary);
    return `
      <article class="release-card" data-platforms="${esc(release.platforms.join(" "))}" data-ours="${release.ours ? "true" : "false"}" data-release-card style="--platform:${colour}">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-top:8px">
          ${release.date ? dateBlock(release.date, colour) : `<span class="tag">TBD</span>`}
          ${platformPills(release.platforms)}
        </div>
        <h3 class="display glitch row-title" style="margin-top:14px">${esc(release.title)}${release.ours ? " <span class='acc'>★</span>" : ""}</h3>
        <div class="eyebrow" style="margin-top:8px;font-size:10px">${esc(release.genre)}${release._example ? " · example" : ""}</div>
        <div style="margin-top:14px">${launcherList(release.launcher)}</div>
      </article>
    `;
  }

  function vsCell(release, side) {
    const textAlign = side === "L" ? "left" : "right";
    return `
      <article style="padding:22px 26px;background:${release.ours ? "color-mix(in oklab, var(--brand) 14%, transparent)" : "transparent"};text-align:${textAlign}">
        <div class="eyebrow">${release.date ? `${fmtDate(release.date).dow} ${fmtDate(release.date).day} ${fmtDate(release.date).month}` : "Date pending"}</div>
        <h3 class="display glitch" style="font-size:36px;line-height:.95;margin:6px 0 0">${esc(release.title)}${release.ours ? " <span class='acc'>★</span>" : ""}</h3>
        <div style="margin-top:12px;display:flex;gap:10px;align-items:center;justify-content:${side === "L" ? "flex-start" : "flex-end"};flex-wrap:wrap">
          ${platformPills(release.platforms)}
          ${launcherList(release.launcher)}
        </div>
      </article>
    `;
  }

  function rosterCard(game, index) {
    const flagship = game.stage === "Flagship";
    return `
      <article class="roster-card card ${flagship ? "card--ours" : ""}" style="display:flex;flex-direction:column;border:${flagship ? "2px solid var(--brand)" : "none"}">
        ${gameArt(game.art, "", 170, platformColour(game.platforms[0]))}
        <div style="display:flex;flex-direction:column;gap:8px;flex:1;padding-top:16px">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px">
            <span class="eyebrow" style="font-size:10px">No. ${String(index).padStart(2, "0")} · ${esc(game.stage)}</span>
            ${platformPills(game.platforms)}
          </div>
          <h3 class="display glitch" style="font-size:28px;line-height:.95;margin:0">${esc(game.title)}</h3>
          <div class="eyebrow" style="font-size:10px;color:var(--brand)">${esc(game.cat)}</div>
          <p class="copy" style="margin:4px 0 0;font-size:13px">${esc(game.tagline)}.</p>
          <div style="margin-top:auto;padding-top:14px;display:flex;gap:10px;flex-wrap:wrap">
            ${game.play ? `<a class="btn btn--brand btn--small" href="${esc(game.play)}" target="_blank" rel="noreferrer">Play demo <span class="arrow">-></span></a>` : `<span class="tag">${esc(game.status)}</span>`}
            ${game.repo ? `<a class="btn btn--ghost btn--small" href="${esc(game.repo)}" target="_blank" rel="noreferrer">Repo <span class="arrow">-></span></a>` : ""}
          </div>
        </div>
      </article>
    `;
  }

  function renderReleases(data, alias = false) {
    const grouped = groupByMonth(data.releases);
    return pageFrame("releases", `
      <section class="hero shell">
        <div class="eyebrow"><span class="acc">// 01</span> Release radar · Windows PC · Xbox · PlayStation</div>
        <h1 class="display hero-title">The card,<br><span class="acc">ninety days</span> out.</h1>
        <p class="hero-lede">Every tracked release on the three platforms we cover. Filter by platform to scan one slate at a time. Brand-red rows are E-lusion Studios drops or provisional studio slots.</p>
        ${alias ? `<div class="notice"><span class="acc">Route note</span><span><code>calendar.html</code> is kept as a public-safe alias. The arcade design's canonical release surface is <a href="releases.html">releases.html</a>.</span></div>` : ""}
        ${data.meta.usingProvisionalReleases ? `<div class="notice"><span class="acc">◇ PROVISIONAL</span><span>The public release manifest is currently seeded and has no future dated release rows. The visible dated slate uses handoff examples until the release tracker is refreshed.</span></div>` : ""}
        <div class="filter-row" style="margin-top:26px">
          ${filterButton("all", "All", "var(--ink)", true)}
          ${filterButton("pc", "PC", "var(--pc)")}
          ${filterButton("xbox", "Xbox", "var(--xbox)")}
          ${filterButton("ps", "PS5", "var(--ps)")}
          ${filterButton("ours", "Ours", "var(--brand)")}
          <div class="segmented" style="margin-left:auto">
            <button type="button" data-release-view="list" class="is-active">List</button>
            <button type="button" data-release-view="grid">Grid</button>
          </div>
        </div>
      </section>

      <section class="shell" style="margin-top:36px" data-release-section>
        <div data-release-list>
          ${Object.entries(grouped).map(([month, items], monthIndex) => `
            <section style="margin-bottom:36px" data-release-month>
              <div style="display:flex;align-items:baseline;justify-content:space-between;gap:18px;border-bottom:2px solid var(--ink);padding-bottom:12px;margin-bottom:16px;flex-wrap:wrap">
                <div style="display:flex;align-items:baseline;gap:18px">
                  <span class="eyebrow" style="color:var(--brand)">// ${String(monthIndex + 1).padStart(2, "0")}</span>
                  <h2 class="display" style="font-size:clamp(2rem,4vw,2.8rem);margin:0">${esc(month)}</h2>
                </div>
                <span class="tag">${items.length} drops</span>
              </div>
              <div class="row-grid" data-view-list>${items.map((release, i) => releaseRow(release, i + 1)).join("")}</div>
              <div class="grid-view is-hidden" data-view-grid>${items.map(releaseCard).join("")}</div>
            </section>
          `).join("")}
          <div class="notice is-hidden" data-release-empty><span class="acc">No rows</span><span>Nothing matches this platform filter. Try All, or check the undated watchlist below.</span></div>
        </div>
      </section>

      <section class="shell" style="margin-top:40px">
        ${sectionHead("//", "Undated watchlist", `<span class="tag">${data.undated.length} tracked</span>`)}
        <div class="row-grid">
          ${data.undated.slice(0, 8).map((release, i) => releaseRow({ ...release, date: "" }, i + 1)).join("")}
        </div>
      </section>

      <section class="shell" style="margin-top:40px">
        ${sectionHead("//", "Platform legend")}
        <div class="cols-4">
          ${Object.values(PLATFORMS).map((p) => `<article style="padding:22px"><div style="width:36px;height:36px;background:${p.css};margin-bottom:14px"></div><h3 class="display" style="font-size:22px;line-height:1;color:${p.css};margin:0">${esc(p.long)}</h3><p class="eyebrow" style="font-size:10px;margin-top:10px">${legendCopy(p.id)}</p></article>`).join("")}
        </div>
      </section>
    `);
  }

  function filterButton(id, label, colour, active = false) {
    return `<button type="button" class="filter-button" style="--filter:${colour}" data-release-filter="${id}" aria-pressed="${active ? "true" : "false"}">${active ? "● " : ""}${esc(label)}</button>`;
  }

  function legendCopy(id) {
    return {
      pc: "Steam · GOG · Epic · Xbox app · EA",
      xbox: "Series X · Series S · Game Pass",
      ps: "PS5 · PS Plus · PS Store",
      browser: "Itch · GitHub Pages · Web demos",
    }[id] || "Tracked";
  }

  function groupByMonth(releases) {
    return releases.reduce((acc, release) => {
      const key = release.date ? monthKey(release.date) : "Date pending";
      acc[key] = acc[key] || [];
      acc[key].push(release);
      return acc;
    }, {});
  }

  function renderEvents(data) {
    const future = data.events.filter((event) => new Date(event.startAtUTC).getTime() >= NOW() - DAY);
    const next = future[0] || data.events[0];
    const sgf = data.events.filter((event) => event.date >= "2026-06-03" && event.date <= "2026-06-09");
    const july = data.events.filter((event) => event.date >= "2026-07-01" && event.date <= "2026-07-31");
    const late = data.events.filter((event) => event.date >= "2026-08-01" && event.date <= "2026-09-30");
    const winter = data.events.filter((event) => event.date >= "2026-10-01");

    return pageFrame("events", `
      <section class="hero shell">
        <div class="eyebrow"><span class="acc">// 02</span> Events watch desk · 2026</div>
        <h1 class="display hero-title">Showcases,<br>conferences,<br><span class="acc">awards.</span></h1>
        ${next ? `
          <article class="card" style="margin-top:32px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;padding:0">
            <div style="padding:26px 28px;background:var(--brand);color:#0a0a0c;display:flex;flex-direction:column;align-items:center;min-width:140px">
              <span class="bignum" style="font-size:48px">${fmtDate(next.date).day}</span>
              <span style="font-family:var(--mono);font-weight:800;font-size:12px;letter-spacing:.22em;margin-top:6px">${fmtDate(next.date).month}</span>
            </div>
            <div class="cell">
              <div class="eyebrow"><span class="acc">●</span> Next event · T-minus</div>
              <h2 class="display glitch" style="font-size:38px;margin:6px 0 0">${esc(next.title)}</h2>
              <div style="display:flex;gap:16px;align-items:center;margin-top:10px;flex-wrap:wrap">
                <span class="countdown countdown--compact bignum" data-countdown="${esc(next.startAtUTC)}" data-countdown-style="compact"></span>
                ${platformPills(next.platforms)}
              </div>
            </div>
            <div class="cell"><a class="btn btn--brand" href="${esc(next.watch)}" target="_blank" rel="noreferrer">${esc(next.watchLabel)} <span class="arrow">-></span></a></div>
          </article>` : ""}
      </section>
      ${eventSection("03", "Summer Game Fest · 03-09 Jun", sgf, "grid")}
      ${eventSection("04", "July · Develop season", july, "rows")}
      ${eventSection("05", "Gamescom · Cologne", late, "grid2")}
      ${eventSection("06", "Awards season", winter, "rows")}
    `);
  }

  function eventSection(no, title, events, mode) {
    if (!events.length) return "";
    return `
      <section class="shell" style="margin-top:56px">
        ${sectionHead(`// ${no}`, title, `<span class="tag">${events.length} events</span>`)}
        ${mode === "rows" ? `<div class="row-grid">${events.map(eventRow).join("")}</div>` : `<div class="${mode === "grid2" ? "cols-2" : "cols-3"} rise-stagger">${events.map(eventCard).join("")}</div>`}
      </section>
    `;
  }

  function eventCard(event) {
    const colour = platformColour(event.platforms[0] || "pc");
    const isLive = isEventLive(event);
    return `
      <article class="event-card" style="--platform:${colour};background:${isLive ? "color-mix(in oklab, var(--brand) 14%, transparent)" : "transparent"}">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:8px">
          <div style="display:flex;align-items:baseline;gap:12px"><span class="bignum" style="font-size:44px;color:${colour}">${fmtDate(event.date).day}</span><span class="eyebrow">${fmtDate(event.date).month}</span></div>
          <span class="tag ${isLive ? "live" : ""}">${isLive ? "LIVE" : esc(event.kind)}</span>
        </div>
        <h3 class="display glitch" style="font-size:30px;line-height:.95;margin:14px 0 0">${esc(event.title)}</h3>
        <div class="eyebrow" style="margin-top:8px">${esc(event.where)}</div>
        <p class="copy" style="margin:12px 0 0;font-size:13px;flex:1">${esc(event.note)}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;gap:12px;flex-wrap:wrap">
          ${platformPills(event.platforms)}
          <a class="btn btn--ghost btn--small" href="${esc(event.watch)}" target="_blank" rel="noreferrer">${esc(event.watchLabel)} <span class="arrow">-></span></a>
        </div>
      </article>
    `;
  }

  function eventRow(event) {
    const colour = platformColour(event.platforms[0] || "pc");
    const past = new Date(event.startAtUTC).getTime() < NOW() - DAY;
    return `
      <article class="event-row" style="--platform:${colour}">
        <div class="stripe-cell" style="background:${colour}"></div>
        <div class="cell" style="align-items:center;text-align:center"><span class="bignum" style="font-size:26px">${fmtDate(event.date).day}</span><span class="eyebrow" style="font-size:9px;color:${colour}">${fmtDate(event.date).month}</span></div>
        <div class="cell"><h3 class="display glitch row-title">${esc(event.title)}</h3><span class="eyebrow" style="margin-top:6px;font-size:9px">${esc(event.kind)} · ${esc(event.where)}</span></div>
        <div class="cell">${past ? `<span class="tag">Concluded</span>` : `<span class="countdown countdown--compact bignum" data-countdown="${esc(event.startAtUTC)}" data-countdown-style="compact"></span>`}</div>
        <div class="cell">${platformPills(event.platforms)}</div>
        <div class="cell"><a class="btn btn--ghost btn--small" href="${esc(event.watch)}" target="_blank" rel="noreferrer">Watch <span class="arrow">-></span></a></div>
      </article>
    `;
  }

  function isEventLive(event) {
    const start = new Date(event.startAtUTC).getTime();
    return start <= NOW() && start > NOW() - 30 * 60 * 1000;
  }

  function renderNews(data, forcedRail = null) {
    const visibleRails = forcedRail ? RAILS.filter((rail) => rail.id === forcedRail) : RAILS;
    return pageFrame("news", `
      <section class="hero shell">
        <div class="eyebrow"><span class="acc">// 03</span> Curated wire · public rails</div>
        <h1 class="display hero-title">Four feeds,<br><span class="acc">one watch desk.</span></h1>
        <p class="hero-lede">Game-dev craft, platform and industry stories, scored reviews, and unscored previews. The public pipeline is still being populated, so examples stay labelled.</p>
        <div class="tabs-row" style="margin-top:28px">
          <button class="tab-button" style="--filter:var(--ink)" data-rail-tab="all" aria-pressed="${forcedRail ? "false" : "true"}">All rails</button>
          ${RAILS.map((rail) => `<button class="tab-button" style="--filter:${rail.colour}" data-rail-tab="${rail.id}" aria-pressed="${forcedRail === rail.id ? "true" : "false"}">${esc(rail.title)}</button>`).join("")}
        </div>
        ${data.meta.usingProvisionalNews ? `<div class="notice"><span class="acc">◇ PROVISIONAL</span><span>Items shown are examples in the brand voice. The public news pipeline has not yet populated all four rails.</span></div>` : ""}
      </section>
      <div data-rail-sections>
        ${visibleRails.map((rail, idx) => railBlock(rail, data.news.filter((item) => item.feed === rail.id), idx + 1)).join("")}
      </div>
    `);
  }

  function railBlock(rail, items, no) {
    return `
      <section class="shell" style="margin-top:50px" data-rail-section="${rail.id}">
        <div class="rail-header" style="--rail:${rail.colour}">
          <div class="rail-header__top"><span class="rail-swatch"></span><span class="eyebrow">// ${String(no).padStart(2, "0")} · ${esc(rail.title)} wire · ${items.length} items</span></div>
          <h2 class="display rail-title">${esc(rail.title)}</h2>
          <p class="copy" style="margin:10px 0 0;max-width:720px;font-size:14px">${esc(rail.desc)}</p>
        </div>
        <div class="row-grid">
          ${items.map((item) => newsRow(item, rail.colour)).join("") || `<div style="padding:28px 22px" class="eyebrow">No public items in this rail yet.</div>`}
        </div>
        <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap">
          <span class="eyebrow">Sources · ${esc(rail.sources.join(" · "))}</span>
          <a class="btn btn--ghost btn--small" href="${esc(rail.route)}">Full ${esc(rail.title)} archive <span class="arrow">-></span></a>
        </div>
      </section>
    `;
  }

  function newsRow(item, colour) {
    return `
      <article class="news-row" style="--rail:${colour}">
        <div class="stripe-cell" style="background:${colour}"></div>
        <div class="cell"><span class="eyebrow" style="color:${colour}">${esc(item.h)}</span><span class="eyebrow" style="font-size:9px">${esc(item.tag)}</span></div>
        <div class="cell"><h3 class="display glitch row-title" style="font-size:24px">${esc(item.t)}</h3><div class="eyebrow" style="margin-top:8px;font-size:10px">${esc(item.src)}${item.score ? ` · <span class="acc">${scoreOutOfTen(item.score)}/10</span>` : ""}${item._example ? " · example" : ""}</div></div>
        <div class="cell">${item.platforms?.length ? platformPills(item.platforms) : "<span class='eyebrow'>Multi-platform</span>"}</div>
        <div class="row-arrow" style="color:${colour}">-></div>
      </article>
    `;
  }

  function renderReviews(data) {
    const reviews = data.news.filter((item) => item.feed === "review");
    const previews = data.news.filter((item) => item.feed === "preview");
    const featured = [...reviews].sort((a, b) => scoreOutOfTen(b.score || 0) - scoreOutOfTen(a.score || 0))[0];
    const heroArtSrc = data.games.find((game) => game.id === "starfall-protocol")?.art || data.games[0]?.art;
    return pageFrame("reviews", `
      <section class="hero shell">
        <div class="eyebrow"><span class="acc">// 04</span> Critical coverage · curated, not house-review led</div>
        <h1 class="display hero-title">Verdicts<br><span class="acc">worth your time.</span></h1>
        <p class="hero-lede">Reviews and previews from the wider games press. GameTrackDaily curates the coverage and explains the scoring language; it does not pretend to be the critic.</p>
        ${data.meta.usingProvisionalNews ? `<div class="notice"><span class="acc">◇ PROVISIONAL</span><span>Review rows are example coverage until the public news pipeline publishes real scored items.</span></div>` : ""}
      </section>
      ${featured ? `
        <section class="shell" style="margin-top:36px">
          <article style="display:grid;grid-template-columns:1.1fr 1fr;border:2px solid var(--ink)">
            <div style="position:relative;overflow:hidden">
              ${gameArt(heroArtSrc, "", 460)}
              <div style="position:absolute;top:22px;left:22px;z-index:3"><span class="tag brand">Featured verdict</span></div>
              <div style="position:absolute;bottom:22px;right:22px;z-index:3;transform:rotate(-6deg)">${scoreStamp(featured.score, 120)}</div>
            </div>
            <div class="cell">
              <span class="eyebrow">${esc(featured.src)} · ${esc(featured.h)}</span>
              <h2 class="display glitch" style="font-size:clamp(2rem,4vw,3rem);line-height:.96;margin:12px 0 0">${esc(featured.t)}</h2>
              <p class="copy" style="margin:20px 0 0;border-left:3px solid var(--brand);padding-left:14px">Curated coverage only. Pull-quotes are omitted until a source article can be linked directly.</p>
              <div style="display:flex;gap:10px;align-items:center;margin-top:22px;flex-wrap:wrap">${platformPills(featured.platforms)}<span class="tag dashed">Source link pending</span></div>
            </div>
          </article>
        </section>` : ""}
      <section class="shell" style="margin-top:50px">
        ${sectionHead("// 05", "More reviews", `<span class="tag">${reviews.length} verdicts</span>`)}
        <div class="cols-3 rise-stagger">${reviews.filter((r) => r !== featured).map(reviewCard).join("")}</div>
      </section>
      <section class="shell" style="margin-top:50px">
        ${sectionHead("// 06", "Previews & first-looks", `<span class="tag">${previews.length} unscored</span>`)}
        <div class="row-grid">${previews.map(previewRow).join("")}</div>
      </section>
      <section class="shell" style="margin-top:64px">
        ${sectionHead("// 07", "How we read scores", `<span class="tag">Review literacy · ${data.literacy.length} guides</span>`)}
        <div class="cols-2 rise-stagger" style="margin-bottom:-2px">${data.literacy.slice(0, 2).map((item, i) => literacyCard(item, i + 1)).join("")}</div>
        <div class="cols-3">${data.literacy.slice(2, 5).map((item, i) => literacyCard(item, i + 3, true)).join("")}</div>
      </section>
    `);
  }

  function scoreOutOfTen(score) {
    const n = Number(score || 0);
    if (!n) return "";
    return n > 10 ? Math.round(n / 10) : n;
  }

  function scoreStamp(score, size = 60) {
    return `<div class="score-stamp" style="--stamp-size:${size}px"><span class="bignum score-stamp__score">${esc(scoreOutOfTen(score))}</span><span class="score-stamp__suffix">/10</span></div>`;
  }

  function reviewCard(item) {
    return `
      <article class="review-card" style="--platform:var(--xbox)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:10px;gap:16px">
          <span class="eyebrow" style="color:var(--xbox)">${esc(item.src)} · ${esc(item.h)}</span>
          ${item.score ? scoreStamp(item.score, 50) : ""}
        </div>
        <h3 class="display glitch row-title" style="font-size:22px;margin-top:14px">${esc(item.t)}</h3>
        <div style="margin-top:22px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">${platformPills(item.platforms)}<span class="eyebrow" style="color:var(--xbox)">Read -></span></div>
      </article>
    `;
  }

  function previewRow(item) {
    return `
      <article class="preview-row">
        <div class="stripe-cell" style="background:var(--ps)"></div>
        <div class="cell"><span class="eyebrow" style="color:var(--ps)">Preview · unscored</span><h3 class="display glitch row-title">${esc(item.t)}</h3></div>
        <div class="cell"><span class="eyebrow">${esc(item.src)} · ${esc(item.h)}</span></div>
        <div class="cell">${platformPills(item.platforms)}</div>
        <div class="row-arrow" style="color:var(--ps)">-></div>
      </article>
    `;
  }

  function literacyCard(item, no, compact = false) {
    return `
      <article class="literacy-card">
        <span class="bignum" style="font-size:${compact ? 36 : 52}px;color:var(--brand)">${String(no).padStart(2, "0")}</span>
        <h3 class="display" style="font-size:${compact ? 22 : 28}px;line-height:.95;margin:12px 0 0">${esc(item.title)}</h3>
        <p class="copy" style="margin:10px 0 0;font-size:13px">${esc(item.summary)}</p>
        ${item.path ? `<a class="eyebrow" style="margin-top:auto;color:var(--brand);display:inline-block" href="${esc(item.path)}">Read the guide -></a>` : ""}
      </article>
    `;
  }

  function renderGames(data) {
    return pageFrame("home", `
      <section class="hero shell">
        <div class="eyebrow"><span class="acc">// Lineup</span> E-lusion Studios</div>
        <h1 class="display hero-title">Seven games,<br><span class="acc">one slate.</span></h1>
        <p class="hero-lede">A public-safe roster of browser demos, desktop builds, and proof slices. The cards link out to playable demos and repositories where those are already public.</p>
      </section>
      <section class="shell" style="margin-top:36px">
        ${sectionHead("ROSTER", "Browse the slate", `<span class="tag">${data.games.length} projects</span>`)}
        <div class="cols-4 rise-stagger">${data.games.slice(0, 4).map((game, i) => rosterCard(game, i + 1)).join("")}</div>
        <div class="cols-3 rise-stagger" style="margin-top:-2px">${data.games.slice(4).map((game, i) => rosterCard(game, i + 5)).join("")}</div>
      </section>
    `);
  }

  function renderDevelopment(data) {
    return pageFrame("home", `
      <section class="hero shell">
        <div class="eyebrow"><span class="acc">// Craft</span> Public-safe game development reference</div>
        <h1 class="display hero-title">Build notes,<br><span class="acc">not ops.</span></h1>
        <p class="hero-lede">A public reference layer for engines, distribution, playtesting, marketing, scope, UI, and store readiness. Private launch controls stay out of this repo.</p>
      </section>
      <section class="shell" style="margin-top:36px">
        ${sectionHead("//", "Craft library", `<span class="tag">Public markdown</span>`)}
        <div class="cols-3">
          ${["engines", "qa-playtesting-and-performance", "launch-and-store-readiness", "marketing", "production-and-scope", "ui-ux-and-onboarding"].map((slug, i) => `
            <article class="literacy-card"><span class="bignum" style="font-size:38px;color:var(--brand)">${String(i + 1).padStart(2, "0")}</span><h2 class="display" style="font-size:24px;margin:12px 0 0">${esc(slug.replaceAll("-", " "))}</h2><a class="eyebrow" style="color:var(--brand);margin-top:16px;display:inline-block" href="shared/game-development/${slug}.md">Open note -></a></article>
          `).join("")}
        </div>
      </section>
    `);
  }

  function injectJsonLd(page, data) {
    const graph = [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}#organization`,
        name: "GameTrackDaily",
        url: BASE_URL,
        parentOrganization: { name: "E-lusion Studios" },
        founder: { "@id": "https://koltregaskes.com/#person-kol" },
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}#website`,
        name: "GameTrackDaily",
        url: BASE_URL,
        publisher: { "@id": `${BASE_URL}#organization` },
      },
    ];

    if (page === "home" || page === "games") {
      graph.push({
        "@type": "ItemList",
        "@id": `${BASE_URL}#studio-slate`,
        name: "E-lusion Studios game slate",
        itemListElement: data.games.map((game, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "VideoGame",
            "@id": `${BASE_URL}#game-${game.id}`,
            name: game.title,
            description: game.summary || game.tagline,
            gamePlatform: game.platforms.map((id) => PLATFORMS[id]?.schema || id),
            url: game.play || game.repo || BASE_URL,
            creator: { "@id": `${BASE_URL}#organization` },
          },
        })),
      });
    }

    if (page === "releases" || page === "calendar") {
      graph.push({
        "@type": "ItemList",
        "@id": `${BASE_URL}releases.html#release-slate`,
        name: "Tracked release slate",
        itemListElement: data.releases.slice(0, 20).map((release, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": release.ours ? "VideoGame" : "CreativeWork",
            name: release.title,
            datePublished: release._example ? undefined : release.date,
            description: `${release.genre}. ${release._example ? "Example row from the design handoff; not a verified release claim." : "Tracked public release row."}`,
          },
        })),
      });
    }

    if (page === "news" || page === "reviews") {
      graph.push({
        "@type": "ItemList",
        "@id": `${BASE_URL}${page}.html#coverage`,
        name: "Curated games coverage",
        itemListElement: data.news.slice(0, 12).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": item.feed === "review" ? "Review" : "NewsArticle",
            headline: item.t,
            publisher: { name: item.src },
            description: item._example ? "Example item used while the public feed pipeline is empty." : item.t,
          },
        })),
      });
    }

    let script = $("#structured-data-runtime");
    if (!script) {
      script = document.createElement("script");
      script.id = "structured-data-runtime";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
  }

  function wireReleaseControls() {
    let active = "all";
    let view = "list";
    const update = () => {
      $$("[data-release-filter]").forEach((button) => {
        const isActive = button.dataset.releaseFilter === active;
        button.setAttribute("aria-pressed", String(isActive));
        button.textContent = `${isActive ? "● " : ""}${button.textContent.replace(/^●\s*/, "")}`;
      });
      $$("[data-release-card]").forEach((card) => {
        const platforms = (card.dataset.platforms || "").split(/\s+/);
        const isOurs = card.dataset.ours === "true";
        const show = active === "all" || (active === "ours" ? isOurs : platforms.includes(active));
        card.classList.toggle("is-hidden", !show);
      });
      $$("[data-release-month]").forEach((month) => {
        month.classList.toggle("is-hidden", $$("[data-release-card]:not(.is-hidden)", month).length === 0);
      });
      const visible = $$("[data-release-card]:not(.is-hidden)").length;
      const empty = $("[data-release-empty]");
      if (empty) empty.classList.toggle("is-hidden", visible !== 0);
      $$("[data-view-list]").forEach((el) => el.classList.toggle("is-hidden", view !== "list"));
      $$("[data-view-grid]").forEach((el) => el.classList.toggle("is-hidden", view !== "grid"));
      $$("[data-release-view]").forEach((button) => button.classList.toggle("is-active", button.dataset.releaseView === view));
    };
    $$("[data-release-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        active = button.dataset.releaseFilter;
        update();
      });
    });
    $$("[data-release-view]").forEach((button) => {
      button.addEventListener("click", () => {
        view = button.dataset.releaseView;
        update();
      });
    });
    update();
  }

  function wireNewsTabs() {
    const sectionsWrap = $("[data-rail-sections]");
    if (!sectionsWrap) return;
    const allMarkup = sectionsWrap.innerHTML;
    $$("[data-rail-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const rail = button.dataset.railTab;
        $$("[data-rail-tab]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        sectionsWrap.innerHTML = allMarkup;
        if (rail !== "all") {
          $$("[data-rail-section]", sectionsWrap).forEach((section) => {
            section.classList.toggle("is-hidden", section.dataset.railSection !== rail);
          });
        }
      });
    });
  }

  function wireScanlines() {
    const button = $("[data-scanline-toggle]");
    if (!button) return;
    const set = (enabled) => {
      document.body.classList.toggle("scanlines", enabled);
      button.setAttribute("aria-pressed", String(enabled));
      button.textContent = enabled ? "CRT on" : "CRT off";
      localStorage.setItem("gtd-scanlines", enabled ? "1" : "0");
    };
    set(localStorage.getItem("gtd-scanlines") === "1");
    button.addEventListener("click", () => set(!document.body.classList.contains("scanlines")));
  }

  function updateClock() {
    const el = $("[data-clock]");
    if (!el) return;
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date());
    el.textContent = `Local · ${parts}`;
  }

  function updateCountdowns() {
    $$("[data-countdown]").forEach((el) => {
      const target = new Date(el.dataset.countdown).getTime();
      const ms = target - NOW();
      if (!Number.isFinite(target)) {
        el.textContent = "Time pending";
        return;
      }
      if (ms <= 0) {
        el.textContent = "LIVE NOW";
        el.style.color = "var(--brand)";
        return;
      }
      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n) => String(n).padStart(2, "0");
      if (el.dataset.countdownStyle === "compact") {
        el.textContent = `T-${pad(days)}d ${pad(hours)}h ${pad(minutes)}m`;
      } else {
        el.innerHTML = `
          <span class="bignum countdown__num">${pad(days)}</span><span class="bignum countdown__unit">d</span>
          <span class="bignum countdown__num">${pad(hours)}</span><span class="bignum countdown__unit">h</span>
          <span class="bignum countdown__num">${pad(minutes)}</span><span class="bignum countdown__unit">m</span>
          <span class="bignum countdown__sec">${pad(seconds)}</span><span class="bignum countdown__unit" style="color:var(--ink-3)">s</span>
        `;
      }
    });
  }

  function bootTimers() {
    updateClock();
    updateCountdowns();
    clearInterval(state.countdownTimer);
    state.countdownTimer = setInterval(() => {
      updateClock();
      updateCountdowns();
    }, 1000);
    document.addEventListener("visibilitychange", () => {
      document.documentElement.classList.toggle("is-tab-hidden", document.hidden);
    });
  }

  function render(page, data) {
    const frame = $("#site-frame");
    if (!frame) return;
    const rail = document.body.dataset.rail;
    const html = {
      home: () => renderHome(data),
      releases: () => renderReleases(data),
      calendar: () => renderReleases(data, true),
      events: () => renderEvents(data),
      news: () => renderNews(data),
      reviews: () => renderReviews(data),
      games: () => renderGames(data),
      development: () => renderDevelopment(data),
      rail: () => renderNews(data, rail || "dev"),
    }[page]?.() || renderHome(data);
    frame.innerHTML = html;
    injectJsonLd(page, data);
    wireReleaseControls();
    wireNewsTabs();
    wireScanlines();
    bootTimers();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const page = document.body.dataset.page || "home";
    const frame = $("#site-frame");
    if (frame) frame.innerHTML = `<div class="shell" style="padding:40px 0"><span class="eyebrow">Loading GameTrackDaily arcade desk...</span></div>`;
    const data = await loadData();
    state.data = data;
    render(page, data);
  });
})();

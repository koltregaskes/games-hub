document.body.classList.add("has-motion");

const page = document.body.dataset.page || "home";
const pageSection = document.body.dataset.section || page;
const pageFeed = document.body.dataset.feed || null;
const siteNav = document.getElementById("siteNav");

let revealObserver = null;

function observeRevealItems() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );
  }

  revealItems.forEach((item, index) => {
    if (item.dataset.revealObserved === "true") {
      return;
    }
    item.dataset.revealObserved = "true";
    item.style.transitionDelay = `${Math.min(index * 40, 180)}ms`;
    revealObserver.observe(item);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const html = [];
  let paragraph = [];
  let bulletList = [];
  let orderedList = [];
  let codeLines = [];
  let inCode = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushBullets = () => {
    if (!bulletList.length) return;
    html.push(`<ul>${bulletList.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
    bulletList = [];
  };

  const flushOrdered = () => {
    if (!orderedList.length) return;
    html.push(`<ol>${orderedList.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
    orderedList = [];
  };

  const flushCode = () => {
    if (!codeLines.length) return;
    html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      flushParagraph();
      flushBullets();
      flushOrdered();
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushBullets();
      flushOrdered();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      flushBullets();
      flushOrdered();
      const level = Math.min(heading[1].length + 1, 4);
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.*)$/);
    if (ordered) {
      flushParagraph();
      flushBullets();
      orderedList.push(ordered[1]);
      continue;
    }

    const bullet = line.match(/^-+\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      flushOrdered();
      bulletList.push(bullet[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushBullets();
  flushOrdered();
  flushCode();

  return html.join("");
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${url}.`);
  }
  return response.json();
}

async function fetchMarkdown(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${url}.`);
  }
  return response.text();
}

function renderPillRow(labels = [], pillClass = "source-pill") {
  if (!labels.length) {
    return "";
  }

  return `
    <div class="source-pill-row">
      ${labels.map((label) => `<span class="${pillClass}">${escapeHtml(label)}</span>`).join("")}
    </div>
  `;
}

function createReferenceList(references = []) {
  if (!references.length) {
    return "";
  }

  return `
    <section class="docs-extras">
      <div class="docs-extras__section">
        <p class="feature__kicker">References</p>
        <ul class="docs-link-list">
          ${references
            .map(
              (reference) =>
                `<li><a href="${reference.url}" target="_blank" rel="noreferrer">${escapeHtml(reference.label)}</a></li>`,
            )
            .join("")}
        </ul>
      </div>
    </section>
  `;
}

function createPromptSection(cards = []) {
  if (!cards.length) {
    return "";
  }

  return `
    <section class="docs-extras">
      <div class="docs-extras__section">
        <p class="feature__kicker">Prompt Cards</p>
        <div class="prompt-card-grid">
          ${cards
            .map(
              (card) => `
                <article class="prompt-card">
                  <p class="feature__kicker">Agent Prompt</p>
                  <h3>${escapeHtml(card.title)}</h3>
                  <p>${escapeHtml(card.body)}</p>
                  <pre><code>${escapeHtml(card.prompt)}</code></pre>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function createSummaryChip(label, value, tone = "is-grey") {
  return `
    <article class="summary-chip">
      <span class="summary-chip__label">${escapeHtml(label)}</span>
      <strong class="summary-chip__value ${tone}">${escapeHtml(String(value))}</strong>
    </article>
  `;
}

function createLinkButton(label, href, className = "button button--ghost") {
  return `<a class="${className}" href="${href}">${escapeHtml(label)}</a>`;
}

function parseDateKey(value) {
  const [year, month, day] = String(value || "")
    .split("-")
    .map((item) => Number.parseInt(item, 10));
  if (!year || !month || !day) {
    return null;
  }
  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return startOfDay(next);
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthKey(date) {
  return dateKey(new Date(date.getFullYear(), date.getMonth(), 1)).slice(0, 7);
}

function startOfWeek(date) {
  const normalized = startOfDay(date);
  const dayIndex = (normalized.getDay() + 6) % 7;
  return addDays(normalized, -dayIndex);
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat([], {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatWeekLabel(startDate) {
  const endDate = addDays(startDate, 6);
  const formatter = new Intl.DateTimeFormat([], {
    month: "short",
    day: "numeric",
  });
  return `${formatter.format(startDate)} - ${formatter.format(endDate)}, ${endDate.getFullYear()}`;
}

function formatEventTime(item) {
  if (!item.startAt) {
    return "Time TBA";
  }

  const start = new Date(item.startAt);
  const end = item.endAt ? new Date(item.endAt) : null;
  const formatter = new Intl.DateTimeFormat([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  if (!end) {
    return formatter.format(start);
  }

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function groupedPlatformCounts(items = []) {
  const counts = new Map();
  items.forEach((item) => {
    (item.platforms || []).forEach((platform) => {
      counts.set(platform, (counts.get(platform) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((left, right) => {
      if (right[1] === left[1]) {
        return left[0].localeCompare(right[0]);
      }
      return right[1] - left[1];
    })
    .map(([platform, count]) => ({ platform, count }));
}

function getPlatformFamily(tag = "") {
  const lower = tag.toLowerCase();
  if (lower.includes("xbox")) return "xbox";
  if (lower.includes("playstation") || lower.includes("ps ")) return "playstation";
  if (lower.includes("windows") || lower.includes("pc") || lower.includes("steam") || lower.includes("gog")) return "windows";
  return "other";
}

function matchesPlatformFamily(tags = [], family = "all") {
  if (family === "all") return true;
  return tags.some((tag) => getPlatformFamily(tag) === family);
}

function platformFamilyLabel(family) {
  if (family === "windows") return "Windows";
  if (family === "xbox") return "Xbox";
  if (family === "playstation") return "PlayStation";
  return "All";
}

function setSearchParam(name, value) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(name, value);
  } else {
    url.searchParams.delete(name);
  }
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

async function loadRegistry() {
  const data = await fetchJson("data/page-registry.json");
  return data.pages || [];
}

function registryEntryMap(entries) {
  return new Map(entries.map((entry) => [entry.id, entry]));
}

function buildSiteNav(entries) {
  if (!siteNav) {
    return;
  }

  const order = ["home", "games", "game-development", "news", "review-coverage", "calendar", "events"];
  const entryMap = registryEntryMap(entries);
  siteNav.innerHTML = order
    .map((id) => entryMap.get(id))
    .filter(Boolean)
    .map((entry) => {
      const active =
        pageSection === entry.id ||
        (entry.id === "news" && pageSection === "news") ||
        (entry.id === "review-coverage" && pageSection === "review-coverage");
      return `<a href="${entry.publicRoute}"${active ? ' aria-current="page"' : ""}>${escapeHtml(entry.title)}</a>`;
    })
    .join("");
}

function sectionLinksMarkup(entries) {
  const interesting = ["games", "game-development", "news", "review-coverage", "calendar", "events"];
  const entryMap = registryEntryMap(entries);
  return interesting
    .map((id) => entryMap.get(id))
    .filter(Boolean)
    .map(
      (entry) => `
        <article class="preview-card" data-reveal>
          <p class="feature__kicker">${escapeHtml(entry.pageType)}</p>
          <h3>${escapeHtml(entry.title)}</h3>
          <p>${escapeHtml(entry.primaryContentRegion.replaceAll("-", " "))}</p>
          <a class="button button--ghost" href="${entry.publicRoute}">Open page</a>
        </article>
      `,
    )
    .join("");
}

function gameCardMarkup(game) {
  const actions = [
    game.playUrl ? createLinkButton("Play demo", game.playUrl, "button button--primary") : "",
    game.repoUrl ? createLinkButton("View repo", game.repoUrl, "button button--ghost") : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <article class="emerging-card" data-reveal>
      <img src="${game.art}" alt="${escapeHtml(game.title)} artwork" />
      <div class="emerging-card__body">
        <p class="feature__kicker">${escapeHtml(game.category)}</p>
        <h3>${escapeHtml(game.title)}</h3>
        <p>${escapeHtml(game.summary)}</p>
        ${renderPillRow(game.platforms || [])}
        <ul class="feature__list">
          ${(game.highlights || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        <p><strong>Status:</strong> ${escapeHtml(game.publicStatus || game.status || "Tracked")}</p>
        <div class="feature__actions">${actions}</div>
      </div>
    </article>
  `;
}

function newsItemCard(item, fallbackSection) {
  return `
    <article class="news-card" data-reveal>
      <p class="feature__kicker">${escapeHtml(item.section || fallbackSection)}</p>
      <h3><a href="${item.url}" target="_blank" rel="noreferrer">${escapeHtml(item.headline)}</a></h3>
      <p>${escapeHtml(item.summary)}</p>
      ${(item.platforms || []).length || (item.tags || []).length
        ? `<div class="news-card__pills">
            ${renderPillRow(item.platforms || [])}
            ${renderPillRow(item.tags || [])}
          </div>`
        : ""}
      <div class="news-card__meta">
        <span>${escapeHtml(item.source || "Source")}</span>
        <span>${escapeHtml(item.publishedDate || "Date TBA")}</span>
      </div>
    </article>
  `;
}

function eventCardMarkup(item) {
  const links = (item.watchLinks || [])
    .filter((link) => link?.url)
    .map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label || "Watch")}</a>`)
    .join(" · ");
  const official = item.officialUrl
    ? `<a href="${item.officialUrl}" target="_blank" rel="noreferrer">Official page</a>`
    : "";

  return `
    <article class="news-card" data-reveal>
      <p class="feature__kicker">${escapeHtml(item.kind || "Event")}</p>
      <h3>${official ? `<a href="${item.officialUrl}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}</h3>
      <p>${escapeHtml(formatEventTime(item))}</p>
      <p>${escapeHtml(item.notes || item.summary || "Major games-industry event.")}</p>
      ${renderPillRow(item.platformFocus || [])}
      <div class="news-card__meta">
        <span>${escapeHtml([item.venue, item.city].filter(Boolean).join(", ") || "Watch online")}</span>
        <span>${links || official || escapeHtml(item.watchStatus || "Watch links pending")}</span>
      </div>
    </article>
  `;
}

async function renderHome(registry) {
  const featuredGamesGrid = document.getElementById("featuredGamesGrid");
  const homeSectionLinks = document.getElementById("homeSectionLinks");
  const homeHighlightsGrid = document.getElementById("homeHighlightsGrid");
  if (!featuredGamesGrid || !homeSectionLinks || !homeHighlightsGrid) {
    return;
  }

  const [gamesManifest, newsManifest, calendarManifest, knowledgeManifest] = await Promise.all([
    fetchJson("data/games-manifest.json"),
    fetchJson("data/games-news.json"),
    fetchJson("data/release-calendar.json"),
    fetchJson("data/knowledge-manifest.json"),
  ]);

  const featured = (gamesManifest.games || []).filter((game) => (gamesManifest.featuredIds || []).includes(game.id));
  featuredGamesGrid.innerHTML = featured.map(gameCardMarkup).join("");
  homeSectionLinks.innerHTML = sectionLinksMarkup(registry);

  const upcomingEvent = (calendarManifest.events || [])
    .filter((item) => item.date)
    .sort((left, right) => String(left.date).localeCompare(String(right.date)))[0];

  const reviewFeed = (newsManifest.feeds || []).find((feed) => feed.id === "reviews");
  const previewFeed = (newsManifest.feeds || []).find((feed) => feed.id === "previews");

  homeHighlightsGrid.innerHTML = [
    `
      <article class="preview-card" data-reveal>
        <p class="feature__kicker">Game Development</p>
        <h3>${escapeHtml(knowledgeManifest.landing?.title || "Build games like a solo studio")}</h3>
        <p>${escapeHtml(knowledgeManifest.summary || "Public-safe craft guidance for builders and small teams.")}</p>
        <a class="button button--ghost" href="game-development.html">Open reference</a>
      </article>
    `,
    `
      <article class="preview-card" data-reveal>
        <p class="feature__kicker">Release Calendar</p>
        <h3>${escapeHtml(calendarManifest.defaultFocusMonth || "Tracked release slate")}</h3>
        <p>${(calendarManifest.releases || []).length} dated releases and ${(calendarManifest.undated || []).length} still-TBD games are tracked on the public calendar.</p>
        <a class="button button--ghost" href="calendar.html">Open calendar</a>
      </article>
    `,
    reviewFeed
      ? `
        <article class="preview-card" data-reveal>
          <p class="feature__kicker">Review Coverage</p>
          <h3>${escapeHtml(reviewFeed.title)}</h3>
          <p>${escapeHtml(reviewFeed.summary)}</p>
          <a class="button button--ghost" href="news-reviews.html">Open reviews</a>
        </article>
      `
      : "",
    previewFeed
      ? `
        <article class="preview-card" data-reveal>
          <p class="feature__kicker">Preview Coverage</p>
          <h3>${escapeHtml(previewFeed.title)}</h3>
          <p>${escapeHtml(previewFeed.summary)}</p>
          <a class="button button--ghost" href="news-previews.html">Open previews</a>
        </article>
      `
      : "",
    upcomingEvent
      ? `
        <article class="preview-card" data-reveal>
          <p class="feature__kicker">Next event</p>
          <h3>${escapeHtml(upcomingEvent.title)}</h3>
          <p>${escapeHtml(formatEventTime(upcomingEvent))}</p>
          <a class="button button--ghost" href="events.html">Open events</a>
        </article>
      `
      : "",
  ]
    .filter(Boolean)
    .join("");

  observeRevealItems();
}

async function renderGamesPage() {
  const summary = document.getElementById("gamesSummary");
  const filters = document.getElementById("gamesFilters");
  const catalog = document.getElementById("gamesCatalogGrid");
  const rail = document.getElementById("gamesRail");
  if (!summary || !filters || !catalog || !rail) {
    return;
  }

  const manifest = await fetchJson("data/games-manifest.json");
  const games = manifest.games || [];
  const allFilters = [
    { id: "all", label: "All" },
    ...(manifest.filters?.platforms || []).map((value) => ({ id: `platform:${value}`, label: value })),
    ...(manifest.filters?.stages || []).map((value) => ({ id: `stage:${value}`, label: value })),
  ];
  let activeFilter = new URL(window.location.href).searchParams.get("filter") || "all";

  summary.innerHTML = [
    createSummaryChip("Tracked games", games.length, "is-green"),
    createSummaryChip("Featured", (manifest.featuredIds || []).length, "is-yellow"),
    createSummaryChip("Platforms", (manifest.filters?.platforms || []).length, "is-grey"),
  ].join("");

  function filteredGames() {
    if (activeFilter === "all") {
      return games;
    }
    if (activeFilter.startsWith("platform:")) {
      const value = activeFilter.slice("platform:".length);
      return games.filter((game) => (game.platforms || []).includes(value));
    }
    if (activeFilter.startsWith("stage:")) {
      const value = activeFilter.slice("stage:".length);
      return games.filter((game) => game.stage === value);
    }
    return games;
  }

  function render() {
    filters.innerHTML = allFilters
      .map(
        (item) => `
          <button class="news-tab ${item.id === activeFilter ? "is-active" : ""}" type="button" data-filter="${item.id}">
            ${escapeHtml(item.label)}
          </button>
        `,
      )
      .join("");

    Array.from(filters.querySelectorAll("[data-filter]")).forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";
        setSearchParam("filter", activeFilter === "all" ? "" : activeFilter);
        render();
      });
    });

    const visibleGames = filteredGames();
    catalog.innerHTML = visibleGames.map(gameCardMarkup).join("");

    const featuredGames = games.filter((game) => (manifest.featuredIds || []).includes(game.id));
    rail.innerHTML = `
      <section class="rail-panel" data-reveal>
        <p class="eyebrow">Featured</p>
        <h2>Strong public candidates</h2>
        <p>${featuredGames.map((game) => escapeHtml(game.title)).join(", ")}</p>
      </section>
      <section class="rail-panel" data-reveal>
        <p class="eyebrow">Current filter</p>
        <h2>${escapeHtml(allFilters.find((item) => item.id === activeFilter)?.label || "All")}</h2>
        <p>${visibleGames.length} game${visibleGames.length === 1 ? "" : "s"} currently visible.</p>
      </section>
    `;

    observeRevealItems();
  }

  render();
}

async function renderKnowledgePage() {
  const nav = document.getElementById("knowledgePageNav");
  const meta = document.getElementById("knowledgePageMeta");
  const title = document.getElementById("knowledgePageTitle");
  const description = document.getElementById("knowledgePageDescription");
  const content = document.getElementById("knowledgePageContent");
  if (!nav || !meta || !title || !description || !content) {
    return;
  }

  const manifest = await fetchJson("data/knowledge-manifest.json");
  const landing = manifest.landing;
  const sections = manifest.sections || [];
  const documents = [
    {
      id: landing.id,
      title: landing.title,
      summary: manifest.summary,
      description: landing.summary,
      path: landing.path,
      promptCards: [],
      references: [],
      group: "Start here",
    },
    ...sections.map((section) => ({
      ...section,
      description: section.summary,
      group: "Categories",
    })),
    {
      id: "research-prompt-packs",
      title: "Research Prompt Packs",
      description: "Reusable prompts for category refreshes and news-source curation.",
      path: manifest.promptPacks.path,
      promptCards: [],
      references: [],
      group: "Categories",
    },
  ];

  async function openDocument(document) {
    const markdown = await fetchMarkdown(document.path);
    meta.textContent = document.group;
    title.textContent = document.title;
    description.textContent = document.description || "";
    content.innerHTML = `
      ${createReferenceList(document.references)}
      ${createPromptSection(document.promptCards)}
      <div class="markdown-body">${markdownToHtml(markdown)}</div>
    `;

    Array.from(nav.querySelectorAll(".docs-nav__button")).forEach((button) => {
      button.classList.toggle("is-active", button.dataset.docId === document.id);
    });

    history.replaceState(null, "", `#${encodeURIComponent(document.id)}`);
  }

  nav.innerHTML = `
    <section class="docs-nav__group">
      <h2>Start here</h2>
      <button class="docs-nav__button" type="button" data-doc-id="${landing.id}">
        <strong>${escapeHtml(landing.title)}</strong>
        <span>${escapeHtml(landing.summary)}</span>
      </button>
    </section>
    <section class="docs-nav__group">
      <h2>Categories</h2>
      ${documents
        .filter((document) => document.group === "Categories")
        .map(
          (document) => `
            <button class="docs-nav__button" type="button" data-doc-id="${document.id}">
              <strong>${escapeHtml(document.title)}</strong>
              <span>${escapeHtml(document.summary || document.description || "")}</span>
            </button>
          `,
        )
        .join("")}
    </section>
  `;

  Array.from(nav.querySelectorAll("[data-doc-id]")).forEach((button) => {
    button.addEventListener("click", () => {
      const document = documents.find((item) => item.id === button.dataset.docId);
      if (document) {
        openDocument(document);
      }
    });
  });

  const requestedId = decodeURIComponent(window.location.hash.replace(/^#/, "")) || landing.id;
  await openDocument(documents.find((document) => document.id === requestedId) || documents[0]);
}

async function renderNewsLanding() {
  const grid = document.getElementById("newsLandingGrid");
  const rail = document.getElementById("newsLandingRail");
  if (!grid || !rail) {
    return;
  }

  const [manifest, registry] = await Promise.all([fetchJson("data/games-news.json"), loadRegistry()]);
  const registryMap = registryEntryMap(registry);

  grid.innerHTML = (manifest.feeds || [])
    .map((feed) => {
      const routeById = {
        "game-dev": registryMap.get("news-development")?.publicRoute || "news-development.html",
        gaming: registryMap.get("news-gaming")?.publicRoute || "news-gaming.html",
        reviews: registryMap.get("news-reviews")?.publicRoute || "news-reviews.html",
        previews: registryMap.get("news-previews")?.publicRoute || "news-previews.html",
      };
      return `
        <article class="preview-card" data-reveal>
          <p class="feature__kicker">${escapeHtml(feed.title)}</p>
          <h3>${escapeHtml(feed.title)}</h3>
          <p>${escapeHtml(feed.summary)}</p>
          <p>${feed.generatedAt ? `Latest output ${escapeHtml(feed.generatedAt)}.` : escapeHtml(manifest.notice)}</p>
          ${renderPillRow(feed.platformFocus || [])}
          <a class="button button--ghost" href="${routeById[feed.id] || "news.html"}">Open feed</a>
        </article>
      `;
    })
    .join("");

  rail.innerHTML = `
    <section class="rail-panel" data-reveal>
      <p class="eyebrow">Platform scope</p>
      <h2>Tracked platforms</h2>
      ${renderPillRow(manifest.platformPolicy?.allowed || [])}
      <p>${escapeHtml(manifest.platformPolicy?.summary || "")}</p>
    </section>
    <section class="rail-panel" data-reveal>
      <p class="eyebrow">Editorial mode</p>
      <h2>Curated, not scraped live</h2>
      <p>${escapeHtml(manifest.notice)}</p>
    </section>
  `;

  observeRevealItems();
}

async function renderReviewCoveragePage() {
  const grid = document.getElementById("reviewCoverageGrid");
  const rail = document.getElementById("reviewCoverageRail");
  if (!grid || !rail) {
    return;
  }

  const manifest = await fetchJson("data/games-news.json");
  const reviewsFeed = (manifest.feeds || []).find((feed) => feed.id === "reviews");
  const previewsFeed = (manifest.feeds || []).find((feed) => feed.id === "previews");

  grid.innerHTML = [
    reviewsFeed
      ? `
        <article class="preview-card" data-reveal>
          <p class="feature__kicker">Reviews</p>
          <h3>${escapeHtml(reviewsFeed.title)}</h3>
          <p>${escapeHtml(reviewsFeed.summary)}</p>
          <a class="button button--ghost" href="news-reviews.html">Open review coverage</a>
        </article>
      `
      : "",
    previewsFeed
      ? `
        <article class="preview-card" data-reveal>
          <p class="feature__kicker">Previews</p>
          <h3>${escapeHtml(previewsFeed.title)}</h3>
          <p>${escapeHtml(previewsFeed.summary)}</p>
          <a class="button button--ghost" href="news-previews.html">Open preview coverage</a>
        </article>
      `
      : "",
  ]
    .filter(Boolean)
    .join("");

  rail.innerHTML = `
    <section class="rail-panel" data-reveal>
      <p class="eyebrow">Editorial stance</p>
      <h2>No house-review pretense</h2>
      <p>GameTrackDaily should curate intelligently, keep verdicts and first impressions separate, and let the wider games press do the actual scoring work unless you later add a true editorial review desk.</p>
    </section>
    <section class="rail-panel" data-reveal>
      <p class="eyebrow">Source families</p>
      <h2>Wider games press</h2>
      ${renderPillRow(
        Array.from(new Set([...(reviewsFeed?.sources || []), ...(previewsFeed?.sources || [])])).slice(0, 8),
      )}
    </section>
  `;

  observeRevealItems();
}

async function renderNewsFeedPage(feedId) {
  const summary = document.getElementById("newsFeedSummary");
  const filters = document.getElementById("newsFeedFilters");
  const body = document.getElementById("newsFeedBody");
  const rail = document.getElementById("newsFeedRail");
  const heroTitle = document.getElementById("newsFeedTitle");
  const heroCopy = document.getElementById("newsFeedCopy");
  if (!summary || !filters || !body || !rail || !heroTitle || !heroCopy) {
    return;
  }

  const manifest = await fetchJson("data/games-news.json");
  const feed = (manifest.feeds || []).find((item) => item.id === feedId) || manifest.feeds?.[0];
  if (!feed) {
    body.innerHTML = `<section class="empty-state"><h3>No feed configured</h3><p>The selected feed could not be loaded.</p></section>`;
    return;
  }

  let activeFamily = new URL(window.location.href).searchParams.get("platform") || "all";
  const families = ["all", "windows", "xbox", "playstation"];

  heroTitle.textContent = feed.title;
  heroCopy.textContent = feed.summary;

  function filteredItems() {
    return (feed.items || []).filter((item) => matchesPlatformFamily(item.platforms || [], activeFamily));
  }

  function render() {
    const items = filteredItems();
    summary.innerHTML = [
      createSummaryChip("Items", items.length, "is-green"),
      createSummaryChip("Sources", (feed.sources || []).length, "is-grey"),
      createSummaryChip("Updated", feed.generatedAt || "Pending", "is-yellow"),
    ].join("");

    filters.innerHTML = families
      .map(
        (family) => `
          <button class="news-tab ${family === activeFamily ? "is-active" : ""}" type="button" data-family="${family}">
            ${escapeHtml(platformFamilyLabel(family))}
          </button>
        `,
      )
      .join("");

    Array.from(filters.querySelectorAll("[data-family]")).forEach((button) => {
      button.addEventListener("click", () => {
        activeFamily = button.dataset.family || "all";
        setSearchParam("platform", activeFamily === "all" ? "" : activeFamily);
        render();
      });
    });

    body.innerHTML = items.length
      ? `<section class="news-card-grid">${items.map((item) => newsItemCard(item, feed.title)).join("")}</section>`
      : `<section class="empty-state"><h3>Feed ready, first export still pending</h3><p>${escapeHtml(manifest.notice)}</p></section>`;

    rail.innerHTML = `
      <section class="rail-panel" data-reveal>
        <p class="eyebrow">Tracked sources</p>
        <h2>${escapeHtml(feed.title)}</h2>
        ${renderPillRow(feed.sources || [])}
      </section>
      <section class="rail-panel" data-reveal>
        <p class="eyebrow">Platform focus</p>
        <h2>${escapeHtml(platformFamilyLabel(activeFamily))}</h2>
        ${renderPillRow(feed.platformFocus || [])}
      </section>
      <section class="rail-panel" data-reveal>
        <p class="eyebrow">Related feeds</p>
        <h2>Stay in context</h2>
        <p>
          <a href="news-development.html">Game Dev</a><br />
          <a href="news-gaming.html">Gaming</a><br />
          <a href="news-reviews.html">Reviews</a><br />
          <a href="news-previews.html">Previews</a>
        </p>
      </section>
    `;

    observeRevealItems();
  }

  render();
}

function buildReleaseModel(manifest) {
  const dated = (manifest.releases || [])
    .filter((item) => item.date)
    .map((item) => {
      const releaseDate = parseDateKey(item.date);
      return releaseDate ? { ...item, releaseDate } : null;
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (left.date === right.date) {
        return left.title.localeCompare(right.title);
      }
      return left.date.localeCompare(right.date);
    });

  const byDate = new Map();
  dated.forEach((item) => {
    const items = byDate.get(item.date) || [];
    items.push(item);
    byDate.set(item.date, items);
  });

  return {
    dated,
    byDate,
    undated: manifest.undated || [],
  };
}

async function renderCalendarPage() {
  const summary = document.getElementById("calendarSummary");
  const filters = document.getElementById("calendarFilters");
  const notice = document.getElementById("calendarNotice");
  const weekdays = document.getElementById("calendarWeekdays");
  const grid = document.getElementById("calendarGrid");
  const detail = document.getElementById("calendarDetail");
  const rangeLabel = document.getElementById("calendarRangeLabel");
  const prevButton = document.getElementById("calendarPrevButton");
  const nextButton = document.getElementById("calendarNextButton");
  const viewToggle = document.getElementById("calendarViewToggle");
  const rail = document.getElementById("calendarRail");
  if (!summary || !filters || !notice || !weekdays || !grid || !detail || !rangeLabel || !prevButton || !nextButton || !viewToggle || !rail) {
    return;
  }

  const manifest = await fetchJson("data/release-calendar.json");
  const model = buildReleaseModel(manifest);
  const firstDate = parseDateKey(model.dated[0]?.date) || new Date();
  let view = new URL(window.location.href).searchParams.get("view") || "month";
  let family = new URL(window.location.href).searchParams.get("platform") || "all";
  let cursorDate = startOfDay(firstDate);
  let selectedDateKey = new URL(window.location.href).searchParams.get("date") || model.dated[0]?.date || null;

  weekdays.innerHTML = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => `<span>${label}</span>`).join("");
  notice.textContent = `${manifest.notice} Major showcases and awards now live on the separate Events page.`;

  function filteredReleases() {
    return model.dated.filter((item) => matchesPlatformFamily(item.platforms || [], family));
  }

  function groupedByDate(items) {
    const map = new Map();
    items.forEach((item) => {
      const entries = map.get(item.date) || [];
      entries.push(item);
      map.set(item.date, entries);
    });
    return map;
  }

  function cellsForCurrentView() {
    if (view === "week") {
      const start = startOfWeek(cursorDate);
      return Array.from({ length: 7 }, (_, index) => {
        const day = addDays(start, index);
        return { date: day, key: dateKey(day), outsideMonth: false };
      });
    }

    const monthStart = new Date(cursorDate.getFullYear(), cursorDate.getMonth(), 1);
    const gridStart = startOfWeek(monthStart);
    return Array.from({ length: 42 }, (_, index) => {
      const day = addDays(gridStart, index);
      return { date: day, key: dateKey(day), outsideMonth: monthKey(day) !== monthKey(monthStart) };
    });
  }

  function render() {
    const visibleReleases = filteredReleases();
    const visibleByDate = groupedByDate(visibleReleases);
    const cells = cellsForCurrentView();

    summary.innerHTML = [
      createSummaryChip("Dated releases", visibleReleases.length, "is-green"),
      createSummaryChip("Still TBD", (manifest.undated || []).filter((item) => matchesPlatformFamily(item.platforms || [], family)).length, "is-grey"),
      createSummaryChip("View", view === "week" ? "Week" : "Month", "is-yellow"),
    ].join("");

    filters.innerHTML = ["all", "windows", "xbox", "playstation"]
      .map(
        (item) => `
          <button class="news-tab ${item === family ? "is-active" : ""}" type="button" data-family="${item}">
            ${escapeHtml(platformFamilyLabel(item))}
          </button>
        `,
      )
      .join("");

    Array.from(filters.querySelectorAll("[data-family]")).forEach((button) => {
      button.addEventListener("click", () => {
        family = button.dataset.family || "all";
        setSearchParam("platform", family === "all" ? "" : family);
        render();
      });
    });

    Array.from(viewToggle.querySelectorAll(".calendar-toggle__button")).forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === view);
    });

    rangeLabel.textContent = view === "week" ? formatWeekLabel(startOfWeek(cursorDate)) : formatMonthLabel(cursorDate);
    grid.classList.toggle("is-week", view === "week");
    grid.innerHTML = cells
      .map((cell) => {
        const releases = visibleByDate.get(cell.key) || [];
        const platformCounts = groupedPlatformCounts(releases)
          .slice(0, 2)
          .map((item) => `<span>${escapeHtml(`${item.count} ${item.platform}`)}</span>`)
          .join("");
        return `
          <button
            class="calendar-day ${releases.length ? "is-active" : "is-empty"} ${cell.outsideMonth ? "is-outside-month" : ""} ${selectedDateKey === cell.key ? "is-selected" : ""}"
            type="button"
            data-date-key="${cell.key}"
          >
            <span class="calendar-day__date">${escapeHtml(
              new Intl.DateTimeFormat([], { month: "short", day: "numeric" }).format(cell.date),
            )}</span>
            <strong class="calendar-day__count">${releases.length ? `${releases.length} release${releases.length === 1 ? "" : "s"}` : "Quiet"}</strong>
            <span class="calendar-day__platforms">${platformCounts || "&nbsp;"}</span>
          </button>
        `;
      })
      .join("");

    Array.from(grid.querySelectorAll("[data-date-key]")).forEach((button) => {
      button.addEventListener("click", () => {
        selectedDateKey = button.dataset.dateKey;
        setSearchParam("date", selectedDateKey);
        render();
      });
    });

    const selectedReleases = selectedDateKey ? visibleByDate.get(selectedDateKey) || [] : [];
    const selectedDate = selectedDateKey ? parseDateKey(selectedDateKey) : null;
    detail.innerHTML = `
      <div class="calendar-detail__head">
        <div>
          <p class="feature__kicker">Selected day</p>
          <h2>${selectedDate ? escapeHtml(formatLongDate(selectedDate)) : "Choose a day"}</h2>
        </div>
        <p>${selectedReleases.length ? `${selectedReleases.length} tracked release${selectedReleases.length === 1 ? "" : "s"}` : "No tracked releases on this day."}</p>
      </div>
      ${
        selectedReleases.length
          ? `<ul class="calendar-release-list">
              ${selectedReleases
                .map(
                  (item) => `
                    <li class="calendar-release-item">
                      <div>
                        <strong>${item.igdbUrl ? `<a href="${item.igdbUrl}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}</strong>
                        <p>${escapeHtml((item.platforms || []).join(", ") || "Platform not recorded")}</p>
                      </div>
                      <span>${escapeHtml(item.source || "Tracked list")}</span>
                    </li>
                  `,
                )
                .join("")}
            </ul>`
          : `<div class="empty-state"><h3>Quiet day</h3><p>No tracked releases match the active filter on this date.</p></div>`
      }
    `;

    const nextRelease = visibleReleases.find((item) => item.date >= dateKey(startOfDay(new Date()))) || visibleReleases[0];
    rail.innerHTML = `
      <section class="rail-panel" data-reveal>
        <p class="eyebrow">Next release</p>
        <h2>${escapeHtml(nextRelease?.title || "No dated release")}</h2>
        <p>${escapeHtml(nextRelease?.date || "TBA")}</p>
        ${nextRelease ? renderPillRow(nextRelease.platforms || []) : "<p>Keep following the tracked list for date changes.</p>"}
      </section>
      <section class="rail-panel" data-reveal>
        <p class="eyebrow">Events</p>
        <h2>Separate events page</h2>
        <p>Showcases, awards, stream links, and local times now live on their own dedicated page so the release calendar can stay focused.</p>
        <a class="button button--ghost" href="events.html">Open events</a>
      </section>
    `;

    observeRevealItems();
  }

  Array.from(viewToggle.querySelectorAll(".calendar-toggle__button")).forEach((button) => {
    button.addEventListener("click", () => {
      view = button.dataset.view || "month";
      setSearchParam("view", view === "month" ? "" : view);
      render();
    });
  });

  prevButton.addEventListener("click", () => {
    cursorDate = view === "week" ? addDays(cursorDate, -7) : new Date(cursorDate.getFullYear(), cursorDate.getMonth() - 1, 1);
    render();
  });

  nextButton.addEventListener("click", () => {
    cursorDate = view === "week" ? addDays(cursorDate, 7) : new Date(cursorDate.getFullYear(), cursorDate.getMonth() + 1, 1);
    render();
  });

  render();
}

async function renderEventsPage() {
  const summary = document.getElementById("eventsSummary");
  const controls = document.getElementById("eventsControls");
  const timeline = document.getElementById("eventsTimeline");
  const rail = document.getElementById("eventsRail");
  if (!summary || !controls || !timeline || !rail) {
    return;
  }

  const manifest = await fetchJson("data/release-calendar.json");
  const events = (manifest.events || [])
    .filter((item) => item.date)
    .sort((left, right) => String(left.date).localeCompare(String(right.date)));

  let activeKind = new URL(window.location.href).searchParams.get("kind") || "all";
  let activeFamily = new URL(window.location.href).searchParams.get("platform") || "all";

  const kinds = ["all", ...Array.from(new Set(events.map((item) => item.kind).filter(Boolean))).sort()];

  function filteredEvents() {
    return events.filter((item) => {
      const kindMatch = activeKind === "all" || item.kind === activeKind;
      const familyMatch = matchesPlatformFamily(item.platformFocus || [], activeFamily);
      return kindMatch && familyMatch;
    });
  }

  function render() {
    const visible = filteredEvents();
    const nextEvent = visible.find((item) => item.date >= dateKey(startOfDay(new Date()))) || visible[0];

    summary.innerHTML = [
      createSummaryChip("Tracked events", visible.length, "is-green"),
      createSummaryChip("Kinds", kinds.length - 1, "is-grey"),
      createSummaryChip("Platform lens", platformFamilyLabel(activeFamily), "is-yellow"),
    ].join("");

    controls.innerHTML = `
      <div class="news-tabs">
        ${kinds
          .map(
            (kind) => `
              <button class="news-tab ${kind === activeKind ? "is-active" : ""}" type="button" data-kind="${escapeHtml(kind)}">
                ${escapeHtml(kind === "all" ? "All events" : kind)}
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="news-tabs">
        ${["all", "windows", "xbox", "playstation"]
          .map(
            (family) => `
              <button class="news-tab ${family === activeFamily ? "is-active" : ""}" type="button" data-family="${family}">
                ${escapeHtml(platformFamilyLabel(family))}
              </button>
            `,
          )
          .join("")}
      </div>
    `;

    Array.from(controls.querySelectorAll("[data-kind]")).forEach((button) => {
      button.addEventListener("click", () => {
        activeKind = button.dataset.kind || "all";
        setSearchParam("kind", activeKind === "all" ? "" : activeKind);
        render();
      });
    });

    Array.from(controls.querySelectorAll("[data-family]")).forEach((button) => {
      button.addEventListener("click", () => {
        activeFamily = button.dataset.family || "all";
        setSearchParam("platform", activeFamily === "all" ? "" : activeFamily);
        render();
      });
    });

    timeline.innerHTML = visible.length
      ? `<section class="news-card-grid">${visible.map(eventCardMarkup).join("")}</section>`
      : `<section class="empty-state"><h3>No events match the current filters</h3><p>Try widening the platform or event-kind filters.</p></section>`;

    rail.innerHTML = `
      <section class="rail-panel" data-reveal>
        <p class="eyebrow">Next event</p>
        <h2>${escapeHtml(nextEvent?.title || "No upcoming event")}</h2>
        <p>${escapeHtml(nextEvent ? formatEventTime(nextEvent) : "TBA")}</p>
        ${
          nextEvent?.watchLinks?.length
            ? `<p>${nextEvent.watchLinks
                .map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label || "Watch")}</a>`)
                .join("<br />")}</p>`
            : `<p>${escapeHtml(nextEvent?.watchStatus || "Watch links pending")}</p>`
        }
      </section>
      <section class="rail-panel" data-reveal>
        <p class="eyebrow">Refresh rhythm</p>
        <h2>Weekly by default</h2>
        <p>${escapeHtml(manifest.eventPolicy?.refreshCadence?.baseline || "Review tracked events weekly.")}</p>
        <p>${escapeHtml(
          manifest.eventPolicy?.refreshCadence?.intensifyWithinDays
            ? `Tighten the check cadence inside ${manifest.eventPolicy.refreshCadence.intensifyWithinDays} days of the event.`
            : "Tighten the check cadence as event dates get closer.",
        )}</p>
      </section>
    `;

    observeRevealItems();
  }

  render();
}

async function init() {
  const registry = await loadRegistry();
  buildSiteNav(registry);

  if (page === "home") {
    await renderHome(registry);
  } else if (page === "games") {
    await renderGamesPage();
  } else if (page === "game-development") {
    await renderKnowledgePage();
  } else if (page === "news-landing") {
    await renderNewsLanding();
  } else if (page === "review-coverage") {
    await renderReviewCoveragePage();
  } else if (page === "news-feed") {
    await renderNewsFeedPage(pageFeed);
  } else if (page === "calendar") {
    await renderCalendarPage();
  } else if (page === "events") {
    await renderEventsPage();
  }

  observeRevealItems();
}

init().catch((error) => {
  console.error(error);
});

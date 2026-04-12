document.body.classList.add("has-motion");

const revealItems = document.querySelectorAll("[data-reveal]");
const page = document.body.dataset.page || "home";
const reviewsSummary = document.getElementById("reviewsSummary");
const reviewsPageNav = document.getElementById("reviewsPageNav");
const reviewsPageMeta = document.getElementById("reviewsPageMeta");
const reviewsPageTitle = document.getElementById("reviewsPageTitle");
const reviewsPageDescription = document.getElementById("reviewsPageDescription");
const reviewsPageContent = document.getElementById("reviewsPageContent");
const reviewsFeedFocus = document.getElementById("reviewsFeedFocus");
const calendarPreview = document.getElementById("calendarPreview");
const calendarSummary = document.getElementById("calendarSummary");
const calendarNotice = document.getElementById("calendarNotice");
const calendarPolicy = document.getElementById("calendarPolicy");
const calendarViewToggle = document.getElementById("calendarViewToggle");
const calendarWeekdays = document.getElementById("calendarWeekdays");
const calendarGrid = document.getElementById("calendarGrid");
const calendarDetail = document.getElementById("calendarDetail");
const calendarRangeLabel = document.getElementById("calendarRangeLabel");
const calendarPrevButton = document.getElementById("calendarPrevButton");
const calendarNextButton = document.getElementById("calendarNextButton");

function initReveal() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
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

  revealItems.forEach((item, index) => {
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

function createPromptCard(card) {
  return `
    <article class="prompt-card">
      <p class="feature__kicker">Agent Prompt</p>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.body)}</p>
      <pre><code>${escapeHtml(card.prompt)}</code></pre>
    </article>
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
        <div class="prompt-card-grid">${cards.map(createPromptCard).join("")}</div>
      </div>
    </section>
  `;
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

function parseDateKey(value) {
  const [year, month, day] = String(value || "")
    .split("-")
    .map((item) => Number.parseInt(item, 10));
  if (!year || !month || !day) {
    return null;
  }
  return new Date(year, month - 1, day);
}

function parseMonthKey(value) {
  const [year, month] = String(value || "")
    .split("-")
    .map((item) => Number.parseInt(item, 10));
  if (!year || !month) {
    return null;
  }
  return new Date(year, month - 1, 1);
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

function formatShortDate(date) {
  return new Intl.DateTimeFormat([], {
    month: "short",
    day: "numeric",
  }).format(date);
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
  return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}, ${endDate.getFullYear()}`;
}

function buildReleaseCalendarModel(manifest) {
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

  const events = (manifest.events || [])
    .filter((item) => item.date)
    .map((item) => {
      const eventDate = parseDateKey(item.date);
      if (!eventDate) {
        return null;
      }
      const startDateTime = item.startAt ? new Date(item.startAt) : null;
      const endDateTime = item.endAt ? new Date(item.endAt) : null;
      return { ...item, eventDate, startDateTime, endDateTime };
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (left.date === right.date) {
        const leftTime = left.startAt || "";
        const rightTime = right.startAt || "";
        if (leftTime === rightTime) {
          return left.title.localeCompare(right.title);
        }
        return leftTime.localeCompare(rightTime);
      }
      return left.date.localeCompare(right.date);
    });

  const byDate = new Map();
  dated.forEach((item) => {
    const items = byDate.get(item.date) || [];
    items.push(item);
    byDate.set(item.date, items);
  });

  const eventsByDate = new Map();
  events.forEach((item) => {
    const items = eventsByDate.get(item.date) || [];
    items.push(item);
    eventsByDate.set(item.date, items);
  });

  const months = Array.from(new Set([...dated, ...events].map((item) => item.date.slice(0, 7)))).sort();
  return {
    manifest,
    dated,
    byDate,
    events,
    eventsByDate,
    months,
    undated: manifest.undated || [],
  };
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

function densityClass(count, densityRules = {}) {
  if (count >= (densityRules.heavy || 4)) {
    return "is-heavy";
  }
  if (count >= (densityRules.busy || 2)) {
    return "is-busy";
  }
  if (count > 0) {
    return "is-active";
  }
  return "is-empty";
}

function peakReleaseDay(model) {
  let best = null;
  const dayKeys = new Set([...model.byDate.keys(), ...model.eventsByDate.keys()]);
  dayKeys.forEach((dayKey) => {
    const releases = model.byDate.get(dayKey) || [];
    const events = model.eventsByDate.get(dayKey) || [];
    const count = releases.length + events.length;
    if (!best || count > best.count) {
      best = { dayKey, count, items: releases, events };
    }
  });
  return best;
}

function focusMonthStats(model, focusMonth) {
  const items = model.dated.filter((item) => item.date.startsWith(focusMonth));
  const events = model.events.filter((item) => item.date.startsWith(focusMonth));
  return {
    month: focusMonth,
    releaseCount: items.length,
    eventCount: events.length,
    count: items.length + events.length,
    platforms: groupedPlatformCounts(items),
  };
}

function releaseListMarkup(items = []) {
  return items
    .map((item) => {
      const platforms = (item.platforms || []).join(", ");
      const title = item.igdbUrl
        ? `<a href="${item.igdbUrl}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a>`
        : escapeHtml(item.title);
      return `
        <li class="calendar-release-item">
          <div>
            <strong>${title}</strong>
            <p>${escapeHtml(platforms || "Platform not recorded")}</p>
          </div>
          <span>${escapeHtml(item.source || "Tracked list")}</span>
        </li>
      `;
    })
    .join("");
}

function formatCalendarEventTime(item) {
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
  const startLabel = formatter.format(start);
  if (!end) {
    return startLabel;
  }
  return `${startLabel} - ${formatter.format(end)}`;
}

function eventListMarkup(items = []) {
  return items
    .map((item) => {
      const title = item.officialUrl
        ? `<a href="${item.officialUrl}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a>`
        : escapeHtml(item.title);
      const watchLink = item.watchUrl
        ? `<a href="${item.watchUrl}" target="_blank" rel="noreferrer">${escapeHtml(item.watchLabel || "Watch event")}</a>`
        : escapeHtml(item.watchStatus || "Watch link pending");
      const focus = (item.platformFocus || []).join(", ");
      const location = [item.venue, item.city].filter(Boolean).join(", ");
      return `
        <li class="calendar-release-item calendar-release-item--event">
          <div>
            <strong>${title}</strong>
            <p>${escapeHtml(formatCalendarEventTime(item))}</p>
            <p>${escapeHtml(location || focus || "Major industry event")}</p>
          </div>
          <span>${watchLink}</span>
        </li>
      `;
    })
    .join("");
}

function renderCalendarPreview(manifest) {
  if (!calendarPreview) return;

  const model = buildReleaseCalendarModel(manifest);
  const focusMonth = manifest.defaultFocusMonth || model.months[0];
  const focusStats = focusMonth ? focusMonthStats(model, focusMonth) : null;
  const peakDay = peakReleaseDay(model);
  const peakDate = peakDay ? parseDateKey(peakDay.dayKey) : null;
  const todayKey = dateKey(startOfDay(new Date()));
  const upcomingEvent = model.events.find((item) => item.date >= todayKey) || model.events[0];

  calendarPreview.innerHTML = [
    focusStats
      ? `
        <article class="preview-card">
          <p class="feature__kicker">Focus month</p>
          <h3>${escapeHtml(formatMonthLabel(parseMonthKey(focusStats.month)))}</h3>
          <p>${focusStats.releaseCount} tracked release${focusStats.releaseCount === 1 ? "" : "s"} and ${focusStats.eventCount} major event${focusStats.eventCount === 1 ? "" : "s"} in the default focus month.</p>
          <p>${focusStats.platforms.length
            ? focusStats.platforms
                .slice(0, 3)
                .map((item) => `${item.count} ${item.platform}`)
                .join(", ")
            : `${focusStats.eventCount} event-driven date${focusStats.eventCount === 1 ? "" : "s"} currently anchor this month.`}</p>
          <a class="button button--ghost" href="calendar.html">Open calendar</a>
        </article>
      `
      : "",
    peakDay && peakDate
      ? `
        <article class="preview-card">
          <p class="feature__kicker">Peak day</p>
          <h3>${escapeHtml(formatLongDate(peakDate))}</h3>
          <p>${peakDay.count} tracked calendar item${peakDay.count === 1 ? "" : "s"} land on this day.</p>
          <p>${groupedPlatformCounts(peakDay.items).length
            ? groupedPlatformCounts(peakDay.items)
                .slice(0, 2)
                .map((item) => `${item.count} ${item.platform}`)
                .join(", ")
            : `${peakDay.events?.length || 0} event${peakDay.events?.length === 1 ? "" : "s"} drive the density on this day.`}</p>
          <a class="button button--ghost" href="calendar.html">Inspect the day</a>
        </article>
      `
      : "",
    upcomingEvent
      ? `
        <article class="preview-card">
          <p class="feature__kicker">${escapeHtml(upcomingEvent.kind || "event")}</p>
          <h3>${escapeHtml(upcomingEvent.title)}</h3>
          <p>${escapeHtml(formatCalendarEventTime(upcomingEvent))}</p>
          <p>${escapeHtml(upcomingEvent.notes || "Refresh again closer to the event for the final stream destination.")}</p>
          <a class="button button--ghost" href="calendar.html">Track the event</a>
        </article>
      `
      : "",
    `
      <article class="preview-card">
        <p class="feature__kicker">Still TBD</p>
        <h3>${manifest.undated?.length || 0} tracked titles</h3>
        <p>Undated or wide-window releases stay visible so the calendar does not pretend uncertainty has been solved.</p>
        <p>${escapeHtml(manifest.notice || "Tracked release data is still being tightened.")}</p>
        <a class="button button--ghost" href="calendar.html">See undated games</a>
      </article>
    `,
  ].join("");
}

async function initHome() {
  const knowledgePreview = document.getElementById("knowledgePreview");
  const newsPreview = document.getElementById("newsPreview");
  if (!knowledgePreview || !newsPreview) return;

  const [knowledge, news, calendar] = await Promise.all([
    fetchJson("data/knowledge-manifest.json"),
    fetchJson("data/games-news.json"),
    fetchJson("data/release-calendar.json"),
  ]);

  knowledgePreview.innerHTML = knowledge.sections
    .slice(0, 6)
    .map(
      (section) => `
        <article class="preview-card">
          <p class="feature__kicker">${escapeHtml(section.title)}</p>
          <h3>${escapeHtml(section.title)}</h3>
          <p>${escapeHtml(section.summary)}</p>
          <p>Last reviewed ${escapeHtml(section.lastReviewed)}. Next trigger: ${escapeHtml(section.nextReviewTrigger)}</p>
          <a class="button button--ghost" href="game-development.html#${encodeURIComponent(section.id)}">Open section</a>
        </article>
      `,
    )
    .join("");

  newsPreview.innerHTML = news.feeds
    .map(
      (feed) => `
        <article class="preview-card">
          <p class="feature__kicker">${escapeHtml(feed.title)}</p>
          <h3>${escapeHtml(feed.title)}</h3>
          <p>${escapeHtml(feed.summary)}</p>
          <p>${feed.generatedAt ? `Latest output ${escapeHtml(feed.generatedAt)}.` : "Pipeline-ready. Waiting for the first generated export."}</p>
          <p>Tracked sources: ${feed.sources.map((source) => escapeHtml(source)).join(", ")}</p>
          <p>Platform focus: ${(feed.platformFocus || []).map((platform) => escapeHtml(platform)).join(", ")}</p>
          <a class="button button--ghost" href="news.html#${encodeURIComponent(feed.id)}">Open feed</a>
        </article>
      `,
    )
    .join("");

  renderCalendarPreview(calendar);
}

async function initKnowledgePage() {
  const nav = document.getElementById("knowledgePageNav");
  const meta = document.getElementById("knowledgePageMeta");
  const title = document.getElementById("knowledgePageTitle");
  const description = document.getElementById("knowledgePageDescription");
  const content = document.getElementById("knowledgePageContent");
  if (!nav || !meta || !title || !description || !content) return;

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

    const hash = encodeURIComponent(document.id);
    if (window.location.hash !== `#${hash}`) {
      history.replaceState(null, "", `#${hash}`);
    }
  }

  const startGroup = document.createElement("section");
  startGroup.className = "docs-nav__group";
  startGroup.innerHTML = `<h2>Start here</h2>`;

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.className = "docs-nav__button";
  startButton.dataset.docId = landing.id;
  startButton.innerHTML = `<strong>${landing.title}</strong><span>${landing.summary}</span>`;
  startButton.addEventListener("click", () => openDocument(documents[0]));
  startGroup.appendChild(startButton);
  nav.appendChild(startGroup);

  const categoriesGroup = document.createElement("section");
  categoriesGroup.className = "docs-nav__group";
  categoriesGroup.innerHTML = `<h2>Categories</h2>`;

  sections.forEach((section) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "docs-nav__button";
    button.dataset.docId = section.id;
    button.innerHTML = `<strong>${section.title}</strong><span>${section.summary}</span>`;
    button.addEventListener("click", () => openDocument(documents.find((document) => document.id === section.id)));
    categoriesGroup.appendChild(button);
  });

  const promptButton = document.createElement("button");
  promptButton.type = "button";
  promptButton.className = "docs-nav__button";
  promptButton.dataset.docId = "research-prompt-packs";
  promptButton.innerHTML = `<strong>Research Prompt Packs</strong><span>Reusable prompts for deeper category refreshes and source curation.</span>`;
  promptButton.addEventListener("click", () =>
    openDocument({
      id: "research-prompt-packs",
      title: "Research Prompt Packs",
      description: "Reusable prompts for category refreshes and news-source curation.",
      path: manifest.promptPacks.path,
      promptCards: [],
      references: [],
      group: "Categories",
    }),
  );
  categoriesGroup.appendChild(promptButton);
  nav.appendChild(categoriesGroup);

  const requestedId = decodeURIComponent(window.location.hash.replace(/^#/, "")) || landing.id;
  const activeDocument =
    documents.find((document) => document.id === requestedId) ||
    (requestedId === "research-prompt-packs"
      ? {
          id: "research-prompt-packs",
          title: "Research Prompt Packs",
          description: "Reusable prompts for category refreshes and news-source curation.",
          path: manifest.promptPacks.path,
          promptCards: [],
          references: [],
          group: "Categories",
        }
      : documents[0]);

  await openDocument(activeDocument);
}

async function initReviewsPage() {
  if (!reviewsPageNav || !reviewsPageTitle || !reviewsPageDescription || !reviewsPageContent || !reviewsSummary || !reviewsFeedFocus) {
    return;
  }

  const [manifest, news] = await Promise.all([fetchJson("data/reviews-manifest.json"), fetchJson("data/games-news.json")]);
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
  ];

  reviewsSummary.innerHTML = [
    `<article class="summary-chip"><span class="summary-chip__label">Scoring</span><strong class="summary-chip__value is-green">10-point</strong></article>`,
    `<article class="summary-chip"><span class="summary-chip__label">Formats</span><strong class="summary-chip__value is-yellow">${sections.length + 1}</strong></article>`,
    `<article class="summary-chip"><span class="summary-chip__label">Feed rails</span><strong class="summary-chip__value is-grey">${manifest.feedFocus?.length || 0}</strong></article>`,
  ].join("");

  async function openDocument(document) {
    const markdown = await fetchMarkdown(document.path);
    reviewsPageMeta.textContent = document.group;
    reviewsPageTitle.textContent = document.title;
    reviewsPageDescription.textContent = document.description || "";
    reviewsPageContent.innerHTML = `
      ${createReferenceList(document.references)}
      ${createPromptSection(document.promptCards)}
      <div class="markdown-body">${markdownToHtml(markdown)}</div>
    `;

    Array.from(reviewsPageNav.querySelectorAll(".docs-nav__button")).forEach((button) => {
      button.classList.toggle("is-active", button.dataset.docId === document.id);
    });

    const hash = encodeURIComponent(document.id);
    if (window.location.hash !== `#${hash}`) {
      history.replaceState(null, "", `#${hash}`);
    }
  }

  const startGroup = document.createElement("section");
  startGroup.className = "docs-nav__group";
  startGroup.innerHTML = `<h2>Start here</h2>`;

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.className = "docs-nav__button";
  startButton.dataset.docId = landing.id;
  startButton.innerHTML = `<strong>${landing.title}</strong><span>${landing.summary}</span>`;
  startButton.addEventListener("click", () => openDocument(documents[0]));
  startGroup.appendChild(startButton);
  reviewsPageNav.appendChild(startGroup);

  const categoriesGroup = document.createElement("section");
  categoriesGroup.className = "docs-nav__group";
  categoriesGroup.innerHTML = `<h2>Categories</h2>`;

  sections.forEach((section) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "docs-nav__button";
    button.dataset.docId = section.id;
    button.innerHTML = `<strong>${section.title}</strong><span>${section.summary}</span>`;
    button.addEventListener("click", () => openDocument(documents.find((document) => document.id === section.id)));
    categoriesGroup.appendChild(button);
  });

  reviewsPageNav.appendChild(categoriesGroup);

  const requestedId = decodeURIComponent(window.location.hash.replace(/^#/, "")) || landing.id;
  const activeDocument = documents.find((document) => document.id === requestedId) || documents[0];
  await openDocument(activeDocument);

  const feedFocusIds = new Set((manifest.feedFocus || []).map((item) => item.id));
  const feedCards = (news.feeds || []).filter((feed) => feedFocusIds.has(feed.id));
  reviewsFeedFocus.innerHTML = feedCards
    .map(
      (feed) => `
        <article class="preview-card">
          <p class="feature__kicker">${escapeHtml(feed.title)}</p>
          <h3>${escapeHtml(feed.title)}</h3>
          <p>${escapeHtml(feed.summary)}</p>
          <p>${feed.generatedAt ? `Latest output ${escapeHtml(feed.generatedAt)}.` : escapeHtml(news.notice)}</p>
          <p>Tracked sources: ${feed.sources.map((source) => escapeHtml(source)).join(", ")}</p>
          <p>Platform focus: ${(feed.platformFocus || []).map((platform) => escapeHtml(platform)).join(", ")}</p>
          <a class="button button--ghost" href="news.html#${encodeURIComponent(feed.id)}">Open feed</a>
        </article>
      `,
    )
    .join("");
}

async function initNewsPage() {
  const summary = document.getElementById("newsSummary");
  const tabs = document.getElementById("newsTabs");
  const feed = document.getElementById("newsFeed");
  if (!summary || !tabs || !feed) return;

  const manifest = await fetchJson("data/games-news.json");
  const feeds = manifest.feeds || [];
  let activeFeedId = decodeURIComponent(window.location.hash.replace(/^#/, "")) || feeds[0]?.id;

  summary.innerHTML = [
    `<article class="summary-chip"><span class="summary-chip__label">Status</span><strong class="summary-chip__value is-green">${escapeHtml(
      manifest.status || "pipeline-ready",
    )}</strong></article>`,
    `<article class="summary-chip"><span class="summary-chip__label">Feeds</span><strong class="summary-chip__value is-grey">${feeds.length}</strong></article>`,
    `<article class="summary-chip"><span class="summary-chip__label">Tracked Platforms</span><strong class="summary-chip__value is-grey">${(manifest.platformPolicy?.allowed || []).length}</strong></article>`,
    `<article class="summary-chip"><span class="summary-chip__label">Updated</span><strong class="summary-chip__value is-yellow">${escapeHtml(
      manifest.updatedAt,
    )}</strong></article>`,
  ].join("");

  function renderFeed(feedData) {
    const supportedPlatforms = feedData.platformFocus || manifest.platformPolicy?.allowed || [];
    const taggingRules = feedData.taggingRules || [];
    feed.innerHTML = `
      <article class="feed-hero">
        <p class="feature__kicker">${escapeHtml(feedData.title)}</p>
        <h2>${escapeHtml(feedData.summary)}</h2>
        <p>${feedData.generatedAt ? `Latest generated output: ${escapeHtml(feedData.generatedAt)}.` : escapeHtml(manifest.notice)}</p>
      </article>
      <section class="feed-sources">
        <p class="feature__kicker">Tracked sources</p>
        ${renderPillRow(feedData.sources || [])}
      </section>
      <section class="feed-platforms">
        <p class="feature__kicker">Platform focus</p>
        ${renderPillRow(supportedPlatforms)}
        <p>${escapeHtml(manifest.platformPolicy?.summary || "Platform tags should stay explicit and honest.")}</p>
        ${
          taggingRules.length
            ? `<ul class="docs-link-list">${taggingRules
                .map((rule) => `<li>${escapeHtml(rule)}</li>`)
                .join("")}</ul>`
            : ""
        }
      </section>
      ${
        feedData.items.length
          ? `<section class="news-card-grid">
              ${feedData.items
                .map(
                  (item) => `
                  <article class="news-card">
                    <p class="feature__kicker">${escapeHtml(item.section || feedData.title)}</p>
                    <h3><a href="${item.url}" target="_blank" rel="noreferrer">${escapeHtml(item.headline)}</a></h3>
                    <p>${escapeHtml(item.summary)}</p>
                    ${
                      (item.platforms || []).length || (item.tags || []).length
                        ? `<div class="news-card__pills">
                            ${renderPillRow(item.platforms || [])}
                            ${renderPillRow(item.tags || [])}
                          </div>`
                        : ""
                    }
                    <div class="news-card__meta">
                      <span>${escapeHtml(item.source)}</span>
                      <span>${escapeHtml(item.publishedDate)}</span>
                    </div>
                  </article>
                `,
                )
                .join("")}
            </section>`
          : `<section class="empty-state">
              <h3>Pipeline ready, first feed export still pending</h3>
              <p>${escapeHtml(manifest.notice)}</p>
            </section>`
      }
    `;
  }

  tabs.innerHTML = "";
  feeds.forEach((feedData) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "news-tab";
    button.textContent = feedData.title;
    button.dataset.feedId = feedData.id;
    button.addEventListener("click", () => {
      activeFeedId = feedData.id;
      history.replaceState(null, "", `#${encodeURIComponent(feedData.id)}`);
      Array.from(tabs.querySelectorAll(".news-tab")).forEach((tab) => {
        tab.classList.toggle("is-active", tab.dataset.feedId === activeFeedId);
      });
      renderFeed(feedData);
    });
    tabs.appendChild(button);
  });

  const activeFeed = feeds.find((feedData) => feedData.id === activeFeedId) || feeds[0];
  Array.from(tabs.querySelectorAll(".news-tab")).forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.feedId === activeFeed.id);
  });
  renderFeed(activeFeed);
}

async function initCalendarPage() {
  if (
    !calendarSummary ||
    !calendarNotice ||
    !calendarPolicy ||
    !calendarViewToggle ||
    !calendarWeekdays ||
    !calendarGrid ||
    !calendarDetail ||
    !calendarRangeLabel ||
    !calendarPrevButton ||
    !calendarNextButton
  ) {
    return;
  }

  const manifest = await fetchJson("data/release-calendar.json");
  const model = buildReleaseCalendarModel(manifest);
  const focusMonthDate =
    parseMonthKey(manifest.defaultFocusMonth) ||
    parseDateKey(model.dated[0]?.date) ||
    parseDateKey(model.events[0]?.date) ||
    new Date();
  let view = manifest.defaultView || "month";
  let cursorDate = startOfDay(focusMonthDate);
  let selectedDateKey =
    model.dated.find((item) => item.date.startsWith(monthKey(focusMonthDate)))?.date ||
    model.events.find((item) => item.date.startsWith(monthKey(focusMonthDate)))?.date ||
    model.dated[0]?.date ||
    model.events[0]?.date ||
    null;

  calendarSummary.innerHTML = [
    ["Status", manifest.status || "seeded", "is-yellow"],
    ["Dated releases", model.dated.length, "is-green"],
    ["Events", model.events.length, "is-green"],
    ["Still TBD", model.undated.length, "is-grey"],
    ["Tracked platforms", (manifest.platformPolicy?.allowed || []).length, "is-grey"],
  ]
    .map(
      ([label, value, tone]) => `
        <article class="summary-chip">
          <span class="summary-chip__label">${label}</span>
          <strong class="summary-chip__value ${tone}">${escapeHtml(String(value))}</strong>
        </article>
      `,
    )
    .join("");

  calendarNotice.textContent = manifest.notice || "";
  calendarPolicy.innerHTML = `
    <div class="feed-sources">
      <p class="feature__kicker">Platform scope</p>
      ${renderPillRow(manifest.platformPolicy?.allowed || [])}
      <p>${escapeHtml(manifest.platformPolicy?.summary || "")}</p>
    </div>
    <div class="feed-sources">
      <p class="feature__kicker">Event coverage</p>
      ${renderPillRow(manifest.eventPolicy?.coveredKinds || [])}
      <p>${escapeHtml(manifest.eventPolicy?.summary || "Major showcases and awards live here alongside tracked releases.")}</p>
      <p>${escapeHtml(manifest.eventPolicy?.refreshCadence?.baseline || "Weekly review")} with a faster refresh inside the final ${escapeHtml(String(manifest.eventPolicy?.refreshCadence?.intensifyWithinDays || 14))} days.</p>
    </div>
  `;

  calendarWeekdays.innerHTML = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    .map((label) => `<span>${label}</span>`)
    .join("");

  function currentCells() {
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

  function ensureSelectedDate(cells) {
    if (selectedDateKey && cells.some((cell) => cell.key === selectedDateKey)) {
      return;
    }

    const activeCell = cells.find((cell) => {
      const releases = model.byDate.get(cell.key) || [];
      const events = model.eventsByDate.get(cell.key) || [];
      return releases.length || events.length;
    });
    selectedDateKey = activeCell?.key || cells[0]?.key || null;
  }

  function renderDetail() {
    const selectedDate = selectedDateKey ? parseDateKey(selectedDateKey) : null;
    const releases = selectedDateKey ? model.byDate.get(selectedDateKey) || [] : [];
    const events = selectedDateKey ? model.eventsByDate.get(selectedDateKey) || [] : [];
    const platformCounts = groupedPlatformCounts(releases);
    const totalItems = releases.length + events.length;

    calendarDetail.innerHTML = `
      <div class="calendar-detail__head">
        <div>
          <p class="feature__kicker">Selected day</p>
          <h2>${selectedDate ? escapeHtml(formatLongDate(selectedDate)) : "Choose a day"}</h2>
        </div>
        <p>${totalItems ? `${releases.length} release${releases.length === 1 ? "" : "s"} and ${events.length} event${events.length === 1 ? "" : "s"}` : "No tracked activity on this day."}</p>
      </div>
      ${platformCounts.length ? renderPillRow(platformCounts.map((item) => `${item.count} ${item.platform}`)) : ""}
      ${
        events.length
          ? `
            <section class="calendar-events">
              <p class="feature__kicker">Events</p>
              <ul class="calendar-release-list">${eventListMarkup(events)}</ul>
            </section>
          `
          : ""
      }
      ${
        releases.length
          ? `<ul class="calendar-release-list">${releaseListMarkup(releases)}</ul>`
          : events.length
            ? ""
            : `<div class="empty-state"><h3>Quiet day</h3><p>No tracked releases or events are currently recorded for this date.</p></div>`
      }
      ${
        model.undated.length
          ? `
            <section class="calendar-undated">
              <p class="feature__kicker">Still TBD</p>
              <ul class="calendar-release-list">${releaseListMarkup(model.undated)}</ul>
            </section>
          `
          : ""
      }
    `;
  }

  function renderCalendar() {
    const cells = currentCells();
    ensureSelectedDate(cells);
    Array.from(calendarViewToggle.querySelectorAll(".calendar-toggle__button")).forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === view);
    });

    calendarRangeLabel.textContent = view === "week" ? formatWeekLabel(startOfWeek(cursorDate)) : formatMonthLabel(cursorDate);
    calendarGrid.classList.toggle("is-week", view === "week");
    calendarGrid.innerHTML = cells
      .map((cell) => {
        const releases = model.byDate.get(cell.key) || [];
        const events = model.eventsByDate.get(cell.key) || [];
        const density = densityClass(releases.length + events.length, manifest.densityRules);
        const platformCounts = groupedPlatformCounts(releases)
          .slice(0, 2)
          .map((item) => `<span>${escapeHtml(`${item.count} ${item.platform}`)}</span>`)
          .join("");
        const eventLabel = events.length ? `<span>${escapeHtml(`${events.length} event${events.length === 1 ? "" : "s"}`)}</span>` : "";
        return `
          <button
            class="calendar-day ${density} ${cell.outsideMonth ? "is-outside-month" : ""} ${selectedDateKey === cell.key ? "is-selected" : ""}"
            data-date-key="${cell.key}"
            type="button"
          >
            <span class="calendar-day__date">${escapeHtml(
              new Intl.DateTimeFormat([], { month: "short", day: "numeric" }).format(cell.date),
            )}</span>
            <strong class="calendar-day__count">${releases.length + events.length ? `${releases.length + events.length} item${releases.length + events.length === 1 ? "" : "s"}` : "Quiet"}</strong>
            <span class="calendar-day__platforms">${eventLabel}${platformCounts || "&nbsp;"}</span>
          </button>
        `;
      })
      .join("");

    Array.from(calendarGrid.querySelectorAll(".calendar-day")).forEach((button) => {
      button.addEventListener("click", () => {
        selectedDateKey = button.dataset.dateKey;
        renderCalendar();
      });
    });

    renderDetail();
  }

  Array.from(calendarViewToggle.querySelectorAll(".calendar-toggle__button")).forEach((button) => {
    button.addEventListener("click", () => {
      view = button.dataset.view || "month";
      renderCalendar();
    });
  });

  calendarPrevButton.addEventListener("click", () => {
    cursorDate =
      view === "week"
        ? addDays(cursorDate, -7)
        : new Date(cursorDate.getFullYear(), cursorDate.getMonth() - 1, 1);
    renderCalendar();
  });

  calendarNextButton.addEventListener("click", () => {
    cursorDate =
      view === "week"
        ? addDays(cursorDate, 7)
        : new Date(cursorDate.getFullYear(), cursorDate.getMonth() + 1, 1);
    renderCalendar();
  });

  renderCalendar();
}

async function init() {
  initReveal();

  if (page === "home") {
    await initHome();
    return;
  }
  if (page === "game-development") {
    await initKnowledgePage();
    return;
  }
  if (page === "reviews") {
    await initReviewsPage();
    return;
  }
  if (page === "news") {
    await initNewsPage();
    return;
  }
  if (page === "calendar") {
    await initCalendarPage();
  }
}

init().catch((error) => {
  console.error(error);
});

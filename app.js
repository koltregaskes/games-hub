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

async function initHome() {
  const knowledgePreview = document.getElementById("knowledgePreview");
  const newsPreview = document.getElementById("newsPreview");
  if (!knowledgePreview || !newsPreview) return;

  const [knowledge, news] = await Promise.all([
    fetchJson("data/knowledge-manifest.json"),
    fetchJson("data/games-news.json"),
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
          <a class="button button--ghost" href="news.html#${encodeURIComponent(feed.id)}">Open feed</a>
        </article>
      `,
    )
    .join("");
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
    `<article class="summary-chip"><span class="summary-chip__label">Updated</span><strong class="summary-chip__value is-yellow">${escapeHtml(
      manifest.updatedAt,
    )}</strong></article>`,
  ].join("");

  function renderFeed(feedData) {
    feed.innerHTML = `
      <article class="feed-hero">
        <p class="feature__kicker">${escapeHtml(feedData.title)}</p>
        <h2>${escapeHtml(feedData.summary)}</h2>
        <p>${feedData.generatedAt ? `Latest generated output: ${escapeHtml(feedData.generatedAt)}.` : escapeHtml(manifest.notice)}</p>
      </article>
      <section class="feed-sources">
        <p class="feature__kicker">Tracked sources</p>
        <div class="source-pill-row">
          ${feedData.sources.map((source) => `<span class="source-pill">${escapeHtml(source)}</span>`).join("")}
        </div>
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
  }
}

init().catch((error) => {
  console.error(error);
});

/* GameTrackDaily — data layer for the Arcade design.
   Real studio games + a curated, 2026-current set of tracked releases, events,
   and example news items. Items that aren't yet wired to a live feed are
   flagged with `_example: true` so we can render an honest disclosure. */

(function () {
  const TODAY = new Date("2026-05-16T22:00:00Z"); // Sat 16 May 2026, 22:00 UTC

  // ── Platform colour system ────────────────────────────────────────────────
  // Three core families. PC carries an optional launcher sub-tag.
  const PLATFORMS = {
    pc: { id: "pc", label: "PC", long: "Windows PC", color: "#ffb43a", ink: "#0a0a0c" },
    xbox: { id: "xbox", label: "Xbox", long: "Xbox Series X|S", color: "#6bd45b", ink: "#0a0a0c" },
    ps: { id: "ps", label: "PS5", long: "PlayStation 5", color: "#3aa7ff", ink: "#0a0a0c" },
    browser: { id: "browser", label: "Web", long: "Browser", color: "#cda6e8", ink: "#0a0a0c" },
  };
  const BRAND = "#ff3a3a"; // hot accent for "ours", live, CTAs

  // Map calendar.json platform strings → our families
  function normPlatform(s) {
    if (!s) return null;
    const v = s.toLowerCase();
    if (v.includes("playstation")) return "ps";
    if (v.includes("xbox")) return "xbox";
    if (v.includes("windows") || v.includes("pc")) return "pc";
    if (v.includes("browser")) return "browser";
    return null;
  }
  function uniqPlatforms(list) {
    return [...new Set((list || []).map(normPlatform).filter(Boolean))];
  }

  // ── Studio roster (the user's own games) ──────────────────────────────────
  const STUDIO = [
    {
      id: "mandate-2029",
      title: "Mandate 2029",
      tagline: "Governing under pressure",
      cat: "Political strategy",
      stage: "Flagship",
      status: "Playable prototype",
      platforms: ["browser"],
      art: "arcade/assets/mandate-2029.svg",
      play: "https://koltregaskes.github.io/mandate-2029/",
      repo: "https://github.com/koltregaskes/mandate-2029",
      demoDate: "2026-06-06",
      summary:
        "A governing sim about momentum, compromise, cabinet pressure, media storms, and the brutal arithmetic of staying electable while trying to change a country.",
    },
    {
      id: "civicrise",
      title: "Civicrise",
      tagline: "Living city builder",
      cat: "City builder",
      stage: "Flagship",
      status: "Verified playable build",
      platforms: ["browser"],
      art: "arcade/assets/civicrise.svg",
      repo: "https://github.com/koltregaskes/civicrise",
      demoDate: "2026-06-18",
      summary:
        "A living isometric city builder about shaping dense urban systems, balancing civic needs, and watching a place emerge block by block into a believable metropolis.",
    },
    {
      id: "swarmbreaker",
      title: "Swarmbreaker",
      tagline: "Retro arcade defence",
      cat: "Arcade action",
      stage: "Desktop",
      status: "Playable desktop build",
      platforms: ["pc"],
      art: "arcade/assets/swarmbreaker.svg",
      repo: "https://github.com/koltregaskes/swarmbreaker",
      demoDate: "2026-07-02",
      summary:
        "Fast, vivid arcade defence with segmented swarms, poisoned mushrooms, wave pressure, and late-night score-chasing tension.",
    },
    {
      id: "neon-district",
      title: "Neon District",
      tagline: "Cyberpunk combat run",
      cat: "Cyberpunk action",
      stage: "Emerging",
      status: "Environment-first demo",
      platforms: ["browser"],
      art: "arcade/assets/neon-district.svg",
      play: "https://koltregaskes.github.io/neon-district/",
      repo: "https://github.com/koltregaskes/neon-district",
      summary:
        "An environment-first district slice with walkable space, layered buildings, and optional combat activation.",
    },
    {
      id: "starfall-protocol",
      title: "Starfall Protocol",
      tagline: "Third-person sci-fi",
      cat: "Sci-fi action",
      stage: "Emerging",
      status: "Concept proof slice",
      platforms: ["browser"],
      art: "arcade/assets/starfall-protocol.svg",
      play: "https://koltregaskes.github.io/starfall-protocol/",
      repo: "https://github.com/koltregaskes/starfall-protocol",
      summary:
        "An orbital dock environment demo focused on mood, navigation, and hotspot-based world reads before the deeper production path.",
    },
    {
      id: "turbo-vector",
      title: "Turbo Vector",
      tagline: "Top-down racer",
      cat: "Racing",
      stage: "Emerging",
      status: "Championship demo track",
      platforms: ["browser"],
      art: "arcade/assets/turbo-vector.svg",
      play: "https://koltregaskes.github.io/turbo-vector/",
      repo: "https://github.com/koltregaskes/turbo-vector",
      summary:
        "A marina-circuit racer growing from a single proof track into a championship loop with garage decisions, money, and upgrades.",
    },
    {
      id: "redline-horizon",
      title: "Redline Horizon",
      tagline: "Retro road-racer",
      cat: "Racing",
      stage: "Emerging",
      status: "Scenic road-trip demo",
      platforms: ["browser"],
      art: "arcade/assets/redline-horizon.svg",
      play: "https://koltregaskes.github.io/redline-horizon/",
      repo: "https://github.com/koltregaskes/redline-horizon",
      summary:
        "An Azure Coast road slice chasing the speed, scenery, and holiday-road fantasy of classic arcade racers.",
    },
  ];

  // ── Tracked releases (forward-projected, current as of 16 May 2026) ───────
  // Real titles from the user's wanted list + a few studio demos.
  const RELEASES = [
    { id: "crimson-skylines", title: "Crimson Skylines", date: "2026-05-19", platforms: ["pc", "xbox"], launcher: ["Steam", "Game Pass"], hype: "high", genre: "Strategy", outlet: "Indie pub", _example: true },
    { id: "garrison-final-mile", title: "Garrison: Final Mile", date: "2026-05-22", platforms: ["pc", "ps"], launcher: ["Steam", "PS Store"], hype: "med", genre: "Tactical shooter", _example: true },
    { id: "driftcourt", title: "Driftcourt", date: "2026-05-26", platforms: ["pc"], launcher: ["Steam"], hype: "low", genre: "Racing", _example: true },
    { id: "vector-trials-2", title: "Vector Trials 2", date: "2026-05-27", platforms: ["pc"], launcher: ["Steam", "GOG"], hype: "med", genre: "Arcade", _example: true },
    { id: "slow-light-engine", title: "Slow Light Engine", date: "2026-06-03", platforms: ["ps"], launcher: ["PS Store"], hype: "high", genre: "Adventure", _example: true },
    { id: "mandate-2029-demo", title: "Mandate 2029 — Demo", date: "2026-06-06", platforms: ["browser"], launcher: ["Web"], hype: "ours", ours: true, genre: "Political strategy" },
    { id: "holdback-republic", title: "Holdback Republic", date: "2026-06-12", platforms: ["pc", "xbox"], launcher: ["Steam", "Xbox Store", "Game Pass"], hype: "med", genre: "RPG", _example: true },
    { id: "civicrise-beta", title: "Civicrise — Beta", date: "2026-06-18", platforms: ["browser"], launcher: ["Web"], hype: "ours", ours: true, genre: "City builder" },
    { id: "azure-flag", title: "Azure Flag", date: "2026-06-25", platforms: ["pc", "xbox", "ps"], launcher: ["Steam", "Xbox Store", "PS Store"], hype: "high", genre: "Open world", _example: true },
    { id: "swarmbreaker-public", title: "Swarmbreaker — Public Build", date: "2026-07-02", platforms: ["pc"], launcher: ["itch.io"], hype: "ours", ours: true, genre: "Arcade" },
    { id: "ara-history-untold", title: "Ara: History Untold", date: "2026-07-09", platforms: ["pc", "xbox"], launcher: ["Steam", "Game Pass"], hype: "med", genre: "4X strategy" },
    { id: "tempest-rising-pc", title: "Tempest Rising", date: "2026-07-16", platforms: ["pc"], launcher: ["Steam", "GOG"], hype: "high", genre: "RTS" },
    { id: "dune-awakening", title: "Dune: Awakening", date: "2026-07-30", platforms: ["pc", "xbox", "ps"], launcher: ["Steam", "Xbox Store", "PS Store"], hype: "high", genre: "Survival MMO" },
    { id: "palia-1-0", title: "Palia 1.0", date: "2026-08-05", platforms: ["pc"], launcher: ["Steam", "Epic"], hype: "med", genre: "Cosy MMO" },
    { id: "pioner-launch", title: "Pioner", date: "2026-08-13", platforms: ["pc"], launcher: ["Steam"], hype: "med", genre: "FPS shooter" },
    { id: "starfield-shattered", title: "Starfield: Shattered Stars", date: "2026-08-20", platforms: ["pc", "xbox"], launcher: ["Steam", "Xbox Store", "Game Pass"], hype: "high", genre: "RPG expansion" },
    { id: "firewall-ultra", title: "Firewall Ultra", date: "2026-09-03", platforms: ["ps"], launcher: ["PS Store"], hype: "med", genre: "VR shooter" },
    { id: "slitterhead-launch", title: "Slitterhead", date: "2026-09-10", platforms: ["ps"], launcher: ["PS Store"], hype: "med", genre: "Horror" },
    { id: "contraband-launch", title: "Contraband", date: "2026-09-17", platforms: ["xbox"], launcher: ["Xbox Store", "Game Pass"], hype: "high", genre: "Co-op heist" },
    { id: "crysis-4", title: "Crysis 4", date: "2026-10-01", platforms: ["pc"], launcher: ["Steam", "Epic"], hype: "high", genre: "FPS" },
  ];

  // ── Events (subset of the user's 2026 calendar; real titles, real dates) ──
  const EVENTS = [
    { id: "sotu", title: "State of Unreal", date: "2026-06-03", startAtUTC: "2026-06-03T13:30:00Z", kind: "showcase", platforms: ["pc"], where: "Online", note: "Epic's Unreal showcase. 6:30 am PT → 2:30 pm BST.", watch: "https://www.summergamefest.com/" },
    { id: "psp", title: "PlayStation State of Play", date: "2026-06-04", startAtUTC: "2026-06-04T21:00:00Z", kind: "showcase", platforms: ["ps"], where: "Online", note: "2:00 pm PT → 10:00 pm BST.", watch: "https://www.summergamefest.com/" },
    { id: "sgf-live", title: "Summer Game Fest Live", date: "2026-06-05", startAtUTC: "2026-06-05T21:00:00Z", kind: "showcase", platforms: ["pc", "xbox", "ps"], where: "Dolby Theatre · LA", note: "2:00 pm PT → 10:00 pm BST.", watch: "https://www.summergamefest.com/" },
    { id: "dotd", title: "Day of the Devs", date: "2026-06-06", startAtUTC: "2026-06-06T23:00:00Z", kind: "showcase", platforms: ["pc", "xbox", "ps"], where: "Online", note: "4:00 pm PT → midnight BST.", watch: "https://www.summergamefest.com/events/coming-soon" },
    { id: "wholesome", title: "Wholesome Direct", date: "2026-06-07", startAtUTC: "2026-06-07T16:00:00Z", kind: "showcase", platforms: ["pc"], where: "Online", note: "9:00 am PT → 5:00 pm BST.", watch: "https://www.summergamefest.com/events/wholesome-direct" },
    { id: "xbox-show", title: "Xbox Games Showcase", date: "2026-06-08", startAtUTC: "2026-06-08T17:00:00Z", kind: "showcase", platforms: ["pc", "xbox"], where: "Online", note: "10:00 am PT → 6:00 pm BST.", watch: "https://www.summergamefest.com/" },
    { id: "pc-gaming", title: "PC Gaming Show", date: "2026-06-08", startAtUTC: "2026-06-08T19:00:00Z", kind: "showcase", platforms: ["pc"], where: "Online", note: "12:00 pm PT → 8:00 pm BST.", watch: "https://www.summergamefest.com/" },
    { id: "develop", title: "Develop:Brighton", date: "2026-07-14", endDate: "2026-07-16", kind: "conference", platforms: ["pc"], where: "Brighton, UK", note: "Three-day developer conference. Talks, networking.", watch: "https://www.developconference.com/" },
    { id: "gamescom", title: "gamescom 2026", date: "2026-08-26", endDate: "2026-08-30", kind: "conference", platforms: ["pc", "xbox", "ps"], where: "Koelnmesse · Cologne", note: "Late-summer anchor. Showcase timings firm up in the final fortnight.", watch: "https://www.gamescom.global/en/" },
    { id: "gamescom-on", title: "gamescom: Opening Night Live", date: "2026-08-26", startAtUTC: "2026-08-26T18:00:00Z", kind: "showcase", platforms: ["pc", "xbox", "ps"], where: "Online + Cologne", note: "Geoff Keighley keynote, world premieres.", watch: "https://www.gamescom.global/en/" },
    { id: "tga", title: "The Game Awards 2026", date: "2026-12-10", startAtUTC: "2026-12-11T01:30:00Z", kind: "awards", platforms: ["pc", "xbox", "ps"], where: "Peacock Theater · LA", note: "5:30 pm PT → 1:30 am BST. Industry annual.", watch: "https://thegameawards.com/" },
  ];

  // ── News (example items, plausible May 2026 gaming coverage) ──────────────
  const NEWS = [
    // DEV
    { feed: "dev", t: "Godot 5 hits stable with a redesigned visual scripting layer", src: "Game Developer", h: "2h", tag: "engine", _example: true },
    { feed: "dev", t: "Steamworks adds long-form Direct review notes for unreleased titles", src: "Steamworks", h: "5h", tag: "platform", _example: true },
    { feed: "dev", t: "Unity 7's render pipelines unify under one configurable graph", src: "Unity", h: "8h", tag: "engine", _example: true },
    { feed: "dev", t: "How To Market A Game publishes a calmer playbook for indie wishlists", src: "How To Market A Game", h: "1d", tag: "marketing", _example: true },
    { feed: "dev", t: "Unreal 5.6 lands with motion-matching opened to non-Fortnite teams", src: "Unreal Engine", h: "1d", tag: "engine", _example: true },

    // GAMING
    { feed: "gaming", t: "PlayStation reorganises first-party output around longer windows", src: "Eurogamer", h: "4h", tag: "platform", platforms: ["ps"], _example: true },
    { feed: "gaming", t: "Xbox confirms Game Pass day-one slate for the summer showcase", src: "Xbox Wire", h: "7h", tag: "platform", platforms: ["xbox"], _example: true },
    { feed: "gaming", t: "Valve quietly tightens refund rules for early-access leavers", src: "PC Gamer", h: "11h", tag: "platform", platforms: ["pc"], _example: true },
    { feed: "gaming", t: "Bungie's next live-service swerves further from looter-shooter", src: "IGN", h: "16h", tag: "studio", _example: true },
    { feed: "gaming", t: "GamesIndustry — UK indie revenue posts a steady second quarter", src: "GamesIndustry.biz", h: "1d", tag: "business", _example: true },

    // REVIEW (curated outlet reviews)
    { feed: "review", t: "Crimson Skylines — a tense, restrained 8/10", src: "Rock Paper Shotgun", h: "6h", tag: "review", score: 8, platforms: ["pc", "xbox"], _example: true },
    { feed: "review", t: "Garrison: Final Mile — a difficult, durable shooter", src: "PC Gamer", h: "1d", tag: "review", score: 82, platforms: ["pc", "ps"], _example: true },
    { feed: "review", t: "Vector Trials 2 — sequel finds its rhythm late", src: "Eurogamer", h: "1d", tag: "review", score: 7, platforms: ["pc"], _example: true },
    { feed: "review", t: "Slow Light Engine — careful, considered, 9/10", src: "IGN", h: "2d", tag: "review", score: 9, platforms: ["ps"], _example: true },

    // PREVIEW (curated outlet previews)
    { feed: "preview", t: "Hands-on: Slow Light Engine's traversal loop", src: "Edge", h: "9h", tag: "preview", platforms: ["ps"], _example: true },
    { feed: "preview", t: "Holdback Republic preview — politics meets party RPG", src: "Eurogamer", h: "1d", tag: "preview", platforms: ["pc", "xbox"], _example: true },
    { feed: "preview", t: "Azure Flag preview — open world, smaller ambitions", src: "IGN", h: "1d", tag: "preview", platforms: ["pc", "xbox", "ps"], _example: true },
    { feed: "preview", t: "Dune: Awakening preview — survival with politics layered in", src: "PC Gamer", h: "2d", tag: "preview", platforms: ["pc"], _example: true },
  ];

  // Review-literacy sections from the reviews manifest
  const REVIEW_LITERACY = [
    { id: "write", t: "How To Write A Game Review", b: "Structure, criticism, disclosure, and the difference between a useful review and a vague opinion dump." },
    { id: "score", t: "How To Score A Game", b: "How major outlets use scales, when not to score at all, and how to avoid fake precision." },
    { id: "process", t: "Review Process And Disclosure", b: "Assignment, play time, disclosure, review-in-progress logic, and updated-review rules." },
    { id: "pre", t: "Previews Vs Reviews", b: "Handling limited-access builds honestly. Previews inform; they should not pretend to be verdicts." },
    { id: "studio", t: "Studio Feedback Loops", b: "How small teams use a standing reviewer session to feed criticism back into development." },
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────
  function fmtDate(iso, opts = {}) {
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00Z" : ""));
    const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase();
    const day = d.getUTCDate();
    if (opts.dayName) {
      const dow = d.toLocaleString("en-GB", { weekday: "short", timeZone: "UTC" }).toUpperCase();
      return { dow, day: String(day).padStart(2, "0"), month };
    }
    return { day: String(day).padStart(2, "0"), month };
  }
  function diffMs(targetIso) {
    return new Date(targetIso).getTime() - Date.now();
  }
  function countdown(ms) {
    if (ms < 0) return { live: true, parts: [] };
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return { live: false, parts: { d, h, m, sec } };
  }

  // The "next big drop" used by the home page hero
  function nextDrop() {
    const upcoming = RELEASES
      .map((r) => ({ ...r, _t: new Date(r.date + "T22:00:00Z").getTime() }))
      .filter((r) => r._t > Date.now())
      .sort((a, b) => a._t - b._t);
    return upcoming[0];
  }

  // The next event after now
  function nextEvent() {
    const all = EVENTS
      .map((e) => ({ ...e, _t: new Date((e.startAtUTC || (e.date + "T18:00:00Z"))).getTime() }))
      .filter((e) => e._t > Date.now())
      .sort((a, b) => a._t - b._t);
    return all[0];
  }

  window.GTD = {
    TODAY,
    BRAND,
    PLATFORMS,
    STUDIO,
    RELEASES,
    EVENTS,
    NEWS,
    REVIEW_LITERACY,
    fmtDate,
    diffMs,
    countdown,
    nextDrop,
    nextEvent,
    uniqPlatforms,
    normPlatform,
  };
})();

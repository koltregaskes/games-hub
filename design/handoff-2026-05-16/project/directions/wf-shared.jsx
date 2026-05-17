/* Shared wireframe primitives. Sketchy/architectural vibe — dashed strokes,
   hatch-fill placeholders, handwritten annotations. Each direction picks its
   own accent color via CSS custom property --acc on its root. */

const WF = {};

// Hatch-fill image placeholder. Optional X across.
WF.Box = function Box({ label, h = 120, x = false, fill = "hatch", style = {}, children, dashed = true, tone = "ink" }) {
  const bgMap = {
    hatch: "repeating-linear-gradient(45deg, var(--wf-line) 0 1px, transparent 1px 9px)",
    dot: "radial-gradient(circle at 1px 1px, var(--wf-line) 1px, transparent 1.4px) 0 0 / 10px 10px",
    none: "transparent",
    solid: "var(--wf-fill)",
  };
  return (
    <div
      style={{
        position: "relative",
        border: `${dashed ? "1.5px dashed" : "1.5px solid"} var(--wf-stroke)`,
        background: bgMap[fill] || bgMap.hatch,
        borderRadius: 4,
        minHeight: h,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--wf-stroke)",
        fontFamily: "'Caveat', cursive",
        fontSize: 18,
        ...style,
      }}
    >
      {x && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, opacity: 0.45 }}
        >
          <line x1="0" y1="0" x2="100" y2="100" stroke="var(--wf-stroke)" strokeWidth="0.4" strokeDasharray="1 1.5" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="var(--wf-stroke)" strokeWidth="0.4" strokeDasharray="1 1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {label && <span style={{ position: "relative", opacity: 0.85 }}>{label}</span>}
      {children}
    </div>
  );
};

// Wavy/horizontal line stack — text placeholder
WF.Lines = function Lines({ count = 3, widths = ["100%", "92%", "76%"], gap = 8, height = 6, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            width: widths[i % widths.length],
            background: "var(--wf-line)",
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
};

// Tag / pill / chip placeholder
WF.Tag = function Tag({ children, kind = "default", style = {} }) {
  const map = {
    default: { bg: "transparent", bd: "var(--wf-stroke)", fg: "var(--wf-stroke)" },
    accent: { bg: "color-mix(in oklab, var(--acc) 18%, transparent)", bd: "var(--acc)", fg: "var(--acc)" },
    solid: { bg: "var(--wf-stroke)", bd: "var(--wf-stroke)", fg: "var(--wf-paper)" },
  };
  const c = map[kind] || map.default;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        border: `1px solid ${c.bd}`,
        background: c.bg,
        color: c.fg,
        borderRadius: 999,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// Handwritten annotation with optional arrow
WF.Note = function Note({ children, style = {}, arrow = null, color }) {
  const ang = { l: 180, r: 0, u: -90, d: 90 }[arrow] ?? null;
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'Caveat', cursive",
        fontSize: 17,
        lineHeight: 1.05,
        color: color || "var(--acc)",
        ...style,
      }}
    >
      {arrow === "l" && <Arrow dir="l" />}
      <span>{children}</span>
      {arrow === "r" && <Arrow dir="r" />}
      {arrow === "u" && <Arrow dir="u" />}
      {arrow === "d" && <Arrow dir="d" />}
    </div>
  );
};

function Arrow({ dir }) {
  const paths = {
    l: "M22 6 C 14 6, 6 8, 2 12 L 6 8 M 2 12 L 6 16",
    r: "M2 6 C 10 6, 18 8, 22 12 L 18 8 M 22 12 L 18 16",
    u: "M6 22 C 6 14, 8 6, 12 2 L 8 6 M 12 2 L 16 6",
    d: "M6 2 C 6 10, 8 18, 12 22 L 8 18 M 12 22 L 16 18",
  };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" style={{ overflow: "visible" }}>
      <path d={paths[dir]} stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Squiggly underline (for headings)
WF.Squiggle = function Squiggle({ width = 200, color }) {
  return (
    <svg width={width} height="10" viewBox={`0 0 ${width} 10`} style={{ display: "block" }}>
      <path
        d={`M 2 5 Q ${width * 0.1} 0, ${width * 0.2} 5 T ${width * 0.4} 5 T ${width * 0.6} 5 T ${width * 0.8} 5 T ${width - 2} 5`}
        stroke={color || "var(--acc)"}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

// Hand-drawn-feel section heading
WF.Head = function Head({ eyebrow, title, style = {}, level = 2 }) {
  const sizes = { 1: 36, 2: 26, 3: 20 };
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {eyebrow && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--wf-muted)",
            marginBottom: 6,
          }}
        >
          {eyebrow}
        </div>
      )}
      <div
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: sizes[level] || 26,
          fontWeight: 600,
          color: "var(--wf-stroke)",
          lineHeight: 1.05,
        }}
      >
        {title}
      </div>
    </div>
  );
};

// Artboard wrapper — provides the wireframe paper background + theme
WF.Sheet = function Sheet({ children, theme = "dark", accent = "#d7a16f", style = {} }) {
  const themes = {
    dark: {
      "--wf-paper": "#0c0d10",
      "--wf-stroke": "rgba(244,239,231,0.78)",
      "--wf-muted": "rgba(244,239,231,0.5)",
      "--wf-line": "rgba(244,239,231,0.18)",
      "--wf-fill": "rgba(244,239,231,0.04)",
      "--acc": accent,
    },
    light: {
      "--wf-paper": "#f6f3ec",
      "--wf-stroke": "rgba(20,20,24,0.82)",
      "--wf-muted": "rgba(20,20,24,0.55)",
      "--wf-line": "rgba(20,20,24,0.22)",
      "--wf-fill": "rgba(20,20,24,0.05)",
      "--acc": accent,
    },
  };
  return (
    <div
      style={{
        ...themes[theme],
        background: "var(--wf-paper)",
        color: "var(--wf-stroke)",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      {/* faint grid paper texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(var(--wf-line) 1px, transparent 1px) 0 0 / 100% 28px, linear-gradient(90deg, var(--wf-line) 1px, transparent 1px) 0 0 / 28px 100%",
          opacity: 0.18,
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.15))",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};

// Margin notes / numbered callouts down a side
WF.Callouts = function Callouts({ items = [], side = "right", top = 24, style = {} }) {
  return (
    <div
      style={{
        position: "absolute",
        [side]: -180,
        top,
        width: 160,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        ...style,
      }}
    >
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              flex: "0 0 22px",
              height: 22,
              borderRadius: 999,
              border: "1.5px solid var(--acc)",
              color: "var(--acc)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              display: "grid",
              placeItems: "center",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, lineHeight: 1.1, color: "var(--wf-stroke)" }}>{it}</div>
        </div>
      ))}
    </div>
  );
};

// Top masthead with brand + nav, used loosely across directions
WF.Mast = function Mast({ brand = "GameTrackDaily", nav = ["Games", "Releases", "Events", "News", "Reviews"], style = {} }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 22px",
        border: "1.5px dashed var(--wf-stroke)",
        borderRadius: 4,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            border: "1.5px solid var(--wf-stroke)",
            borderRadius: 4,
            display: "grid",
            placeItems: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
        >
          GT
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>
          {brand}
        </span>
      </div>
      <div style={{ display: "flex", gap: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--wf-muted)" }}>
        {nav.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  );
};

// Tiny SVG "polaroid" of a game — abstract poster placeholder
WF.Poster = function Poster({ kind = "racer", w = "100%", h = 120, label }) {
  const Inner = {
    racer: (
      <>
        <rect x="6" y="6" width="88" height="68" fill="none" stroke="var(--wf-stroke)" strokeWidth="0.5" />
        <path d="M 10 60 L 90 60 M 14 50 L 86 50 M 22 40 L 78 40 M 32 30 L 68 30" stroke="var(--wf-stroke)" strokeWidth="0.4" />
        <circle cx="50" cy="62" r="3" fill="var(--acc)" />
      </>
    ),
    city: (
      <>
        <rect x="6" y="44" width="14" height="32" fill="var(--wf-fill)" stroke="var(--wf-stroke)" strokeWidth="0.5" />
        <rect x="22" y="30" width="18" height="46" fill="var(--wf-fill)" stroke="var(--wf-stroke)" strokeWidth="0.5" />
        <rect x="42" y="20" width="22" height="56" fill="var(--wf-fill)" stroke="var(--wf-stroke)" strokeWidth="0.5" />
        <rect x="66" y="36" width="16" height="40" fill="var(--wf-fill)" stroke="var(--wf-stroke)" strokeWidth="0.5" />
        <line x1="0" y1="76" x2="100" y2="76" stroke="var(--acc)" strokeWidth="0.6" />
      </>
    ),
    neon: (
      <>
        <rect x="0" y="0" width="100" height="80" fill="var(--wf-fill)" />
        <path d="M 0 60 L 100 60 M 0 50 L 100 50 M 0 40 L 100 40" stroke="var(--wf-stroke)" strokeWidth="0.3" />
        <rect x="20" y="20" width="6" height="40" fill="var(--acc)" opacity="0.7" />
        <rect x="40" y="14" width="6" height="46" fill="var(--acc)" opacity="0.6" />
        <rect x="60" y="22" width="6" height="38" fill="var(--acc)" opacity="0.7" />
        <rect x="80" y="16" width="6" height="44" fill="var(--acc)" opacity="0.5" />
      </>
    ),
    swarm: (
      <>
        {Array.from({ length: 18 }).map((_, i) => {
          const x = (i % 6) * 16 + 6;
          const y = Math.floor(i / 6) * 20 + 14;
          return <circle key={i} cx={x} cy={y} r="3" fill="none" stroke="var(--wf-stroke)" strokeWidth="0.6" />;
        })}
        <rect x="44" y="68" width="12" height="6" fill="var(--acc)" />
      </>
    ),
    strategy: (
      <>
        <rect x="6" y="6" width="88" height="68" fill="none" stroke="var(--wf-stroke)" strokeWidth="0.5" strokeDasharray="2 2" />
        <text x="50" y="38" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="14" fill="var(--wf-stroke)">53.4%</text>
        <rect x="14" y="50" width="20" height="14" fill="var(--acc)" opacity="0.7" />
        <rect x="40" y="46" width="20" height="18" fill="var(--wf-stroke)" opacity="0.5" />
        <rect x="66" y="54" width="20" height="10" fill="var(--acc)" opacity="0.4" />
      </>
    ),
    space: (
      <>
        <circle cx="70" cy="30" r="14" fill="none" stroke="var(--wf-stroke)" strokeWidth="0.5" />
        <circle cx="70" cy="30" r="22" fill="none" stroke="var(--wf-stroke)" strokeWidth="0.3" />
        <circle cx="20" cy="60" r="1" fill="var(--wf-stroke)" />
        <circle cx="30" cy="20" r="1" fill="var(--wf-stroke)" />
        <circle cx="48" cy="50" r="1" fill="var(--wf-stroke)" />
        <circle cx="86" cy="64" r="1" fill="var(--wf-stroke)" />
        <line x1="0" y1="78" x2="100" y2="78" stroke="var(--acc)" strokeWidth="0.6" />
      </>
    ),
  };
  return (
    <div style={{ position: "relative", width: w, height: h, border: "1.5px solid var(--wf-stroke)", borderRadius: 4, overflow: "hidden", background: "var(--wf-fill)" }}>
      <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {Inner[kind] || Inner.racer}
      </svg>
      {label && (
        <span
          style={{
            position: "absolute",
            left: 8,
            bottom: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--wf-stroke)",
            background: "var(--wf-paper)",
            padding: "2px 5px",
            borderRadius: 2,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

// Game roster used across directions so the wireframes share content
WF.GAMES = [
  { id: "mandate-2029", t: "Mandate 2029", cat: "Political strategy", k: "strategy", stage: "Flagship", status: "Playable" },
  { id: "civicrise", t: "Civicrise", cat: "City builder", k: "city", stage: "Flagship", status: "Verified build" },
  { id: "swarmbreaker", t: "Swarmbreaker", cat: "Arcade defence", k: "swarm", stage: "Desktop", status: "Playable" },
  { id: "neon-district", t: "Neon District", cat: "Cyberpunk action", k: "neon", stage: "Emerging", status: "Demo slice" },
  { id: "starfall-protocol", t: "Starfall Protocol", cat: "Sci-fi action", k: "space", stage: "Emerging", status: "Concept proof" },
  { id: "turbo-vector", t: "Turbo Vector", cat: "Top-down racer", k: "racer", stage: "Emerging", status: "Demo track" },
  { id: "redline-horizon", t: "Redline Horizon", cat: "Retro racer", k: "racer", stage: "Emerging", status: "Road-trip demo" },
];

WF.RELEASES = [
  { d: "May 19", t: "Crimson Skylines", p: "PC · Xbox", flag: "TODAY" },
  { d: "May 22", t: "Garrison: Final Mile", p: "PC · PS5" },
  { d: "May 27", t: "Vector Trials 2", p: "PC" },
  { d: "Jun 03", t: "Slow Light Engine", p: "PS5" },
  { d: "Jun 06", t: "Mandate 2029 — Demo", p: "Browser", flag: "OURS" },
  { d: "Jun 12", t: "Holdback Republic", p: "PC · Xbox" },
  { d: "Jun 18", t: "Civicrise — Beta", p: "Browser", flag: "OURS" },
];

WF.EVENTS = [
  { d: "Jun 03", t: "State of Unreal", tag: "Showcase" },
  { d: "Jun 06", t: "Summer Game Fest", tag: "Showcase" },
  { d: "Jun 09", t: "Xbox Games Showcase", tag: "Showcase" },
  { d: "Jul 14", t: "Develop:Brighton", tag: "Conference" },
  { d: "Aug 19", t: "Gamescom 2026", tag: "Conference" },
];

WF.NEWS = [
  { feed: "DEV", t: "Godot 5 hits stable with new visual scripting layer", src: "Game Developer", h: "2h" },
  { feed: "GAMING", t: "PlayStation re-organises first-party studio output", src: "Eurogamer", h: "4h" },
  { feed: "REVIEW", t: "Crimson Skylines lands a tense, restrained 8/10", src: "RPS", h: "6h" },
  { feed: "PREVIEW", t: "Hands-on with Slow Light Engine's traversal loop", src: "Edge", h: "9h" },
  { feed: "DEV", t: "Steam Direct fee waiver extended through autumn", src: "GamesIndustry", h: "12h" },
  { feed: "REVIEW", t: "Garrison: Final Mile — a difficult, durable shooter", src: "PC Gamer", h: "1d" },
];

window.WF = WF;

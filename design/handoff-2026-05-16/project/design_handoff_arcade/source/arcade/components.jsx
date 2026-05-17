/* GameTrackDaily — shared UI components for the Arcade design.
   All components are attached to window so other JSX files can use them. */

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ── Nav + brand ────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "releases", label: "Releases" },
  { id: "events", label: "Events" },
  { id: "news", label: "News" },
  { id: "reviews", label: "Reviews" },
];

function Nav({ route, onNavigate }) {
  return (
    <header className="nav">
      <a
        href="#/home"
        className="nav__brand"
        onClick={(e) => { e.preventDefault(); onNavigate("home"); }}
      >
        GAME<span className="slash">/</span>TRACK<span className="slash">/</span>DAILY
      </a>
      <div className="nav__links">
        {NAV_LINKS.slice(1).map((l) => (
          <a
            key={l.id}
            href={`#/${l.id}`}
            className="nav__link"
            aria-current={route === l.id ? "page" : undefined}
            onClick={(e) => { e.preventDefault(); onNavigate(l.id); }}
          >
            {l.label}
          </a>
        ))}
      </div>
      <div className="nav__live">LIVE · 22:14 BST</div>
    </header>
  );
}

// ── Marquees ───────────────────────────────────────────────────────────────
function Marquee({ items, kind = "default" }) {
  // Duplicate the list so the loop is seamless when translating by -50%
  const doubled = [...items, ...items];
  return (
    <div className={`marquee ${kind === "brand" ? "marquee--brand" : ""}`}>
      <div className="marquee__track" aria-hidden>
        {doubled.map((it, i) => (
          <React.Fragment key={i}>
            <span>{it}</span>
            <span className="dot">★</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Platform chip + launcher tag ──────────────────────────────────────────
function PlatformPill({ id, boxed = false, short = false }) {
  const p = window.GTD.PLATFORMS[id];
  if (!p) return null;
  return (
    <span className={`pf pf--${id} ${boxed ? "boxed" : ""}`}>
      <span className="pf-dot" />
      {short ? p.label : p.long}
    </span>
  );
}

function PlatformRow({ ids = [], boxed = true, short = true }) {
  if (!ids.length) return null;
  return (
    <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
      {ids.map((id) => (
        <PlatformPill key={id} id={id} boxed={boxed} short={short} />
      ))}
    </span>
  );
}

function LauncherList({ launchers = [] }) {
  if (!launchers.length) return null;
  return (
    <span className="launcher">
      {launchers.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span style={{ opacity: 0.4 }}>·</span>}
          <span>{l}</span>
        </React.Fragment>
      ))}
    </span>
  );
}

// ── Live countdown that ticks every second ───────────────────────────────
function Countdown({ targetUtcIso, big = false, compact = false }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = new Date(targetUtcIso).getTime() - now;
  if (ms < 0) {
    return (
      <div className="bignum" style={{ fontSize: big ? 96 : 22, color: "var(--brand)", textTransform: "uppercase" }}>
        LIVE NOW
      </div>
    );
  }
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (compact) {
    return (
      <span className="bignum" style={{ fontSize: 18, color: "var(--brand)" }}>
        T-{pad(d)}d {pad(h)}h {pad(m)}m
      </span>
    );
  }
  if (big) {
    return (
      <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4, lineHeight: 0.85 }}>
        <span className="bignum" style={{ fontSize: 180 }}>{pad(d)}</span>
        <span className="bignum" style={{ fontSize: 56, color: "var(--brand)" }}>d</span>
        <span className="bignum" style={{ fontSize: 180 }}>{pad(h)}</span>
        <span className="bignum" style={{ fontSize: 56, color: "var(--brand)" }}>h</span>
        <span className="bignum" style={{ fontSize: 180 }}>{pad(m)}</span>
        <span className="bignum" style={{ fontSize: 56, color: "var(--brand)" }}>m</span>
        <span className="bignum" style={{ fontSize: 90, color: "var(--ink-3)" }}>{pad(sec)}</span>
        <span className="bignum" style={{ fontSize: 32, color: "var(--ink-3)" }}>s</span>
      </div>
    );
  }
  return (
    <span className="bignum" style={{ fontSize: 28 }}>
      <span style={{ color: "var(--brand)" }}>T—</span>{pad(d)}<span style={{ color: "var(--ink-3)", fontSize: 18 }}>d </span>
      {pad(h)}<span style={{ color: "var(--ink-3)", fontSize: 18 }}>h </span>
      {pad(m)}<span style={{ color: "var(--ink-3)", fontSize: 18 }}>m</span>
    </span>
  );
}

// ── Game art tile — uses real SVG screenshot file when present ────────────
function GameArt({ src, height = 200, label, accent = "var(--brand)" }) {
  return (
    <div
      style={{
        position: "relative",
        height,
        width: "100%",
        overflow: "hidden",
        background: "var(--bg-3)",
        borderBottom: "2px solid var(--ink)",
      }}
    >
      {src ? (
        <img src={src} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.05) contrast(1.05) brightness(1.04)" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--ink-3)" }}>—</div>
      )}
      {/* Bottom gradient + label */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(8,9,12,0.5))" }} />
      {label && (
        <span
          className="bignum"
          style={{
            position: "absolute", left: 14, bottom: 12,
            fontSize: 11, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "var(--ink)",
            background: accent, padding: "4px 8px",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ── Section head ─────────────────────────────────────────────────────────
function SectionHead({ no, title, meta }) {
  return (
    <div className="section-head">
      <span className="section-head__no">{no}</span>
      <h2 className="section-head__title">{title}</h2>
      {meta && <div className="section-head__meta">{meta}</div>}
    </div>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <p>
        GameTrackDaily — a curated games tracking site for Windows PC, Xbox, and PlayStation. Built as an editorial watch desk, not a feed firehose.
      </p>
      <p style={{ textAlign: "right" }}>© 2026 KOL TREGASKES</p>
    </footer>
  );
}

// ── Date pill (the small DD/MON block used on release rows) ──────────────
function DateBlock({ iso, accent = "var(--brand)" }) {
  const { day, month } = window.GTD.fmtDate(iso);
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minWidth: 76, padding: "10px 0",
        border: "2px solid var(--ink)",
        background: "var(--bg-2)",
      }}
    >
      <span className="bignum" style={{ fontSize: 32, lineHeight: 1 }}>{day}</span>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.18em", color: accent, marginTop: 4 }}>{month}</span>
    </div>
  );
}

// ── Score stamp ──────────────────────────────────────────────────────────
function ScoreStamp({ score, size = 60 }) {
  // Normalise to /10 (some entries are /100 e.g. 82)
  const out = score > 10 ? Math.round(score / 10) : score;
  return (
    <div
      style={{
        width: size, height: size,
        display: "grid", placeItems: "center",
        border: "2px solid var(--brand)",
        background: "var(--bg)",
        position: "relative",
        transform: "rotate(-4deg)",
      }}
    >
      <span className="bignum" style={{ fontSize: size * 0.55, color: "var(--brand)" }}>{out}</span>
      <span style={{ position: "absolute", bottom: 4, right: 6, fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-3)", letterSpacing: "0.18em" }}>/10</span>
    </div>
  );
}

Object.assign(window, {
  Nav, Marquee, PlatformPill, PlatformRow, LauncherList, Countdown,
  GameArt, SectionHead, Footer, DateBlock, ScoreStamp, NAV_LINKS,
});

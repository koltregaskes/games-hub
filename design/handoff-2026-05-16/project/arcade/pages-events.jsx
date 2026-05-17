/* Events page — countdowns to the major 2026 events, grouped by season. */

function EventsPage({ onNavigate }) {
  const G = window.GTD;
  const events = G.EVENTS
    .map((e) => ({
      ...e,
      _start: new Date(e.startAtUTC || (e.date + "T18:00:00Z")).getTime(),
      _live: false,
    }))
    .sort((a, b) => a._start - b._start);

  const next = events.find((e) => e._start > Date.now()) || events[0];

  // Group: Summer Game Fest week, July, Aug/Gamescom, Q4
  const sgfWeek = events.filter((e) => {
    const d = new Date(e.date);
    return d >= new Date("2026-06-03") && d <= new Date("2026-06-08");
  });
  const summer = events.filter((e) => {
    const d = new Date(e.date);
    return d >= new Date("2026-07-01") && d <= new Date("2026-07-31");
  });
  const lateSummer = events.filter((e) => {
    const d = new Date(e.date);
    return d >= new Date("2026-08-01") && d <= new Date("2026-09-30");
  });
  const winter = events.filter((e) => {
    const d = new Date(e.date);
    return d >= new Date("2026-10-01");
  });

  return (
    <main className="rise">
      {/* Hero */}
      <section className="shell" style={{ paddingTop: 40 }}>
        <div className="eyebrow"><span className="acc">// 02</span> Events watch desk · 2026</div>
        <h1 className="display" style={{ fontSize: "clamp(3.4rem, 8vw, 6.4rem)", margin: "10px 0 0" }}>
          Showcases,<br />
          conferences,<br />
          <span className="acc">awards.</span>
        </h1>

        {/* Next event countdown bar */}
        {next && (
          <div className="card" style={{ marginTop: 32, display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", padding: 0 }}>
            <div style={{ padding: "26px 28px", background: "var(--brand)", color: "#0a0a0c", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 140 }}>
              <span className="bignum" style={{ fontSize: 48, lineHeight: 0.85 }}>{window.GTD.fmtDate(next.date).day}</span>
              <span style={{ fontFamily: "var(--mono)", fontWeight: 800, fontSize: 12, letterSpacing: "0.22em", marginTop: 6 }}>{window.GTD.fmtDate(next.date).month}</span>
            </div>
            <div style={{ padding: "20px 28px", borderLeft: "2px solid var(--ink)" }}>
              <div className="eyebrow"><span className="acc">●</span> Next event · T-minus</div>
              <div className="display glitch" style={{ fontSize: 38, marginTop: 6 }}>{next.title}</div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
                <Countdown targetUtcIso={next.startAtUTC || (next.date + "T18:00:00Z")} />
                <PlatformRow ids={next.platforms} boxed short />
              </div>
            </div>
            <div style={{ padding: "26px 28px", borderLeft: "2px solid var(--ink)" }}>
              <a href={next.watch} target="_blank" rel="noreferrer" className="btn btn--brand">
                Watch event <span className="arrow">→</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Summer Game Fest week — featured */}
      {sgfWeek.length > 0 && (
        <section className="shell" style={{ marginTop: 56 }}>
          <SectionHead
            no="// 03"
            title={<>Summer Game Fest <span className="acc">·</span> 03 — 08 Jun</>}
            meta={<span className="tag">{sgfWeek.length} EVENTS · 6 DAYS</span>}
          />
          <div className="cols-3 rise-stagger">
            {sgfWeek.slice(0, 6).map((e, i) => (
              <EventCard key={e.id} event={e} variant="full" colIndex={i} />
            ))}
          </div>
          {sgfWeek.length > 6 && (
            <div style={{ marginTop: -2, borderLeft: "2px solid var(--ink)", borderRight: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)" }}>
              <div className="row-grid" style={{ border: "none" }}>
                {sgfWeek.slice(6).map((e) => (
                  <EventRow key={e.id} event={e} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Summer */}
      {summer.length > 0 && (
        <section className="shell" style={{ marginTop: 56 }}>
          <SectionHead no="// 04" title="July · Develop season" />
          <div className="row-grid">
            {summer.map((e) => <EventRow key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {/* Late summer — Gamescom */}
      {lateSummer.length > 0 && (
        <section className="shell" style={{ marginTop: 56 }}>
          <SectionHead
            no="// 05"
            title={<>Gamescom <span className="acc">·</span> Cologne</>}
            meta={<span className="tag">{lateSummer.length} EVENTS</span>}
          />
          <div className="cols-2 rise-stagger">
            {lateSummer.map((e, i) => (
              <EventCard key={e.id} event={e} variant="medium" colIndex={i} />
            ))}
          </div>
        </section>
      )}

      {/* Q4 — Awards season */}
      {winter.length > 0 && (
        <section className="shell" style={{ marginTop: 56 }}>
          <SectionHead no="// 06" title="Awards season" />
          <div className="row-grid">
            {winter.map((e) => <EventRow key={e.id} event={e} />)}
          </div>
        </section>
      )}

      <div style={{ marginTop: 56 }}>
        <Marquee items={[
          "EVENTS WATCH DESK",
          "LOCAL BST TIMES",
          "OFFICIAL WATCH LINKS ONLY",
          "REFRESHED WEEKLY · INTENSIFY 14D BEFORE",
        ]} />
      </div>
    </main>
  );
}

function EventCard({ event, variant = "full", colIndex = 0 }) {
  const G = window.GTD;
  const isPast = event._start < Date.now();
  const isLive = !isPast && event._start < Date.now() + 30 * 60 * 1000;
  const primaryColor = G.PLATFORMS[event.platforms[0]]?.color || "var(--ink)";
  const isRowStart = colIndex % (variant === "full" ? 3 : 2) === 0;
  const isNewRow = colIndex >= (variant === "full" ? 3 : 2);
  return (
    <div style={{
      padding: variant === "full" ? "24px 24px 22px" : "26px 28px 24px",
      borderLeft: !isRowStart ? "2px solid var(--ink)" : "none",
      borderTop: isNewRow ? "2px solid var(--ink)" : "none",
      position: "relative",
      minHeight: variant === "full" ? 240 : 210,
      display: "flex",
      flexDirection: "column",
      background: isLive ? "color-mix(in oklab, var(--brand) 14%, transparent)" : "transparent",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: primaryColor }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span className="bignum" style={{ fontSize: 44, color: primaryColor, lineHeight: 0.85 }}>{window.GTD.fmtDate(event.date).day}</span>
          <span className="eyebrow">{window.GTD.fmtDate(event.date).month}</span>
        </div>
        {isLive ? <span className="tag live">LIVE</span> : <span className="tag">{event.kind.toUpperCase()}</span>}
      </div>
      <div className="display glitch" style={{ fontSize: variant === "full" ? 30 : 34, lineHeight: 0.95, marginTop: 14 }}>
        {event.title}
      </div>
      <div className="eyebrow" style={{ marginTop: 8 }}>{event.where}</div>
      <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5, flex: 1 }}>{event.note}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, gap: 12, flexWrap: "wrap" }}>
        <PlatformRow ids={event.platforms} boxed short />
        {!isPast && (
          <a href={event.watch} target="_blank" rel="noreferrer" className="btn btn--ghost" style={{ padding: "8px 12px", fontSize: 10 }}>
            Watch <span className="arrow">→</span>
          </a>
        )}
      </div>
    </div>
  );
}

function EventRow({ event }) {
  const G = window.GTD;
  const isPast = event._start < Date.now();
  const primaryColor = G.PLATFORMS[event.platforms[0]]?.color || "var(--ink)";
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "12px 100px 1fr 1fr 220px 110px",
      alignItems: "stretch",
    }}>
      <div style={{ background: primaryColor }} />
      <div style={{ padding: "18px 12px", borderLeft: "2px solid var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <span className="bignum" style={{ fontSize: 26 }}>{window.GTD.fmtDate(event.date).day}</span>
        <span className="eyebrow" style={{ fontSize: 9, color: primaryColor }}>{window.GTD.fmtDate(event.date).month}</span>
      </div>
      <div style={{ padding: "18px 22px", borderLeft: "2px solid var(--ink)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="display glitch" style={{ fontSize: 24, lineHeight: 0.95 }}>{event.title}</div>
        <span className="eyebrow" style={{ marginTop: 6, fontSize: 9 }}>{event.kind.toUpperCase()} · {event.where}</span>
      </div>
      <div style={{ padding: "18px 22px", borderLeft: "2px solid var(--ink)", display: "flex", alignItems: "center", gap: 8 }}>
        {!isPast ? <Countdown targetUtcIso={event.startAtUTC || (event.date + "T18:00:00Z")} compact /> : <span className="tag">CONCLUDED</span>}
      </div>
      <div style={{ padding: "18px 22px", borderLeft: "2px solid var(--ink)", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        <PlatformRow ids={event.platforms} boxed short />
      </div>
      <div style={{ borderLeft: "2px solid var(--ink)", display: "grid", placeItems: "center" }}>
        {!isPast && (
          <a href={event.watch} target="_blank" rel="noreferrer" className="btn btn--ghost" style={{ padding: "8px 12px", fontSize: 9 }}>Watch →</a>
        )}
      </div>
    </div>
  );
}

window.EventsPage = EventsPage;

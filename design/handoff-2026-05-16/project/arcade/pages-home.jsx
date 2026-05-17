/* Home page — countdown · main event · fight cards · roster · news wire. */

function HomePage({ onNavigate }) {
  const G = window.GTD;
  const nextDrop = G.nextDrop();
  const nextEvent = G.nextEvent();
  const thisWeek = G.RELEASES.filter((r) => {
    const t = new Date(r.date + "T22:00:00Z").getTime();
    return t > Date.now() && t < Date.now() + 7 * 24 * 3600 * 1000;
  });
  const next2 = G.RELEASES.filter((r) => {
    const t = new Date(r.date + "T22:00:00Z").getTime();
    return t > Date.now() + 7 * 24 * 3600 * 1000 && t < Date.now() + 21 * 24 * 3600 * 1000;
  }).slice(0, 4);

  const heroArt = G.STUDIO.find((s) => s.id === "civicrise")?.art;
  const dropArt = G.STUDIO.find((s) => s.id === "neon-district")?.art;

  return (
    <main className="rise">

      {/* ─── HERO: live countdown to next major drop ───────────────── */}
      <section className="shell" style={{ paddingTop: 36, paddingBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 28, alignItems: "stretch" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                <span className="acc">●</span> Next drop · T-minus
              </div>
              {nextDrop && (
                <>
                  <Countdown big targetUtcIso={nextDrop.date + "T22:00:00Z"} />
                  <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                    <span className="display glitch" style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)" }}>
                      {nextDrop.title}
                    </span>
                    {nextDrop.ours && <span className="tag brand">OURS</span>}
                  </div>
                  <div style={{ marginTop: 14, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                    <PlatformRow ids={nextDrop.platforms} />
                    <LauncherList launchers={nextDrop.launcher} />
                    <span className="eyebrow">{nextDrop.genre}</span>
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn--brand" onClick={() => onNavigate("releases")}>
                See the release schedule <span className="arrow">→</span>
              </button>
              <button className="btn btn--ghost" onClick={() => onNavigate("events")}>
                Tonight's events
              </button>
            </div>
          </div>

          {/* Main-event poster */}
          <div className="card" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2 }}>
              <span className="tag live">LIVE TRACK</span>
            </div>
            <GameArt src={dropArt} height={460} label="MAIN EVENT" accent="var(--brand)" />
            <div style={{ padding: "18px 18px", borderTop: "2px solid var(--ink)" }}>
              <div className="eyebrow">// LAUNCH WINDOW · {window.GTD.fmtDate(nextDrop.date).month} {window.GTD.fmtDate(nextDrop.date).day}</div>
              <div className="display" style={{ fontSize: 34, marginTop: 6 }}>
                Tonight at <span className="acc">22:00 BST</span>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55 }}>
                Curated tracking for the strategy slate. We watch the launch, then surface every credible review and
                preview in the first 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Live metric strip ────────────────────────────────────── */}
      <section className="shell">
        <div className="cols-4 rise-stagger" style={{ marginTop: 20 }}>
          {[
            { k: "Tracked titles", v: "47", c: "var(--ink)" },
            { k: "This week", v: thisWeek.length.toString().padStart(2, "0"), c: "var(--brand)" },
            { k: "Events queued", v: G.EVENTS.length.toString().padStart(2, "0"), c: "var(--pc)" },
            { k: "Our slate", v: G.STUDIO.length.toString().padStart(2, "0"), c: "var(--xbox)" },
          ].map((m) => (
            <div key={m.k} style={{ padding: "20px 22px" }}>
              <div className="eyebrow">{m.k}</div>
              <div className="bignum" style={{ fontSize: 64, lineHeight: 1, color: m.c, marginTop: 6 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Fight card · this week ───────────────────────────────── */}
      <section className="shell" style={{ marginTop: 40 }}>
        <SectionHead
          no="ROUND 01"
          title="This week's card"
          meta={<>
            <span className="tag">{thisWeek.length} BOUTS</span>
            <button className="btn btn--ghost" onClick={() => onNavigate("releases")} style={{ padding: "8px 14px" }}>FULL CARD <span className="arrow">→</span></button>
          </>}
        />
        <div className="row-grid">
          {thisWeek.length === 0 && (
            <div style={{ padding: "32px 22px", color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              No releases inside this window — return to the spine for the full slate.
            </div>
          )}
          {thisWeek.map((r) => (
            <FightCardRow key={r.id} release={r} />
          ))}
        </div>
      </section>

      {/* ─── Round 02 · two-week horizon, presented as a VS row ───── */}
      <section className="shell" style={{ marginTop: 36 }}>
        <SectionHead
          no="ROUND 02"
          title="The two-week horizon"
          meta={<span className="tag">{next2.length} BOUTS · MIXED PLATFORMS</span>}
        />
        <div className="cols-2" style={{ borderBottom: "2px solid var(--ink)" }}>
          {next2.slice(0, 2).map((r, i) => (
            <VsCell key={r.id} release={r} side={i === 0 ? "L" : "R"} />
          ))}
        </div>
        <div className="cols-2" style={{ borderTop: 0 }}>
          {next2.slice(2, 4).map((r, i) => (
            <VsCell key={r.id} release={r} side={i === 0 ? "L" : "R"} />
          ))}
        </div>
      </section>

      {/* ─── Roster · studio's own games, colour-coded by platform ── */}
      <section className="shell" style={{ marginTop: 44 }}>
        <SectionHead
          no="ROSTER"
          title={<>Our slate <span className="acc" style={{ color: "var(--brand)" }}>—</span> seven in motion</>}
          meta={<>
            <span className="pf pf--browser boxed"><span className="pf-dot" /> 6 BROWSER</span>
            <span className="pf pf--pc boxed"><span className="pf-dot" /> 1 PC</span>
          </>}
        />
        <div className="cols-4 rise-stagger">
          {G.STUDIO.slice(0, 4).map((g, i) => (
            <RosterCard key={g.id} game={g} index={i + 1} />
          ))}
        </div>
        <div className="cols-3 rise-stagger" style={{ marginTop: -2 }}>
          {G.STUDIO.slice(4, 7).map((g, i) => (
            <RosterCard key={g.id} game={g} index={i + 5} />
          ))}
        </div>
      </section>

      {/* ─── News wire · 4 rails ──────────────────────────────────── */}
      <section className="shell" style={{ marginTop: 44 }}>
        <SectionHead
          no="WIRE"
          title="Tonight's signal"
          meta={<>
            <span className="tag">12 NEW · 24h</span>
            <button className="btn btn--ghost" onClick={() => onNavigate("news")} style={{ padding: "8px 14px" }}>OPEN WIRE <span className="arrow">→</span></button>
          </>}
        />
        <div className="cols-4">
          {["dev", "gaming", "review", "preview"].map((feed) => {
            const items = G.NEWS.filter((n) => n.feed === feed).slice(0, 2);
            const label = { dev: "DEV", gaming: "GAMING", review: "REVIEW", preview: "PREVIEW" }[feed];
            return (
              <div key={feed} style={{ padding: 18, minHeight: 220 }}>
                <span className="tag brand-ghost">{label}</span>
                <div style={{ marginTop: 14 }}>
                  {items.map((n, i) => (
                    <div key={i} style={{ padding: "12px 0", borderTop: i ? "1px dashed var(--line)" : "none" }}>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 600, lineHeight: 1.25, color: "var(--ink)" }}>
                        {n.t}
                      </div>
                      <div className="eyebrow" style={{ marginTop: 8, fontSize: 9 }}>{n.src} · {n.h}{n.score && <> · <span style={{ color: "var(--brand)" }}>{n.score > 10 ? Math.round(n.score / 10) : n.score}/10</span></>}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom marquee ──────────────────────────────────────── */}
      <div style={{ marginTop: 56 }}>
        <Marquee kind="brand" items={[
          "INSERT COIN",
          "1986 → 2026",
          "GAMETRACKDAILY — BUILT FOR PLAYERS WHO WATCH THE CARD",
          "WINDOWS PC · XBOX · PLAYSTATION",
          "OURS — MANDATE 2029 DEMO IN 21D",
        ]} />
      </div>
    </main>
  );
}

// ── Helper rows ──────────────────────────────────────────────────────────
function FightCardRow({ release }) {
  const G = window.GTD;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "84px 1fr auto auto auto", alignItems: "stretch" }}>
      <DateBlock iso={release.date} accent={release.ours ? "var(--brand)" : "var(--ink-2)"} />
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: "2px solid var(--ink)", background: release.ours ? "color-mix(in oklab, var(--brand) 14%, transparent)" : "transparent" }}>
        <div className="display glitch" style={{ fontSize: 30, lineHeight: 0.95 }}>
          {release.title}{release.ours && <span className="acc" style={{ color: "var(--brand)" }}> ★</span>}
        </div>
        <div className="eyebrow" style={{ marginTop: 8, fontSize: 10 }}>
          {release.genre}{release.outlet && <> · {release.outlet}</>}
        </div>
      </div>
      <div style={{ padding: "16px 20px", borderLeft: "2px solid var(--ink)", display: "flex", alignItems: "center" }}>
        <PlatformRow ids={release.platforms} boxed short />
      </div>
      <div style={{ padding: "16px 20px", borderLeft: "2px solid var(--ink)", display: "flex", alignItems: "center" }}>
        <LauncherList launchers={release.launcher} />
      </div>
      <div style={{ padding: "16px 20px", borderLeft: "2px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--mono)", fontWeight: 800, fontSize: 14, color: "var(--brand)" }}>→</span>
      </div>
    </div>
  );
}

function VsCell({ release, side }) {
  return (
    <div style={{ padding: "22px 26px", background: release.ours ? "color-mix(in oklab, var(--brand) 14%, transparent)" : "transparent" }}>
      <div className="eyebrow" style={{ textAlign: side === "L" ? "left" : "right" }}>
        {window.GTD.fmtDate(release.date, { dayName: true }).dow} {window.GTD.fmtDate(release.date).day} {window.GTD.fmtDate(release.date).month}
      </div>
      <div className="display glitch" style={{ fontSize: 36, lineHeight: 0.95, marginTop: 6, textAlign: side === "L" ? "left" : "right" }}>
        {release.title}{release.ours && <span className="acc" style={{ color: "var(--brand)" }}> ★</span>}
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", justifyContent: side === "L" ? "flex-start" : "flex-end", flexWrap: "wrap" }}>
        <PlatformRow ids={release.platforms} boxed short />
        <LauncherList launchers={release.launcher} />
      </div>
    </div>
  );
}

function RosterCard({ game, index }) {
  return (
    <div className={`card ${game.stage === "Flagship" ? "card--ours" : ""}`.trim()} style={{ display: "flex", flexDirection: "column", border: "none" }}>
      <GameArt src={game.art} height={170} />
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>№ {String(index).padStart(2, "0")} · {game.stage.toUpperCase()}</span>
          <PlatformRow ids={game.platforms} boxed short />
        </div>
        <div className="display glitch" style={{ fontSize: 28, lineHeight: 0.95 }}>{game.title}</div>
        <div className="eyebrow" style={{ fontSize: 10, color: "var(--brand)" }}>{game.cat}</div>
        <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.55, color: "var(--ink-2)" }}>{game.tagline}.</p>
        <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
          {game.play ? (
            <a href={game.play} className="btn btn--brand" style={{ padding: "8px 12px", fontSize: 10 }} target="_blank" rel="noreferrer">
              Play demo <span className="arrow">→</span>
            </a>
          ) : (
            <span className="tag">{game.status}</span>
          )}
        </div>
      </div>
    </div>
  );
}

window.HomePage = HomePage;

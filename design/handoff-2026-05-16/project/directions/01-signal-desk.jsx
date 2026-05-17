/* Direction 1 — SIGNAL DESK
   Bloomberg-style trading terminal for games. Dense, mono-led, multi-pane,
   amber on near-black. Tickers and live counts. Gaming-as-data. */

function SignalDesk() {
  const { Sheet, Mast, Box, Lines, Tag, Note, Head, Poster, Callouts, GAMES, RELEASES, EVENTS, NEWS, Squiggle } = window.WF;
  return (
    <Sheet theme="dark" accent="#e8a259">
      <div style={{ padding: "26px 32px 40px", position: "relative" }}>

        {/* Ticker strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "6px 14px",
            border: "1.5px solid var(--wf-stroke)",
            borderRadius: 4,
            marginBottom: 16,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "var(--acc)" }}>● LIVE</span>
          <span>CRIMSON SKYLINES — out today on PC, Xbox</span>
          <span style={{ color: "var(--wf-muted)" }}>·</span>
          <span>Summer Game Fest in 18d</span>
          <span style={{ color: "var(--wf-muted)" }}>·</span>
          <span>14 new reviews this week</span>
          <span style={{ color: "var(--wf-muted)" }}>·</span>
          <span style={{ color: "var(--acc)" }}>OURS — Mandate 2029 demo in 21d</span>
        </div>

        <Mast nav={["GAMES", "RELEASES", "EVENTS", "DEV", "GAMING", "REVIEWS", "PREVIEWS"]} />

        {/* Hero grid: 3 panes */}
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 240px", gap: 14, marginTop: 18, position: "relative" }}>
          {/* Left pane — today's drops */}
          <div style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 4, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>Today's drops</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--acc)" }}>03</span>
            </div>
            {[
              { d: "08:00", t: "Crimson Skylines", p: "PC · XSX" },
              { d: "14:00", t: "Driftcourt", p: "PC" },
              { d: "22:00", t: "Mooring DLC", p: "PS5" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 0", borderTop: i ? "1px dashed var(--wf-line)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--wf-muted)" }}>
                  <span>{r.d}</span>
                  <span>{r.p}</span>
                </div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, lineHeight: 1 }}>{r.t}</div>
              </div>
            ))}
          </div>

          {/* Centre pane — featured radar */}
          <div style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 4, padding: 18, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <Tag kind="accent">LAUNCH RADAR</Tag>
              <Tag>WPC · XSX · PS5</Tag>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 18, alignItems: "stretch" }}>
              <div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: 44, lineHeight: 0.95, marginBottom: 8 }}>
                  A sharper public signal<br />for what matters in games.
                </div>
                <Lines count={2} widths={["96%", "70%"]} height={5} />
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <Tag kind="solid">BROWSE GAMES →</Tag>
                  <Tag>OPEN CALENDAR</Tag>
                  <Tag>SEE COVERAGE</Tag>
                </div>
              </div>
              <Poster kind="city" h={140} label="HERO TILE" />
            </div>

            {/* Live metric strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 18, border: "1px dashed var(--wf-line)" }}>
              {[
                { k: "Tracked", v: "47" },
                { k: "This week", v: "06" },
                { k: "Events live", v: "02" },
                { k: "Our slate", v: "07" },
              ].map((m, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRight: i < 3 ? "1px dashed var(--wf-line)" : "none" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--wf-muted)" }}>{m.k}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, color: "var(--acc)", marginTop: 2 }}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right pane — on stream */}
          <div style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 4, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>On stream</span>
              <span style={{ color: "var(--acc)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>● 2 LIVE</span>
            </div>
            {EVENTS.slice(0, 4).map((e, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4, padding: "9px 0", borderTop: i ? "1px dashed var(--wf-line)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--wf-muted)" }}>
                  <span>{e.d}</span>
                  <span>{e.tag}</span>
                </div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: 17, lineHeight: 1 }}>{e.t}</div>
              </div>
            ))}
          </div>

          <Note style={{ top: -18, left: 246, color: "var(--acc)" }} arrow="d">live ticker — scroll-driven speed</Note>
        </div>

        {/* Dense tracked games table */}
        <div style={{ marginTop: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Head eyebrow="// LINEUP TABLE" title="Every tracked title, one sortable surface." />
            <div style={{ display: "flex", gap: 8 }}>
              <Tag>SORT · DATE</Tag>
              <Tag>FILTER · PLATFORM</Tag>
              <Tag>VIEW · DENSE</Tag>
            </div>
          </div>
          <div style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "26px 1.5fr 1fr 1fr 1fr 90px 80px", gap: 0, padding: "8px 12px", background: "var(--wf-fill)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--wf-muted)", borderBottom: "1px solid var(--wf-line)" }}>
              <span>#</span>
              <span>Title</span>
              <span>Category</span>
              <span>Stage</span>
              <span>Status</span>
              <span>Pad</span>
              <span>Open</span>
            </div>
            {GAMES.map((g, i) => (
              <div key={g.id} style={{ display: "grid", gridTemplateColumns: "26px 1.5fr 1fr 1fr 1fr 90px 80px", gap: 0, padding: "10px 12px", alignItems: "center", borderTop: i ? "1px dashed var(--wf-line)" : "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                <span style={{ color: "var(--wf-muted)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: 17, color: "var(--wf-stroke)" }}>{g.t}</span>
                <span style={{ color: "var(--wf-muted)" }}>{g.cat}</span>
                <span>{g.stage === "Flagship" ? <Tag kind="accent">{g.stage}</Tag> : <Tag>{g.stage}</Tag>}</span>
                <span style={{ color: "var(--wf-muted)" }}>{g.status}</span>
                <span><span style={{ width: 8, height: 8, background: "var(--acc)", borderRadius: 2, display: "inline-block", marginRight: 6 }} />●●○○</span>
                <span style={{ color: "var(--acc)" }}>→</span>
              </div>
            ))}
          </div>
        </div>

        {/* News rails — compact */}
        <div style={{ marginTop: 26 }}>
          <Head eyebrow="// SIGNAL · LAST 24h" title="Four feeds, one watch desk." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {["DEV", "GAMING", "REVIEW", "PREVIEW"].map((feed) => (
              <div key={feed} style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 4, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <Tag kind="accent">{feed}</Tag>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--wf-muted)" }}>24h</span>
                </div>
                {NEWS.filter((n) => n.feed === feed).slice(0, 2).map((n, i) => (
                  <div key={i} style={{ padding: "8px 0", borderTop: i ? "1px dashed var(--wf-line)" : "none" }}>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, lineHeight: 1.1 }}>{n.t}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--wf-muted)", marginTop: 4, letterSpacing: "0.12em" }}>
                      {n.src} · {n.h}
                    </div>
                  </div>
                ))}
                {NEWS.filter((n) => n.feed === feed).length === 0 && (
                  <Lines count={4} widths={["94%", "78%", "100%", "62%"]} height={5} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom ticker */}
        <div
          style={{
            marginTop: 22,
            padding: "8px 14px",
            border: "1.5px solid var(--wf-stroke)",
            borderRadius: 4,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            display: "flex",
            gap: 24,
            color: "var(--wf-muted)",
          }}
        >
          <span style={{ color: "var(--acc)" }}>EOD ROLL</span>
          <span>14 reviews</span>
          <span>06 launches</span>
          <span>02 showcases</span>
          <span>47 tracked titles</span>
          <span>Updated 22:15 BST</span>
        </div>

        {/* Margin annotations */}
        <Callouts
          side="right"
          top={140}
          style={{ right: 8 }}
          items={[
            "Mono headlines, Caveat reserved for handwritten micro-labels",
            "Sticky ticker = scroll-driven progress bar",
            "Sortable table — main browse surface",
            "Container queries: panes collapse 3→2→1",
          ]}
        />
      </div>
    </Sheet>
  );
}

window.SignalDesk = SignalDesk;

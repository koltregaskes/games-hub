/* Direction 4 — ARCADE MARQUEE
   Brutalist gaming. Fight-card stacks, oversized numerals, CRT scanlines,
   animated marquees, hot accent + steel pair. Loud, distinct, punchy. */

function ArcadeMarquee() {
  const { Sheet, Box, Lines, Tag, Note, Head, Poster, Callouts, GAMES, RELEASES, NEWS, Squiggle } = window.WF;
  const acc = "var(--acc)";

  return (
    <Sheet theme="dark" accent="#ff5757">
      <div style={{ position: "relative", padding: "0 0 40px" }}>
        {/* Scanline overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(180deg, transparent 0 3px, rgba(244,239,231,0.04) 3px 4px)",
            pointerEvents: "none",
            mixBlendMode: "screen",
            zIndex: 1,
          }}
        />

        {/* Top marquee */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "2px solid var(--wf-stroke)",
            background: "var(--wf-paper)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ padding: "0 22px", color: acc }}>★ TONIGHT</span>
          <span>CRIMSON SKYLINES — DROP 22:00 BST</span>
          <span style={{ padding: "0 16px", color: acc }}>★</span>
          <span>SUMMER GAME FEST · T-18D</span>
          <span style={{ padding: "0 16px", color: acc }}>★</span>
          <span>14 NEW REVIEWS · 06 LAUNCHES · 02 SHOWCASES</span>
          <span style={{ padding: "0 16px", color: acc }}>★</span>
          <span>OURS — MANDATE 2029 DEMO IN 21D</span>
        </div>

        {/* Big nav bar */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", borderBottom: "2px solid var(--wf-stroke)" }}>
          <div style={{ padding: "16px 22px", borderRight: "2px solid var(--wf-stroke)", fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            GAME<span style={{ color: acc }}>/</span>TRACK<span style={{ color: acc }}>/</span>DAILY
          </div>
          {["GAMES", "CARD", "EVENTS", "WIRE", "REVIEWS"].map((n, i) => (
            <div key={n} style={{ padding: "16px 18px", borderRight: i < 4 ? "2px solid var(--wf-stroke)" : "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em" }}>{n}</div>
          ))}
          <div style={{ marginLeft: "auto", padding: "16px 22px", borderLeft: "2px solid var(--wf-stroke)", background: acc, color: "var(--wf-paper)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em" }}>● LIVE</div>
        </div>

        {/* Hero: countdown to next drop */}
        <div style={{ position: "relative", zIndex: 2, padding: "30px 36px 14px", borderBottom: "2px solid var(--wf-stroke)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: acc }}>
                NEXT DROP · T-MINUS
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, lineHeight: 0.85, marginTop: 6 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 220, fontWeight: 800, letterSpacing: "-0.06em", color: "var(--wf-stroke)" }}>04</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 60, fontWeight: 700, color: acc, letterSpacing: "-0.02em" }}>h</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 220, fontWeight: 800, letterSpacing: "-0.06em", color: "var(--wf-stroke)" }}>17</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 60, fontWeight: 700, color: acc, letterSpacing: "-0.02em" }}>m</span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 4 }}>
                CRIMSON <span style={{ color: acc }}>SKYLINES</span> — PC · XBOX
              </div>
            </div>
            <div style={{ border: "2px solid var(--wf-stroke)", padding: 0, position: "relative" }}>
              <Poster kind="neon" h={220} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(20,20,24,0.5))" }} />
              <div style={{ position: "absolute", left: 12, bottom: 10, right: 12 }}>
                <Tag kind="accent">MAIN EVENT</Tag>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: "var(--wf-paper)", letterSpacing: "-0.01em", marginTop: 6, textTransform: "uppercase" }}>Crimson Skylines</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fight card — vs-style upcoming */}
        <div style={{ position: "relative", zIndex: 2, padding: "26px 36px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              ROUND <span style={{ color: acc }}>01</span> — THIS WEEK
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--wf-muted)" }}>03 BOUTS · 02 PLATFORMS</div>
          </div>
          {[
            { l: { d: "TUE 19", t: "Crimson Skylines", p: "PC · XSX" }, r: { d: "FRI 22", t: "Garrison: Final Mile", p: "PC · PS5" } },
            { l: { d: "WED 27", t: "Vector Trials 2", p: "PC" }, r: { d: "FRI 06", t: "Mandate 2029 Demo", p: "BROWSER", ours: true } },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 0, border: "2px solid var(--wf-stroke)", borderTop: i ? "none" : "2px solid var(--wf-stroke)", alignItems: "stretch" }}>
              <div style={{ padding: "18px 22px", background: row.l.ours ? "color-mix(in oklab, var(--acc) 14%, transparent)" : "transparent" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "var(--wf-muted)" }}>{row.l.d}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, letterSpacing: "-0.01em", textTransform: "uppercase", marginTop: 2 }}>
                  {row.l.t}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: acc, marginTop: 4 }}>{row.l.p}</div>
              </div>
              <div style={{ display: "grid", placeItems: "center", borderLeft: "2px solid var(--wf-stroke)", borderRight: "2px solid var(--wf-stroke)", background: "var(--wf-fill)", fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 800, color: acc, letterSpacing: "-0.02em" }}>VS</div>
              <div style={{ padding: "18px 22px", background: row.r.ours ? "color-mix(in oklab, var(--acc) 14%, transparent)" : "transparent" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "var(--wf-muted)", textAlign: "right" }}>{row.r.d}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, letterSpacing: "-0.01em", textTransform: "uppercase", marginTop: 2, textAlign: "right" }}>
                  {row.r.t}{row.r.ours && <span style={{ color: acc }}> ★</span>}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: acc, marginTop: 4, textAlign: "right" }}>{row.r.p}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Roster — block stack */}
        <div style={{ position: "relative", zIndex: 2, padding: "30px 36px 0" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
            ROSTER — <span style={{ color: acc }}>OUR SLATE</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "2px solid var(--wf-stroke)" }}>
            {GAMES.slice(0, 4).map((g, i) => (
              <div key={g.id} style={{ borderRight: i < 3 ? "2px solid var(--wf-stroke)" : "none", padding: 0 }}>
                <Poster kind={g.k} h={140} />
                <div style={{ padding: "12px 14px", borderTop: "2px solid var(--wf-stroke)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "var(--wf-muted)" }}>
                    <span>№ 0{i + 1}</span><span>{g.stage.toUpperCase()}</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, letterSpacing: "-0.01em", textTransform: "uppercase", marginTop: 4, lineHeight: 1 }}>{g.t}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: acc, marginTop: 6 }}>{g.cat.toUpperCase()} →</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News wire bar */}
        <div style={{ position: "relative", zIndex: 2, marginTop: 30 }}>
          <div style={{ display: "flex", borderTop: "2px solid var(--wf-stroke)", borderBottom: "2px solid var(--wf-stroke)" }}>
            {["DEV", "GAMING", "REVIEW", "PREVIEW"].map((feed, i) => {
              const item = NEWS.find((n) => n.feed === feed);
              return (
                <div key={feed} style={{ flex: 1, padding: "16px 18px", borderRight: i < 3 ? "2px solid var(--wf-stroke)" : "none" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", color: acc }}>{feed} WIRE</div>
                  {item && (
                    <>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, lineHeight: 1.15, marginTop: 8, textTransform: "uppercase", letterSpacing: "-0.005em" }}>{item.t}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "var(--wf-muted)", marginTop: 6 }}>{item.src.toUpperCase()} · {item.h}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom marquee */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            padding: "10px 0",
            background: acc,
            color: "var(--wf-paper)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            overflow: "hidden",
            whiteSpace: "nowrap",
            marginTop: 0,
          }}
        >
          <span style={{ padding: "0 22px" }}>INSERT COIN</span>
          <span>· 1986 → 2026 ·</span>
          <span style={{ padding: "0 22px" }}>BUILT FOR PLAYERS WHO WATCH THE CARD</span>
          <span>·</span>
          <span style={{ padding: "0 22px" }}>GAMETRACKDAILY</span>
          <span>· 2026 ·</span>
        </div>

        <Callouts
          side="right"
          top={140}
          style={{ right: 8 }}
          items={[
            "Headlines in heavy mono — single family, weight 800",
            "Hot accent only — never two accents at once",
            "CSS scanline overlay, optional toggle",
            "Marquee = pure CSS scroll, paused on hover",
          ]}
        />
      </div>
    </Sheet>
  );
}

window.ArcadeMarquee = ArcadeMarquee;

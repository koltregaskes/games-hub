/* Direction 3 — RELEASE SPINE
   The timeline IS the homepage. A horizontal time axis runs across the top
   half; weeks become columns; releases pin to the spine. Scroll-snapped,
   container-query friendly. Gaming-as-calendar. */

function ReleaseSpine() {
  const { Sheet, Mast, Box, Lines, Tag, Note, Head, Poster, Callouts, GAMES, RELEASES, EVENTS, NEWS, Squiggle } = window.WF;
  const acc = "var(--acc)";
  const weeks = [
    { label: "This week", sub: "May 18 — 24", items: [
      { d: "Tue 19", t: "Crimson Skylines", p: "PC · XSX", flag: "TODAY" },
      { d: "Fri 22", t: "Garrison: Final Mile", p: "PC · PS5" },
    ]},
    { label: "Next", sub: "May 25 — 31", items: [
      { d: "Wed 27", t: "Vector Trials 2", p: "PC" },
    ], event: { d: "Mon 26", t: "Indie Showcase", tag: "showcase" }},
    { label: "Week 23", sub: "Jun 01 — 07", items: [
      { d: "Tue 03", t: "Slow Light Engine", p: "PS5" },
      { d: "Sat 06", t: "Mandate 2029 — Demo", p: "Browser", flag: "OURS" },
    ], event: { d: "Wed 03", t: "State of Unreal", tag: "showcase" }},
    { label: "Week 24", sub: "Jun 08 — 14", items: [
      { d: "Thu 12", t: "Holdback Republic", p: "PC · XSX" },
    ], event: { d: "Mon 09", t: "Xbox Showcase", tag: "showcase" }},
    { label: "Week 25", sub: "Jun 15 — 21", items: [
      { d: "Thu 18", t: "Civicrise — Beta", p: "Browser", flag: "OURS" },
    ]},
    { label: "Later", sub: "Jul · Aug", items: [
      { d: "Jul 14", t: "Develop:Brighton", p: "Conference", flag: "EVENT" },
      { d: "Aug 19", t: "Gamescom 2026", p: "Cologne", flag: "EVENT" },
    ]},
  ];

  return (
    <Sheet theme="dark" accent="#8ec5d6">
      <div style={{ padding: "26px 36px 40px", position: "relative" }}>
        <Mast nav={["TODAY", "LINEUP", "CALENDAR", "EVENTS", "COVERAGE", "DEV"]} />

        {/* Hero strip — small, lets the spine breathe */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 30, alignItems: "end", padding: "26px 0 18px" }}>
          <div>
            <Tag kind="accent">LAUNCH SPINE · LIVE</Tag>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 64, lineHeight: 0.95, marginTop: 10 }}>
              The next ninety days,<br />
              <span style={{ color: acc }}>at a glance.</span>
            </div>
            <div style={{ marginTop: 12, maxWidth: 460 }}>
              <Lines count={2} widths={["94%", "62%"]} height={5} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Tag>FILTER · PC</Tag>
            <Tag>FILTER · XSX</Tag>
            <Tag>FILTER · PS5</Tag>
            <Tag kind="accent">OURS ONLY</Tag>
            <Tag>EVENTS</Tag>
          </div>
        </div>

        {/* The spine itself */}
        <div style={{ position: "relative", border: "1.5px solid var(--wf-stroke)", borderRadius: 4, padding: "22px 0 24px", overflow: "hidden" }}>
          {/* Today marker rail */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 22px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--wf-muted)" }}>
            <span><span style={{ color: acc }}>●</span> Tue 19 May · 22:14 BST</span>
            <span>← scroll · 90 days →</span>
          </div>

          {/* The horizontal timeline */}
          <div style={{ position: "relative", padding: "0 22px" }}>
            {/* Spine line */}
            <div style={{ position: "absolute", left: 22, right: 22, top: 56, height: 2, background: "var(--wf-stroke)", opacity: 0.4 }} />
            <div style={{ position: "absolute", left: 84, top: 36, width: 2, height: 320, background: acc }} />
            <div style={{ position: "absolute", left: 72, top: 22, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: acc }}>NOW</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, position: "relative" }}>
              {weeks.map((w, wi) => (
                <div key={wi} style={{ position: "relative", paddingTop: 40 }}>
                  {/* Week tick */}
                  <div style={{ position: "absolute", left: "50%", top: 50, width: 2, height: 12, background: "var(--wf-stroke)", transform: "translateX(-50%)" }} />
                  {/* Week label above */}
                  <div style={{ position: "absolute", top: 6, left: 0, right: 0, textAlign: "center" }}>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, lineHeight: 1, color: wi === 0 ? acc : "var(--wf-stroke)" }}>{w.label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--wf-muted)", letterSpacing: "0.12em", marginTop: 2 }}>{w.sub}</div>
                  </div>

                  {/* Pinned event below the spine, before items */}
                  {w.event && (
                    <div style={{ marginTop: 22, padding: "8px 10px", border: `1.5px dashed ${acc}`, borderRadius: 4, background: "color-mix(in oklab, var(--acc) 8%, transparent)" }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: acc }}>◇ {w.event.tag} · {w.event.d}</div>
                      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 17, lineHeight: 1, marginTop: 4 }}>{w.event.t}</div>
                    </div>
                  )}

                  {/* Release cards stacking down from the spine */}
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    {w.items.map((r, ri) => (
                      <div key={ri} style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 4, padding: "8px 10px", background: r.flag === "OURS" ? "color-mix(in oklab, var(--acc) 12%, transparent)" : "transparent", position: "relative" }}>
                        {r.flag && (
                          <Tag kind={r.flag === "OURS" ? "accent" : "solid"} style={{ position: "absolute", top: -8, right: 8, fontSize: 8 }}>
                            {r.flag}
                          </Tag>
                        )}
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.14em", color: "var(--wf-muted)" }}>{r.d}</div>
                        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, lineHeight: 1, marginTop: 3 }}>{r.t}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.14em", color: "var(--wf-muted)", marginTop: 4 }}>{r.p}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scrub bar */}
          <div style={{ margin: "22px 22px 0", height: 22, border: "1px solid var(--wf-line)", borderRadius: 2, position: "relative", background: "var(--wf-fill)" }}>
            <div style={{ position: "absolute", left: 8, top: 4, bottom: 4, width: 110, background: "color-mix(in oklab, var(--acc) 24%, transparent)", border: `1px solid ${acc}` }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: -16, display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.14em", color: "var(--wf-muted)" }}>
              <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
            </div>
          </div>
        </div>

        {/* Today, in detail */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginTop: 26 }}>
          <div style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 4, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Head eyebrow="// TODAY · TUE 19 MAY" title="Crimson Skylines" level={1} />
              <Tag kind="accent">LIVE NOW</Tag>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 18 }}>
              <div>
                <Lines count={3} widths={["100%", "92%", "70%"]} height={5} />
                <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Tag>PC · STEAM</Tag><Tag>XBOX SERIES X</Tag><Tag>GAME PASS</Tag>
                </div>
                <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                  <Tag kind="solid">OPEN STORE →</Tag>
                  <Tag>READ COVERAGE</Tag>
                  <Tag>ADD TO LIST</Tag>
                </div>
              </div>
              <Poster kind="neon" h={150} label="HERO" />
            </div>
          </div>

          <div style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 4, padding: 16 }}>
            <Head eyebrow="// NEXT 7 DAYS · OURS" title="Our slate." level={3} />
            {GAMES.slice(0, 3).map((g, i) => (
              <div key={g.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: i ? "1px dashed var(--wf-line)" : "none", alignItems: "center" }}>
                <div style={{ width: 56 }}>
                  <Poster kind={g.k} h={40} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, lineHeight: 1 }}>{g.t}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--wf-muted)", letterSpacing: "0.14em", marginTop: 2 }}>{g.cat.toUpperCase()}</div>
                </div>
                <span style={{ color: acc, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>→</span>
              </div>
            ))}
          </div>
        </div>

        {/* News rails compact */}
        <div style={{ marginTop: 22 }}>
          <Head eyebrow="// COVERAGE" title="Today's signal." level={2} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {["DEV", "GAMING", "REVIEW", "PREVIEW"].map((feed) => {
              const item = NEWS.find((n) => n.feed === feed);
              return (
                <div key={feed} style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 4, padding: 12, minHeight: 116 }}>
                  <Tag kind="accent">{feed}</Tag>
                  {item && (
                    <>
                      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 17, lineHeight: 1.1, marginTop: 10 }}>{item.t}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--wf-muted)", letterSpacing: "0.12em", marginTop: 8 }}>{item.src} · {item.h}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Callouts
          side="right"
          top={300}
          style={{ right: 8 }}
          items={[
            "Spine = horizontal scroll-snap track",
            "Anchor positioning: tooltips dock to release pins",
            "Events sit on the spine as diamonds",
            "Container queries: 6 weeks → 3 → 1",
          ]}
        />
      </div>
    </Sheet>
  );
}

window.ReleaseSpine = ReleaseSpine;

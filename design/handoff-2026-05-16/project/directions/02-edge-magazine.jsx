/* Direction 2 — EDGE MAGAZINE
   Editorial-led. Massive italic serif headlines, generous whitespace,
   single-column scroll, photo-led, premium feel. Gaming-as-culture. */

function EdgeMagazine() {
  const { Sheet, Box, Lines, Tag, Note, Head, Poster, Callouts, GAMES, RELEASES, NEWS, Squiggle } = window.WF;
  const muted = "var(--wf-muted)";
  return (
    <Sheet theme="light" accent="#b62a2a">
      <div style={{ position: "relative", padding: "0 0 60px" }}>
        {/* Masthead — like a magazine cover */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "20px 48px 14px", borderBottom: "1.5px solid var(--wf-stroke)" }}>
          <div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 44, lineHeight: 0.9, letterSpacing: "-0.02em" }}>
              GameTrack<span style={{ color: "var(--acc)" }}>Daily</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: muted, marginTop: 4 }}>
              Issue №47 · Tue 19 May 2026 · A studio almanac
            </div>
          </div>
          <div style={{ display: "flex", gap: 22, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            <span>Games</span><span>Calendar</span><span>Events</span><span>Coverage</span><span style={{ color: "var(--acc)" }}>Subscribe</span>
          </div>
        </div>

        {/* Cover */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, position: "relative" }}>
          <div style={{ padding: "60px 36px 60px 48px", position: "relative" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: muted, marginBottom: 28 }}>
              No. 01 · Cover story
            </div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 96, lineHeight: 0.88, letterSpacing: "-0.04em" }}>
              The quiet<br />
              <em style={{ color: "var(--acc)" }}>watch desk</em><br />
              for games.
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 36, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 92, lineHeight: 0.7, color: "var(--acc)", fontStyle: "italic" }}>“</span>
              <div style={{ maxWidth: 360 }}>
                <Lines count={5} widths={["100%", "98%", "92%", "100%", "70%"]} height={5} />
                <div style={{ marginTop: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: muted }}>
                  Read the brief — 4 min
                </div>
              </div>
            </div>
            <Note style={{ bottom: 36, left: 48 }} arrow="r">drop cap pulled from cover word</Note>
          </div>

          {/* Full-bleed cover image */}
          <div style={{ minHeight: 540, position: "relative", background: "var(--wf-fill)", borderLeft: "1.5px dashed var(--wf-stroke)" }}>
            <Poster kind="city" w="100%" h="100%" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(20,20,24,0.18))" }} />
            <div style={{ position: "absolute", left: 28, bottom: 24, right: 28 }}>
              <Tag kind="solid" style={{ background: "var(--wf-stroke)", color: "var(--wf-paper)" }}>OURS · FLAGSHIP</Tag>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 38, color: "var(--wf-paper)", marginTop: 10, textShadow: "0 1px 0 rgba(0,0,0,0.4)" }}>
                Civicrise — a city, block by block.
              </div>
            </div>
            <Note style={{ top: 18, right: 18, color: "var(--wf-paper)" }}>real screenshot, 16:9, warm</Note>
          </div>
        </div>

        {/* Inside this issue — index */}
        <div style={{ padding: "40px 48px", borderTop: "1.5px solid var(--wf-stroke)", borderBottom: "1.5px solid var(--wf-stroke)", display: "grid", gridTemplateColumns: "180px 1fr 1fr 1fr", gap: 32 }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 26, lineHeight: 1 }}>
            Inside<br />this issue
            <Squiggle width={120} />
          </div>
          {[
            { n: "02", t: "The Lineup", b: "Seven titles in motion this season." },
            { n: "03", t: "Release Diary", b: "Twenty drops between now and Gamescom." },
            { n: "04", t: "Coverage", b: "Dev, reviews and previews worth your hour." },
          ].map((s) => (
            <div key={s.n}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, color: muted }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em" }}>No. {s.n}</span>
              </div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, lineHeight: 1, marginTop: 4 }}>{s.t}</div>
              <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.5, color: muted }}>{s.b}</div>
            </div>
          ))}
        </div>

        {/* The Lineup — editorial card pairs */}
        <div style={{ padding: "44px 48px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 28 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: muted }}>№ 02</span>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, lineHeight: 1, fontStyle: "italic" }}>
              The Lineup.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 32 }}>
            {GAMES.slice(0, 3).map((g, i) => (
              <div key={g.id} style={{ borderTop: "1px solid var(--wf-stroke)", paddingTop: 16 }}>
                <Poster kind={g.k} h={i === 0 ? 220 : 160} label={g.t.toUpperCase()} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: muted }}>
                  <span>{g.cat}</span><span>{g.status}</span>
                </div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: i === 0 ? 36 : 26, lineHeight: 1, marginTop: 6, fontStyle: i === 0 ? "italic" : "normal" }}>
                  {g.t}.
                </div>
                <div style={{ marginTop: 10 }}>
                  <Lines count={i === 0 ? 4 : 3} widths={["100%", "92%", "88%", "62%"]} height={4} />
                </div>
                <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--acc)" }}>
                  Read the entry →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Release diary — numbered list, magazine style */}
        <div style={{ padding: "56px 48px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: muted }}>№ 03</span>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, lineHeight: 1, fontStyle: "italic" }}>
              Release diary.
            </div>
          </div>
          <div style={{ borderTop: "1.5px solid var(--wf-stroke)" }}>
            {RELEASES.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 100px 1fr 1fr 90px", gap: 18, padding: "16px 0", borderBottom: "1px solid var(--wf-line)", alignItems: "baseline" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: muted, letterSpacing: "0.16em" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontStyle: "italic" }}>{r.d}</span>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, lineHeight: 1 }}>{r.t}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: muted }}>{r.p}</span>
                <span style={{ textAlign: "right" }}>
                  {r.flag === "OURS" ? <Tag kind="accent">OURS</Tag> : r.flag === "TODAY" ? <Tag kind="solid">TODAY</Tag> : <span style={{ color: muted, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>—</span>}
                </span>
              </div>
            ))}
          </div>
          <Note style={{ position: "relative", marginTop: 14 }} arrow="l">view transitions on click → article view</Note>
        </div>

        {/* Coverage — two columns */}
        <div style={{ padding: "56px 48px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: muted }}>№ 04</span>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, lineHeight: 1, fontStyle: "italic" }}>
              Coverage.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
            {NEWS.slice(0, 4).map((n, i) => (
              <div key={i} style={{ borderTop: "1px solid var(--wf-stroke)", paddingTop: 16 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: muted }}>
                  {n.feed === "DEV" ? "Game Dev" : n.feed === "GAMING" ? "Gaming" : n.feed === "REVIEW" ? "Review" : "Preview"} · {n.src} · {n.h}
                </div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, lineHeight: 1.05, marginTop: 8 }}>{n.t}.</div>
                <div style={{ marginTop: 12 }}>
                  <Lines count={2} widths={["96%", "70%"]} height={4} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Callouts
          side="left"
          top={620}
          style={{ left: 8 }}
          items={[
            "Instrument Serif italic for display; Inter for body",
            "Generous whitespace, max 12 cards per scroll",
            "View transitions: card → article",
            "Drop caps and pull quotes do the visual work",
          ]}
        />
      </div>
    </Sheet>
  );
}

window.EdgeMagazine = EdgeMagazine;

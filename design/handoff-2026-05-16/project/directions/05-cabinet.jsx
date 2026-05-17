/* Direction 5 — CABINET
   Spatial card-stack. Game cards stand on shelves like vinyl or cartridges.
   3D hover-tilt, scroll-driven parallax depth, view-transition between cards.
   Tactile and collected. Gaming-as-collection. */

function Cabinet() {
  const { Sheet, Mast, Box, Lines, Tag, Note, Head, Poster, Callouts, GAMES, RELEASES, NEWS } = window.WF;
  const acc = "var(--acc)";

  // Cartridge / sleeve card
  function Cart({ g, size = "m", lift = 0, rot = 0 }) {
    const w = size === "l" ? 220 : size === "s" ? 130 : 170;
    const h = size === "l" ? 300 : size === "s" ? 180 : 232;
    return (
      <div
        style={{
          width: w,
          height: h,
          flex: `0 0 ${w}px`,
          transform: `translateY(${-lift}px) rotate(${rot}deg)`,
          transformOrigin: "bottom center",
          position: "relative",
          border: "1.5px solid var(--wf-stroke)",
          borderRadius: 6,
          background: "var(--wf-paper)",
          boxShadow: lift ? `0 ${10 + lift}px ${20 + lift * 2}px rgba(0,0,0,0.45)` : "0 6px 14px rgba(0,0,0,0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Poster kind={g.k} h="100%" w="100%" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(12,13,16,0.4))" }} />
          <div style={{ position: "absolute", top: 8, left: 8 }}>
            <Tag kind={g.stage === "Flagship" ? "accent" : "default"}>{g.stage}</Tag>
          </div>
        </div>
        <div style={{ padding: "10px 12px", borderTop: "1.5px dashed var(--wf-stroke)", background: "var(--wf-paper)" }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: size === "l" ? 24 : 19, lineHeight: 1 }}>{g.t}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.14em", color: "var(--wf-muted)", marginTop: 4, textTransform: "uppercase" }}>
            {g.cat}
          </div>
        </div>
        {/* Spine notch */}
        <div style={{ position: "absolute", top: 12, right: -2, width: 4, height: 28, background: "var(--acc)", borderRadius: 2 }} />
      </div>
    );
  }

  // A shelf line + cards resting on it
  function Shelf({ cards, label, sub, lifted = -1 }) {
    return (
      <div style={{ position: "relative", paddingTop: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--wf-muted)" }}>
              {label}
            </div>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 26, lineHeight: 1, marginTop: 2 }}>{sub}</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", color: acc }}>
            ←  drag to browse  →
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-end", padding: "10px 4px 0", overflow: "hidden", position: "relative" }}>
          {cards.map((c, i) => (
            <Cart key={c.id + i} g={c} size={c.size || "m"} lift={i === lifted ? 28 : 0} rot={i === lifted ? -1.5 : 0} />
          ))}
        </div>
        {/* Shelf line */}
        <div style={{ height: 0, borderBottom: "2px solid var(--wf-stroke)", boxShadow: "0 12px 18px -10px rgba(0,0,0,0.6)" }} />
        <div style={{ height: 12, background: "linear-gradient(180deg, var(--wf-fill), transparent)" }} />
      </div>
    );
  }

  // Build content
  const flagships = GAMES.filter((g) => g.stage === "Flagship");
  const emerging = GAMES.filter((g) => g.stage !== "Flagship");

  return (
    <Sheet theme="dark" accent="#cda6e8">
      <div style={{ padding: "26px 36px 40px", position: "relative" }}>
        <Mast nav={["CABINET", "RELEASES", "EVENTS", "COVERAGE", "ABOUT"]} />

        {/* Hero — shelf one, the flagships, with one card lifted out */}
        <div style={{ marginTop: 20, position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, alignItems: "center", marginBottom: 20 }}>
            <div>
              <Tag kind="accent">CABINET · NOW SHOWING</Tag>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: 64, lineHeight: 0.95, marginTop: 8 }}>
                The shelf you<br />curate, in motion.
              </div>
              <div style={{ marginTop: 14, maxWidth: 420 }}>
                <Lines count={3} widths={["96%", "88%", "62%"]} height={5} />
              </div>
              <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
                <Tag kind="solid">OPEN A CARTRIDGE →</Tag>
                <Tag>SHUFFLE SHELF</Tag>
              </div>
            </div>

            {/* Lifted hero card */}
            <div style={{ position: "relative", height: 320, display: "grid", placeItems: "center" }}>
              <div style={{ transform: "rotate(-3deg)", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }}>
                <Cart g={flagships[0]} size="l" />
              </div>
              <Note style={{ top: 20, right: 0 }} arrow="d" color={acc}>3D hover-tilt · mouse parallax</Note>
            </div>
          </div>
        </div>

        {/* Flagship shelf */}
        <Shelf
          label="// SHELF 01 · FLAGSHIPS"
          sub="The titles with the most life behind them."
          cards={[...flagships, ...emerging.slice(0, 3)]}
          lifted={2}
        />

        {/* Emerging shelf */}
        <div style={{ marginTop: 26 }}>
          <Shelf
            label="// SHELF 02 · EMERGING"
            sub="Concept slices and proof builds."
            cards={emerging}
            lifted={1}
          />
        </div>

        {/* Side-by-side: Drawer (releases) + Magazine rack (news) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18, marginTop: 28 }}>
          {/* Drawer */}
          <div style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 6, padding: 18, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <Head eyebrow="// DRAWER · UPCOMING" title="Pull the drawer." level={2} />
              <Tag>PC · XSX · PS5</Tag>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {RELEASES.slice(0, 6).map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 60px", gap: 12, padding: "12px 0", borderTop: i ? "1px dashed var(--wf-line)" : "none", alignItems: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.14em", color: "var(--wf-muted)" }}>{r.d}</div>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: 19, lineHeight: 1 }}>{r.t}{r.flag === "OURS" && <span style={{ color: acc }}> ★</span>}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.14em", color: "var(--wf-muted)", textTransform: "uppercase" }}>{r.p}</div>
                  <div style={{ textAlign: "right" }}>
                    {r.flag === "TODAY" ? <Tag kind="accent">TODAY</Tag> : <span style={{ color: acc, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>→</span>}
                  </div>
                </div>
              ))}
            </div>
            <Note style={{ bottom: 16, right: 18 }} arrow="r" color={acc}>scroll-driven depth</Note>
          </div>

          {/* Magazine rack */}
          <div style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 6, padding: 18, position: "relative" }}>
            <Head eyebrow="// RACK · COVERAGE" title="Magazine rack." level={2} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {NEWS.slice(0, 4).map((n, i) => (
                <div key={i} style={{ border: "1.5px solid var(--wf-stroke)", borderRadius: 4, padding: 12, transform: `rotate(${i % 2 ? 1 : -0.6}deg)`, background: "var(--wf-paper)", boxShadow: "0 6px 14px rgba(0,0,0,0.35)" }}>
                  <Tag kind="accent">{n.feed}</Tag>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, lineHeight: 1.1, marginTop: 8 }}>{n.t}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--wf-muted)", letterSpacing: "0.14em", marginTop: 8, textTransform: "uppercase" }}>{n.src} · {n.h}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Callouts
          side="left"
          top={460}
          style={{ left: 8 }}
          items={[
            "Cards = real CSS 3D transforms (perspective + tilt)",
            "View transitions: card → fullscreen game page",
            "Scroll-driven parallax: front shelves move faster",
            "Drag-scroll shelves with snap points",
          ]}
        />
      </div>
    </Sheet>
  );
}

window.Cabinet = Cabinet;

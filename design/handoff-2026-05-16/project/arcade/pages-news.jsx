/* News page — four rails (Dev · Gaming · Review · Preview). Wire-feed feel. */

function NewsPage({ onNavigate }) {
  const G = window.GTD;
  const [activeRail, setActiveRail] = useState("all"); // all | dev | gaming | review | preview

  const rails = [
    { id: "dev", title: "Game Dev", desc: "Engine releases, tooling, middleware, store policy, production craft, and the business of making games.", color: "var(--pc)", sources: ["Game Developer", "GDC", "Godot", "Unity", "Unreal Engine", "Steamworks", "How To Market A Game"] },
    { id: "gaming", title: "Gaming", desc: "Platform moves, releases, notable studio stories, and the wider games industry.", color: "var(--brand)", sources: ["IGN", "Eurogamer", "GamesIndustry.biz", "Polygon", "Rock Paper Shotgun", "Steam", "PlayStation Blog", "Xbox Wire"] },
    { id: "review", title: "Reviews", desc: "Final verdicts and scored criticism from the major outlets we trust.", color: "var(--xbox)", sources: ["IGN", "GameSpot", "Eurogamer", "PC Gamer", "GamesRadar+", "Rock Paper Shotgun"] },
    { id: "preview", title: "Previews", desc: "Hands-on impressions, showcase reactions, and unscored first looks.", color: "var(--ps)", sources: ["IGN", "GameSpot", "Eurogamer", "PC Gamer", "GamesRadar+", "PlayStation Blog", "Xbox Wire"] },
  ];

  const visibleRails = activeRail === "all" ? rails : rails.filter((r) => r.id === activeRail);

  return (
    <main className="rise">
      {/* Hero */}
      <section className="shell" style={{ paddingTop: 40 }}>
        <div className="eyebrow"><span className="acc">// 03</span> Curated wire · last 24 hours</div>
        <h1 className="display" style={{ fontSize: "clamp(3.4rem, 8vw, 6.4rem)", margin: "10px 0 0" }}>
          Four feeds,<br />
          <span className="acc">one watch desk.</span>
        </h1>
        <p style={{ maxWidth: 720, color: "var(--ink-2)", lineHeight: 1.6, marginTop: 18, fontSize: 16 }}>
          Game-dev craft, platform & industry stories, scored reviews, and unscored previews — split into four rails. Sourced from the wider games press, filtered to Windows PC, Xbox, and PlayStation only.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginTop: 28, border: "2px solid var(--ink)" }}>
          {[{ id: "all", label: "All rails", color: "var(--ink)" }, ...rails.map((r) => ({ id: r.id, label: r.title, color: r.color }))].map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveRail(t.id)}
              style={{
                padding: "14px 22px",
                borderLeft: i ? "2px solid var(--ink)" : "none",
                fontFamily: "var(--mono)", fontWeight: 800, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
                background: activeRail === t.id ? t.color : "transparent",
                color: activeRail === t.id ? "var(--bg)" : t.color,
                flex: 1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Honest disclosure about example feed */}
        <div style={{ marginTop: 14, padding: "10px 14px", border: "1.5px dashed var(--line-strong)", display: "flex", gap: 12, alignItems: "center", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          <span className="acc" style={{ color: "var(--brand)" }}>◇ PROVISIONAL</span>
          Items shown are examples in the brand voice. The live pipeline fills these rails on a separate schedule.
        </div>
      </section>

      {/* Rails */}
      {visibleRails.map((rail, idx) => {
        const items = G.NEWS.filter((n) => n.feed === rail.id);
        return (
          <section key={rail.id} className="shell" style={{ marginTop: 50 }}>
            <RailHeader rail={rail} count={items.length} no={idx + 1} />
            <div className="row-grid">
              {items.map((n, i) => (
                <NewsRow key={i} item={n} feedColor={rail.color} />
              ))}
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
              <span className="eyebrow">Sources · {rail.sources.join(" · ")}</span>
              <button className="btn btn--ghost" style={{ padding: "8px 12px", fontSize: 10 }}>
                Full {rail.title} archive <span className="arrow">→</span>
              </button>
            </div>
          </section>
        );
      })}

      <div style={{ marginTop: 56 }}>
        <Marquee items={[
          "FOUR RAILS — DEV · GAMING · REVIEW · PREVIEW",
          "FILTERED TO PC · XBOX · PLAYSTATION",
          "NOT A FEED FIREHOSE — A CURATED WATCH DESK",
          "REFRESHED ON A SEPARATE PIPELINE",
        ]} />
      </div>
    </main>
  );
}

function RailHeader({ rail, count, no }) {
  return (
    <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 16, marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 14, height: 14, background: rail.color }} />
        <span className="eyebrow">// {String(no).padStart(2, "0")} · {rail.title.toUpperCase()} WIRE · {count} items</span>
      </div>
      <h2 className="display" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", marginTop: 8, color: rail.color }}>{rail.title}</h2>
      <p style={{ margin: "10px 0 0", color: "var(--ink-2)", fontSize: 14, maxWidth: 720, lineHeight: 1.5 }}>{rail.desc}</p>
    </div>
  );
}

function NewsRow({ item, feedColor }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "12px 110px 1fr 220px auto",
      alignItems: "stretch",
      transition: "background 0.18s ease",
      cursor: "pointer",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,239,231,0.04)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ background: feedColor }} />
      <div style={{ padding: "20px 16px", borderLeft: "2px solid var(--ink)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 6 }}>
        <span className="eyebrow" style={{ color: feedColor }}>{item.h}</span>
        <span className="eyebrow" style={{ fontSize: 9 }}>{item.tag?.toUpperCase()}</span>
      </div>
      <div style={{ padding: "22px 24px", borderLeft: "2px solid var(--ink)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="display glitch" style={{ fontSize: 24, lineHeight: 1.0 }}>{item.t}</div>
        <div className="eyebrow" style={{ marginTop: 8, fontSize: 10 }}>
          {item.src}
          {item.score && <> · <span className="acc" style={{ color: "var(--brand)" }}>{item.score > 10 ? Math.round(item.score / 10) : item.score}/10</span></>}
        </div>
      </div>
      <div style={{ padding: "22px 24px", borderLeft: "2px solid var(--ink)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {item.platforms && <PlatformRow ids={item.platforms} boxed short />}
      </div>
      <div style={{ padding: "0 20px", borderLeft: "2px solid var(--ink)", display: "grid", placeItems: "center", minWidth: 80 }}>
        <span style={{ fontFamily: "var(--mono)", fontWeight: 800, fontSize: 16, color: feedColor }}>→</span>
      </div>
    </div>
  );
}

window.NewsPage = NewsPage;

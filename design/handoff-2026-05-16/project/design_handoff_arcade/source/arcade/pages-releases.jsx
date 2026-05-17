/* Releases page — full slate, filter by platform, grouped by month. */

function ReleasesPage({ onNavigate }) {
  const G = window.GTD;
  const [filter, setFilter] = useState("all"); // all | pc | xbox | ps | ours
  const [view, setView] = useState("list"); // list | grid

  const releases = useMemo(() => {
    return G.RELEASES
      .map((r) => ({ ...r, _t: new Date(r.date + "T22:00:00Z").getTime() }))
      .filter((r) => r._t > Date.now() - 24 * 3600 * 1000)
      .sort((a, b) => a._t - b._t)
      .filter((r) => {
        if (filter === "all") return true;
        if (filter === "ours") return r.ours;
        return r.platforms.includes(filter);
      });
  }, [filter]);

  // Group by month label
  const grouped = useMemo(() => {
    const m = {};
    releases.forEach((r) => {
      const d = new Date(r.date + "T00:00:00Z");
      const key = d.toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
      if (!m[key]) m[key] = [];
      m[key].push(r);
    });
    return m;
  }, [releases]);

  const filters = [
    { id: "all", label: "All", color: "var(--ink)" },
    { id: "pc", label: "PC", color: "var(--pc)" },
    { id: "xbox", label: "Xbox", color: "var(--xbox)" },
    { id: "ps", label: "PS5", color: "var(--ps)" },
    { id: "ours", label: "Ours", color: "var(--brand)" },
  ];

  return (
    <main className="rise">
      {/* Hero */}
      <section className="shell" style={{ paddingTop: 40 }}>
        <div className="eyebrow"><span className="acc">// 01</span> Release radar · Windows PC · Xbox · PlayStation</div>
        <h1 className="display" style={{ fontSize: "clamp(3.4rem, 8vw, 6.4rem)", margin: "10px 0 0" }}>
          The card,<br />
          <span className="acc">ninety days</span> out.
        </h1>
        <p style={{ maxWidth: 640, color: "var(--ink-2)", lineHeight: 1.6, marginTop: 18, fontSize: 16 }}>
          Every tracked release on the three platforms we cover. Filter by platform to scan one slate at a time. Days marked <span className="acc" style={{ color: "var(--brand)" }}>★</span> are our own studio drops.
        </p>

        {/* Filter row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26, flexWrap: "wrap" }}>
          <span className="eyebrow" style={{ marginRight: 4 }}>Filter ·</span>
          {filters.map((f) => (
            <button
              key={f.id}
              className="btn"
              onClick={() => setFilter(f.id)}
              style={{
                padding: "10px 14px",
                background: filter === f.id ? f.color : "transparent",
                color: filter === f.id ? "var(--bg)" : f.color,
                borderColor: f.color,
              }}
            >
              {filter === f.id && "●"} {f.label}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 0, border: "2px solid var(--ink)" }}>
            <button onClick={() => setView("list")} style={{ padding: "10px 14px", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", background: view === "list" ? "var(--ink)" : "transparent", color: view === "list" ? "var(--bg)" : "var(--ink)" }}>List</button>
            <button onClick={() => setView("grid")} style={{ padding: "10px 14px", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", borderLeft: "2px solid var(--ink)", background: view === "grid" ? "var(--ink)" : "transparent", color: view === "grid" ? "var(--bg)" : "var(--ink)" }}>Grid</button>
          </div>
        </div>
      </section>

      {/* Grouped releases */}
      <section className="shell" style={{ marginTop: 36 }}>
        {Object.keys(grouped).map((monthKey, mi) => {
          const items = grouped[monthKey];
          const count = items.length;
          return (
            <div key={monthKey} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "2px solid var(--ink)", paddingBottom: 12, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                  <span className="bignum" style={{ fontSize: 14, color: "var(--brand)", letterSpacing: "0.2em", fontFamily: "var(--mono)", textTransform: "uppercase" }}>// {String(mi + 1).padStart(2, "0")}</span>
                  <h2 className="display" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", textTransform: "uppercase", margin: 0 }}>{monthKey}</h2>
                </div>
                <span className="tag">{count} {count === 1 ? "DROP" : "DROPS"}</span>
              </div>
              {view === "list" ? (
                <div className="row-grid">
                  {items.map((r, i) => (
                    <ReleaseRow key={r.id} release={r} index={i + 1} />
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "2px solid var(--ink)" }}>
                  {items.map((r, i) => (
                    <ReleaseCard key={r.id} release={r} colIndex={i} colCount={items.length} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(grouped).length === 0 && (
          <div style={{ padding: "60px 0", textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--mono)", letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12 }}>
            Nothing in this filter — try another platform.
          </div>
        )}
      </section>

      {/* Filter legend at bottom */}
      <section className="shell" style={{ marginTop: 40 }}>
        <SectionHead no="//" title="Platform legend" />
        <div className="cols-4">
          {["pc", "xbox", "ps", "browser"].map((id) => {
            const p = G.PLATFORMS[id];
            return (
              <div key={id} style={{ padding: 22 }}>
                <div style={{ width: 36, height: 36, background: p.color, marginBottom: 14 }} />
                <div className="display" style={{ fontSize: 22, lineHeight: 1, color: p.color }}>{p.long}</div>
                <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--mono)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  {id === "pc" && "Steam · GOG · Epic · Xbox app · EA"}
                  {id === "xbox" && "Series X · Series S · Game Pass"}
                  {id === "ps" && "PS5 · PS Plus · PS Store"}
                  {id === "browser" && "Itch · GitHub Pages · Web demos"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <Marquee items={[
        "FILTER · PLATFORM",
        "RELEASE TRACKING FOR PC · XBOX · PLAYSTATION",
        "OUR DEMOS HIGHLIGHTED IN BRAND RED",
        "DATA FROM THE TRACKED LIST + STUDIO CALENDAR",
      ]} />
    </main>
  );
}

function ReleaseRow({ release, index }) {
  const G = window.GTD;
  const primary = release.platforms[0];
  const pColor = G.PLATFORMS[primary]?.color || "var(--ink)";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "44px 84px 1fr 1fr 200px 60px",
        alignItems: "stretch",
        background: release.ours ? "color-mix(in oklab, var(--brand) 10%, transparent)" : "transparent",
        position: "relative",
        transition: "background 0.18s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => { if (!release.ours) e.currentTarget.style.background = "rgba(244,239,231,0.04)"; }}
      onMouseLeave={(e) => { if (!release.ours) e.currentTarget.style.background = "transparent"; }}
    >
      {/* Left platform-coloured stripe */}
      <div style={{ background: pColor, display: "grid", placeItems: "center", color: "var(--bg)", fontFamily: "var(--mono)", fontWeight: 800, fontSize: 11, letterSpacing: "0.2em" }}>
        {String(index).padStart(2, "0")}
      </div>
      <div style={{ borderLeft: "2px solid var(--ink)" }}>
        <DateBlock iso={release.date} accent={pColor} />
      </div>
      <div style={{ padding: "18px 22px", borderLeft: "2px solid var(--ink)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="display glitch" style={{ fontSize: 28, lineHeight: 0.95 }}>
          {release.title}{release.ours && <span className="acc" style={{ color: "var(--brand)" }}> ★</span>}
        </div>
        <div className="eyebrow" style={{ marginTop: 6, fontSize: 10 }}>
          {release.genre}
          {release.hype === "high" && <> · <span className="acc" style={{ color: "var(--brand)" }}>HIGH SIGNAL</span></>}
        </div>
      </div>
      <div style={{ padding: "18px 22px", borderLeft: "2px solid var(--ink)", display: "flex", alignItems: "center" }}>
        <LauncherList launchers={release.launcher} />
      </div>
      <div style={{ padding: "18px 22px", borderLeft: "2px solid var(--ink)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <PlatformRow ids={release.platforms} boxed short />
      </div>
      <div style={{ borderLeft: "2px solid var(--ink)", display: "grid", placeItems: "center", color: pColor, fontFamily: "var(--mono)", fontWeight: 800, fontSize: 16 }}>
        →
      </div>
    </div>
  );
}

function ReleaseCard({ release, colIndex, colCount }) {
  const G = window.GTD;
  const primary = release.platforms[0];
  const pColor = G.PLATFORMS[primary]?.color || "var(--ink)";
  const isNewRow = colIndex >= 3;
  return (
    <div style={{
      padding: 18,
      borderLeft: colIndex % 3 ? "2px solid var(--ink)" : "none",
      borderTop: isNewRow ? "2px solid var(--ink)" : "none",
      background: release.ours ? "color-mix(in oklab, var(--brand) 10%, transparent)" : "transparent",
      minHeight: 200,
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: pColor }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8 }}>
        <DateBlock iso={release.date} accent={pColor} />
        <PlatformRow ids={release.platforms} boxed short />
      </div>
      <div className="display glitch" style={{ fontSize: 26, lineHeight: 0.95, marginTop: 14 }}>
        {release.title}{release.ours && <span className="acc" style={{ color: "var(--brand)" }}> ★</span>}
      </div>
      <div className="eyebrow" style={{ marginTop: 8, fontSize: 10 }}>{release.genre}</div>
      <div style={{ marginTop: 14 }}>
        <LauncherList launchers={release.launcher} />
      </div>
    </div>
  );
}

window.ReleasesPage = ReleasesPage;

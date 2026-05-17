/* Reviews page — curated outlet coverage + review literacy. */

function ReviewsPage({ onNavigate }) {
  const G = window.GTD;
  const reviews = G.NEWS.filter((n) => n.feed === "review");
  const previews = G.NEWS.filter((n) => n.feed === "preview");

  // The "featured" review = highest score
  const featured = [...reviews].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  const others = reviews.filter((r) => r !== featured);

  const heroArt = G.STUDIO.find((g) => g.id === "starfall-protocol")?.art;

  return (
    <main className="rise">
      {/* Hero */}
      <section className="shell" style={{ paddingTop: 40 }}>
        <div className="eyebrow"><span className="acc">// 04</span> Critical coverage · curated, not personal-review led</div>
        <h1 className="display" style={{ fontSize: "clamp(3.4rem, 8vw, 6.4rem)", margin: "10px 0 0" }}>
          Verdicts<br />
          <span className="acc">worth your time.</span>
        </h1>
        <p style={{ maxWidth: 720, color: "var(--ink-2)", lineHeight: 1.6, marginTop: 18, fontSize: 16 }}>
          Reviews and previews from the outlets we actually read — IGN, Eurogamer, RPS, PC Gamer, Edge, GamesRadar. We don't write house verdicts. We curate the ones that pay attention.
        </p>
      </section>

      {/* Featured review */}
      {featured && (
        <section className="shell" style={{ marginTop: 36 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", border: "2px solid var(--ink)" }}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <GameArt src={heroArt} height={460} />
              <div style={{ position: "absolute", top: 22, left: 22 }}>
                <span className="tag brand">FEATURED VERDICT</span>
              </div>
              <div style={{ position: "absolute", bottom: 22, right: 22, transform: "rotate(-6deg)" }}>
                <ScoreStamp score={featured.score} size={120} />
              </div>
            </div>
            <div style={{ padding: "34px 32px", borderLeft: "2px solid var(--ink)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="eyebrow">{featured.src} · {featured.h}</span>
              <div className="display glitch" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 0.96, marginTop: 12 }}>
                {featured.t}
              </div>
              <p style={{ margin: "20px 0 0", color: "var(--ink-2)", fontSize: 15, lineHeight: 1.6, borderLeft: "3px solid var(--brand)", paddingLeft: 14 }}>
                "Restrained, patient design that trusts its player. Every system earns its place before the campaign even hits act two."
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 22, flexWrap: "wrap" }}>
                {featured.platforms && <PlatformRow ids={featured.platforms} boxed short />}
                <button className="btn btn--brand" style={{ padding: "10px 14px" }}>Read at {featured.src.split(" ")[0]} <span className="arrow">→</span></button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other reviews — grid w/ score stamps */}
      <section className="shell" style={{ marginTop: 50 }}>
        <SectionHead
          no="// 05"
          title="More reviews"
          meta={<span className="tag">{reviews.length} VERDICTS</span>}
        />
        <div className="cols-3 rise-stagger">
          {others.map((r, i) => (
            <ReviewCard key={i} item={r} colIndex={i} colCount={others.length} accent="var(--xbox)" />
          ))}
        </div>
      </section>

      {/* Previews */}
      <section className="shell" style={{ marginTop: 50 }}>
        <SectionHead
          no="// 06"
          title="Previews & first-looks"
          meta={<span className="tag">{previews.length} UNSCORED</span>}
        />
        <div className="row-grid">
          {previews.map((p, i) => (
            <PreviewRow key={i} item={p} />
          ))}
        </div>
      </section>

      {/* Review literacy */}
      <section className="shell" style={{ marginTop: 64 }}>
        <SectionHead
          no="// 07"
          title="How we read scores"
          meta={<span className="tag">REVIEW LITERACY · 5 GUIDES</span>}
        />
        <div className="cols-2 rise-stagger" style={{ marginBottom: -2 }}>
          {G.REVIEW_LITERACY.slice(0, 2).map((s, i) => (
            <LiteracyCard key={s.id} section={s} no={i + 1} />
          ))}
        </div>
        <div className="cols-3" style={{ borderTop: 0 }}>
          {G.REVIEW_LITERACY.slice(2, 5).map((s, i) => (
            <LiteracyCard key={s.id} section={s} no={i + 3} compact />
          ))}
        </div>
      </section>

      <div style={{ marginTop: 56 }}>
        <Marquee items={[
          "CURATED VERDICTS",
          "NO HOUSE REVIEWS · NO SLOP",
          "WE SHOW THE WORKING — HOW SCORES ARE MADE",
          "FIVE GUIDES · ONE SHARED LANGUAGE",
        ]} />
      </div>
    </main>
  );
}

function ReviewCard({ item, colIndex, accent }) {
  const isNewRow = colIndex >= 3;
  return (
    <div style={{
      padding: "26px 24px 22px",
      borderTop: isNewRow ? "2px solid var(--ink)" : "none",
      position: "relative",
      minHeight: 220,
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: accent }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className="eyebrow" style={{ color: accent }}>{item.src} · {item.h}</span>
        {item.score && <ScoreStamp score={item.score} size={50} />}
      </div>
      <div className="display glitch" style={{ fontSize: 22, lineHeight: 1.0, marginTop: 14 }}>{item.t}</div>
      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, gap: 10, flexWrap: "wrap" }}>
        {item.platforms ? <PlatformRow ids={item.platforms} boxed short /> : <span />}
        <span className="eyebrow" style={{ color: accent }}>Read →</span>
      </div>
    </div>
  );
}

function PreviewRow({ item }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "12px 1fr 1fr 200px 60px",
      alignItems: "stretch",
    }}>
      <div style={{ background: "var(--ps)" }} />
      <div style={{ padding: "20px 24px", borderLeft: "2px solid var(--ink)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <span className="eyebrow" style={{ color: "var(--ps)" }}>PREVIEW · UNSCORED</span>
        <div className="display glitch" style={{ fontSize: 24, lineHeight: 0.95, marginTop: 6 }}>{item.t}</div>
      </div>
      <div style={{ padding: "20px 24px", borderLeft: "2px solid var(--ink)", display: "flex", alignItems: "center" }}>
        <span className="eyebrow">{item.src} · {item.h}</span>
      </div>
      <div style={{ padding: "20px 24px", borderLeft: "2px solid var(--ink)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {item.platforms && <PlatformRow ids={item.platforms} boxed short />}
      </div>
      <div style={{ borderLeft: "2px solid var(--ink)", display: "grid", placeItems: "center", color: "var(--ps)", fontFamily: "var(--mono)", fontWeight: 800, fontSize: 16 }}>→</div>
    </div>
  );
}

function LiteracyCard({ section, no, compact = false }) {
  return (
    <div style={{
      padding: compact ? "24px 22px" : "30px 28px",
      minHeight: compact ? 180 : 220,
      display: "flex", flexDirection: "column", gap: 10,
      position: "relative",
    }}>
      <span className="bignum" style={{ fontSize: compact ? 36 : 52, color: "var(--brand)", lineHeight: 0.85 }}>
        {String(no).padStart(2, "0")}
      </span>
      <div className="display" style={{ fontSize: compact ? 22 : 28, lineHeight: 0.95, marginTop: 4 }}>{section.t}</div>
      <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55 }}>{section.b}</p>
      <span className="eyebrow" style={{ marginTop: "auto", color: "var(--brand)" }}>Read the guide →</span>
    </div>
  );
}

window.ReviewsPage = ReviewsPage;

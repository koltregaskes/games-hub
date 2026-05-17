/* GameTrackDaily — Arcade app router.
   Hash-based routing + view-transition aware navigation. */

const { useState: useS, useEffect: useE } = React;

function App() {
  const [route, setRoute] = useS(() => {
    const h = window.location.hash.replace(/^#\//, "");
    return ["home", "releases", "events", "news", "reviews"].includes(h) ? h : "home";
  });

  useE(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#\//, "");
      setRoute(["home", "releases", "events", "news", "reviews"].includes(h) ? h : "home");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (id) => {
    const go = () => {
      window.location.hash = `#/${id}`;
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    // View Transitions API if available — falls back instantly otherwise
    if (document.startViewTransition) {
      document.startViewTransition(go);
    } else {
      go();
    }
  };

  // Top marquee — global; rotates messages
  const tickerItems = [
    "● LIVE",
    "CRIMSON SKYLINES — DROPS TONIGHT 22:00 BST",
    "SUMMER GAME FEST IN 18D",
    "OURS — MANDATE 2029 DEMO IN 21D",
    "14 NEW REVIEWS · 06 LAUNCHES · 11 EVENTS",
    "BUILT FOR PLAYERS WHO WATCH THE CARD",
  ];

  let Page;
  if (route === "home") Page = HomePage;
  else if (route === "releases") Page = ReleasesPage;
  else if (route === "events") Page = EventsPage;
  else if (route === "news") Page = NewsPage;
  else if (route === "reviews") Page = ReviewsPage;
  else Page = HomePage;

  return (
    <>
      <div className="page-bg" />
      <Marquee items={tickerItems} />
      <Nav route={route} onNavigate={navigate} />
      <Page onNavigate={navigate} key={route} />
      <Footer />
    </>
  );
}

window.App = App;
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

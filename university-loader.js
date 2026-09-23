(async () => {
  const params = new URLSearchParams(window.location.search);
  const selected = colleges.find(item => item.slug === params.get("id"));
  if (selected?._detailShard) {
    try {
      const response = await fetch(`data/college-details/${selected._detailShard}.json?v=1`);
      if (!response.ok) throw new Error(`College detail request failed: ${response.status}`);
      const detail = (await response.json())[selected.slug];
      if (detail) Object.assign(selected, detail);
    } catch (error) {
      console.warn("FullRide UA could not load the detailed college record.", error);
    }
  }

  const script = document.createElement("script");
  script.src = "university.js?v=7";
  script.addEventListener("error", () => {
    const root = document.getElementById("profile-root");
    if (root) root.textContent = "The university profile could not be loaded. Please refresh the page.";
  });
  document.body.append(script);
})();

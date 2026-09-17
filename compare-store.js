(function () {
  const storageKey = "fullride-compare-v1";
  const maxItems = 4;

  function load() {
    try {
      const value = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      return Array.isArray(value) ? [...new Set(value.filter(item => typeof item === "string"))].slice(0, maxItems) : [];
    } catch {
      return [];
    }
  }

  function save(items) {
    const normalized = [...new Set(items)].slice(0, maxItems);
    try { window.localStorage.setItem(storageKey, JSON.stringify(normalized)); } catch {}
    window.dispatchEvent(new CustomEvent("fullride:local-data-changed", { detail:{ kind:"comparison" } }));
    return normalized;
  }

  function toggle(slug) {
    const items = load();
    const index = items.indexOf(slug);
    if (index >= 0) {
      items.splice(index, 1);
      return { status:"removed", items:save(items) };
    }
    if (items.length >= maxItems) return { status:"limit", items };
    items.push(slug);
    return { status:"added", items:save(items) };
  }

  function remove(slug) {
    return save(load().filter(item => item !== slug));
  }

  function clear() {
    return save([]);
  }

  window.FullRideCompare = { storageKey, maxItems, load, save, toggle, remove, clear };
})();

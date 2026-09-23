globalThis.FullRideCollegeData = (() => {
  const shardRequests = new Map();

  async function fetchShard(name) {
    if (!shardRequests.has(name)) {
      shardRequests.set(name, fetch(`data/college-details/${name}.json?v=1`).then(response => {
        if (!response.ok) throw new Error(`College data request failed: ${response.status}`);
        return response.json();
      }).catch(error => {
        shardRequests.delete(name);
        throw error;
      }));
    }
    return shardRequests.get(name);
  }

  async function load(items) {
    const pending = items.filter(item => item && !item._detailsLoaded && item._detailShard);
    const groups = new Map();
    pending.forEach(item => {
      if (!groups.has(item._detailShard)) groups.set(item._detailShard, []);
      groups.get(item._detailShard).push(item);
    });
    await Promise.all([...groups].map(async ([shard, colleges]) => {
      const records = await fetchShard(shard);
      colleges.forEach(college => {
        if (records[college.slug]) Object.assign(college, records[college.slug]);
      });
    }));
    return items;
  }

  return { load };
})();

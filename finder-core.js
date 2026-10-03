/* Pure catalogue matching; federal figures are reference data, not an aid estimate. */
globalThis.FullRideFinder = (() => {
  const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  function textMatches(college, query) {
    const terms = normalize(query).split(' ').filter(Boolean);
    const name = normalize(`${college.name} ${college.short} ${college.location} ${college._searchText || ''}`);
    return terms.every(term => name.includes(term));
  }
  function factsMatch(college, filters) {
    const f = college.finderFacts || {};
    if (filters.degree && String(f.degree) !== filters.degree) return false;
    if (filters.control && String(f.control) !== filters.control) return false;
    if (filters.budget && (!Number.isFinite(f.tuition) || f.tuition > Number(filters.budget))) return false;
    if (filters.size && (!Number.isFinite(f.enrollment) || !(filters.size === 'small' ? f.enrollment < 5000 : filters.size === 'medium' ? f.enrollment >= 5000 && f.enrollment < 15000 : f.enrollment >= 15000))) return false;
    return true;
  }
  function sorted(items, order, query) {
    const name = normalize(query);
    const terms=name.split(' ').filter(Boolean);
    const rank = college => {
      const title=normalize(college.name);
      if(title===name || normalize(college.short)===name)return 0;
      if(title.startsWith(name))return 1;
      const missing=terms.filter(term=>!title.includes(term)).length;
      return 2 + missing * 100 + title.split(' ').length;
    };
    return [...items].sort((a,b) => {
      if (order === 'tuition') {
        const av = a.finderFacts?.tuition, bv = b.finderFacts?.tuition;
        const cost = (Number.isFinite(av) ? av : Infinity) - (Number.isFinite(bv) ? bv : Infinity);
        if (cost && !Number.isNaN(cost)) return cost;
      }
      if (order === 'verified' && a.verified !== b.verified) return Number(b.verified) - Number(a.verified);
      if (order === 'relevance' && name) { const diff = rank(a) - rank(b); if (diff) return diff; }
      return a.name.localeCompare(b.name, 'en');
    });
  }
  return { normalize, textMatches, factsMatch, sorted };
})();

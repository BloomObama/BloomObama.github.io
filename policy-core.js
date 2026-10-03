/* Shared field-level admissions contract. HTTP reachability is never verification. */
(function (root) {
  const fields = Object.freeze(['aid', 'testing', 'english', 'fee', 'deadline']);
  const cycle = '2026–27';
  function field(college, key) {
    const explicit = college.policyFields?.[key];
    if (explicit) return explicit;
    if (college.policyMask != null && !college.verified) return {status:(college.policyMask & (1 << fields.indexOf(key))) ? 'verified' : 'pending',value:college[key],source:college[key+'Source']};
    if (college.verified) return { status:'verified', value:college[key], source:college[key + 'Source'], checkedAt:college.checkedAt, cycle, method:'legacy-editorial' };
    return { status:'pending' };
  }
  const known = (college, key) => field(college, key).status === 'verified';
  const count = college => college.policyCoverage ?? fields.filter(key => known(college, key)).length;
  function apply(college, record) {
    if (!record) return;
    // Existing full editorial audits remain intact unless explicitly superseded.
    const merged = Object.fromEntries(fields.map(key => [key, field(college, key)]));
    for (const [key, review] of Object.entries(record.fields)) {
      if (!fields.includes(key)) throw new Error('Unknown policy field: ' + key);
      merged[key] = review;
      college[key] = review.status === 'verified' ? review.value : null;
      college[key + 'Source'] = review.source || null;
      if (key === 'aid') { college.needBlind = null; college.aidCategory = 'unverified'; college.aidShort = null; }
      if (key === 'testing') college.testFlexible = null;
      if (key === 'english') college.englishStatus = 'unverified';
      if (key === 'fee') college.feeWaiver = null;
      if (review.status === 'verified') Object.assign(college, review.attributes || {});
    }
    college.policyFields = merged;
    college.policyCoverage = fields.filter(key => merged[key].status === 'verified').length;
    college.verified = college.policyCoverage === 5;
    college.checkedAt = college.verified ? fields.map(key => merged[key].checkedAt).sort()[0] : null;
  }
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const api = Object.freeze({ fields, cycle, field, known, count, apply, escape });
  root.FullRidePolicy = api;
  if (typeof module !== 'undefined') module.exports = api;
})(globalThis);

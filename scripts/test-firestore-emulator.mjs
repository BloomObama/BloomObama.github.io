import assert from 'node:assert/strict';

const projectId = process.env.GCLOUD_PROJECT || 'fullrideua';
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const authBase = `http://${authHost}`;
const firestoreBase = `http://${firestoreHost}/v1/projects/${projectId}/databases/(default)/documents`;

async function jsonRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers:{ 'content-type':'application/json', ...(options.headers || {}) }
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { status:response.status, body };
}

async function verifiedUser(email) {
  const password = 'Local-test-password-19!';
  const created = await jsonRequest(`${authBase}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key`, {
    method:'POST', body:JSON.stringify({ email, password, returnSecureToken:true })
  });
  assert.equal(created.status, 200, `create ${email}`);
  const uid = created.body.localId;
  const requested = await jsonRequest(`${authBase}/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=fake-key`, {
    method:'POST', body:JSON.stringify({ requestType:'VERIFY_EMAIL', idToken:created.body.idToken })
  });
  assert.equal(requested.status, 200, `request verification ${email}`);
  const pending = await jsonRequest(`${authBase}/emulator/v1/projects/${projectId}/oobCodes`);
  const code = pending.body?.oobCodes?.find(item => item.email === email && item.requestType === 'VERIFY_EMAIL')?.oobCode;
  assert.ok(code, `verification code ${email}`);
  const verified = await jsonRequest(`${authBase}/identitytoolkit.googleapis.com/v1/accounts:update?key=fake-key`, {
    method:'POST', body:JSON.stringify({ oobCode:code })
  });
  assert.equal(verified.status, 200, `verify ${email}`);
  const signedIn = await jsonRequest(`${authBase}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-key`, {
    method:'POST', body:JSON.stringify({ email, password, returnSecureToken:true })
  });
  assert.equal(signedIn.status, 200, `sign in ${email}`);
  return { uid, token:signedIn.body.idToken };
}

async function unverifiedUser(email) {
  const password = 'Local-test-password-19!';
  const created = await jsonRequest(`${authBase}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key`, {
    method:'POST', body:JSON.stringify({ email, password, returnSecureToken:true })
  });
  assert.equal(created.status, 200, `create unverified ${email}`);
  return { uid:created.body.localId, token:created.body.idToken };
}

const authHeader = token => token ? { authorization:`Bearer ${token}` } : {};
const emptyArray = { arrayValue:{ values:[] } };
const validUserFields = name => ({
  displayName:{ stringValue:name }, shortlist:emptyArray, comparison:emptyArray,
  flashcards:emptyArray, packLearned:emptyArray,
  createdAt:{ timestampValue:'2026-01-01T00:00:00Z' }, updatedAt:{ timestampValue:'2026-01-01T00:00:00Z' }
});
const pathFor = path => `${firestoreBase}/${path}`;
const write = (path, token, fields) => jsonRequest(pathFor(path), { method:'PATCH', headers:authHeader(token), body:JSON.stringify({ fields }) });
const read = (path, token) => jsonRequest(pathFor(path), { headers:authHeader(token) });
const remove = (path, token) => jsonRequest(pathFor(path), { method:'DELETE', headers:authHeader(token) });
const query = (collectionId, token, allDescendants = false) => jsonRequest(`${firestoreBase}:runQuery`, {
  method:'POST', headers:authHeader(token), body:JSON.stringify({
    structuredQuery:{ from:[{ collectionId, allDescendants }] }
  })
});
const serverWrite = (path, token, fields) => jsonRequest(`${firestoreBase}:commit`, {
  method:'POST', headers:authHeader(token), body:JSON.stringify({ writes:[{
    update:{ name:`projects/${projectId}/databases/(default)/documents/${path}`, fields },
    updateTransforms:[{ fieldPath:'updatedAt', setToServerValue:'REQUEST_TIME' }]
  }] })
});
const allowed = (result, label) => assert.ok(result.status >= 200 && result.status < 300, `${label}: expected ALLOW, got ${result.status}`);
const denied = (result, label) => assert.ok(result.status === 401 || result.status === 403, `${label}: expected DENY, got ${result.status}`);

const userA = await verifiedUser('rules-a@example.com');
const userB = await verifiedUser('rules-b@example.com');
const admin = await verifiedUser('admitvector@gmail.com');
const unverified = await unverifiedUser('rules-unverified@example.com');
const userAPath = `users/${userA.uid}`;
const userBPath = `users/${userB.uid}`;

denied(await read(userAPath), 'anonymous private read');
denied(await write(userAPath, null, validUserFields('Anonymous')), 'anonymous private write');
denied(await remove(userAPath), 'anonymous private delete');
denied(await read('users'), 'anonymous private list');
denied(await query('users'), 'anonymous private query');
denied(await write(`users/${unverified.uid}`, unverified.token, validUserFields('Unverified')), 'unverified account write');
denied(await read(`users/${unverified.uid}`, unverified.token), 'unverified account read');
allowed(await write(userAPath, userA.token, validUserFields('User A')), 'user create own');
allowed(await read(userAPath, userA.token), 'user read own');
allowed(await write(userAPath, userA.token, validUserFields('User A updated')), 'user update own');
denied(await read('users', userA.token), 'user list private profiles');
denied(await query('users', userA.token), 'user query private profiles');
denied(await read(userAPath, userB.token), 'user read another');
denied(await write(userAPath, userB.token, validUserFields('Hijack')), 'user update another');
denied(await remove(userAPath, userB.token), 'user delete another');
denied(await write(userBPath, userA.token, validUserFields('Wrong UID')), 'user create as another UID');
denied(await write(userAPath, userA.token, { ...validUserFields('User A'), role:{stringValue:'admin'} }), 'user privilege escalation field');
denied(await write(userAPath, userA.token, { ...validUserFields('x'.repeat(81)) }), 'oversized display name');
denied(await write(userAPath, userA.token, { ...validUserFields('User A'), shortlist:{arrayValue:{values:Array.from({length:5003},()=>({stringValue:'x'}))}} }), 'oversized shortlist');
denied(await write(userAPath, userA.token, { ...validUserFields('User A'), flashcards:{arrayValue:{values:Array.from({length:501},()=>({mapValue:{fields:{}}}))}} }), 'oversized flashcards');
denied(await read(`users/${userA.uid}/private/example`, userA.token), 'nested private collection default deny');
denied(await query('private', userA.token, true), 'nested collection-group query default deny');
denied(await read('universities/example'), 'Firestore university record is not public because catalogue is static');
denied(await write('universities/example', userA.token, { name:{stringValue:'Changed'} }), 'untrusted university write');

const summaryAPath = `memberSummaries/${userA.uid}`;
const summaryBPath = `memberSummaries/${userB.uid}`;
const summaryA = { email:{stringValue:'rules-a@example.com'}, displayName:{stringValue:'User A'} };
denied(await read(summaryAPath), 'anonymous summary read');
denied(await read('memberSummaries'), 'anonymous summary list');
denied(await serverWrite(summaryAPath, null, summaryA), 'anonymous summary create');
allowed(await serverWrite(summaryAPath, userA.token, summaryA), 'user create own summary');
allowed(await read(summaryAPath, userA.token), 'user get own summary');
allowed(await serverWrite(summaryAPath, userA.token, { ...summaryA, displayName:{stringValue:'User A updated'} }), 'user update own summary');
denied(await read('memberSummaries', userA.token), 'normal user list protected summaries');
denied(await query('memberSummaries', userA.token), 'normal user query protected summaries');
denied(await read(summaryAPath, userB.token), 'user get another summary');
denied(await serverWrite(summaryAPath, userB.token, summaryA), 'user update another summary');
denied(await serverWrite(summaryBPath, userA.token, summaryA), 'user create summary under another UID');
denied(await serverWrite(summaryAPath, userA.token, { ...summaryA, email:{stringValue:'forged@example.com'} }), 'user forge summary email');
denied(await serverWrite(summaryAPath, userA.token, { ...summaryA, role:{stringValue:'admin'} }), 'user add privileged summary field');
denied(await remove(summaryAPath, userB.token), 'user delete another summary');
allowed(await read('memberSummaries', admin.token), 'admin list protected summaries');
allowed(await query('memberSummaries', admin.token), 'admin query protected summaries');
allowed(await read(summaryAPath, admin.token), 'admin get protected summary');
denied(await serverWrite(summaryAPath, admin.token, summaryA), 'admin dashboard is read-only for summaries');

const activityAPath = `memberActivity/${userA.uid}`;
const activityBPath = `memberActivity/${userB.uid}`;
const activity = seconds => ({ activeSeconds:{integerValue:String(seconds)} });
denied(await read(activityAPath), 'anonymous activity read');
denied(await read('memberActivity'), 'anonymous activity list');
denied(await serverWrite(activityAPath, null, activity(30)), 'anonymous activity create');
allowed(await serverWrite(activityAPath, userA.token, activity(30)), 'user create own activity');
allowed(await read(activityAPath, userA.token), 'user get own activity');
allowed(await serverWrite(activityAPath, userA.token, activity(60)), 'user update own activity within increment limit');
denied(await serverWrite(activityAPath, userA.token, activity(121)), 'user exceed activity increment limit');
denied(await serverWrite(activityAPath, userA.token, activity(59)), 'user decrease activity counter');
denied(await serverWrite(activityBPath, userA.token, activity(10)), 'user create activity under another UID');
denied(await read(activityAPath, userB.token), 'user get another activity');
denied(await read('memberActivity', userA.token), 'normal user list protected activity');
denied(await query('memberActivity', userA.token), 'normal user query protected activity');
allowed(await read('memberActivity', admin.token), 'admin list protected activity');
allowed(await query('memberActivity', admin.token), 'admin query protected activity');
allowed(await read(activityAPath, admin.token), 'admin get protected activity');
denied(await serverWrite(activityAPath, admin.token, activity(61)), 'admin dashboard is read-only for activity');
denied(await remove(activityAPath, userB.token), 'user delete another activity');
allowed(await remove(activityAPath, userA.token), 'user delete own activity');
allowed(await remove(summaryAPath, userA.token), 'user delete own summary');
allowed(await remove(userAPath, userA.token), 'user delete own');

console.log('PASS: Firestore emulator full CRUD, get/list/query, ownership, verification, nested denial, admin isolation, field validation, activity bounds and protected university integrity');

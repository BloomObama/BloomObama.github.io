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
const allowed = (result, label) => assert.ok(result.status >= 200 && result.status < 300, `${label}: expected ALLOW, got ${result.status}`);
const denied = (result, label) => assert.ok(result.status === 401 || result.status === 403, `${label}: expected DENY, got ${result.status}`);

const userA = await verifiedUser('rules-a@example.com');
const userB = await verifiedUser('rules-b@example.com');
const admin = await verifiedUser('admitvector@gmail.com');
const userAPath = `users/${userA.uid}`;
const userBPath = `users/${userB.uid}`;

denied(await read(userAPath), 'anonymous private read');
denied(await write(userAPath, null, validUserFields('Anonymous')), 'anonymous private write');
allowed(await write(userAPath, userA.token, validUserFields('User A')), 'user create own');
allowed(await read(userAPath, userA.token), 'user read own');
allowed(await write(userAPath, userA.token, validUserFields('User A updated')), 'user update own');
denied(await read(userAPath, userB.token), 'user read another');
denied(await write(userAPath, userB.token, validUserFields('Hijack')), 'user update another');
denied(await remove(userAPath, userB.token), 'user delete another');
denied(await write(userBPath, userA.token, validUserFields('Wrong UID')), 'user create as another UID');
denied(await write(userAPath, userA.token, { ...validUserFields('User A'), role:{stringValue:'admin'} }), 'user privilege escalation field');
denied(await write(userAPath, userA.token, { ...validUserFields('x'.repeat(81)) }), 'oversized display name');
denied(await read(`users/${userA.uid}/private/example`, userA.token), 'nested private collection default deny');
denied(await write('universities/example', userA.token, { name:{stringValue:'Changed'} }), 'untrusted university write');
denied(await read('memberSummaries', userA.token), 'normal user list protected summaries');
allowed(await read('memberSummaries', admin.token), 'admin list protected summaries');
allowed(await remove(userAPath, userA.token), 'user delete own');

console.log('PASS: Firestore emulator ownership, anonymous denial, nested denial, admin isolation, field validation and protected university integrity');

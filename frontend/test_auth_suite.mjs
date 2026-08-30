// Automated test suite for CyberRaksha Authentication and API Endpoints

const BASE_URL = 'http://127.0.0.1:3000';

async function runTests() {
  console.log('=======================================================');
  console.log('  CyberRaksha Backend Auth & API Automated Test Suite');
  console.log('=======================================================');

  let passed = 0;
  let failed = 0;

  function assert(cond, label) {
    if (cond) {
      console.log(`  \x1b[32m[PASS]\x1b[0m ${label}`);
      passed++;
    } else {
      console.error(`  \x1b[31m[FAIL]\x1b[0m ${label}`);
      failed++;
    }
  }

  const testUser = {
    fullName: 'Aditya Verma',
    email: `aditya_${Date.now()}@example.com`,
    username: `aditya_${Date.now() % 10000}`,
    password: 'SecurePassword123!',
    confirmPassword: 'SecurePassword123!',
  };

  // Test 1: User Registration
  console.log('\n[1. User Registration]');
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const regData = await regRes.json();
  assert(regRes.status === 201, `Registration returned status 201 (Got ${regRes.status})`);
  assert(regData.ok === true, 'Response payload contains ok: true');
  assert(regData.message.includes('successful'), 'Response contains success message');

  // Test 2: Duplicate Email Rejection
  console.log('\n[2. Duplicate Email Check]');
  const dupEmailRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...testUser,
      username: `unique_${Date.now() % 10000}`,
    }),
  });
  assert(dupEmailRes.status === 409, `Duplicate email returned 409 (Got ${dupEmailRes.status})`);

  // Test 3: Duplicate Username Rejection
  console.log('\n[3. Duplicate Username Check]');
  const dupUserRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...testUser,
      email: `another_${Date.now()}@example.com`,
    }),
  });
  assert(dupUserRes.status === 409, `Duplicate username returned 409 (Got ${dupUserRes.status})`);

  // Test 4: Invalid Password Login
  console.log('\n[4. Invalid Login Credentials]');
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: testUser.email,
      password: 'WrongPassword!',
    }),
  });
  assert(badLoginRes.status === 401, `Invalid login returned 401 (Got ${badLoginRes.status})`);

  // Test 5: Successful Login with Email & Cookie Receipt
  console.log('\n[5. Successful Login & Session Creation]');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: testUser.email,
      password: testUser.password,
    }),
  });
  const loginData = await loginRes.json();
  const setCookieHeader = loginRes.headers.get('set-cookie');
  assert(loginRes.status === 200, `Login returned 200 OK (Got ${loginRes.status})`);
  assert(loginData.ok === true, 'Login payload contains ok: true');
  assert(loginData.user.email === testUser.email, 'Returns safe user payload');
  assert(loginData.user.passwordHash === undefined, 'Does not expose password hash');
  assert(setCookieHeader && setCookieHeader.includes('cyberraksha_token'), 'Sets HTTP-only cyberraksha_token cookie');

  // Extract auth cookie
  const authCookie = setCookieHeader.split(';')[0];

  // Test 6: Verify Authenticated Session (/api/auth/me) with Cookie
  console.log('\n[6. Verify Authenticated Session (/api/auth/me)]');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: authCookie },
  });
  const meData = await meRes.json();
  assert(meRes.status === 200, `Auth verification returned 200 (Got ${meRes.status})`);
  assert(meData.authenticated === true, 'Session is verified as authenticated');
  assert(meData.user.fullName === testUser.fullName, 'Session returns correct user full name');

  // Test 7: Unauthenticated Access Check
  console.log('\n[7. Unauthenticated Access Protection]');
  const unauthRes = await fetch(`${BASE_URL}/api/auth/me`);
  assert(unauthRes.status === 401, `Unauthenticated request returned 401 (Got ${unauthRes.status})`);

  // Test 8: Logout & Session Invalidation
  console.log('\n[8. Logout & Cookie Clear]');
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { Cookie: authCookie },
  });
  const logoutCookie = logoutRes.headers.get('set-cookie');
  assert(logoutRes.status === 200, `Logout returned 200 OK (Got ${logoutRes.status})`);
  assert(logoutCookie && (logoutCookie.includes('Max-Age=0') || logoutCookie.includes('Expires=')), 'Logout clears session cookie');

  // Test 9: Threat Scanning Endpoint
  console.log('\n[9. Threat Scanning Engine (/api/scan)]');
  const scanRes = await fetch(`${BASE_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input_type: 'url',
      url: 'http://paypal-security-update.info',
    }),
  });
  const scanData = await scanRes.json();
  assert(scanRes.status === 200, 'Scan endpoint returned 200 OK');
  assert(scanData.risk_score >= 70, `Correctly identified high-risk phishing URL (Score: ${scanData.risk_score})`);
  assert(scanData.risk_level === 'HIGH', 'Risk level classified as HIGH');
  assert(Array.isArray(scanData.red_flags) && scanData.red_flags.length > 0, 'Returns actionable red flags');

  console.log('\n=======================================================');
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=======================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

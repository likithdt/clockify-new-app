import assert from "node:assert";
import test from "node:test";
import { handleApiRoute } from "../routes/apiRouter.ts";

test("AUTH API: Default User profile matches Profile.jpeg", async () => {
  const res = await handleApiRoute({
    method: "GET",
    path: "/api/auth/me",
    query: {},
    body: null,
  });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.name, "Bindhu shree K. R");
  assert.strictEqual(res.data.email, "bindhushreebindhushree28@gmail.com");
  assert.strictEqual(res.data.avatarInitials, "BS");
  assert.strictEqual(res.data.dateTimeSettings.dateFormat, "DD/MM/YYYY");
  assert.strictEqual(res.data.dateTimeSettings.use24HourClock, true);
  assert.strictEqual(res.data.dateTimeSettings.dayStart, "09:00");
  assert.strictEqual(res.data.dateTimeSettings.setTimeZoneAutomatically, false);
  assert.strictEqual(res.data.dateTimeSettings.timeZone, "GMT+05:30 Asia/Calcutta");
});

test("AUTH API: Request and Verify OTP flow", async () => {
  const testEmail = "testuser@clockify.me";

  // 1. Send OTP
  const otpRes = await handleApiRoute({
    method: "POST",
    path: "/api/auth/otp/send",
    query: {},
    body: { email: testEmail },
  });

  assert.strictEqual(otpRes.status, 200);
  assert.ok(otpRes.data.code);
  assert.strictEqual(otpRes.data.code.length, 6);

  const generatedCode = otpRes.data.code;

  // 2. Reject incorrect OTP
  const badVerifyRes = await handleApiRoute({
    method: "POST",
    path: "/api/auth/otp/verify",
    query: {},
    body: { email: testEmail, code: "000000" },
  });
  assert.strictEqual(badVerifyRes.status, 400);

  // 3. Verify correct OTP
  const goodVerifyRes = await handleApiRoute({
    method: "POST",
    path: "/api/auth/otp/verify",
    query: {},
    body: { email: testEmail, code: generatedCode },
  });
  assert.strictEqual(goodVerifyRes.status, 200);
  assert.ok(goodVerifyRes.data.token);
  assert.strictEqual(goodVerifyRes.data.user.email, testEmail);
});

test("AUTH API: Signup and Login endpoints", async () => {
  // Sign up
  const signupRes = await handleApiRoute({
    method: "POST",
    path: "/api/auth/signup",
    query: {},
    body: {
      name: "Alex Designer",
      email: "alex@clockify.design",
    },
  });

  assert.strictEqual(signupRes.status, 201);
  assert.strictEqual(signupRes.data.user.name, "Alex Designer");
  assert.strictEqual(signupRes.data.user.email, "alex@clockify.design");
  assert.strictEqual(signupRes.data.user.avatarInitials, "AD");

  // Login
  const loginRes = await handleApiRoute({
    method: "POST",
    path: "/api/auth/login",
    query: {},
    body: { email: "alex@clockify.design" },
  });

  assert.strictEqual(loginRes.status, 200);
  assert.strictEqual(loginRes.data.user.email, "alex@clockify.design");
});

test("AUTH API: OAuth Login endpoint (Google & Microsoft)", async () => {
  const googleRes = await handleApiRoute({
    method: "POST",
    path: "/api/auth/oauth",
    query: {},
    body: {
      provider: "google",
      name: "Bindhu shree K. R",
      email: "bindhushreebindhushree28@gmail.com",
      avatarInitials: "BS",
    },
  });

  assert.strictEqual(googleRes.status, 200);
  assert.strictEqual(googleRes.data.user.name, "Bindhu shree K. R");
  assert.strictEqual(googleRes.data.user.avatarInitials, "BS");
});

test("AUTH API: Update DateTimeSettings & Profile", async () => {
  // Update Date/Time Settings
  const dtRes = await handleApiRoute({
    method: "PUT",
    path: "/api/auth/datetime-settings",
    query: {},
    body: {
      userId: "usr_bindhu",
      settings: {
        dateFormat: "MM/DD/YYYY",
        dayStart: "08:30",
        use24HourClock: false,
      },
    },
  });

  assert.strictEqual(dtRes.status, 200);
  assert.strictEqual(dtRes.data.dateFormat, "MM/DD/YYYY");
  assert.strictEqual(dtRes.data.dayStart, "08:30");
  assert.strictEqual(dtRes.data.use24HourClock, false);

  // Restore back to Profile.jpeg exact values
  await handleApiRoute({
    method: "PUT",
    path: "/api/auth/datetime-settings",
    query: {},
    body: {
      userId: "usr_bindhu",
      settings: {
        dateFormat: "DD/MM/YYYY",
        dayStart: "09:00",
        use24HourClock: true,
      },
    },
  });
});

test("AUTH API: Logout and Delete Account", async () => {
  // Logout
  const logoutRes = await handleApiRoute({
    method: "POST",
    path: "/api/auth/logout",
    query: {},
    body: { token: "dummy_token" },
  });
  assert.strictEqual(logoutRes.status, 200);
  assert.strictEqual(logoutRes.data.success, true);

  // Delete temp account
  const delRes = await handleApiRoute({
    method: "DELETE",
    path: "/api/auth/account",
    query: {},
    body: { userId: "usr_temporary_test" },
  });
  assert.strictEqual(delRes.status, 200);
});

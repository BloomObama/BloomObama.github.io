# AdmitVector account setup

The website code contains the account interface and Firebase integration. The public web configuration for the `fullrideua` project is already in `firebase-config.js`; do not replace it unless you intentionally switch projects. Complete and verify the following settings in the Firebase project owned by the site owner.

1. Open Firebase Console and select the existing `fullrideua` project.
2. In Authentication → Sign-in method, confirm that these providers are enabled:
   - Email/Password
   - Google
3. In Authentication → Settings → Authorized domains, keep `bloomobama.github.io` during migration and add both `admitvector.com` and `www.admitvector.com`.
4. Confirm that the Cloud Firestore database exists in production mode.
5. Publish the current contents of `firestore.rules` in Firestore → Rules, or deploy them with Firebase CLI. The rules allow up to 500 personal flashcards and progress for 3,000 deck words per verified user.
6. In Authentication → Templates, customize verification and password-reset emails. Set the project name to AdmitVector and use `admitvector@gmail.com` as the reply-to or support address where the console allows it. This does not make Gmail the sender of Firebase's authentication emails.
7. Test registration, email verification, password reset, Google sign-in, sign-out, and cross-device shortlist, comparison, flashcard, and deck-progress synchronization before publishing.
8. After monitoring normal traffic, consider Firebase App Check for additional abuse protection.

## Private owner panel and optional activity measurement

The owner panel is at `https://www.admitvector.com/admin.html`. It is deliberately absent from the public navigation and search sitemap, but the URL is **not** a security boundary. Firestore rules grant directory and activity-list reads only to a Firebase user whose token has a verified `admitvector@gmail.com` address. Sign in with that Google account and keep its two-step verification enabled. Check Firebase/Google Cloud IAM so no unneeded account has project access.

Deploy the updated `firestore.rules` **before** relying on the dashboard or expecting activity writes. The new `memberSummaries` records contain only verified email and display name; `memberActivity` contains cumulative focused seconds and the last update time. Existing profiles appear in the owner panel only after their next verified sign-in. An account must opt in through the account dialog on each browser before active time is recorded. Switching it off stops new measurements but does not erase earlier totals; deletion requests go to `admitvector@gmail.com`. The public `privacy.html` page explains this behavior.

The panel's numeric account count is the number of synced verified `memberSummaries`, **not** the exact number of Firebase Authentication users. Open Authentication → Users in Firebase Console for the authoritative total, including unverified accounts. Getting that exact total into a custom page would require a privileged server endpoint with the Admin SDK; never expose its service-account credentials in browser code, Cloudflare Pages assets, or Git.

Never add a service-account JSON file, private key, mailbox password, or OAuth client secret to this repository.

# FullRide UA account setup

The website code contains the account interface and Firebase integration. The public web configuration for the `fullrideua` project is already in `firebase-config.js`; do not replace it unless you intentionally switch projects. Complete and verify the following settings in the Firebase project owned by the site owner.

1. Open Firebase Console and select the existing `fullrideua` project.
2. In Authentication → Sign-in method, confirm that these providers are enabled:
   - Email/Password
   - Google
3. In Authentication → Settings → Authorized domains, confirm `bloomobama.github.io` is present.
4. Confirm that the Cloud Firestore database exists in production mode.
5. Publish the current contents of `firestore.rules` in Firestore → Rules, or deploy them with Firebase CLI. The rules allow up to 500 personal flashcards and progress for 3,000 deck words per verified user.
6. In Authentication → Templates, customize verification and password-reset emails. Set the project name to FullRide UA and use `bloomobama@tutamail.com` as the reply-to address where the console allows it.
7. Test registration, email verification, password reset, Google sign-in, sign-out, and cross-device shortlist, comparison, flashcard, and deck-progress synchronization before publishing.
8. After monitoring normal traffic, consider Firebase App Check for additional abuse protection.

Never add a service-account JSON file, private key, mailbox password, or OAuth client secret to this repository.

# FullRide UA account setup

The website code already contains the complete account interface and Firebase integration. The final connection must be made in a Firebase project owned by the site owner.

1. Open Firebase Console and create a project for FullRide UA.
2. Add a Web app and copy its configuration values into `firebase-config.js`.
3. In Authentication → Sign-in method, enable:
   - Email/Password
   - Google
4. In Authentication → Settings → Authorized domains, add `bloomobama.github.io`.
5. Create a Cloud Firestore database in production mode.
6. Publish the contents of `firestore.rules` in Firestore → Rules, or deploy them with Firebase CLI.
7. In Authentication → Templates, customize verification and password-reset emails. Set the project name to FullRide UA and use `bloomobama@tutamail.com` as the reply-to address where the console allows it.
8. If the practice page is enabled, republish the updated rules from `firestore.rules`; the rules now allow up to 500 personal flashcards and progress for 3,000 deck words per verified user.
9. Test registration, email verification, password reset, Google sign-in, sign-out, and cross-device shortlist, comparison, flashcard, and deck-progress synchronization before publishing.
10. After monitoring normal traffic, enable Firebase App Check for additional abuse protection.

Never add a service-account JSON file, private key, mailbox password, or OAuth client secret to this repository.

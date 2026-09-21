# Vocabulary deck sources

The six base decks in `practice-packs.js` contain 500 distinct English headwords each. The A1–A2, A2–B1 and B1–B2 bridge decks reuse 250 words from each adjacent base deck. "Native" is the site's name for the C2-inspired deck; it is not a separate CEFR level or a claim that every native speaker knows every word.

- A1–B2: [CEFR-J Vocabulary Profile, version 1.5](https://www.cefr-j.org/download.html), compiled by Yukio Tono, Tono Laboratory, Tokyo University of Foreign Studies. [Open Language Profiles mirror and terms](https://github.com/vitwits/english-wordlist-cefr-a1-c2). The CEFR-J data may be used without charge for research and commercial purposes with attribution.
- C1–C2: [Octanove Vocabulary Profile, version 1.0](https://github.com/vitwits/english-wordlist-cefr-a1-c2/blob/main/octanove-vocabulary-profile-c1c2-1.0.csv), created by Octanove Labs and released under [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The C1/C2 word selections derived from this profile are shared under the same license.
- Frequency ordering: [Openjam](https://github.com/amirj4m/openjam), an MIT-licensed vocabulary database. Frequency rank is used to choose 500 useful headwords within each source level. It does not determine CEFR labels.

The build filters to single alphabetic words of at least three letters, keeps the first occurrence of a headword at the lowest selected level, and uses increasing frequency-rank cutoffs for higher levels to avoid filling them with common words used in an advanced sense. Vocabulary levels are approximate learning guides; individual senses of a word can occur at different levels. The source lists contain no translations. The site requests translations only when a learner reveals a card, and stores those translations locally for later sessions.

To regenerate, run `node scripts/build-practice-packs.mjs` with network access. The three optional positional arguments are local paths to the CEFR-J CSV, Octanove CSV, and Openjam JSON, respectively.

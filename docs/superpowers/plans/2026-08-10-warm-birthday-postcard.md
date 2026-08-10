# Warm Birthday Postcard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Build a lightweight, warm rose-toned birthday postcard for 朱熠欣 that works first-class in iPhone WeChat.

**Architecture:** A dependency-free static page uses semantic HTML for the no-JavaScript fallback, one stylesheet for responsive presentation and accessibility, and one script for the reveal, petals, and user-initiated Web Audio ambience. Optimized copies of the two supplied photos live beside the page so the original 14 MB bundle is not required at runtime.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Web Audio API, Node.js smoke tests.

## Global Constraints

- iPhone WeChat is the primary target.
- The page must respect safe-area insets and reduced-motion preferences.
- The page must remain readable without JavaScript or audio.
- The photos must come from the two user-provided originals.
- The exact final signature is “——沈梦秋，哦不，琉璃大魔王”.
- No large framework or third-party runtime dependency.
- First-screen resources should target approximately 1–2 MB.

---

### Task 1: Static content and optimized media

**Files:**
- Create: \`index.html\`
- Create: \`assets/photo-cover.webp\`
- Create: \`assets/photo-story.webp\`
- Test: \`tests/postcard.test.mjs\`

**Interfaces:**
- Consumes: the two source JPEG images supplied by the user.
- Produces: stable element IDs \`open-card\`, \`story\`, and \`sound-toggle\` for the script.

- [ ] **Step 1: Write the failing structural smoke test**

\`\`\`js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("contains the confirmed birthday copy", () => {
  assert.match(html, /朱熠欣，生日快乐/);
  assert.match(html, /沈梦秋，哦不，琉璃大魔王/);
});

test("exposes accessible interaction hooks", () => {
  assert.match(html, /id="open-card"/);
  assert.match(html, /id="story"/);
  assert.match(html, /id="sound-toggle"/);
});

test("optimized images exist and cover remains below 2 MB", async () => {
  const cover = await stat(new URL("../assets/photo-cover.webp", import.meta.url));
  await stat(new URL("../assets/photo-story.webp", import.meta.url));
  assert.ok(cover.size < 2_000_000);
});
\`\`\`

- [ ] **Step 2: Run the test and verify it fails**

Run: \`node --test tests/postcard.test.mjs\`
Expected: FAIL because \`index.html\` and optimized assets do not exist.

- [ ] **Step 3: Optimize the supplied images**

Create \`photo-cover.webp\` from the horizontal image at a maximum width of 1600 pixels and \`photo-story.webp\` from the vertical image at a maximum width of 1200 pixels, preserving aspect ratio and using visually high WebP quality.

- [ ] **Step 4: Create semantic page content**

Create \`index.html\` with:

- an edge-to-edge cover section containing “朱熠欣，生日快乐” and “轻触，拆开祝福”;
- a story section containing the approved blessing and exact signature;
- responsive image markup using the optimized files;
- \`viewport-fit=cover\`, meaningful alt text, and a \`noscript\` path that leaves the story readable;
- links to \`styles.css\` and deferred \`postcard.js\`.

- [ ] **Step 5: Run the structural smoke test**

Run: \`node --test tests/postcard.test.mjs\`
Expected: PASS.

### Task 2: iPhone-first styling and interaction

**Files:**
- Create: \`styles.css\`
- Create: \`postcard.js\`
- Modify: \`tests/postcard.test.mjs\`

**Interfaces:**
- Consumes: \`#open-card\`, \`#story\`, and \`#sound-toggle\`.
- Produces: the body class \`is-open\`, a functional sound toggle, and decorative \`.petal\` elements.

- [ ] **Step 1: Extend the smoke test for mobile and accessibility contracts**

Add assertions that:

\`\`\`js
const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
const js = await readFile(new URL("../postcard.js", import.meta.url), "utf8");
assert.match(html, /viewport-fit=cover/);
assert.match(css, /env\(safe-area-inset-bottom\)/);
assert.match(css, /prefers-reduced-motion/);
assert.match(js, /addEventListener\("click"/);
assert.match(js, /AudioContext|webkitAudioContext/);
\`\`\`

- [ ] **Step 2: Run the test and verify it fails**

Run: \`node --test tests/postcard.test.mjs\`
Expected: FAIL because the stylesheet and script do not exist.

- [ ] **Step 3: Implement the warm rose visual system**

Create \`styles.css\` with:

- dynamic viewport units and safe-area padding;
- rose, cream, and soft gold color tokens;
- a readable photo gradient and a large 44px-or-greater touch target;
- a reveal transition and restrained petals;
- mobile typography using system and serif fallbacks;
- a reduced-motion media query that removes nonessential animation;
- a non-JavaScript rule that keeps the story visible.

- [ ] **Step 4: Implement reveal and optional ambience**

Create \`postcard.js\` that:

- opens the story on the first button click and scrolls it into view;
- creates a small, bounded set of decorative petals only when motion is allowed;
- starts a quiet repeating Web Audio chord pattern only after user interaction;
- updates the sound button label and \`aria-pressed\`;
- silently degrades when Web Audio is unavailable or suspended.

- [ ] **Step 5: Run the smoke test**

Run: \`node --test tests/postcard.test.mjs\`
Expected: PASS.

### Task 3: Final verification and delivery

**Files:**
- Modify only if checks expose defects: \`index.html\`, \`styles.css\`, \`postcard.js\`, \`tests/postcard.test.mjs\`

**Interfaces:**
- Consumes: the completed static site.
- Produces: a deployable directory with verified content and resource bounds.

- [ ] **Step 1: Run automated verification**

Run: \`node --test tests/postcard.test.mjs\`
Expected: all tests PASS.

- [ ] **Step 2: Check content and repository cleanliness**

Run: \`rg -n "朱熠欣|沈梦秋|琉璃大魔王|viewport-fit|safe-area" index.html styles.css postcard.js\`
Expected: confirmed name, copy, signature, and iPhone compatibility hooks are present.

Run: \`git diff --check\`
Expected: no whitespace errors.

- [ ] **Step 3: Verify runtime resource sizes**

Measure \`index.html\`, \`styles.css\`, \`postcard.js\`, and \`assets/*\`; confirm the cover image is below 2 MB and no original 14 MB bundle is referenced.

- [ ] **Step 4: Commit the finished postcard**

\`\`\`bash
git add index.html styles.css postcard.js assets tests docs/superpowers/plans/2026-08-10-warm-birthday-postcard.md
git commit -m "feat: build warm birthday postcard"
\`\`\`

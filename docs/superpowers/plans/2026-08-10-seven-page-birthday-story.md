# Seven-Page Birthday Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Expand the existing birthday postcard into a seven-page, tap-to-continue story without interrupting the provided Happy Birthday recording.

**Architecture:** Keep the dependency-free static page. Seven semantic story panels live in \`index.html\`; CSS shows one panel at a time with a short transition, and \`postcard.js\` advances a numeric \`data-current-page\` state while leaving the existing audio object untouched.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js smoke tests.

## Global Constraints

- iPhone WeChat remains the primary target.
- Use exactly seven story pages and the approved Chinese copy.
- Page three must use the approved “有意思” copy, not the rejected “温柔” copy.
- Navigation uses tap buttons, not horizontal swipe.
- The supplied Happy Birthday recording starts on the initial open action and continues across pages.
- The final signature remains “——沈梦秋，哦不，琉璃大魔王”.
- Reduced-motion and no-JavaScript readability must remain intact.

---

### Task 1: Seven-page story flow

**Files:**
- Modify: \`index.html\`
- Modify: \`styles.css\`
- Modify: \`postcard.js\`
- Modify: \`tests/postcard.test.mjs\`

**Interfaces:**
- Consumes: the existing \`#open-card\`, \`#story\`, and \`birthdayAudio\` playback flow.
- Produces: seven \`.story-page[data-page]\` elements, six \`.next-page\` controls, and \`showStoryPage(index: number)\`.

- [ ] **Step 1: Write failing story-flow tests**

Add assertions that parse \`index.html\` and \`postcard.js\` to require:

\`\`\`js
assert.equal((html.match(/class="story-page/g) || []).length, 7);
assert.equal((html.match(/class="next-page/g) || []).length, 6);
assert.match(html, /嘿嘿，没想到吧/);
assert.match(html, /你是一个挺有意思的人/);
assert.doesNotMatch(html, /你比自己以为的更温柔/);
assert.match(js, /function showStoryPage/);
assert.match(js, /nextButtons\.forEach/);
\`\`\`

- [ ] **Step 2: Run the test and verify it fails**

Run: \`node --test tests/postcard.test.mjs\`
Expected: FAIL because the existing page contains one continuous story rather than seven panels.

- [ ] **Step 3: Add the approved seven panels**

Replace the existing single story body with seven \`.story-page\` sections. Pages one through six each contain one approved compliment and a next button. Page seven retains the existing photo, final birthday blessing, seal, and exact signature.

- [ ] **Step 4: Add iPhone-safe page presentation**

Update \`styles.css\` so each panel:

- uses at least \`100svh\` with safe-area padding;
- keeps text centered and readable at narrow widths;
- shows only \`.story-page.is-active\` when JavaScript is enabled;
- fades and moves upward for the active transition;
- displays all pages in normal document flow without JavaScript;
- disables transition movement under \`prefers-reduced-motion\`.

- [ ] **Step 5: Add deterministic tap navigation**

Update \`postcard.js\` with \`showStoryPage(index)\`, a \`nextButtons\` collection, and click handlers. The initial open action shows page zero and starts the existing \`birthdayAudio\`; page changes update \`aria-hidden\`, scroll the active panel into view, and do not call \`pause()\` or \`play()\`.

- [ ] **Step 6: Run complete verification**

Run: \`node --test tests/postcard.test.mjs\`
Expected: all tests PASS.

Run: \`node --check postcard.js\`
Expected: exit 0.

Run: \`git diff --check\`
Expected: no whitespace errors.

- [ ] **Step 7: Commit**

\`\`\`bash
git add index.html styles.css postcard.js tests/postcard.test.mjs docs/superpowers/plans/2026-08-10-seven-page-birthday-story.md
git commit -m "feat: add seven-page birthday story"
\`\`\`

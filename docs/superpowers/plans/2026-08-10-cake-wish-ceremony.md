# Cake Wish Ceremony Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Add an eighth-page cake ceremony where the recipient confirms her wish, taps to blow out candles, sees a celebration effect, and then opens the final blessing.

**Architecture:** Insert a CSS-built cake page before the final blessing and shift the final page index from six to seven. A small three-state controller in \`postcard.js\` advances \`wishing → ready-to-blow → celebrated\`; CSS classes turn off the flame and animate smoke, stars, and confetti without affecting the continuous audio.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js smoke tests.

## Global Constraints

- Total story page count is exactly eight.
- The cake page is page seven visually and \`data-page="6"\` programmatically.
- The final blessing becomes \`data-page="7"\`.
- The cake uses CSS shapes and no external image.
- Music continues without replaying during wish and candle actions.
- Reduced-motion users receive state changes without large animation.

---

### Task 1: Cake wish and candle interaction

**Files:**
- Modify: \`index.html\`
- Modify: \`styles.css\`
- Modify: \`postcard.js\`
- Modify: \`tests/postcard.test.mjs\`

**Interfaces:**
- Consumes: \`showStoryPage(index)\` and the existing persistent \`birthdayAudio\`.
- Produces: \`#wish-button\`, \`#blow-button\`, \`#accept-wish\`, \`#cake-stage\`, and \`celebrateCake()\`.

- [ ] **Step 1: Add failing tests**

\`\`\`js
assert.equal((html.match(/<article class="story-page/g) || []).length, 8);
assert.match(html, /id="wish-button"/);
assert.match(html, /id="blow-button"/);
assert.match(html, /id="accept-wish"/);
assert.match(html, /愿望已被宇宙签收/);
assert.match(js, /function celebrateCake/);
assert.match(js, /classList\.add\("is-celebrated"\)/);
\`\`\`

- [ ] **Step 2: Run tests and verify failure**

Run: \`node --test tests/postcard.test.mjs\`
Expected: FAIL because only seven pages and no cake state exist.

- [ ] **Step 3: Insert the cake page**

Add \`.story-page--cake[data-page="6"]\` with a CSS cake, candle, flame, smoke, wish copy, three state-specific buttons, and a celebration layer. Update the prior page-six button to target page six and update the final page to \`data-page="7"\` with “08 / 08”.

- [ ] **Step 4: Style the ceremony**

Add cake layers, flame flicker, smoke rise, gold-star and confetti effects, state-dependent visibility, safe-area padding, and reduced-motion overrides to \`styles.css\`.

- [ ] **Step 5: Implement state transitions**

In \`postcard.js\`, wire:

- \`#wish-button\` to reveal \`#blow-button\`;
- \`#blow-button\` to call \`celebrateCake()\`, add \`is-celebrated\`, and reveal \`#accept-wish\`;
- \`#accept-wish\` to call \`showStoryPage(7)\`;
- no call to \`startMusic()\` or \`stopMusic()\` from these handlers.

- [ ] **Step 6: Verify and commit**

Run \`node --test tests/postcard.test.mjs\`, \`node --check postcard.js\`, and \`git diff --check\`. All must exit successfully.

\`\`\`bash
git add index.html styles.css postcard.js tests/postcard.test.mjs docs/superpowers/plans/2026-08-10-cake-wish-ceremony.md
git commit -m "feat: add cake wish ceremony"
\`\`\`

# Expanded Birthday Story Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Replace the short eight-page copy with the approved, more personal wording while preserving layout, navigation, cake effects, and continuous music.

**Architecture:** This is a content-only HTML change with small responsive typography adjustments if needed. Existing JavaScript state and audio behavior remain unchanged.

**Tech Stack:** HTML5, CSS3, Node.js smoke tests.

## Global Constraints

- Opening must say “不是故意不回你消息” and must not contain “前段时间”.
- Pages two through six use the complete approved expanded copy.
- Cake page includes the expanded wish prompt and post-candle message.
- Final page includes the expanded blessing and exact signature.
- Navigation, cake interaction, audio, and page count remain unchanged.

---

### Task 1: Replace and verify all eight-page copy

**Files:**
- Modify: \`index.html\`
- Modify only if mobile overflow requires it: \`styles.css\`
- Modify: \`tests/postcard.test.mjs\`

**Interfaces:**
- Consumes: existing eight \`.story-page\` elements.
- Produces: the exact approved copy inside the same page indices and controls.

- [ ] **Step 1: Add failing copy assertions**

Require \`index.html\` to contain “不是故意不回你消息”, “这种感觉，其实挺珍贵的”, “有时候又能让我笑很久”, “不会为了迎合别人”, “没能陪在你身边过生日”, “希望这个愿望，真的会实现”, “也算陪你一起吹过蜡烛啦”, and “也希望以后还能陪你经历更多值得记住的时刻”; reject “前段时间”.

- [ ] **Step 2: Run \`node --test tests/postcard.test.mjs\`**

Expected: FAIL because the current page still contains shorter copy.

- [ ] **Step 3: Replace copy in all affected pages**

Copy the approved wording from \`docs/superpowers/specs/2026-08-10-warm-birthday-postcard-design.md\` into pages one through eight without changing IDs, classes, page indices, or button targets.

- [ ] **Step 4: Verify**

Run \`node --test tests/postcard.test.mjs\`, \`node --check postcard.js\`, and \`git diff --check\`. All commands must succeed.

- [ ] **Step 5: Commit**

\`\`\`bash
git add index.html tests/postcard.test.mjs docs/superpowers/plans/2026-08-10-expand-birthday-story-copy.md
git commit -m "copy: expand birthday story messages"
\`\`\`

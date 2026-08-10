import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const htmlPath = new URL("../index.html", import.meta.url);

test("contains the confirmed birthday copy", async () => {
  const html = await readFile(htmlPath, "utf8");
  assert.match(html, /朱熠欣，生日快乐/);
  assert.match(html, /沈梦秋，哦不，琉璃大魔王/);
});

test("exposes accessible interaction hooks", async () => {
  const html = await readFile(htmlPath, "utf8");
  assert.match(html, /id="open-card"/);
  assert.match(html, /id="story"/);
  assert.match(html, /id="sound-toggle"/);
});

test("optimized images exist and cover remains below 2 MB", async () => {
  const cover = await stat(new URL("../assets/photo-cover.webp", import.meta.url));
  await stat(new URL("../assets/photo-story.webp", import.meta.url));
  assert.ok(cover.size < 2_000_000);
});

test("implements iPhone safe areas and reduced motion", async () => {
  const html = await readFile(htmlPath, "utf8");
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(html, /viewport-fit=cover/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /prefers-reduced-motion/);
});

test("reveals the card and starts optional audio from a click", async () => {
  const js = await readFile(new URL("../postcard.js", import.meta.url), "utf8");
  assert.match(js, /addEventListener\("click"/);
  assert.match(js, /AudioContext|webkitAudioContext/);
  assert.match(js, /is-open/);
});

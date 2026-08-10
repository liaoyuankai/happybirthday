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
  assert.match(js, /new Audio/);
  assert.match(js, /is-open/);
});

test("plays the user-provided Happy Birthday recording in an iPhone-friendly format", async () => {
  const js = await readFile(new URL("../postcard.js", import.meta.url), "utf8");
  await stat(new URL("../assets/happy-birthday.m4a", import.meta.url));
  assert.match(js, /new Audio\("assets\/happy-birthday\.m4a"\)/);
  assert.match(js, /birthdayAudio\.loop = true/);
  assert.doesNotMatch(js, /AudioContext|webkitAudioContext/);
});

test("contains the approved seven-page compliment story", async () => {
  const html = await readFile(htmlPath, "utf8");
  assert.equal((html.match(/<article class="story-page/g) || []).length, 7);
  assert.equal((html.match(/class="next-page/g) || []).length, 6);
  assert.match(html, /嘿嘿，没想到吧/);
  assert.match(html, /你是一个挺有意思的人/);
  assert.doesNotMatch(html, /你比自己以为的更温柔/);
});

test("advances story pages without restarting the audio", async () => {
  const js = await readFile(new URL("../postcard.js", import.meta.url), "utf8");
  assert.match(js, /function showStoryPage/);
  assert.match(js, /nextButtons\.forEach/);
  assert.match(js, /showStoryPage\(0\)/);
});

test("keeps page three visually consistent without a photo background", async () => {
  const html = await readFile(htmlPath, "utf8");
  const pageThree = html.match(/<article[^>]*data-page="2"[\s\S]*?<\/article>/)?.[0] ?? "";
  assert.ok(pageThree);
  assert.doesNotMatch(pageThree, /story-page--photo/);
  assert.doesNotMatch(pageThree, /<img/);
});

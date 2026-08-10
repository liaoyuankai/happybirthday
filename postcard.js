(() => {
  const openButton = document.querySelector("#open-card");
  const story = document.querySelector("#story");
  const petalLayer = document.querySelector("#petals");
  const soundButton = document.querySelector("#sound-toggle");
  const soundLabel = soundButton?.querySelector(".sound-toggle__text");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let audioContext;
  let masterGain;
  let musicTimer;
  let isPlaying = false;
  let chordIndex = 0;
  const chords = [[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];

  function setSoundState(playing) {
    isPlaying = playing;
    soundButton?.setAttribute("aria-pressed", String(playing));
    soundButton?.setAttribute("aria-label", playing ? "暂停背景音乐" : "播放背景音乐");
    if (soundLabel) soundLabel.textContent = playing ? "播放中" : "音乐";
  }

  function scheduleChord() {
    if (!audioContext || !masterGain || !isPlaying) return;
    const now = audioContext.currentTime;
    const notes = chords[chordIndex++ % chords.length];
    notes.forEach((frequency, noteIndex) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency / 2;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.035 / (noteIndex + 1), now + 1.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);
      oscillator.connect(gain).connect(masterGain);
      oscillator.start(now);
      oscillator.stop(now + 6);
    });
  }

  async function startMusic() {
    try {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      if (!AudioEngine) return;
      if (!audioContext) {
        audioContext = new AudioEngine();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.24;
        masterGain.connect(audioContext.destination);
      }
      await audioContext.resume();
      setSoundState(true);
      scheduleChord();
      clearInterval(musicTimer);
      musicTimer = setInterval(scheduleChord, 4800);
    } catch {
      setSoundState(false);
    }
  }

  function stopMusic() {
    clearInterval(musicTimer);
    musicTimer = undefined;
    setSoundState(false);
    if (audioContext?.state === "running") audioContext.suspend().catch(() => {});
  }

  function createPetals() {
    if (!petalLayer || reduceMotion || petalLayer.childElementCount) return;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 12; index += 1) {
      const petal = document.createElement("i");
      petal.className = "petal";
      petal.style.left = "${4 + Math.random() * 92}%";
      petal.style.setProperty("--fall-time", "${8 + Math.random() * 7}s");
      petal.style.setProperty("--fall-delay", "${Math.random() * -12}s");
      petal.style.setProperty("--drift", "${-50 + Math.random() * 100}px");
      fragment.appendChild(petal);
    }
    petalLayer.appendChild(fragment);
  }

  openButton?.addEventListener("click", async () => {
    document.body.classList.add("is-open");
    createPetals();
    await startMusic();
    window.setTimeout(() => story?.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth"}), 280);
  });

  soundButton?.addEventListener("click", () => {
    if (isPlaying) stopMusic();
    else startMusic();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && isPlaying) stopMusic();
  });
})();

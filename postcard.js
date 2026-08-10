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
  const noteFrequencies = {
    G4: 392,
    A4: 440,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    F5: 698.46,
    G5: 783.99
  };
  const happyBirthdayMelody = [
    ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
    ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
    ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
    ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2]
  ];

  function setSoundState(playing) {
    isPlaying = playing;
    soundButton?.setAttribute("aria-pressed", String(playing));
    soundButton?.setAttribute("aria-label", playing ? "暂停背景音乐" : "播放背景音乐");
    if (soundLabel) soundLabel.textContent = playing ? "播放中" : "音乐";
  }

  function playMelody() {
    if (!audioContext || !masterGain || !isPlaying) return;
    const beatSeconds = 0.42;
    let beatOffset = 0;
    const startAt = audioContext.currentTime + 0.08;

    happyBirthdayMelody.forEach(([note, beats]) => {
      const noteStart = startAt + beatOffset * beatSeconds;
      const noteEnd = noteStart + beats * beatSeconds * 0.9;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = noteFrequencies[note];
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.28, noteStart + 0.025);
      gain.gain.setValueAtTime(0.22, Math.max(noteStart + 0.03, noteEnd - 0.08));
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
      oscillator.connect(gain).connect(masterGain);
      oscillator.start(noteStart);
      oscillator.stop(noteEnd + 0.02);
      beatOffset += beats;
    });

    clearTimeout(musicTimer);
    musicTimer = window.setTimeout(playMelody, (beatOffset * beatSeconds + 1.2) * 1000);
  }

  async function startMusic() {
    try {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      if (!AudioEngine) return;
      if (!audioContext) {
        audioContext = new AudioEngine();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.72;
        masterGain.connect(audioContext.destination);
      }
      await audioContext.resume();
      setSoundState(true);
      playMelody();
    } catch {
      setSoundState(false);
    }
  }

  function stopMusic() {
    clearTimeout(musicTimer);
    musicTimer = undefined;
    setSoundState(false);
    if (audioContext) audioContext.close().catch(() => {});
    audioContext = undefined;
    masterGain = undefined;
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

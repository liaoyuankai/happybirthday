(() => {
  const openButton = document.querySelector("#open-card");
  const story = document.querySelector("#story");
  const petalLayer = document.querySelector("#petals");
  const soundButton = document.querySelector("#sound-toggle");
  const soundLabel = soundButton?.querySelector(".sound-toggle__text");
  const storyPages = [...document.querySelectorAll(".story-page")];
  const nextButtons = [...document.querySelectorAll(".next-page")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const birthdayAudio = new Audio("assets/happy-birthday.m4a");
  birthdayAudio.loop = true;
  birthdayAudio.preload = "metadata";
  birthdayAudio.volume = 0.82;
  let isPlaying = false;

  function setSoundState(playing) {
    isPlaying = playing;
    soundButton?.setAttribute("aria-pressed", String(playing));
    soundButton?.setAttribute("aria-label", playing ? "暂停背景音乐" : "播放背景音乐");
    if (soundLabel) soundLabel.textContent = playing ? "播放中" : "音乐";
  }

  async function startMusic() {
    try {
      await birthdayAudio.play();
      setSoundState(true);
    } catch {
      setSoundState(false);
    }
  }

  function stopMusic() {
    birthdayAudio.pause();
    setSoundState(false);
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

  function showStoryPage(index) {
    const page = storyPages[index];
    if (!page) return;
    storyPages.forEach((storyPage, pageIndex) => {
      const active = pageIndex === index;
      storyPage.classList.toggle("is-active", active);
      storyPage.setAttribute("aria-hidden", String(!active));
    });
    window.setTimeout(() => {
      page.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block: "start"});
    }, reduceMotion ? 0 : 80);
  }

  openButton?.addEventListener("click", async () => {
    document.body.classList.add("is-open");
    createPetals();
    showStoryPage(0);
    await startMusic();
    window.setTimeout(() => story?.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth"}), 240);
  });

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showStoryPage(Number(button.dataset.next));
    });
  });

  soundButton?.addEventListener("click", () => {
    if (isPlaying) stopMusic();
    else startMusic();
  });

  birthdayAudio.addEventListener("play", () => setSoundState(true));
  birthdayAudio.addEventListener("pause", () => setSoundState(false));
  birthdayAudio.addEventListener("error", () => setSoundState(false));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && isPlaying) stopMusic();
  });
})();

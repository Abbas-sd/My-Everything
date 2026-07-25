const scenes = [
  { id: "scene1", ...SceneHandlers.scene1 },
  { id: "scene2", ...SceneHandlers.scene2 },
  { id: "scene3", ...SceneHandlers.scene3 },
  { id: "scene4", ...SceneHandlers.scene4 },
  { id: "scene5" },
  { id: "scene6" },
  { id: "scene7" },
  { id: "scene8" },
  { id: "scene9" },
  { id: "scene365" },
];

let currentScene = 0;
let musicStarted = false;

const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");

function goToScene(index) {
  if (index < 0 || index >= scenes.length) return;

  scenes[currentScene]?.cleanup?.();
  document.querySelector(".scene.active")?.classList.remove("active");

  currentScene = index;
  const nextScene = document.getElementById(scenes[index].id);
  nextScene?.classList.add("active");
  scenes[index].init?.();
}

async function startMusic() {
  if (!bgMusic || musicStarted) return;

  musicStarted = true;

  try {
    bgMusic.volume = 0.35;
    await bgMusic.play();
  } catch {
    // Browser blocked autoplay — user can still use the mute button later.
  }
}

function setupMusicControls() {
  if (!muteBtn || !bgMusic) return;

  muteBtn.addEventListener("click", async () => {
    if (!musicStarted) {
      await startMusic();
      return;
    }

    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? "🔇" : "🔊";
    muteBtn.classList.toggle("muted", bgMusic.muted);
  });
}

function setupSceneButtons() {
  document.getElementById("startBtn")?.addEventListener("click", async () => {
    await startMusic();
    goToScene(1);
  });

  document.getElementById("continueBtn")?.addEventListener("click", () => {
    goToScene(2);
  });

  document.getElementById("cakeContinueBtn")?.addEventListener("click", () => {
    goToScene(3);
  });

  document.getElementById("letterContinueBtn")?.addEventListener("click", () => {
    goToScene(4);
  });
}

function setupFirstInteractionMusic() {
  const beginMusic = async () => {
    await startMusic();
    document.removeEventListener("pointerdown", beginMusic);
    document.removeEventListener("keydown", beginMusic);
  };

  document.addEventListener("pointerdown", beginMusic, { once: true });
  document.addEventListener("keydown", beginMusic, { once: true });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMusicControls();
  setupSceneButtons();
  setupFirstInteractionMusic();
  goToScene(0);
});

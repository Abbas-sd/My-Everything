const SceneHandlers = (() => {
  let stopHearts = null;
  let stopConfetti = null;
  let scene1Started = false;
  let cakeOpened = false;
  let letterOpened = false;
  let cakeClickHandler = null;
  let cakeKeyHandler = null;
  let envelopeClickHandler = null;
  let envelopeKeyHandler = null;

  function initBeginning() {
    const introLine = document.getElementById("introLine");
    const birthdayLine = document.getElementById("birthdayLine");
    const startBtn = document.getElementById("startBtn");

    [introLine, birthdayLine, startBtn].forEach((el) => {
      el?.classList.remove("visible");
      el?.classList.add("hidden");
    });

    if (scene1Started) return;
    scene1Started = true;

    Effects.createStars(document.getElementById("stars"), 200);

    Effects.revealElement(introLine).then(() =>
      Effects.revealElement(birthdayLine).then(() =>
        Effects.revealElement(startBtn)
      )
    );
  }

  function cleanupBeginning() {
    // Scene 1 elements stay in DOM; no timers to clear here.
  }

  function initJourney() {
    const journeyContent = document.querySelector(".journey-content");
    const journeyText = document.getElementById("journeyText");
    const continueBtn = document.getElementById("continueBtn");
    const heartsLayer = document.getElementById("hearts-layer");

    document.body.classList.add("journey-sky");
    journeyText.textContent = "";
    continueBtn?.classList.add("hidden");
    continueBtn?.classList.remove("visible");

    requestAnimationFrame(() => {
      journeyContent?.classList.add("zoom-in");
    });

    stopHearts = Effects.startFloatingHearts(heartsLayer, {
      intervalMs: 90,
      maxHearts: 300,
    });

    Effects.typeText(
      journeyText,
      "Today isn't just another day...",
      65
    ).then(() =>
      Effects.appendTypedLine(
        journeyText,
        "Today is the day the most beautiful person came into this world.",
        55
      ).then(() => Effects.revealElement(continueBtn))
    );
  }

  function cleanupJourney() {
    document.body.classList.remove("journey-sky");
    document.querySelector(".journey-content")?.classList.remove("zoom-in");

    if (typeof stopHearts === "function") {
      stopHearts();
      stopHearts = null;
    }

    const heartsLayer = document.getElementById("hearts-layer");
    if (heartsLayer) heartsLayer.innerHTML = "";
  }

  function initCake() {
    const cake = document.getElementById("cake");
    const wishText = document.getElementById("wishText");
    const cakeMessage = document.getElementById("cakeMessage");
    const continueBtn = document.getElementById("cakeContinueBtn");
    const birthdaySong = document.getElementById("birthdaySong");

    cakeOpened = false;
    cake?.classList.remove("blown", "celebrating");
    wishText?.classList.remove("hidden");
    wishText?.classList.add("visible");
    wishText.textContent = "Make a wish...";

    cakeMessage?.classList.add("hidden");
    cakeMessage?.classList.remove("visible");
    cakeMessage.textContent = "";

    continueBtn?.classList.add("hidden");
    continueBtn?.classList.remove("visible");

    document.body.classList.add("cake-scene");

    const onCakeTap = async () => {
      if (cakeOpened || !cake) return;
      cakeOpened = true;

      cake.classList.add("celebrating");
      stopConfetti = Effects.launchConfetti(4000);

      setTimeout(() => {
        cake.classList.add("blown");
      }, 200);

      wishText?.classList.add("hidden");
      wishText?.classList.remove("visible");

      if (birthdaySong) {
        try {
          birthdaySong.volume = 0.5;
          birthdaySong.currentTime = 0;
          await birthdaySong.play();
        } catch {
          // Optional audio — ignore if missing or blocked.
        }
      }

      cakeMessage.textContent = "Your wish is on its way to the stars ✨";
      await Effects.revealElement(cakeMessage);
      await Effects.revealElement(continueBtn);
    };

    cakeClickHandler = onCakeTap;
    cakeKeyHandler = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onCakeTap();
      }
    };

    cake?.addEventListener("click", cakeClickHandler);
    cake?.addEventListener("keydown", cakeKeyHandler);
  }

  function cleanupCake() {
    document.body.classList.remove("cake-scene");

    const cake = document.getElementById("cake");
    if (cakeClickHandler) cake?.removeEventListener("click", cakeClickHandler);
    if (cakeKeyHandler) cake?.removeEventListener("keydown", cakeKeyHandler);
    cakeClickHandler = null;
    cakeKeyHandler = null;

    document.querySelector(".confetti-canvas")?.remove();
    if (typeof stopConfetti === "function") {
      stopConfetti();
      stopConfetti = null;
    }

    const birthdaySong = document.getElementById("birthdaySong");
    if (birthdaySong) {
      birthdaySong.pause();
      birthdaySong.currentTime = 0;
    }
  }

  function initLetter() {
    const envelope = document.getElementById("envelope");
    const letterPrompt = document.getElementById("letterPrompt");
    const letterText = document.getElementById("letterText");
    const continueBtn = document.getElementById("letterContinueBtn");

    letterOpened = false;
    envelope?.classList.remove("open");
    letterPrompt?.classList.remove("hidden");
    letterPrompt?.classList.add("visible");

    continueBtn?.classList.add("hidden");
    continueBtn?.classList.remove("visible");

    if (letterText && typeof Content !== "undefined") {
      letterText.textContent = Content.letter;
    }

    document.body.classList.add("letter-scene");

    const onEnvelopeOpen = () => {
      if (letterOpened || !envelope) return;
      letterOpened = true;

      envelope.classList.add("open");
      letterPrompt?.classList.add("hidden");
      letterPrompt?.classList.remove("visible");

      setTimeout(() => {
        Effects.revealElement(continueBtn);
      }, 2200);
    };

    envelopeClickHandler = onEnvelopeOpen;
    envelopeKeyHandler = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onEnvelopeOpen();
      }
    };

    envelope?.addEventListener("click", envelopeClickHandler);
    envelope?.addEventListener("keydown", envelopeKeyHandler);
  }

  function cleanupLetter() {
    document.body.classList.remove("letter-scene");

    const envelope = document.getElementById("envelope");
    if (envelopeClickHandler) envelope?.removeEventListener("click", envelopeClickHandler);
    if (envelopeKeyHandler) envelope?.removeEventListener("keydown", envelopeKeyHandler);
    envelopeClickHandler = null;
    envelopeKeyHandler = null;
  }

  return {
    scene1: { init: initBeginning, cleanup: cleanupBeginning },
    scene2: { init: initJourney, cleanup: cleanupJourney },
    scene3: { init: initCake, cleanup: cleanupCake },
    scene4: { init: initLetter, cleanup: cleanupLetter },
  };
})();

const Effects = (() => {
  const activeIntervals = new Set();
  const activeTimeouts = new Set();

  function trackInterval(id) {
    activeIntervals.add(id);
    return id;
  }

  function trackTimeout(id) {
    activeTimeouts.add(id);
    return id;
  }

  function clearAll() {
    activeIntervals.forEach(clearInterval);
    activeTimeouts.forEach(clearTimeout);
    activeIntervals.clear();
    activeTimeouts.clear();
  }

  function createStars(container, count = 180) {
    if (!container) return;

    container.innerHTML = "";
    const sizes = ["tiny", "small", "medium"];

    for (let i = 0; i < count; i += 1) {
      const star = document.createElement("div");
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      star.className = `star ${size}`;
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.setProperty("--twinkle-duration", `${2 + Math.random() * 4}s`);
      star.style.setProperty("--twinkle-delay", `${Math.random() * 4}s`);
      star.style.opacity = `${0.2 + Math.random() * 0.5}`;

      container.appendChild(star);
    }
  }

  function revealElement(element, className = "visible") {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      element.classList.remove("hidden");
      requestAnimationFrame(() => {
        element.classList.add(className);
        trackTimeout(setTimeout(resolve, 1600));
      });
    });
  }

  function typeText(element, text, speed = 55) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      element.textContent = "";
      let index = 0;

      const timer = trackInterval(
        setInterval(() => {
          element.textContent += text[index];
          index += 1;

          if (index >= text.length) {
            clearInterval(timer);
            activeIntervals.delete(timer);
            resolve();
          }
        }, speed)
      );
    });
  }

  function appendTypedLine(element, text, speed = 55) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      const prefix = element.textContent ? "\n\n" : "";
      let index = 0;

      const timer = trackInterval(
        setInterval(() => {
          if (index === 0) {
            element.textContent += prefix;
          }

          element.textContent += text[index];
          index += 1;

          if (index >= text.length) {
            clearInterval(timer);
            activeIntervals.delete(timer);
            resolve();
          }
        }, speed)
      );
    });
  }

  function launchConfetti(durationMs = 3500) {
    const canvas = document.createElement("canvas");
    canvas.className = "confetti-canvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const colors = ["#ff6fae", "#ff9acb", "#9b5cff", "#ffd369", "#ffffff", "#ff4757"];
    const particles = [];

    for (let i = 0; i < 160; i += 1) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 120,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 16 - 4,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 12,
        gravity: 0.22 + Math.random() * 0.12,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }

    const start = performance.now();
    let frameId = null;

    const draw = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.vx *= 0.99;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }

        ctx.restore();
      });

      if (now - start < durationMs) {
        frameId = requestAnimationFrame(draw);
      } else {
        canvas.remove();
      }
    };

    frameId = requestAnimationFrame(draw);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      canvas.remove();
    };
  }

  function startFloatingHearts(container, options = {}) {
    const {
      intervalMs = 120,
      maxHearts = 250,
      hearts = ["❤️", "💗", "💕", "✨"],
    } = options;

    if (!container) return () => {};

    let created = 0;

    const spawnHeart = () => {
      if (created >= maxHearts) return;

      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.setProperty("--heart-size", `${14 + Math.random() * 16}px`);
      heart.style.setProperty("--float-duration", `${5 + Math.random() * 5}s`);
      heart.style.setProperty("--drift", `${-30 + Math.random() * 60}px`);

      container.appendChild(heart);
      created += 1;

      trackTimeout(
        setTimeout(() => {
          heart.remove();
        }, 11000)
      );
    };

    const intervalId = trackInterval(setInterval(spawnHeart, intervalMs));
    spawnHeart();

    return () => {
      clearInterval(intervalId);
      activeIntervals.delete(intervalId);
      container.innerHTML = "";
    };
  }

  return {
    clearAll,
    createStars,
    revealElement,
    typeText,
    appendTypedLine,
    launchConfetti,
    startFloatingHearts,
  };
})();

(() => {
  const wrap = document.querySelector(".cta-title-sub");
  if (!wrap) return;

  const paths = [...wrap.querySelectorAll(".cta-draw__path")];
  if (!paths.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function preparePath(path) {
    const len = path.getTotalLength();
    path.style.setProperty("--path-len", String(len));
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
  }

  function preparePaths() {
    paths.forEach(preparePath);
  }

  function playDraw() {
    if (wrap.classList.contains("is-drawn")) return;
    wrap.classList.add("is-drawn");
    if (reduceMotion.matches) {
      paths.forEach((path) => {
        path.style.strokeDashoffset = "0";
      });
    }
  }

  preparePaths();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          playDraw();
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.35 }
    );
    io.observe(wrap);
  } else {
    playDraw();
  }

  window.addEventListener(
    "resize",
    () => {
      if (wrap.classList.contains("is-drawn")) {
        paths.forEach((path) => {
          path.style.strokeDashoffset = "0";
        });
        return;
      }
      preparePaths();
    },
    { passive: true }
  );
})();

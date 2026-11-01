(() => {
  const RATIOS = { tall: "2 / 3", portrait: "4 / 5", square: "1 / 1" };

  /* ---------- Page loader ---------- */
  const loader = document.getElementById("site-loader");
  const MIN_LOADER_MS = 1200;
  const MAX_LOADER_MS = 4500;
  const loaderStarted = window.__loaderT0 || performance.now();
  let loaderClosed = false;

  const unlockBehindLoader = () => {
    document.querySelectorAll("[data-loader-inert]").forEach((el) => {
      el.inert = false;
      el.removeAttribute("data-loader-inert");
    });
  };

  const hideLoader = () => {
    if (loaderClosed) return;
    loaderClosed = true;
    if (!loader) {
      document.documentElement.classList.remove("is-loader-active");
      unlockBehindLoader();
      return;
    }
    loader.classList.add("is-done");
    loader.setAttribute("aria-hidden", "true");
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      document.documentElement.classList.remove("is-loader-active");
      unlockBehindLoader();
      if (loader.isConnected) loader.remove();
    };
    loader.addEventListener("transitionend", (e) => {
      if (e.target === loader) finish();
    });
    const fadeMs = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 50 : 800;
    setTimeout(finish, fadeMs);
  };

  if (loader) {
    [...document.body.children].forEach((el) => {
      if (el.id === "site-loader") return;
      el.inert = true;
      el.setAttribute("data-loader-inert", "");
    });

    const scheduleHide = () => {
      const wait = Math.max(0, MIN_LOADER_MS - (performance.now() - loaderStarted));
      setTimeout(hideLoader, wait);
    };

    if (document.readyState === "complete") scheduleHide();
    else window.addEventListener("load", scheduleHide, { once: true });
    setTimeout(hideLoader, MAX_LOADER_MS);
  }

  /* ---------- Gallery ---------- */
  const grid = document.getElementById("gallery-grid");
  const items = Array.isArray(window.GALLERY) ? window.GALLERY : [];

  items.forEach((item, i) => {
    const fig = document.createElement("figure");
    fig.className = "g-item reveal";
    fig.style.setProperty("--ratio", RATIOS[item.shape] || RATIOS.portrait);
    fig.style.setProperty("--d", String(i % 3));

    if (item.src) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "g-open";
      btn.setAttribute("aria-label", `הגדלת תמונה: ${item.alt || "עבודה של ענת"}`);

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || "עבודת ציפורניים של ענת בחיפה";
      img.loading = "lazy";
      img.decoding = "async";

      btn.appendChild(img);
      btn.addEventListener("click", () => openLightbox(img.src, img.alt));
      fig.appendChild(btn);
    } else {
      fig.classList.add("is-placeholder");
      fig.innerHTML = `
        <div class="ph" role="img" aria-label="מקום שמור לתמונת עבודה">
          <span class="ph-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="ph-label">מקום לתמונה</span>
        </div>`;
    }
    grid.appendChild(fig);
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  function openLightbox(src, alt) {
    if (!lightbox.showModal) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.showModal();
  }
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.closest(".lightbox-close")) lightbox.close();
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Process wave ---------- */
  const processStage = document.querySelector(".process-stage");
  if (processStage) {
    const line = processStage.querySelector(".process-wave__line");
    const reduceProcess = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (line && typeof line.getTotalLength === "function") {
      const len = Math.ceil(line.getTotalLength());
      processStage.style.setProperty("--wave-len", String(len));
    }
    const playProcess = () => processStage.classList.add("is-live");
    if (reduceProcess || !("IntersectionObserver" in window)) {
      playProcess();
    } else {
      const processObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        playProcess();
        processObserver.disconnect();
      }, { threshold: 0.28 });
      processObserver.observe(processStage);
    }
  }

  /* ---------- Header state + sticky CTA ---------- */
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");

  const setMenu = (open) => {
    header.classList.toggle("is-menu-open", open);
    document.body.classList.toggle("is-menu-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "סגירת תפריט" : "פתיחת תפריט");
    }
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      setMenu(!header.classList.contains("is-menu-open"));
    });
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }
  const sticky = document.querySelector(".sticky-wa");
  const hero = document.querySelector(".hero");
  const ctaZones = document.querySelectorAll(".cta, .site-footer");
  const visibleZones = new Set();

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    const pastHero = window.scrollY > hero.offsetHeight * 0.7;
    sticky.classList.toggle("is-visible", pastHero && visibleZones.size === 0);
  };

  if ("IntersectionObserver" in window) {
    const zoneObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visibleZones.add(e.target) : visibleZones.delete(e.target)));
      onScroll();
    });
    ctaZones.forEach((z) => zoneObserver.observe(z));
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.getElementById("year").textContent = new Date().getFullYear();
  document.documentElement.classList.add("is-loaded");
})();

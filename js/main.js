/* ============================================================
   AZURA Hotel & Spa — main.js
   Kun/Tun rejimi, animatsiyalar, slider, lightbox, forma
   ============================================================ */

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------------- Theme: Kun / Tun ---------------- */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const STORAGE_KEY = "azura-theme";

  const getPreferred = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Kun rejimiga o'tish" : "Tun rejimiga o'tish"
      );
    }
  };

  applyTheme(getPreferred());

  themeToggle?.addEventListener("click", () => {
    const next =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  // OS-level theme changes follow only when user hasn't chosen manually
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? "light" : "dark");
      }
    });

  /* ---------------- Scroll progress bar ---------------- */
  const scrollBar = $("#scrollBar");
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (scrollBar) scrollBar.style.width = pct + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile menu ---------------- */
  const burger = $("#burger");
  const mobileMenu = $("#mobileMenu");

  const closeMenu = () => {
    burger?.setAttribute("aria-expanded", "false");
    mobileMenu?.classList.remove("open");
  };

  burger?.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    mobileMenu?.classList.toggle("open", !open);
  });

  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMenu();
  });

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = $$(".reveal");

  // stagger delay inside groups
  const stagger = (selector) => {
    $$(selector).forEach((group) => {
      $$(".reveal", group).forEach((el, i) => {
        el.style.setProperty("--d", `${Math.min(i * 0.09, 0.55)}s`);
      });
    });
  };
  stagger(".hero-content, .rooms-grid, .services-grid, .gallery-grid, .about-grid, .section-head");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------------- Animated counters ---------------- */
  const animateCount = (el) => {
    const raw = el.dataset.count || "0";
    const isFloat = raw.includes(".");
    const target = parseFloat(raw);
    const dur = 1600;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = isFloat ? val.toFixed(1) : Math.round(val).toString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = isFloat ? target.toFixed(1) : target.toString();
    };
    requestAnimationFrame(tick);
  };

  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------------- Reviews slider ---------------- */
  const track = $("#reviewsTrack");
  const cards = $$(".review-card", track || document);
  const dotsWrap = $("#revDots");
  let index = 0;
  let perView = 3;
  let autoTimer = null;

  const calcPerView = () => {
    const w = window.innerWidth;
    if (w <= 620) return 1;
    if (w <= 1080) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(cards.length - perView, 0);

  const buildDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    for (let i = 0; i <= maxIndex(); i++) {
      const b = document.createElement("button");
      b.setAttribute("aria-label", `${i + 1}-sahifa`);
      b.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(b);
    }
  };

  const renderSlider = () => {
    if (!track || !cards.length) return;
    const card = cards[0];
    const gap = 22;
    const step = card.getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-index * step}px)`;
    $$("#revDots button").forEach((d, i) =>
      d.classList.toggle("active", i === index)
    );
  };

  const goTo = (i, user = false) => {
    index = Math.max(0, Math.min(i, maxIndex()));
    renderSlider();
    if (user) restartAuto();
  };

  const next = () => goTo(index >= maxIndex() ? 0 : index + 1);
  const prev = () => goTo(index <= 0 ? maxIndex() : index - 1);

  $("#revNext")?.addEventListener("click", () => {
    next();
    restartAuto();
  });
  $("#revPrev")?.addEventListener("click", () => {
    prev();
    restartAuto();
  });

  const restartAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5500);
  };

  // swipe / drag support
  if (track) {
    let startX = 0;
    let dragging = false;

    const down = (x) => {
      startX = x;
      dragging = true;
      track.style.transition = "none";
      clearInterval(autoTimer);
    };
    const move = (x) => {
      if (!dragging) return;
      const dx = x - startX;
      const card = cards[0];
      const step = card.getBoundingClientRect().width + 22;
      track.style.transform = `translateX(${-index * step + dx}px)`;
    };
    const up = (x) => {
      if (!dragging) return;
      dragging = false;
      track.style.transition = "";
      const dx = x - startX;
      if (dx < -60) next();
      else if (dx > 60) prev();
      else renderSlider();
      restartAuto();
    };

    track.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      down(e.clientX);
    });
    window.addEventListener("pointermove", (e) => move(e.clientX));
    window.addEventListener("pointerup", (e) => up(e.clientX));
    window.addEventListener("pointercancel", (e) => up(e.clientX));
  }

  const initSlider = () => {
    perView = calcPerView();
    index = Math.min(index, maxIndex());
    buildDots();
    renderSlider();
    restartAuto();
  };

  window.addEventListener("resize", () => {
    const pv = calcPerView();
    if (pv !== perView) initSlider();
    else renderSlider();
  });

  if (track && cards.length) initSlider();

  /* ---------------- Gallery lightbox ---------------- */
  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCaption = $("#lbCaption");
  const galleryItems = $$(".gallery-item");
  let lbIndex = 0;

  const openLb = (i) => {
    lbIndex = i;
    const item = galleryItems[i];
    const img = $("img", item);
    if (!img || !lightbox) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt || "";
    lbCaption.textContent = item.dataset.caption || img.alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeLb = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };

  const stepLb = (dir) => {
    lbIndex = (lbIndex + dir + galleryItems.length) % galleryItems.length;
    openLb(lbIndex);
  };

  galleryItems.forEach((item, i) => {
    item.addEventListener("click", () => openLb(i));
  });

  $("#lbClose")?.addEventListener("click", closeLb);
  $("#lbPrev")?.addEventListener("click", (e) => {
    e.stopPropagation();
    stepLb(-1);
  });
  $("#lbNext")?.addEventListener("click", (e) => {
    e.stopPropagation();
    stepLb(1);
  });

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLb();
  });

  window.addEventListener("keydown", (e) => {
    if (lightbox?.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") stepLb(-1);
    if (e.key === "ArrowRight") stepLb(1);
  });

  /* ---------------- Booking form ---------------- */
  const form = $("#bookingForm");
  const toast = $("#toast");
  let toastTimer = null;

  const showToast = (msg) => {
    if (!toast) return;
    if (msg) $("span", toast).textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    $$("input[required]", form).forEach((inp) => {
      const ok = inp.value.trim() !== "";
      inp.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      showToast("Iltimos, majburiy maydonlarni to'ldiring.");
      return;
    }
    form.reset();
    showToast("So'rovingiz yuborildi! Tez orada bog'lanamiz. 🎉");
  });

  form?.addEventListener("input", (e) => {
    e.target.classList?.remove("invalid");
  });

  /* ---------------- Misc ---------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  // Smooth anchor offset for older browsers is handled by CSS scroll-padding.
  // Close mobile menu on any in-page nav click:
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => {
      closeMenu();
    });
  });
})();

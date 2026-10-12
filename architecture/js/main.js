/* ============================================================
   AZURA Architects — main.js
   Kun/Tun, reveal, hisoblagichlar, filtr, lightbox, forma
   ============================================================ */

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------------- Theme: Kun / Tun ---------------- */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const STORAGE_KEY = "azura-arch-theme";

  const getPreferred = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    themeToggle?.setAttribute(
      "aria-label",
      theme === "dark" ? "Kun rejimiga o'tish" : "Tun rejimiga o'tish"
    );
  };

  applyTheme(getPreferred());

  themeToggle?.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? "dark" : "light");
        }
      } catch {}
    });

  /* ---------------- Scroll progress ---------------- */
  const scrollBar = $("#scrollBar");
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    scrollBar && (scrollBar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%");
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

  /* ---------------- Active nav on scroll ---------------- */
  const sections = $$("main section[id]");
  const navAnchors = $$(".nav-links a");

  if ("IntersectionObserver" in window && sections.length) {
    const nio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navAnchors.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + id)
          );
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => nio.observe(s));
  }

  /* ---------------- Reveal on scroll ---------------- */
  const staggerGroups = $$(
    ".hero-copy, .projects-grid, .services-grid, .gallery-grid, .contact-info, .values, .studio-grid"
  );
  staggerGroups.forEach((group) => {
    $$(".reveal", group).forEach((el, i) => {
      el.style.setProperty("--d", `${Math.min(i * 0.09, 0.6)}s`);
    });
  });

  const revealEls = $$(".reveal");
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
    const target = parseFloat(el.dataset.count || "0");
    const dur = 1500;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toString();
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

  /* ---------------- Project filter ---------------- */
  const filterBtns = $$(".filter-btn");
  const cards = $$(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
      const f = btn.dataset.filter;
      cards.forEach((card) => {
        const show = f === "all" || card.dataset.category === f;
        card.classList.toggle("hide", !show);
        if (show) {
          card.classList.remove("pop");
          // restart animation
          void card.offsetWidth;
          card.classList.add("pop");
        }
      });
    });
  });

  /* ---------------- Gallery lightbox ---------------- */
  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCaption = $("#lbCaption");
  const items = $$(".gallery-item");
  let lbIndex = 0;

  const openLb = (i) => {
    lbIndex = (i + items.length) % items.length;
    const item = items[lbIndex];
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

  items.forEach((item, i) => item.addEventListener("click", () => openLb(i)));
  $("#lbClose")?.addEventListener("click", closeLb);
  $("#lbPrev")?.addEventListener("click", (e) => { e.stopPropagation(); openLb(lbIndex - 1); });
  $("#lbNext")?.addEventListener("click", (e) => { e.stopPropagation(); openLb(lbIndex + 1); });
  lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLb(); });

  window.addEventListener("keydown", (e) => {
    if (lightbox?.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openLb(lbIndex - 1);
    if (e.key === "ArrowRight") openLb(lbIndex + 1);
  });

  /* ---------------- Contact form ---------------- */
  const form = $("#contactForm");
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
    $$("input[required], textarea[required]", form).forEach((inp) => {
      const ok = inp.value.trim() !== "";
      inp.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });
    const email = $('input[type="email"]', form);
    if (email && email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
      email.classList.add("invalid");
      valid = false;
    }
    if (!valid) {
      showToast("Iltimos, majburiy maydonlarni to'ldiring.");
      return;
    }
    form.reset();
    showToast("Rahmat! Xabaringiz yuborildi — tez orada javob beramiz.");
  });

  form?.addEventListener("input", (e) => e.target.classList?.remove("invalid"));

  /* ---------------- Misc ---------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
})();

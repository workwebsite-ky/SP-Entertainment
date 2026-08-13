/* =====================================================================
   SP ENTERTAINMENT LLC — Site interactions
   Vanilla JS, no dependencies. Progressive + accessible.
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Sticky nav: add background once the page is scrolled ---- */
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
    toggleTopBtn();
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu drawer ---- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    const setMenu = (open) => {
      toggle.classList.toggle("open", open);
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  /* ---- Scroll reveal via IntersectionObserver ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---- Animated stat counters ---- */
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dur = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        const val = target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---- Card cursor glow (tracks pointer for the red spotlight) ---- */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      // close siblings for a clean single-open accordion
      item.closest(".faq").querySelectorAll(".faq-item.open").forEach((sib) => {
        if (sib !== item) { sib.classList.remove("open"); sib.querySelector(".faq-a").style.maxHeight = null; sib.querySelector(".faq-q").setAttribute("aria-expanded","false"); }
      });
      item.classList.toggle("open", !open);
      q.setAttribute("aria-expanded", String(!open));
      a.style.maxHeight = open ? null : a.scrollHeight + "px";
    });
  });

  /* ---- Back-to-top button ---- */
  const topBtn = document.querySelector(".to-top");
  function toggleTopBtn() { if (topBtn) topBtn.classList.toggle("show", window.scrollY > 600); }
  if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---- Footer year ---- */
  const yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Contact form -> opens the user's email app (mailto fallback) ---- */
  const form = document.querySelector("#booking-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const g = (n) => (form.querySelector(`[name="${n}"]`)?.value || "").trim();
      const name = g("name"), email = g("email"), phone = g("phone");
      const type = g("event_type"), date = g("event_date"), msg = g("message");

      const subject = `Booking Enquiry — ${type || "Event"}${date ? " on " + date : ""} (${name || "New client"})`;
      const body =
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Event type: ${type}\n` +
        `Event date: ${date}\n\n` +
        `Details:\n${msg}\n`;

      window.location.href =
        `mailto:steviestevedj@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const status = form.querySelector(".form-status");
      if (status) status.textContent = "Opening your email app to send this to SP Entertainment…";
    });
  }

  // Initialise state on load
  onScroll();
})();

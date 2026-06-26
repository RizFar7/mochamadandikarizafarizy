/* ===================================================================
   IMPORT MOTION (vanilla "Motion One" library — same team as Framer Motion)
   Loaded as ES module from CDN.
   =================================================================== */
import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@10.18.0/+esm";

/* -------------------------------------------------------------------
   1. NAVIGATION — mobile toggle + active link highlight + bg on scroll
   ------------------------------------------------------------------- */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* -------------------------------------------------------------------
   2. ROUTE PROGRESS BAR — fills as user scrolls the whole page
   ------------------------------------------------------------------- */
const routeFill = document.getElementById("routeFill");

function updateRouteProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  routeFill.style.width = `${progress}%`;
}
window.addEventListener("scroll", updateRouteProgress, { passive: true });
updateRouteProgress();

/* -------------------------------------------------------------------
   3. SCROLL REVEAL — fade in + slide up/left/right via [data-reveal]
      Stagger handled via data-stagger index within shared parents.
   ------------------------------------------------------------------- */
const revealEls = document.querySelectorAll("[data-reveal]");

revealEls.forEach((el) => {
  inView(
    el,
    () => {
      const staggerIndex = el.dataset.stagger ? parseInt(el.dataset.stagger, 10) : 0;
      const baseDelay = el.dataset.stagger !== undefined ? staggerIndex * 0.12 : 0;

      animate(
        el,
        { opacity: 1, transform: "translate(0, 0)" },
        { duration: 0.8, delay: baseDelay, easing: [0.16, 1, 0.3, 1] }
      );
      el.classList.add("is-visible");
    },
    { amount: 0.2, margin: "0px 0px -10% 0px" }
  );
});

/* -------------------------------------------------------------------
   4. HERO ENTRANCE SEQUENCE — name, then tagline, then buttons
      Plays once on load (not scroll-triggered).
   ------------------------------------------------------------------- */
function playHeroSequence() {
  const eyebrow = document.querySelector('[data-reveal="fade"]');
  const nameLines = document.querySelectorAll('[data-reveal="name"]');
  const tagline = document.querySelector('[data-reveal="tagline"]');
  const buttons = document.querySelector('[data-reveal="buttons"]');

  const tl = [
    [eyebrow, { opacity: [0, 1] }, { duration: 0.7, easing: "ease-out" }],
    [
      nameLines,
      { opacity: [0, 1], transform: ["translateY(100%)", "translateY(0%)"] },
      { duration: 0.9, delay: stagger(0.15, { start: 0.25 }), easing: [0.16, 1, 0.3, 1] },
    ],
    [
      tagline,
      { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0)"] },
      { duration: 0.8, delay: 0.75, easing: [0.16, 1, 0.3, 1] },
    ],
    [
      buttons,
      { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0)"] },
      { duration: 0.8, delay: 1.0, easing: [0.16, 1, 0.3, 1] },
    ],
  ];

  tl.forEach(([target, keyframes, options]) => {
    if (target) animate(target, keyframes, options);
  });

  // Mark hero elements visible so reveal observer doesn't double-fire
  [eyebrow, tagline, buttons, ...nameLines].forEach((el) => el && el.classList.add("is-visible"));
}

// Run hero sequence shortly after paint
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(playHeroSequence, 150);
});

/* -------------------------------------------------------------------
   5. IMAGE PARALLAX — large photos drift slightly on scroll
   ------------------------------------------------------------------- */
const parallaxEls = document.querySelectorAll("[data-parallax]");

function updateParallax() {
  const viewportH = window.innerHeight;
  parallaxEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    // Only compute while element is reasonably near viewport (perf)
    if (rect.bottom < -200 || rect.top > viewportH + 200) return;

    const speed = parseFloat(el.dataset.parallax) || 0.15;
    const centerOffset = rect.top + rect.height / 2 - viewportH / 2;
    const shift = centerOffset * speed * -0.15;
    el.style.transform = `translateY(${shift}px) scale(1.08)`;
  });
}

window.addEventListener("scroll", updateParallax, { passive: true });
window.addEventListener("resize", updateParallax);
updateParallax();

/* -------------------------------------------------------------------
   6. EXPERIENCE TIMELINE — vertical line fills as user scrolls through
   ------------------------------------------------------------------- */
const timelineSection = document.getElementById("experienceTimeline");
const timelineFill = document.getElementById("timelineFill");

function updateTimelineFill() {
  if (!timelineSection || !timelineFill) return;
  const rect = timelineSection.getBoundingClientRect();
  const viewportH = window.innerHeight;

  // progress: 0 when section top reaches viewport center, 1 when section bottom passes viewport center
  const start = viewportH * 0.75;
  const end = rect.height - viewportH * 0.25;
  const scrolled = start - rect.top;
  const progress = Math.min(Math.max(scrolled / end, 0), 1);

  timelineFill.style.height = `${progress * 100}%`;
}

window.addEventListener("scroll", updateTimelineFill, { passive: true });
window.addEventListener("resize", updateTimelineFill);
updateTimelineFill();

/* -------------------------------------------------------------------
   7. ACTIVE NAV LINK — highlight current section in nav as you scroll
   ------------------------------------------------------------------- */
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav__links a");

function updateActiveNav() {
  let currentId = "";
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
      currentId = section.id;
    }
  });

  navAnchors.forEach((a) => {
    const isActive = a.getAttribute("href") === `#${currentId}`;
    a.style.opacity = isActive ? "1" : "0.75";
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const legacy = location.hash.slice(1);
const oldRoutes = ["rainloop", "pomsole", "biomimicry-journal", "mang-luoi-nhen", "toucan-boucan"];
if (["du-an", "mon-hoc"].includes(legacy)) location.replace(legacy + ".html");
if (legacy.startsWith("du-an/") && oldRoutes.includes(legacy.slice(6))) location.replace(legacy.slice(6) + ".html");

document.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (link?.matches('header nav a[aria-current="page"]') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    // The active project tab also appears on project detail pages. Keep that navigation.
    const canonical = path => path.replace(/index\.html$/, "");
    if (canonical(new URL(link.href).pathname) === canonical(location.pathname)) {
      event.preventDefault();
      window.scrollTo({top: 0, behavior: reduced.matches ? "instant" : "smooth"});
      return;
    }
  }
  if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || reduced.matches) return;
  const dest = new URL(link.href);
  if (dest.origin !== location.origin || dest.hash || dest.pathname === location.pathname) return;
  event.preventDefault();
  if (document.documentElement.classList.contains("depart")) return;
  document.documentElement.classList.add("depart");
  setTimeout(() => location.assign(dest.href), 225);
});
addEventListener("pageshow", () => document.documentElement.classList.remove("depart"));

// Release a small trail of seed leaves only while a mouse is moving.
const leafColors = ["#68ad73", "#e4ad36", "#cc6998"];
let lastLeaf = { x: -100, y: -100, time: 0 };
let leafIndex = 0;
document.addEventListener("pointermove", event => {
  if (event.pointerType !== "mouse" || !finePointer.matches || reduced.matches) return;
  const now = performance.now();
  const dx = event.clientX - lastLeaf.x;
  const dy = event.clientY - lastLeaf.y;
  if (now - lastLeaf.time < 46 || Math.hypot(dx, dy) < 12) return;
  lastLeaf = { x: event.clientX, y: event.clientY, time: now };
  const leaf = document.createElement("i");
  leaf.className = "pointer-leaf";
  leaf.setAttribute("aria-hidden", "true");
  leaf.style.left = event.clientX + 7 + "px";
  leaf.style.top = event.clientY + 7 + "px";
  leaf.style.backgroundColor = leafColors[leafIndex++ % leafColors.length];
  document.body.append(leaf);
  const tilt = Math.atan2(dy, dx) * 180 / Math.PI;
  const drift = leafIndex % 2 ? -12 : 12;
  const flight = leaf.animate([
    { transform: `rotate(${tilt}deg) scale(1)`, opacity: .9 },
    { transform: `translate(${drift}px, 20px) rotate(${tilt + 65}deg) scale(.2)`, opacity: 0 }
  ], { duration: 480, easing: "ease-out" });
  flight.onfinish = flight.oncancel = () => leaf.remove();
}, { passive: true });
if ("IntersectionObserver" in window && !reduced.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      }
    }
  }, {threshold: .12});
  document.querySelectorAll(".tile,.steps article,.goal-card,.atlas,.visitor-guide li,.path-stops article,.paper,.seed-grid details").forEach(item => observer.observe(item));
}

const heroFilm = document.querySelector(".hero-film video");
if (heroFilm && !reduced.matches) {
  heroFilm.play().catch(() => { /* Playback remains available through the native controls. */ });
}


// A soft spotlight follows the mouse without intercepting page controls.
const glow = document.createElement("div");
glow.className = "pointer-glow";
glow.setAttribute("aria-hidden", "true");
document.body.append(glow);
let glowFrame = 0;
let glowX = 0;
let glowY = 0;
document.addEventListener("pointermove", event => {
  if (event.pointerType !== "mouse" || !finePointer.matches || reduced.matches) return;
  glowX = event.clientX;
  glowY = event.clientY;
  glow.classList.add("visible");
  if (glowFrame) return;
  glowFrame = requestAnimationFrame(() => {
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    glowFrame = 0;
  });
}, { passive: true });
document.documentElement.addEventListener("pointerleave", () => glow.classList.remove("visible"));
reduced.addEventListener("change", () => glow.classList.remove("visible"));


// Anchor destinations stay below the sticky header at every screen size.
const stickyHeader = document.querySelector("header");
const updateHeaderOffset = () => {
  document.documentElement.style.setProperty("--header-offset", stickyHeader.offsetHeight + 18 + "px");
};
updateHeaderOffset();
if ("ResizeObserver" in window) {
  new ResizeObserver(updateHeaderOffset).observe(stickyHeader);
} else {
  addEventListener("resize", updateHeaderOffset, { passive: true });
}

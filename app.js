const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const legacy = location.hash.slice(1);
const oldRoutes = ["rainloop", "pomsole", "biomimicry-journal", "mang-luoi-nhen", "toucan-boucan"];
if (["du-an", "mon-hoc"].includes(legacy)) location.replace(legacy + ".html");
if (legacy.startsWith("du-an/") && oldRoutes.includes(legacy.slice(6))) location.replace(legacy.slice(6) + ".html");

document.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || reduced.matches) return;
  const dest = new URL(link.href);
  if (dest.origin !== location.origin || dest.hash || dest.pathname === location.pathname) return;
  event.preventDefault();
  document.documentElement.classList.add("depart");
  setTimeout(() => location.assign(dest.href), 225);
});
addEventListener("pageshow", () => document.documentElement.classList.remove("depart"));

const cursor = document.querySelector("#cursor");
if (finePointer.matches) {
  document.addEventListener("pointermove", event => {
    const visible = !reduced.matches && Boolean(event.target.closest(".tile .art"));
    cursor.classList.toggle("show", visible);
    if (visible) cursor.style.transform = `translate(${event.clientX + 12}px, ${event.clientY + 12}px)`;
  });
  document.documentElement.addEventListener("pointerleave", () => cursor.classList.remove("show"));
  const hero = document.querySelector(".hero-photo");
  hero?.addEventListener("pointermove", event => {
    if (reduced.matches) return;
    const box = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", (event.clientX - box.left - box.width / 2) / box.width * 12 + "px");
    hero.style.setProperty("--my", (event.clientY - box.top - box.height / 2) / box.height * 10 + "px");
  });
  hero?.addEventListener("pointerleave", () => {
    hero.style.removeProperty("--mx");
    hero.style.removeProperty("--my");
  });
}
if ("IntersectionObserver" in window && !reduced.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      }
    }
  }, {threshold: .12});
  document.querySelectorAll(".tile,.steps article").forEach(item => observer.observe(item));
}

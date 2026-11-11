const projects = [
  {
    slug: "rainloop", name: "RainLoop", summary: "Thu và tái sử dụng nước mưa trong sân trường.",
    story: "Lấy cảm hứng từ đất ngập nước, RainLoop đề xuất thu nước mưa, lọc sơ bộ, trữ tạm rồi dẫn nước đến vùng rễ cây.",
    url: "https://tommykhanhtrinh.github.io/rain-loop-website/index.html"
  },
  {
    slug: "pomsole", name: "PomSole", summary: "Từ cấu trúc vỏ bưởi đến thiết kế đế giày.",
    story: "PomSole khám phá cách vận dụng cấu trúc của vỏ bưởi vào đế giày. Trang sản phẩm trưng bày ba mẫu để người xem lật thẻ và khám phá từng thiết kế.",
    url: "https://keen-lokum-f9eccd.netlify.app/san-pham"
  },
  {
    slug: "biomimicry-journal", name: "Biomimicry Journal", summary: "Nhật ký quan sát sinh vật và phát triển ý tưởng.",
    story: "Bắt đầu từ những quan sát về hải ly, cuốn nhật ký dẫn người xem qua các thẻ phỏng sinh học, bảng cảm hứng và quá trình hình thành ý tưởng thiết kế.",
    url: "https://lstsict2526.my.canva.site/gk/biomimicry-journal"
  },
  {
    slug: "mang-luoi-nhen", name: "Hệ thống Mạng Lưới Nhện", summary: "Ý tưởng lưới chắn rác trên sông Sài Gòn.",
    story: "Nhóm đề xuất hệ thống lưới chắn rác thông minh lấy cảm hứng từ mạng nhện. Website dự án mở đầu bằng màn hình đăng nhập để truy cập hệ thống.",
    url: "https://luoiracweb.oneapp.dev/"
  },
  {
    slug: "toucan-boucan", name: "Toucan Boucan", summary: "Bao bì bảo vệ hàng hóa lấy cảm hứng từ mỏ chim.",
    story: "Dự án TB Protect tìm hiểu cấu trúc nhẹ của mỏ chim toucan và vận dụng nguyên lý này vào thiết kế bao bì nhiều lớp bảo vệ hàng hóa.",
    url: "https://toucan-boucan.minh-nguyen1.workers.dev/"
  }
];
const cards = document.querySelector("#cards");
const detail = document.querySelector("#detail");
const home = document.querySelector("#home");
const ring = document.querySelector("#cursor");
const motion = matchMedia("(prefers-reduced-motion: reduce)");
function preview(project, index) {
  return '<div class="art"><img src="assets/' + (index + 1) + '.jpg" alt="Giao diện ' + project.name + '"></div>';
}
cards.innerHTML = projects.map((p, i) => `
  <a class="tile" href="#du-an/${p.slug}">
    ${preview(p, i)}
    <div class="cardline"><h3>${p.name}</h3><span aria-hidden="true">↗</span></div>
    <p>${p.summary}</p>
  </a>`).join("");
let lastProject = "";
function render() {
  const route = location.hash.slice(1) || "trang-chu";
  const index = projects.findIndex(p => route === "du-an/" + p.slug);
  const p = projects[index];
  ring.classList.remove("show");
  detail.hidden = !p;
  home.hidden = Boolean(p);
  document.title = (p ? p.name : "Triển lãm phỏng sinh học") + " · Nếp Tự Nhiên";
  for (const link of document.querySelectorAll("nav a")) {
    if (link.hash === "#" + (p ? "du-an" : route)) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  if (p) {
    detail.innerHTML = `<a class="back" href="#du-an">← Bộ sưu tập dự án</a><h1 tabindex="-1">${p.name}</h1><p>${p.story}</p><a class="button" href="${p.url}" target="_blank" rel="noopener">Trải nghiệm website <span>↗</span></a>${preview(p, index)}`;
    detail.querySelector("h1").focus({preventScroll:true});
    window.scrollTo({top:0, behavior:"instant"});
    if (!motion.matches) detail.animate([{opacity:0,transform:"translateY(14px)"},{opacity:1,transform:"none"}],{duration:350});
    lastProject = p.slug;
  } else {
    const section = document.getElementById(route);
    if (lastProject && route === "du-an") {
      cards.querySelector('[href="#du-an/' + lastProject + '"]').focus({preventScroll:true});
    }
    if (section && location.hash) section.scrollIntoView({behavior:lastProject || motion.matches ? "instant" : "smooth"});
    if(lastProject && !motion.matches) home.animate([{opacity:.3},{opacity:1}],{duration:300});
    lastProject = "";
  }
}
addEventListener("hashchange", render);
render();
if (matchMedia("(pointer:fine) and (hover:hover)").matches) {
  cards.addEventListener("pointermove", event => {
    ring.classList.toggle("show", !motion.matches && Boolean(event.target.closest(".art")));
    ring.style.transform = `translate(${event.clientX+13}px,${event.clientY+13}px)`;
  });
  cards.addEventListener("pointerleave", () => ring.classList.remove("show"));
}

const steps = [
  {
    label: "Un gato bailando",
    image: "images/cat-dancing.svg",
    poem: "El desayuno para mi amada es importante\nle gusta en cantidades no mezquinas\nFranceses, laminados con chocolate\npor eso, en la mañana lo hacemos sin rutinas.",
    links: [
      { type: "instagram", url: "https://www.instagram.com/Saintpanaderia/", label: "Saint Panadería" },
      { type: "maps", url: "https://maps.app.goo.gl/Jixf1Zr94hxWhKWt7", label: "Cómo llegar" }
    ]
  },
  {
    label: "Un gato con flores",
    image: "images/cat-flowers.svg",
    poem: "¡Flores! exclama Luisa\nno puede con el color y los olores\nle encanta que le llegue con la brisa\nes por eso visitamos los bosques y sus flores.",
    links: [
      { type: "maps", url: "https://maps.app.goo.gl/RDGESJsba7BncK1YA", label: "Cómo llegar" }
    ]
  },
  {
    label: "Un gato comiendo",
    image: "images/cat-churros.svg",
    poem: "Unos churros del moro, esto no necesita poesía, ¿o sí?",
    links: []
  },
  {
    label: "Un gato con flores",
    image: "images/cat-flowers.svg",
    poem: "Hoy en tu día no hubo flores\npensarás: qué atípico no tenerlas,\npues no, en tu día iremos directo a ellas\ny así en el mercado comprarte a montones.",
    links: [
      { type: "maps", url: "https://maps.app.goo.gl/FDQKfxmobU2nnVNx5", label: "Cómo llegar" }
    ]
  },
  {
    label: "Un gato con algo de beber caliente",
    image: "images/cat-hot-drink.svg",
    poem: "Cacahuatl, kakw, biziaa, cajecuas\ntodos nombres que no tenemos\npero si digo chocolate, de una entendemos\npues bien, te invitamos a uno y a todos los que quieras.",
    links: [
      { type: "instagram", url: "https://www.instagram.com/larifachocolateria/", label: "La Rifa Chocolatería" }
    ]
  },
  {
    label: "Un gato negro gordo",
    image: "images/cat-fat-black.svg",
    poem: "Detallista no seré\nno tendré el toque que tú\npero estas palabras del corazón vienen\ny que para siempre serán para ti.\n\nTe amo amorcito.",
    links: []
  }
];

const TOTAL = steps.length;
let currentIndex = 0;

const bentoGrid = document.getElementById("bentoGrid");
const detailOverlay = document.getElementById("detailOverlay");
const detailBackdrop = document.getElementById("detailBackdrop");
const detailClose = document.getElementById("detailClose");
const detailPrev = document.getElementById("detailPrev");
const detailNext = document.getElementById("detailNext");
const detailImg = document.getElementById("detailImg");
const detailStepLabel = document.getElementById("detailStepLabel");
const detailTitle = document.getElementById("detailTitle");
const detailPoem = document.getElementById("detailPoem");
const detailLinks = document.getElementById("detailLinks");

function catImageUrl(seed, size) {
  return `https://cataas.com/cat/black?width=${size}&height=${size}&i=${seed}`;
}

const FALLBACK_CATS = ["images/cat-1.svg", "images/cat-2.svg", "images/cat-3.svg"];

function fallbackCatUrl(seed) {
  return FALLBACK_CATS[seed % FALLBACK_CATS.length];
}

// If the live cataas.com photo fails to load, swap in a local kitsch cat illustration
function withFallback(img, seed) {
  img.addEventListener("error", () => {
    img.src = fallbackCatUrl(seed);
    img.classList.add("fallback-cat");
  }, { once: true });
}

const BG_CAT_COUNT = 8;

function buildBackgroundCats() {
  const layer = document.getElementById("bgCats");
  for (let i = 0; i < BG_CAT_COUNT; i++) {
    const img = document.createElement("img");
    const size = 60 + Math.random() * 90;
    img.className = "bg-cat";
    img.alt = "";
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.top = `${Math.random() * 95}%`;
    img.style.left = `${Math.random() * 95}%`;
    img.style.animationDuration = `${20 + Math.random() * 25}s`;
    img.style.animationDelay = `-${Math.random() * 20}s`;
    withFallback(img, i);
    img.src = catImageUrl(`bg${i}`, 200);
    layer.appendChild(img);
  }
}

const LINK_ICONS = { instagram: "📷", maps: "📍" };

function renderLinks(step) {
  return step.links
    .map(link => `<a class="link-pill link-${link.type}" href="${link.url}" target="_blank" rel="noopener noreferrer">${LINK_ICONS[link.type] || "🔗"} ${escapeHtml(link.label)}</a>`)
    .join("");
}

function buildBentoGrid() {
  steps.forEach((step, i) => {
    const item = document.createElement("div");
    item.className = "bento-item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.style.animationDelay = `-${(i * 0.8).toFixed(1)}s`;
    item.setAttribute("aria-label", `Ver paso ${i + 1}: ${step.label}`);

    item.innerHTML = `
      <div class="bento-photo">
        <img src="${step.image}" alt="${escapeHtml(step.label)}" loading="lazy">
        <span class="bento-badge">${i + 1}</span>
      </div>
      <div class="bento-content">
        <h3 class="bento-title">${escapeHtml(step.label)}</h3>
        <p class="bento-poem">${escapeHtml(step.poem)}</p>
        ${step.links.length ? `<div class="bento-links">${renderLinks(step)}</div>` : ""}
      </div>
    `;

    item.addEventListener("click", () => openDetail(i));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetail(i);
      }
    });

    bentoGrid.appendChild(item);
  });
}

const titleColors = ["#ff0fc4", "#ffb84d", "#00e6a0", "#00c3ff", "#b026ff", "#ff5e3a", "#ffe600"];

function buildCutoutTitle(el, text) {
  el.textContent = "";
  let charCount = 0;

  text.trim().split(" ").forEach((word) => {
    const wordEl = document.createElement("span");
    wordEl.className = "word";

    [...word].forEach((char) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = char;
      span.style.background = titleColors[charCount % titleColors.length];
      span.style.color = "#fff";
      span.style.transform = `rotate(${(charCount % 2 === 0 ? -1 : 1) * (4 + (charCount % 3) * 2)}deg)`;
      wordEl.appendChild(span);
      charCount++;
    });

    el.appendChild(wordEl);
  });
}

function openDetail(index) {
  currentIndex = ((index % TOTAL) + TOTAL) % TOTAL;
  const step = steps[currentIndex];

  detailImg.classList.remove("fallback-cat");
  detailImg.alt = step.label;
  detailImg.src = step.image;

  detailStepLabel.textContent = `Paso ${currentIndex + 1} de ${TOTAL}`;
  buildCutoutTitle(detailTitle, step.label);
  detailPoem.textContent = step.poem;
  detailLinks.innerHTML = renderLinks(step);

  detailOverlay.classList.add("open");
}

function closeDetail() {
  detailOverlay.classList.remove("open");
}

// ===== HTML escaping =====
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ===== Init =====
buildBackgroundCats();
buildCutoutTitle(document.getElementById("heroTitle"), document.getElementById("heroTitle").textContent);
buildBentoGrid();

detailClose.addEventListener("click", closeDetail);
detailBackdrop.addEventListener("click", closeDetail);
detailPrev.addEventListener("click", () => openDetail(currentIndex - 1));
detailNext.addEventListener("click", () => openDetail(currentIndex + 1));

// Keyboard navigation (only while the detail overlay is open)
document.addEventListener("keydown", (e) => {
  if (!detailOverlay.classList.contains("open")) return;
  if (e.key === "Escape") closeDetail();
  if (e.key === "ArrowLeft") openDetail(currentIndex - 1);
  if (e.key === "ArrowRight") openDetail(currentIndex + 1);
});

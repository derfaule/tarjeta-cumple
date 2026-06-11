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
let expandedIndex = null;

const bentoGrid = document.getElementById("bentoGrid");

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
    item.style.setProperty("--i", i);
    item.style.animationDelay = `${(i * 0.08).toFixed(2)}s, -${(i * 0.8).toFixed(1)}s`;
    item.style.animationDirection = `normal, ${i % 2 === 0 ? "alternate" : "alternate-reverse"}`;
    item.setAttribute("aria-label", `Expandir paso ${i + 1}: ${step.label}`);

    item.innerHTML = `
      <div class="bento-photo">
        <img src="${step.image}" alt="${escapeHtml(step.label)}" loading="lazy">
        <span class="bento-shape" aria-hidden="true"></span>
        <span class="bento-badge">${i + 1}</span>
      </div>
      <div class="bento-content">
        <h3 class="bento-title">${escapeHtml(step.label)}</h3>
        <p class="bento-poem">${escapeHtml(step.poem)}</p>
        ${step.links.length ? `<div class="bento-links">${renderLinks(step)}</div>` : ""}
      </div>
    `;

    item.addEventListener("click", () => toggleExpand(i));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleExpand(i);
      }
    });

    bentoGrid.appendChild(item);
  });
}

function getGridCols() {
  if (window.innerWidth >= 1100) return 3;
  if (window.innerWidth >= 700) return 2;
  return 1;
}

function applyGridTemplate() {
  const cols = getGridCols();

  if (expandedIndex === null || cols === 1) {
    bentoGrid.style.gridTemplateColumns = "";
    bentoGrid.style.gridTemplateRows = "";
    return;
  }

  const rows = TOTAL / cols;
  const expandedCol = expandedIndex % cols;
  const expandedRow = Math.floor(expandedIndex / cols);

  bentoGrid.style.gridTemplateColumns = Array.from({ length: cols }, (_, c) => c === expandedCol ? "2fr" : "1fr").join(" ");
  bentoGrid.style.gridTemplateRows = Array.from({ length: rows }, (_, r) => r === expandedRow ? "2fr" : "1fr").join(" ");
}

function toggleExpand(index) {
  expandedIndex = expandedIndex === index ? null : index;

  document.querySelectorAll(".bento-item").forEach((item, i) => {
    item.classList.toggle("expanded", i === expandedIndex);
  });

  applyGridTemplate();
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

window.addEventListener("resize", applyGridTemplate);

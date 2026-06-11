const steps = [
  {
    title: "La Invitación Maldita 🦇",
    before: "Antes: revisa tu correo embrujado, una lechuza (o un email) trae tu invitación...",
    description: "Recibe tu invitación oficial al aquelarre de cumpleaños más kitsch del año. ¡Disfraz obligatorio!",
    after: "Después: marca la fecha en tu calendario con purpurina y empieza la cuenta regresiva 🌙",
    location: "Plaza Mayor, Madrid"
  },
  {
    title: "El Ritual de Arreglo 💅",
    before: "Antes: elige tu mejor outfit felino, entre más brillos mejor.",
    description: "Maquillaje neón, orejitas de gato y mucho glitter. Hoy todos somos gatos negros de gala.",
    after: "Después: revisa el espejo tres veces, ¡la magia está en los detalles!",
    location: "Gran Vía, Madrid"
  },
  {
    title: "La Llegada Triunfal 🚪",
    before: "Antes: respira hondo y prepárate para entrar como toda una estrella.",
    description: "Cruza el umbral entre humo de máquina y luces moradas. ¡Bienvenido al cumple!",
    after: "Después: deja tu abrigo (y tus preocupaciones) en la entrada.",
    location: "Puerta del Sol, Madrid"
  },
  {
    title: "El Photocall Felino 📸",
    before: "Antes: practica tu mejor pose misteriosa frente al espejo.",
    description: "Una zona decorada con gatos negros, lunas y estrellas para las fotos más kitsch de la noche.",
    after: "Después: sube tu foto favorita con el hashtag #GatoCumpleañero.",
    location: "Mercado de San Miguel, Madrid"
  },
  {
    title: "Juegos de Brujas 🪄",
    before: "Antes: forma equipos y elige tu varita (cuchara) de la suerte.",
    description: "Juegos temáticos: caza del gato negro, bingo de hechizos y trivia de cumpleaños.",
    after: "Después: el equipo ganador recibe un amuleto (dulce) especial.",
    location: "Parque del Retiro, Madrid"
  },
  {
    title: "El Festín 🍕",
    before: "Antes: aparta tu lugar en la mesa, ¡el banquete está por comenzar!",
    description: "Comida deliciosa servida entre velas y decoración kitsch llena de gatos por doquier.",
    after: "Después: deja espacio para el postre... ¡algo mágico se aproxima!",
    location: "Mercado de San Antón, Madrid"
  },
  {
    title: "El Pastel Mágico 🎂",
    before: "Antes: apaga las luces, las velas están listas para encenderse.",
    description: "¡Hora del pastel! Pide tu deseo bajo la mirada atenta de nueve gatos negros.",
    after: "Después: aplausos, fotos y el primer corte ceremonial del pastel.",
    location: "Chocolatería San Ginés, Madrid"
  },
  {
    title: "Apertura de Regalos 🎁",
    before: "Antes: forma un círculo mágico alrededor del homenajeado.",
    description: "Cada regalo se abre como si fuera un cofre encantado, ¡con su propio drumroll!",
    after: "Después: agradecimientos especiales y abrazos para todos.",
    location: "El Rastro, Madrid"
  },
  {
    title: "El Hechizo de Despedida 🌌",
    before: "Antes: prepárate para el último baile de la noche.",
    description: "Una última canción, una última foto grupal y un brindis bajo la luna.",
    after: "Después: vuelve a casa con el corazón lleno de magia (y un dulce extra en el bolsillo).",
    location: "Templo de Debod, Madrid"
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
const detailBefore = document.getElementById("detailBefore");
const detailDescription = document.getElementById("detailDescription");
const detailAfter = document.getElementById("detailAfter");

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

function mapEmbedUrl(location) {
  return `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
}

function buildBentoGrid() {
  steps.forEach((step, i) => {
    const item = document.createElement("div");
    item.className = "bento-item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.style.animationDelay = `-${(i * 0.8).toFixed(1)}s`;
    item.setAttribute("aria-label", `Ver paso ${i + 1}: ${step.title}`);

    item.innerHTML = `
      <div class="bento-photo">
        <img alt="Gato negro kitsch del paso ${i + 1}" loading="lazy">
        <span class="bento-badge">${i + 1}</span>
      </div>
      <div class="bento-content">
        <h3 class="bento-title">${step.title}</h3>
        <p class="bento-desc">${step.description}</p>
      </div>
      <div class="bento-map" aria-hidden="true">
        <iframe src="${mapEmbedUrl(step.location)}" loading="lazy" tabindex="-1" title="Mapa de ${step.title}"></iframe>
      </div>
    `;

    const img = item.querySelector("img");
    withFallback(img, i);
    img.src = catImageUrl(i, 400);

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
  detailImg.alt = `Gato negro kitsch del paso ${currentIndex + 1}`;
  detailImg.src = catImageUrl(currentIndex, 600);
  withFallback(detailImg, currentIndex);

  detailStepLabel.textContent = `Paso ${currentIndex + 1} de ${TOTAL}`;
  buildCutoutTitle(detailTitle, step.title);
  detailBefore.textContent = `🔸 ${step.before}`;
  detailDescription.textContent = step.description;
  detailAfter.textContent = `🔹 ${step.after}`;

  detailOverlay.classList.add("open");
}

function closeDetail() {
  detailOverlay.classList.remove("open");
}

// ===== Comments (stored in localStorage) =====
const COMMENTS_KEY = "kitschCardComments";

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function loadComments() {
  try {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveComments(comments) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

function renderComments() {
  const list = document.getElementById("commentsList");
  const comments = loadComments();

  if (comments.length === 0) {
    list.innerHTML = `<p class="empty-comments">¡Sé el primero en dejar tu hechizo de buenos deseos! 🐈‍⬛</p>`;
    return;
  }

  list.innerHTML = comments
    .map(c => `
      <div class="comment-card">
        <p class="comment-author">${escapeHtml(c.name)} dice:</p>
        <p class="comment-body">${escapeHtml(c.text)}</p>
      </div>
    `)
    .join("");
}

function initComments() {
  const form = document.getElementById("commentForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("commentName");
    const textInput = document.getElementById("commentText");

    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    if (!name || !text) return;

    const comments = loadComments();
    comments.push({ name, text });
    saveComments(comments);

    nameInput.value = "";
    textInput.value = "";
    renderComments();
  });

  renderComments();
}

// ===== Init =====
buildBackgroundCats();
buildCutoutTitle(document.getElementById("heroTitle"), document.getElementById("heroTitle").textContent);
buildBentoGrid();
initComments();

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

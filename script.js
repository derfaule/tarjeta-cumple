const steps = [
  {
    title: "La Invitación Maldita 🦇",
    before: "Antes: revisa tu correo embrujado, una lechuza (o un email) trae tu invitación...",
    description: "Recibe tu invitación oficial al aquelarre de cumpleaños más kitsch del año. ¡Disfraz obligatorio!",
    after: "Después: marca la fecha en tu calendario con purpurina y empieza la cuenta regresiva 🌙"
  },
  {
    title: "El Ritual de Arreglo 💅",
    before: "Antes: elige tu mejor outfit felino, entre más brillos mejor.",
    description: "Maquillaje neón, orejitas de gato y mucho glitter. Hoy todos somos gatos negros de gala.",
    after: "Después: revisa el espejo tres veces, ¡la magia está en los detalles!"
  },
  {
    title: "La Llegada Triunfal 🚪",
    before: "Antes: respira hondo y prepárate para entrar como toda una estrella.",
    description: "Cruza el umbral entre humo de máquina y luces moradas. ¡Bienvenido al cumple!",
    after: "Después: deja tu abrigo (y tus preocupaciones) en la entrada."
  },
  {
    title: "El Photocall Felino 📸",
    before: "Antes: practica tu mejor pose misteriosa frente al espejo.",
    description: "Una zona decorada con gatos negros, lunas y estrellas para las fotos más kitsch de la noche.",
    after: "Después: sube tu foto favorita con el hashtag #GatoCumpleañero."
  },
  {
    title: "Juegos de Brujas 🪄",
    before: "Antes: forma equipos y elige tu varita (cuchara) de la suerte.",
    description: "Juegos temáticos: caza del gato negro, bingo de hechizos y trivia de cumpleaños.",
    after: "Después: el equipo ganador recibe un amuleto (dulce) especial."
  },
  {
    title: "El Festín 🍕",
    before: "Antes: aparta tu lugar en la mesa, ¡el banquete está por comenzar!",
    description: "Comida deliciosa servida entre velas y decoración kitsch llena de gatos por doquier.",
    after: "Después: deja espacio para el postre... ¡algo mágico se aproxima!"
  },
  {
    title: "El Pastel Mágico 🎂",
    before: "Antes: apaga las luces, las velas están listas para encenderse.",
    description: "¡Hora del pastel! Pide tu deseo bajo la mirada atenta de nueve gatos negros.",
    after: "Después: aplausos, fotos y el primer corte ceremonial del pastel."
  },
  {
    title: "Apertura de Regalos 🎁",
    before: "Antes: forma un círculo mágico alrededor del homenajeado.",
    description: "Cada regalo se abre como si fuera un cofre encantado, ¡con su propio drumroll!",
    after: "Después: agradecimientos especiales y abrazos para todos."
  },
  {
    title: "El Hechizo de Despedida 🌌",
    before: "Antes: prepárate para el último baile de la noche.",
    description: "Una última canción, una última foto grupal y un brindis bajo la luna.",
    after: "Después: vuelve a casa con el corazón lleno de magia (y un dulce extra en el bolsillo)."
  }
];

const TOTAL = steps.length;
let currentIndex = 0;

const stage = document.getElementById("stage");
const dial = document.getElementById("clockDial");
const dialHand = document.getElementById("dialHand");
const stepCounter = document.getElementById("stepCounter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function catImageUrl(seed, size) {
  return `https://cataas.com/cat/black?width=${size}&height=${size}&i=${seed}`;
}

function buildSlides() {
  steps.forEach((step, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.dataset.index = i;

    slide.innerHTML = `
      <div class="slide-image-wrap">
        <img class="slide-bg-img" src="${catImageUrl(i, 800)}" alt="" loading="lazy">
        <img class="slide-fg-img" src="${catImageUrl(i + 100, 600)}" alt="Gato negro kitsch del paso ${i + 1}" loading="lazy">
      </div>
      <p class="slide-step-label">Paso ${i + 1} de ${TOTAL}</p>
      <h3 class="slide-title">${step.title}</h3>
      <p class="slide-text before-text">🔸 ${step.before}</p>
      <p class="slide-description">${step.description}</p>
      <p class="slide-text after-text">🔹 ${step.after}</p>
    `;

    stage.appendChild(slide);
  });
}

function buildDial() {
  const radius = 95;
  for (let i = 0; i < TOTAL; i++) {
    const angle = (360 / TOTAL) * i;
    const rad = (angle - 90) * (Math.PI / 180);
    const x = 110 + radius * Math.cos(rad);
    const y = 110 + radius * Math.sin(rad);

    const dot = document.createElement("button");
    dot.className = "dial-dot";
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.dataset.index = i;
    dot.textContent = i + 1;
    dot.setAttribute("aria-label", `Ir al paso ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));

    dial.appendChild(dot);
  }
}

function updateDial() {
  document.querySelectorAll(".dial-dot").forEach(dot => {
    dot.classList.toggle("active", Number(dot.dataset.index) === currentIndex);
  });
  const angle = (360 / TOTAL) * currentIndex;
  dialHand.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}

function render(direction) {
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide, i) => {
    slide.classList.remove("active", "prev", "next");
    if (i === currentIndex) {
      slide.classList.add("active");
    } else if (i === (currentIndex - 1 + TOTAL) % TOTAL) {
      slide.classList.add("prev");
    } else if (i === (currentIndex + 1) % TOTAL) {
      slide.classList.add("next");
    }
  });
  updateDial();
  stepCounter.textContent = `Paso ${currentIndex + 1} / ${TOTAL}`;
}

function goTo(index) {
  currentIndex = ((index % TOTAL) + TOTAL) % TOTAL;
  render();
}

function next() {
  goTo(currentIndex + 1);
}

function prev() {
  goTo(currentIndex - 1);
}

// Parallax effect: move bg/fg cat images on mouse movement over the active slide
function initParallax() {
  stage.addEventListener("mousemove", (e) => {
    const activeSlide = stage.querySelector(".slide.active");
    if (!activeSlide) return;
    const rect = activeSlide.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const bg = activeSlide.querySelector(".slide-bg-img");
    const fg = activeSlide.querySelector(".slide-fg-img");
    if (bg) bg.style.transform = `scale(1.3) translate(${x * -20}px, ${y * -20}px)`;
    if (fg) fg.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
  });

  stage.addEventListener("mouseleave", () => {
    const activeSlide = stage.querySelector(".slide.active");
    if (!activeSlide) return;
    const bg = activeSlide.querySelector(".slide-bg-img");
    const fg = activeSlide.querySelector(".slide-fg-img");
    if (bg) bg.style.transform = "";
    if (fg) fg.style.transform = "";
  });
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
buildSlides();
buildDial();
render();
initParallax();
initComments();

prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
});

// Touch swipe support
let touchStartX = 0;
stage.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
stage.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? prev() : next();
  }
});

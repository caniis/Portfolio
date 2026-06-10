/* =====================
   Scroll Progress Bar
   ===================== */
const progressBar = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / total * 100) + '%';
});

/* =====================
   Nav Scroll Effect
   ===================== */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* =====================
   Custom Cursor
   ===================== */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

// Smooth follower
(function loop() {
  fx += (mx - fx) * .12;
  fy += (my - fy) * .12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(loop);
})();

/* =====================
   Typewriter
   ===================== */
const tw = document.querySelector('.typewriter');
if (tw) {
  const words = JSON.parse(tw.dataset.words);
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    tw.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);

    if (!deleting && ci > word.length) {
      setTimeout(() => { deleting = true; type(); }, 1600);
      return;
    }
    if (deleting && ci < 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
      ci = 0;
      setTimeout(type, 300);
      return;
    }
    setTimeout(type, deleting ? 55 : 85);
  }

  setTimeout(type, 1400);
}

/* =====================
   Particle Network
   ===================== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = 70;
const MAX_DIST = 140;
const pts = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  pts.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .45,
    vy: (Math.random() - .5) * .45,
    r: Math.random() * 1.8 + .6,
  });
}

let mouse = { x: -9999, y: -9999 };
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pts.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    // Draw dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(140,123,117,.35)';
    ctx.fill();
  });

  // Draw connecting lines
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < MAX_DIST) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(140,123,117,${(1 - d / MAX_DIST) * .18})`;
        ctx.lineWidth = .8;
        ctx.stroke();
      }
    }

    // Mouse repel/attract
    const dx = pts[i].x - mouse.x;
    const dy = pts[i].y - mouse.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 120) {
      ctx.beginPath();
      ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = `rgba(140,123,117,${(1 - d / 120) * .25})`;
      ctx.lineWidth = .8;
      ctx.stroke();
    }
  }

  requestAnimationFrame(draw);
}

draw();

/* =====================
   Scroll Reveal
   ===================== */
const revealEls = document.querySelectorAll('.reveal');
const skillsGrid = document.querySelector('.skills-grid');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.18 });

revealEls.forEach(el => revealObserver.observe(el));
if (skillsGrid) revealObserver.observe(skillsGrid);

/* =====================
   Cards Reveal
   ===================== */
const cards = document.querySelectorAll('.reveal-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cards.forEach(c => cardObserver.observe(c));

/* =====================
   3D Tilt Cards
   ===================== */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    card.style.transform = `
      perspective(800px)
      rotateY(${dx * 6}deg)
      rotateX(${-dy * 6}deg)
      translateY(-6px)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .6s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
});

/* =====================
   Modal
   ===================== */
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc  = document.getElementById('modal-desc');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

document.querySelectorAll('.card[data-title]').forEach(card => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent  = card.dataset.desc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* =====================
   Nav Link Smooth
   ===================== */
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});
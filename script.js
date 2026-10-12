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
   作品資料（展示頁內容）
   ---------------------
   每個主題的標題、說明、工具、連結仍然讀取 index.html 的卡片；
   這裡只放「要展示的影片 / 圖片」。以 data-id 對應卡片。

   media 的 type：
     video    本機短影片（靜音、自動循環）  src: 'https://caniis.github.io/Portfolio/media/xxx.mp4'
     image    圖片 / GIF                    src: 'https://caniis.github.io/Portfolio/media/xxx.jpg'
     youtube  YouTube（靜音循環）           id : '影片ID'
   wide: true 代表佔滿整排；cover: true 代表用這支影片當卡片封面
   檔案還沒放進 media 資料夾時，會顯示提示框，不會出錯。
   ===================== */
const PROJECTS = {
  model: [
    { type: 'video', src: 'https://caniis.github.io/Portfolio/media/model-1.mp4', caption: '原創武器 - 仙源扇', wide: true, cover: true },
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/model-2.png', caption: '即刻槍戰 - 地獄火 Mk.0' },
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/model-3.png', caption: '背包 GUI 設計' }
  ],
  game3d: [
    { type: 'youtube', id: 'DFr279ASaUA', caption: 'FPS 射擊標靶遊戲試玩影片', wide: true }
  ],
  game2d: [
    { type: 'youtube', id: 'IDEt5thEsD8', caption: '防疫小遊戲遊玩影片', wide: true }
  ],
  code: [
     
  ],
  anim3d: [
    { type: 'video', src: 'https://caniis.github.io/Portfolio/media/anim3d-1.mp4', caption: '蝴蝶刀展示動畫', wide: true, cover: true },
    { type: 'video', src: 'https://caniis.github.io/Portfolio/media/anim3d-2.mp4', caption: '手槍換彈與開火動畫' },
    { type: 'video', src: 'https://caniis.github.io/Portfolio/media/anim3d-3.mp4', caption: '紙袋貓動畫 (Grease Pencil)' },
    { type: 'video', src: 'https://caniis.github.io/Portfolio/media/anim3d-4.mp4', caption: '咕咕鐘動畫' }
  ],
  anim2d: [
    { type: 'youtube', id: '6FsIAzXhg3E', caption: '車車大冒險', wide: true }
  ],
  paint: [
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/paint-1.png'},
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/paint-2.png'},
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/paint-3.png'},
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/paint-4.png'},
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/paint-5.png'},
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/paint-6.png'}
  ],
  draw: [
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/draw-1.png'},
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/draw-2.png'},
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/draw-3.png'},
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/draw-4.png'},
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/draw-5.png'},
    { type: 'image', src: 'https://caniis.github.io/Portfolio/media/draw-6.png'}
  ]
};

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 影片只在畫面內播放，離開就暫停 */
const videoObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !reduceMotion) e.target.play().catch(() => {});
    else e.target.pause();
  });
}, { threshold: 0.25 });

function makeVideo(src) {
  const v = document.createElement('video');
  v.src = src;
  v.muted = true;
  v.loop = true;
  v.playsInline = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');
  v.preload = 'metadata';
  if (reduceMotion) v.controls = true;
  videoObserver.observe(v);
  return v;
}

function missingBox(path) {
  const d = document.createElement('div');
  d.className = 'g-missing';
  const title = document.createElement('b');
  title.textContent = '圖片／影片尚未放入';
  const note = document.createElement('span');
  note.textContent = '請將檔案放到：' + path;
  d.append(title, note);
  return d;
}

/* 卡片封面：有 cover 影片就疊在原本圖片上循環播放 */
document.querySelectorAll('.card[data-id]').forEach(card => {
  const item = (PROJECTS[card.dataset.id] || []).find(m => m.cover && m.type === 'video');
  if (!item) return;
  const v = makeVideo(item.src);
  v.addEventListener('error', () => v.remove());   // 檔案不存在就保留原本圖片
  card.querySelector('.card-img').prepend(v);
});

/* 展示頁 */
const modal = document.getElementById('modal');
const modalScroll = document.getElementById('modal-scroll');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTools = document.getElementById('modal-tools');
const modalLinks = document.getElementById('modal-links');
const modalGallery = document.getElementById('modal-gallery');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');
let lastFocus = null;

function buildItem(m) {
  const fig = document.createElement('figure');
  fig.className = 'g-item' + (m.wide ? ' wide' : '');
  const box = document.createElement('div');
  box.className = 'g-media';

  if (m.type === 'video') {
    const v = makeVideo(m.src);
    v.preload = 'auto';
    v.addEventListener('error', () => { v.remove(); box.appendChild(missingBox(m.src)); });
    box.appendChild(v);
    if (!reduceMotion) {
      const tag = document.createElement('span');
      tag.className = 'g-loop';
      tag.textContent = 'LOOP';
      box.appendChild(tag);
    }
  } else if (m.type === 'image') {
    const img = document.createElement('img');
    img.src = m.src;
    img.alt = m.caption || '';
    img.loading = 'lazy';
    img.addEventListener('error', () => { img.remove(); box.appendChild(missingBox(m.src)); });
    box.appendChild(img);
  } else if (m.type === 'youtube') {
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + m.id + '?loop=1&playlist=' + m.id + '&rel=0&playsinline=1';
    f.title = m.caption || 'YouTube 影片';
    f.loading = 'lazy';
    f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    box.appendChild(f);
  }

  fig.appendChild(box);
  if (m.caption) {
    const cap = document.createElement('figcaption');
    cap.textContent = m.caption;
    fig.appendChild(cap);
  }
  return fig;
}

function openModal(card) {
  const items = PROJECTS[card.dataset.id] || [];
  lastFocus = document.activeElement;

  modalTitle.textContent = card.dataset.title;
  modalDesc.textContent = card.dataset.desc;
  modalTools.textContent = (card.querySelector('.card-tools')?.textContent || '').trim();

  // 連結沿用卡片上的按鈕
  modalLinks.innerHTML = '';
  card.querySelectorAll('.card-actions > *').forEach(el => {
    const href = el.getAttribute('href') || '';
    const isYoutubeLink = /(?:youtube\.com|youtu\.be)/i.test(href);
    const hasYoutubeEmbed = items.some(item => item.type === 'youtube');
    if (isYoutubeLink && hasYoutubeEmbed) return;
    if (el.classList.contains('card-btn-disabled')) return;
    modalLinks.appendChild(el.cloneNode(true));
  });

  modalGallery.innerHTML = '';
  modalScroll.querySelector('.modal-empty')?.remove();
  if (items.length) {
    items.forEach(m => modalGallery.appendChild(buildItem(m)));
  }

  modalScroll.scrollTop = 0;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  if (!modal.classList.contains('active')) return;
  modal.classList.remove('active');
  modalGallery.innerHTML = '';     // 清空：影片與 iframe 一併停止
  document.body.style.overflow = '';
  lastFocus?.focus?.();
}

document.querySelectorAll('.card[data-title]').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return;   // 點卡片上的連結就直接開連結
    openModal(card);
  });
});

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

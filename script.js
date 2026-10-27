(function () {
  var PIECES = [
    { src: 'img/01.webp', title: 'Spring Smile', date: '2025-11-06', tags: ['ink'], alt: 'Smiling character with short tousled hair and a hoop earring, framed by small flowers', note: 'Hoop earring, clover flowers and a hand-ruled frame.' },
    { src: 'img/02.webp', title: 'Curls and Glasses', date: '', tags: ['ink'], alt: 'Character with long curly hair and rectangular glasses wearing a hoodie', note: 'Curly hair built from thick and thin brush strokes.' },
    { src: 'img/03.webp', title: 'Cuffs and Scissors', date: '2025-03-11', tags: ['ink'], alt: 'Character with sharp eyes, dark lips and layered ear cuffs, with a tiny scissors necklace', note: 'Ear cuffs, a tiny scissors necklace and big areas of solid black.' },
    { src: 'img/04.webp', title: 'Dance with Flames', date: '2024-10-31', tags: ['ink'], alt: 'Grinning character with wild long hair beside a vertical line of Japanese text', note: 'The caption reads 炎と踊る準備はできてるか: are you ready to dance with the flames?' },
    { src: 'img/05.webp', title: 'Beast Sketch', date: '', tags: ['sketch'], alt: 'Line sketch of a bearded character with round ears and raised arms', note: 'A loose line sketch with no tone yet.' },
    { src: 'img/06.webp', title: 'Mirror Check', date: '2025-02-22', tags: ['ink'], alt: 'Character with round glasses and a moustache holding up a phone, bracelets on the wrist', note: 'Flat grey tone on the shirt, bracelets on the phone hand.' },
    { src: 'img/07.webp', title: 'Storm Study', date: '2025-02-22', tags: ['ink'], alt: 'Character with voluminous wavy hair glaring over a high collar', note: 'Big swirling hair shapes with grey tone tucked into the curls.' },
    { src: 'img/08.webp', title: 'Fresh Fade', date: '', tags: ['colour'], alt: 'Profile of a character with an undercut fade and a hoop earring in front of big red lettering', note: 'A colour study with a hard black-to-brown fade.' },
    { src: 'img/09.webp', title: 'Stitched Up', date: '2024-11-05', tags: ['ink'], alt: 'Character with stitched scars across mouth and neck and ink splatter along the bottom', note: 'Stitches, grey tone and ink spatter along the bottom edge.' },
    { src: 'img/10.webp', title: 'Diner Horns', date: '', tags: ['colour'], alt: 'Purple-haired character with horns and pointed ears in a brown jacket, in a checkered diner', note: 'A colour piece set on a posterized diner photo.' },
    { src: 'img/11.webp', title: 'Okra Break', date: '', tags: ['colour'], alt: 'Character with a green okra pod hanging from the mouth and another okra in a speech frame', note: 'One green spot colour on black and white linework.' }
  ];
  var MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function utc(iso) { var a = iso.split('-').map(Number); return Date.UTC(a[0], a[1] - 1, a[2]); }
  function fmt(iso) { var a = iso.split('-').map(Number); return a[2] + ' ' + MON[a[1] - 1] + ' ' + a[0]; }
  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ---------- hero meta ---------- */
  var dates = PIECES.filter(function (p) { return p.date; }).map(function (p) { return p.date; }).sort();
  $('#meta-count').textContent = PIECES.length + ' sheets';
  (function () {
    var f = dates[0].split('-').map(Number), l = dates[dates.length - 1].split('-').map(Number);
    $('#meta-range').textContent = MON[f[1] - 1] + ' ' + f[0] + ' to ' + MON[l[1] - 1] + ' ' + l[0];
  })();

  /* ---------- theme + pen toggles ---------- */
  var root = document.documentElement;
  $('#theme').addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });
  var penOn = true;
  var penBtn = $('#pen');
  penBtn.addEventListener('click', function () { penOn = !penOn; penBtn.setAttribute('aria-pressed', String(penOn)); });
  if (reduce) { penOn = false; penBtn.setAttribute('aria-pressed', 'false'); penBtn.disabled = true; }

  /* ---------- hero: outline flood + collage parallax ---------- */
  var outline = $('#outline');
  var h1 = $('#h1');
  h1.addEventListener('pointermove', function (e) {
    var r = outline.getBoundingClientRect();
    outline.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    outline.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
  h1.addEventListener('pointerleave', function () { outline.style.setProperty('--mx', '-999px'); });
  var hero = $('.hero');
  var sheets = [].slice.call(document.querySelectorAll('.collage .sheet'));
  if (!reduce) hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    var nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    sheets.forEach(function (s) {
      var d = +s.dataset.depth;
      s.style.setProperty('--px', (nx * d * 2).toFixed(1) + 'px');
      s.style.setProperty('--py', (ny * d * 2).toFixed(1) + 'px');
    });
  });

  /* ---------- the desk ---------- */
  var grid = $('#deskGrid');
  var cards = PIECES.map(function (p, i) {
    var el = document.createElement('figure');
    el.className = 'sheet card';
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Open ' + p.title);
    el.dataset.tags = p.tags.join(' ');
    el.dataset.i = i;
    el.innerHTML = '<div class="frame"><img src="' + p.src + '" alt="' + p.alt + '" loading="lazy" draggable="false"></div>' +
      '<figcaption><span class="t">' + p.title + '</span><span class="d">' + (p.date ? fmt(p.date) : 'undated') + '</span></figcaption>';
    el._tx = 0; el._ty = 0;
    setPos(el, 0, 0, rand(-4, 4));
    grid.appendChild(el);
    return el;
  });
  function setPos(el, tx, ty, r) {
    el._tx = tx; el._ty = ty;
    if (r !== undefined) el._r = r;
    el.style.setProperty('--tx', tx + 'px');
    el.style.setProperty('--ty', ty + 'px');
    el.style.setProperty('--r', el._r + 'deg');
  }
  var z = 10, drag = null;
  grid.addEventListener('pointerdown', function (e) {
    var card = e.target.closest('.card');
    if (!card) return;
    card._swallow = false;
    if (e.pointerType === 'touch') return;
    drag = { card: card, x: e.clientX, y: e.clientY, tx: card._tx, ty: card._ty, moved: false, id: e.pointerId };
    try { card.setPointerCapture(e.pointerId); } catch (err) {}
  });
  grid.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 5) return;
      drag.moved = true;
      drag.card.classList.add('dragging');
      drag.card.style.zIndex = ++z;
    }
    setPos(drag.card, drag.tx + dx, drag.ty + dy);
  });
  function endDrag() {
    if (!drag) return;
    drag.card.classList.remove('dragging');
    drag.card._swallow = drag.moved;
    drag = null;
  }
  grid.addEventListener('pointerup', endDrag);
  grid.addEventListener('pointercancel', endDrag);
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (!card) return;
    if (card._swallow) { card._swallow = false; return; }
    openLB(+card.dataset.i);
  });
  grid.addEventListener('keydown', function (e) {
    var card = e.target.closest('.card');
    if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openLB(+card.dataset.i); }
  });
  var filter = 'all';
  function applyFilter() {
    var n = 0;
    cards.forEach(function (c) {
      var show = filter === 'all' || c.dataset.tags.split(' ').indexOf(filter) > -1;
      c.hidden = !show;
      if (show) n++;
    });
    $('#deskCount').textContent = 'Showing ' + n + ' of ' + PIECES.length + ' sheets';
  }
  document.querySelectorAll('.chip[data-f]').forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.dataset.f;
      document.querySelectorAll('.chip[data-f]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      applyFilter();
    });
  });
  $('#shuffle').addEventListener('click', function () {
    cards.forEach(function (c) { setPos(c, rand(-16, 16), rand(-14, 14), rand(-6, 6)); });
  });
  $('#tidy').addEventListener('click', function () {
    cards.forEach(function (c) { setPos(c, 0, 0, 0); });
  });
  applyFilter();

  /* ---------- ink log ---------- */
  var dated = PIECES.map(function (p, i) { return { p: p, i: i }; })
    .filter(function (o) { return o.p.date; })
    .sort(function (a, b) { return a.p.date < b.p.date ? -1 : a.p.date > b.p.date ? 1 : a.i - b.i; });
  var D0 = Date.UTC(2024, 9, 1), D1 = Date.UTC(2025, 11, 1);
  function pct(ms) { return (ms - D0) / (D1 - D0) * 100; }
  var pos = [];
  dated.forEach(function (o, k) {
    var x = pct(utc(o.p.date));
    if (k > 0 && x - pos[k - 1] < 3.4) x = pos[k - 1] + 3.4;
    pos.push(x);
  });
  var ticksEl = $('#ticks'), marksEl = $('#marks');
  for (var m = 0; m <= 14; m++) {
    var yy = 2024 + Math.floor((9 + m) / 12), mm = (9 + m) % 12;
    var t = document.createElement('div');
    t.className = 'tick' + (mm === 0 || m === 0 ? ' year' : '') + (m % 2 ? ' alt' : '');
    t.style.left = pct(Date.UTC(yy, mm, 1)) + '%';
    if (m < 14) t.innerHTML = '<i>' + MON[mm] + ((mm === 0 || m === 0) ? ' ' + yy : '') + '</i>';
    ticksEl.appendChild(t);
  }
  var marks = pos.map(function (x) {
    var d = document.createElement('div');
    d.className = 'mark'; d.style.left = x + '%';
    marksEl.appendChild(d); return d;
  });
  var nib = $('#nib'), ruler = $('#ruler');
  var cur = -1;
  dated.forEach(function (o) { var im = new Image(); im.src = o.p.src; });
  $('#logCount').textContent = dated.length + ' dated sheets';
  ruler.setAttribute('aria-valuemax', dated.length);

  function show(k) {
    var o = dated[k], p = o.p;
    var img = $('#logImg');
    img.src = p.src; img.alt = p.alt;
    var sheet = $('#logSheet');
    sheet.classList.remove('wipe'); void sheet.offsetWidth; sheet.classList.add('wipe');
    $('#logNum').textContent = 'Sheet ' + (k + 1) + ' of ' + dated.length;
    $('#logDate').textContent = fmt(p.date);
    $('#logTitle').textContent = p.title;
    $('#logNote').textContent = p.note;
    var d = '';
    if (k === 0) d = 'First dated sheet in the log';
    else {
      var prev = dated[k - 1].p, n = Math.round((utc(p.date) - utc(prev.date)) / 86400000);
      d = n === 0 ? 'Same day as ' + prev.title : n + (n === 1 ? ' day' : ' days') + ' after ' + prev.title;
    }
    $('#logDelta').textContent = d;
    marks.forEach(function (mk, j) { mk.classList.toggle('on', j === k); });
    ruler.setAttribute('aria-valuenow', k + 1);
    ruler.setAttribute('aria-valuetext', p.title + ', ' + fmt(p.date));
  }
  function setIdx(k) { if (k === cur) return; cur = k; show(k); }
  function snap() { nib.style.left = pos[cur] + '%'; }
  function pctFrom(e) { var r = ruler.getBoundingClientRect(); return Math.min(100, Math.max(0, (e.clientX - r.left) / r.width * 100)); }
  function nearest(p) { var bi = 0, bd = 1e9; pos.forEach(function (x, i) { var d = Math.abs(x - p); if (d < bd) { bd = d; bi = i; } }); return bi; }
  var scrubbing = false, timer = null;
  function stopPlay() { if (timer) { clearInterval(timer); timer = null; $('#play').textContent = 'Play through'; } }
  function scrub(e) { var p = pctFrom(e); nib.style.left = p + '%'; setIdx(nearest(p)); }
  ruler.addEventListener('pointerdown', function (e) {
    stopPlay(); scrubbing = true; nib.classList.add('drag');
    try { ruler.setPointerCapture(e.pointerId); } catch (err) {}
    scrub(e);
  });
  ruler.addEventListener('pointermove', function (e) { if (scrubbing) scrub(e); });
  function endScrub() { if (!scrubbing) return; scrubbing = false; nib.classList.remove('drag'); snap(); }
  ruler.addEventListener('pointerup', endScrub);
  ruler.addEventListener('pointercancel', endScrub);
  ruler.addEventListener('keydown', function (e) {
    var k = cur;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') k = Math.min(dated.length - 1, cur + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') k = Math.max(0, cur - 1);
    else if (e.key === 'Home') k = 0;
    else if (e.key === 'End') k = dated.length - 1;
    else return;
    e.preventDefault(); stopPlay(); setIdx(k); snap();
  });
  $('#play').addEventListener('click', function () {
    if (timer) { stopPlay(); return; }
    $('#play').textContent = 'Stop';
    if (cur >= dated.length - 1) { setIdx(0); snap(); }
    timer = setInterval(function () {
      if (cur >= dated.length - 1) { stopPlay(); return; }
      setIdx(cur + 1); snap();
    }, 1700);
  });
  $('#logOpen').addEventListener('click', function () { openLB(dated[cur].i); });
  setIdx(0); snap();

  /* ---------- lightbox ---------- */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbIdx = 0, lastFocus = null;
  function lbShow(i) {
    lbIdx = (i + PIECES.length) % PIECES.length;
    var p = PIECES[lbIdx], isColour = p.tags.indexOf('colour') > -1;
    lbImg.src = p.src; lbImg.alt = p.alt;
    $('#lbT').textContent = p.title;
    $('#lbD').textContent = p.date ? fmt(p.date) : 'undated';
    $('#lbNote').textContent = p.note;
    var ink = $('#lbInk');
    ink.disabled = isColour;
    if (isColour) { ink.setAttribute('aria-pressed', 'false'); lbImg.classList.remove('inkonly'); }
  }
  function openLB(i) {
    lastFocus = document.activeElement;
    lb.hidden = false; document.body.style.overflow = 'hidden';
    lbShow(i); $('#lbX').focus();
  }
  function closeLB() {
    lb.hidden = true; document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('#lbX').addEventListener('click', closeLB);
  $('#lbPrev').addEventListener('click', function () { lbShow(lbIdx - 1); });
  $('#lbNext').addEventListener('click', function () { lbShow(lbIdx + 1); });
  $('#lbNeg').addEventListener('click', function (e) {
    var on = lbImg.classList.toggle('neg'); e.currentTarget.setAttribute('aria-pressed', String(on));
  });
  $('#lbInk').addEventListener('click', function (e) {
    if (e.currentTarget.disabled) return;
    var on = lbImg.classList.toggle('inkonly'); e.currentTarget.setAttribute('aria-pressed', String(on));
  });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLB();
    else if (e.key === 'ArrowLeft') lbShow(lbIdx - 1);
    else if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
  });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLB(); });

  /* ---------- copy buttons ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.dataset.copy, code = b.previousElementSibling;
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(code);
        var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      }
      function done() { var o = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = o; }, 1400); }
      try {
        navigator.clipboard.writeText(text).then(done, fallback);
      } catch (err) { fallback(); }
    });
  });

  /* ---------- the pen: fading trail + ink splatter ---------- */
  if (reduce) { $('#ink').style.display = 'none'; return; }
  var cv = $('#ink'), ctx = cv.getContext('2d');
  var W = 0, H = 0;
  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); addEventListener('resize', size);
  var segs = [], blobs = [], last = null, raf = 0;
  var LIFE = 1500, BLIFE = 2800;
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  addEventListener('pointermove', function (e) {
    if (!penOn || e.pointerType === 'touch') return;
    var t = performance.now();
    if (last && t - last.t < 140) {
      var dx = e.clientX - last.x, dy = e.clientY - last.y, dist = Math.hypot(dx, dy);
      if (dist < 1.5) return;
      var v = dist / Math.max(t - last.t, 1);
      var target = Math.max(1.3, 8 - v * 4);
      var w = last.w * 0.65 + target * 0.35;
      segs.push({ x0: last.x, y0: last.y, x1: e.clientX, y1: e.clientY, w: w, t: t });
      last = { x: e.clientX, y: e.clientY, t: t, w: w };
    } else {
      last = { x: e.clientX, y: e.clientY, t: t, w: 3 };
    }
    kick();
  });
  document.addEventListener('pointerleave', function () { last = null; });
  addEventListener('pointerdown', function (e) {
    if (!penOn) return;
    if (e.target.closest && e.target.closest('a,button,input,.card,.ruler,.lb')) return;
    var t = performance.now();
    blobs.push({ x: e.clientX, y: e.clientY, r: rand(5, 9), t: t });
    var n = Math.round(rand(6, 11));
    for (var i = 0; i < n; i++) {
      var a = rand(0, Math.PI * 2), d = rand(16, 78);
      blobs.push({ x: e.clientX + Math.cos(a) * d, y: e.clientY + Math.sin(a) * d, r: rand(1, 4.2) * (1 - d / 140), t: t + rand(0, 90) });
    }
    kick();
  });
  function loop(now) {
    raf = 0;
    ctx.clearRect(0, 0, W, H);
    var i = 0;
    while (i < segs.length && now - segs[i].t > LIFE) i++;
    if (i) segs.splice(0, i);
    ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineCap = 'round';
    segs.forEach(function (s) {
      var a = 1 - (now - s.t) / LIFE;
      ctx.globalAlpha = Math.min(1, a * 1.6);
      ctx.lineWidth = s.w * (0.35 + 0.65 * a);
      ctx.beginPath(); ctx.moveTo(s.x0, s.y0); ctx.lineTo(s.x1, s.y1); ctx.stroke();
    });
    blobs = blobs.filter(function (b) { return now - b.t < BLIFE; });
    blobs.forEach(function (b) {
      var age = now - b.t; if (age < 0) return;
      var pop = Math.min(1, age / 140);
      ctx.globalAlpha = Math.min(1, (1 - age / BLIFE) * 2.4);
      ctx.beginPath(); ctx.arc(b.x, b.y, Math.max(0.1, b.r * (0.4 + 0.6 * pop)), 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (segs.length || blobs.length) raf = requestAnimationFrame(loop);
  }
})();

/* ══════════════════════════════════════════════════════════
   SabrTime Blog — Shared JS
   Minimal, vanilla, zero dependencies. Reused across articles.
   ══════════════════════════════════════════════════════════ */

(function(){
  // Reading progress bar
  var bar = document.querySelector('.reading-progress');
  if(bar){
    var onScroll = function(){
      var doc = document.documentElement;
      var scrollTop = doc.scrollTop || document.body.scrollTop;
      var scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = pct + '%';
    };
    document.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  // Collapse TOC automatically on mobile after a link is tapped
  var toc = document.querySelector('.toc');
  if(toc){
    toc.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        if(window.innerWidth < 860){ toc.removeAttribute('open'); }
      });
    });
  }

  // Share buttons
  var waBtn = document.querySelector('[data-share="whatsapp"]');
  if(waBtn){
    waBtn.addEventListener('click', function(){
      var text = document.title + ' — ' + window.location.href;
      var enc = encodeURIComponent(text);
      var mob = /Android|iPhone|iPad/i.test(navigator.userAgent);
      window.open(mob ? 'https://api.whatsapp.com/send?text='+enc : 'https://web.whatsapp.com/send?text='+enc, '_blank');
    });
  }
  var copyBtn = document.querySelector('[data-share="copy"]');
  if(copyBtn){
    copyBtn.addEventListener('click', function(){
      navigator.clipboard.writeText(window.location.href).then(function(){
        var original = copyBtn.textContent;
        copyBtn.textContent = 'Link copied ✓';
        setTimeout(function(){ copyBtn.textContent = original; }, 1800);
      });
    });
  }
})();

/* ══════════════════════════════════════════════════════════
   SabrTime Blog — Reading Preferences Widget
   Dark mode + text size, persisted via localStorage.
   Injects itself on every page that loads this script —
   no per-post HTML changes needed.
   ══════════════════════════════════════════════════════════ */
(function () {
  if (document.getElementById('sabrReadingPrefs')) return;

  var style = document.createElement('style');
  style.textContent = `
    #sabrReadingPrefs{
      position:fixed; bottom:20px; right:16px; z-index:9999;
      display:flex; flex-direction:column; align-items:flex-end; gap:8px;
    }
    #sabrPrefsToggle{
      width:48px;height:48px;border-radius:50%;border:1.5px solid var(--line-gold,rgba(185,134,47,.28));
      background:var(--card-bg,#fffdf8); color:var(--ink,#1c1409); font-size:16px; font-weight:700;
      font-family:'Cormorant Garamond',Georgia,serif;
      box-shadow:var(--shadow-md,0 10px 30px rgba(28,20,9,.08)); cursor:pointer;
      display:flex; align-items:center; justify-content:center;
    }
    #sabrPrefsPanel{
      display:none; flex-direction:column; gap:10px; background:var(--card-bg,#fffdf8);
      border:1px solid var(--line-gold,rgba(185,134,47,.28)); border-radius:var(--radius-md,12px); padding:14px;
      box-shadow:var(--shadow-md,0 10px 30px rgba(28,20,9,.08)); min-width:170px;
    }
    #sabrPrefsPanel.open{display:flex}
    .sabr-pref-row{display:flex; align-items:center; justify-content:space-between; gap:10px; font-size:14px; color:var(--ink,#1c1409)}
    .sabr-font-btns{display:flex; gap:6px}
    .sabr-font-btns button, .sabr-dark-btn{
      border:1px solid var(--line-gold,rgba(185,134,47,.28)); background:transparent; border-radius:var(--radius-sm,8px);
      width:30px;height:30px; cursor:pointer; font-size:14px; color:var(--ink,#1c1409);
      font-family:'Cormorant Garamond',Georgia,serif;
    }
    .sabr-dark-btn.active{background:var(--gold,#b9862f); color:#fff; border-color:var(--gold,#b9862f)}

    body.sabr-dark-mode{background:#17130c !important; color:#e9dfc9 !important}
    body.sabr-dark-mode .wrap, body.sabr-dark-mode .post-card, body.sabr-dark-mode .dua-card,
    body.sabr-dark-mode .phrase-card, body.sabr-dark-mode .arabic-block,
    body.sabr-dark-mode .faq-card, body.sabr-dark-mode .cta-box,
    body.sabr-dark-mode .related-card, body.sabr-dark-mode .author-card, body.sabr-dark-mode .toc,
    body.sabr-dark-mode .site-header, body.sabr-dark-mode .site-footer,
    body.sabr-dark-mode #sabrPrefsPanel, body.sabr-dark-mode .callout,
    body.sabr-dark-mode .cat-hero{
      background:#241d12 !important; color:#e9dfc9 !important; border-color:#4a3c22 !important;
    }
    body.sabr-dark-mode h1, body.sabr-dark-mode h2, body.sabr-dark-mode h3,
    body.sabr-dark-mode .article-title, body.sabr-dark-mode strong{ color:#f3ead3 !important }
    body.sabr-dark-mode a{ color:#e0b866 !important }
    body.sabr-dark-mode .data-table td{ border-color:#4a3c22 !important }
    body.sabr-dark-mode .data-table th{ background:#33291a !important; color:#f3ead3 !important }
  `;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'sabrReadingPrefs';
  wrap.innerHTML = `
    <div id="sabrPrefsPanel" role="dialog" aria-label="Reading preferences">
      <div class="sabr-pref-row">
        <span>Text size</span>
        <div class="sabr-font-btns">
          <button id="sabrFontDown" aria-label="Decrease text size">A-</button>
          <button id="sabrFontUp" aria-label="Increase text size">A+</button>
        </div>
      </div>
      <div class="sabr-pref-row">
        <span>Dark mode</span>
        <button id="sabrDarkToggle" class="sabr-dark-btn" aria-label="Toggle dark mode">🌙</button>
      </div>
    </div>
    <button id="sabrPrefsToggle" aria-label="Reading preferences">Aa</button>
  `;
  document.body.appendChild(wrap);

  var panel = document.getElementById('sabrPrefsPanel');
  var toggleBtn = document.getElementById('sabrPrefsToggle');
  var fontUp = document.getElementById('sabrFontUp');
  var fontDown = document.getElementById('sabrFontDown');
  var darkBtn = document.getElementById('sabrDarkToggle');

  toggleBtn.addEventListener('click', function () {
    panel.classList.toggle('open');
  });

  var FONT_KEY = 'sabrFontScale';
  var currentScale = parseFloat(localStorage.getItem(FONT_KEY)) || 1;

  function applyFontScale() {
    document.documentElement.style.fontSize = (100 * currentScale) + '%';
  }
  applyFontScale();

  fontUp.addEventListener('click', function () {
    currentScale = Math.min(currentScale + 0.1, 1.4);
    localStorage.setItem(FONT_KEY, currentScale);
    applyFontScale();
  });
  fontDown.addEventListener('click', function () {
    currentScale = Math.max(currentScale - 0.1, 0.85);
    localStorage.setItem(FONT_KEY, currentScale);
    applyFontScale();
  });

  var DARK_KEY = 'sabrDarkMode';
  var isDark = localStorage.getItem(DARK_KEY) === 'true';

  function applyDarkMode() {
    document.body.classList.toggle('sabr-dark-mode', isDark);
    darkBtn.classList.toggle('active', isDark);
  }
  applyDarkMode();

  darkBtn.addEventListener('click', function () {
    isDark = !isDark;
    localStorage.setItem(DARK_KEY, isDark);
    applyDarkMode();
  });

  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) panel.classList.remove('open');
  });
})();
                                     

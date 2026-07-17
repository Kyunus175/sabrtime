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

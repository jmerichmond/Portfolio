/* Reveal-on-scroll + sticky topbar. Quiet by design.
   Uses rAF + scroll checks (robust across preview iframes) with a
   hard failsafe so content can never get stuck hidden. */
(function(){
  var bar = document.querySelector('.topbar');
  var targets = [].slice.call(document.querySelectorAll('.reveal, .rule'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showAll(){ targets.forEach(function(el){ el.classList.add('in'); }); }

  if(reduce){ showAll(); return; }

  function check(){
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for(var i=targets.length-1; i>=0; i--){
      var el = targets[i];
      var r = el.getBoundingClientRect();
      if(r.top < vh * 0.92 && r.bottom > 0){
        el.classList.add('in');
        targets.splice(i,1);
      }
    }
  }
  function onScroll(){
    if(bar){ bar.classList.toggle('solid', window.scrollY > 24); }
    check();
    spy();
  }

  // ── scroll-spy: underline the nav link for the section in view ──
  // Maps each tracked section to its nav anchor; Stack falls under Log.
  var spyMap = [
    { sel:'#work', link:'work' },
    { sel:'#log',  link:'log'  },
    { sel:'#stack',link:'log'  }
  ];
  var navLinks = {};
  [].forEach.call(document.querySelectorAll('.topbar nav a'), function(a){
    var href = a.getAttribute('href') || '';
    var m = href.match(/#(\w+)/);
    if(m) navLinks[m[1]] = a;
  });
  function spy(){
    if(!Object.keys(navLinks).length) return;
    var line = (window.innerHeight || 0) * 0.34;
    var current = null;
    spyMap.forEach(function(s){
      var el = document.querySelector(s.sel);
      if(!el) return;
      var r = el.getBoundingClientRect();
      if(r.top <= line && r.bottom > line) current = s.link;
    });
    for(var k in navLinks){ navLinks[k].classList.toggle('active', k === current); }
  }

  // initial paint
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ check(); spy(); }); });
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', check, { passive:true });
  window.addEventListener('load', check);

  // failsafe: never leave anything hidden
  setTimeout(showAll, 2500);
})();

/* ============================================================
   Project motifs — quiet, abstract data-viz drawn in palette
   accents. No fake numbers; each just *reads* like the work.
   Injected into any [data-motif] container. Palette-aware via
   CSS custom properties (helper classes in career.css).
   ============================================================ */
(function(){
  var NS = 'viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"';

  // 1 — Churn: a risk-ranked list with a decision threshold
  function churn(){
    var rows = [248,214,182,150,120,92,66];
    var bars = '';
    rows.forEach(function(w,i){
      var y = 30 + i*22;
      var flagged = i < 2;
      bars += '<rect x="34" y="'+y+'" width="252" height="8" rx="4" class="f-faint" opacity=".18"/>';
      bars += '<rect x="34" y="'+y+'" width="'+w+'" height="8" rx="4" class="'+(flagged?'f-year':'f-date')+'" opacity="'+(flagged?'1':'.5')+'"/>';
      if(flagged) bars += '<circle cx="'+(34+w)+'" cy="'+(y+4)+'" r="4.5" class="f-year"/>';
    });
    return '<svg class="motif" '+NS+'>'+bars+
      '<line x1="200" y1="18" x2="200" y2="190" class="s-faint" stroke-width="1.5" stroke-dasharray="3 5"/>'+
    '</svg>';
  }

  // 2 — Forecast: history line resolving into an uncertainty fan
  function forecast(){
    return '<svg class="motif" '+NS+'>'+
      '<line x1="24" y1="172" x2="300" y2="172" class="s-faint" stroke-width="1.5"/>'+
      '<line x1="168" y1="24" x2="168" y2="184" class="s-faint" stroke-width="1.5" stroke-dasharray="3 5"/>'+
      '<path d="M168 96 L300 44 L300 148 Z" class="f-date" opacity=".16"/>'+
      '<polyline points="24,150 58,138 92,150 126,118 168,96" class="s-ink" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<line x1="168" y1="96" x2="300" y2="96" class="s-year" stroke-width="2.4" stroke-dasharray="2 6" stroke-linecap="round"/>'+
      '<circle cx="168" cy="96" r="4.5" class="f-year"/>'+
    '</svg>';
  }

  // 3 — Marketing mix: channel contribution with intervals (whiskers)
  function mix(){
    var data = [70,112,58,134,88];          // bar heights
    var hi = 3;                              // highlighted bar
    var g='', x0=44, step=56, w=24, base=170;
    data.forEach(function(h,i){
      var cx = x0 + i*step, top = base - h;
      g += '<rect x="'+(cx-w/2)+'" y="'+top+'" width="'+w+'" height="'+h+'" rx="2" class="'+(i===hi?'f-year':'f-date')+'" opacity="'+(i===hi?'1':'.7')+'"/>';
      // whisker
      g += '<line x1="'+cx+'" y1="'+(top-16)+'" x2="'+cx+'" y2="'+(top+10)+'" class="s-ink" stroke-width="1.6"/>';
      g += '<line x1="'+(cx-6)+'" y1="'+(top-16)+'" x2="'+(cx+6)+'" y2="'+(top-16)+'" class="s-ink" stroke-width="1.6"/>';
      g += '<line x1="'+(cx-6)+'" y1="'+(top+10)+'" x2="'+(cx+6)+'" y2="'+(top+10)+'" class="s-ink" stroke-width="1.6"/>';
    });
    return '<svg class="motif" '+NS+'>'+
      '<line x1="24" y1="170" x2="300" y2="170" class="s-faint" stroke-width="1.5"/>'+g+
    '</svg>';
  }

  // 4 — Metrics layer: a small lineage graph (DAG)
  function lineage(){
    var edges = [
      [70,100,160,52],[70,100,160,100],[70,100,160,148],
      [160,52,256,76],[160,100,256,76],[160,100,256,128],[160,148,256,128]
    ];
    var e='';
    edges.forEach(function(p){ e += '<line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+p[2]+'" y2="'+p[3]+'" class="s-faint" stroke-width="1.6"/>'; });
    var nodes = [[70,100,'y'],[160,52,'d'],[160,100,'d'],[160,148,'d'],[256,76,'d'],[256,128,'y']];
    var n='';
    nodes.forEach(function(p){ n += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="8" class="'+(p[2]==='y'?'f-year':'f-date')+'"/>'; });
    return '<svg class="motif" '+NS+'>'+e+n+'</svg>';
  }

  // 5 — Monday digest: a one-page report with a sparkline + one figure
  function digest(){
    return '<svg class="motif" '+NS+'>'+
      '<rect x="64" y="26" width="192" height="148" rx="4" class="s-faint" stroke-width="1.6"/>'+
      '<rect x="64" y="26" width="192" height="28" rx="4" class="f-year" opacity=".14"/>'+
      '<line x1="78" y1="40" x2="150" y2="40" class="s-year" stroke-width="2.4" stroke-linecap="round"/>'+
      '<polyline points="80,104 100,92 118,100 136,78 156,86 176,68 196,76" class="s-date" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<circle cx="196" cy="76" r="4" class="f-year"/>'+
      '<line x1="80" y1="130" x2="240" y2="130" class="s-faint" stroke-width="2" stroke-linecap="round" opacity=".5"/>'+
      '<line x1="80" y1="144" x2="240" y2="144" class="s-faint" stroke-width="2" stroke-linecap="round" opacity=".5"/>'+
      '<line x1="80" y1="158" x2="188" y2="158" class="s-faint" stroke-width="2" stroke-linecap="round" opacity=".5"/>'+
    '</svg>';
  }

  // 6 — Pricing harness: two posterior curves (A/B) with a decision line
  function experiment(){
    function bell(cx,w,h,base){
      return 'M'+(cx-w)+' '+base+' C '+(cx-w*0.5)+' '+base+' '+(cx-w*0.42)+' '+(base-h)+' '+cx+' '+(base-h)+
             ' C '+(cx+w*0.42)+' '+(base-h)+' '+(cx+w*0.5)+' '+base+' '+(cx+w)+' '+base+' Z';
    }
    var base=158;
    return '<svg class="motif" '+NS+'>'+
      '<line x1="24" y1="158" x2="300" y2="158" class="s-faint" stroke-width="1.5"/>'+
      '<path d="'+bell(126,64,86,base)+'" class="f-date s-date" stroke-width="2.4" fill-opacity=".14"/>'+
      '<path d="'+bell(196,60,108,base)+'" class="f-year s-year" stroke-width="2.4" fill-opacity=".16"/>'+
      '<line x1="161" y1="28" x2="161" y2="172" class="s-faint" stroke-width="1.5" stroke-dasharray="3 5"/>'+
    '</svg>';
  }

  var M = {
    churn: churn(), forecast: forecast(), mix: mix(),
    lineage: lineage(), digest: digest(), experiment: experiment()
  };
  window.JR_MOTIFS = M;

  function inject(){
    document.querySelectorAll('[data-motif]').forEach(function(el){
      if(el.querySelector('.motif')) return;
      var key = el.getAttribute('data-motif');
      if(M[key]) el.insertAdjacentHTML('afterbegin', M[key]);
    });
  }
  if(document.readyState !== 'loading') inject();
  else document.addEventListener('DOMContentLoaded', inject);
})();

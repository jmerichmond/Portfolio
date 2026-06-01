/* Jamie Richmond — theme tweaks.
   Palette + textured background + year/date accent swap.
   Selections mirror to localStorage so every page (read by the inline
   head loader) stays in sync as you navigate. */

const { useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio } = window;

const JR_PALETTES = [
  { id:'white-velvet',        name:'White Velvet', paper:'#E8E4D3', ink:'#232F32', year:'#A84D2C', date:'#5B757C' },
  { id:'radiohead',           name:'Radiohead',    paper:'#E3E1D4', ink:'#2B3434', year:'#7A7440', date:'#5E7375' },
  { id:'mr-morale',           name:'Mr Morale',    paper:'#E4DACE', ink:'#2C221F', year:'#915C3F', date:'#8A6F63' },
  { id:'colour-in-anything',  name:'Colour In Anything', paper:'#ECEFF4', ink:'#2E3F55', year:'#4A6383', date:'#8296AE' },
  { id:'gnx',                 name:'GNX',          paper:'#F1F1F1', ink:'#232629', year:'#42474C', date:'#838D96' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "white-velvet",
  "background": "solid",
  "tagStyle": "outline",
  "swapAccents": false
}/*EDITMODE-END*/;

const BG_OPTS = ['Solid','Grain','Watercolour'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function readStored(){
  let palette='white-velvet', background='solid', tagStyle='outline', swapAccents=false;
  try{
    palette = localStorage.getItem('jr-theme') || palette;
    const b = localStorage.getItem('jr-bg');
    if (b === 'grain' || b === 'watercolour') background = b;
    else if (b === 'textured') background = 'grain'; // migrate legacy value
    const tg = localStorage.getItem('jr-tags');
    if (tg === 'solid' || tg === 'outline') tagStyle = tg;
    swapAccents = localStorage.getItem('jr-swap') === '1';
  }catch(e){}
  return { palette, background, tagStyle, swapAccents };
}

function applyTheme(t){
  const d = document.documentElement;
  d.dataset.theme = t.palette;
  d.dataset.bg = t.background;
  d.dataset.tags = t.tagStyle;
  if (t.swapAccents) d.dataset.swap = '1'; else d.removeAttribute('data-swap');
  try {
    localStorage.setItem('jr-theme', t.palette);
    localStorage.setItem('jr-bg', t.background);
    localStorage.setItem('jr-tags', t.tagStyle);
    localStorage.setItem('jr-swap', t.swapAccents ? '1' : '0');
  } catch(e){}
  if (typeof window.__jrFavicon === 'function') window.__jrFavicon(t.palette, t.swapAccents);
}

function PalettePicker({ value, onChange }){
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'7px', padding:'2px 0 4px' }}>
      {JR_PALETTES.map(p => {
        const on = p.id === value;
        return (
          <button key={p.id} type="button" onClick={() => onChange(p.id)}
            style={{
              display:'flex', alignItems:'center', gap:'11px', width:'100%',
              padding:'8px 10px', cursor:'pointer', textAlign:'left',
              border:'1px solid '+(on ? 'rgba(0,0,0,.55)' : 'rgba(0,0,0,.14)'),
              borderRadius:'7px',
              background: on ? 'rgba(0,0,0,.04)' : 'transparent',
              transition:'border-color .15s, background .15s'
            }}>
            <span style={{ display:'flex', borderRadius:'5px', overflow:'hidden',
              boxShadow:'0 0 0 1px rgba(0,0,0,.12)', flex:'0 0 auto' }}>
              <span style={{ width:'22px', height:'22px', background:p.paper }}></span>
              <span style={{ width:'11px', height:'22px', background:p.year }}></span>
              <span style={{ width:'11px', height:'22px', background:p.date }}></span>
              <span style={{ width:'11px', height:'22px', background:p.ink }}></span>
            </span>
            <span style={{ flex:1, fontSize:'12.5px', fontWeight: on ? 600 : 500,
              letterSpacing:'.01em', color:'#1a1a1a' }}>{p.name}</span>
            <span style={{ width:'8px', height:'8px', borderRadius:'50%',
              background: on ? '#1a1a1a' : 'transparent',
              boxShadow: on ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,.2)' }}></span>
          </button>
        );
      })}
    </div>
  );
}

function App(){
  const [t, setTweak] = useTweaks({ ...TWEAK_DEFAULTS, ...readStored() });
  React.useEffect(() => { applyTheme(t); }, [t.palette, t.background, t.tagStyle, t.swapAccents]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Colour scheme" />
      <PalettePicker value={t.palette} onChange={(v) => setTweak('palette', v)} />
      <TweakSection label="Background" />
      <TweakRadio label="Surface" value={cap(t.background)}
        options={BG_OPTS}
        onChange={(v) => setTweak('background', v.toLowerCase())} />
      <TweakSection label="Stack tags" />
      <TweakRadio label="Style" value={cap(t.tagStyle)}
        options={['Outline','Solid']}
        onChange={(v) => setTweak('tagStyle', v.toLowerCase())} />
      <TweakSection label="Career log" />
      <TweakToggle label="Swap year / date colours" value={t.swapAccents}
        onChange={(v) => setTweak('swapAccents', v)} />
    </TweaksPanel>
  );
}

(function mount(){
  const el = document.getElementById('tweaks-root');
  if (!el) return;
  ReactDOM.createRoot(el).render(<App />);
})();

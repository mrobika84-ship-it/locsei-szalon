const b=document.querySelector('#menu'),n=document.querySelector('nav');
if(b&&n){
  b.addEventListener('click',()=>n.classList.toggle('open'));
  document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')));
}

const lightboxItems=[...document.querySelectorAll('[data-lightbox]')];
let lightboxIndex=0;
let touchStartX=0;

function ensureLightbox(){
  let l=document.querySelector('.lightbox');
  if(!l){
    l=document.createElement('div');
    l.className='lightbox';
    l.innerHTML='<button class="lightbox-close" aria-label="Bezárás">×</button><button class="lightbox-prev" aria-label="Előző kép">‹</button><img alt=""><button class="lightbox-next" aria-label="Következő kép">›</button>';
    document.body.appendChild(l);
    l.addEventListener('click',e=>{if(e.target===l) closeLightbox();});
    l.querySelector('.lightbox-close').addEventListener('click',closeLightbox);
    l.querySelector('.lightbox-prev').addEventListener('click',e=>{e.stopPropagation();showLightbox(lightboxIndex-1);});
    l.querySelector('.lightbox-next').addEventListener('click',e=>{e.stopPropagation();showLightbox(lightboxIndex+1);});
    l.querySelector('img').addEventListener('click',e=>e.stopPropagation());
    l.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].screenX;},{passive:true});
    l.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].screenX-touchStartX;
      if(Math.abs(dx)>45) showLightbox(lightboxIndex+(dx<0?1:-1));
    },{passive:true});
  }
  return l;
}
function showLightbox(i){
  if(!lightboxItems.length)return;
  lightboxIndex=(i+lightboxItems.length)%lightboxItems.length;
  const l=ensureLightbox();
  const img=l.querySelector('img');
  img.src=lightboxItems[lightboxIndex].href;
  img.alt=lightboxItems[lightboxIndex].querySelector('img')?.alt||'';
  l.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.querySelector('.lightbox')?.classList.remove('open');
  document.body.style.overflow='';
}
lightboxItems.forEach((a,i)=>a.addEventListener('click',e=>{e.preventDefault();showLightbox(i);}));
document.addEventListener('keydown',e=>{
  if(!document.querySelector('.lightbox.open'))return;
  if(e.key==='Escape')closeLightbox();
  if(e.key==='ArrowLeft')showLightbox(lightboxIndex-1);
  if(e.key==='ArrowRight')showLightbox(lightboxIndex+1);
});

(function(){
var btn=document.querySelector('.menu'),ul=document.getElementById('navlist');
if(btn&&ul)btn.addEventListener('click',function(){var o=ul.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
document.querySelectorAll('.subtoggle').forEach(function(b){b.addEventListener('click',function(){var li=b.parentNode,o=li.classList.toggle('open');b.setAttribute('aria-expanded',o)})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')document.querySelectorAll('.has-sub.open').forEach(function(l){l.classList.remove('open')})});
var res=document.getElementById('results');if(!res)return;
var qs=new URLSearchParams(location.search),el={},PAGE=24,limit=PAGE;
['q','cond','type','brand','sort','avail'].forEach(function(i){el[i]=document.getElementById(i)});
var form=document.getElementById('filters'),tog=document.getElementById('ftoggle'),more=document.getElementById('more');
tog.addEventListener('click',function(){var o=form.classList.toggle('open');tog.setAttribute('aria-expanded',o)});
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
fetch('/shop/data.json').then(function(r){return r.json()}).then(function(data){
 function opts(sel,key){var v=Array.from(new Set(data.map(function(d){return d[key]}))).filter(Boolean).sort();v.forEach(function(x){var o=document.createElement('option');o.textContent=x;sel.appendChild(o)})}
 opts(el.type,'ty');opts(el.brand,'v');
 ['q','cond','type','brand','sort'].forEach(function(k){if(qs.get(k))el[k].value=qs.get(k)});
 if(qs.get('avail')==='0')el.avail.checked=false;
 var heads={Used:['Used & Vintage','Pre-owned and vintage instruments, each one described by a player.'],New:['New & Modern','New and current model instruments.'],Accessory:['Accessories','Reeds, mouthpieces, cases and stands.']};
 var h=heads[qs.get('cond')];if(h){document.getElementById('shophead').textContent=h[0];document.getElementById('shopsub').textContent=h[1];document.title=h[0]+' | USA Horn, Inc.';}
 document.querySelectorAll('header nav a').forEach(function(a){if(qs.get('cond')&&a.getAttribute('href')==='/shop/?cond='+qs.get('cond')){a.setAttribute('aria-current','page')}});
 function card(d){
  var img=d.im?'<img src="'+esc(d.im)+'" alt="'+esc(d.t)+'" loading="lazy">':'<div class="noimg">Photos coming soon</div>';
  var pr=d.p>0?'<p class="pr">'+esc(d.pt)+'</p>':'<p class="pr call">Call for price</p>';
  return '<a class="card" href="/products/'+esc(d.h)+'/"><div class="ph">'+img+(d.a?'':'<span class="tag sold">Sold</span>')+'</div><div class="ct"><h3>'+esc(d.t)+'</h3>'+(d.d?'<p class="dt">'+esc(d.d)+'</p>':'')+pr+'</div></a>';
 }
 function render(reset){
  if(reset)limit=PAGE;
  var q=el.q.value.toLowerCase().trim(),out=data.filter(function(d){
   return (!q||(d.t+' '+d.v+' '+d.d).toLowerCase().indexOf(q)>-1)&&(!el.cond.value||d.c===el.cond.value)&&(!el.type.value||d.ty===el.type.value)&&(!el.brand.value||d.v===el.brand.value)&&(!el.avail.checked||d.a)});
  var s=el.sort.value;
  if(s==='lo')out.sort(function(a,b){return (a.p>0?a.p:1e9)-(b.p>0?b.p:1e9)});
  else if(s==='hi')out.sort(function(a,b){return b.p-a.p});
  else if(s==='az')out.sort(function(a,b){return a.t.localeCompare(b.t)});
  else out.sort(function(a,b){return (a.im?0:1)-(b.im?0:1)});
  var shown=out.slice(0,limit),n=0;
  ['cond','type','brand'].forEach(function(k){if(el[k].value)n++});if(s!=='new')n++;if(!el.avail.checked)n++;
  tog.textContent='Filters'+(n?' ('+n+')':'');
  document.getElementById('count').textContent=out.length+' item'+(out.length===1?'':'s');
  res.innerHTML=shown.map(card).join('');
  document.getElementById('shown').textContent=out.length>shown.length?'Showing '+shown.length+' of '+out.length:'';
  more.hidden=out.length<=shown.length;
 }
 more.addEventListener('click',function(){limit+=PAGE;render(false)});
 ['q','cond','type','brand','sort','avail'].forEach(function(k){el[k].addEventListener('input',function(){render(true)})});
 render(true);
});
})();
(function(){
var box=document.querySelector('.slides');if(!box)return;
var slides=[].slice.call(box.querySelectorAll('.slide')),ctl=box.querySelector('.slidectl');
if(slides.length<2||!ctl)return;
ctl.hidden=false;
var i=0,timer=null,paused=false,reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var pb=ctl.querySelector('.spause');
function show(n){slides[i].classList.remove('is-active');i=(n+slides.length)%slides.length;slides[i].classList.add('is-active','seen');load(slides[i]);
slides.forEach(function(s,k){s.setAttribute('aria-hidden',k===i?'false':'true')});
}
function load(s){var im=s.querySelector('img[data-src]');if(im){im.src=im.getAttribute('data-src');im.removeAttribute('data-src')}}
window.addEventListener('load',function(){setTimeout(function(){slides.forEach(load);slides.forEach(function(s){if(s.classList.contains('wide'))s.classList.add('seen')})},1200)});
slides[0].classList.add('seen');
function stop(){if(timer){clearInterval(timer);timer=null}}
function start(){stop();if(!paused&&!reduce)timer=setInterval(function(){show(i+1)},5000)}
ctl.querySelector('.sprev').addEventListener('click',function(){show(i-1);start()});
ctl.querySelector('.snext').addEventListener('click',function(){show(i+1);start()});
function setPaused(p){paused=p;pb.textContent=p?'Play':'Pause';pb.setAttribute('aria-label',p?'Play slideshow':'Pause slideshow');if(p)stop();else start()}
pb.addEventListener('click',function(){setPaused(!paused)});
box.addEventListener('mouseenter',stop);box.addEventListener('mouseleave',start);
box.addEventListener('focusin',stop);box.addEventListener('focusout',start);
document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else start()});
slides.forEach(function(s,k){s.setAttribute('aria-hidden',k===0?'false':'true')});
if(reduce){paused=true;pb.textContent='Play';pb.setAttribute('aria-label','Play slideshow')}
start();
})();

(function(){
var main=document.getElementById('mainimg');if(!main)return;
var stage=main.parentNode,links=[].slice.call(document.querySelectorAll('.thumbs a'));
var urls=links.length?links.map(function(a){return a.getAttribute('href')}):[main.getAttribute('src')];
var title=main.getAttribute('alt')||'Photo',n=urls.length,i=0,box=null;
function el(tag,cls,txt,attrs){var e=document.createElement(tag);if(cls)e.className=cls;if(txt)e.textContent=txt;for(var k in(attrs||{}))e.setAttribute(k,attrs[k]);return e}
var count=el('div','gcount','',{'aria-live':'polite'});
var zoom=el('button','gzoom','Enlarge',{type:'button','aria-label':'Enlarge photo'});
stage.appendChild(zoom);
stage.classList.add('hasjs');stage.setAttribute('tabindex','0');stage.setAttribute('aria-label','Photo gallery. Use left and right arrow keys to change photos.');
var prev,next;
if(n>1){prev=el('button','gbtn gprev','\u2039',{type:'button','aria-label':'Previous photo'});next=el('button','gbtn gnext','\u203A',{type:'button','aria-label':'Next photo'});stage.appendChild(prev);stage.appendChild(next);stage.appendChild(count)}
function label(){return title+' photo '+(i+1)+' of '+n}
function show(k){i=(k+n)%n;main.src=urls[i];main.alt=n>1?label():title;count.textContent=(i+1)+' of '+n;
links.forEach(function(a,x){a.classList.toggle('on',x===i);if(x===i)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
if(n>1){(new Image()).src=urls[(i+1)%n];(new Image()).src=urls[(i+n-1)%n]}
if(box){box.img.src=urls[i];box.img.alt=main.alt;box.count.textContent=n>1?(i+1)+' of '+n:''}}
links.forEach(function(a,x){a.addEventListener('click',function(e){e.preventDefault();show(x)})});
if(prev){prev.addEventListener('click',function(){show(i-1)});next.addEventListener('click',function(){show(i+1)})}
function swipe(target,cb){var sx=0,sy=0,t=false;
target.addEventListener('touchstart',function(e){if(e.touches.length!==1){t=false;return}t=true;sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
target.addEventListener('touchend',function(e){if(!t)return;t=false;var c=e.changedTouches[0],dx=c.clientX-sx,dy=c.clientY-sy;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.5)cb(dx<0?1:-1)},{passive:true})}
if(n>1)swipe(stage,function(d){show(i+d)});
stage.addEventListener('keydown',function(e){if(n>1&&e.key==='ArrowLeft'){show(i-1);e.preventDefault()}else if(n>1&&e.key==='ArrowRight'){show(i+1);e.preventDefault()}});
var opener=null;
function open(){if(box)return;opener=document.activeElement;
var wrap=el('div','lightbox',null,{role:'dialog','aria-modal':'true','aria-label':'Enlarged photo'});
var img=el('img','lbimg',null,{alt:main.alt});img.src=urls[i];
var close=el('button','lbclose','Close',{type:'button','aria-label':'Close enlarged photo'});
var c=el('div','gcount lbcount',n>1?(i+1)+' of '+n:'');
wrap.appendChild(img);wrap.appendChild(close);wrap.appendChild(c);
var lp,ln;if(n>1){lp=el('button','gbtn gprev','\u2039',{type:'button','aria-label':'Previous photo'});ln=el('button','gbtn gnext','\u203A',{type:'button','aria-label':'Next photo'});wrap.appendChild(lp);wrap.appendChild(ln);lp.addEventListener('click',function(e){e.stopPropagation();show(i-1)});ln.addEventListener('click',function(e){e.stopPropagation();show(i+1)});swipe(wrap,function(d){show(i+d)})}
function shut(){document.removeEventListener('keydown',onkey);document.body.classList.remove('lbopen');wrap.parentNode&&wrap.parentNode.removeChild(wrap);box=null;if(opener&&opener.focus)opener.focus()}
function onkey(e){if(e.key==='Escape'){shut()}else if(n>1&&e.key==='ArrowLeft'){show(i-1)}else if(n>1&&e.key==='ArrowRight'){show(i+1)}else if(e.key==='Tab'){var f=[].slice.call(wrap.querySelectorAll('button'));var k=f.indexOf(document.activeElement);if(e.shiftKey&&k<=0){f[f.length-1].focus();e.preventDefault()}else if(!e.shiftKey&&k===f.length-1){f[0].focus();e.preventDefault()}}}
close.addEventListener('click',shut);wrap.addEventListener('click',function(e){if(e.target===wrap||e.target===img)shut()});
document.addEventListener('keydown',onkey);document.body.classList.add('lbopen');document.body.appendChild(wrap);close.focus();
box={img:img,count:c}}
zoom.addEventListener('click',open);main.addEventListener('click',open);
show(0);
})();

(function(){
var g=document.getElementById('featured');if(!g)return;
var cards=[].slice.call(g.children),pin=parseInt(g.getAttribute('data-pinned'),10)||0,SHOW=8;
if(cards.length<=SHOW)return;
var rest=cards.slice(pin);
for(var k=rest.length-1;k>0;k--){var r=Math.floor(Math.random()*(k+1)),t=rest[k];rest[k]=rest[r];rest[r]=t}
var order=cards.slice(0,pin).concat(rest);
order.forEach(function(c,n){if(n<SHOW)c.removeAttribute('hidden');else c.setAttribute('hidden','');g.appendChild(c)});
})();

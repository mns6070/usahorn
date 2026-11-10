(function(){
var btn=document.querySelector('.menu'),ul=document.getElementById('navlist');
if(btn&&ul)btn.addEventListener('click',function(){var o=ul.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
var main=document.getElementById('mainimg');
if(main)document.querySelectorAll('.thumbs a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();main.src=a.getAttribute('href')})});
var res=document.getElementById('results');if(!res)return;
var qs=new URLSearchParams(location.search),ids=['q','cond','type','brand','sort'],el={};
ids.concat('avail').forEach(function(i){el[i]=document.getElementById(i)});
fetch('/shop/data.json').then(function(r){return r.json()}).then(function(data){
 function opts(sel,key){var v=Array.from(new Set(data.map(function(d){return d[key]}))).filter(Boolean).sort();v.forEach(function(x){var o=document.createElement('option');o.textContent=x;sel.appendChild(o)})}
 opts(el.type,'ty');opts(el.brand,'v');
 ['q','cond','type','brand','sort'].forEach(function(k){if(qs.get(k))el[k].value=qs.get(k)});
 if(qs.get('avail')==='0')el.avail.checked=false;
 var heads={Used:['Used & Vintage','Pre-owned and vintage instruments, each one inspected and described by a player.'],New:['New & Modern','New and current model instruments.'],Accessory:['Accessories','Reeds, mouthpieces, cases and stands.']};
 var h=heads[qs.get('cond')];if(h){document.getElementById('shophead').textContent=h[0];document.getElementById('shopsub').textContent=h[1];document.title=h[0]+' | USA Horn, Inc.';}
 document.querySelectorAll('header nav a').forEach(function(a){if(a.getAttribute('href')==='/shop/?cond='+qs.get('cond')){a.setAttribute('aria-current','page')}});
 function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
 function render(){
  var q=el.q.value.toLowerCase().trim(),out=data.filter(function(d){
   return (!q||(d.t+' '+d.v).toLowerCase().indexOf(q)>-1)&&(!el.cond.value||d.c===el.cond.value)&&(!el.type.value||d.ty===el.type.value)&&(!el.brand.value||d.v===el.brand.value)&&(!el.avail.checked||d.a)});
  var s=el.sort.value;if(s==='lo')out.sort(function(a,b){return a.p-b.p});if(s==='hi')out.sort(function(a,b){return b.p-a.p});if(s==='az')out.sort(function(a,b){return a.t.localeCompare(b.t)});
  document.getElementById('count').textContent=out.length+' item'+(out.length===1?'':'s');
  res.innerHTML=out.map(function(d){return '<a class="card" href="/products/'+esc(d.h)+'/"><div class="ph">'+(d.im?'<img src="'+esc(d.im)+'" alt="'+esc(d.t)+'" loading="lazy">':'<div class="noimg">No photo</div>')+(d.a?'':'<span class="tag sold">Sold</span>')+'</div><div class="ct"><h3>'+esc(d.t)+'</h3><p class="pr">'+esc(d.pt)+'</p></div></a>'}).join('');
 }
 ['q','cond','type','brand','sort','avail'].forEach(function(k){el[k].addEventListener('input',render)});
 render();
});
})();

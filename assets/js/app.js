import{fandoms}from'./data.js';import{RuneDial}from'./dial.js';import{startParticles}from'./particles.js';
const byId=id=>document.getElementById(id);const screens={fandom:byId('fandomScreen'),character:byId('characterScreen'),card:byId('cardScreen')};let activeFandom=fandoms[0],activeCharacter=activeFandom.characters[0],characterDial;
startParticles(byId('snow'));

const welcome=byId('welcomeScene'),about=byId('aboutPanel'),shain=byId('shainPanel');
function togglePanel(panel){const open=panel.hidden;about.hidden=true;shain.hidden=true;panel.hidden=!open;welcome.classList.toggle('panel-open',open)}
byId('aboutTrigger').addEventListener('click',()=>togglePanel(about));byId('shainTrigger').addEventListener('click',()=>togglePanel(shain));welcome.addEventListener('click',event=>{if(!event.target.closest('.welcome__panel,#aboutTrigger,#shainTrigger')&&welcome.classList.contains('panel-open')){about.hidden=true;shain.hidden=true;welcome.classList.remove('panel-open')}});

function showScreen(name){Object.entries(screens).forEach(([key,screen])=>{const active=key===name;screen.hidden=!active;screen.classList.toggle('is-active',active)});const screen=screens[name];screen.classList.add('is-entering');requestAnimationFrame(()=>requestAnimationFrame(()=>screen.classList.remove('is-entering')));screen.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
function setInfo(prefix,item){byId(`${prefix}Name`).textContent=item.name;byId(`${prefix}Description`).textContent=item.description}
new RuneDial({root:byId('fandomDial'),itemsRoot:byId('fandomItems'),previous:byId('fandomPrev'),next:byId('fandomNext'),items:fandoms,onChange:item=>{activeFandom=item;setInfo('fandom',item)}});

function buildCharacterDial(){const items=activeFandom.characters;activeCharacter=items[0];byId('characterFandom').textContent=activeFandom.name;characterDial?.destroy();characterDial=new RuneDial({root:byId('characterDial'),itemsRoot:byId('characterItems'),previous:byId('characterPrev'),next:byId('characterNext'),items,onChange:item=>{activeCharacter=item;setInfo('character',item)}})}
byId('openCharacters').addEventListener('click',()=>{buildCharacterDial();showScreen('character')});byId('backToFandoms').addEventListener('click',()=>showScreen('fandom'));byId('backToCharacters').addEventListener('click',()=>showScreen('character'));

function configureDownload(id,url){const link=byId(id);if(url){link.href=url;link.removeAttribute('aria-disabled');link.removeAttribute('tabindex');link.setAttribute('download','')}else{link.removeAttribute('href');link.setAttribute('aria-disabled','true');link.setAttribute('tabindex','-1')}}
byId('openCard').addEventListener('click',()=>{byId('cardFandom').textContent=activeFandom.name;byId('cardName').textContent=activeCharacter.name;byId('cardDescription').textContent=activeCharacter.description;const portrait=byId('cardPortrait');portrait.style.backgroundImage=activeCharacter.image?`linear-gradient(0deg,rgba(3,12,18,.2),rgba(3,12,18,.05)),url("${activeCharacter.image}")`:'';byId('cardTags').replaceChildren(...activeCharacter.tags.map(tag=>{const span=document.createElement('span');span.textContent=tag;return span}));configureDownload('downloadJson',activeCharacter.json);configureDownload('downloadLorebook',activeCharacter.lorebook);showScreen('card')});

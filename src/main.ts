import './style.css';
import { commands, type CommandId } from './ir/codes';
import { isIrAvailable, sendCommand } from './ir/transmitter';
import { initialLanguage, labels, texts, type Language, type TextKey } from './i18n';

const app = document.querySelector<HTMLDivElement>('#app')!;
const github = 'https://github.com/Reign-in-blood/Idual_app';
const rows: CommandId[] = ['candle','warmWhite','daylight','coolWhite','night','sleep','work','relax','sunrise','pastelColor','party','sunset','forest','ocean','fireplace','romance'];
type Theme = 'dark' | 'light';
type Panel = 'settings' | 'about' | 'privacy';
let language: Language = initialLanguage();
let theme: Theme = localStorage.getItem('idual-theme') === 'light' ? 'light' : 'dark';
let haptic = localStorage.getItem('idual-haptic') === 'true';
let ir: boolean | null = null;
let busy = false;
let activePanel: Panel = 'settings';
const t = (key: TextKey): string => texts[language][key];
const button = (id: CommandId, classes = ''): string => {
  const label = labels[language][id];
  const code = commands.find(item => item.id === id)!;
  return '<button class="key '+classes+'" data-id="'+id+'" type="button" aria-label="'+code.label+'" title="'+code.label+'">'+label+'</button>';
};
function draw(): void {
  document.documentElement.lang = language;
  document.documentElement.dataset.theme = theme;
  app.innerHTML = '<main class="shell">' +
    '<header class="app-header"><div class="heading-block"><h1>iDual <span>Remote</span></h1>' +
    '<span class="signal '+(ir?'active':'')+'" id="signal">'+(ir===null?t('checking'):t(ir?'available':'unavailable'))+'</span></div>' +
    '<button class="settings-trigger" type="button" data-settings aria-label="'+t('settings')+'" title="'+t('settings')+'">' +
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2l1.5 2.5 2.7.6 2.3-1.1 2 2-1.1 2.3.6 2.7L22 12l-2 1.5-.6 2.7 1.1 2.3-2 2-2.3-1.1-2.7.6L12 22l-1.5-2-2.7-.6-2.3 1.1-2-2 1.1-2.3-.6-2.7L2 12l2-1.5.6-2.7-1.1-2.3 2-2 2.3 1.1 2.7-.6z"/></svg></button></header>' +
    '<section class="remote" aria-label="iDual Remote"><div class="remote-top"><div class="brand">iDual</div>' +
    '<div class="power-stack">'+button('on','power on')+button('off','power off')+'</div>' +
    '<div class="brightness-line">'+button('dimDown','brightness-button')+button('dimUp','brightness-button')+'<span class="brightness-mark" aria-hidden="true"></span></div></div>' +
    '<div class="scene-rows" aria-label="'+t('scenes')+'">'+rows.map(id=>button(id,'scene-button')).join('')+'</div>' +
    '<div class="color-section" aria-label="'+t('colors')+'"><div class="color-ring" aria-hidden="true"><div class="ring-hole"></div></div>' +
    button('red','color-key red')+button('orange','color-key orange')+button('green','color-key green')+button('blue','color-key blue')+
    '<div class="central-colors">'+button('vivid','center-color')+button('pastels','center-color')+'</div></div></section>' +
    '<footer>iDual RC II · '+t('offline')+'</footer></main>' +
    '<dialog id="settings-dialog" aria-label="'+t('settings')+'"><div class="settings-content" id="settings-content"></div></dialog>';
  const dialog = document.querySelector<HTMLDialogElement>('#settings-dialog')!;
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
}
function panelMarkup(): string {
  if(activePanel==='about')return '<div class="panel-heading"><button data-back aria-label="'+t('back')+'">←</button><h2>'+t('about')+'</h2></div><p>'+t('aboutBody')+'</p><a class="menu-link" href="'+github+'" target="_blank" rel="noopener noreferrer">'+t('source')+' ↗</a>';
  if(activePanel==='privacy')return '<div class="panel-heading"><button data-back aria-label="'+t('back')+'">←</button><h2>'+t('privacy')+'</h2></div><h3>'+t('legalHeader')+'</h3><p>'+t('legalBody')+'</p><h3>'+t('privacyHeader')+'</h3><p>'+t('privacyBody')+'</p><p class="note">'+t('external')+'</p>';
  return '<div class="panel-heading"><h2>'+t('settings')+'</h2><button data-close aria-label="'+t('close')+'">×</button></div>' +
    '<div class="option-row"><strong>'+t('appearance')+'</strong><div class="option-buttons"><button data-theme="dark" aria-pressed="'+(theme==='dark')+'">Dark</button><button data-theme="light" aria-pressed="'+(theme==='light')+'">Light</button></div></div>' +
    '<div class="option-row"><strong>'+t('language')+'</strong><div class="option-buttons"><button data-lang="fr" aria-pressed="'+(language==='fr')+'">Français</button><button data-lang="en" aria-pressed="'+(language==='en')+'">English</button><button data-lang="es" aria-pressed="'+(language==='es')+'">Español</button></div></div>' +
    '<div class="option-row haptic-row"><label for="haptic">'+t('haptics')+'</label><input id="haptic" type="checkbox" '+(haptic?'checked':'')+'></div><p class="note">'+t('hapticNote')+'</p>' +
    '<nav class="menu-links"><button data-page="about">'+t('about')+' <span>›</span></button><button data-page="privacy">'+t('privacy')+' <span>›</span></button><a href="'+github+'" target="_blank" rel="noopener noreferrer">'+t('source')+' <span>↗</span></a></nav>';
}
function showPanel(): void {
 const dialog=document.querySelector<HTMLDialogElement>('#settings-dialog')!;
 document.querySelector<HTMLElement>('#settings-content')!.innerHTML=panelMarkup();
 if(!dialog.open)dialog.showModal();
}
draw();
void isIrAvailable().then(available=>{
 ir=available;
 const indicator=document.querySelector<HTMLElement>('#signal');
 if(indicator){indicator.textContent=t(available?'available':'unavailable');indicator.classList.toggle('active',available)}
});
app.addEventListener('click', async event=>{
 const target=event.target as HTMLElement;
 if(target.closest('[data-settings]')){activePanel='settings';showPanel();return;}
 const command=target.closest<HTMLButtonElement>('button[data-id]');
 if(!command||busy)return;
 busy=true;
 command.classList.add('pressed');
 if(haptic&&typeof navigator.vibrate==='function')navigator.vibrate(12);
 try{await sendCommand(command.dataset.id as CommandId);}
 catch(error){console.warn('IR transmission failed',error);}
 finally{busy=false;setTimeout(()=>command.classList.remove('pressed'),140);}
});
app.addEventListener('click',event=>{
 const target=event.target as HTMLElement;
 const lang=target.closest<HTMLButtonElement>('[data-lang]');
 if(lang){language=lang.dataset.lang as Language;localStorage.setItem('idual-language',language);draw();activePanel='settings';showPanel();return;}
 const appearance=target.closest<HTMLButtonElement>('[data-theme]');
 if(appearance){theme=appearance.dataset.theme as Theme;localStorage.setItem('idual-theme',theme);document.documentElement.dataset.theme=theme;showPanel();return;}
 const page=target.closest<HTMLButtonElement>('[data-page]');
 if(page){activePanel=page.dataset.page as Panel;showPanel();return;}
 if(target.closest('[data-back]')){activePanel='settings';showPanel();return;}
 if(target.closest('[data-close]'))document.querySelector<HTMLDialogElement>('#settings-dialog')?.close();
});
app.addEventListener('change',event=>{
 const target=event.target;
 if(target instanceof HTMLInputElement&&target.id==='haptic'){haptic=target.checked;localStorage.setItem('idual-haptic',String(haptic));}
});

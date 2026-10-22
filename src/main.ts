import './style.css';
import { commands, type CommandId } from './ir/codes';
import { isIrAvailable, sendCommand } from './ir/transmitter';
import { initialLanguage, labels, texts, updateTexts, type Language, type TextKey, type UpdateTextKey } from './i18n';
import { appVersion, compareVersions, fetchNewestRelease, type ReleaseInfo } from './updates';

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
let autoUpdates = localStorage.getItem('idual-update-auto') !== 'false';
let ignoredUpdate = localStorage.getItem('idual-update-ignored') || '';
let latestRelease: ReleaseInfo | null = null;
let updateState: 'idle' | 'checking' | 'ready' | 'error' = 'idle';
let lastRuntimeCheck = 0;
const t = (key: TextKey): string => texts[language][key];
const u = (key: UpdateTextKey): string => updateTexts[language][key];
const updateAvailable = (): boolean => Boolean(latestRelease && compareVersions(latestRelease.version, appVersion) > 0);
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
    '<div id="update-banner-slot" aria-live="polite"></div>' +
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
  // Le dialogue est une surface interactive autonome : ses événements restent
  // attachés directement à la fenêtre modale, pas au conteneur principal.
  dialog.addEventListener('click', event => {
    const target = event.target;
    if (target === dialog) { dialog.close(); return; }
    if (!(target instanceof Element)) return;

    if (target.closest('[data-check-updates]')) {
      void checkUpdates(true);
      return;
    }
    if (target.closest('[data-close]')) {
      dialog.close();
      return;
    }
    if (target.closest('[data-back]')) {
      activePanel = 'settings';
      showPanel();
      return;
    }
    const page = target.closest<HTMLButtonElement>('button[data-page]');
    if (page) {
      activePanel = page.dataset.page as Panel;
      showPanel();
      return;
    }
    const appearance = target.closest<HTMLButtonElement>('button[data-theme]');
    if (appearance) {
      theme = appearance.dataset.theme as Theme;
      localStorage.setItem('idual-theme', theme);
      document.documentElement.dataset.theme = theme;
      showPanel();
      return;
    }
    const lang = target.closest<HTMLButtonElement>('button[data-lang]');
    if (lang) {
      language = lang.dataset.lang as Language;
      localStorage.setItem('idual-language', language);
      activePanel = 'settings';
      draw();
      showPanel();
    }
  });

  dialog.addEventListener('change', event => {
    const input = event.target;
    if (input instanceof HTMLInputElement && input.id === 'update-auto') {
      autoUpdates = input.checked;
      localStorage.setItem('idual-update-auto', String(autoUpdates));
      if (autoUpdates) void checkUpdates();
      return;
    }
    if (input instanceof HTMLInputElement && input.id === 'haptic') {
      haptic = input.checked;
      localStorage.setItem('idual-haptic', String(haptic));
    }
  });
}
function panelMarkup(): string {
  if(activePanel==='about')return '<div class="panel-heading"><button data-back aria-label="'+t('back')+'">←</button><h2>'+t('about')+'</h2></div><p>'+t('aboutBody')+'</p><a class="menu-link" href="'+github+'" target="_blank" rel="noopener noreferrer">'+t('source')+' ↗</a>';
  if(activePanel==='privacy')return '<div class="panel-heading"><button data-back aria-label="'+t('back')+'">←</button><h2>'+t('privacy')+'</h2></div><h3>'+t('legalHeader')+'</h3><p>'+t('legalBody')+'</p><h3>'+t('privacyHeader')+'</h3><p>'+t('privacyBody')+'</p><p class="note">'+t('external')+'</p>';
  return '<div class="panel-heading"><h2>'+t('settings')+'</h2><button data-close aria-label="'+t('close')+'">×</button></div>' +
    '<div class="option-row"><strong>'+t('appearance')+'</strong><div class="option-buttons"><button data-theme="dark" aria-pressed="'+(theme==='dark')+'">Dark</button><button data-theme="light" aria-pressed="'+(theme==='light')+'">Light</button></div></div>' +
    '<div class="option-row"><strong>'+t('language')+'</strong><div class="option-buttons"><button data-lang="fr" aria-pressed="'+(language==='fr')+'">Français</button><button data-lang="en" aria-pressed="'+(language==='en')+'">English</button><button data-lang="es" aria-pressed="'+(language==='es')+'">Español</button></div></div>' +
    '<div class="option-row haptic-row"><label for="haptic">'+t('haptics')+'</label><input id="haptic" type="checkbox" '+(haptic?'checked':'')+'></div><p class="note">'+t('hapticNote')+'</p>' +
    '<div class="option-row update-options"><strong>'+u('title')+'</strong>' +
    '<div class="update-toggle"><label for="update-auto">'+u('auto')+'</label><input id="update-auto" type="checkbox" '+(autoUpdates?'checked':'')+'></div>' +
    '<p class="note">'+u('help')+'</p>' +
    '<button type="button" class="check-update" data-check-updates>'+u('check')+'</button>' +
    '<p class="note" id="update-check-status" role="status"></p>' +
    '<div id="update-panel-action"></div></div>' +
    '<nav class="menu-links"><button data-page="about">'+t('about')+' <span>›</span></button><button data-page="privacy">'+t('privacy')+' <span>›</span></button><a href="'+github+'" target="_blank" rel="noopener noreferrer">'+t('source')+' <span>↗</span></a></nav>';
}
function showPanel(): void {
 const dialog=document.querySelector<HTMLDialogElement>('#settings-dialog')!;
 document.querySelector<HTMLElement>('#settings-content')!.innerHTML=panelMarkup();
 if(!dialog.open)dialog.showModal();
 renderUpdateUi();
}
function renderUpdateUi(): void {
  const release = latestRelease;
  const available = updateAvailable();
  const message = updateState === 'checking' ? u('checking')
    : updateState === 'error' ? u('error')
    : updateState === 'ready' ? available ? u('available') + ' · v' + release!.version : u('upToDate')
    : u('notChecked');

  const status = document.querySelector<HTMLElement>('#update-check-status');
  if (status) status.textContent = u('installed') + ' : v' + appVersion + ' · ' + message;
  const checkButton = document.querySelector<HTMLButtonElement>('[data-check-updates]');
  if (checkButton) checkButton.disabled = updateState === 'checking';

  const action = document.querySelector<HTMLElement>('#update-panel-action');
  if (action) action.innerHTML = available && release
    ? '<a class="update-link" target="_blank" rel="noopener noreferrer" href="' + release.url + '">' + u('download') + ' · v' + release.version + ' ↗</a>'
    : '';

  const slot = document.querySelector<HTMLElement>('#update-banner-slot');
  if (!slot) return;
  slot.innerHTML = available && release && ignoredUpdate !== release.tag
    ? '<div class="update-banner" role="status">' +
      '<div class="update-banner-title">' + u('available') + ' · v' + release.version + '</div>' +
      '<div class="update-banner-actions">' +
      '<a class="update-link" target="_blank" rel="noopener noreferrer" href="' + release.url + '">' + u('download') + ' ↗</a>' +
      '<button type="button" data-ignore-update>' + u('later') + '</button></div></div>'
    : '';
}

async function checkUpdates(manual = false): Promise<void> {
  if (updateState === 'checking' || (!manual && !autoUpdates)) return;
  const now = Date.now();
  if (!manual && now - lastRuntimeCheck < 60000) return;
  lastRuntimeCheck = now;
  updateState = 'checking';
  renderUpdateUi();
  try {
    latestRelease = await fetchNewestRelease(manual);
    updateState = 'ready';
    if (manual && updateAvailable()) {
      ignoredUpdate = '';
      localStorage.removeItem('idual-update-ignored');
    }
  } catch (error) {
    console.warn('GitHub update check failed:', error);
    updateState = 'error';
  }
  renderUpdateUi();
}

draw();
void checkUpdates();
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) void checkUpdates();
});
window.addEventListener('focus', () => { void checkUpdates(); });
void isIrAvailable().then(available=>{
 ir=available;
 const indicator=document.querySelector<HTMLElement>('#signal');
 if(indicator){indicator.textContent=t(available?'available':'unavailable');indicator.classList.toggle('active',available)}
});
app.addEventListener('click', async event=>{
 const target=event.target as HTMLElement;
 if(target.closest('[data-settings]')){activePanel='settings';showPanel();return;}
 if(target.closest('[data-ignore-update]')){
   if(latestRelease){
     ignoredUpdate = latestRelease.tag;
     localStorage.setItem('idual-update-ignored', ignoredUpdate);
     renderUpdateUi();
   }
   return;
 }
 const command=target.closest<HTMLButtonElement>('button[data-id]');
 if(!command||busy)return;
 busy=true;
 command.classList.add('pressed');
 if(haptic&&typeof navigator.vibrate==='function')navigator.vibrate(12);
 try{await sendCommand(command.dataset.id as CommandId);}
 catch(error){console.warn('IR transmission failed',error);}
 finally{busy=false;setTimeout(()=>command.classList.remove('pressed'),140);}
});

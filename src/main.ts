import './style.css';
import { commands, type CommandId } from './ir/codes';
import { isIrAvailable, sendCommand } from './ir/transmitter';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Les libellés sont provisoires : les pictogrammes fidèles seront créés ensuite.
const names: Record<CommandId, string> = {
  on: 'I', off: 'O', dimUp: '+', dimDown: '−',
  candle: 'Bougie', warmWhite: 'Chaud', daylight: 'Jour', coolWhite: 'Froid',
  night: 'Nuit', sleep: 'Sommeil', work: 'Travail', relax: 'Détente',
  sunrise: 'Aube', pastelColor: 'Pastel', party: 'Fête', sunset: 'Soleil',
  forest: 'Forêt', ocean: 'Océan', fireplace: 'Feu', romance: 'Cœur',
  red: 'Rouge', orange: 'Orange', green: 'Vert', blue: 'Bleu',
  vivid: 'Vives', pastels: 'Douces'
};

const button = (id: CommandId, classes = '') => {
  const label = commands.find(c => c.id === id)!.label;
  return `<button class="key ${classes}" data-id="${id}" type="button" aria-label="${label}" title="${label}">${names[id]}</button>`;
};

// Ordre copié sur la télécommande iDual physique : 4 colonnes sur 4 rangées.
const ambienceRows: CommandId[][] = [
  ['candle', 'warmWhite', 'daylight', 'coolWhite'],
  ['night', 'sleep', 'work', 'relax'],
  ['sunrise', 'pastelColor', 'party', 'sunset'],
  ['forest', 'ocean', 'fireplace', 'romance']
];

app.innerHTML = `
<main class="shell">
  <header class="app-header">
    <div><span class="eyebrow">JEDI LIGHTING</span><h1>iDual <span>Remote</span></h1></div>
    <span class="signal" id="signal">IR · Vérification…</span>
  </header>
  <section class="remote" aria-label="Télécommande iDual">
    <div class="remote-top">
      <div class="brand">iDual</div>
      <div class="power-stack">
        ${button('on', 'power on')}${button('off', 'power off')}
      </div>
      <div class="brightness-line">
        ${button('dimDown', 'brightness-button')}${button('dimUp', 'brightness-button')}
        <span class="brightness-mark" aria-hidden="true"></span>
      </div>
    </div>
    <div class="scene-rows" aria-label="Blancs et ambiances">
      ${ambienceRows.flat().map(id => button(id, 'scene-button')).join('')}
    </div>
    <div class="color-section" aria-label="Couleurs et palettes">
      <div class="color-ring" aria-hidden="true"><div class="ring-hole"></div></div>
      ${button('red', 'color-key red')}
      ${button('orange', 'color-key orange')}
      ${button('green', 'color-key green')}
      ${button('blue', 'color-key blue')}
      <div class="central-colors">
        ${button('vivid', 'center-color')}
        ${button('pastels', 'center-color')}
      </div>
    </div>
  </section>
  <p class="status" role="status" id="status">Application prête.</p>
  <footer>iDual RC II · 26 commandes · Hors ligne</footer>
</main>`;

const signal = document.querySelector<HTMLElement>('#signal')!;
const status = document.querySelector<HTMLElement>('#status')!;
void isIrAvailable().then(available => {
  signal.textContent = available ? 'IR · Disponible' : 'IR · Non disponible';
  signal.classList.toggle('active', available);
});

let busy = false;
app.addEventListener('click', async event => {
  const target = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-id]');
  if (!target || busy) return;
  const id = target.dataset.id as CommandId;
  busy = true;
  target.classList.add('pressed');
  try {
    await sendCommand(id);
    status.textContent = `Commande envoyée : ${names[id]}`;
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    busy = false;
    setTimeout(() => target.classList.remove('pressed'), 140);
  }
});

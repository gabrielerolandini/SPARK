// Posizioni iniziali cursori
let position = {
  cursor1: 0,
  cursor2: 0
};

function muoviCursor(id, dir) {
  if (position[id] + dir < 0 || position[id] + dir > 7) return;
  position[id] += dir;
  document.getElementById(id).style.transform = `translateX(${position[id] * 50}px)`;
}

// Dati mazzi
let mazzo = [];
let scarti = [];
let minacce = [];

// Inizializzazione carte (fronte/retro)
for (let i = 0; i <= 9; i++) {
  const num = i.toString().padStart(2, '0');
  mazzo.push({
    fronte: `carte/${num}.png`,
    retro: `carte_retro/${num}.png`,
    stato: 'fronte',
    rotazione: 0
  });
}
for (let i = 10; i <= 14; i++) {
  const num = i.toString();
  minacce.push({
    fronte: `carte/${num}.png`,
    retro: `carte_retro/${num}.png`,
    stato: 'fronte',
    rotazione: 0
  });
}

// Mischiamo all'inizio
mischiaArray(mazzo);
mischiaArray(minacce);

// Gestione Drag&Drop
function dragStartHandler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.parentElement.id);
}

function dragOverHandler(ev) {
  ev.preventDefault();
}

function dropHandler(ev) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text/plain");
  const elemento = document.getElementById(id);
  if (elemento) {
    ev.target.appendChild(elemento);
  }
}

// Pesca carta
let cartaId = 0;
function pescaCarta() {
  if (mazzo.length === 0) return;
  creaCartaInArea(document.getElementById('area-gioco'), mazzo.shift());
  aggiornaMazzi();
}

// Crea carta nell'area di gioco
function creaCartaInArea(area, cartaData) {
  const container = document.createElement('div');
  container.classList.add('carta-container');
  container.id = 'carta-' + (cartaId++);

  const carta = document.createElement('img');
  carta.src = cartaData.stato === 'fronte' ? cartaData.fronte : cartaData.retro;
  carta.classList.add('carta');
  carta.dataset.rotazione = cartaData.rotazione;
  carta.dataset.stato = cartaData.stato;
  carta.dataset.fronte = cartaData.fronte;
  carta.dataset.retro = cartaData.retro;
  carta.draggable = true;
  carta.ondragstart = dragStartHandler;
  carta.addEventListener('click', () => carta.classList.toggle('selezionata'));
  carta.style.transform = `rotate(${cartaData.rotazione}deg)`;

  const azioni = document.createElement('div');
  azioni.classList.add('azioni-carta');

  const btnRuota = document.createElement('button');
  btnRuota.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
  btnRuota.onclick = () => ruotaCarta(carta);

  const btnGira = document.createElement('button');
  btnGira.innerHTML = '<i class="fa-solid fa-retweet"></i>';
  btnGira.onclick = () => giraCarta(carta);

  const btnTuck = document.createElement('button');
  btnTuck.innerHTML = '<i class="fa-solid fa-download"></i>';
  btnTuck.onclick = () => tuckCarte(container);

  const btnScarta = document.createElement('button');
  btnScarta.innerText = '🗑️';
  btnScarta.onclick = () => scartaCarta(container);

  azioni.append(btnRuota, btnGira, btnTuck, btnScarta);

  container.appendChild(carta);
  container.appendChild(azioni);
  area.appendChild(container);
}

// Ruota carta
function ruotaCarta(carta) {
  let rot = parseInt(carta.dataset.rotazione) || 0;
  rot = (rot + 180) % 360;
  carta.dataset.rotazione = rot;
  carta.style.transform = `rotate(${rot}deg)`;
}

// Gira carta fronte/retro
function giraCarta(carta) {
  const stato = carta.dataset.stato;
  if (stato === 'fronte') {
    carta.src = carta.dataset.retro;
    carta.dataset.stato = 'retro';
  } else {
    carta.src = carta.dataset.fronte;
    carta.dataset.stato = 'fronte';
  }
  carta.style.transform = `rotate(${carta.dataset.rotazione}deg)`;
}

// Copia stato carta dal DOM
function copiaCarta(carta) {
  return {
    fronte: carta.dataset.fronte,
    retro: carta.dataset.retro,
    stato: carta.dataset.stato,
    rotazione: parseInt(carta.dataset.rotazione) || 0
  };
}

// Scarta carta e tuckate
function scartaCarta(container) {
  container.querySelectorAll('img').forEach(carta => {
    scarti.push(copiaCarta(carta));
  });
  container.remove();
  aggiornaMazzi();
}

// Tuck carte selezionate
function tuckCarte(containerTarget) {
  const selezionate = document.querySelectorAll('.selezionata');
  const tuckateEsistenti = containerTarget.querySelectorAll('.tuckata').length;
  let offset = -25 * (tuckateEsistenti + 1);
  let z = 9 - tuckateEsistenti;

  selezionate.forEach(carta => {
    const clone = carta.cloneNode(true);
    clone.classList.remove('selezionata');
    clone.classList.add('tuckata');
    clone.style.top = `${offset}px`;
    clone.style.zIndex = z;
    clone.style.position = 'absolute';
    clone.style.transform = `rotate(${carta.dataset.rotazione}deg)`;
    containerTarget.appendChild(clone);
    carta.closest('.carta-container').remove();
    offset -= 25;
    z--;
  });
}

// Mischia array
function mischiaArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Operazioni sui mazzi
function mischiaMazzo() { mischiaArray(mazzo); aggiornaMazzi(); }
function mischiaMinacce() { mischiaArray(minacce); aggiornaMazzi(); }
function ripristinaScarti() { mazzo = [...mazzo, ...scarti]; scarti = []; aggiornaMazzi(); }
function aggiungiMinaccia() { if (minacce.length) scarti.push(minacce.shift()); aggiornaMazzi(); }

// Aggiorna mazzi
function aggiornaMazzi() {
  aggiornaMazzoSingolo('mazzo-container', mazzo, 'counter-mazzo');
  aggiornaMazzoSingolo('scarti-container', scarti, 'counter-scarti');
  aggiornaMazzoSingolo('minacce-container', minacce, 'counter-minacce');
}

function aggiornaMazzoSingolo(id, array, counterId) {
  const container = document.getElementById(id);
  container.innerHTML = '';
  if (array.length > 0) {
    const carta = document.createElement('img');
    carta.src = array[0].stato === 'fronte' ? array[0].fronte : array[0].retro;
    carta.style.transform = `rotate(${array[0].rotazione}deg)`;
    container.appendChild(carta);
  }
  document.getElementById(counterId).innerText = array.length;
}

// Avvio
aggiornaMazzi();

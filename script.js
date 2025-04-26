// Posizioni iniziali dei cursori
let position = {
  cursor1: 0,
  cursor2: 0
};

// Funzione per muovere i cursori
function muoviCursor(id, dir) {
  if (position[id] + dir < 0 || position[id] + dir > 7) return;
  position[id] += dir;
  document.getElementById(id).style.transform = `translateX(${position[id] * 50}px)`;
}

// Dati mazzi
let mazzo = [];
let scarti = [];
let minacce = [];

// Caricamento iniziale carte
for (let i = 0; i <= 9; i++) {
  mazzo.push({ src: `carte/${i.toString().padStart(2, '0')}.png`, rotazione: 0 });
}
for (let i = 10; i <= 14; i++) {
  minacce.push({ src: `carte/${i}.png`, rotazione: 0 });
}

// Funzione pesca carta
function pescaCarta() {
  if (mazzo.length === 0) return;
  const areaGioco = document.getElementById('area-gioco');
  const cartaData = mazzo.shift();
  creaCartaInArea(areaGioco, cartaData);
  aggiornaMazzi();
}

// Creazione carta in area di gioco
function creaCartaInArea(area, cartaData) {
  const container = document.createElement('div');
  container.classList.add('carta-container');

  const carta = document.createElement('img');
  carta.src = cartaData.src;
  carta.classList.add('carta');
  carta.dataset.rotazione = cartaData.rotazione;
  carta.addEventListener('click', () => carta.classList.toggle('selezionata'));

  const azioni = document.createElement('div');
  azioni.classList.add('azioni-carta');

  const btnScarta = document.createElement('button');
  btnScarta.innerText = 'Scarta';
  btnScarta.onclick = () => scartaCarta(container);

  const btnRuota = document.createElement('button');
  btnRuota.innerText = 'Ruota';
  btnRuota.onclick = () => ruotaCarta(carta);

  const btnTuck = document.createElement('button');
  btnTuck.innerText = 'Storing';
  btnTuck.onclick = () => tuckCarte(container);

  azioni.append(btnScarta, btnRuota, btnTuck);

  container.appendChild(carta);
  container.appendChild(azioni);
  area.appendChild(container);
}

// Scarta carta
function scartaCarta(container) {
  container.querySelectorAll('img').forEach(carta => {
    scarti.push({ src: carta.src, rotazione: parseInt(carta.dataset.rotazione) || 0 });
  });
  container.remove();
  aggiornaMazzi();
}

// Ruota carta
function ruotaCarta(carta) {
  let rot = parseInt(carta.dataset.rotazione) || 0;
  rot = (rot + 180) % 360;
  carta.dataset.rotazione = rot;
  carta.style.transform = `rotate(${rot}deg)`;
}

// Tuck carte
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

// Funzioni mazzi
function mischiaMazzo() { mischiaArray(mazzo); aggiornaMazzi(); }
function mischiaMinacce() { mischiaArray(minacce); aggiornaMazzi(); }
function ripristinaScarti() { mazzo = [...mazzo, ...scarti]; scarti = []; aggiornaMazzi(); }
function aggiungiMinaccia() { if (minacce.length) scarti.push(minacce.shift()); aggiornaMazzi(); }

// Aggiorna mazzi (mazzo principale, scarti, minacce)
function aggiornaMazzi() {
  aggiornaMazzoSingolo('mazzo-container', mazzo);
  aggiornaMazzoSingolo('scarti-container', scarti);
  aggiornaMazzoSingolo('minacce-container', minacce);
}

// Funzione aggiorna singolo mazzo
function aggiornaMazzoSingolo(id, array) {
  const container = document.getElementById(id);
  container.innerHTML = '';
  if (array.length > 0) {
    const carta = document.createElement('img');
    carta.src = array[0].src;
    carta.style.transform = `rotate(${array[0].rotazione}deg)`;
    container.appendChild(carta);
  }
}

// Inizializzazione
aggiornaMazzi();

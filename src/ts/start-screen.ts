import '../css/container.css';
import { clearScreen } from '../utilities/utilities';

export const startScreen = ():HTMLElement => {
  clearScreen();
  const h1: HTMLDivElement = document.createElement('h1');
  const div: HTMLDivElement = document.createElement('div');
  h1.innerHTML = 'OPEN';
  div.appendChild(h1);
  div.classList.add('flex-row', 'start-screen');
  return div;
}

export const errorPage = ():HTMLElement => {
  if (_timesUpApp.store.container) {
    clearScreen();
    const h1: HTMLDivElement = document.createElement('h1');
    const div: HTMLDivElement = document.createElement('div');
    h1.innerHTML = '404. things fucked up';
    div.appendChild(h1);
    div.classList.add('flex-row', 'error-page');
    return div;
  }
}


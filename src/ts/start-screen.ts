import '../css/container.css';
import { clearScreen } from '../main.ts';

export const startScreen = ():void => {
  const h1: HTMLDivElement = document.createElement('h1');
  const div: HTMLDivElement = document.createElement('div');
  h1.innerHTML = 'OPEN';
  div.appendChild(h1);
  div.classList.add('flex-row', 'start-screen');
  document.querySelector('#container')?.appendChild(div);
}

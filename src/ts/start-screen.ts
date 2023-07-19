import '../css/container.css';
import { clearScreen } from '../main.ts';

export const startScreen = ():string => {
  clearScreen();
  const h1: HTMLDivElement = document.createElement('h1');
  h1.innerHTML = 'OPEN';
  h1.classList.add('start-screen');
  document.querySelector('#container')?.appendChild(h1);
  
  return `
    <div class=${'start-screen'}>     
      ${h1}
    </div>
  `;
}

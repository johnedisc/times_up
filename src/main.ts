import './css/container.css';
import './css/variables.css';
import { startScreen } from './ts/start-screen.ts';
import { Store } from './services/Store.ts';
import { LoadData } from './services/LoadData.ts';

declare global {
  interface Window {
    _timesUpApp: any,
  }
}

window._timesUpApp = { };
_timesUpApp.store = { };

export const clearScreen = ():void => {
  document.querySelector<HTMLElement>('#container')!.innerHTML = ``;
}

document.addEventListener('DOMContentLoaded', (event) => {
  LoadData();
  startScreen();
});



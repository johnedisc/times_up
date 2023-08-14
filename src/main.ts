import './css/container.css';
import './css/variables.css';
import { startScreen } from './ts/start-screen.ts';
import { Store } from './services/Store.ts';
import { LoadData } from './services/LoadData.ts';
import { Router } from './services/Router.ts';
import { setupCounter } from './ts/counter.ts';

declare global {
  interface Window {
    _timesUpApp: any,
  }
}

window._timesUpApp = { };
_timesUpApp.store = Store;
_timesUpApp.router = Router;

export const clearScreen = ():void => {
  document.querySelector<HTMLElement>('#container')!.innerHTML = ``;
}

document.addEventListener('DOMContentLoaded', (event) => {
  LoadData();
  startScreen();
  _timesUpApp.router.init();
});



import './components/Main.css';
import { StoreProxy } from './services/Store.ts';
import { LoadData } from './services/LoadData.ts';
import { Router } from './services/Router.ts';

// link web components
import { Interval } from './components/Interval.ts';
import { HelpModal } from './components/HelpModal.ts';
import { MenuModal } from './components/MenuModal.ts';
import { StartPage } from './components/StartPage.ts';
import { ProgramForm } from './components/ProgramForm.ts';
import { LogIn } from './components/LogIn.ts';
import { ErrorPage } from './components/ErrorPage.ts';
import { grabColors } from './utilities/utilities.ts';
customElements.define('interval-page', Interval);
customElements.define('help-modal', HelpModal);
customElements.define('error-page', ErrorPage);
customElements.define('program-form', ProgramForm);
customElements.define('menu-modal', MenuModal);
customElements.define('start-page', StartPage);
customElements.define('log-in', LogIn);

declare global {
  interface Window {
    _timesUpApp: any;
  }
}

window._timesUpApp = {};
window._timesUpApp.store = StoreProxy;
window._timesUpApp.router = Router;
window._timesUpApp.store.container = document.getElementById('container');
window._timesUpApp.store.currentIndex = 0;
window._timesUpApp.store.backgroundColors = grabColors();

// grab vh and set in root node
const vh = window.innerHeight;
document.documentElement.style.setProperty('--vh', `${vh}px`);

document.addEventListener('DOMContentLoaded', async () => {
  await LoadData();
  window._timesUpApp.router.init();
});



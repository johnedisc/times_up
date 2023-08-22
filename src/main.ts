import './root.css';
import { StoreProxy } from './services/Store.ts';
import { LoadData } from './services/LoadData.ts';
import { Router } from './services/Router.ts';
// link web components
import './components/Interval.ts';
import './components/HelpModal.ts';
import './components/MenuModal.ts';
import './components/StartPage.ts';
import { grabColors } from './utilities/utilities.ts';

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

document.addEventListener('DOMContentLoaded', async () => {
  await LoadData();
  window._timesUpApp.router.init();
});



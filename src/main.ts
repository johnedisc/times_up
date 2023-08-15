import './root.css';
import { Store } from './services/Store.ts';
import { LoadData } from './services/LoadData.ts';
import { Router } from './services/Router.ts';
// link web components
import './components/Interval.ts';
import './components/HelpModal.ts';
import './components/MenuModal.ts';
import './components/StartPage.ts';

declare global {
  interface Window {
    _timesUpApp: any,
  }
}


window._timesUpApp = { };
_timesUpApp.store = Store;
_timesUpApp.router = Router;
_timesUpApp.store.container = document.getElementById('container');

document.addEventListener('DOMContentLoaded', async (event) => {
  await LoadData();
  _timesUpApp.router.init();
});



import { StoreProxy } from './services/Store.js';
import { LoadData } from './services/LoadData.js';
import { Router } from './services/Router.js';
// link web components
import { Interval } from './components/Interval.js';
import { HelpModal } from './components/HelpModal.js';
import { MenuModal } from './components/MenuModal.js';
import { StartPage } from './components/StartPage.js';
import { ProgramForm } from './components/ProgramForm.js';
import { LogIn } from './components/LogIn.js';
import { ErrorPage } from './components/ErrorPage.js';
import { grabColors } from './utilities/utilities.js';
customElements.define('interval-page', Interval);
customElements.define('help-modal', HelpModal);
customElements.define('error-page', ErrorPage);
customElements.define('program-form', ProgramForm);
customElements.define('menu-modal', MenuModal);
customElements.define('start-page', StartPage);
customElements.define('log-in', LogIn);
//declare global {
//  interface Window {
//    _timesUpApp: any;
//  }
//}
export let _timesUpApp = {};
_timesUpApp.store = StoreProxy;
_timesUpApp.router = Router;
_timesUpApp.store.container = document.getElementById('container');
_timesUpApp.store.currentIndex = 0;
_timesUpApp.store.backgroundColors = grabColors();
// grab vh and set in root node
const vh = window.innerHeight;
document.documentElement.style.setProperty('--vh', `${vh}px`);
document.addEventListener('DOMContentLoaded', async () => {
    await LoadData();
    _timesUpApp.router.init();
});

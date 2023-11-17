import { StoreProxy } from './services/Store.js';
import { LoadData } from './services/LoadData.js';
import { Router } from './services/Router.js';
import { Auth } from './services/Auth.js';

// link web components
import { Interval } from './components/Interval.js';
import { IntervalForm } from './components/IntervalForm.js';
import { IntervalProgramList } from './components/IntervalProgramList.js';
import { Menu } from './components/Menu.js';
import { StartPage } from './components/StartPage.js';
import { ProgramForm } from './components/ProgramForm.js';
import { LogIn } from './components/LogIn.js';
import { Register } from './components/Register.js';
import { ErrorPage } from './components/ErrorPage.js';
import { NavigationBar } from './components/NavigationBar.js';
import { AddRemoveButton } from './components/AddRemoveButton.js';
import { grabColors } from './utilities/utilities.js';
customElements.define('interval-page', Interval);
customElements.define('interval-form', IntervalForm);
customElements.define('interval-program-list', IntervalProgramList);
customElements.define('error-page', ErrorPage);
customElements.define('program-form', ProgramForm);
customElements.define('user-menu', Menu);
customElements.define('start-page', StartPage);
customElements.define('register-user', Register);
customElements.define('log-in', LogIn);
customElements.define('navigation-bar', NavigationBar);
customElements.define('add-remove-button', AddRemoveButton);

//declare global {
//  interface Window {
//    _timesUpApp: any;
//  }
//}

export let _timesUpApp: any = { };
_timesUpApp.store = StoreProxy;
_timesUpApp.router = Router;
_timesUpApp.auth = Auth;
document.getElementById('container')?.classList.add('flex-down');
_timesUpApp.store.container = document.getElementById('container');
_timesUpApp.store.currentIndex = 0;
_timesUpApp.store.dataId = 0;
_timesUpApp.store.backgroundColors = grabColors();
_timesUpApp.store.accessToken;

// grab vh and set in root node
const vh = window.innerHeight;
document.documentElement.style.setProperty('--vh', `${vh}px`);

document.addEventListener('DOMContentLoaded', async () => {
  _timesUpApp.router.init();
});



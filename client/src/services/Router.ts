import { _timesUpApp } from "../main.js";
import { clearScreen } from "../utilities/utilities.js";

export const Router = {
  init: () => {

    // event handler for changes popstate
    window.addEventListener('popstate', (event) => {
      console.log(event.state.path);
      Router.go(event.state.path, false);
    });
    
    // check initial url from client
    Router.go(location.pathname);

  },
  go: (path: string, addToHistory=true) => {
    console.log(path, addToHistory);

    if (addToHistory) {
      history.pushState({ path }, '', path)
    }

    // parse out an ID from a url
    let pageElement: HTMLElement | null = null;
    let purePath;
    let pathID;

    if (path.lastIndexOf('/') > 0) {
      pathID = path.substring(path.lastIndexOf('/')+1);
      purePath = path.substring(0, path.lastIndexOf('/'));
    } else {
      purePath = path;
    }

    // if the store is empty and the requested page needs the store, reroute to home
    // MUST FIX!!!
//    if ((purePath !== '/' && purePath !== '/register') && !_timesUpApp.store.user) {
//      purePath = '/';
//    }

    switch (purePath) {
      case "/":
        clearScreen();
        pageElement = document.createElement('user-menu');
        break;
      case "/login":
        clearScreen();
        pageElement = document.createElement('log-in');
        break;
      case "/register":
        clearScreen();
        pageElement = document.createElement('register-user');
        break;
      case "/interval":
        clearScreen();
        pageElement = document.createElement('interval-page');
        if (pathID) {
          pageElement.dataset.programName = pathID;
        }
        break;
      case "/help":
        clearScreen();
        pageElement = document.createElement('help-modal');
        break;
      case "/program-form":
        clearScreen();
        pageElement = document.createElement('program-form');
        break;
      default:
        clearScreen();
        pageElement = document.createElement('error-page');
    }

    if (purePath === '/login' || purePath === '/register') {
    _timesUpApp.store.container.appendChild(pageElement);
    } else {
      const navBar = document.createElement('navigation-bar');
      _timesUpApp.store.container.appendChild(navBar);
      _timesUpApp.store.container.appendChild(pageElement);
    }
//    window.scrollX = 0;
//    window.scrollY = 0;
  }
};

import { clearScreen } from "../utilities/utilities.ts";

export const Router = {
  init: () => {
//    const links = document.querySelectorAll('a');
//    if (links) {
//      for (let i = 0; i < links.length; i++) {
//        links[i].addEventListener('click', (event) => {
//          console.log('copiaste?');
//          event.preventDefault();
//          const url = links[i].href;
//          Router.go(url);
//        });
//      };
//    }

    // event handler for changes popstate
    window.addEventListener('popstate', (event) => {
      console.log('pop');
      Router.go(event.state.path, false);
    });
    
    // check initial url from client
    Router.go(location.pathname);

  },
  go: (path: string, addToHistory=true) => {

    if (addToHistory) {
      history.pushState({ path }, '', path)
    }

    let pageElement: HTMLElement | null = null;
    let purePath;
    let pathID;

    if (path.lastIndexOf('/') > 0) {
      pathID = path.substring(path.lastIndexOf('/')+1);
      purePath = path.substring(0, path.lastIndexOf('/'));
    } else {
      purePath = path;
    }

    switch (purePath) {
      case "/":
        clearScreen();
        pageElement = document.createElement('log-in');
        break;
      case "/start":
        clearScreen();
        pageElement = document.createElement('start-page');
        break;
      case "/menu":
        pageElement = document.createElement('menu-modal');
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

    window._timesUpApp.store.container.appendChild(pageElement);
//    window.scrollX = 0;
//    window.scrollY = 0;
  }
};

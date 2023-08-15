import { errorPage, startScreen } from "../ts/start-screen.ts";
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
//
//    // event handler for changes popstate
//    window.addEventListener('popstate', (event) => {
//      console.log(event);
//      Router.go(event.state.path, false);
//    });

    _timesUpApp.store.container.addEventListener('click', event => {
      Router.go('/help');
    });
    
    // check initial url from client
    Router.go(location.pathname);

  },
  go: (path: string, addToHistory=true) => {

    console.log(`router go method\ngoing to ${path}`);

    if (addToHistory) {
      history.pushState({ path }, '', path)
      console.log(path);
    }

    let pageElement: HTMLElement | null = null;

    switch (path) {
      case "/":
        pageElement = startScreen();
        break;
      case "/help":
        clearScreen();
        const h1 = document.createElement('h1');
        h1.innerHTML = 'help';
        pageElement = h1;
        break;
      default:
        pageElement = errorPage();
    }

    _timesUpApp.store.container.appendChild(pageElement);
//    window.scrollX = 0;
//    window.scrollY = 0;
  }
};

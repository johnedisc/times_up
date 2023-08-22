import { clearScreen } from "../utilities/utilities.ts";

export class StartPage extends HTMLElement {
  constructor() {
    super();

  }

  startScreen(user: string):HTMLElement {
    const h1: HTMLDivElement = document.createElement('h1');
    const div: HTMLDivElement = document.createElement('div');
    const h5: HTMLDivElement = document.createElement('h5');
    h1.innerHTML = `hi, ${user}`;
    h1.style.margin = '1rem';
    h5.innerHTML = 'select your interval sequence';
    h5.style.margin = 0;
    h5.addEventListener('click', event => {
      _timesUpApp.router.go('/menu');
    })
    div.appendChild(h1);
    div.appendChild(h5);
    div.classList.add('flex-down', 'start-screen');
    return div;
  }

  connectedCallback() {
    this.appendChild(this.startScreen(_timesUpApp.store.user.name));
  }
}


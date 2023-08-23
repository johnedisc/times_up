import { clearScreen } from "../utilities/utilities.ts";

export class StartPage extends HTMLElement {
  h1: HTMLElement = document.createElement('h1');
  div: HTMLElement = document.createElement('div');
  h5: HTMLElement = document.createElement('h5');

  constructor() {
    super();

    this.div.appendChild(this.h1);
    this.div.appendChild(this.h5);
  }

  
  startScreen(user: string):void {
    this.h1.innerHTML = `hi, ${user}`;
    this.h1.style.margin = '1rem';
    this.h5.innerHTML = 'select your interval sequence';
    this.h5.style.margin = '0';
    this.div.classList.add('flex-down', 'start-screen');

    this.h5.addEventListener('click', () => {
      _timesUpApp.router.go('/menu');
    })
  }

  connectedCallback() {
    this.appendChild(this.div);
//    this.startScreen(_timesUpApp.store.user.name);
  }
}


import { _timesUpApp } from "../main.js";
import { addLinkListener } from "../utilities/utilities.js";

export class StartPage extends HTMLElement {
  h1: HTMLElement = document.createElement('h1');
  div: HTMLElement = document.createElement('div');
  h5: HTMLElement = document.createElement('h5');

  constructor() {
    super();

//    console.log(_timesUpApp);
    this.div.appendChild(this.h1);
    this.div.appendChild(this.h5);
  }

  
  startScreen(user: string):void {
    this.h1.innerHTML = `<a href='/menu'>hi, ${user}</a>`;
    this.h5.innerHTML = `<a href='/menu'>select your interval sequence</a>`;
    this.div.classList.add('flex-down', 'start-screen');
    this.h1.classList.add('h2');
    
    addLinkListener(this.div);
//    this.h5.addEventListener('click', () => {
//      _timesUpApp.router.go('/menu');
//    })
  }

  connectedCallback() {
    document.body.style.backgroundColor = 'var(--bg-start-screen)';
    this.appendChild(this.div);
    console.log(_timesUpApp.store);
    this.startScreen(_timesUpApp.store.user.name);
  }
}


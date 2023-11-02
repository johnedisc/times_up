import { _timesUpApp } from "../main.js";
import { addLinkListener } from "../utilities/utilities.js";

export class StartPage extends HTMLElement {
  h1: HTMLElement = document.createElement('h1');
  div: HTMLElement = document.createElement('div');
  h5: HTMLElement = document.createElement('h5');
  h5_2: HTMLElement = document.createElement('h5');

  constructor() {
    super();
//    console.log(_timesUpApp);
    this.div.appendChild(this.h1);
    this.div.appendChild(this.h5);
    this.div.appendChild(this.h5_2);
  }

  
  startScreen(user: string):void {
    const firstName: string = user.split(/\s|\W/g)[0]
    this.h1.innerHTML = `<a href='/menu'>hi, ${firstName}</a>`;
    this.h5.innerHTML = `<a href='/menu'>this is the start screen.</a>`;
    this.h5_2.innerHTML = `<a href='/menu' style='color: var(--bg-main)'>click here for menu</a>`;
    this.div.classList.add('flex-down', 'start-screen');
    this.h1.classList.add('h2');
    
    addLinkListener(this.div);
//    this.h5.addEventListener('click', () => {
//      _timesUpApp.router.go('/menu');
//    })
  }

  connectedCallback() {
    if (!_timesUpApp.store.user) {
      _timesUpApp.router.go('/');
    } else {
      document.body.style.backgroundColor = 'var(--bg-start-screen)';
      this.appendChild(this.div);
      this.startScreen(_timesUpApp.store.user.name);
    }
  }
}


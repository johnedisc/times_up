import { clearScreen } from "../utilities/utilities";

export class Interval extends HTMLElement {
  constructor() {
    super();
  }

  renderInterval(id: string):HTMLElement {
    const h1: HTMLDivElement = document.createElement('h1');
    const h5: HTMLDivElement = document.createElement('h5');
    const div: HTMLDivElement = document.createElement('div');
    h1.innerHTML = id;
    h1.style.margin = '1rem';
    h5.innerHTML = `${intervalName}`;
    h5.style.margin = '0';
    h5.addEventListener('click', event => {
      console.log('clicked');
    })
    div.appendChild(h5);
    div.appendChild(h1);
    div.classList.add('flex-down', 'start-screen');
    return div;
  }

  connectedCallback() {
    console.log(this);
    this.appendChild(this.renderInterval());
  }
}

customElements.define('interval-page', Interval);

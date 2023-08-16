import { clearScreen } from "../utilities/utilities";

export class Interval extends HTMLElement {
  constructor() {
    super();
  }

  renderInterval(id: string):HTMLElement {
    const h1: HTMLDivElement = document.createElement('h1');
    const h5: HTMLDivElement = document.createElement('h5');
    const div: HTMLDivElement = document.createElement('div');
    const intervalProgram = _timesUpApp.store.user.timerList.filter(item => item['name'] === id)[0].list;
    console.log(intervalProgram);
    h1.innerHTML =  intervalProgram[0].total;
    h1.style.margin = '1rem';
    h5.innerHTML =  intervalProgram[0].name;
    h5.style.margin = '0';
    div.addEventListener('click', event => {
      console.log('clicked');
    })
    div.appendChild(h5);
    div.appendChild(h1);
    div.classList.add('flex-down', 'start-screen');
    return div;
  }

  connectedCallback() {
    try {
      if (!this.dataset.sequence) {
        throw new Error('this sequence can\'t be accessed');
      }
      this.appendChild(this.renderInterval(this.dataset.sequence));
    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define('interval-page', Interval);

import { ITimerList } from '../services/Store';

export class Interval extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
  }

  #privateShit = 'k rico';

  // methods
  async loadCSS() {
    const cssRequest = await fetch('/src/components/Interval.css.text');
    const parsedCSS = await cssRequest.text();
    const styleTag = document.createElement('style');
    this.root.appendChild(styleTag);
    styleTag.textContent = parsedCSS;
  }

  counter(program: ITimerList[], element: HTMLElement, index: number=0):void {

    let runningTotal = program[index].total;

    setInterval(() => {
      if (runningTotal < -10000) {
        element.innerHTML = 'you\'re done, agburre';
      } else {
        runningTotal--;
        element.innerHTML = runningTotal.toString();
      }
    }, 1000);
  }

  renderInterval(id: string):HTMLElement {
    // define the elements
    const h1: HTMLDivElement = document.createElement('h1');
    const h5: HTMLDivElement = document.createElement('h5');
    const div: HTMLDivElement = document.createElement('div');

    // cache the user's selected program list
    const intervalProgram = _timesUpApp.store.user.timerList.filter(item => item['name'] === id)[0].list;
    console.log(intervalProgram);

    // print the time
    h1.innerHTML = intervalProgram[0].total
    h5.innerHTML = intervalProgram[0].name;

    // add event listeners
    div.addEventListener('click', event => {
      this.counter(intervalProgram, h1);
      console.log('clicked');
    })

    // add stylings. change method?
    h1.style.margin = '1rem';
    h5.style.margin = '0';
    div.classList.add('start-screen', 'flex-down');

    // attach to parent
    div.appendChild(h5);
    div.appendChild(h1);
    return div;
  }

  connectedCallback() {
    try {
      if (!this.dataset.sequence) {
        throw new Error('this sequence can\'t be accessed');
      }
      this.loadCSS();
      this.root.appendChild(this.renderInterval(this.dataset.sequence));
    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define('interval-page', Interval);

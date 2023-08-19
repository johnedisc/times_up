import { clearElementChildren, clearScreen, clearSelf, counter } from '../utilities/utilities.ts';

export class Interval extends HTMLElement {

  root;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });

  }

  // methods
  async loadCSS(url: string) {
    const cssRequest = await fetch(`/src/components/${url}`);
    const parsedCSS = await cssRequest.text();
    const styleTag = document.createElement('style');
    this.root.appendChild(styleTag);
    styleTag.textContent = parsedCSS;
  }

  renderInterval(programNameProp: string, index: number):HTMLElement {
      // define the elements
      const h1: HTMLDivElement = document.createElement('h1');
      const h5: HTMLDivElement = document.createElement('h5');
      const div: HTMLDivElement = document.createElement('div');
      const p: HTMLDivElement = document.createElement('p');

      // cache the user's selected program list
      const intervalProgram = _timesUpApp.store.user.timerList.filter(item => item['name'] === programNameProp)[0].list;
      console.log(intervalProgram[index]);

      // print the time
      h1.innerHTML = intervalProgram[index].total;
      h5.innerHTML = intervalProgram[index].name;
      p.innerHTML = 'next';

      // add event listeners
      div.addEventListener('click', event => {
        counter(intervalProgram, h1, index);
      }, { once: true })
      p.addEventListener('click', event => {
        console.log('next clicked');
        if (_timesUpApp.store.currentIndex < _timesUpApp.store.user.timerList.length) {
          _timesUpApp.store.currentIndex++;
        }       
      });

      // add stylings. change method?
      h1.style.margin = '1rem';
      h5.style.margin = '0';
      div.classList.add('start-screen', 'flex-down');
      div.setAttribute('id', 'interval-container');
      p.setAttribute('id', 'next');
      p.style.margin = '1rem';
      p.style.margin = '0';
      p.style.position = 'absolute';
      p.style.right = '1rem';
      p.style.top = '0';
      p.style.color = 'pink';
      p.style.fontSize = '2rem';

      // attach to parent
      div.appendChild(h5);
      div.appendChild(h1);
      document.getElementById('container').appendChild(p);
      return div;
  }

  completeSequence() {
//    clearElementChildren(this.root);
//    this.loadCSS();
    const h1: HTMLDivElement = document.createElement('h1');
    const div: HTMLDivElement = document.createElement('div');
    h1.innerHTML = 'all done.';
    div.appendChild(h1);
    this.root.appendChild(div);
  }


  connectedCallback() {
    try {
      if (!this.dataset.programName) {
        throw new Error('this program can\'t be accessed');
      }
      this.root.appendChild(this.renderInterval(this.dataset.programName, 0));
      this.loadCSS('Interval.css.text');
      window.addEventListener("indexchanged", () => {
        console.log(this.root);
        clearScreen();
//        clearElementChildren(document.getElementById('interval-container'));
//        clearSelf(document.getElementById('interval-container'));
        if (_timesUpApp.store.currentIndex < _timesUpApp.store.user.timerList.length - 1) {
          this.root.appendChild(this.renderInterval(this.dataset.programName, _timesUpApp.store.currentIndex));
        } else {
          this.completeSequence();
        }
        this.loadCSS('Interval.css.text');
      });
    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define('interval-page', Interval);

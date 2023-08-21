import { ITimerList } from '../utilities/interfaces.ts';
import { clearElementChildren, clearScreen, clearSelf, counter } from '../utilities/utilities.ts';

export class Interval extends HTMLElement {

  root;
  timerHeader: HTMLElement;
  categoryHeader: HTMLElement;
  divContainer: HTMLDivElement;
  nextButton: HTMLParagraphElement;
  intervalID: number = 0;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });

    this.timerHeader = document.createElement('h1');
    this.categoryHeader = document.createElement('h5');
    this.divContainer = document.createElement('div');
    this.nextButton = document.createElement('p');
    this.nextButton.setAttribute('id', 'next-button');
    this.nextButton.innerText = 'next';
    this.divContainer.appendChild(this.categoryHeader);
    this.divContainer.appendChild(this.timerHeader);
    this.divContainer.appendChild(this.nextButton);
    this.divContainer.classList.add('flex-down');
    this.divContainer.setAttribute('id', 'interval-container');
    this.root.appendChild(this.divContainer);
  }

  // methods
  async loadCSS(url: string) {
    const cssRequest = await fetch(`/src/components/${url}`);
    const parsedCSS = await cssRequest.text();
    const styleTag = document.createElement('style');
    this.root.appendChild(styleTag);
    styleTag.textContent = parsedCSS;
  }

  renderInterval(programNameProp: string, index: number):void {
    // cache the user's selected program list
    const intervalProgram = _timesUpApp.store.user.timerList.filter(item => item['name'] === programNameProp)[0].list;
    console.log(intervalProgram[index]);

    // print the time
    this.timerHeader.innerHTML = intervalProgram[index].total;
    this.categoryHeader.innerHTML = intervalProgram[index].name;

    // add event listeners
    this.divContainer.addEventListener('click', event => {
      this.intervalID = counter(intervalProgram, this.timerHeader, index);
    }, { once: true })
    this.nextButton.addEventListener('click', event => {
      console.log('next clicked');
      if (_timesUpApp.store.currentIndex < _timesUpApp.store.user.timerList.length) {
        _timesUpApp.store.currentIndex++;
      }       
      clearInterval(this.intervalID);
    });
  }

  completeSequence() {
    clearSelf(this.nextButton);
    clearSelf(this.categoryHeader);
    this.timerHeader.innerHTML = 'all done.';
  }


  connectedCallback() {
    try {
      if (!this.dataset.programName) {
        throw new Error('this program can\'t be accessed');
      }
      this.renderInterval(this.dataset.programName, 0);
      this.loadCSS('Interval.css.text');
      window.addEventListener("indexchanged", () => {
        if (_timesUpApp.store.currentIndex < _timesUpApp.store.user.timerList.length) {
          this.renderInterval(this.dataset.programName, _timesUpApp.store.currentIndex);
        } else {
          this.completeSequence();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define('interval-page', Interval);

import { ITimerList } from '../utilities/interfaces.ts';
import { clearElementChildren, clearScreen, clearSelf, counter } from '../utilities/utilities.ts';

export class Interval extends HTMLElement {

  root;
  timerHeader: HTMLElement;
  categoryHeader: HTMLElement;
  divContainer: HTMLDivElement;
  nextButton: HTMLParagraphElement;
  intervalID: number = 0;
  intervalProgram: ITimerList[] | null = null;
  openIntervals: number[] = [];
  backgroundColorIndex: number = 0;

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
    console.log('renderInterval')
    //    console.log('this is the intervalProgram', this.intervalProgram);
    if (_timesUpApp.store.backgroundColors[this.backgroundColorIndex]) {
      this.divContainer.style.backgroundColor = _timesUpApp.store.backgroundColors[this.backgroundColorIndex];
      this.backgroundColorIndex++;
    } else {
      this.backgroundColorIndex = 0;
      this.divContainer.style.backgroundColor = _timesUpApp.store.backgroundColors[this.backgroundColorIndex];
    }

    // print the time
    this.timerHeader.innerHTML = this.intervalProgram[index].total;
    this.categoryHeader.innerHTML = this.intervalProgram[index].name;
  }

  completeSequence() {
    console.log('complete')
    clearInterval(this.intervalID);
    clearSelf(this.nextButton);
    clearSelf(this.categoryHeader);
//    clearSelf(this.timerHeader);
//    this.divContainer.appendChild(this.timerHeader);
    this.timerHeader.innerHTML = 'all done.';
    this.timerHeader.style.fontSize = '4rem';
    _timesUpApp.store.currentIndex = 0;
  }


  connectedCallback() {
    try {
      if (!this.dataset.programName) {
        throw new Error('this program can\'t be accessed');
      }
      console.log('callback')
      this.intervalProgram = _timesUpApp.store.user.timerList.filter(item => item['name'] === this.dataset.programName)[0].list;
      this.renderInterval(this.dataset.programName, 0);
      this.loadCSS('Interval.css.text');

      // add event listeners
      this.divContainer.addEventListener('click', event => {
        console.log('start')
        this.intervalID = counter(this.intervalProgram, this.timerHeader, _timesUpApp.store.currentIndex);
        this.openIntervals.push(this.intervalID);
      }, { once: true });

      this.nextButton.addEventListener('click', event => {
        console.log('nextButton')
        clearInterval(this.intervalID);
        //      this.divContainer.removeChild(this.timerHeader);
        if (_timesUpApp.store.currentIndex < this.intervalProgram?.length - 1) {
          _timesUpApp.store.currentIndex++;
          this.intervalID = counter(this.intervalProgram, this.timerHeader, _timesUpApp.store.currentIndex);
          this.openIntervals.push(this.intervalID);
          console.log('current index', _timesUpApp.store.currentIndex);
        } else if (_timesUpApp.store.currentIndex === this.intervalProgram?.length - 1) {
          _timesUpApp.store.currentIndex++;
        }       
      });

      window.addEventListener("indexchanged", () => {
        if (_timesUpApp.store.currentIndex > 0) {
          console.log('index event')
          if (_timesUpApp.store.currentIndex < this.intervalProgram.length) {
            this.renderInterval(this.dataset.programName, _timesUpApp.store.currentIndex);
          } else {
            this.completeSequence();
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define('interval-page', Interval);

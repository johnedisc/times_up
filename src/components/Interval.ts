import { ITimerList } from '../utilities/interfaces.ts';
import { clearElementChildren, clearScreen, clearSelf, convertSeconds2Time, counter, printTime } from '../utilities/utilities.ts';

export class Interval extends HTMLElement {

  root;
  timerHeader: HTMLElement;
  categoryHeader: HTMLElement;
  divContainer: HTMLDivElement;
  nextButton: HTMLParagraphElement;
  intervalID: number = 0;
  intervalProgram: ITimerList[] | null = null;
  backgroundColorIndex: number = 0;
  remainder: number = 0;
  h1div: HTMLElement;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });

    this.timerHeader = document.createElement('h1');
    this.categoryHeader = document.createElement('h4');
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
    //    console.log('this is the intervalProgram', this.intervalProgram);
    if (_timesUpApp.store.backgroundColors[this.backgroundColorIndex]) {
      this.divContainer.style.backgroundColor = _timesUpApp.store.backgroundColors[this.backgroundColorIndex];
      this.backgroundColorIndex++;
    } else {
      this.backgroundColorIndex = 0;
      this.divContainer.style.backgroundColor = _timesUpApp.store.backgroundColors[this.backgroundColorIndex];
    }

    // print the time
    if (this.intervalProgram) {
      this.timerHeader.innerHTML = convertSeconds2Time(this.intervalProgram[index].total);
      this.categoryHeader.innerHTML = this.intervalProgram[index].name;
    }
  }

  completeSequence() {
    clearInterval(this.intervalID);
    clearSelf(this.categoryHeader);
//    clearSelf(this.timerHeader);
//    this.divContainer.appendChild(this.timerHeader);
    this.nextButton.innerText = 'menu';
    this.nextButton.addEventListener('click', () => {
      _timesUpApp.router.go('/menu');
      clearSelf(this.nextButton);
    });
    this.timerHeader.innerText = 'all done.';
    this.timerHeader.style.fontSize = '4rem';
    _timesUpApp.store.currentIndex = 0;
  }


  connectedCallback() {
    try {
      if (!this.dataset.programName) {
        throw new Error('this program can\'t be accessed');
      }
      this.intervalProgram = _timesUpApp.store.user.timerList.filter(item => item['name'] === this.dataset.programName)[0].list;
      this.renderInterval(this.dataset.programName, 0);
      this.loadCSS('Interval.css.text');

      // add event listeners
      this.divContainer.addEventListener('click', event => {
        this.intervalID = counter(this.intervalProgram, this.timerHeader, _timesUpApp.store.currentIndex);

        this.nextButton.addEventListener('click', event => {
          this.timerHeader.removeAttribute('id');
//          console.log(this.intervalProgram[_timesUpApp.store.currentIndex].name, this.timerHeader.dataset.runningTotal);
          clearInterval(this.intervalID);
          //      this.divContainer.removeChild(this.timerHeader);
          if (_timesUpApp.store.currentIndex < this.intervalProgram?.length - 1) {
            _timesUpApp.store.currentIndex++;
            this.intervalID = counter(this.intervalProgram, this.timerHeader, _timesUpApp.store.currentIndex);
          } else if (_timesUpApp.store.currentIndex === this.intervalProgram?.length - 1) {
            _timesUpApp.store.currentIndex++;
          }       
        });
      }, { once: true });


      window.addEventListener("indexchanged", () => {
        if (_timesUpApp.store.currentIndex > 0) {
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


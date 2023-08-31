import { _timesUpApp } from "../main.js";
import { ITimerList } from '../utilities/interfaces.js';
import {clearSelf, convertSeconds2Time, counter} from '../utilities/utilities.js';

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

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });

    this.loadCSS('Interval.css');

    this.timerHeader = document.createElement('h1');
    this.categoryHeader = document.createElement('h4');
    this.categoryHeader.classList.add('h4');
    this.divContainer = document.createElement('div');
    this.divContainer.classList.add('flex-down');
    this.divContainer.setAttribute('id', 'interval-container');
    this.nextButton = document.createElement('p');
    this.nextButton.setAttribute('id', 'next-button');
    this.nextButton.innerText = 'next';
    this.divContainer.appendChild(this.categoryHeader);
    this.divContainer.appendChild(this.timerHeader);
    this.divContainer.appendChild(this.nextButton);
    this.root.appendChild(this.divContainer);
  }

  // methods

  async loadCSS(url: string) {
    const cssRequest = await fetch(`../../src/css/${url}`);
    const parsedCSS = await cssRequest.text();
    const styleTag = document.createElement('style');
    this.root.appendChild(styleTag);
    styleTag.textContent = parsedCSS;
  }

  renderInterval(index: number):void {
    //    console.log('this is the intervalProgram', this.intervalProgram);
    if (_timesUpApp.store.backgroundColors[this.backgroundColorIndex]) {
      document.body.style.backgroundColor = _timesUpApp.store.backgroundColors[this.backgroundColorIndex];
      this.backgroundColorIndex++;
    } else {
      this.backgroundColorIndex = 0;
      document.body.style.backgroundColor = _timesUpApp.store.backgroundColors[this.backgroundColorIndex];
    }

    // print the time
    if (this.intervalProgram) {
      console.log(this.intervalProgram[index]);
      let timeMS = convertSeconds2Time(this.intervalProgram[index].total);

      // check length and resize.
      // TODO. limit timer length in creatation. 
      timeMS.length === 5
        ? this.timerHeader.style.fontSize = 'calc(var(--vh) * .27)'
          : timeMS.length > 5
            ? this.timerHeader.style.fontSize = 'calc(var(--vh) * .23)'
              : this.timerHeader.style.removeProperty('font-size');
      this.timerHeader.innerHTML = timeMS;
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
      for (let i = 0; i < _timesUpApp.store.user.timerList.length; i++) {
        if (_timesUpApp.store.user.timerList[i].name === this.dataset.programName) {
          this.intervalProgram = _timesUpApp.store.user.timerList[i].list;
          console.log(this.intervalProgram);
          break;
        }
      }
//      this.intervalProgram = _timesUpApp.store.user.timerList.filter((item: ITimerList) => {
//        item.name === this.dataset.programName
//      })[0].list;
      this.renderInterval(0);

      // add event listeners
      this.divContainer.addEventListener('click', () => {
        if (this.intervalProgram) {
          this.intervalID = counter(this.intervalProgram, this.timerHeader, _timesUpApp.store.currentIndex);

          this.nextButton.addEventListener('click', () => {
            this.timerHeader.removeAttribute('id');
            //          console.log(this.intervalProgram[_timesUpApp.store.currentIndex].name, this.timerHeader.dataset.runningTotal);
            clearInterval(this.intervalID);
            if (this.intervalProgram && _timesUpApp.store.currentIndex < this.intervalProgram.length - 1) {
              _timesUpApp.store.currentIndex++;
              this.intervalID = counter(this.intervalProgram, this.timerHeader, _timesUpApp.store.currentIndex);
            } else if (this.intervalProgram && _timesUpApp.store.currentIndex === this.intervalProgram.length - 1) {
              _timesUpApp.store.currentIndex++;
            } else {
              throw new Error('divContainer intervalProgram problems');
            }
          });
        }
      }, { once: true });


      window.addEventListener("indexchanged", () => {
        if (this.intervalProgram) {
          if (_timesUpApp.store.currentIndex > 0) {
            if (_timesUpApp.store.currentIndex < this.intervalProgram.length) {
              this.renderInterval(_timesUpApp.store.currentIndex);
            } else {
              this.completeSequence();
            }
          }
        }
      });
    } catch (error) {
      console.error(error);
    }


//    this.style.height =  '100%'; 
//    this.style.width =  '100%'; 

  }
}


import { _timesUpApp } from "../main.js";
import { ITimerList } from '../utilities/interfaces.js';
import {addLinkListener, clearSelf, convertSeconds2Time, counter} from '../utilities/utilities.js';

export class Interval extends HTMLElement {

  timerHeader: HTMLElement;
  categoryHeader: HTMLElement;
  divContainer: HTMLDivElement;
  intervalID: number = 0;
  intervalProgram: ITimerList[] | null = null;
  backgroundColorIndex: number = 0;
  remainder: number = 0;

  constructor() {
    super();
    this.timerHeader = document.createElement('h1');
    this.categoryHeader = document.createElement('h4');
    this.categoryHeader.classList.add('h3');
    this.divContainer = document.createElement('div');
    this.divContainer.classList.add('flex-down', 'inner-container');
    this.divContainer.appendChild(this.categoryHeader);
    this.divContainer.appendChild(this.timerHeader);

    //    no shadow required here
//    this.root = this.attachShadow({ mode: 'open' });
//    this.loadCSS('Interval.css');
  }

  // methods

  async loadCSS(url: string) {
    const cssRequest = await fetch(`../../src/css/${url}`);
    const parsedCSS = await cssRequest.text();
    const styleTag = document.createElement('style');
    this.appendChild(styleTag);
    styleTag.textContent = parsedCSS;
  }

  renderInterval(index: number):void {
    //    console.log('this is the intervalProgram', this.intervalProgram);

    //    advance the backgroundColor
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
    const menuButton = document.createElement('p');
    menuButton.setAttribute('id', 'menu-button');
    menuButton.innerHTML = `<a href='/menu'>menu</a>`;    
    addLinkListener(this.divContainer);
    this.divContainer.appendChild(menuButton);
    this.timerHeader.innerHTML = `all done`;
    this.timerHeader.style.fontSize = '4rem';
    _timesUpApp.store.currentIndex = 0;
    menuButton?.querySelector('a')?.addEventListener('click', () => {
      clearSelf(menuButton);
    });
  }


  connectedCallback() {

    this.appendChild(this.divContainer);
    this.classList.add('flex-down');
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

          this.divContainer.addEventListener('click', () => {
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


  }
}


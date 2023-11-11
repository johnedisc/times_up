import { _timesUpApp } from "../main.js";
import { UserDataAPI } from "../services/UserDataAPI.js";
import { ITimerList } from '../utilities/interfaces.js';
import {addLinkListener, clearSelf, convertSeconds2Time, counter} from '../utilities/utilities.js';

export class Interval extends HTMLElement {

  timerHeader: HTMLElement;
  categoryHeader: HTMLElement;
  divContainer: HTMLDivElement;
  instruction: HTMLElement;
  intervalID: number = 0;
  intervalProgram: ITimerList[] | null = null;
  backgroundColorIndex: number = 0;
  remainder: number = 0;
  complete: boolean = false;

  constructor() {
    super();
    this.timerHeader = document.createElement('h1');
    this.categoryHeader = document.createElement('h4');
    this.categoryHeader.classList.add('h3');
    this.divContainer = document.createElement('div');
    this.divContainer.style.zIndex = '1';
    this.divContainer.classList.add('flex-down', 'inner-container');
    this.instruction = document.createElement('p');
    this.instruction.innerHTML = 'tap to advance to the next interval';
    this.divContainer.appendChild(this.categoryHeader);
    this.divContainer.appendChild(this.timerHeader);
    this.divContainer.appendChild(this.instruction);
    _timesUpApp.store.currentIndex = 0;

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
//    if (_timesUpApp.store.backgroundColors[this.backgroundColorIndex]) {
//      document.body.style.backgroundColor = _timesUpApp.store.backgroundColors[this.backgroundColorIndex];
//      this.backgroundColorIndex++;
//    } else {
//      this.backgroundColorIndex = 0;
//      document.body.style.backgroundColor = _timesUpApp.store.backgroundColors[this.backgroundColorIndex];
//    }

    // print the time
    if (this.intervalProgram) {
//      console.log(this.intervalProgram[index]);
      let timeMS = convertSeconds2Time(this.intervalProgram[index].time_seconds);

      // check length and resize.
      // TODO. limit timer length in creatation. 
      timeMS.length === 5
        ? this.timerHeader.style.fontSize = 'calc(var(--vh) * .27)'
          : timeMS.length > 5
            ? this.timerHeader.style.fontSize = 'calc(var(--vh) * .23)'
              : this.timerHeader.style.removeProperty('font-size');
      this.timerHeader.innerHTML = timeMS;
      this.categoryHeader.innerHTML = this.intervalProgram[index].interval_name;
    }
  }

  completeSequence() {
    clearInterval(this.intervalID);
    clearSelf(this.categoryHeader);
//    clearSelf(this.timerHeader);
//    this.divContainer.appendChild(this.timerHeader);
    addLinkListener(this.divContainer);
    this.complete = true;
    this.timerHeader.innerHTML = `all done`;
    this.timerHeader.style.fontSize = '4rem';
    this.instruction.innerHTML = '';
//    menuButton?.querySelector('a')?.addEventListener('click', () => {
//      clearSelf(this);
//    });
  }

  async connectedCallback() {

    this.appendChild(this.divContainer);
    this.classList.add('flex-down');
    try {

      if (!this.dataset.programName) {
        throw new Error('this program can\'t be accessed');
      }

      // grab user selected program and assign to class
      for (let i = 0; i < _timesUpApp.store.user.programs.length; i++) {
        if (_timesUpApp.store.user.programs[i].program_name === this.dataset.programName) {

          //make a shallow copy. this matter?
          this.intervalProgram = [..._timesUpApp.store.user.programs[i].intervals];
          //sort the list so it is in order
          this.intervalProgram?.sort((a, b) => a.sequence_number - b.sequence_number);
          break;
        }
      }

      this.renderInterval(0);

      // add event listeners
      this.divContainer.addEventListener('click', () => {
        if (this.intervalProgram) {
          this.timerHeader.style.color = 'var(--warning-text)';
          this.timerHeader.innerHTML = 'GO';
          this.timerHeader.style.color = 'var(--primary-font-color)';
          this.intervalID = counter(this.intervalProgram, this.timerHeader, _timesUpApp.store.currentIndex);

          this.divContainer.addEventListener('click', () => {
            clearInterval(this.intervalID);
            if (this.intervalProgram && _timesUpApp.store.currentIndex < this.intervalProgram.length - 1) {
              _timesUpApp.store.currentIndex++;
              this.intervalID = counter(this.intervalProgram, this.timerHeader, _timesUpApp.store.currentIndex);
            } else if (this.intervalProgram && _timesUpApp.store.currentIndex === this.intervalProgram.length - 1) {
              _timesUpApp.store.currentIndex++;
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
      console.error('interval page error ', error);
    }


  }
}


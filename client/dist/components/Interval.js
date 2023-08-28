import { _timesUpApp } from "../main.js";
import { clearSelf, convertSeconds2Time, counter } from '../utilities/utilities.js';
export class Interval extends HTMLElement {
    constructor() {
        super();
        this.intervalID = 0;
        this.intervalProgram = null;
        this.backgroundColorIndex = 0;
        this.remainder = 0;
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
        this.categoryHeader.classList.add('h3');
        this.divContainer.setAttribute('id', 'interval-container');
        this.root.appendChild(this.divContainer);
    }
    // methods
    async loadCSS(url) {
        const cssRequest = await fetch(`/src/css/${url}`);
        const parsedCSS = await cssRequest.text();
        const styleTag = document.createElement('style');
        this.root.appendChild(styleTag);
        styleTag.textContent = parsedCSS;
    }
    renderInterval(index) {
        //    console.log('this is the intervalProgram', this.intervalProgram);
        if (_timesUpApp.store.backgroundColors[this.backgroundColorIndex]) {
            this.divContainer.style.backgroundColor = _timesUpApp.store.backgroundColors[this.backgroundColorIndex];
            this.backgroundColorIndex++;
        }
        else {
            this.backgroundColorIndex = 0;
            this.divContainer.style.backgroundColor = _timesUpApp.store.backgroundColors[this.backgroundColorIndex];
        }
        // print the time
        if (this.intervalProgram) {
            console.log(this.intervalProgram[index]);
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
            this.loadCSS('Interval.css');
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
                        }
                        else if (this.intervalProgram && _timesUpApp.store.currentIndex === this.intervalProgram.length - 1) {
                            _timesUpApp.store.currentIndex++;
                        }
                        else {
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
                        }
                        else {
                            this.completeSequence();
                        }
                    }
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }
}

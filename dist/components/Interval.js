var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    loadCSS(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const cssRequest = yield fetch(`/src/components/${url}`);
            const parsedCSS = yield cssRequest.text();
            const styleTag = document.createElement('style');
            this.root.appendChild(styleTag);
            styleTag.textContent = parsedCSS;
        });
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
            this.intervalProgram = _timesUpApp.store.user.timerList.filter((item) => {
                item.name === this.dataset.programName;
            })[0].list;
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

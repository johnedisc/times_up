import { ITimerList, IUser } from "../services/Store.ts";

export const clearScreen = ():void => {
  while (_timesUpApp.store.container.children[0]) {
    _timesUpApp.store.container.removeChild(_timesUpApp.store.container.children[0]);
  }
}

export const clearElementChildren = (element: HTMLElement | null):void => {
  if (element) {
    while (element.children[0]) {
      element.removeChild(element.children[0]);
    }
  }
}

export const clearSelf = (element: HTMLElement | null):void => {
  if (element && element.parentElement) {
    const parentEl = element.parentElement;
    parentEl.removeChild(element);
  }
}

export const linkWrapper = (element: HTMLElement, url: string):HTMLAnchorElement => {
  const aTag: HTMLAnchorElement = document.createElement('a');
  aTag.href = url;
  aTag.appendChild(element);
  return aTag;
}

export const convertSeconds2Time = (timeInSeconds: number): string => {
    let minutes = Math.round(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    return fillOutZeros(minutes, seconds);
}

export function fillOutZeros(minutes:number, seconds:number):string {
  if (seconds < 10) {
    return `${minutes}:0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

export const counter = (program: ITimerList[], element: HTMLElement, index: number):number => {
    console.log('counter funct');

    let runningTotal = program[index].total;
    let minutes = Math.round(runningTotal / 60);
    let seconds = runningTotal % 60;

    return setInterval(() => {
//      console.log(runningTotal, minutes, seconds);
      if (runningTotal <= 0) {
        element.setAttribute('id','warning') 
        if (minutes < -60) {
          element.innerHTML = 'you\'re done, agburre';
          return;
        }
        if (seconds <= 60) {
          seconds++;
          runningTotal--;
        }
        else {
          seconds -= 60;
          minutes++;
          runningTotal--;
        }
      } else {
        if (element.hasAttribute('id')) element.removeAttribute('id');
        if (seconds > 0) {
          seconds--;
          runningTotal--;
        }
        else {
          seconds += 59;
          minutes--;
          runningTotal--;
        }
        //        console.log(element, `is running at ${runningTotal}`);
      }
      element.dataset.runningTotal = runningTotal;
      element.innerHTML = fillOutZeros(minutes, seconds);
    }, 1000);

  }

  export const grabColors = ():string[] => {

    const ruleArray = document.styleSheets[0].cssRules[1].cssText.split(';');
    const regExp:RegExp = /--bg-\d+/;
    const backgroundColors:string[] = [];

    for (let i=0; i < ruleArray.length; i++) {
      if (regExp.test(ruleArray[i])) {
        const ruleString = ruleArray[i].split(': ');
        backgroundColors.push(ruleString[1]);
      }
    }
    
    return backgroundColors;
  }

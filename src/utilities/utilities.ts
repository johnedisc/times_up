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

export const counter = (program: ITimerList[], element: HTMLElement, index: number):number => {
    console.log('counter funct');

    let runningTotal = program[index].total;

    console.log('this is the counter function at index:', index);
    return setInterval(() => {
      if (runningTotal < -1000) {
        element.innerHTML = 'you\'re done, agburre';
      } else {
        runningTotal--;
        element.innerHTML = runningTotal.toString();
        console.log('this is running');
//        console.log(element, `is running at ${runningTotal}`);
      }
    }, 1000);

  }

  export const grabColors = ():string[] => {

    const ruleArray = document.styleSheets[0].cssRules[0].cssText.split(';');
    const regExp:RegExp = /--bg-\d+/;
    const backgroundColors:string[] = [];

    for (let i=0; i < ruleArray.length; i++) {
      if (regExp.test(ruleArray[i])) {
        const ruleString = ruleArray[i].split(': ');
        backgroundColors.push(ruleString[1]);
      }
    }
    
    console.log(backgroundColors);
    return backgroundColors;
  }

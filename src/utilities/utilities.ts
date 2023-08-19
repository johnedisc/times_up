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

export const counter = (program: ITimerList[], element: HTMLElement, index: number):void => {

    let runningTotal = program[index].total;

    setInterval(() => {
      if (runningTotal < -1000) {
        element.innerHTML = 'you\'re done, agburre';
      } else {
        runningTotal--;
        element.innerHTML = runningTotal.toString();
      }
    }, 1000);

  }


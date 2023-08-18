import { ITimerList, IUser } from "../services/Store.ts";

export const clearScreen = ():void => {
  while (_timesUpApp.store.container.children[0]) {
    _timesUpApp.store.container.removeChild(_timesUpApp.store.container.children[0]);
  }
}

export const clearElementChildren = (element: HTMLElement):void => {
  while (element.children[0]) {
    element.removeChild(element.children[0]);
  }
}

export const clearSelf = (element: HTMLElement):void => {
  if (element.parentElement) {
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


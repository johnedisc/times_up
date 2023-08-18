import { IStore } from "../utilities/interfaces.ts";

export const Store: IStore = {
  user: null,
  container: null,
  currentProgram: null,
  currentIndex: 0
}

export const storeProxy = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;
    if (property === 'currentProgram') {
      window.dispatchEvent(new Event('programchanged'));
    } else if (property === 'currentIndex') {
      window.dispatchEvent(new Event('indexchanged'));
    } else if (property === 'user') {
      window.dispatchEvent(new Event('userchanged'));
    }
    return true;
  }
});

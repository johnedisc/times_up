import { IStore } from "../utilities/interfaces.ts";

const Store: IStore = {
  user: null,
  container: null,
  currentProgram: null,
  currentIndex: null,
  usageData: null,
  backgroundColors: null
}

export const StoreProxy = new Proxy(Store, {
  set(target, property, value, receiver) {
    try {
      if (target.hasOwnProperty(property)) {
        target[property as keyof IStore] = value;
        if (property === 'currentProgram') {
          window.dispatchEvent(new Event('programchanged'));
        } else if (property === 'currentIndex') {
          window.dispatchEvent(new Event('indexchanged'));
          console.log('it is happening again');
        } else if (property === 'user') {
          window.dispatchEvent(new Event('userchanged'));
        }
      }
      return true;
    } catch(error) {
      console.error(error);
    }
  }
});

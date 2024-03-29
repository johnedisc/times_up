import { _timesUpApp } from "../main.js";
import { IStore } from "../utilities/interfaces.js";

const Store: IStore = {
  user: null,
  container: null,
  currentProgram: null,
  currentIndex: null,
  dataId: null,
  usageData: null,
  backgroundColors: null,
  accessToken: null
}

export const StoreProxy = new Proxy(Store, {
  get(target, p, receiver) {
//    console.log('hi proxy getter');
//    console.log('target', target,'\npara', p, '\nreceiver', receiver);
    return target[p as keyof IStore];
  },
  set(target, property, value, _) {
//    console.log('hi proxy setter');
    try {
      if (target.hasOwnProperty(property)) {
        target[property as keyof IStore] = value;
        if (property === 'currentProgram') {
          window.dispatchEvent(new Event('programchanged'));
        } else if (property === 'currentIndex') {
          window.dispatchEvent(new Event('indexchanged'));
        } else if (property === 'user') {
          window.dispatchEvent(new Event('userchanged'));
        }
      }
    } catch(error) {
      console.error(error);
    }
    return true;
  }
});

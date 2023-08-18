
export const Store = {
  user: null,
  container: null,
  currentSequence: null,
  currentIndex: null
}

export const storeProxy = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;
  }
});

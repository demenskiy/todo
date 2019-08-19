class Store {
  constructor() {
    this.store = localStorage;
  }

  add(key, data) {
    this.store.setItem(key, JSON.stringify(data));
  }

  get(key) {
    return JSON.parse(this.store.getItem(key));
  }

  clear(key) {
    key ? this.store.removeItem(key) : this.store.clear();
  }
}

const store = new Store();

export default store;

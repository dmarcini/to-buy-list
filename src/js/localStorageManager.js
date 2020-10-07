class LocalStorageManager {
  constructor() {
    this.idCounter = 0;
    this.shoppingLists = [];
    this.removedShoppingLists = [];
  }

  static addShoppingList(shoppingList) {
    const localStorageManager = this.getInstance();

    let shoppingLists;

    if (localStorageManager.shoppingLists.length !== 0) {
      shoppingLists = [...localStorageManager.shoppingLists, shoppingList];
    } else {
      shoppingLists = [shoppingList];
    }
    
    localStorageManager.shoppingLists = shoppingLists
    localStorageManager.idCounter += 1;

    localStorage.setItem("shoppingLists", JSON.stringify(localStorageManager));
  }

  static updateShoppingList(shoppingList, id = null) {
    const idListToUpdate = (id === null) ? this.getLastShoppingList().id : id;
    const shoppingLists = this.getShoppingLists();

    shoppingLists[idListToUpdate] = shoppingList;

    localStorage.setItem("shoppingLists", JSON.stringify(shoppingLists));
  }

  static removeShoppingList(id) {
    this.moveShoppingList(id, "shoppingLists", "removedShoppingLists");
  }

  static restoreRemovedShoppingList(id) {
    this.moveShoppingList(id, "removedShoppingLists", "shoppingLists");
  }

  static getLastShoppingList() {
    const listsNumber = this.getShoppingLists().length();

    return this.getShoppingLists()[listsNumber - 1];
  }

  static getShoppingLists() {
    const localStorageManager = this.getInstance();
    const shoppingLists = localStorageManager.shoppingLists;

    return shoppingLists;
  }

  static getRemovedShoppingLists() {
    const localStorageManager = this.getInstance();
    const removedShoppingLists = [...localStorageManager.removedShoppingLists];

    return removedShoppingLists;
  }

  static getIDCounter() {
    return JSON.parse(localStorage.getItem("shoppingLists")).idCounter;
  }

  static getInstance() {
    return JSON.parse(localStorage.getItem("shoppingLists"));
  }

  static moveShoppingList(id, from, to) {
    const localStorageManager = this.getInstance();

    const fromInstance = [...localStorageManager[from]];
    let toInstance = [...localStorageManager[to]];

    const index = fromInstance.findIndex(shoppingList => {
      return shoppingList.id === id;
    });

    if (index === undefined) {
      return;
    }

    if (toInstance === undefined) {
      toInstance = [];
    }

    toInstance.push(fromInstance[index]);
    fromInstance.splice(index, 1);

    toInstance.sort((shoppingList1, shoppingList2) => {
      return shoppingList1.id - shoppingList2.id
    });

    localStorageManager[from] = fromInstance;;
    localStorageManager[to] = toInstance;

    localStorage.setItem("shoppingLists", JSON.stringify(localStorageManager)); 
  }
}

export default LocalStorageManager;

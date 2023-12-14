import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-86dde-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const addButtonEl = document.getElementById("add-button");
const inputFieldEl = document.getElementById("input-field");
const shoppingListEl = document.getElementById("shoppingListEl");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(shoppingListInDB, inputValue);
  clearInputField();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists() === true) {
    let itemsArray = Object.entries(snapshot.val());

    clearItems();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let curerntItemValue = currentItem[1];

      appendItemToShoppingList(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "";
  }
});

function clearItems() {
  shoppingListEl.innerHTML = "";
}

function clearInputField() {
  inputFieldEl.value = "";
}

function appendItemToShoppingList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  const listItems = document.createElement("li");
  listItems.textContent = itemValue.toUpperCase();

  listItems.addEventListener("dblclick", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(listItems);
}

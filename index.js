'use strict';


const store = {
  editing: '',
  items: [
    { id: cuid(), name: 'apples', checked: false },
    { id: cuid(), name: 'oranges', checked: false },
    { id: cuid(), name: 'milk', checked: true },
    { id: cuid(), name: 'bread', checked: false }
  ],
  hideCheckedItems: false
};

const generateItemElement = function (item) {
  let itemTitle = `<span class='shopping-item shopping-item__checked'>${item.name}</span>`;
  if (!item.checked) {
    itemTitle = `
     <span class='shopping-item'>${item.name}</span> 
    `;
  }
  if (item.id === store.editing){
    itemTitle = `<form id="js-shopping-list-edit">
      <label for="shopping-list-entry"></label>
      <input id="new-input-field" type="text" value="${item.name}" name="shopping-list-entry" class="js-shopping-list-entry">
      <button type="submit">Save Edit</button>
    </form>`;
  }
  return `
    <li class='js-item-element' data-item-id='${item.id}'>
    ${itemTitle}
      <div class='shopping-item-controls'>
        <button class='shopping-item-toggle js-item-toggle'>
          <span class='button-label'>check</span>
        </button>
        <button class='shopping-item-delete js-item-delete'>
          <span class='button-label'>delete</span>
        </button>
        <button class='shopping-item-edit js-item-edit'>
        <span class='button-label'>edit</span>
      </button>
      </div>
    </li>`;
};

const handleEditClicks = function () {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleEdit(id);
    render();
  });
};

const toggleEdit = function(id) {
  store.editing = id;
};


const handleNewItems = function () {
  $('.js-shopping-list').on('submit', '#js-shopping-list-edit', event => {
    const id = getItemIdFromElement(event.currentTarget);
    const name = $('#new-input-field').val();
    changeName(id, name);
    render();
  });
};

const changeName = function (id, name) {
  const foundItem = store.items.find(item => item.id === id);
  foundItem.name = name;
  store.editing = '';
}

const addItemToShoppingList = function (itemName) {
  store.items.push({ id: cuid(), name: itemName, checked: false });
};

const handleNewItemSubmit = function () {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    render();
  });
};

const generateShoppingItemsString = function (shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
};

const render = function () {
  let items = [...store.items];
  if (store.hideCheckedItems) {
    items = items.filter(item => !item.checked);
  }

  const shoppingListItemsString = generateShoppingItemsString(items);
  $('.js-shopping-list').html(shoppingListItemsString);
};

const handleEditedItemSubmit = function () {
  $('js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    console.log('test this');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    render();
  });
};




const toggleCheckedForListItem = function (id) {
  const foundItem = store.items.find(item => item.id === id);
  foundItem.checked = !foundItem.checked;
};

const handleItemCheckClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    render();
  });
};



const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

/**
 * Responsible for deleting a list item.
 * @param {string} id 
 */
const deleteListItem = function (id) { 
  const index = store.items.findIndex(item => item.id === id);
  store.items.splice(index, 1);
};

const handleDeleteItemClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const id = getItemIdFromElement(event.currentTarget);
    deleteListItem(id);
    render();
  });
};

const toggleCheckedItemsFilter = function () {
  store.hideCheckedItems = !store.hideCheckedItems;
};

const handleToggleFilterClick = function () {
  $('.js-filter-checked').click(() => {
    toggleCheckedItemsFilter();
    render();
  });
};

const handleShoppingList = function () {
  render();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleFilterClick();
  handleEditClicks();
  handleNewItems();
};

$(handleShoppingList);
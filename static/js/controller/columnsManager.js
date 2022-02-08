import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates, loadAddNewCardButton} from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager, create_card} from "./cardsManager.js";

export let columnsManager = {
    loadColumns: async function (boardId) {
    creatAddNewColumnBtn(boardId)
    const columns = await dataHandler.getColumnsByBoardId(boardId)
    for (let column of columns) {
      const columnBuilder = htmlFactory(htmlTemplates.column);
      const content = columnBuilder(column);
      domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
      domManager.addEventListener(`.delete-column[data-column-id="${column.id}"]`,
        "click", deleteButtonHandler);
      domManager.addEventListener(`.content-button[data-column-id="${column.id}"]`,
          'click', renameColumn);
    }await cardsManager.loadCards(boardId, columns)
      domManager.addChild(`.board[data-board-id="${boardId}"]`, loadAddNewCardButton(boardId));
      document.getElementById('add_card_button_for_board' + boardId).addEventListener('click', () => createNewCard(boardId));
  },
};

const creatAddNewColumnBtn = function(boardId){
  const buttonBuilder = htmlFactory(htmlTemplates.button);
  const content = buttonBuilder(boardId);
  domManager.addChild(`.board-container[id='board${boardId}']`, content);
  domManager.addEventListener(`.create-new-column[data-button-id="${boardId}"]`, "click",
          addNewColumn);
}


async function addNewColumn (clickEvent) {
    const boardId = clickEvent.target.dataset.buttonId;
    for (let i = 0; i < 5; i++) {
        let columnTitle = prompt("Please Provide New Column Title");
        if (columnTitle === '') {
            alert('Provide column name')
        } else {
            await dataHandler.createNewColumn(columnTitle, boardId);
            await prepareTable(boardId);
            await columnsManager.loadColumns(boardId);
            await cardsManager.loadCards(boardId);
            break;
        }
    }
}


async function deleteButtonHandler(clickEvent) {
    const columnId = clickEvent.target.dataset.columnId;
    const boardId = clickEvent.target.dataset.boardId;
    if (confirm('Are you sure you want to delete this column?')) {
        await dataHandler.deleteColumn(columnId);
        await prepareTable(boardId);
        await columnsManager.loadColumns(boardId);
    }
}

async function createNewCard(boardId){
    let new_title = prompt('Enter card title: ', 'card title');
    let columns_name = await columnsNameForTheBoard(boardId);
    let new_column_name = prompt('Enter card column name (' + columns_name + ')' + ': ');
    if (new_title !== null && new_column_name !== null) {
        let response = await fetch("/api/boards/" + boardId.toString() + "/cards/add", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: new_title, column_name: new_column_name}) // ZAMIENIA SŁOWIK NA JSONA
        }); // robi posta na podanego urla
        let card = await response.json();
        console.log(card);
        create_card(card);
    }
}


async function columnsNameForTheBoard(boardId){
    let response = await fetch("/api/columns_name/" + boardId);
    return await response.json();
}

async function prepareTable(boardId) {
    let buttonClear = document.querySelector(`.help_div`);
    buttonClear.innerHTML = "";
    let tablesClear = document.querySelector(`.board[data-board-id="${boardId}"]`);
    tablesClear.innerHTML = "";
}

async function renameColumn(clickEvent) {
    let columnId = clickEvent.target.dataset.columnId;
    let content = document.querySelector(`.board-column[data-column-id="${columnId}"]`);
    content.contentEditable = !content.isContentEditable;
	if (content.contentEditable === 'false') {
		clickEvent.target.innerHTML = 'Edit';
		let title = content.innerHTML
        await dataHandler.renameColumn(columnId, title);
	} else {
		clickEvent.target.innerHTML = 'Save';
	}
}


import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates, loadAddNewCardButton, loadArchivedCardsButton} from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager, create_card} from "./cardsManager.js";


export let columnsManager = {
    loadColumns: async function (boardId) {
    creatAddNewColumnBtn(boardId)
    const columns = await dataHandler.getColumnsByBoardId(boardId)
    injectColumnsHtmlIntoBoard(columns, boardId)
    await cardsManager.loadCards(boardId, columns)
    domManager.addChild(`.board[data-board-id="${boardId}"]`, loadAddNewCardButton(boardId));
    document.getElementById('add_card_button_for_board' + boardId).addEventListener('click', () => createNewCard(boardId));
    domManager.addChild(`.board[data-board-id="${boardId}"]`, loadArchivedCardsButton(boardId));
    document.getElementById('archived_cards_button_for_board' + boardId).addEventListener('click', () => archivedCards(boardId));
  },
};


const injectColumnsHtmlIntoBoard = function (columns, boardId){
    for (let column of columns) {
      const columnBuilder = htmlFactory(htmlTemplates.column);
      const content = columnBuilder(column);
      domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
      domManager.addEventListener(
        `.delete-column[data-column-id="${column.id}"]`,
        "click",
        deleteButtonHandler)
        domManager.addEventListener(`.content-button[data-column-id="${column.id}"]`,
          'click', renameColumn);
    }
}


const creatAddNewColumnBtn = function(boardId){
  const buttonBuilder = htmlFactory(htmlTemplates.button);
  const content = buttonBuilder(boardId);
  domManager.addChild(`.board[data-board-id='${boardId}']`, content);
  domManager.addEventListener(`.create-new-column[data-button-id="${boardId}"]`, "click",
          addNewColumn);
}


async function addNewColumn (clickEvent) {
  const boardId = clickEvent.target.dataset.buttonId;
  let columnTitle = prompt("Please Provide New Column Title");
  await dataHandler.createNewColumn(columnTitle, boardId);
  const [column] = await dataHandler.getNewColumnByTitleAndId(columnTitle, boardId);
  const columnBuilder = htmlFactory(htmlTemplates.column);
  const content = columnBuilder(column);
  domManager.addChild(`.add_card_button`, content, 'beforebegin');
  domManager.addEventListener(`.delete-column[data-column-id="${column.id}"]`,
        "click", deleteButtonHandler)
  domManager.addEventListener(`.content-button[data-column-id="${column.id}"]`,
          'click', renameColumn);
}


async function deleteButtonHandler(clickEvent) {
    const columnId = clickEvent.target.dataset.columnId;
    if (confirm('Are you sure you want to delete this column?')) {
        await dataHandler.deleteColumn(columnId);
        let cleanBoard = document.querySelector(`.board-columns-container[data-column-id="${columnId}"]`);
        cleanBoard.remove();
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
        create_card(card);
    }
}


async function columnsNameForTheBoard(boardId){
    let response = await fetch("/api/columns_name/" + boardId);
    return await response.json();
}


async function archivedCards(boardId){
    // Display all archived cards for the board in modal.
    let response = await fetch("/api/board/" + boardId + "/archived_cards");
    let cards = await response.json();
    let place_for_archived_cards = '';
    for (let card of cards){
        place_for_archived_cards += `<p><input type="checkbox" name="archived_input" value="${card['id']}">` + ' ' + card['title'] + '</p>';
    }
    document.getElementById("all_archived_cards").innerHTML = place_for_archived_cards;
    $('#archived').modal();
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
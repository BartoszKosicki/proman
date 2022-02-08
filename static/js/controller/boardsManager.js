import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates, newBoardModal, newBoardColumn} from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { columnsManager } from "./columnsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        console.debug(boards);
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click", showHideButtonHandler);
            domManager.addEventListener(`.content-button[data-board-id="${board.id}"]`,
                'click', renameBoard);
        }
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    columnsManager.loadColumns(boardId);
    document.getElementById(`board${boardId}`).classList.add('display');
    clickEvent.currentTarget.removeEventListener('click', showHideButtonHandler);
    clickEvent.currentTarget.addEventListener('click', hideBoard);
    clickEvent.currentTarget.innerHTML='Hide Cards';
}


function hideBoard(e) {
    const boardId = e.target.dataset.boardId;
    document.getElementById(`board${boardId}`).classList.remove('display');
    removeColumns();
    document.querySelector('.add_card_button').remove();
    document.querySelector('.create-new-column').remove();
    e.currentTarget.removeEventListener('click', hideBoard);
    e.currentTarget.addEventListener('click', showHideButtonHandler);
    e.currentTarget.innerHTML='Show Cards';
}

const removeColumns= function () {
    const columns = document.querySelectorAll('.board-columns-container')
    for (let column of columns) column.remove()
}

export const addNewBoard = function (){
    document.querySelector('.new-board-button').addEventListener('click', newBoardMenu)
}

async function newBoardMenu (){
    const content = newBoardModal();
    domManager.addChild("#root", content, 'afterend');
    document.querySelector('.new-board-btn-container').classList.add('hidden')
    addEventListenerToCloseModalWinow()
    addEventListenerToRemoveButtons()
    addEventListenerToAddNewColumnButton()
    await submitNewBoard()
}

const addEventListenerToCloseModalWinow = function (){
    document.querySelector('.close-modal-window').addEventListener('click', closeAddNewBoardWindow)
}


const addEventListenerToRemoveButtons = function (){
    const buttons = document.querySelectorAll('.remove-input')
    for (let button of buttons) {
        button.addEventListener('click', ()=>button.parentElement.remove())
    }
}

const addEventListenerToAddNewColumnButton = function () {
    const addNewColumnBtn = document.querySelector('.add-another-new-column');
    addNewColumnBtn.addEventListener('click', addNewColumnToNewBoard)
}

const addNewColumnToNewBoard = function (){
    const newColumnsContainerClass = '.all-new-columns'
    const content = newBoardColumn()
    domManager.addChild(newColumnsContainerClass, content)
}

const submitNewBoard = async function () {
    const newBoard = document.getElementById('new-board-form');
    newBoard.addEventListener('submit', (e) => {
        e.preventDefault()
        const data = {}
        data['userid'] = 1
        data['boardTitle'] = document.getElementById('board-title').value
        data['columns'] = searchingNewColumnsValue()
        data['type'] = document.getElementById('public').checked
        console.debug(data)
        dataHandler.createNewBoard(data)
        alert('You have successfully add new board')
        closeAddNewBoardWindow()
    })
}

const searchingNewColumnsValue = function (){
    const allNewBoardColumnData = document.querySelectorAll('.new-column-name');
    const columnData= {}
    for (let i=0; i<allNewBoardColumnData.length; i++){
        columnData[i+1] = allNewBoardColumnData[i].value
    }
    return columnData
}

const closeAddNewBoardWindow = function (){
    document.getElementById('add-new-board-window').remove()
    document.querySelector('.new-board-btn-container').classList.remove('hidden')
    document.querySelector('.overlay').classList.add('hidden')
}

async function renameBoard(clickEvent) {
    let boardId = clickEvent.target.dataset.boardId;
    let content = document.querySelector(`.board-header[data-board-id="${boardId}"]`);
    content.contentEditable = !content.isContentEditable;
	if (content.contentEditable === 'false') {
		clickEvent.target.innerHTML = 'Edit';
		let title = content.innerHTML
        await dataHandler.renameBoard(boardId, title);
	} else {
		clickEvent.target.innerHTML = 'Save';
	}
}
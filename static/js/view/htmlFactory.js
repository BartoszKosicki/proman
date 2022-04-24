export const htmlTemplates = {
    board: 1,
    card: 2,
    column:3,
    button: 4,
    newBoard: 5
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.newBoard:
            return newBoardModal
        case htmlTemplates.column:
            return columnBuilder
        case htmlTemplates.button:
            return createNewColumnButton
        default:
            console.error("Undefined template: " + template)
            return () => {
                return ""
            }
    }
}

function boardBuilder(board) {
    return `<div class="board-container" id='board${board.id}'>
            <div class="edit-button"><button class="content-button" data-board-id="${board.id}">Edit</button></div>
                <div class="board-header" data-board-id=${board.id}>${board.title}</div>
                <div class="board" data-board-id="${board.id}"></div>    
            </div>
            <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>`;
}

function cardBuilder(card) {
    return `<div class="empty" draggable="false" >
                <div class="card" draggable="true" data-card-id="${card.id}" >${card.title}</div></div>
                <div class="empty" draggable="false" ></div>`;
}

export function newBoardModal() {
    return `    
    <div class="modal-window" id="add-new-board-window">
        <h2 class="modal-window-header">CREATE NEW BOARD</h2>
        <button type="button" class="close-modal-window" title="Cancel submit new board">❌</button>
        <div class="new-board-window">
            <form action="/save_new_board" id="new-board-form" class="new-board-form" method="post">
                <input type="text" class="new-board-title" id="board-title" name="board-title" placeholder="Board name..." required>
                <div class="new-board-menu-text">New columns:</div>
                <div class="all-new-columns">
                    <div class="new-column-input">
                        <input type="text" class="new-column-name" minlength="1" id="column-name-1" name="column-name-1" value="new">
                        <button type="button" class="remove-input" title="Remove this column">✖</button>
                    </div>
                    <div class="new-column-input">
                        <input type="text" class="new-column-name" minlength="1" id="column-name-2" name="column-name-2" value="in progress">
                        <button type="button" class="remove-input" title="Remove this column">✖</button>
                    </div>
                    <div class="new-column-input">
                        <input type="text" class="new-column-name" minlength="1" id="column-name-3" name="column-name-3" value="testing">
                        <button type="button" class="remove-input" title="Remove this column">✖</button>
                    </div>
                    <div class="new-column-input">
                        <input type="text" class="new-column-name" minlength="1" id="column-name-4" name="column-name-4" value="done">
                        <button type="button" class="remove-input" title="Remove this column">✖</button>
                    </div>
                </div>
                <div class="add-another-new-column-div">
                    <button type="button" class="add-another-new-column" title="Add new column">➕</button> 
                </div>
                <div class="radio-form">
                     <div class="radio-form-one-pick">
                        <input class="type-new-board" type="radio" id="public" name="type" value="Public">
                        <label for="public">Public<span class="public-board-expl" title="This board will be visible to everyone">💡</span></label>
                    </div>
                    <div class="radio-form-one-pick">
                        <input class="type-new-board" type="radio" id="private" name="type" value="Private" checked="checked">
                        <label for="private">Private<span class="private-board-expl" title="This board will be visible only to you">💡</span></label>
                    </div>
                 </div>
                <div class="new-board-submit-buttons">
                    <button type="submit" class="submit-new-board">Save</button>
                </div>
            </form>
        </div>
    </div>
    `
}

export function newBoardColumn() {
    return `
<div class="new-column-input">
    <input type="text" class="new-column-name" minLength="1" name="column-name" placeholder="Column name..."">
    <button type="button" class="remove-input">✖</button>
</div>`
}

function columnBuilder(column) {
    return `<div class="board-columns-container" data-column-id="${column.id}">
                <button class="delete-column" data-board-id="${column.board_id}" 
                    data-column-id="${column.id}">Delete column</button>
                <button class="content-button" data-column-id="${column.id}">Edit</button>
                <div class="board-column" data-column-id="${column.id}">${column.title}</div>
           <div class="empty" draggable="false" ><div class="empty" draggable="false" ></div></div></div>`;
}

function createNewColumnButton(boardId) {
    return `<div class="create-column-button">
                <button class="create-new-column" data-button-id="${boardId}">Add New Column</button>
            </div>`;
}

export function loadAddNewCardButton(boardId) {
    return `<div class="add_card_button"><button id='add_card_button_for_board${boardId}'>Add new card</button></div>`
}

export function loadArchivedCardsButton(boardId) {
    return `<div class="archived_cards_button"><button id='archived_cards_button_for_board${boardId}'>Archived cards</button></div>`
}

export function deleteBoard(boardId) {
    return `<div class="delete_board_button"><button id='delete_board_${boardId}'>Delete board</button></div>`
}

export function loadEditButtonForCard(cardId) {
    return `<button class="card_button" id='edit_title_for_card${cardId}'>🗒️</button></div>`
}

export function loadDeleteButtonForCard(cardId) {
    return `<button class="card_button" id='delete_card${cardId}'>🗑️</button></div>`
}

export function loadArchiveButtonForCard(cardId) {
    return `<button class="card_button" id='archive_card${cardId}'>⏳</button></div>`
}

export function addRefreshButton(boardId) {
    return `<div class="refresh-button" data-board-id=${boardId}>🔁</div>`
}


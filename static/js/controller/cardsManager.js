import { dataHandler } from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates, loadDeleteButtonForCard, loadEditButtonForCard, loadArchiveButtonForCard} from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import {drop} from './dragAndDrop.js'

export let cardsManager = {
    loadCards: async function (boardId, columns) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        const cardsList = createSortedCardList(columns, cards);
        injectCardsToHTML(columns, cardsList);
        await drop()
    },
};

const createSortedCardList = function (columns, cards){
    const cardsList = []
    for (const column of columns) {
        let temporaryList = cards.filter(card => card.columns_id === column.id);
        cardsList.push(temporaryList.sort(SortCards));
    }
    return cardsList
}

export function create_card(card) {
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const content = cardBuilder(card);
    domManager.addChild(`.board-column[data-column-id="${card.columns_id}"]`, content, 'afterend');
    domManager.addChild(`.card[data-card-id="${card.id}"]`, loadEditButtonForCard(card.id));
    document.getElementById('edit_title_for_card' + card.id).addEventListener('click', () => editCardTitle(card));
    domManager.addChild(`.card[data-card-id="${card.id}"]`, loadDeleteButtonForCard(card.id));
    document.getElementById('delete_card' + card.id).addEventListener('click', () => deleteCard(card));
    domManager.addChild(`.card[data-card-id="${card.id}"]`, loadArchiveButtonForCard(card.id));
    document.getElementById('archive_card' + card.id).addEventListener('click', () => archiveCard(card));
}

const injectCardsToHTML = function (columns, cardsList) {
    for (let cards of cardsList) {
        for (let card of cards) {
            create_card(card);
        }
    }
}

function SortCards(card1, card2) {
    return card1.card_order < card2.card_order ? 1 : -1;
}

async function editCardTitle(card) {
    let old_title = card.title;
    let new_title = prompt('Enter new card title: ', card.title);
    if (new_title !== null) {
        await fetch("/api/cards/" + (card.id).toString() + "/edit", {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: new_title}) // ZAMIENIA SŁOWIK NA JSONA
        }); // robi puta na podanego urla
        let edited_card = document.querySelector(`.card[data-card-id="${card.id}"]`);
    edited_card.innerHTML = edited_card.innerHTML.replace(old_title, new_title);
    document.getElementById('edit_title_for_card' + card.id).addEventListener('click', () => editCardTitle(card));
    document.getElementById('delete_card' + card.id).addEventListener('click', () => deleteCard(card));
    document.getElementById('archive_card' + card.id).addEventListener('click', () => archiveCard(card));
    card.title = new_title;
    }
}

async function deleteCard(card) {
    if (confirm("Do you want to delete the card?") === true) {
        await fetch("/api/cards/" + card.id.toString() + "/delete", {
            method: 'DELETE',
        }); // robi DELETE na podanego urla
        let deleted_card = document.querySelector(`.card[data-card-id="${card.id}"]`);
        deleted_card.parentElement.removeChild(deleted_card); // szukanie rodzica i usuwanie jego dziecka
    }
}

async function archiveCard(card) {
    if (confirm("Do you want to archive the card?") === true) {
        await fetch("/api/card/" + card.id.toString() + "/archive", {
            method: 'PUT',
        }); // robi puta na podanego urla
        let archived_card = document.querySelector(`.card[data-card-id="${card.id}"]`);
        archived_card.parentElement.removeChild(archived_card); // szukanie rodzica i usuwanie jego dziecka
    }
}

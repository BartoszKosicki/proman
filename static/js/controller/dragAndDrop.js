import {dataHandler} from "../data/dataHandler.js";


const div = {card1: null}
export async function drop(){
const cards = document.querySelectorAll('.card');
const empties = document.querySelectorAll('.empty');

cards.forEach((card) => {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd)
});

empties.forEach((empty) => {
    empty.addEventListener('dragover', dragOver);
    empty.addEventListener('drop', dragDrop)
});
}

let dragable = null;
let cardId1 = 0

function dragStart(e) {
    drop()
    div.card1 = e.currentTarget
    let cardIdi = div.card1.getAttribute('data-card-id')
    cardId1 = cardIdi
    dragable = this;
}

function dragEnd() {
    dragable = null;
}

function dragOver(e) {
    e.preventDefault();
}

async function dragDrop(e) {
    let cardId = e.currentTarget
    let columnId = cardId.parentElement.getAttribute('data-column-id')
    console.log(columnId, cardId.parentElement)
    cardId.insertAdjacentElement("afterbegin", div.card1)
    let addDiv = document.createElement('div')
    addDiv.className = 'empty'
    cardId.insertAdjacentElement('afterend', addDiv)
    console.log(cardId1, columnId)
    await dataHandler.changeColumn(cardId1, columnId)
    await orderLIst()
}

async function orderLIst() {
    let a = 0
    let divs = document.getElementsByClassName('card')
    let cardsList = []
    for (a; a < divs.length; a++) {
        cardsList.push(divs[a].getAttribute('data-card-id'))
        console.log(cardsList)
    }
    await dataHandler.cardOrderList(cardsList)
}

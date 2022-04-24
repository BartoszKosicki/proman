import {create_card} from "./controller/cardsManager.js";
window.restoreCards = restoreAllCards; // przypisanie funkcji restoreCards z html do funkcji restoreAllCards z js


async function restoreAllCards() {
    let selected = document.querySelectorAll("input[name=archived_input]:checked"); // wyciągamy wszystkie inputy mające atrybut name
    // z wartością archived_input oraz sprawdzamy czy jest on zaznaczony, zwraca listę zaznaczonych checkbox
    for (let archived of selected){
        let card = await unArchivedCard(archived.value);
       create_card(card);
    }
    $('#archived').modal('hide'); // zamykanie modala
}


async function unArchivedCard(cardId) {
    let response = await fetch("/api/card/" + cardId + "/unarchive",{
        method: 'PUT'
    });
    return await response.json();
}
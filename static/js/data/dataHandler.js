export let dataHandler = {
  getBoards: async function () {
    const response = await apiGet("/api/boards");
    return response;
  },
  getPrivateBoard: async function (user_id){
      const response = await apiGet(`/api/boards/${user_id}`);
      return response;
    },

  getColumnsByBoardId: async function (boardId) {
    const response = await apiGet(`/api/columns/${boardId}`);
    return response;  },

  getCardsByBoardId: async function (boardId) {
    const response = await apiGet(`/api/boards/${boardId}/cards/`);
    return response;
  },

  getCard: async function (cardId) {
    // the card is retrieved and then the callback function is called with the card
  },
    
  createNewColumn: async function (columnTitle, boardId) {
    let payload = {'title': columnTitle};
    const response = await apiPost(`/api/columns/${boardId}/add`, payload);
    return response;
  },
    
  deleteColumn: async function (columnId) {
    const response = await apiDelete(`/api/columns/${columnId}/delete`);
    return response;
  },
    
  createNewCard: async function (cardTitle, boardId, statusId) {
      // creates new card, saves it and calls the callback function with its data
  },

  createNewBoard: async function (data) {
    const response = await apiPost(`/save_new_board`, data);
    return response;
  },

changeColumn: async function (cardId, columnId) {
    const data = {
      'card_id': cardId,
      'column_id': columnId
    };
  const response = await apiPut(`/api/cards/${cardId}/change-column`, data);
  return response;
}
};

async function apiGet(url) {
  let response = await fetch(url, {
    method: "GET",
  });
  if (response.status === 200) {
    let data = response.json();
    return data;
  }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  });
  if (response.status === 200) {
    let data = response.json();
    return data;
  }
}

async function apiDelete(url) {
    let response = await fetch(url, {
        method: "DELETE",
    });
    if (response.status === 200) {
        let data = response.json();
        return data;
    }
}

async function apiPut(url, data) {
    let response = await fetch(url, {
        method: "PUT",
        headers: {
      'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if (response.status === 200) {
        await response.json();
        console.log("PUT sent successfully")
    }
}
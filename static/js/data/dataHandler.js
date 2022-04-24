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

  createNewColumn: async function (columnTitle, boardId) {
    let payload = {'title': columnTitle};
    const response = await apiPost(`/api/columns/${boardId}/add`, payload);
    return response;
  },

  cardOrderList: async function (cardList) {
    const lists = {
        'cardList': cardList
    };
    const response = await apiPost(`/api/get-order-list`, lists);
    return response;
  },


  deleteColumn: async function (columnId) {
    const response = await apiDelete(`/api/columns/${columnId}/delete`);
    return response;
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
},
renameColumn: async function (columnId, title) {
    let data = {'title': title};
    const response = await apiPut(`/api/columns/${columnId}/rename`, data);
    return response;
  },

  renameBoard: async function (boardId, title) {
    let data = {'title': title};
    const response = await apiPut(`/api/boards/${boardId}/rename`, data);
    return response;
  },

  getNewColumnByTitleAndId: async function (columnTitle, boardId) {
    const response = await apiGet(`/api/column/${columnTitle}/${boardId}`);
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

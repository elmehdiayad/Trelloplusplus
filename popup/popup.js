Trello.setToken(localStorage.getItem("trello_token"));

var cardStorage = {
  fetchAll: function () {
    var cards = JSON.parse(localStorage.getItem("all_cards") || "[]");
    return cards;
  },
  fetch: function () {
    var cards = JSON.parse(localStorage.getItem("filtred_cards") || "[]");
    return cards;
  },
  saveAll: function (cards) {
    localStorage.setItem("all_cards", JSON.stringify(cards));
  },
  save: function (cards) {
    localStorage.setItem("filtred_cards", JSON.stringify(cards));
  },
};
var boardStorage = {
  fetch: function () {
    var boards = JSON.parse(localStorage.getItem("all_boards") || "[]");
    return boards;
  },
  save: function (boards) {
    localStorage.setItem("all_boards", JSON.stringify(boards));
  },
};

var listStorage = {
  fetchAll: function () {
    var lists = JSON.parse(localStorage.getItem("all_lists") || "[]");
    return lists;
  },
  fetchFiltred: function () {
    var lists = JSON.parse(localStorage.getItem("filtred_lists") || "[]");
    return lists;
  },
  fetchDestination: function () {
    var lists = JSON.parse(localStorage.getItem("destination_lists") || "[]");
    return lists;
  },
  saveAll: function (lists) {
    localStorage.setItem("all_lists", JSON.stringify(lists));
  },
  saveFiltred: function (lists) {
    localStorage.setItem("filtred_lists", JSON.stringify(lists));
  },
  saveDestination: function (lists) {
    localStorage.setItem("destination_lists", JSON.stringify(lists));
  },
};

new Vue({
  el: "#trelloplusplus",
  vuetify: new Vuetify(),
  data: {
    username: localStorage.getItem("username"),
    logged: localStorage.trello_token,
    selectedBoard: localStorage.getItem("selected_board") || "",
    selectedList: localStorage.getItem("selected_list") || "",
    cards: cardStorage.fetchAll(),
    filtredCards: cardStorage.fetch(),
    boards: boardStorage.fetch(),
    lists: listStorage.fetchAll(),
    filtredLists: listStorage.fetchFiltred(),
    destinationLists: listStorage.fetchDestination(),
    destinationList: "",
    movedCardId: "",
    fetching: false,
    undoing: false,
  },
  watch: {
    filtredCards: {
      handler: function (cards) {
        cardStorage.save(cards);
      },
      deep: true,
    },
    cards: {
      handler: function (cards) {
        cardStorage.saveAll(cards);
      },
      deep: true,
    },
    boards: {
      handler: function (boards) {
        boardStorage.save(boards);
      },
      deep: true,
    },
    selectedBoard: {
      handler: function (selectedBoard) {
        localStorage.setItem("selected_board", selectedBoard);
      },
    },
    selectedList: {
      handler: function (selectedList) {
        localStorage.setItem("selected_list", selectedList);
      },
    },
    lists: {
      handler: function (lists) {
        listStorage.saveAll(lists);
      },
      deep: true,
    },
    filtredLists: {
      handler: function (lists) {
        listStorage.saveFiltred(lists);
      },
      deep: true,
    },
    destinationLists: {
      handler: function (lists) {
        listStorage.saveDestination(lists);
      },
      deep: true,
    },
  },

  methods: {
    fetch: function () {
      this.fetching = true;
      new Promise((resolve) => {
        Trello.get("members/me/boards?lists=all", function (boards) {
          resolve(boards);
        });
      }).then((boards) => {
        this.boards = boards;
        let listIds = this.filtredLists.map((list) => list.id);
        this.filtredLists = this.filtredLists.concat(
          this.lists.filter(
            (list) =>
              list.id === this.destinationList &&
              listIds.indexOf(this.destinationList) === -1
          )
        );
        this.destinationList = "";
        new Promise((resolve) => {
          Trello.get("members/me/cards", function (cards) {
            resolve(cards);
          });
        }).then((cards) => {
          console.log(cards);
          this.filtredCards = cards.filter(
            (card) => card.idList === this.selectedList
          );
          this.cards = cards;
          this.fetching = false;
        });
      });
    },
    filterByBoardId: function (boardId) {
      this.selectedBoard = boardId;
      this.filtredCards = this.cards.filter((card) => card.idBoard === boardId);
      let cardListIds = this.filtredCards.map((card) => card.idList);
      this.lists = this.boards.filter((board) => board.id === boardId)[0].lists;
      this.filtredLists = this.lists
        .filter((list) => list.idBoard == boardId)
        .filter(
          (list) =>
            cardListIds.includes(
              list.id
            ) /* && !list.name.toLowerCase().includes("done")*/
        );
      this.selectedList = "";
    },
    filterByListId: function (listId) {
      this.selectedList = listId;
      this.filtredCards = this.cards.filter((card) => card.idList === listId);
      this.destinationLists = this.lists.filter((list) => list.id !== listId);
    },
    move: function (cardId, listId) {
      this.movedCardId = cardId;
      new Promise((resolve) => {
        Trello.put("cards/" + cardId + "?idList=" + listId);
        resolve(true);
      }).then((done) => {
        this.fetch();
        this.undoing = done;
      });
    },
    undo: function () {
      this.undoing = false;
      Trello.put("cards/" + this.movedCardId + "?idList=" + this.selectedList);
      this.fetch();
    },
  },
});

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

new Vue({
  el: "#trelloplusplus",
  vuetify: new Vuetify(),
  data: {
    username: localStorage.getItem("username"),
    selectedBoard: localStorage.getItem("selected_board") || "",
    cards: cardStorage.fetchAll(),
    filtredCards: cardStorage.fetch(),
    boards: boardStorage.fetch(),
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
  },

  methods: {
    fetch: function () {
      new Promise((resolve) => {
        Trello.get("members/me/boards", function (boards) {
          resolve(boards);
        });
      }).then((boards) => {
        this.boards = boards;
        new Promise((resolve) => {
          Trello.get("members/me/cards", function (cards) {
            resolve(cards);
          });
        }).then((cards) => {
          this.filtredCards = cards.filter(
            (card) => card.idBoard === this.selectedBoard
          );
          this.cards = cards;
        });
      });
    },
    filterByBoardId: function (boardId) {
      this.filtredCards = this.cards.filter((card) => card.idBoard === boardId);
      this.selectedBoard = boardId;
    },
    move: function (card) {
      console.log(card.name);
    },
    copie: function (card) {},
  },
});

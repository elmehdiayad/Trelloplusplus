if (HashSearch.keyExists("token")) {
  Trello.authorize({
    name: "Trello++",
    expiration: "never",
    interactive: false,
    scope: { read: true, write: true },
    success: () => {
      chrome.extension.sendMessage(
        {
          command: "saveToken",
          token: localStorage.getItem("trello_token"),
        },
        () => {
          Trello.setToken(localStorage.getItem("trello_token"));
          new Promise((resolve) => {
            Trello.members.get("me", function (member) {
              resolve(member);
            });
          }).then((member) => {
            localStorage.setItem("username", member.fullName);
            new Promise((resolve) => {
              Trello.get("members/me/boards?lists=all", function (boards) {
                resolve(boards);
              });
            }).then((boards) => {
              localStorage.setItem("all_boards", JSON.stringify(boards));
              new Promise((resolve) => {
                Trello.get("members/me/cards", function (cards) {
                  resolve(cards);
                });
              }).then((cards) => {
                localStorage.setItem("all_cards", JSON.stringify(cards));
                chrome.tabs.getCurrent(function (tab) {
                  chrome.tabs.remove(tab.id);
                });
              });
            });
          });
        }
      );
    },
    error: function () {
      alert("Failed to authorize with Trello.");
    },
  });
}

new Vue({
  el: "#trelloplusplus-options",
  vuetify: new Vuetify(),
  data: {
    logged: localStorage.trello_token,
    icons: ["mdi-linkedin"],
  },
  methods: {
    authorize: function () {
      Trello.authorize({
        name: "Trello++",
        type: "redirect",
        expiration: "never",
        interactive: true,
        scope: { read: true, write: true },
        success: function () {
          this.logged = true;
        },
        error: function () {
          alert("Failed to authorize with Trello.");
        },
      });
    },
    deauthorize: function () {
      Trello.deauthorize();
      localStorage.clear();
      location.reload();
    },
  },
});

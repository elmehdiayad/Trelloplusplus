function init() {
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

  var lin = $("#authorize");
  var lout = $("#deauthorize");

  $("#authorize-button").click(function () {
    Trello.authorize({
      name: "Trello++",
      type: "redirect",
      expiration: "never",
      interactive: true,
      scope: { read: true, write: true },
      success: function () {
      },
      error: function () {
        alert("Failed to authorize with Trello.");
      },
    });
  });

  $("#deauthorize-button").click(function () {
    Trello.deauthorize();
    localStorage.clear();
    location.reload();
  });

  if (!localStorage.trello_token) {
    $(lin).show();
    $(lout).hide();
  } else {
    $(lin).hide();
    $(lout).show();
  }
}
$(document).ready(init);

function init() {
  if (HashSearch.keyExists("token")) {
    Trello.authorize({
      name: "Trello++",
      expiration: "never",
      interactive: false,
      scope: { read: true, write: false },
      success: () => {
        chrome.extension.sendMessage(
          {
            command: "saveToken",
            token: localStorage.getItem("trello_token"),
          },
          () => {
            chrome.tabs.getCurrent(function (tab) {
              chrome.tabs.remove(tab.id);
            });
          }
        );
      },
      error: function () {
        alert("Failed to authorize with Trello.");
      },
    });
  }
  // Message and button containers
  var lin = $("#authorize");
  var lout = $("#deauthorize");

  // Log in button
  $("#authorize-button").click(function () {
    Trello.authorize({
      name: "Trello++",
      type: "redirect",
      expiration: "never",
      interactive: true,
      scope: { read: true, write: false },
      success: function () {
        // Can't do nothing, we've left the page
      },
      error: function () {
        alert("Failed to authorize with Trello.");
      },
    });
  });

  // Log out button
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

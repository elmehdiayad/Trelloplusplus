function init() {
  if (HashSearch.keyExists("token")) {
    Trello.authorize({
      name: "TreDev",
      expiration: "never",
      interactive: false,
      scope: { read: true, write: false },
      success: function () {},
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
      name: "TreDev",
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

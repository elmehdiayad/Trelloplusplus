Trello.setToken(localStorage.getItem("trello_token"));

const promiseMember = new Promise((resolve, reject) => {
  Trello.members.get("me", function (member) {
    resolve(member);
  });
});

const promiseCards = new Promise((resolve, reject) => {
  Trello.get("members/me/cards", function (cards) {
    resolve(cards);
  });
});

document.getElementById("fetch").onclick = () => {
  $("#output").empty();
  promiseMember.then((member) =>
    localStorage.setItem("username", member.fullName)
  );
  promiseCards.then((cards) =>
    localStorage.setItem("all_cards", JSON.stringify(cards))
  );
};


$("#fullName").text(localStorage.getItem("username"));
let cards = JSON.parse(localStorage.getItem("all_cards"));
$.each(cards, function (ix, card) {
  $("<a>").addClass("card").text(card.name).appendTo("#output");
});

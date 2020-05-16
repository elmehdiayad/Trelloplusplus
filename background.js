chrome.runtime.onInstalled.addListener(function () {
  //localStorage.clear();
  chrome.tabs.create({
    url: chrome.extension.getURL("options/options.html"),
  });
});

chrome.extension.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (!request.command && !localStorage.getItem("trello_token")) {
    chrome.tabs.create({
      url: chrome.extension.getURL("options/options.html"),
    });
    sendResponse();
    return true;
  } else if (request.command == "saveToken") {
    localStorage.setItem("trello_token", request.token);
    sendResponse();
    return true;
  }
});

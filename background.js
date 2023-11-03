chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  console.log(changeInfo)

  if (tab.url && tab.url.includes("reddit.com")) {
    console.log("it's reddit, getting cookie")
    chrome.cookies.get({ url: 'https://mod.reddit.com', name: 'token' },
    function (cookie) {
      if (cookie) {
        var newCookie = cookie.value.replace(/[^A-Za-z0-9+/].*?$/, '');
        var tokenData = atob(newCookie);

        var finalCookie = JSON.parse(tokenData);

        var token = finalCookie.accessToken

        chrome.tabs.sendMessage(tabId, {token: token});
      }
  });
  }
});

console.log("Add note listener")

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  console.log("got message")
  console.log(request.type )

  if (request.type == "note") {
    var endpoint = request.options.endpoint
    var comment_id = request.options.comment_id
    var subreddit = request.options.subreddit
    var username = request.options.username
    var modh = request.options.modh
    var oauthToken = request.options.oauthToken

    var body = new URLSearchParams({
      'reddit_id': comment_id,
      'label': "ABUSE_WARNING",
      'subreddit': subreddit,
      'user': username,
      'note': "R1",
      'uh': modh,
    })

    fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {"Authorization": "bearer " + oauthToken},
      body,
    }).then(response => {
        return response.json();
    }).catch(error => {
        console.warn(error);
    }); 
    sendResponse();
  }
  else { (request.type == "comment")
    var endpoint = request.options.endpoint
    var comment_id = request.options.comment_id
    var message = request.options.message
    var oauthToken = request.options.oauthToken

    var body = JSON.stringify({
      'item_id': [comment_id],
      'lock_comment': false,
      'message': message,
      'title': "1-click removal",
      'type': "public_as_subreddit"
    })

    fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {"Authorization": "bearer " + oauthToken},
      body,
    }).then(response => {
        return response.json();
    }).catch(error => {
        console.warn(error);
    }); 

  sendResponse();
  }
});
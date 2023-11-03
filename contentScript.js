
var oauthToken = "";

var removalMessage = `Your comment has been removed because it violates rule 1: [Be Civil](https://www.reddit.com/r/AmItheAsshole/about/rules/). Further incidents may result in a ban.

["Why do I have to be civil in a sub about assholes?"](https://www.reddit.com/r/AmItheAsshole/wiki/faq)

**[Message the mods](https://www.reddit.com/message/compose?to=/r/AmItheAsshole) if you have any questions or concerns.**`

function flagInsertedElement(event) {
  var el=event.target;
  var buttons;
  try {
    buttons = el.querySelector('.big-mod-buttons');
  }
  catch
  {
    return
  }
  
  var subreddit = el.getAttribute("data-subreddit")
  var thingType = el.getAttribute("data-type")
  

  if (thingType == "comment" && subreddit.toLowerCase() == "amitheasshole" && buttons && oauthToken != "") {

    var removed
    let btnlist = buttons.childNodes[0].children 
    // [ a.pretty-button.access-required.negative.pressed, a.pretty-button.access-required.neutral, a.pretty-button.access-required.positive ]

    // Create cloned removal btn 
    var clonedBtn = document.createElement("button");
    clonedBtn.innerHTML = 'RULE 1';
    clonedBtn.className = 'pretty-button access-required';
    clonedBtn.style.background = '#c494ff';
    clonedBtn['data-event-action'] = null;
    clonedBtn.addEventListener('click', () => {

        if (removed) {return}

        removed = true

        var thing_id = el.getAttribute("data-fullname")
        var author = el.getAttribute("data-author")
        var subreddit = el.getAttribute("data-subreddit")

        clonedBtn.style.background = '#904346';
        clonedBtn.style.color = 'white';

        el.style.background = 'lightgray'

        tripleActions(thing_id,subreddit,author);
    });

    buttons.childNodes[0].appendChild(clonedBtn) 
  }
  
}


async function tripleActions(thing_id,subreddit,author) {

  const uh = getModhash();

  remove(thing_id,uh);
  APIcallsReason('https://oauth.reddit.com/api/v1/modactions/removal_comment_message', thing_id);
  APIcallsNote('https://oauth.reddit.com/api/mod/notes', thing_id,subreddit,author,uh);

}

function getModhash() {
  const uh = document.querySelector("[name=uh]")?.value;
  if (!uh) { return false; }
  return uh;
}

function comment(removalText, comment_id, modh) {
  return APIcalls('/api/comment', new URLSearchParams({
      'thing_id': comment_id,
      'text': removalText,
      'uh': modh,
  }));
}

function distinguish(comment_id, modh) {
  return APIcalls('/api/distinguish', new URLSearchParams({
      'id': comment_id,
      'how': 'yes',
      'uh': modh,
  }));
}

function lock(comment_id, modh) {
  APIcalls('/api/lock', new URLSearchParams({
      'id': comment_id,
      'uh': modh,
  }));
}

function remove(comment_id, modh) {
  APIcalls('/api/remove', new URLSearchParams({
      'id': comment_id,
      'spam': false,
      'uh': modh,
  }));
}

function APIcalls(endpoint, body) {
  return fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      body,
  }).then(response => {
      return response.json();
  }).catch(error => {
      console.warn(error);
  }); 
}

function APIcallsNote(endpoint, comment_id, subreddit, username, modh) {

  chrome.runtime.sendMessage({type: "note", options: { 
    type: "note", 
    endpoint: endpoint,
    comment_id: comment_id,
    username: username,
    subreddit: subreddit,
    modh: modh,
    oauthToken: oauthToken
  }});
}

function APIcallsReason(endpoint, comment_id) {

  chrome.runtime.sendMessage({type: "comment", options: { 
    type: "comment", 
    endpoint: endpoint,
    comment_id: comment_id,
    message: removalMessage,
    oauthToken: oauthToken
  }});
}



document.addEventListener('DOMNodeInserted', flagInsertedElement, false);

chrome.runtime.onMessage.addListener(function(message) {
  var newToken = message.token;

  oauthToken = newToken

  console.log("got new token")

})();
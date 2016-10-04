let likers = [];

window.fbAsyncInit = function() {
  FB.init({
    appId      : '560134897527816',
    xfbml      : true,
    version    : 'v2.6'
  });
  checkLoginState();

};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));



function loadpage(likes) {
    const repeatCount = Math.round(Math.max(100/likes.length, 2));
    for (var i=0; i < repeatCount + 1; i++) {
        for (var j=0; j<likes.length; j++) {
            var li = document.createElement("li");
            li.innerHTML = '<div class="fb-reaction fb-'+likes[j].type+'"></div>' + ' ' + likes[j].name;
            document.getElementsByTagName("ul")[0].appendChild(li);
        }
    }

    setTimeout(() => bingo(likes, repeatCount), 1000);
}

const elementHeight = 70;
function bingo(likes, repeatCount) {
    let arr = new Uint16Array(2);
    crypto.getRandomValues(arr);
    let [personIndex, repeatIndex] = arr;
    personIndex %= likes.length;
    repeatIndex = repeatIndex % (repeatCount/2) + repeatCount/2;

    console.log("Likes: " + likes.length,
        "Total: " + (likes.length*repeatIndex),
        "Repeat count " + repeatCount);

    const winnerIndex = personIndex+repeatIndex*likes.length;
    console.log("repeatIndex", repeatIndex, "winnerIndex", winnerIndex);
    let winnerName = document.getElementsByTagName("li")[winnerIndex].innerText;

    document.getElementsByTagName("ul")[0].style.transform = "translateY(" + (-(winnerIndex-3)*elementHeight) + "px)"
    document.getElementById("winner").innerHTML = winnerName;

    setTimeout(function() {
        document.getElementsByTagName("li")[winnerIndex].setAttribute("class", "winner");
    }, 10000);
    
    setTimeout(function() {
        document.getElementById("popup").style.display = "block";
        document.body.style.color = "rgba(0, 0, 0, 0.2)";
    }, 11000);
}

function getParam(paramName) {
    let paramStrings = window.location.search.substr(1).split('&')
    let paramMap = paramStrings.reduce((acc, item) => {
        let [k,v] = item.split('=');
        acc[k] = v;
        return acc;
    }, {})
    return paramMap[paramName];
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    if (response.status === "connected") {
      console.log('I am the login');  
      document.getElementById('fb-login-button').style.display = 'none';
      accessToken = response.authResponse.accessToken;

      let fb_image_id = getParam('photo_id');
      FB.api(
          `/${fb_image_id}/reactions`,
          function (response) {
            console.log(response)
            if (response && !response.error) {
              let next = response.paging.next;
              if (next) {
                likers = response.data;
                fetchRecursive(next, likers).then(bloops => {
                  console.log('this is the recursive', bloops);
                  loadpage(bloops);
                });
              } else {
                loadpage(response.data);
              }
              console.log('success');
            }
          }
      );

    } else {
      console.log('You are the fail');
    }
  });

  function fetchRecursive(next, likers = []) {
    return fetch(next, {
                credentials: 'same-origin'
              })
              .then(resp => resp.json())
              .then(data => {
                console.log(data);
                likers.push(...data.data);
                next = data.paging.next;

                if (next) {
                  return fetchRecursive(next, likers);
                } else {
                  return likers;
                }
              })
  }

}
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
    for (var i=0; i<10; i++) {
        for (var j=0; j<likes.length; j++) {
            var li = document.createElement("li");
            li.innerHTML = '<div class="fb-reaction fb-'+likes[j].type+'"></div>' + ' ' + likes[j].name;
            document.getElementsByTagName("ul")[0].appendChild(li);
        }
    }

    setTimeout(() => bingo(likes), 1000);
}

function bingo(likes) {
    var min = likes.length*5 - 3;
    var max = likes.length*4 - 1;
    console.log("Likes: " + likes.length + ", Min: " + (min+3) + ", Max: " + (min+max+3) + ", Total: " + (likes.length*10));

    var random = Math.round(Math.random()*max + min);
    var winner = random+3;
    var winnerName = document.getElementsByTagName("li")[winner].innerText;

    console.log("Random: " + winner + " (" + (winner % likes.length) + ")");
    console.log("Winner: " + winnerName);
    
    document.getElementsByTagName("ul")[0].style.top = (-random*70) + "px";
    document.getElementById("winner").innerHTML = winnerName;

    setTimeout(function() {
        document.getElementsByTagName("li")[winner].setAttribute("class", "winner");
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
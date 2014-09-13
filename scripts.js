function loadpage() {
    for (var i=0; i<10; i++) {
        for (var j=0; j<likes.length; j++) {
            var li = document.createElement("li");
            li.innerHTML = likes[j];
            document.getElementsByTagName("ul")[0].appendChild(li);
        }
    }

    setTimeout(bingo, 2000);
}

function bingo() {
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

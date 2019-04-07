var currUser;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currUser = user.uid;
        $("#name").text(user.displayName);
        console.log(user.displayName);
    }
});
var usersRef = firebase.database().ref('users');
var postsRef = firebase.database().ref('posts');
console.log(postsRef.key);

$("#tabPosted").click(function(e){
  postedDisplay();
});

$("#tabSent").click(function(e){
  sentDisplay();
});

$("#tabReceived").click(function(e){
  requestDisplay();
});

// Sets which tab to display
function postedDisplay(){
  $("#tradeBox").css("display", "block");
  $("#sentBox").css("display", "none");
  $("#receivedBox").css("display", "none");
}
function sentDisplay(){
  $("#tradeBox").css("display", "none");
  $("#sentBox").css("display", "block");
  $("#receivedBox").css("display", "none");
}
function requestDisplay() {
  $("#tradeBox").css("display", "none");
  $("#sentBox").css("display", "none");
  $("#receivedBox").css("display", "block");
}


//Sign out
$("#loginButton").click(function(){
    firebase.auth().signOut().then(function() {
        location.replace("market.html");
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });
});

var currUser;
// Gets the posts that belong to the current user
// Gets the posts that the user has sent offers for
// Gets the posts that the user has received offers for
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      currUser = user.uid;
      var currUserPostsRef = firebase.database().ref("users/" + user.uid + "/posts");
      currUserPostsRef.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
          displayPost(childSnapshot.key, "tradeBox");
        });
      });
      var currUseSentRef = firebase.database().ref("users/" + user.uid + "/offersSent");
      currUseSentRef.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
          displayPost(childSnapshot.key, "sentBox");
        });
      });
      var currUserReceivedRef = firebase.database().ref("users/" + user.uid + "/offersReceived");
      currUserReceivedRef.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
          displayPost(childSnapshot.key, "receivedBox");
        });
      });
    }
});

// Displays the post with the ID.
function displayPost(uniquePostID, htmlID){
  var currentPostRef = firebase.database().ref("posts/" + uniquePostID);
  currentPostRef.once("value", function(snapshot){
    var obj = snapshot.val();
    var stringify = JSON.stringify(obj);
    var parse = JSON.parse(stringify);
    addPostToPageListing(htmlID, snapshot.key, parse.itemName, parse.category, parse.description,
    parse.date, parse.email, parse.postedBy, parse.status, parse.imageLocation);
  });
}

/* Overriding */
function available(){};
function notCurrUserPost(){};
function swapButton(key){
  deleteButton(key);
}
function deleteButton(key){
  firebase.database().ref("posts/" + key).remove();
  firebase.database().ref("users/" + currUser + "/posts/" + key).remove();
  alert("Your post has been deleted!");
}
function setButtonProperty(text, button){
  button.innerHTML = "Delete";
  $(button).css("background-color", "red");
}
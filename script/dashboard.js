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
var currTab = 0;
$("#tabPosted").click(function(e){
  postedDisplay();
  currTab = 0;
});

$("#tabSent").click(function(e){
  sentDisplay();
  currTab = 1;
});

$("#tabReceived").click(function(e){
  requestDisplay();
  currTab = 2;
});


// Sets which tab to display
function postedDisplay(){
  $("#tradeBox").css("display", "block");
  $("#sentBox").css("display", "none");
  $("#receivedBox").css("display", "none");
  setButtnProperty("Delete", ".sendOfferButton", "red");
  var button = document.getElementsByClassName("sendOfferButton");
  var button2 = document.getElementsByClassName("sendOfferButton2");
  $(button2).css("display", "none");
  $(".statusLabel").css("display", "none");  
}
function sentDisplay(){
  $("#tradeBox").css("display", "none");
  $("#sentBox").css("display", "block");
  $("#receivedBox").css("display", "none");  

  var button = document.getElementsByClassName("sendOfferButton");
  var button2 = document.getElementsByClassName("sendOfferButton2");
  $(button).css("display", "none"); 
  $(button2).css("display", "none");  
  $(".statusLabel").css("display", "block");  
 
}
function requestDisplay() {
  $("#tradeBox").css("display", "none");
  $("#sentBox").css("display", "none");
  $("#receivedBox").css("display", "block");
  
  setButtnProperty("Decline", ".sendOfferButton2", "red");
  setButtnProperty("Accept", ".sendOfferButton", "green")
  var button = document.getElementsByClassName("sendOfferButton");
  var button2 = document.getElementsByClassName("sendOfferButton2");
  $(button).css("display", "block");
  $(button2).css("display", "block");
  $(".statusLabel").css("display", "none");  
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
function setButtnProperty(text, button, colour){
  console.log(text + " "  + colour + " " +  button);
  $(button).html(text);
  $(button).css("background-color", colour);
}
// This is the default settings before clicking any tabs
/* Overriding */
function available(){};
function notCurrUserPost(){};
function swapButton(key, postedBy){
  if (currTab == 0){
  deleteButton(key);
  } else if (currTab == 1){}
   else if (currTab == 2){
    acceptButton(key, postedBy);
  }
}

function swapButton2(key, postedBy){
  declineButton(key, postedBy);
}

function declineButton(key, postedBy){
  
  firebase.database().ref('posts/' + key).update({
    "status": "complete"
  });
  firebase.database().ref('users/' + currUser + "/offersReceived" + key).update({
    "status": "Accepted"
  });
  firebase.database().ref('users/' + postedBy + "/offersSent" + key).update({
    "status": "Accepted"
  });
}

function deleteButton(key){
  firebase.database().ref("posts/" + key).remove();
  firebase.database().ref("users/" + currUser + "/posts/" + key).remove();
  alert("Your post has been deleted!");
}

function acceptButton(key, postedBy){
  firebase.database().ref('posts/' + key).update({
    "status": "complete"
  });
  firebase.database().ref('users/' + currUser + "/offersReceived" + key).update({
    "status": "Accepted"
  });
  firebase.database().ref('users/' + postedBy + "/offersSent" + key).update({
    "status": "Accepted"
  });
}


function setButtonProperty(text, button){
  button.innerHTML = "Delete";
  $(button).css("background-color", "red");
} 
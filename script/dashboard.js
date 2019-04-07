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


// Displays the post with the specified ID (uniquePostID) into the specified div (htmlID).
function displayPost(uniquePostID, htmlID){
  var currentPostRef = firebase.database().ref("posts/" + uniquePostID);
  currentPostRef.once("value", function(snapshot){
    var obj = snapshot.val();
    var stringify = JSON.stringify(obj);
    var parse = JSON.parse(stringify);
    if (htmlID == "tradeBox"){
      addPostToTradeBox(htmlID, snapshot.key, parse.itemName, parse.category, parse.description,
      parse.date, parse.email, parse.postedBy, parse.status, parse.imageLocation);
    }
    else if (htmlID == "sentBox"){
      addPostToSentBox(htmlID, snapshot.key, parse.itemName, parse.category, parse.description,
      parse.date, parse.email, parse.postedBy, parse.status, parse.imageLocation);
    }
    else if (htmlID == "receivedBox"){
      addPostToReceivedBox(htmlID, snapshot.key, parse.itemName, parse.category, parse.description,
      parse.date, parse.email, parse.postedBy, parse.status, parse.imageLocation);
    }
  });
}

function addPostToTradeBox(idToPlaceIn, postID, itemName, category, description,
  date, email, postedBy, status, imageURL){
  var topLevel = document.getElementById(idToPlaceIn);  
  var item = document.createElement('div');
  item.className = "item";
  topLevel.appendChild(item);
  var itemImageWrapper = document.createElement('div');
  itemImageWrapper.className = "itemImageWrapper";
  item.appendChild(itemImageWrapper);
  var itemText = document.createElement('div');
  itemText.className = "itemText";
  item.appendChild(itemText);   
  var itemImage = document.createElement('img');
  itemImage.className = "itemImage";

  itemImage.src = imageURL;
  uploadedImage = "images/defaultImage.png";

  itemImageWrapper.appendChild(itemImage);
  var itemHeader = document.createElement('h6');
  itemHeader.className = "itemHeader";
  var itemDescription = document.createElement('p');
  itemDescription.className = "itemDescription";
  var itemByUser = document.createElement('div');
  itemByUser.className = "itemByUser";
  var itemPostedOn = document.createElement('div');
  itemPostedOn.className = "itemPostedOn";
  var deleteButton = document.createElement('div');
  deleteButton.className = "deleteButton";
  deleteButton.onclick = function(e){
    deleteButtonFn(postID);
  };
  itemText.appendChild(itemHeader);
  itemText.appendChild(deleteButton);
  itemText.appendChild(itemDescription);
  itemText.appendChild(itemPostedOn);
  deleteButton.innerHTML = "Delete";
  itemHeader.innerHTML = itemName;
  itemDescription.innerHTML = description;
  itemPostedOn.innerHTML = date;
}

function addPostToSentBox(idToPlaceIn, postID, itemName, category, description,
  date, email, postedBy, status, imageURL){
  var topLevel = document.getElementById(idToPlaceIn);  
  var item = document.createElement('div');
  item.className = "item";
  topLevel.appendChild(item);
  var itemImageWrapper = document.createElement('div');
  itemImageWrapper.className = "itemImageWrapper";
  item.appendChild(itemImageWrapper);
  var itemText = document.createElement('div');
  itemText.className = "itemText";
  item.appendChild(itemText);   
  var itemImage = document.createElement('img');
  itemImage.className = "itemImage";

  itemImage.src = imageURL;
  uploadedImage = "images/defaultImage.png";

  itemImageWrapper.appendChild(itemImage);
  var itemHeader = document.createElement('h6');
  itemHeader.className = "itemHeader";
  var itemDescription = document.createElement('p');
  itemDescription.className = "itemDescription";
  var itemByUser = document.createElement('div');
  itemByUser.className = "itemByUser";
  var itemPostedOn = document.createElement('div');
  itemPostedOn.className = "itemPostedOn";
  var statusLabel = document.createElement('div');
  statusLabel.className = "statusLabel";
  itemText.appendChild(itemHeader);
  itemText.appendChild(statusLabel);
  itemText.appendChild(itemDescription);
  itemText.appendChild(itemByUser);
  itemText.appendChild(itemPostedOn);
  statusLabel.innerHTML = status.toUpperCase();
  itemHeader.innerHTML = itemName;
  itemDescription.innerHTML = description;
  itemByUser.innerHTML = email;
  itemPostedOn.innerHTML = date;
}

function addPostToReceivedBox(idToPlaceIn, postID, itemName, category, description,
  date, email, postedBy, status, imageURL){
  var topLevel = document.getElementById(idToPlaceIn);  
  var item = document.createElement('div');
  item.className = "item";
  topLevel.appendChild(item);
  var itemImageWrapper = document.createElement('div');
  itemImageWrapper.className = "itemImageWrapper";
  item.appendChild(itemImageWrapper);
  var itemText = document.createElement('div');
  itemText.className = "itemText";
  item.appendChild(itemText);   
  var itemImage = document.createElement('img');
  itemImage.className = "itemImage";

  itemImage.src = imageURL;
  uploadedImage = "images/defaultImage.png";

  itemImageWrapper.appendChild(itemImage);
  var itemHeader = document.createElement('h6');
  itemHeader.className = "itemHeader";
  var itemDescription = document.createElement('p');
  itemDescription.className = "itemDescription";
  var itemByUser = document.createElement('div');
  itemByUser.className = "itemByUser";
  var itemPostedOn = document.createElement('div');
  itemPostedOn.className = "itemPostedOn";
  var acceptButton = document.createElement('div');
  var declineButton = document.createElement('div');

  acceptButton.className = "acceptButton";
  declineButton.className = "declineButton";

  acceptButton.onclick = function(e){
    acceptButtonFn(postID, postedBy);
  };
  declineButton.onclick = function(e){
    declineButtonFn(postID);
  };

  itemText.appendChild(itemHeader);
  itemText.appendChild(declineButton);
  itemText.appendChild(acceptButton);
  itemText.appendChild(itemDescription);
  itemText.appendChild(itemByUser);
  itemText.appendChild(itemPostedOn);
  acceptButton.innerHTML = "Accept";
  declineButton.innerHTML = "Decline";
  itemHeader.innerHTML = itemName;
  itemDescription.innerHTML = description;
  itemByUser.innerHTML = email;
  itemPostedOn.innerHTML = date;
}

function declineButtonFn(key, postedBy){
  firebase.database().ref('posts/' + key).update({
    "status": "complete"
  });
  firebase.database().ref('users/' + currUser + "/offersReceived/" + key).update({
    "status": "Accepted"
  });
  firebase.database().ref('users/' + postedBy + "/offersSent/" + key).update({
    "status": "Accepted"
  });
  alert("Declined!");
}

function deleteButtonFn(key){
  firebase.database().ref("posts/" + key).remove();
  firebase.database().ref("users/" + currUser + "/posts/" + key).remove();
  usersRef.once("value", function(snapshot){
    snapshot.forEach(function(childSnapshot){
      firebase.database().ref("users/" + childSnapshot.key + "/offersSent/" + key).remove();
      firebase.database().ref("users/" + childSnapshot.key + "/offersReceived/" + key).remove();
    });
  });
  alert("Your post has been deleted!");
}

function acceptButtonFn(key, postedBy){
  
  firebase.database().ref('posts/' + key).update({
    "status": "complete"
  });
  firebase.database().ref('users/' + currUser + "/offersReceived/" + key).update({
    "status": "Accepted"
  });
  firebase.database().ref('users/' + postedBy + "/offersSent/" + key).update({
    "status": "Accepted"
  });
  
  alert("Accepted!");
}
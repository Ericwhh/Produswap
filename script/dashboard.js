// Firebase reference to users and posts trees
var usersRef = firebase.database().ref('users');
var postsRef = firebase.database().ref('posts');

// Click handler for which tab to display
$("#tabPosted").click(function (e) {
  postedDisplay();
});

$("#tabSent").click(function (e) {
  sentDisplay();
});
$("#tabReceived").click(function (e) {
  requestDisplay();
});

// Listener for submit post form button
document.getElementById('postForm').addEventListener('submit', submitPost);

// Sets which tab to display
function postedDisplay() {
  $("#tradeBox").css("display", "block");
  $("#sentBox").css("display", "none");
  $("#receivedBox").css("display", "none");
}
function sentDisplay() {
  $("#tradeBox").css("display", "none");
  $("#sentBox").css("display", "block");
  $("#receivedBox").css("display", "none");
}
function requestDisplay() {
  $("#tradeBox").css("display", "none");
  $("#sentBox").css("display", "none");
  $("#receivedBox").css("display", "block");
}

/* Sets global variable currUser and displays user's name on page. 
Then, gets the posts that belong to the current user.
Gets the posts that the user has sent offers for.
Gets the posts that the user has received offers for. */
var currUser;
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    currUser = user.uid;
    $("#name").text(user.displayName);

    var currUserPostsRef = firebase.database().ref("users/" + currUser + "/posts");
    currUserPostsRef.once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        displayPost(childSnapshot.key, "tradeBox");
      });
    });
    var currUseSentRef = firebase.database().ref("users/" + user.uid + "/offersSent");
    currUseSentRef.once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        displayPost(childSnapshot.key, "sentBox");
      });
    });
    var currUserReceivedRef = firebase.database().ref("users/" + user.uid + "/offersReceived");
    currUserReceivedRef.once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        displayPost(childSnapshot.key, "receivedBox");
      });
    });
  }
});


// Displays the post with the specified ID (uniquePostID) into the specified div (htmlID).
function displayPost(uniquePostID, htmlID) {
  var currentPostRef = firebase.database().ref("posts/" + uniquePostID);
  currentPostRef.once("value", function (snapshot) {
    var obj = snapshot.val();
    var stringify = JSON.stringify(obj);
    var parse = JSON.parse(stringify);
    if (htmlID == "tradeBox") {
      if (parse.status != "complete") {
        addPostWithDelete(htmlID, snapshot.key, parse.itemName, parse.category, parse.description,
          parse.date, parse.email, parse.postedBy, parse.status, parse.imageLocation);
      }
    }
    else if (htmlID == "sentBox") {
      var statusRef = firebase.database().ref("users/" + parse.postedBy + "/offersReceived/" + snapshot.key);
      statusRef.once('value', function (childSnapshot) {
        addPostWithStatus(htmlID, snapshot.key, parse.itemName, parse.category, parse.description,
          parse.date, parse.email, parse.postedBy, childSnapshot.val().status, parse.imageLocation);
      });
    }
    else if (htmlID == "receivedBox") {
      var emailRef = firebase.database().ref("users/" + parse.offerBy + "/email");
      var promise = emailRef.once('value', function (childSnapshot) {
        email = childSnapshot.val();
      });
      promise.then(function () {
        var statusRef = firebase.database().ref("users/" + parse.postedBy + "/offersReceived/" + snapshot.key);
        statusRef.once('value', function (childSnapshot) {
          if (childSnapshot.val().status == "declined" || childSnapshot.val().status == "complete") {
            addPostWithStatus(htmlID, snapshot.key, parse.itemName, parse.category, parse.description,
              parse.date, email, parse.postedBy, childSnapshot.val().status, parse.imageLocation);
          }
          else {
            addPostWithAccDec(htmlID, snapshot.key, parse.itemName, parse.category, parse.description,
              parse.date, email, parse.offerBy, parse.postedBy, parse.status, parse.imageLocation);
          }
        });
      })
    }
  });
}

// Adds a post with a delete buttons to the specified ID (first parameter)
function addPostWithDelete(idToPlaceIn, postID, itemName, category, description,
  date, email, postedBy, status, imageURL) {
  var topLevel = document.getElementById(idToPlaceIn);
  var item = document.createElement('div');
  item.className = "item " + postID;
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
  deleteButton.onclick = function (e) {
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

// Adds a post with its status to the specified ID (first parameter)
function addPostWithStatus(idToPlaceIn, postID, itemName, category, description,
  date, email, postedBy, status, imageURL) {
  var topLevel = document.getElementById(idToPlaceIn);
  var item = document.createElement('div');
  item.className = "item " + postID;
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

// Adds a post with accept and declines buttons to the specified ID (first parameter)
function addPostWithAccDec(idToPlaceIn, postID, itemName, category, description,
  date, email, offerBy, postedBy, status, imageURL) {
  var topLevel = document.getElementById(idToPlaceIn);
  var item = document.createElement('div');
  item.className = "item " + postID;
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

  acceptButton.onclick = function (e) {
    acceptButtonFn(postID, offerBy, item);
  };
  declineButton.onclick = function (e) {
    declineButtonFn(postID, offerBy, item);
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

// Used when click Accept or Decline. Changes buttons to the status parameter.
function changeToStatus(element, status) {
  $(element).children().eq(1).children().eq(1).remove();
  $(element).children().eq(1).children().eq(1).remove();
  $(element).children().eq(1).children().eq(0).after('<div class="statusLabel">' + status + '</div>');
}

// Declines the post with the specified unique key in firebase and updates user trees accordingly
function declineButtonFn(key, offerBy, element) {
  firebase.database().ref('posts/' + key).update({
    "status": "available"
  });
  firebase.database().ref('users/' + currUser + "/offersReceived/" + key).update({
    "status": "declined"
  });
  firebase.database().ref('users/' + offerBy + "/offersSent/" + key).update({
    "status": "declined"
  });
  changeToStatus(element, "DECLINED");
}

// Deletes the post with corresponding the unique key in firebase
function deleteButtonFn(key) {
  firebase.database().ref("posts/" + key).remove();
  firebase.database().ref("users/" + currUser + "/posts/" + key).remove();
  usersRef.once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      firebase.database().ref("users/" + childSnapshot.key + "/offersSent/" + key).remove();
      firebase.database().ref("users/" + childSnapshot.key + "/offersReceived/" + key).remove();
    });
    $("." + key).remove();
  });
}

// Accepts the post with the specified unique key in firebase and updates user trees accordingly
function acceptButtonFn(key, offerBy, element) {
  firebase.database().ref('posts/' + key).update({
    "status": "complete"
  });
  firebase.database().ref('users/' + currUser + "/offersReceived/" + key).update({
    "status": "complete"
  });
  firebase.database().ref('users/' + offerBy + "/offersSent/" + key).update({
    "status": "complete"
  });
  changeToStatus(element, "ACCEPTED");
}
//clicking tabs on dashboard
function clickTab(clickedtab) {
  $("#tabPosted").css("opacity", "0.5");
  $("#tabReceived").css("opacity", "0.5");
  $("#tabSent").css("opacity", "0.5");
  document.getElementById(clickedtab).style.opacity = "1";
}

//Pop up for posts
$('#postButton').click(function () {
  $('#postForm').fadeToggle();
  $('#cover2').fadeToggle();
});
$("#cover2").click(function () {
  $('#postForm').fadeToggle();
  $('#cover2').fadeToggle();
  underline("dashboardButton");
})

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

function offerDisplay(){

}
function requestDisplay() {
    
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
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      currUser = user.uid;
      var currUserRef = firebase.database().ref("users/" + user.uid + "/posts");
      currUserRef.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
          displayPost(childSnapshot.key);
        });
      });
    }
});

// Displays the post with the ID.
function displayPost(uniquePostID){
  var currentPostRef = firebase.database().ref("posts/" + uniquePostID);
  currentPostRef.once("value", function(snapshot){
    var obj = snapshot.val();
    var stringify = JSON.stringify(obj);
    var parse = JSON.parse(stringify);
    addPostToPageListing("tradeBox", snapshot.key, parse.itemName, parse.category, parse.description,
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
}
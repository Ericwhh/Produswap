//JS functions 
var config = {
  apiKey: "AIzaSyAGVERfhd2wvN9zZPGRALe_hVLT3W_P0mg",
  authDomain: "produswap.firebaseapp.com",
  databaseURL: "https://produswap.firebaseio.com",
  projectId: "produswap",
  storageBucket: "produswap.appspot.com",
  messagingSenderId: "645477140066"
};
firebase.initializeApp(config);

// Underlines the nav bar button
function underline(clickedId){
  document.getElementById("marketButton").style.boxShadow = "none";
  document.getElementById("dashboardButton").style.boxShadow = "none";
  document.getElementById("signOutButton").style.boxShadow = "none";
  document.getElementById(clickedId).style.boxShadow = "0px -5px 0px 0px white inset";
};




firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
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
$("#signOutButton").click(function(){
    firebase.auth().signOut().then(function() {
        location.replace("market.html");
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });
});
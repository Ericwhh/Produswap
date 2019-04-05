/*
* ALL UNIVERSAL SCRIPT GOES HERE 
* 
*/

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAGVERfhd2wvN9zZPGRALe_hVLT3W_P0mg",
    authDomain: "produswap.firebaseapp.com",
    databaseURL: "https://produswap.firebaseio.com",
    projectId: "produswap",
    storageBucket: "produswap.appspot.com",
    messagingSenderId: "645477140066"
  };
  firebase.initializeApp(config);
  

// Depends if user is logged in
var currUser;
firebase.auth().onAuthStateChanged(function(user) {
if (user) {
    // currUser equals the unique ID for the user
    currUser = user.uid;
    enableSignout();
    $("#loginButtonText").text("Sign Out");
    firebase.database().ref('users/' + user.uid).update({
        "email":user.email,
        "name":user.displayName
    });
} 
else { 
    enableLogin();
    $("#postButton").off("click");
    $("#dashboardButton").removeAttr("href");
    $("#postButton, #dashboardButton").click(warning);
}   

    // Displays nav bar buttons
    $("#marketButton, #dashboardButton, #postButton, #loginButton").css({
        "display" : "initial"
    });
});
  
  //Pop up for posts
  $('#postButton').click(function() {
      $('#postForm').fadeToggle();
      $('#cover2').fadeToggle(); 
    });
  $("#cover2").click(function(){
      $('#postForm').fadeToggle();
      $('#cover2').fadeToggle(); 
  })
  
  // Enables login functionality (also removes signout functionality)
  function enableLogin(){
    $('#loginButton').click(function() {
        $('#firebasetest').fadeToggle();
        $('#cover').fadeToggle(); 
      });
    $("#cover").click(function(){
        $('#firebasetest').fadeToggle();
        $('#cover').fadeToggle(); 
    })
  }
  
// Enables signout functionality (also removes login functionality)
  function enableSignout(){
    $("#loginButtonText").click(function(){
      firebase.auth().signOut().then(function() {
          console.log('Signed Out');
      }, function(error) {
          console.error('Sign Out Error', error);
      });
    });
    $("#loginButtonText").text("Sign Out");
  }

// Underlines the nav bar buttons appropriately
function underline(clickedId){
    document.getElementById("marketButton").style.boxShadow = "none";
    document.getElementById("dashboardButton").style.boxShadow = "none";
    document.getElementById("postButton").style.boxShadow = "none";
    document.getElementById("loginButton").style.boxShadow = "none";
    document.getElementById(clickedId).style.boxShadow = "0px -5px 0px 0px white inset";
};
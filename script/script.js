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

  
//References for Firestorage
const storage = firebase.storage()

//References posts and users collection
var postsRef = firebase.database().ref('posts');
var usersRef = firebase.database().ref('users');
  

// Depends if user is logged in
var currUser;
firebase.auth().onAuthStateChanged(function(user) {
if (user) {
    // currUser equals the unique ID for the user
    currUser = user.uid;
    // Enables signout button
    enableSignout();
    // Update user tree to have user email and name
    firebase.database().ref('users/' + user.uid).update({
        "email":user.email,
        "name":user.displayName
    });
} 
else {
    // Enables login button
    enableLogin();
    // Disables post functionality
    $("#postButton").off("click");
    // Dashboard cannot be visited
    $("#dashboardButton").removeAttr("href");
    // Post button and dashboard button gives a user warning
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
    //Pop up for login
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


  // variable for selectedFile being uploaded
  var selectedFile; 
  function getfile() 
  { 
    var pic = document.getElementById("photo"); 

    // selected file is that file which user chosen by html form 
    selectedFile = pic.files[0]; 

    // make save button disabled for few seconds that has id='formSubmit' 
    document.getElementById('formSubmit').setAttribute('disabled', 'true'); 
    myfile(); // call below written function 
  } 
  function myfile() 
  { 
    // select unique name for everytime when image uploaded 
    // Date.now() is function that give current timestamp 
    var name="123"+Date.now(); 

    // make ref to your firebase storage and select images folder 
    var storageRef = firebase.storage().ref('/images/'+ name); 

    // put file to firebase 
    var uploadTask = storageRef.put(selectedFile); 

    // all working for progress bar that in html 
    // to indicate image uploading... report 
    uploadTask.on('state_changed', function(snapshot){ 
      var progress = 
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
      var uploader = document.getElementById('uploader'); 
      uploader.value=progress; 
      switch (snapshot.state) { 
        case firebase.storage.TaskState.PAUSED: 
        console.log('Upload is paused'); 
        break; 
        case firebase.storage.TaskState.RUNNING: 
        console.log('Upload is running'); 
        break; 
      } 
    }, function(error) {console.log(error); 
    }, function() { 

      // get the uploaded image url back 
      uploadTask.snapshot.ref.getDownloadURL().then( 
        function(downloadURL) { 

      // You get your url from here 
        console.log('File available at', downloadURL); 

      // print the image url 
      console.log(downloadURL); 
      document.getElementById('formSubmit').removeAttribute('disabled'); 
      }); 
    }); 
  };
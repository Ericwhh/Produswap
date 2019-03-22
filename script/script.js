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


// References posts collection
var postsRef = firebase.database().ref('posts');

//Listen for post submit

document.getElementById('postForm').addEventListener('submit', submitPost);

function submitPost(e){
  e.preventDefault();

  //Get values
  var name = getInputVal('name');
  var date = getInputVal('date');
  var category = getInputVal('category');
  var description = getInputVal('description');

  //Save post
  savePost(name, date, category, description);

  // Show alert 
  document.querySelector('.alert').style.display = 'block';

  // Hide alert after 3 sec
  setTimeout(function(){
    document.querySelector('.alert').style.display = 'none'; 
  },3000);


  //Clear form  
  document.getElementById('newPost').reset();
}

//Function to get form values
function getInputVal(id){
  return document.getElementById(id).value;

}

//Save posts to firebase

function savePost(name, date, category, description) {
  var newPostRef = postsRef.push();
  newPostRef.set({
    itemName: name,
    date: date,
    category: category,
    description: description
  });
};

// Still being tested

var db = firebase.database();
var query = db.ref();

console.log(query);

query.on('value', snapshot => {
  console.log(snapshot.val())
});  


  




//////////////////////////////////////////////////
//Marketplace.html 
//Distance Slider

var slider = document.getElementById("sliderBody");
var output = document.getElementById("dist");
output.innerHTML = slider.value;
slider.oninput = function() {
  output.innerHTML = this.value;
}

//Results list to Grid sort view 
$(function() {
  function list() {
    $(".gridView span").removeClass("active");
    $(".listView span").addClass("active");
    $(".wrapper")
    .removeClass("grid")
    .addClass("list");
    
    $(".itemImageWrapper").innerWidth("calc(150px - 28px)");
    $(".itemImageWrapper").innerHeight("calc(150px - 28px)");
    $(".itemText").innerWidth("calc(100% - 150px + 24px - 12px");

    for (i = 0; i < 2; i++){
      document.getElementsByClassName("itemImageWrapper")[i].style.display = "inline-block";
      document.getElementsByClassName("itemImageWrapper")[i].style.margin = "0";
      document.getElementsByClassName("itemText")[i].style.float = "right";
      document.getElementsByClassName("itemDescription")[i].style.lineHeight = "1.15em";
      document.getElementsByClassName("itemDescription")[i].style.height = "3.45em";
      document.getElementsByClassName("itemHeader")[i].style.marginTop = "0px";
      document.getElementsByClassName("itemDescription")[i].style.marginBottom = "0px";
    }
  }

  function grid() {
    $(".listView span").removeClass("active");
    $(".gridView span").addClass("active");
    $(".wrapper")
    .removeClass("list")
    .addClass("grid");

    $(".itemImageWrapper").innerWidth("140px");
    $(".itemImageWrapper").innerHeight("140px");
    $(".itemText").innerWidth("100%");

    for (i = 0; i < 2; i++){
      document.getElementsByClassName("itemImageWrapper")[i].style.display = "block";
      document.getElementsByClassName("itemImageWrapper")[i].style.margin = "0 auto";
      document.getElementsByClassName("itemText")[i].style.float = "none";
      document.getElementsByClassName("itemDescription")[i].style.lineHeight = "1.15em";
      document.getElementsByClassName("itemDescription")[i].style.height = "4.6em";
      document.getElementsByClassName("itemHeader")[i].style.marginTop = "10px";
      document.getElementsByClassName("itemDescription")[i].style.marginBottom = "10px";
      document.getElementsByClassName("itemByUser")[i].style.innerHTML = "10px";
      document.getElementsByClassName("itemPostedOn")[i].style.innerHTML = "10px";
    }
  }

  $(".listView").click(list);
  $(".gridView").click(grid);
});

$(function() {

  // contact form animations
  $('#postButton').click(function() {
    $('#postForm').fadeToggle();
    $('#cover').fadeToggle(); 
  })
  $(document).mouseup(function (e) {
    var container = $("#postForm");
    var container2 = $("#cover");

    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
      container.fadeOut();
      underline("marketButton");
      container2.fadeOut();
    }
  });
  
});
$(function() {

  // contact form animations
  $('#loginButtonText').click(function() {
    $('#firebasetest').fadeToggle();
    $('#cover').fadeToggle(); 
  })
  $(document).mouseup(function (e) {
    var container = $("#firebasetest");
    var container2 = $("#cover");

    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
      container.fadeOut();
      container2.fadeOut();
    }
  });
  
});

function underline(clickedId){
  document.getElementById("marketButton").style.boxShadow = "none";
  document.getElementById("dashboardButton").style.boxShadow = "none";
  document.getElementById("postButton").style.boxShadow = "none";
  document.getElementById(clickedId).style.boxShadow = "inset 0 -5px 0 white";
}
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl){
            return true;
        },
    },

signInFlow: 'popup',
signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
],
tosUrl: 'main.html',
privacyPolicyUrl: 'main.html'
};
ui.start('#firebasetest', uiConfig);


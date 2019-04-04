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
var usersRef = firebase.database().ref('users');

//Listen for post submit

document.getElementById('postForm').addEventListener('submit', submitPost);

// Current URL
var URL = window.location.href;

//formatting the date
function dateF(num, size){
    var s = num.toString().length;
    var store = "";
    while(s < size){
         s++;
        store += "0";
    }
    var proper = store + num.toString();
    return proper;
}

function submitPost(e){
  e.preventDefault();

  //Get values
  var currentDate = new Date();
  var name = getInputVal('produceName');
  var date = currentDate.getFullYear() + "-" + dateF(currentDate.getMonth() + 1, 2) + "-" + dateF(currentDate.getDate(), 2);
  var category = $('input[name=radioPostForm]:checked', '#postForm').val();
  var description = getInputVal('produceDescription');
  var additional = getInputVal('produceAdditionalInfo');

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var emailName = user.email;
      var userID = user.uid;
      savePost(name, date, category, description, additional, emailName, userID);
    }
    else {

    }
  });
  //Save post

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
function savePost(name, date, category, description, additional, email, userID) {
  var newPostRef = postsRef.push();
  var key = postsRef.push().key;
  newPostRef.set({
    itemName: name,
    date: date,
    category: category,
    description: description,
    additional: additional,
    email: email,
    status: "available",
    user: userID
  });
  var newUserRef = firebase.database().ref("users/" + currUser + "/posts/" + key).set({
    post: key
  });
  var indexType = URL.indexOf("type=");
  var indexSearch = URL.indexOf("search=");
  var indexTypeURL = "";
  var indexSearchURL = "";

  if (indexType != -1){
    indexTypeURL = URL.substring(indexType + 5, indexSearch - 1);
  }
  if (indexSearch != -1){
    indexSearchURL = URL.substring(indexSearch + 7);
  }

  if ((indexTypeURL == 0 || 
    indexTypeURL == 1 && category.toLowerCase() == "fruit" || 
    indexTypeURL == 2 && category.toLowerCase() == "vegetable") &&  
  (name.toLowerCase().indexOf(indexSearchURL.toLowerCase()) >= 0)){
    addPostToPageListing(name, category, description, date, email);
  }
};

// Functions to run if current page is market.html
if (URL.indexOf("market.html") >= 0){
  determineFilter();  
}

// Obtains URL, searches for the filters. Uses filters for display function.
function determineFilter(){
  var indexType = URL.indexOf("type=");
  var indexSearch = URL.indexOf("search=");
  var indexTypeURL = "";
  var indexSearchURL = "";
  if (indexType != -1){
    indexTypeURL = URL.substring(indexType + 5, indexSearch - 1);
    rememberFilter("#selectMenu", indexTypeURL);
  }
  if (indexSearch != -1){
    indexSearchURL = URL.substring(indexSearch + 7);
    rememberFilter("#searchBar", indexSearchURL);
  }
  display(indexTypeURL, indexSearchURL);
}

// Remembers the filter upon refresh.
function rememberFilter(tagID, toRemember){
  if (tagID == "#searchBar" || tagID == "#selectMenu"){
    $(tagID).val(toRemember);
  }
}
var list;
postsRef.once("value", function(snapshot){
  list=snapshot.val();
});

// Displays the item listing. Will ignore item if it does not match with param filters.
function display(type, name){

    postsRef.once("value", function(snapshot){
      list=snapshot.val();


    for (k in list){
      var categoryRef = firebase.database().ref("posts/"+k+"/category");
      var dateRef = firebase.database().ref("posts/"+k+"/date");
      var descriptionRef = firebase.database().ref("posts/"+k+"/description");
      var itemNameRef = firebase.database().ref("posts/"+k+"/itemName");
      var additionalRef = firebase.database().ref("posts/"+k+"/additional");
      var emailRef = firebase.database().ref("posts/"+k+"/email");
      var userRef = firebase.database().ref("posts/"+k+"/user");
      var statusRef = firebase.database().ref("posts/"+k+"/status");
      var promiseOne = categoryRef.once("value", function(snapshot){
        category=snapshot.val();
      });
      var promiseTwo = dateRef.once("value", function(snapshot){
        date=snapshot.val();
      });
      var promiseThree = descriptionRef.once("value", function(snapshot){
        description=snapshot.val();
      });
      var promiseFour = itemNameRef.once("value", function(snapshot){
        itemName=snapshot.val();
      });
      var promiseFive = additionalRef.once("value", function(snapshot){
        additionalInfo=snapshot.val();
      });
      var promiseSix = emailRef.once("value", function(snapshot){
        email=snapshot.val();
      });
      var promiseSeven = userRef.once("value", function(snapshot){
        user=snapshot.val();
      });
      var promiseEight = statusRef.once("value", function(snapshot){
        status=snapshot.val();
      });
      Promise.all([promiseOne, promiseTwo, promiseThree, promiseFour,
        promiseFive, promiseSix, promiseSeven, promiseEight]).then(function(){
        let itemNameLower = itemName.toLowerCase();  
        let nameLower = name.toLowerCase();  
        let categoryLower = category.toLowerCase();
        if ((type == 0 || 
          type == 1 && categoryLower == "fruit" || 
          type == 2 && categoryLower == "vegetable") &&  
        (itemNameLower.indexOf(nameLower) >= 0)){
          addPostToPageListing(itemName, category, description, date, email, user, status);
        }
      });
    }
  });    
}


var i = 0;
// Creates DOM elements for a listing with the parameters as the content
function addPostToPageListing(itemName, category, description, date, email, user, status){
  var topLevel = document.getElementsByClassName("wrapper list")[0];        
  var item = document.createElement('div');
  if (status != "available"){
    item.style.display = "none";
  }
  item.className = "item";
  topLevel.appendChild(item);
  var itemPadding = document.createElement('div');
  itemPadding.className = "itemPadding";
  item.appendChild(itemPadding);
  var itemImageWrapper = document.createElement('div');
  itemImageWrapper.className = "itemImageWrapper";
  itemPadding.appendChild(itemImageWrapper);
  var itemText = document.createElement('div');
  itemText.className = "itemText";
  itemPadding.appendChild(itemText);   
  var itemImage = document.createElement('img');
  itemImage.className = "itemImage";
  // IMAGE
  itemImage.src = "images/apple.jpg";
  
  itemImageWrapper.appendChild(itemImage);
  var itemHeader = document.createElement('h6');
  itemHeader.className = "itemHeader";
  var itemDescription = document.createElement('p');
  itemDescription.className = "itemDescription";
  var itemByUser = document.createElement('div');
  itemByUser.className = "itemByUser";
  var itemPostedOn = document.createElement('div');
  itemPostedOn.className = "itemPostedOn";
  var sendOfferButton = document.createElement('div');
  if (user == currUser && user != null){
    sendOfferButton.style.display = "none";
  }

  sendOfferButton.innerHTML = "Swap";
  sendOfferButton.className = "sendOfferButton";
  i++;
  let toAppendButtonID = "button" + i;
  sendOfferButton.id = toAppendButtonID;
  sendOfferButton.onclick = function(e){
    var currentButtonNum = parseInt((e.target.id.substring(6, 7)), 10);
    var count = 0;
    var x = postsRef.once("value", function(snapshot){
      list=snapshot.val();
    });
    x.then(function(){
      var count = 0;
      for (k in list){
        count++;
        if (count == currentButtonNum){
          if (currUser != null){
            firebase.database().ref('posts/' + k).update({
              "status": "Pending",
              "offerMadeBy": currUser
            });
            var sent = firebase.database().ref('users/' + currUser + "/offersSent/" + k).set({
              offerSent: true
            });
            var received = firebase.database().ref('users/' + user + "/offersReceived/" + k).set({
              offerRececived: true
            });
            alert("A swap request has been sent to the user!");
          } else {
            warning();
          }
        }
      }
    });
  }


  itemText.appendChild(itemHeader);
  itemText.appendChild(sendOfferButton);
  itemText.appendChild(itemDescription);
  itemText.appendChild(itemByUser);
  itemText.appendChild(itemPostedOn);
  // TEXT
  itemHeader.innerHTML = itemName;
  itemDescription.innerHTML = description;
  itemByUser.innerHTML = email;
  itemPostedOn.innerHTML = date;

}





//////////////////////////////////////////////////
//Marketplace.html 

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
    var postsRef = firebase.database().ref("posts");
    postsRef.once("value", function(snapshot){
      list=snapshot.val();
    
    var x = 0;
    for (k in list){
      x = x + 1;
    }
    for (i = 0; i < x; i++){
      document.getElementsByClassName("itemImageWrapper")[i].style.display = "inline-block";
      document.getElementsByClassName("itemImageWrapper")[i].style.margin = "0";
      document.getElementsByClassName("itemText")[i].style.float = "right";
      document.getElementsByClassName("itemDescription")[i].style.lineHeight = "1.15em";
      document.getElementsByClassName("itemDescription")[i].style.height = "3.45em";
      document.getElementsByClassName("itemDescription")[i].style.marginBottom = "0px";
    }
  })
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
    var postsRef = firebase.database().ref("posts");
    postsRef.once("value", function(snapshot){
      list=snapshot.val();
    
    var x = 0;
    for (k in list){
      x = x + 1;
    }
    for (i = 0; i < x; i++){
      document.getElementsByClassName("itemImageWrapper")[i].style.display = "block";
      document.getElementsByClassName("itemImageWrapper")[i].style.margin = "0 auto 10px";
      document.getElementsByClassName("itemText")[i].style.float = "none";
      document.getElementsByClassName("itemDescription")[i].style.lineHeight = "1.15em";
      document.getElementsByClassName("itemDescription")[i].style.height = "4.6em";
      document.getElementsByClassName("itemDescription")[i].style.marginBottom = "10px";
      document.getElementsByClassName("itemByUser")[i].style.innerHTML = "10px";
      document.getElementsByClassName("itemPostedOn")[i].style.innerHTML = "10px";
    }
  })
}

  $(".listView").click(list);
  $(".gridView").click(grid);
});

//pop up post and login
$('#postButton').click(function() {
    $('#postForm').fadeToggle();
    $('#cover2').fadeToggle(); 
  });
$("#cover2").click(function(){
    $('#postForm').fadeToggle();
    $('#cover2').fadeToggle(); 
    var htmlName = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1, 
        window.location.href.lastIndexOf("."));
      var indexType = URL.indexOf(".html");
      var indexSearch = URL.indexOf("search=");
      var indexTypeURL = "";
      var indexSearchURL = "";

      underline(htmlName + "Button");
})

$('#loginButtonText').click(function() {
    $('#firebasetest').fadeToggle();
    $('#cover').fadeToggle(); 
  });
$("#cover").click(function(){
    $('#firebasetest').fadeToggle();
    $('#cover').fadeToggle(); 
})

// Underlines the nav bar button
function underline(clickedId){
  document.getElementById("marketButton").style.boxShadow = "none";
  document.getElementById("dashboardButton").style.boxShadow = "none";
  document.getElementById("postButton").style.boxShadow = "none";
  document.getElementById("profileButton").style.boxShadow = "none";
  document.getElementById(clickedId).style.boxShadow = "inset 0 -5px 0 white";
}

// Login functionality
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl){
            return true;
        },
    },
signInSuccessUrl: 'market.html',
signInFlow: 'popup',
signInOptions: [
    //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //firebase.auth.PhoneAuthProvider.PROVIDER_ID
],
tosUrl: 'market.html',
privacyPolicyUrl: 'market.html'
};
ui.start('#firebasetest', uiConfig);  

var currUser;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currUser = user.uid;
    $("#marketButton, #dashboardButton, #postButton, #profileButton, #signupButton").css({
      "display" : "initial"
    });

    $("#signupButtonText").text("Sign Out");


    firebase.database().ref('users/' + user.uid).update({
      "email":user.email,
      "name":user.displayName
    });
  } 
  else { 
    currUser = null;
    $("#marketButton, #dashboardButton, #postButton, #loginButton, #signupButton").css({
      "display" : "initial"
    });
    $("#postButton").off("click");
    ("#postButton")
    $("#dashboardButton").removeAttr("href");
    $("#postButton, #dashboardButton").click(warning);
  }
});

//Sign out
$("#signupButtonText").click(function(){
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });
});

function warning(){
  document.querySelector('.warning').style.display = 'absolute';
  setTimeout(function(){
    document.querySelector('.warning').style.display = 'none'; 
  },3000);
}
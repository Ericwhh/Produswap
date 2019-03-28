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
  var name = getInputVal('produceName');
  var date = getInputVal('date');
  var category = $('input[name=radioPostForm]:checked', '#postForm').val();
  var description = getInputVal('produceDescription');

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
  addPostToPageListing(name, category, description, date);
};

determineFilter();

// Obtains URL, searches for the filters. If they do not exist, do not use as param forbb display().
function determineFilter(){
  var URL = window.location.href;
  var indexType = URL.indexOf("type=");
  var indexSearch = URL.indexOf("search=");
  var indexTypeURL;
  var indexSearchURL;
  if (indexType != -1 && indexSearch != -1){
    indexTypeURL = URL.substring(indexType + 5, indexSearch - 1);
    indexSearchURL = URL.substring(indexSearch + 7);
    display(indexTypeURL, indexSearchURL);
  }
  else if (indexType != -1){
    indexTypeURL = URL.substring(indexType + 5, indexSearch - 1);
    display(indexTypeURL);
  }
  else if (indexSearch != -1){
    indexSearchURL = URL.substring(indexSearch + 7);
    display(indexSearchURL);
  }
}

// Displays the item listing. Will ignore item if it does not match with param filters.
function display(type, name){
    var postsRef = firebase.database().ref("posts");
    postsRef.once("value", function(snapshot){
      list=snapshot.val();

    for (k in list){
      var categoryRef = firebase.database().ref("posts/"+k+"/category");
      var dateRef = firebase.database().ref("posts/"+k+"/date");
      var descriptionRef = firebase.database().ref("posts/"+k+"/description");
      var itemNameRef = firebase.database().ref("posts/"+k+"/itemName");

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
      Promise.all([promiseOne, promiseTwo, promiseThree, promiseFour]).then(function(){
        let itemNameLower = itemName.toLowerCase();  
        let nameLower = name.toLowerCase();  
        if ((type == 0 || type == 1 && category == "Fruit" || type == 2 && category == "Vegetable") &&  
        (itemNameLower.indexOf(nameLower) >= 0)){
          addPostToPageListing(itemName, category, description, date);
        }
      });
    }
  });    
}

// Creates DOM elements for a listing with the parameters as the content
function addPostToPageListing(itemName, category, description, date){
  var topLevel = document.getElementsByClassName("wrapper list")[0];        
  var item = document.createElement('div');
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
  itemText.appendChild(itemHeader);
  itemText.appendChild(itemDescription);
  itemText.appendChild(itemByUser);
  itemText.appendChild(itemPostedOn);
  // TEXT
  itemHeader.innerHTML = itemName;
  itemDescription.innerHTML = description;
  itemByUser.innerHTML = "Username";
  itemPostedOn.innerHTML = date;

}





//////////////////////////////////////////////////
//Marketplace.html 
//Distance Slider

try {
  var slider = document.getElementById("sliderBody");
  var output = document.getElementById("dist");
  output.innerHTML = slider.value;
  slider.oninput = function() {
    output.innerHTML = this.value;
  }  
} catch (error) {
  console.log("Not in market page!");
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
      document.getElementsByClassName("itemHeader")[i].style.marginTop = "0px";
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
      document.getElementsByClassName("itemImageWrapper")[i].style.margin = "0 auto";
      document.getElementsByClassName("itemText")[i].style.float = "none";
      document.getElementsByClassName("itemDescription")[i].style.lineHeight = "1.15em";
      document.getElementsByClassName("itemDescription")[i].style.height = "4.6em";
      document.getElementsByClassName("itemHeader")[i].style.marginTop = "10px";
      document.getElementsByClassName("itemDescription")[i].style.marginBottom = "10px";
      document.getElementsByClassName("itemByUser")[i].style.innerHTML = "10px";
      document.getElementsByClassName("itemPostedOn")[i].style.innerHTML = "10px";
    }
  })
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


var searchText = document.getElementById("searchBar");
$('#searchButton').on('click', function(){

  console.log(text);
});


// Gets currently signed in user
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $("#navProfile").css({
      "display" : "initial"
    });
    $("#loginButton").css({
      "display" : "none"
    }); 
    $("#signupButtonText").text("Sign Out");


    firebase.database().ref('users/' + user.uid).update({
      "email":user.email
    });


  } else {

    
  }
});

//Listen for post submit
document.getElementById('postForm').addEventListener('submit', submitPost);

// Current URL
const URL = window.location.href;
// Index of where the type input (fruit / vegetable) is in the URL
const indexType = URL.indexOf("type=");
// Index of where the search input is in the URL
const indexSearch = URL.indexOf("search=");
// If index for type was found (exists), gets the input string from URL
const indexTypeURL = indexType != - 1 ? URL.substring(indexType + 5, indexSearch - 1) : "";
// If index for search was found (exists), gets the input string from URL
const indexSearchURL = indexSearch != - 1 ? URL.substring(indexSearch + 7) : "";
// Displays filters back into dropdown and input field after a search
if (indexType != -1){
  rememberFilter("#selectMenu", indexTypeURL);
}
if (indexSearch != -1){
  rememberFilter("#searchBar", indexSearchURL);
}
// Displays all the listings onto the page according to filters
  display(indexTypeURL, indexSearchURL);


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

// Displays the post with the ID.
function displayPost(uniquePostID, type, name){
  var currentPostRef = firebase.database().ref("posts/" + uniquePostID);
  currentPostRef.once("value", function(snapshot){
    var obj = snapshot.val();
    var stringify = JSON.stringify(obj);
    var parse = JSON.parse(stringify);

    if ((type == 0 || 
      type == 1 && parse.category == "Fruit" || 
      type == 2 && parse.category == "Vegetable") &&  
    (parse.itemName.toUpperCase().indexOf(name.toUpperCase()) >= 0)){
      addPostToPageListing("postList", uniquePostID, parse.itemName, parse.category, parse.description,
        parse.date, parse.email, parse.postedBy, parse.status, parse.imageLocation);
    }
  });
}

// Displays the item listing. Will ignore item if it does not match with param filters.
function display(type, name){

    postsRef.once("value", function(snapshot){
      snapshot.forEach(function(childSnapshot){
        displayPost(childSnapshot.key, type, name);
      });   
  });    
}






function swapButton(key, postedBy){
  if (currUser != null){
    firebase.database().ref('posts/' + key).update({
      "status": "pending"
    });
    var sent = firebase.database().ref('users/' + currUser + "/offersSent/" + key).set({
      offerSent: true
    });
    var received = firebase.database().ref('users/' + postedBy + "/offersReceived/" + key).set({
      offerRececived: true
    });
    alert("A swap request has been sent to the user!");
  } else {
    warning();
  }
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


// Login functionality
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl){
            return true;
        },
    },
signInSuccessUrl: 'dashboard.html',
signInFlow: 'popup',
signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
],
tosUrl: 'market.html',
privacyPolicyUrl: 'market.html'
};
ui.start('#firebasetest', uiConfig);  



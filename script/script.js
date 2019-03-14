//JS functions 

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
  })
  $(document).mouseup(function (e) {
    var container = $("#postForm");

    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        container.fadeOut();
        underline("marketButton");
    }
  });
  
});

  function underline(clickedId){
    document.getElementById("marketButton").style.boxShadow = "none";
    document.getElementById("dashboardButton").style.boxShadow = "none";
    document.getElementById("postButton").style.boxShadow = "none";
    document.getElementById(clickedId).style.boxShadow = "inset 0 -5px 0 white";
  }
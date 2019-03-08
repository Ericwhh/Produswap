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
    $(".grid span").removeClass("active");
    $(".list span").addClass("active");
    $(".wrapper")
    .removeClass("grid")
    .addClass("list");
  }

  function grid() {
    $(".list span").removeClass("active");
    $(".grid span").addClass("active");
    $(".wrapper")
    .removeClass("list")
    .addClass("grid");
  }

  $(".list").click(list);
  $(".grid").click(grid);
});

function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

console.log("jQuery loaded");
console.log("common.js loaded");


setTimeout(function(){
	$.ajax({
	  url: "/api/programs",
	  context: document.body
	}).success(function(reponse) {
	  $('#programs').replaceWith( reponse );
	});
}, 1200); 

setTimeout(function(){
	$.ajax({
	  url: "/api/programs",
	  context: document.body
	}).success(function(reponse) {
	  $('#programs').replaceWith( reponse );
	});
}, 1200); 

$(document).ready(function(){

	$.ajax({
			type: "GET",
			url: "/api"
		}).done(function(results){
			var resultsArray = [];
			var counter = 0;

			resultsArray.push(results);

		function createTitle(index){
			var dynDiv = $('<div id="dynDiv">');
			var dynP = $('<p>');
			dynP.append(resultsArray[0][index].title);
			dynDiv.append(dynP);
			return dynDiv;
		}

		function nextTitle(){
			$('#dynDiv').remove();
			var nextTitle = createTitle(counter);

			$('#apiResults').append(nextTitle);
		}

		nextTitle();

		$('#nextAlbum').on('click', function(){
			counter++;
			nextTitle();
		});


	});
});
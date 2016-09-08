$(document).ready(function(){

	$.ajax({
			type: "GET",
			url: "/api"
		}).done(function(results){
			var resultsArray = [];
			var counter = 0;

			resultsArray.push(results);
			console.log(resultsArray);

		function createTitle(index){
			var dynDiv = $('<div id="dynDiv">');

			var titleP = $('<p>');
			titleP.append(resultsArray[0][index].title);
			dynDiv.append(titleP);

			var imageP = $('<img>');
			imageP.attr('src', resultsArray[0][index].image).width(220);
			dynDiv.append(imageP);

			var linkA = $('<a>',{
				href: resultsArray[0][index].link,
				target: "_blank",
				text: 'Link to album Review',
				width: 500
			});
			dynDiv.append(linkA);
		
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
$(document).ready(function(){

	$.ajax({
			type: "GET",
			url: "/api"
		}).done(function(results){
			var resultsArray = [];
			var counter = 0;

			resultsArray.push(results);

		function createTitle(index){
			var dynDiv = $('<div>',{
				'data-id': resultsArray[0][index]._id,
				id: 'dynDiv'
			});
			var titleP = $('<p>')
			titleP.append(resultsArray[0][index].title);
			dynDiv.append(titleP);

			var imageP = $('<img>');
			imageP.attr('src', resultsArray[0][index].image).width(280);
			dynDiv.append(imageP);

			var linkA = $('<a>',{
				href: "http://www.pitchfork.com"+resultsArray[0][index].link,
				target: "_blank",
				text: 'Link to album Review',
				width: 500
			});
			dynDiv.append(linkA);
		
			return dynDiv;
		}

		function createComments(index){
			var dynDiv = $('<div>',{
				id: 'dynCom',
				'data-id': resultsArray[0][index]._id
			});
			var commP = $('<p>');
			comments = resultsArray[0][index].user;
			
			comments.forEach(function(comment){
				commP.append(comment.name + ": " + comment.comment + '<br>');
			});

			dynDiv.append(commP);

			return dynDiv;
		};

		function nextTitle(){
			if (counter < resultsArray[0].length){
				$('#dynDiv').remove();
				$('#dynCom').remove();

				var nextTitle = createTitle(counter);
				var nextComm = createComments(counter);

				$('#apiResults').append(nextTitle);
				$('#reviewDiv').append(nextComm);
			} else {
				$('#dynDiv').remove();
				$('#apiResults').text('End of List')
			}
		}

		nextTitle();

		$('#nextAlbum').on('click', function(){
			$('#commentDiv').empty();
			counter++;
			nextTitle();
		});

		$('#prevAlbum').on('click', function(){
			$('#commentDiv').empty();
			counter--;
			nextTitle();
		});

	});

		$(document).on('click', '#dynDiv' , function(){
			$('#commentDiv').empty();
			var thisId = $(this).attr('data-id');

			$.ajax({
				method: "GET",
				url: "/api/" + thisId,
			}).done(function(results){
				$('#commentDiv').append('<input id = "nameInput" type="text" name = "name" />');
				$('#commentDiv').append('<textarea id = "commInput" type="text" name = "comment"></textarea>');
				$('#commentDiv').append('<button data-id="'+ results._id + '" id="saveComm">Post Comment</button>');

				if(results.user){
					$('#nameInput').val(results.user.name);
					$('#commInput').val(results.user.comment);
				}
			});
		});

		$(document).on('click', '#saveComm', function(){

			var thisId = $(this).attr('data-id');

			$.ajax({
				method: "POST",
				url: "/api/" + thisId,
				data: {
					name: $('#nameInput').val(),
					comment: $('#commInput').val()
				}
			}).done(function(data){
				$('#commentDiv').empty();
				window.location.reload();
			});
			$('#nameInput').val('');
			$('#commInput').val('');
		});

	// $(document).on('click', 'p', function(){
	// 	$('#commendDiv').empty();

	// 	var thisId = $(this).attr('data-id');

	// 	$.ajax({
	// 		method: "GET",
	// 		url: "/articles/" + thisId,
	// 	}).done(function(data){

	// 	})
	// })

});
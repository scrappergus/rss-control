Meteor.api = {
	errors: function(msg){
		$('#msg-error').removeClass('hide');
		$('#msg-error').html(msg);
	},
	success: function(json,header){
		$('#msg-error').addClass('hide');
		$('#v-i').html(header);
		$('#get-form').addClass('hide');
		// $('#data').html(json);
		$('#res').removeClass('hide');

		json = Meteor.api.processAuthors(json);
		Session.set('json',json);
	},
	retry: function(){
		$('#get-form').removeClass('hide');
		$('#res').addClass('hide');
	},
	processAuthors: function(articles){
		articles = JSON.parse(articles);
		var articlesL = articles.length;
		for(var i=0 ; i< articlesL ; i++){
			articles[i]['authorsString'] = '';
			var authors = articles[i]['authors'];
			authorsL = authors.length;
			for( var a=0 ; a < authorsL ; a++){
				//piece together author name
				var authorString = authors[a]['first_name'];
				if(authors[a]['middle_name']){
					authorString = authorString + ' ' + authors[a]['middle_name'];
				}
				if(authors[a]['last_name']){
					authorString = authorString + ' ' + authors[a]['last_name'];
				}

				//add to author string
				// console.log(a + ' ' +parseInt(authorsL-1));
				if ( a == parseInt(authorsL-1)){
					articles[i]['authorsString'] = articles[i]['authorsString'] + ', and ' + authorString;
				}else if(a != 0 ){
					articles[i]['authorsString'] = articles[i]['authorsString'] + ', ' + authorString;
				}else{
					articles[i]['authorsString'] = authorString;
				}

			}
		}
		articles = JSON.stringify(articles);
		// console.log(articles);
		return articles;
	}
}
Meteor.api = {
	submit: function(e){
		// $('.form-btn').disabled = true;
	},
	errors: function(msg){
		$('#msg-error').removeClass('hide');
		$('#msg-error').html(msg);
	},
	success: function(json){
		var rssDescription = Session.get('rssDescription');
		$('#msg-error').addClass('hide');
		$('#v-i').html(rssDescription);
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

Meteor.rss = {
	objectToXML: function(json) {
		var rssDescription = Session.get('rssDescription');
		var result = {};
		var today = new Date();
		var UTCstring = today.toUTCString();
		console.log(UTCstring);
    	result['pubDate'] = UTCstring;
    	result['pubDateDate'] = today;
    	result['xml'] = '<?xml version="1.0"?><rss version="2.0"><channel>';
    	result['xml'] += '<pubDate>' + UTCstring + '</pubDate>'; 
    	result['xml'] += '<title>Oncotarget</title><language>en-us</language><link>http://www.impactjournals.com/oncotarget/index.php?journal=oncotarget</link><description>' + rssDescription + '</description>';

    	var articlesCount = json.length;
    	for(var i=0 ; i < articlesCount ; i++){
    		var article = '<item>';
    		article += '<title>'+json[i]['title']+'</title>';
    		article += '<link>http://www.impactjournals.com/oncotarget/misc/linkedout.php?pii='+json[i]['pii']+'</link>';
    		article += '<description>'+json[i]['authorsString']+'</description>';  
    		article += '</item>';
			result['xml'] += article;	
    	}
    	result['xml'] += '</channel></rss>';
		return result;
	},

}
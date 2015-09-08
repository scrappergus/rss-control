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

		json = Meteor.api.processJSON(json);

		Session.set('json',json);
	},
	retry: function(){
		$('#get-form').removeClass('hide');
		$('#res').addClass('hide');
	},
	processJSON: function(json){
		var pastArticles = Meteor.rss.pastArticlesIDS();
		articles = JSON.parse(json);
		var articlesL = articles.length;
		var numShared = 0;
		var articlesCount = 0;
		for(var i=0 ; i< articlesL ; i++){
			var authors = articles[i]['authors'];
			var pii = parseInt(articles[i]['pii']);
			articles[i]['authorsString'] = Meteor.api.processAuthors(articles[i]['authors']);
			//check if article was shared
			if(pastArticles.indexOf(pii) != -1){
				articles[i]['shared'] = true;
				numShared++;
			}
			articlesCount++;
		}
		articles = JSON.stringify(articles);
		Session.set('numShared',numShared);
		Session.set('articlesCount',articlesCount);
		return articles;
	},
	processAuthors: function(authors){
		authorsL = authors.length;
		var authorsString = '';
		for( var a=0 ; a < authorsL ; a++){
			//piece together author name
			var aString = authors[a]['first_name'];
			if(authors[a]['middle_name']){
				aString = aString + ' ' + authors[a]['middle_name'];
			}
			if(authors[a]['last_name']){
				aString = aString + ' ' + authors[a]['last_name'];
			}

			//add to author string
			if ( a == parseInt(authorsL-1) && authorsL != 1 &&  authorsL != 2){
				authorsString += ', and ' + aString;
			}else if ( a == parseInt(authorsL-1) && authorsL === 2){
				authorsString += ' and ' + aString;
			}else if(a != 0 ){
				authorsString += ', ' + aString;
			}else{
				authorsString = aString;
			}
		}
		return authorsString;
	}
}

Meteor.rss = {
	objectToXML: function(json) {
		var rssDescription = Session.get('rssDescription');
		var result = {};
		var today = new Date();
		var UTCstring = today.toUTCString();
    	result['feedPubDate'] = today;
    	result['xml'] = '<?xml version="1.0"?><rss version="2.0"><channel>';
    	result['xml'] += '<pubDate>' + UTCstring + '</pubDate>'; 
    	result['xml'] += '<title>Oncotarget</title><language>en-us</language><link>http://www.impactjournals.com/oncotarget/index.php?journal=oncotarget</link><description>' + rssDescription + '</description>';

    	var articlesCount = json.length;
    	for(var i=0 ; i < articlesCount ; i++){
    		if(!json[i]['shared']){
	    		var article = '<item>';
	    		var title = json[i]['title'];
	    		title = Meteor.rss.fixDB(title);
	    		article += '<title>'+title+'</title>';
	    		article += '<link>http://www.impactjournals.com/oncotarget/misc/linkedout.php?pii='+json[i]['pii']+'</link>';
	    		article += '<description>' + json[i]['section'] + ' | ' + json[i]['article_pubdate'] + ' | ' + json[i]['authorsString'] + '</description>';  
	    		article += '</item>';
				result['xml'] += article;	    			
    		}
    	}
    	result['xml'] += '</channel></rss>';
		return result;
	},
	fixDB: function(title){
		if(title.indexOf('<em>i<em>') != -1){
			title = title.replace('<em>i<em>','<em>i</em>');
		}
		return title;
	},
	pastArticles: function(){
		var feedList = feeds.find().fetch();
		if(feedList){
			var feedsC = feedList.length;
			var allArticles = [];
			for(var i = 0 ; i < feedsC ; i++){
				var feedDate = feedList[i]['feedPubDate'];
				var feedArticles = feedList[i]['articles'];
				var feedC = feedArticles.length;
				for(var a = 0 ; a < feedC ; a++){
					var aObj = {
						'feedDate' : feedDate,
						'pii' : feedArticles[a]
					}
					allArticles.push(aObj);
				}
			}
			return allArticles;			
		}
	},
	pastArticlesIDS: function(){
		var feedList = feeds.find().fetch();
		if(feedList){
			var feedsC = feedList.length;
			var allArticles = [];
			for(var i = 0 ; i < feedsC ; i++){
				var feedArticles = feedList[i]['articles'];
				var feedC = feedArticles.length;
				for(var a = 0 ; a < feedC ; a++){
					allArticles.push(feedArticles[a]);
				}
			}
			return allArticles;			
		}
	}
}
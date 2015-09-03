if (Meteor.isClient) {
	Template.layout.helpers({
		chill: function(){
			return Session.get('chill');
		}
	});
	Template.new.helpers({
		articles: function(){
			var articles = Session.get('json');
			if(articles != ''){
				articles = JSON.parse(articles);	
			}
			return articles;
			
		}
	});
};
Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});
	
Router.route('/rss', { 
	name: 'rss',
	waitOn: function(){
		return [
			Meteor.subscribe('currentFeed')
		]
	},
	where: 'server',
	data: function(){
		if(this.ready()){
			var currentFeed = feeds.findOne({},{sort:{_id:1}});
			//TODO: sort by pubdate?
			return{
				feed: currentFeed
			}
		}
	},
	action: function() {
		var currentFeed = feeds.findOne({},{sort:{_id:1}});
		var headers = {'Content-type': 'application/xml', 'charset' : 'ISO-8859-1'};
		this.response.writeHead(200, headers);
		this.response.end(currentFeed.xml);
	}
});

if (Meteor.isClient) {
	var permissionHooks = {
		chill: function(){
			if(!(Meteor.loggingIn() || Meteor.user())){
				Router.go('login');
			}else if(!Meteor.user().chill){
				Router.go('login');
			}else{
				Session.set('chill',true);
				if(window.location.pathname === '/login'){
					Router.go('home');
				}
			}
			this.next();
		}
	}

	Router.onBeforeAction(permissionHooks.chill,{except:['home']});

	Session.setDefault('chill',false);
	Session.setDefault('json','');
	Session.setDefault('rssDescription','');
	Session.setDefault('articlesCount',false);
	Session.setDefault('numShared',false);

	Router.route('/',{
		name: 'home',
		onBeforeAction: function(){
			Router.go('rss');
		}
		
	});
	Router.route('/admin', { 
		name: 'admin',
		waitOn: function(){
			return [
				Meteor.subscribe('userData')
			]
		},
		data: function(){
			if(this.ready()){
				return{
					header: 'RSS Control Home'
				}
			}
		}
	});
	Router.route('/new', { 
		name: 'new',
		waitOn: function(){
			return [
				Meteor.subscribe('feeds'),
				Meteor.subscribe('userData')
			]
		},
		data: function(){
			if(this.ready()){
				return{
					header: 'New',
					feeds: feeds.find().fetch()
				}
			}
		}
	});
	Router.route('/past', { 
		name: 'past',
		waitOn: function(){
			return [
				Meteor.subscribe('userData'),
				Meteor.subscribe('feeds'),
			]
		},
		data: function(){
			if(this.ready()){
				var feedsList = feeds.find().fetch();
				var articles = Meteor.rss.pastArticles();
				return{
					header: 'Past Feeds',
					feeds: feedsList,
					articles: articles
				}
			}
		}
	});
	Router.route('/past/:_id', { 
		name: 'pastSingle',
		waitOn: function(){
			return [
				Meteor.subscribe('feeds')
			]
		},
		data: function(){
			if(this.ready()){
				var feed = feeds.find({'_id':this.params._id}).fetch();
				return{
					header: 'Past Feed',
					feed: feed[0]
				}
			}
		}
	});
	Router.route('/login', { 
		name: 'login',
		waitOn: function(){
			return [
				Meteor.subscribe('userData')
			]
		},
		data: function(){
			if(this.ready()){
				return{
					header: 'login'
				}
			}
		}
	});
}
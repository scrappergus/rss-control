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
		console.log(headers);
		this.response.writeHead(200, headers);
		this.response.end(currentFeed.xml);
	}
});

if (Meteor.isClient) {
	var permissionHooks = {
		chill: function(){
			// console.log('..chill');
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
				Meteor.subscribe('userData')
			]
		},
		data: function(){
			if(this.ready()){
				return{
					header: 'New'
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
				return{
					header: 'Past Feeds',
					feeds: feeds.find().fetch()
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
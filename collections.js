feeds = new Mongo.Collection('feeds');

if (Meteor.isClient) {
	Meteor.subscribe('userData');
	Meteor.subscribe('feeds');
	Meteor.subscribe('currentFeed');
}
if (Meteor.isServer) {
	//PUBLISH
	Meteor.startup(function () {
		Meteor.publish('userData', function() {
			if(!this.userId){
				return this.ready();
			}else{
				var info = Meteor.users.find(this.userId, {fields: {
					chill: 1
				}});
				return info;
			}
		});	
		Meteor.publish('feeds', function() {
			if(!this.userId){
				return this.ready();
			}else{
				var feedsList = feeds.find();
				return feedsList;
			}
		});			
		Meteor.publish('currentFeed', function() {
			var currentFeed = feeds.find();
			return currentFeed;
		});		
	});

	//RULES
	feeds.allow({
		insert: function (userId, doc) {
			console.log('insert!');
			if(userId){
				var u = Meteor.users.findOne({_id:userId});
				return u.chill ;
			}
		},
		update: function (userId, doc, fields, modifier) {
			if(userId){
				var u = Meteor.users.findOne({_id:userId});
				return u.chill ;
			}
		},
		remove: function (userId, doc) {
			if(userId){
				var u = Meteor.users.findOne({_id:userId});
				return u.chill ;
			}
		}
	});	
}
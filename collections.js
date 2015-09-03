if (Meteor.isClient) {
	Meteor.subscribe('userData');
}
if (Meteor.isServer) {
	Meteor.startup(function () {
		Meteor.publish('userData', function() {
			console.log('..userData');
			if(!this.userId){
				return this.ready();
			}else{
				var info = Meteor.users.find(this.userId, {fields: {
					chill: 1
				}});
				console.log('info');
				console.log(info);
				return info;
			}
		});		
	});
}
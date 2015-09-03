Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});


if (Meteor.isClient) {
	var permissionHooks = {
		chill: function(){
			console.log('..chill');
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

	Router.onBeforeAction(permissionHooks.chill);

	Session.setDefault('chill',false);
	Session.setDefault('json','');
	
	Router.route('/', { 
		name: 'home',
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
				Meteor.subscribe('userData')
			]
		},
		data: function(){
			if(this.ready()){
				return{
					header: 'Past (not setup yet)'
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
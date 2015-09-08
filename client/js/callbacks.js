if (Meteor.isClient) {
	Template.past.rendered = function(){
		$('ul.tabs').tabs();
	}
}
Meteor.methods({
	'getIssueJson': function(v,i){
		this.unblock();
		var request = 'http://www.impactjournals.com/rss/?journal=oncotarget&v='+v+'&i='+i;
		return Meteor.http.get(request);
	}
});
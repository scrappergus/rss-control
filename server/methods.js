Meteor.methods({
	'getIssueJson': function(v,i){
		this.unblock();
		var request = 'http://www.impactjournals.com/rss/index.php?journal=oncotarget&v='+v+'&i='+i;
		var res = Meteor.http.get(request);
		return res;
	}
});
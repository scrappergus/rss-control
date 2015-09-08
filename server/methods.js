
Meteor.methods({
	'insertFeed': function(json){
		var docID =  feeds.insert(json);
		return docID;
	},
	'getIssueJson': function(v,i){
		this.unblock();
		var param = '&v='+v+'&i='+i;
		if(v === 5 && i === 0){
			param = '&issue_id=79';
		}
		var request = 'http://www.impactjournals.com/rss/index.php?journal=oncotarget'+param;
		var res = Meteor.http.get(request);
		return res;
	}
});
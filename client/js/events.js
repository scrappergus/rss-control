if (Meteor.isClient) {
	Template.new.events({
		'click #get-submit': function(e,t){
			e.preventDefault();
			Meteor.api.submit(e);
			var i = t.find('#issue').value,
				v = t.find('#volume').value;
			if(!i){
				$('#issue').addClass('invalid');	
			}
			if(!v){
				$('#volume').addClass('invalid');	
			}

			if(i && v){
				Meteor.call('getIssueJson',v,i, function(error, results) {
					if(error){
						Meteor.api.errors(error.message);
					}else{
						Session.set('rssDescription','Volume ' + v + ', Issue ' + i)
						Meteor.api.success(results.content);
					}
			    });
			}
		},
		'click #get-advance': function(e){
			e.preventDefault();
			Meteor.api.submit(e);
			Meteor.call('getIssueJson',5,0, function(error, results) {
				if(error){
					Meteor.api.errors(error.message);
				}else{
					Session.set('rssDescription','Advance Online Publications')
					Meteor.api.success(results.content);
				}
			});
		},
		'click #get-again': function(e){
			e.preventDefault();
			Meteor.api.retry();
		},
		'click #send-rss': function(e){
			e.preventDefault();
			var rssDescription = Session.get('rssDescription');
			var json = Session.get('json');
			json = JSON.parse(json);

			//articles
			var articles = [];
			var feedLength = json.length;
			for(var i = 0 ; i < feedLength ; i++){
				var pii = parseInt(json[i]['pii']);
				articles.push(pii);
			}

			//xml and pubdate
			var insertJSON = Meteor.rss.objectToXML(json);
			insertJSON['articles'] = articles;

			Meteor.call('insertFeed',insertJSON, function(error, result){
				if(error){
					console.log(error);
					alert('Error');
				}else{
					Router.go('pastSingle',{'_id':result});
				}
			});
		}
	});
};
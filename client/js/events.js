if (Meteor.isClient) {
	Template.new.events({
		'click #get-submit': function(e,t){
			e.preventDefault();
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
						Meteor.api.success(results.content,'Volume '+v+', Issue '+i);
					}
			    });
			}
		},
		'click #get-advance': function(e){
			e.preventDefault();
			Meteor.call('getIssueJson',5,0, function(error, results) {
				if(error){
					Meteor.api.errors(error.message);
				}else{
					Meteor.api.success(results.content,'Advance Online');
				}
			});
		},
		'click #get-again': function(e){
			e.preventDefault();
			Meteor.api.retry();
		}
	});
};
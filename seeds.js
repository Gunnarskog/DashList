var mongoose = require("mongoose");
var Workspace = require("./models/workspace");
var Attendee = require("./models/attendee")

var workspaces = [
	{url: "Ullas"},
	{url: "Fredriks Festhelvete"},
	{url: "Örjans soire"}
]

function seedDB(){
	// Remove all worlspaces
	Workspace.remove({}, function(err){
		if(err){
			console.log(err)
		} else {
			console.log("Removed workspaces!")
			Attendee.remove({}, function(err){
				if(err){
					console.log(err)
				} else {
					console.log("Removed attendees!")
						 // Add a few workspaces
				 	workspaces.forEach(function(seed){
						Workspace.create(seed, function(err, workspace){
							if(err){
								console.log(err)
							} else {
						console.log("Added a workspace!")
						Attendee.create({
							name: "Tjalle",
							beers: 19,
							wine: 1,
							liquor: 2
						}, function(err, attendee){
							if(err){
								console.log(err)
							} else {
							workspace.attendeeList.push(attendee);
							workspace.save();
							console.log("Added new attendee")
							
						}

						});

					}
				});
	});
				}
			})

		 
	
		
		}
	});


}



module.exports = seedDB;
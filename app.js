var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose")
	seedDB		= require("./seeds")


// ==== Rensar databasen och hittar på lite ny data,
// bra när man utvecklar
//seedDB();
// ==================Head========================
// ==============================================
// Database connect
mongoose.connect("mongodb://localhost:27017/dash_list_v1", { useNewUrlParser: true })

app.set('view engine', 'ejs');

// ================== For CSS ====================
app.use(express.static(__dirname + '/public'));
// ===============================================

// ========== To get req.body.data ===============
app.use(bodyParser.urlencoded({ extended: false })) 
// ===============================================

// ====================DBs========================
var Attendee = require("./models/attendee");
var Workspace = require("./models/workspace");
// ===============================================


// ====================App=======================
// ==============================================
//Startup
app.get("/", function(req, res){
	res.redirect("/dashlist")
});

// Landingpage
//Index "shows" all workspaces
app.get("/dashlist", function(req, res){
 		res.render("workspaces/index")
});

app.get("/dashlist/found", function(req, res){

	 Workspace.findOne({url: req.query.url}, function(err, workspace){
 			if(err){
 				console.log(err);
 			} else if (workspace){
 				res.redirect("/dashlist/"+ workspace._id)
 			} else {
 				res.render("workspaces/index")
 			}
 		});
});

//Create new workspace
app.post("/dashlist", function(req, res){
	var url = req.body.url;
	var attendees = req.body.attendees;

	var merchName_1 = req.body.merchName_1;
	var merchName_2 = req.body.merchName_2
	var merchName_3 = req.body.merchName_3
	var merchName_4 = req.body.merchName_4
	var merchName_5 = req.body.merchName_5
	var merchName_6 = req.body.merchName_6
	var merchName_7 = req.body.merchName_7

var numOfMerch = [];
var merchList = [merchName_1, merchName_2, merchName_3, merchName_4, merchName_5, merchName_6, merchName_7].filter(function(merch){ 
				    	return merch !== '';
				    	 });
for (var i = 0; i <= merchList.length; i++) {
 var merch = "merch_"+ i;
 numOfMerch[i] = merch
}
console.log("Merhclist", merchList)
console.log("numOfMerchlist", numOfMerch)

	var delayInMilliseconds = 10000; //1 second
	var attendeeArr = attendees.split(",");

	var newWorkspace = {url: url, merchList, attendeeList: []};
	// TILL SENARE, Lägg till attendees här, från /new formet
	Workspace.create(newWorkspace, function(err, workspace){
		if(err){
			console.log(err)
		} else {

			if(typeof attendees != 'undefined') {
				
 				attendeeArr.forEach(function(attendee){
 					
						newAttendee = {name: attendee}
						numOfMerch.forEach(function(merch){
							newAttendee[merch] = 0;
						})
						/*console.log("nya forEach", newAttendee), other_1: 0, other_2: 0}*/
							Attendee.create(newAttendee, function(err, newlyCreated){
								if(err){
									console.log(err)
								} else {

									workspace.attendeeList.push(newlyCreated._id)
									console.log("Saved!")
										setTimeout(function () {
       									 workspace.save()
   									 }, 5000);
								}
							})
						})

 				console.log(workspace)
 				res.redirect("/dashlist")
						
						}
		};
	});
})

// Declare innan :id annars funkar den inte
app.get("/dashlist/new", function(req, res){
	res.render("workspaces/new")
})


// Shows specific workspace
app.get("/dashlist/:id", function(req, res){
/*	var merchName_1 = req.body.merchName_1;
	var merchName_2 = req.body.merchName_2;
	var merchNames = [merchName_1, merchName_2]
	console.log(merchNames)*/

	// Find the workspace with provided ID
	Workspace.findById(req.params.id).populate("attendeeList").exec(function(err, workspace){
		if(err){
			console.log(err)
		} else {
			res.render("workspaces/show", {workspace: workspace})
		}
	})
})

// Form for new attendee
app.get("/dashlist/:id/attendees/new", function(req, res){
	Workspace.findById(req.params.id, function(err, workspace){
		if(err){
			console.log(err)
		} else {
			res.render("attendees/new", {workspace: workspace})
		}
	})
})

// Create new attendee or incremet/decrement values
app.post("/dashlist/:id/attendees", function(req, res){

	var attendeeID = req.body.attendeeID;
	var beverage = req.body.beverage;
	var attendee = req.body.name;

	Workspace.findById(req.params.id, function(err, workspace){
		if(err){
			console.log(err)
			res.redirect("/dashlist/" + workspace._id)
		} else {

			if(typeof attendeeID == 'undefined') {
							/*console.log(Attendee.find({}))*/
							newAttendee = {name: attendee}
							Attendee.create(newAttendee, function(err, newlyCreated){
								if(err){
									console.log(err)
								} else {

									workspace.attendeeList.push(newlyCreated)
									workspace.save()
									res.redirect("/dashlist/" + workspace._id);
								}
							})
						} else {
			Attendee.findById(attendeeID, function(err, foundAttendee){
			if(err){
				console.log("THIS IS THE ERROR", err)

			} else {
			var keys = Object.keys(foundAttendee.toJSON());
				    		keys.shift()
				    		keys.shift()
				    		keys.pop()

			keys.forEach(function(key){ 
				if(beverage === 'add'+key){
			    foundAttendee[key]++;
			}
				if(beverage === 'remove'+key){
			    foundAttendee[key]--;
			}
				})

 				if(beverage === 'del'){
 				foundAttendee.remove(attendeeID, function(err, attendee){
 					if(err){
 						console.log(err)
 					} else {
 						console.log("Successfully removed", attendee)
 					}
 				});
 				}

 			foundAttendee.save();
			res.redirect("/dashlist/" + workspace._id)
			}
			});
		};
		};
	});
});

// SHOW - shows more info about one attendee
app.get("/dashlist/:id/attendees/:attendeeID", function(req, res){
	// Find the workspace with provided ID

	Workspace.findById(req.params.id, function(err, foundWorkspace){
		Attendee.findById(req.params.attendeeID, function(err, foundAttendee){
			res.render("attendees/show", {attendee: foundAttendee, workspace: foundWorkspace})
	})
	})
	
})


app.listen(3030, function(){
	//var host = server.address().address
 //  var port = server.address().port
 console.log("DashList is up!");
   //console.log("Example app listening at http://%s:%s", host, port)
});
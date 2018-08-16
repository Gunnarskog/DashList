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
	var beers = req.body.beerCheck;
	var cider = req.body.ciderCheck;
	var wine = req.body.wineCheck;
	var liquor = req.body.liquorCheck;
	var NonAlcoholic = req.body.NonAlcCheck;
	var other_1	= req.body.other_1Check;
	var other_2	= req.body.other_2Check;
	console.log("oth1", other_1)	

	var merchList = [beers, cider, wine, liquor, NonAlcoholic, other_1, other_2].filter(function(merch){ 
				    	return merch !== undefined
				    	 });
	console.log(merchList)


	var delayInMilliseconds = 10000; //1 second
	var attendeeArr = attendees.split(",");

	var newWorkspace = {url: url, attendeeList: []};
	// TILL SENARE, Lägg till attendees här, från /new formet
	Workspace.create(newWorkspace, function(err, workspace){
		if(err){
			console.log(err)
		} else {

			if(typeof attendees != 'undefined') {
				
 				attendeeArr.forEach(function(attendee){
 					
						newAttendee = {name: attendee}
						merchList.forEach(function(merch){
							newAttendee[merch] = 0;
						})
						console.log("nya forEach", newAttendee)/*, other_1: 0, other_2: 0}*/
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

							newAttendee = {name: attendee, beers: 0, cider: 0, wine: 0, liquor: 0, NonAlcoholic: 0, other_1: 0, other_2: 0}
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
	Attendee.findById(req.params.attendeeID, function(err, foundAttendee){
		res.render("attendees/show", {attendee: foundAttendee})
	})
})


app.listen(3030, function(){
	//var host = server.address().address
 //  var port = server.address().port
 console.log("DashList is up!");
   //console.log("Example app listening at http://%s:%s", host, port)
});
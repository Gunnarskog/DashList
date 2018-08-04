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
	/* Workspace.find({}, function(err, allWorkspaces){
 			if(err){
 				console.log(err);
 			} else {
 				res.render("workspaces/index", {workspaces: allWorkspaces})
 			//	res.render("show_space", {workspace: workspace});
 			}
 		});*/
 		res.render("workspaces/index")
});

app.get("/dashlist/found", function(req, res){



	 Workspace.findOne({url: req.query.url}, function(err, workspace){
 			if(err){
 				console.log(err);
 			} else {
 				console.log(workspace._id)
 				res.redirect("/dashlist/"+ workspace._id)
 			//	res.render("show_space", {workspace: workspace});
 			}
 		});
});

//Create new workspace
app.post("/dashlist", function(req, res){
	var url = req.body.url;
	// TILL SENARE, Lägg till attendees här, från /new formet


	var newWorkspace = {url: url};

	Workspace.create(newWorkspace, function(err, newWorkspace){
		if(err){
			console.log("Cant create workspace", err)
		} else {
			res.redirect("/dashlist")
			console.log(newWorkspace)
		}
	})
})

// Declare innan :id annars funkar den inte
app.get("/dashlist/new", function(req, res){
	res.render("workspaces/new")
})

// Shows specific workspace
// ÄNDRA TILL URL HÄR SEN! OCH ANCHORTAG I INDEXFILEN?
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

app.get("/dashlist/:id/attendees/new", function(req, res){
	Workspace.findById(req.params.id, function(err, workspace){
		if(err){
			console.log(err)
		} else {
			res.render("attendees/new", {workspace: workspace})
		}
	})
})


app.post("/dashlist/:id/attendees", function(req, res){

	var attendeeID = req.body.attendeeID;
	var beverage = req.body.beverage;

	console.log(beverage)

	Workspace.findById(req.params.id, function(err, workspace){
		if(err){
			console.log(err)
		} else {

			if(typeof attendeeID == 'undefined') {

							newAttendee = {name: req.body.name, beers: 0, wine: 0, liquor: 0}
							Attendee.create(newAttendee, function(err, newlyCreated){
								if(err){
									console.log(err)
								} else {

									workspace.attendeeList.push(newlyCreated)
									workspace.save()
									res.redirect("/dashlist/" + workspace._id);
								}
							})
						} else{
			Attendee.findById(attendeeID, function(err, foundAttendee){
			if(err){
				console.log("THIS IS THE ERROR", err)

			} else {
				if(beverage === 'addbeers'){
			    foundAttendee.beers++;
			}
				if(beverage === 'removebeers'){
			    foundAttendee.beers--;
			}
				if(beverage === 'addwine'){
			    foundAttendee.wine++;
 			}
 				if(beverage === 'removewine'){
			    foundAttendee.wine--;
 			}
 				if(beverage === 'addliquor'){
			    foundAttendee.liquor++;  
 			}
 				if(beverage === 'removeliquor'){
			    foundAttendee.liquor--;  
 			}   
 				if(beverage === 'del'){
 				foundAttendee.remove(attendeeID, function(err, attendee){
 					if(err){
 						console.log(err)
 					} else {
 						console.log("Successfully removeD", attendee)
 					}
 				});
 			}

 			foundAttendee.save();
			res.redirect("/dashlist/" + workspace._id)
		}
});
}

		}
	})
})

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
 console.log("Example app listening");
   //console.log("Example app listening at http://%s:%s", host, port)
});
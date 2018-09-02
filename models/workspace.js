var mongoose = require("mongoose")

var workspaceSchema = new mongoose.Schema({
	url: String,
	merchList: [],
	attendeeList: [
	{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Attendee' 
	}
	]
});

var Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;
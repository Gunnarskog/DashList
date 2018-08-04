var mongoose = require("mongoose");

var AttendeeSchema = new mongoose.Schema({
	name: String,
	beers: Number,
	wine: Number,
	liquor: Number 
});

var Attendee = mongoose.model("Attendee", AttendeeSchema);

module.exports = Attendee;
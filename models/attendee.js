var mongoose = require("mongoose");

var AttendeeSchema = new mongoose.Schema({
	name: String,
	beers: Number,
	cider: Number,
	wine: Number,
	liquor: Number, 
	NonAlcoholic: Number,
	other_1: Number,
	other_2: Number
});

var Attendee = mongoose.model("Attendee", AttendeeSchema);

module.exports = Attendee;
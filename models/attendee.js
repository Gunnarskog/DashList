var mongoose = require("mongoose");

var AttendeeSchema = new mongoose.Schema({
	name: String,
	merch_1: Number,
	merch_2: Number,
	merch_3: Number,
	merch_4: Number, 
	merch_5: Number,
	merch_6: Number,
	merch_7: Number
});

/*var AttendeeSchema = new mongoose.Schema({
	name: String,
	beers: Number,
	cider: Number,
	wine: Number,
	liquor: Number, 
	NonAlcoholic: Number,
	other_1: Number,
	other_2: Number
});*/

var Attendee = mongoose.model("Attendee", AttendeeSchema);

module.exports = Attendee;
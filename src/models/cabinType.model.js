const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cabinTypeSchema = new Schema({
	typeName: {
		type: String,
		enum: ["Tiny Cabin", "Couple Room"],
		required: true,
	},
	maxAdults: {
		type: Number,
		required: true,
	},
	maxChildrens: {
		type: Number,
		required: true,
	},
	capacity: {
		type: Number,
		required: true,
	},
	priceHotTubPerInstance: {
		type: Number,
		required: true,
	},
	pricePerNight: {
		type: Number,
		required: true,
	},
	amenities: {
		type: [String],
		default: ["Aire Acondicionado", "Baño Privado (Ducha, Secador de pelo)", "Tinaja Caliente (costo adicional por uso)", "Toallas", "Estacionamiento Gratuito"],
		required: true,
	},
	size: {
		type: Number,
		required: true,
	},
	bedType: {
		type: String,
		required: true,
	},
	img: {
		type: String,
		required: true,
	},
});

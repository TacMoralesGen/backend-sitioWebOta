const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const cabinSchema = new Schema({
    typeName: {
      type: String,
      enum: ["Tiny Cabin", "Couple Room"],
      required: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
    statusCabin: {
      type: String,
      enum: ["Activa", "Inactiva"],
      default: "Disponible",
      required: true,
    },
    statusHotTub: {
      type: String,
      enum: ["Activa", "Inactiva"],
      default: "Disponible",
      required: true,
    },
    reservedDates: {
      type: [Date],
      default: [],
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
      default: [
        "Aire Acondicionado",
        "Baño Privado (Ducha, Secador de pelo)",
        "Tinaja Caliente (costo adicional por uso)",
        "Toallas",
        "Estacionamiento Gratuito",
      ],
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    bedType: {
      type: String,
    },
    img: {
      type: String,
    }
  }, { timestamps: true });

  const Cabin = model("Cabin", cabinSchema);
  module.exports = Cabin;
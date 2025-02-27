const Cabin = require("../models/cabin.model");

const createNewCabin = async (req, res) => {
	try {
		const newCabin = await Cabin.create(req.body);

		res.status(201).json({
			message: "Se creo con exito un nuevo tipo de cabina",
			cabin: newCabin,
		});
	} catch (error) {
		res.status(500).json({
			message: "Hubo un error al crear la cabina",
			error: error.message,
		});
	}
};

const putCabin = async (req, res) => {
	try {
        console.log(req.body)
        const { cabin, _id } = req.body
		const newCabin = await updateCabin(_id, cabin);

		res.status(201).json({
			message: "Se creo con exito un nuevo tipo de cabina",
			cabin: newCabin,
		});
	} catch (error) {
		res.status(500).json({
			message: "Hubo un error al crear la cabina",
			error: error.message,
		});
	}
};

const updateCabin = async (cabinId, updateData) => {
	try {
		const updatedCabin = await Cabin.findByIdAndUpdate(
			cabinId,
			{ $set: updateData }, // Apply updates
			{ new: true, runValidators: true } // Return updated document
		);
		if (!updatedCabin) {
			console.log("Cabin not found");
			return null;
		}
		console.log("Updated Cabin:", updatedCabin);
		return updatedCabin;
	} catch (error) {
		console.error("Error updating cabin:", error);
		throw error;
	}
};

const getAllCabins = async (req, res) => {
	try {
		const cabins = await Cabin.find();
		res.status(200).json({
			cabins,
		});
	} catch (error) {
		res.status(500).json({
			message: "Hubo un error al obtener las cabinas",
			error: error.message,
		});
	}
};

module.exports = { createNewCabin, getAllCabins, putCabin };

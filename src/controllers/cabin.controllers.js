const Cabin = require("../models/cabin.model");

const createNewCabin = async (req, res) => {
    try {
        const newCabin = await Cabin.create(req.body);
        res.status(201).json({
            message: "Se creo con exito una nueva cabaña",
            cabin: newCabin
        });
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al crear la cabaña",
            error: error.message
        });
    }
};

const getAllCabins = async (req, res) => {
    try {
        const cabins = await Cabin.find();
        res.status(200).json({
            cabins
        });
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al obtener las cabaña",
            error: error.message
        });
    }
};

module.exports = { createNewCabin,getAllCabins };
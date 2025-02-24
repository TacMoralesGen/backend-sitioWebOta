const Cabin = require("../models/cabin.model");
const Reservation = require("../models/reservation.model");
const ReservationCabin = require("../models/reservationCabin.model");

// Crear una nueva cabaña
const insertData = async ({ reservations, reservationCabins, cabins }) => {
	try {
		await Cabin.deleteMany({});
		await Reservation.deleteMany({});
		await ReservationCabin.deleteMany({});

		const options = { ordered: true };

		const reservas = await Reservation.insertMany(reservations, options);
		// console.log(`${reservas} reservas creadas`);

		// const reservasCabanas = await ReservationCabin.insertMany(reservationCabins, options);
		// console.log(`${reservasCabanas.insertedCount} reservasCabanas creadas`);

		const cabanas = await Cabin.insertMany(cabins, options);
		// console.log(`${cabanas} cabanas creadas`);

		console.log(`${reservationCabins} reservationCabins`);
		for (const reservationCabin of reservationCabins) {
			const cabinId = cabanas.find(cabana => reservationCabin.cabinId = cabana.number)._id
      const reservationOrder = reservationCabin.reservationId
			const reservationId = reservas[reservationOrder-1]._id
			reservationCabin.cabinId = cabinId;
			reservationCabin.reservationId = reservationId;
		}
		console.log(`${reservationCabins} reservationCabins`);

    const reservasCabanas = await ReservationCabin.insertMany(reservationCabins, options);
		console.log(`${reservasCabanas} reservasCabanas creadas`);

	} catch (error) {
		console.error("Error al insertar datos iniciales:", error);
	}
};

const getIdCabinByNum = async (num) => {
	try {
		const cabin = await Cabin.find({ number: num });
		return cabin._id;
	} catch (error) {
		console.error("Error al insertar datos iniciales:", error);
	}
};

const getIdReservationByOrder = async (order) => {
	try {
		const cabin = await Cabin.find({ number: num });
		return cabin._id;
	} catch (error) {
		console.error("Error al insertar datos iniciales:", error);
	}
};

module.exports = insertData;

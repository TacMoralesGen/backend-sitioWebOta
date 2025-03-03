const Reservation = require("../models/reservation.model");
const ReservationCabin = require("../models/reservationCabin.model");
const Cabin = require("../models/cabin.model");
const { listen } = require("../app/app");

async function cabinByNumber(number) {
  console.log("number", number);
	let cabin = await Cabin.findOne({ number: number.toString() });
  console.log("cabin", cabin);
  let id = cabin._id
  // console.log("CabinId", id);
  let reservedDates = cabin.reservedDates
  console.log("reservedDates before", reservedDates);
  return { id, reservedDates }
}
//sortedDates arreglo de fechas ordenadas
//newDate fecha que se quiere meter dentro del arreglo
//edita directamente sortedDates
function insertDate(sortedDates, newDate) {
	let left = 0,
		right = sortedDates.length;
	while (left < right) {
		let mid = Math.floor((left + right) / 2);
		if (sortedDates[mid] < newDate) {
			left = mid + 1;
		} else {
			right = mid;
		}
	}
	return sortedDates.splice(left, 0, newDate);
}

// CREA nueva reserva. TAMBIEN CREA las reservationCabin asociadas Y AGREGA LA/S FECHA/S a cabin.reservedDates en la/s cabana/s asociada/s
async function createNewReservation(req, res) {
	try {
		const { reservation, reservationRange } = req.body;
    let { reservationCabins } = reservation;
		const newReservation = await Reservation.create(reservation);
    const reservationId = newReservation._id

		//Se realizan 2 cosas: se actualiza las fechas reservadas de las cabañas
		//y se actualiza cada reservationCabin asignando el correcto id de cabaña y también de reserva para su vinculamiento
		reservationCabins = await Promise.all(reservationCabins.map(async (reservationCabin) => {
			let { id: cabinId, reservedDates } = await cabinByNumber(reservationCabin.cabinNumber);
      // console.log("reservedDates", reservedDates)
			for (const dateToInsert of reservationRange) {
				reservedDates = reservedDates.length > 0? insertDate(reservedDates, dateToInsert) : [dateToInsert];
			}
      console.log("reservedDates before", reservedDates);

			await Cabin.updateOne(
				{ _id: cabinId },
				{ $set: { reservedDates: reservedDates } }
      )
      // console.log("reservationCabin", reservationCabin)
      // console.log("_idCabin (_id)", cabinId)
      // console.log("reservationId", reservationId)
			return { reservationId: reservationId, cabinId: cabinId, ...reservationCabin };
		}));

    console.log("reservationCabins:", reservationCabins)
		const newReservationsCabins = await ReservationCabin.insertMany(reservationCabins, { ordered: true });

		res.status(201).json({
			message: "Se entregan las reservas con las reserva de cabañas",
			reservation: { ...newReservation, newReservationsCabins },
		});
	} catch (error) {
    console.log(error.message)
		res.status(500).json({
			message: "Hubo un error al crear la reserva",
			error: error.message,
		});
	}
}

async function getAllReservations(req, res) {
	try {
		// Definir el pipeline de agregación con $lookup para unir orders con products
		const joinPipeline = [
            {
              $lookup: {
                from: "reservationcabins", // Join ReservationCabin
                localField: "_id",
                foreignField: "reservationId",
                as: "reservationCabins"
              }
            },
            {
              $unwind: {
                path: "$reservationCabins",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $lookup: {
                from: "cabins", // Join Cabin
                localField: "reservationCabins.cabinId",
                foreignField: "_id",
                as: "cabinDetails"
              }
            },
            {
              $unwind: {
                path: "$cabinDetails",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $addFields: {
                "reservationCabins.typeName": "$cabinDetails.typeName",
                "reservationCabins.number": "$cabinDetails.number",
                "reservationCabins.statusCabin": "$cabinDetails.statusCabin",
                "reservationCabins.capacity": "$cabinDetails.capacity",
                "reservationCabins.pricePerNight": "$cabinDetails.pricePerNight",
                "reservationCabins.img": "$cabinDetails.img"
              }
            },
            {
              $project: {
                "reservationCabins.cabinDetails": 0 // Remove nested cabinDetails
              }
            },
            {
              $group: {
                _id: "$_id",
                numReservation: { $first: "$numReservation" },
                documentTypeClient: { $first: "$documentTypeClient" },
                documentNumberClient: { $first: "$documentNumberClient" },
                nameClient: { $first: "$nameClient" },
                countryOfResidence: { $first: "$countryOfResidence" },
                phoneClient: { $first: "$phoneClient" },
                emailClient: { $first: "$emailClient" },
                checkinDate: { $first: "$checkinDate" },
                checkoutDate: { $first: "$checkoutDate" },
                statusReservation: { $first: "$statusReservation" },
                totalPrice: { $first: "$totalPrice" },
                notes: { $first: "$notes" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                reservationCabins: { $push: "$reservationCabins" } // Collect cabins in an array
              }
            }
          ];
		const reservations = await Reservation.aggregate(joinPipeline);
		console.log(reservations);
		res.status(200).json({
			reservations,
		});
	} catch (error) {
		res.status(500).json({
			message: "Hubo un error al obtener las reservas",
			error: error.message,
		});
	}
}

module.exports = { createNewReservation, getAllReservations };

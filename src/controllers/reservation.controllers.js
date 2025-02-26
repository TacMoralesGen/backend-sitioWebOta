const Reservation = require("../models/reservation.model");
const ReservationCabin = require("../models/reservationCabin.model");
const Cabin = require("../models/cabin.model");


async function cabinByNumber(number) {
    return Cabin.findOne({number: number.toString()});
}
//sortedDates arreglo de fechas ordenadas
//newDate fecha que se quiere meter dentro del arreglo
//edita directamente sortedDates
function insertDate(sortedDates, newDate) {
    let left = 0, right = sortedDates.length;
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        if (sortedDates[mid] < newDate) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    sortedDates.splice(left, 0, newDate);
}


// CREA nueva reserva. TAMBIEN CREA las reservationCabin asociadas Y AGREGA LA/S FECHA/S a cabin.reservedDates en la/s cabana/s asociada/s
async function createNewReservation (req, res) {
    try {
        //Separa reservationsCabins, reservedRange, y reservation 
        //porque const no tira error si reservationCabins se edita luego
        // req.body = {reservation, reservedRange} 
        const { reservationsCabins, reservedRange: reservedDatesToInsert, ...reservation } = req.body.reservation;
        //se inserta la reserva (checkin, checkout, cliente pero NO LAS CABAÑAS)
        const newReservation = await Reservation.create(reservation);

        //Se realizan 2 cosas: se actualiza las fechas reservadas de las cabañas
        //y se actualiza cada reservationCabin asignando el correcto id de cabaña y también de reserva para su vinculamiento
        reservationsCabins = reservationsCabins.map(async reservationCabin => {
            const { _id: cabinId, reservedDates } = cabinByNumber(reservationCabin.cabinNumber);
            for (const dateToInsert of reservedDatesToInsert) {
                insertDate(reservedDates, dateToInsert);
            }
            await Cabin.updateOne(
                { _id: cabinId },
                { $set: { reservedDates: reservedDates }} // Add the new date to the array
            );
            return { reservationId: newReservation._id, cabinId: cabin._id, ...reservationCabin }
        });

        const newReservationsCabins = await ReservationCabin.insertMany(reservationsCabins, { ordered: true });

        res.status(201).json({
            message: status,
            reservation: {...newReservation, newReservationsCabins}
        });
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al crear la reserva",
            error: error.message
        });
    }
};

async function getAllReservations (req, res) {
    try {
        const reservations = await Reservation.find();
        res.status(200).json({
            reservations
        });
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al obtener las reservas",
            error: error.message
        });
    }
};

async function getReservedDates (req, res) {
    try {
        // Filtrar solo reservas confirmadas y devolver solo checkinDate y checkoutDate
        const reservations = await Reservation.find(
            { statusReservation: "Confirmada" },
            "checkinDate checkoutDate"
        );

        res.status(200).json({
            reservedDates: reservations
        });
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al obtener las fechas reservadas",
            error: error.message
        });
    }
};

module.exports = { createNewReservation, getAllReservations, getReservedDates };
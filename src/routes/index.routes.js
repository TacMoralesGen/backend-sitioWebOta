const express = require("express");
const router = express.Router();

const { createNewReservation, getAllReservations } = require ("../controllers/reservation.controllers")
const { createNewCabin, getAllCabins, putCabin } = require ("../controllers/cabin.controllers");

// // Crear nuevo contacto
// router.post("/contacto", createNewContact);
// // Obtener todos los contactos
// router.get("/contactos", getAllContacts);

// // Crear nuevo payment
// router.post("/payment", createNewPayment);
// // Obtener todos los payment
// router.get("/payments", getAllPayments);

// CREA nueva reserva. TAMBIEN CREA las reservationCabin asociadas Y AGREGA LA/S FECHA/S a cabin.reservedDates en la/s cabana/s asociada/s
router.post("/reservation", createNewReservation);
// Obtiene todas las reservations Full (con reservationsCabins)
router.get("/reservations", getAllReservations);

// Obtiene todas las reservationCabins
// router.get("/reservation/fechas", getAllReservationCabins);

// CREA una nueva Cabin
router.post("/cabin", createNewCabin);
// ACTUALIZA una Cabin
router.patch("/cabin", putCabin);
// OBTIENE todas las Cabin
router.get("/cabins", getAllCabins); //_> se puede obtener la disponibilidad

// router.post("/admin/cabin", createNewAdminCabin);
// router.get("/admin/cabin", getAllCabins);

module.exports = {router};
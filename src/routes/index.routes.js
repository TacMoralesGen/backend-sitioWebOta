const express = require("express");
const router = express.Router();

const { createNewContact, getAllContacts } = require("../controllers/contacto.controllers");
const { createNewReservationCabin, getAllReservationCabins } = require("../controllers/reservationCabin.controllers")
const { createNewPayment, getAllPayments } = require("../controllers/payment.controllers")
const { createNewReservation, getAllReservations, getReservedDates } = require ("../controllers/reservation.controllers")
const { createNewCabin, getAllCabins } = require ("../controllers/cabin.controllers");
const {createNewAdminCabin} = require("../controllers/adminCabin.controllers");

// Crear nuevo contacto
router.post("/contacto", createNewContact);
// Obtener todos los contactos
router.get("/contactos", getAllContacts);

// Crear nuevo payment
router.post("/payment", createNewPayment);
// Obtener todos los payment
router.get("/payments", getAllPayments);

// Crear nuevo reservation
router.post("/reservation", createNewReservation);
router.get("/reservations", getAllReservations);
router.get("/reservations/fechas", getReservedDates);

router.post("/reservationCabin", createNewReservationCabin);
router.get("/reservationCabins", getAllReservationCabins);

router.post("/cabin", createNewCabin);
router.get("/cabins", getAllCabins);

router.post("/admin/cabin", createNewAdminCabin);
router.get("/admin/cabin", getAllCabins);

module.exports = {router};
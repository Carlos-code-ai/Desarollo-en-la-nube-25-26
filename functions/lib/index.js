"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const axios_1 = require("axios");
admin.initializeApp();
exports.sendEmailOnBooking = (0, firestore_1.onDocumentCreated)("reservas/{reservaId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const data = snapshot.data();
    const ownerId = data.ownerId;
    const renterId = data.renterId;
    const suitId = data.suitId;
    const db = admin.firestore();
    try {
        // Get owner, renter, and suit data
        const ownerDoc = await db.collection("users").doc(ownerId).get();
        const renterDoc = await db.collection("users").doc(renterId).get();
        const suitDoc = await db.collection("suits").doc(suitId).get();
        if (!ownerDoc.exists || !renterDoc.exists || !suitDoc.exists) {
            console.error("Could not find owner, renter, or suit");
            return;
        }
        const ownerData = ownerDoc.data();
        const renterData = renterDoc.data();
        const suitData = suitDoc.data();
        if (!ownerData || !renterData || !suitData) {
            console.error("Data is missing");
            return;
        }
        const ownerEmail = ownerData.email;
        const renterName = renterData.name;
        const renterEmail = renterData.email;
        const suitName = suitData.name;
        const startDate = data.startDate;
        const endDate = data.endDate;
        const emailJsData = {
            service_id: "service_plqoo8i",
            template_id: "template_w94l9ye",
            user_id: "16yAgr8u_5pjdLuJw",
            template_params: {
                to_email: ownerEmail,
                name: renterName,
                email: renterEmail,
                suit_name: suitName,
                start_date: startDate,
                end_date: endDate,
            },
        };
        await axios_1.default.post("https://api.emailjs.com/api/v1.0/email/send", emailJsData);
        console.log("Email sent successfully to:", ownerEmail);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
//# sourceMappingURL=index.js.map
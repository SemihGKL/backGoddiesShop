const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

//pour les tests faire en sorte qu'il fait plus de 320 et moins de 6
//Plus voir les notes

const InvoiceSchema = new mongoose.Schema({
    price: {
        type: String
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users'
    },
    products: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Products'
    },
    quantity: {
        type: Number
    },
    date: {
        type: Date, default: Date.now
    }
})

module.exports = mongoose.model.Invoices || mongoose.model("Invoices", InvoiceSchema);
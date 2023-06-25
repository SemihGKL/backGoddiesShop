const { Double, Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

//pour les tests faire en sorte qu'il fait plus de 320 et moins de 6
//Plus voir les notes

const ProductSchema = new mongoose.Schema({
    name: {
        type: String
    },
    status: {
        type: String
    },
    quantityReel: {
        type: Number
    },
    quantityReserve: {
        type: Number
    },
    description: {
        type: String
    },
    picture: {
        data: Buffer
    },
    price: {
        type: String
    },
    category: {
        type: String
    }
})

module.exports = mongoose.model.Products || mongoose.model("Products", ProductSchema);
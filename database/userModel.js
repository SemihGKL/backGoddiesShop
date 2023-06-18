const mongoose = require("mongoose");

//pour les tests faire en sorte qu'il fait plus de 320 et moins de 6
//Plus voir les notes

const UserSchema = new mongoose.Schema({
    email: {
        type: String
    },
    pwd: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    adress: {
        type: String
    },
    phone: {
        type: Number
    },
    isActive: {
        type: Boolean
    }
})

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
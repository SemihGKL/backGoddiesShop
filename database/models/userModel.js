const mongoose = require("mongoose");

//pour les tests faire en sorte qu'il fait plus de 320 et moins de 6
//Plus voir les notes

const UserSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
          validator: async function (value) {
            const count = await this.model('Users').countDocuments({ email: value });
            return count === 0; // Renvoie true si l'email est unique, false sinon
          },
            message: 'Adresse e-mail déjà utilisée.'
        }
    },
    pwd: {
        type: String,
        required: true,
        validate: {
            validator: function (password) {
                // Vérification de la longueur minimale
                if (password.length < 8) {
                  return false;
                }
                // Vérification de la présence d'une lettre majuscule
                if (!/[A-Z]/.test(password)) {
                  return false;
                }
                // Vérification de la présence d'une lettre minuscule
                if (!/[a-z]/.test(password)) {
                  return false;
                }
                // Vérification de la présence d'un chiffre
                if (!/[0-9]/.test(password)) {
                  return false;
                }
                // Vérification de la présence d'un caractère spécial
                if (!/[!-_+=@#$%^&*]/.test(password)) {
                  return false;
                }
                return true; // Mot de passe valide
              },
              message: 'Le mot de passe ne respecte pas les règles.'
            }
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        validate : {
          validator: function (phone) {
            const regex = /^(0|\+33)[1-9](\d{2}){4}$/;
            if (regex.test(phone)) {
              return true;
            } else {
              return false;
            }
          }
        },
        message: 'Le numéro de téléphone ne respecte pas les règles.'
    },
    role: {
        type: Number, default: 2
    },
    isActive: {
        type: Boolean, default: true
    }
})

// Middleware pour hacher le mot de passe avant la sauvegarde
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
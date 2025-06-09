import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// create a custom method 'matchPassword' on the userSchema which can be used to compare passwords.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // returns true or false
};

// Pre-save hook to hash the password before saving the user
userSchema.pre("save", async function (next) {
  // If the password field hasn't changed (e.g., updating email), skip hashing and continue.
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
  this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
  next(); // Proceed to the next middleware or save operation
});

const User = mongoose.model("User", userSchema);

export default User;

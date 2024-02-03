import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cpassword: {
    type: String,
    required: true
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email
      },
      process.env.SECRET,
      {
        expiresIn: "5m"
      }
    );

    this.tokens = this.tokens.concat({ token: token });
    await this.save()
    return token;
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("User", UserSchema);

export default User;

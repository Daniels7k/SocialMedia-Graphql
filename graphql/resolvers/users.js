const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validateRegisterInput } = require("../../utils/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

module.exports = {
  Mutation: {
    async register(
      parent,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // Validing user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new Error(JSON.stringify(errors));
      }

      // Verify if username exist
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("Username already exists");
      }

      //  Password hash
      password = await bcrypt.hash(password, 12);

      // Save user
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();

      // Generate token
      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};

const User = require("../../models/users/userModel");
const { hashPassword, comparePasswords } = require("../../utils/hashPassword");
const generateAuthToken = require("../../utils/generateAuthToken");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

const generateRandomClientId = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let clientId = "";
  for (let i = 0; i < 6; i++) {
    clientId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return clientId;
};

const registerUser = async (req, res, next) => {
  try {
    const { client_name, client_status, email, password } = req.body;

    if (!(client_name && client_status && email && password)) {
      return res.status(400).send("All inputs are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await hashPassword(password);
    const client_id = generateRandomClientId();

    const user = await User.create({
      client_id: client_id,
      client_name: client_name,
      client_status: client_status,
      email: email.toLowerCase(),
      role: "viewer",
      password: hashedPassword,
      created_data: new Date().toISOString(),
    });

    const authToken = generateAuthToken(
      user._id,
      user.client_id,
      user.client_name,
      user.email,
      user.role
    );

    res.cookie("access_token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      success: "User created",
      userCreated: {
        _id: user._id,
        client_id: user.client_id,
        client_name: user.client_name,
        client_status: user.client_status,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { client_name, password, doNotLogout } = req.body;
    if (!(client_name && password)) {
      return res.status(400).send("All inputs are required");
    }

    const user = await User.findOne({ client_name });
    if (user && comparePasswords(password, user.password)) {
      let cookieParams = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };

      if (doNotLogout) {
        cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }; // 1000=1ms
      }

      return res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.client_id,
            user.client_name,
            user.email,
            user.role
          ),
          cookieParams
        )
        .json({
          success: "user logged in",
          userLoggedIn: {
            _id: user._id,
            client_id: user.client_id,
            client_name: user.client_name,
            email: user.email,
            role: user.role,
            doNotLogout,
          },
        });
    } else {
      return res.status(401).send("wrong credentials");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, registerUser, loginUser };

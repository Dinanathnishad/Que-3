const Model = require("../model/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRegister = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      user_name,
      email,
      password,
      confirm_password,
    } = req.body;
    console.log(req.body);

    const oldUser = await Model.UserData.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await Model.UserData.create({
      first_name,
      last_name,
      user_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    const data = await user.save();
    const response = {
      first_name: data.first_name,
      last_name: data.last_name,
      user_name: data.user_name,
      email: data.email,
      token: data.token,
    };
    res.status(201).json(response);
  } catch (err) {
    res.send(err.message);
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).send("email input is required");
    }
    if (!password) {
      res.status(400).send("email input is required");
    }
    const user = await Model.UserData.findOne({ email });
    if (await Model.UserData.findOne({ email: req.body.email })) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

//Get Method for user.
const getUserData = async (req, res) => {
  try {
    const getUser = await Model.UserData.find({}).sort({ _id: 1 });
    res.send(getUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

//delete operation for user data
const deleteUserData = async (req, res) => {
  try {
    const getUser = await Model.AddressSchema.findByIdAndDelete(req.params._id);
    res.send(getUser);
  } catch (error) {
    response.status(500).send(error);
  }
};

//Here we are  getting user and address Data with both using populate.
const userDataAndAddress = async (req, res, next) => {
  const data = await Model.UserData.find().populate("address");

  res.send(data).catch((err) => {
    res.status(500).json({
      error: err,
    });
  });
};
var ObjectID = require("mongodb").ObjectID;
const { response } = require("express");

const userAddress = async (req, res) => {
  try {
    const data = await Model.UserData.find().populate("address");
    const { user_id, address, city, state, mobile_no, pin } = req.body;
    const addressInfo = new Model.AddressSchema(req.body);

    // in curlybrace we will  assecc user_id after that address id
    const userData = await Model.UserData.findOneAndUpdate(
      { _id: ObjectID(user_id) },
      { address: addressInfo._id }
    );
    const addressData = await addressInfo.save();
    res.send(addressData);
  } catch (e) {
    res.send(e);
  }
};

module.exports = {
  userAddress,
  userDataAndAddress,
  userLogin,
  userRegister,
  getUserData,
  deleteUserData,
};

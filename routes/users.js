const express = require("express");
const router = express.Router();
const userController = require("../controller/user_controller");
const registerValidation = require("../validation/registerValidation");
const auth = require("../middleware/auth");

router.post("/register", registerValidation, userController.userRegister);
router.post("/login", userController.userLogin);
router.post("/address", userController.userAddress, auth);
router.get("/address_user", userController.userDataAndAddress);
router.delete("/userDelete/:id", userController.deleteUserData);

module.exports = router;

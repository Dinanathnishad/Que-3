const registerValidate = (req, res, next) => {
  const {
    first_name,
    last_name,
    user_name,
    email,
    password,
    confirm_password,
  } = req.body;
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (emailRegexp.test(email) == false) {
    throw new Error("email is not valid");
  }
  if (password !== confirm_password) {
    throw new Error("password is not matching");
  }
  if (!email) {
    throw new Error("email is required");
  }
  if (!first_name) {
    throw new Error("first_name is required");
  }
  if (!password) {
    throw new Error("password is required");
  }
  if (!last_name) {
    throw new Error("last_name is required");
  }
  if (!user_name) {
    throw new Error("user_name is required");
  }
  if (!(email && password && first_name && last_name && user_name)) {
    throw new Error("All input is required");
  }

  next();
};
module.exports = registerValidate;

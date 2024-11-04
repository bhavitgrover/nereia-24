const router = require("express").Router();
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("register", { error: "" });
});

router.post("/", async (req, res) => {
  const { email, password, fname, lname } = req.body;
  const foundUser = await User.findOne({ email });
  if (!email || !password || !fname || !lname) {
    return res.render("register", {
      error: "Please enter all the credentials.",
    });
  }
  if (foundUser) {
    return res.render("register", {
      error:
        "A user with this username already exists. Please enter a unique username.",
    });
  }
  const newUser = new User({
    email: email,
    fname: fname,
    lname: lname,
    role: "normal",
    password: await bcrypt.hash(password, 10),
  });
  await newUser.save();
  return res.redirect("/login");
});

module.exports = router;

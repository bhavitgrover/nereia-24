const router = require("express").Router();
const User = require("../schemas/userSchema");
const Researcher = require("../schemas/researcherSchema");
const Diver = require("../schemas/diverSchema");

router.get("/", async (req, res) => {
  res.render("joinTeam", { user: req.user });
});

router.post("/", async (req, res) => {
  const { role } = req.body;

  await User.findOneAndUpdate({ _id: req.user._id }, { $set: { role: role } });
  if (role === "researcher") {
    const newResearcher = new Researcher({
      userId: req.user._id,
    });
    await newResearcher.save();
  } else {
    const newDiver = new Diver({
      userId: req.user._id,
    });
    await newDiver.save();
  }
  console.log("added role to user");
  res.redirect("/join");
});

module.exports = router;

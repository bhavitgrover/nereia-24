const router = require("express").Router();

router.get("/", async (req, res) => {
  res.render("joinTeam", { user: req.user });
});

module.exports = router;

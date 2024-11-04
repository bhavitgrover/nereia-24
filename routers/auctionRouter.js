const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("auction");
});

module.exports = router;

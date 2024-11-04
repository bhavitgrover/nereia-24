const router = require("express").Router();
const Items = require('../schemas/auctionSchema.js')
const { ensureRole } = require('../utils/authenticate.js')

router.get("/:id", async (req, res) => {
  const item = await Items.findOne({_id:req.params.id})
  console.log(item)
  res.render("auction", { title: "Auction", user: req.user, item });
});

router.post("/:id/buy", async (req, res) => {
  const item = await Items.findOne({_id:req.params.id})
  console.log("BODUYDYDYDYD", req.body)
  item.highestBidder = req.user.email
  item.biddingPrice += Number(req.body.bid)
  await item.save()
  res.redirect(`/auction/${req.params.id}`)
})

module.exports = router;

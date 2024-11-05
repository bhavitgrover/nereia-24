const router = require("express").Router();
const Items = require('../schemas/auctionSchema.js')
const { ensureRole } = require('../utils/authenticate.js')

router.get("/:id", async (req, res) => {
  const item = await Items.findOne({_id:req.params.id})
  const currDate = Date.now()
  console.log(currDate)
  if(currDate - item.createdAt <= 20000 && item.live && !item.sold){
    console.log(item)
    res.render("auction", { title: "Auction", user: req.user, item, message:"true"});
  }
  else if(currDate - item.createdAt > 20000 || item.sold){
    item.live = false
    item.sold = true
    await item.save()
    res.render("auction", { title: "Auction", user: req.user, message:"This auction has ended!" });
  }
  else if(!item.live){
    res.render("auction", { title: "Auction", user: req.user, message:"This auction has not started yet!" });
  }
});

router.post("/:id/buy", async (req, res) => {
  const item = await Items.findOne({_id:req.params.id})
  console.log("BODUYDYDYDYD", req.body)
  item.highestBidder = req.user.email
  item.biddingPrice += Number(req.body.bid)
  item.createdAt = Date.now()
  await item.save()
  res.redirect(`/auction/${req.params.id}`)
})

module.exports = router;

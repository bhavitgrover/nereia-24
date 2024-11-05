const router = require("express").Router();
const Items = require('../schemas/auctionSchema.js')
const Users = require('../schemas/userSchema.js')
const Wallets = require('../schemas/walletSchema.js')
const { ensureRole } = require('../utils/authenticate.js')

router.get("/:id", async (req, res) => {
  const item = await Items.findOne({_id:req.params.id})
  const currDate = Date.now()
  const wallet = await Wallets.findOne({mongooseId:req.user._id})
  console.log(currDate)
  if(currDate - item.createdAt <= 20000 && item.live && !item.sold){
    console.log(item)
    res.render("auction", { title: "Auction", user: req.user, item, message:"true"});
  }
  else if(currDate - item.createdAt > 20000 || item.sold){
    item.live = false
    item.sold = true
    await item.save()
    const user = await Users.findOne({email:item.highestBidder})
    res.render("auction", { title: "Auction", user: req.user, message:`This auction has ended!${item.product} was sold to ${user.fname}` });
  }
  else if(!item.live){
    res.render("auction", { title: "Auction", user: req.user, message:"This auction has not started yet!" });
  }
});

router.post("/:id/buy", async (req, res) => {
  const item = await Items.findOne({_id:req.params.id})
  const wallet = await Wallets.findOne({mongooseId:req.user._id})
  if(wallet.money < item.biddingPrice){
    res.send(`gareeb sale paise ni h tujhpe 😠😠 bas ${wallet.money} nerit h tujhpe :joycat:`)
  }
  else{
    item.highestBidder = req.user.email
    item.biddingPrice += Number(req.body.bid)
    item.createdAt = Date.now()
    await item.save()
    res.redirect(`/auction/${req.params.id}`)
  }
})
//JAB KHARIDEGA TO PASIE KAM KAR CHUTIYE
module.exports = router;

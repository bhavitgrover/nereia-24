const router = require('express').Router();
const SOS = require('../schemas/sosSchema');

router.get('/', async (req, res) => {
    const reqSOS = await SOS.findOne({userId: req.user.id})

    async function setProgress(progress, sosId) {
        console.log(progress)
        console.log(await SOS.findOne({ _id: sosId }))
        await SOS.findOneAndUpdate({ _id: sosId }, {$set: { progress }});
    }
    
    if (reqSOS) {
        const now = new Date();
        const createdAt = new Date(reqSOS.createdAt);
        const diffMins = Math.floor((now - createdAt) / (1000 * 60));
        console.log(diffMins);

        if (diffMins >= 5) {
            await SOS.deleteOne({ _id: reqSOS._id });
        } else if (diffMins >= 4) {
            setProgress('SOS received successfully.', reqSOS._id);
        } else if (diffMins >= 3) {
            setProgress('SOS is looking for you.', reqSOS._id);
        } else if (diffMins >= 2) {
            setProgress('SOS about to reach.', reqSOS._id);
        } else if (diffMins >= 1) {
            setProgress('SOS is on its way.', reqSOS._id);
        }
    }
    res.render('sos', { user: req.user, sos: reqSOS });
});

router.post('/', async (req, res) => {
    const newSOS = new SOS({
        userId: req.user.id,
        progress: 'SOS is dispatched.'
    });
    await newSOS.save();
    res.redirect('/sos');
});

router.post('/delete', async (req,res) => {
    await SOS.deleteOne({userId: req.user.id})
    res.redirect('/sos')
})

module.exports = router;
require('dotenv').config();
const router = require('express').Router();

router.post('/', async (req, res) => {
    function googleKoMaro(prompt) {
        return new Promise((resolve, reject) => {
            fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "contents": [{
                        "parts": [{
                            "text": prompt
                        }]}
                    ]})
            })
            .then(rawResponse => {
                if (!rawResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                return rawResponse.json();
            })
            .then(content => {
                console.log(content);
                if (content.candidates[0].finishReason == "MAX_TOKENS") {
                    text.innerText = "The service is unavailable right now. Please try again after a minute or so.";
                }
                console.log(content.candidates[0].content.parts[0].text);
                resolve(content.candidates[0].content.parts[0].text);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                reject(error);
            });
        });
    }

    await googleKoMaro(req.body.prompt)
    .then(response => {
        console.log(response)
        return res.json({response, success: true});
    }).catch(error => {
        console.log(error)
        return res.json({error});
    })
});

module.exports = router;
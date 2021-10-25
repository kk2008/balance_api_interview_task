const express = require('express');
const app = express();
app.use(express.json());

app.use('/', require('./api'));
app.use('**', (req, res) => res.status(404).send());

const http = require('http').createServer(app);
const port = 3000;
http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
module.exports = http;
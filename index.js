const express = require('express')
const webPush = require('web-push')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();

//set static path
app.use(express.static(path.join(__dirname, 'client')))

app.use(bodyParser.json())

const publicVapidKey =
    'BCmvMP2Pj5h95J6yVnVghsvYz87cx-TvCvnLlSi96Ba_nTf3U9ZQBMeSXKD6g8DolPo1xOHbb55LpzrkL6OOnwY';
const privateVapidkey = '7Dc4lA-uXrOyK512e9j85zO11WHYwj3mBu8hN7sQH1w';

webPush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidkey)

//Subscribe to route

app.post('/subscribe', (req, res) => {
    //get subscription object
    const subscription = req.body;

    //send 201- resource created
    res.status(201).json({});


    //create a payload
    const payload = JSON.stringify({ title: 'Push Test' });

    // pass object to sendNotification
    webPush.sendNotification(subscription, payload).catch(err => console.log(err));



})

const Port = 5000;

app.listen(Port, () => {
    console.log(`Server is running on port:${Port}`)
})
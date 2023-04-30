const express = require('express')
//const getLabelsFromPhoto = require("./API/visionApi");
const FormData = require('form-data');
const fetch = require('node-fetch');
const translateText = require("./API/translationApi");
const synthesize = require('./API/textToSpeechApi');
const app = express()
const cors = require('cors');
const multer = require('multer');
//const { ReadResult } = require('@azure/cognitiveservices-computervision/esm/models/mappers');
const upload = multer();
// const uploadPhoto = require("./API/functionApi");
require('dotenv').config();

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.post('/what-is', upload.single('photo'), async (req, res) => {
    const photo = req.file.buffer;
    const language = req.body.language;
    const photoUrl = "https://www.rd.com/wp-content/uploads/2020/01/GettyImages-1131335393-e1650030686687.jpg";
    // const labels = await getLabelsFromPhoto(photoUrl);
    const labels = [
        'sky',      
        'jet',       
        'airplane', 
        'transport', 
        'aircraft',  
        'day'
    ];

    for (let i = 0; i < labels.length; i++) {
        labels[i] = await translateText(labels[i], language);
    }

    uploadPhoto(req, labels);

    res.send(labels);
});

function uploadPhoto(req, labels) {
    let form = new FormData();
    form.append('photo', req.file.buffer, req.file.originalname);

    fetch('https://uploadphotos.azurewebsites.net/api/HttpTrigger1', {method: 'POST', body: form})
    .then(res => {
        return res.json();
    })
    .then(result => {
        if(!result.hasOwnProperty('photoLink')) {
            return;
        }
        
        const body = {
            link: result.photoLink,
            labels: labels
        }

        fetch('https://uploadphotos.azurewebsites.net/api/HttpTrigger2?code=0rsQVu5uKj0Zb_D0TsByq4wPQK4ecwjodTk0kEAJzClTAzFukJMGiw==', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            }, 
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(result => {
            console.log(result);
        });
    });
}

app.get('/speech', async (req, res) => {
    const text = req.query.text;
    const audio = await synthesize(text);
    res.send(audio);
});

app.listen(8081, '0.0.0.0',()=>{
    console.log("Server is listening on port 8081");
})
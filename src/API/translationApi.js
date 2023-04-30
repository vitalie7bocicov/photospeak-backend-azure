require('dotenv').config();

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const key = process.env.TRANSLATOR_API_KEY;
const endpoint = process.env.TRANSLATOR_ENDPOINT;

let location = "germanywestcentral";

const translateText = (text, language) => {
    return new Promise((resolve, reject) => {
        axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': '3.0',
                'from': 'en',
                'to': [language]
            },
            data: [{
                'text': text
            }],
            responseType: 'json'
        }).then(response => {
            const translatedText = response.data[0].translations[0].text;
            resolve(translatedText);
        }).catch(error => {
            reject(error);
        });
    });
};

module.exports = translateText;



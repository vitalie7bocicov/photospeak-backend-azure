const { ComputerVisionClient } = require("@azure/cognitiveservices-computervision");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
const fs = require("fs");

require('dotenv').config();
const VISION_API_KEY = process.env.VISION_API_KEY;
const VISION_ENDPOINT =  process.env.VISION_ENDPOINT;

const credentials = new CognitiveServicesCredentials(VISION_API_KEY);
const client = new ComputerVisionClient(credentials, VISION_ENDPOINT);

async function getLabelsFromPhoto(photoUrl) {
    try {
        const result = await client.describeImage(photoUrl, { maxCandidates: 10 });
        return result.tags;
    } catch (error) {
        console.log("ERROR IN getLabelsFromPhoto: " + error);
    }
}

module.exports = getLabelsFromPhoto

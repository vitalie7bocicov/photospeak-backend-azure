const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");

require('dotenv').config();
const SPEECH_API_KEY = process.env.SPEECH_API_KEY;
const SPEECH_ENDPOINT =  process.env.SPEECH_ENDPOINT;

async function synthesize(text) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_API_KEY, 'germanywestcentral');
  speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

  const audioStream = await new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(text, result => {
      const audioData = result.audioData.slice(0, result.audioData.byteLength);
      resolve(audioData);
      synthesizer.close();
    }, error => {
      console.error(error);
      synthesizer.close();
      reject(error);
    });
  });


  return audioStream;
}

module.exports = synthesize;
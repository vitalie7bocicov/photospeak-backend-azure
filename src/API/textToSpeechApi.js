const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const Stream = require("stream");

require("dotenv").config();
const SPEECH_API_KEY = process.env.SPEECH_API_KEY;
const SPEECH_ENDPOINT = process.env.SPEECH_ENDPOINT;

async function synthesize(text) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    SPEECH_API_KEY,
    "germanywestcentral"
  );
  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

  const bufferStream = await new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      text,
      (result) => {
        const { audioData } = result;
        speechSynthesizer.close();
        const bufferStream = new Stream.PassThrough();
        bufferStream.end(Buffer.from(audioData));
        resolve(bufferStream);
      },
      (error) => {
        console.log(error);
        speechSynthesizer.close();
        reject(error);
      }
    );
  });

  return bufferStream;
}

module.exports = synthesize;

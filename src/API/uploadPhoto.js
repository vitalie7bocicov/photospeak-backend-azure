const FormData = require("form-data");
const fetch = require("node-fetch");

function uploadPhoto(req){
    let form = new FormData();
    form.append('photo', req.file.buffer, req.file.originalname);
    return new Promise(resolve => {
        fetch('https://uploadphotos.azurewebsites.net/api/HttpTrigger1', {method: 'POST', body: form})
            .then(res => {
                return resolve(res.json());
            });
    })
}

module.exports = uploadPhoto;


const fetch = require("node-fetch");

function populateDb(photoUrl, labels) {
    const body = {
        link: photoUrl,
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
}

module.exports = populateDb
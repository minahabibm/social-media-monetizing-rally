global.atob = require("atob");
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = 8080;
const folderName = 'storage'

app.use(cors());

app.get('/', (req, res) => {
    res.send("Jet Fuel Server");
});

app.get('/download/', (req, res) => {
    const encodedUrl = req.query.url;
    var decodedUrl = atob(encodedUrl);

    return axios.get(decodedUrl, {responseType: 'blob'})
        .then((response) => {
            res.send(response.data);
        }).catch(function (error) {
            console.log(error);
        });
});

app.get('/stream-safari/', (req, res) => {
    try { // handle file download
        const encodedUrl = req.query.url;
        const decodedUrl = atob(encodedUrl);
        let pathname = new URL(decodedUrl).pathname;
        let pathnameArr = pathname.split('/');
        let fileName = pathnameArr[pathnameArr.length - 1].replace('%', '_');
        var filePathDir = folderName + '/' + fileName
        if (!fs.existsSync(filePathDir)) {
            const filePath = fs.createWriteStream(filePathDir);
            axios.get(decodedUrl, {responseType: 'stream'}).then(response => response.data.pipe(filePath)).catch(err => console.log("err"));
        }
    } catch (err) {
        console.log(err)
    }

    console.log(filePathDir)

    res.send("ok")
});

app.listen(PORT, () => {
    try {
        if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName)
        }
    } catch (err) {
        console.error(err)
    }
    console.log(`Server running at: http://localhost:${PORT}/`);
});

const removefldr = () => {
    fs.rmdirSync(folderName, { recursive: true }, (err) => {
        if (err) { throw err; }
        console.log(`${folderName} is deleted!`);
        }
    );
}
const handleShutdownGracefully = () => {
    console.info("\nhandle server files...");
    removefldr();
    process.exit(1);
}

process.on("SIGINT", handleShutdownGracefully);
process.on("SIGTERM", handleShutdownGracefully);

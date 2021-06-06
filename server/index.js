global.atob = require("atob");
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = 8080;
const folderName = 'storage'

app.use(cors());
// app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send("Social Media Monetizing Rally Server");
});

app.get('/download/', (req, res) => {
    const encodedUrl = req.query.url;
    var decodedUrl = atob(encodedUrl);

    console.log("Requested to Download " + decodedUrl);
    return axios.get(decodedUrl, {responseType: 'arraybuffer'})
        .then((response) => {
            res.send(response.data);
        }).catch(function (error) {
            console.log(error);
        });
});

app.get('/stream-safari/', (req, res) => {
    // Handle File Download For Stream.
    let getFilePromise = new Promise(function(resolve, reject) {
        try { 
            const encodedUrl = req.query.url;
            const decodedUrl = atob(encodedUrl);
            let pathname = new URL(decodedUrl).pathname;
            let pathnameArr = pathname.split('/');
            var fileName = pathnameArr[pathnameArr.length - 1].replace('%', '_');
            var filePathDir = folderName + '/' + fileName
            if (!fs.existsSync(filePathDir)) {
                const filePath = fs.createWriteStream(filePathDir);
                axios
                    .get(decodedUrl, {responseType: 'stream'})
                    .then(response => {
                        response.data.pipe(filePath);
                        let error = null;
                        filePath.on('error', err => {
                            error = err;
                            writer.close();
                            reject(err);
                        });
                        filePath.on('close', () => {
                            if (!error) {
                              resolve([fileName, filePathDir]);
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err);
                        
                    });
            }else {
                resolve([fileName, filePathDir]);
            }
        } catch (err) {
            console.log(err);
            reject(err);
           
        }
    });

    // Stream the Video
    getFilePromise.then(([fileName, filePathDir]) => {
        console.log("Stream for Video " + fileName);
        try {
            const options = {};
            let start;
            let end;
    
            const range = req.headers.range;
            if (range) {
                const bytesPrefix = "bytes=";
                if (range.startsWith(bytesPrefix)) {
                    const bytesRange = range.substring(bytesPrefix.length);
                    const parts = bytesRange.split("-");
                    if (parts.length === 2) {
                        const rangeStart = parts[0] && parts[0].trim();
                        if (rangeStart && rangeStart.length > 0) {
                            options.start = start = parseInt(rangeStart);
                        }
                        const rangeEnd = parts[1] && parts[1].trim();
                        if (rangeEnd && rangeEnd.length > 0) {
                            options.end = end = parseInt(rangeEnd);
                        }
                    }
                }
            }
    
            res.setHeader("content-type", "video/mp4");
            fs.stat(filePathDir, (err, stat) => {
                if (err) {
                    console.error(`File stat error for ${filePathDir}.`);
                    console.error(err);
                    res.sendStatus(500);
                    return;
                }
    
                let contentLength = stat.size;
        
                if (req.method === "HEAD") {
                    res.statusCode = 200;
                    res.setHeader("accept-ranges", "bytes");
                    res.setHeader("content-length", contentLength);
                    res.end();
                }
                else {       
                    let retrievedLength;
                    if (start !== undefined && end !== undefined) {
                        retrievedLength = (end+1) - start;
                    }
                    else if (start !== undefined) {
                        retrievedLength = contentLength - start;
                    }
                    else if (end !== undefined) {
                        retrievedLength = (end+1);
                    }
                    else {
                        retrievedLength = contentLength;
                    }
        
                    res.statusCode = start !== undefined || end !== undefined ? 206 : 200;
        
                    res.setHeader("content-length", retrievedLength);
        
                    if (range !== undefined) {  
                        res.setHeader("content-range", `bytes ${start || 0}-${end || (contentLength-1)}/${contentLength}`);
                        res.setHeader("accept-ranges", "bytes");
                    }
        
                    // Listing 7.
                    const fileStream = fs.createReadStream(filePathDir, options);
                    fileStream.on("error", error => {
                        console.log(`Error reading file ${filePathDir}.`);
                        console.log(error);
                        res.sendStatus(500);
                    });
        
                    fileStream.pipe(res);
                }
            })
        } catch(err) {
            console.log(err)
        }
    })

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

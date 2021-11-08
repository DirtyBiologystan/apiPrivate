const https = require("https");

module.exports = async (date) =>
  new Promise((resolve, reject) => {
    console.log(`https://api-flag.fouloscopie.com/flag/after/${date}`);
    https.get(
      `https://api-flag.fouloscopie.com/flag/after/${date}`,
      (reqToFoulo) => {
        reqToFoulo.setEncoding("utf8");
        reqToFoulo.on("error", (err) => {
          reject(err);
        });
        let rawData = "";
        reqToFoulo.on("data", (chunk) => {
          rawData += chunk;
        });
        reqToFoulo.on("end", () => {
          let parsedData;
          try {
            parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            console.log(rawData);
            reject(e);
            return;
          }
        });
      }
    );
  });

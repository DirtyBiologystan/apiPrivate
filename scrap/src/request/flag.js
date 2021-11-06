const https = require("https");

module.exports = async () =>
  new Promise((resolve, reject) => {
    https.get(`https://api-flag.fouloscopie.com/flag`, (reqToFoulo) => {
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
    });
  });

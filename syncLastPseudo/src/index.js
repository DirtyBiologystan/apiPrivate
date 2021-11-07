const mongooseReq = require("mongoose");
const https = require("https");
(async () => {
  let mongoose = await mongooseReq.connect("mongodb://mongo/drapeau");

  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;
  model = mongoose.model(
    "Pixels",
    new Schema({
      x: { type: Number, index: true },
      y: { type: Number, index: true },
      indexInFlag: { type: Number, unique: true },
      index: { type: Number, unique: true },
      hexColor: { type: String, index: true },
      author: { type: String, index: true },
      pseudo: { type: String, index: true },
    })
  );

  const datas = await model.find({ pseudo: { $exists: false } });
  console.log(datas);
  await datas.reduce(async (accu, data) => {
    await accu;
    return new Promise((resolve, reject) => {
      https.get(
        `https://admin.fouloscopie.com/users/${data.author}`,
        (reqToFoulo) => {
          reqToFoulo.setEncoding("utf8");
          reqToFoulo.on("error", (err) => {
            reject(err);
          });
          if (reqToFoulo.statusCode === 403) {
            data.pseudo = "";
            resolve(data.save());
          } else {
            let rawData = "";
            reqToFoulo.on("data", (chunk) => {
              rawData += chunk;
            });
            reqToFoulo.on("end", () => {
              try {
                let parsedData;
                parsedData = JSON.parse(rawData);
                console.log(parsedData);
                data.pseudo = parsedData.data.last_name;
                resolve(data.save());
              } catch (e) {
                console.log(e);
                console.log(rawData);
                reject(e);
                return;
              }
            });
          }
        }
      );
    });
  }, Promise.resolve());

  await mongoose.disconnect();
  console.log("finish");
})();

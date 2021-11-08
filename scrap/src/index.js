const mongooseReq = require("mongoose");

const init = require("./function/init");
const interval = require("./function/interval");
const time = 5000;

const tick = async (data) => {
  try {
    setTimeout(tick, time, await interval(data));
  } catch (e) {
    console.log(e);
  }
};

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
    })
  );
  let data = await init(model);

  setTimeout(tick, time, await interval(data));
})().catch(console.error);

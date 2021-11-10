const departements = require("../data/departements.json");
const regions = require("../data/regions.json");
const redis = require("../services/redis");

module.exports = async (mongoose) => {
  const Schema = mongoose.Schema;
  const model = mongoose.model(
    "Departements",
    new Schema({
      name: String,
      region: String,
      region_discord: String,
      discord: String,
      min: {
        x: { type: Number, index: true },
        y: { type: Number, index: true },
      },
      max: {
        x: { type: Number, index: true },
        y: { type: Number, index: true },
      },
    })
  );
  const lock = await redis.set("lock", "1", "EX", "10", "NX");
  if (lock) {
    await model.deleteMany({});
    await model.syncIndexes();
    await Promise.all(
      departements.map(async (departement) => {
        let region = regions.find((region) => {
          return region.départements.indexOf(departement.name) !== -1;
        });
        if (!region) {
          region = { name: departement.name, };
        }
        return new model({ ...departement, region: region.name ,region_discord:region.discord}).save();
      })
    );
  }
  return model;
};

const redis = require("../services/redis");
const flag = require("../request/flag");
const calculAll = require("./calculAll");

module.exports = async (model) => {
  let date = await redis.get("time");
  if (!date) {
    let flagDatas;

    date = new Date().toISOString();
    console.log(date,"init data")

    flagDatas = await flag();
    const coordonne = calculAll(flagDatas.length, 0.5);
    await model.bulkWrite(
      flagDatas.map((flagData, i) => ({
        insertOne: {
          document: {
            ...flagData,
            ...coordonne[i],
            index: i,
          },
        },
      }))
    );
    await redis.set("time", date);
    return {
      countPixel: flagDatas.length,
      lastIndexInFlag: flagDatas[flagDatas.length - 1].indexInFlag,
      date,
      model,
    };
  } else {
    let { indexInFlag: lastIndexInFlag } = await model
      .findOne({}, { indexInFlag: true })
      .sort({ indexInFlag: -1 });
    return {
      countPixel: await model.countDocuments(),
      lastIndexInFlag,
      date,
      model,
    };
  }
};

const redis = require("../services/redis");
const flagAfter = require("../request/flagAfter");
const calculOne = require("./calculOne");

module.exports = async ({ countPixel, lastIndexInFlag, date, model }) => {
  console.log("entri",{ countPixel, lastIndexInFlag, date, model })
  let flagDatas = await flagAfter(date);
  date = new Date().toISOString();
  if(!flagDatas.length){
    console.log(date,"no data change")
    await redis.set("time", date);

    return { countPixel, lastIndexInFlag, date, model };

  }
  flagDatas = flagDatas.map((flagData) => {
    if (lastIndexInFlag < flagData.indexInFlag) {
      countPixel++;
      lastIndexInFlag = flagData.indexInFlag;
      return {
        insertOne: {
          document: {
            ...flagData,
            ...calculOne(countPixel),
            index: countPixel-1,
          },
        },
      };
    }
    return {
      updateOne: {
        filter: {
          indexInFlag: flagData.indexInFlag,
        },
        update: { $set: { hexColor: flagData.hexColor } },
      },
    };
  });
  const pBulk = model.bulkWrite(flagDatas);
  const pRedis = redis.set("time", date);

  console.log(await pBulk);
  await pRedis;
  console.log("sorti",{ countPixel, lastIndexInFlag, date, model })

  return { countPixel, lastIndexInFlag, date, model };
};

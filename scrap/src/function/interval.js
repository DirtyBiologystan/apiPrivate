const redis = require("../services/redis");
const io = require("../services/socket.io");
const flagAfter = require("../request/flagAfter");
const calculOne = require("./calculOne");

const roomNewPixel = io.to("newPixel");
const roomChange = io.to("changePixel");
const roomTotal = io.to("total");

module.exports = async ({ countPixel, lastIndexInFlag, date, model }) => {
  console.log("entri", { countPixel, lastIndexInFlag, date, model });
  let flagDatas = await flagAfter(date);
  date = new Date().toISOString();
  if (!flagDatas.length) {
    console.log(date, "no data change");
    await redis.set("time", date);

    return { countPixel, lastIndexInFlag, date, model };
  }

  flagDatas = await Promise.all(
    flagDatas.map(async (flagData) => {
      if (lastIndexInFlag < flagData.indexInFlag) {
        console.log("newPixel");
        const newPixel = {
          ...flagData,
          ...calculOne(countPixel + 1),
          index: countPixel,
        };
        countPixel++;
        roomNewPixel.emit("newPixel", newPixel);
        roomTotal.emit("total", countPixel);
        lastIndexInFlag = flagData.indexInFlag;
        return {
          insertOne: {
            document: newPixel,
          },
        };
      }
      const sockets = await roomNewPixel.allSockets();
      if (!sockets.length) {
        roomNewPixel.emit(
          "changePixel",
          await model.findOne(
            { indexInFlag: flagData.indexInFlag },
            { _id: false }
          )
        );
      }
      return {
        updateOne: {
          filter: {
            indexInFlag: flagData.indexInFlag,
          },
          update: { $set: { hexColor: flagData.hexColor } },
        },
      };
    })
  );
  const pBulk = model.bulkWrite(flagDatas);
  const pRedis = redis.set("time", date);

  console.log(await pBulk);
  await pRedis;
  console.log("sorti", { countPixel, lastIndexInFlag, date, model });

  return { countPixel, lastIndexInFlag, date, model };
};

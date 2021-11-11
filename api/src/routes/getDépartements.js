const models = require("../services/models");
const typeReturn = require("../constante/typeReturn");

Object.assign(module.exports, {
  regex: /^\/departements\/$/,
  method: "GET",
  typeReturn: typeReturn.OBJECT,
  handler: async (url, data) => {
    let départements;
    if (data.x && data.y) {
      départements = await models["Departements"].find(
        {
          "min.x": { $lte: data.x },
          "min.y": { $lte: data.y },
          "max.x": { $gte: data.x },
          "max.y": { $gte: data.y },
        },
        { name: true, region: true, _id: false, discord: true }
      );
    } else {
      départements = await models["Departements"].find(
        {},
        {
          name: true,
          region: true,
          max: true,
          min: true,
          _id: false,
          discord: true,
        }
      );
    }

    return départements;
  },
});

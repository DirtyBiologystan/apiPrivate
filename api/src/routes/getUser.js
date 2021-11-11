const redis = require("../services/redis");
const https = require("https");
const typeReturn = require("../constante/typeReturn");

Object.assign(module.exports, {
  regex: /^\/users\/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/,
  method: "GET",
  typeReturn: typeReturn.STRING,
  handler: async (url) => {
    const uuid = url[1];
    const user = await redis.get(uuid);
    if (user) {
      return user;
    } else {
      return new Promise((resolve, reject) => {
        https.get(
          `https://admin.fouloscopie.com/users/${uuid}`,
          (reqToFoulo) => {
            reqToFoulo.setEncoding("utf8");
            reqToFoulo.on("error", (err) => {
              reject(err);
            });
            if (reqToFoulo.statusCode === 403) {
              redis.set(uuid, `{"last_name":"","id":"${uuid}"}`);
              resolve(`{"last_name":"","id":"${uuid}"}`);
            } else {
              let rawData = "";
              reqToFoulo.on("data", (chunk) => {
                rawData += chunk;
              });
              reqToFoulo.on("end", () => {
                try {
                  let parsedData;
                  parsedData = JSON.parse(rawData);
                  resolve(
                    `{"last_name":"${parsedData.data.last_name}","id":"${uuid}"}`
                  );
                  redis.set(
                    uuid,
                    `{"last_name":"${parsedData.data.last_name}","id":"${uuid}"}`
                  );
                } catch (e) {
                  console.log(rawData);
                  reject(e);
                  return;
                }
              });
            }
          }
        );
      });
    }
  },
});

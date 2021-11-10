const models = require("../services/models");
const mongoose = require("../services/mongoose");
const client = require("../services/redis");

Object.assign(module.exports, {
  regex: /^\/status$/,
  method: "GET",
  handler: async (url, data) => {
    const test = await client.get("isUp");

    console.log(test)
    return {
      mongodb:(await mongoose()).connection.readyState === 1,
      redis:test==="true",
    }
  },
});

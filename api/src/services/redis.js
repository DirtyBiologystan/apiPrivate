const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient({
  host: "redis",
  db: 0,
});

client.get = promisify(client.get).bind(client);
client.set = promisify(client.set).bind(client);

client.on("connect", function () {
  client.set("isUp", true);
});

Object.assign(module.exports, client);

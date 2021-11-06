const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient({
  host: "redis",
  db: 1,
});

client.get = promisify(client.get).bind(client);
client.set = promisify(client.set).bind(client);

Object.assign(module.exports, client);

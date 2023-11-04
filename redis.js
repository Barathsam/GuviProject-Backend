const redis = require("redis");
require("dotenv").config();

const redisClient = () => {
  return redis.createClient();
};

const client = redisClient();
client.on("error", (err) => {
  console.log(err);
});
client.on("connect", (err) => {
  console.log("connected to redis");
});
client.on("end", (err) => {
  console.log("redis connection end");
});
client.on("SIGQUIT", (err) => {
  client.quit();
});

module.exports = client;

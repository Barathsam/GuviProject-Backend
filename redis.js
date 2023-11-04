const redis = require("redis");
require("dotenv").config();

const redisClient = () => {
  return redis.createClient({
    url: "rediss://red-cl36ekauuipc7387rco0:SBOrUaReFZPeaVvlM7V7Dc5C4JSGeCKT@oregon-redis.render.com:6379",
  });
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

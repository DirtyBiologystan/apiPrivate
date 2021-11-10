const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILD],
});

const axios = require('axios');
let lastStatus=false;

const checkStatus = async (channel_log)=>{
  try {
    const status = (await axios.get("https://api.codati.ovh/status")).data;

    if(!(status.mongodb && status.redis)){
      lastStatus=false;
      await channel_log.send(`<@313834354755239948> api is down! mongdb:${status.mongodb},redis:${status.redis}`);

    }else{
      if(!lastStatus){
        await channel_log.send(`<@313834354755239948> api is up!`);
      }
      lastStatus=true;
    }
  } catch (e) {
    lastStatus=false;
    await channel_log.send(`<@313834354755239948> api is down!`);

  }
}


(async()=>{
  await new Promise((resolve)=>{

    console.log(process.env.TOKEN)
    client.on("ready", () => {
      resolve();
    });
    client.login(process.env.TOKEN);

  })
  const guild = await client.guilds.fetch("905133291185774633");
  const channel_log = await guild.channels.cache.get("907963180842643486");
  setInterval(checkStatus,60000,undefined,channel_log);
  checkStatus(channel_log)

})().then(console.log,console.error)
